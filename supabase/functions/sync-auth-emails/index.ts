import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify caller is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    const token = authHeader.replace('Bearer ', '');
    const { data: { user: caller } } = await supabase.auth.getUser(token);
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Check admin role
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', caller.id).single();
    if (!roleData || roleData.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get all user_profiles with their emails
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profiles')
      .select('id, email, company_name, full_name')
      .not('email', 'is', null);

    if (profilesError) {
      return new Response(JSON.stringify({ error: profilesError.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get all auth users
    const allAuthUsers: any[] = [];
    let page = 1;
    const perPage = 1000;
    while (true) {
      const { data: { users }, error } = await supabase.auth.admin.listUsers({ page, perPage });
      if (error) break;
      allAuthUsers.push(...users);
      if (users.length < perPage) break;
      page++;
    }

    const authEmailSet = new Set(allAuthUsers.map(u => u.email?.toLowerCase()));
    const authIdSet = new Set(allAuthUsers.map(u => u.id));

    const results = {
      total_profiles: profiles?.length || 0,
      already_in_auth: 0,
      created_in_auth: 0,
      id_exists_email_mismatch: 0,
      errors: [] as { email: string; error: string }[],
      mismatches: [] as { id: string; profile_email: string; auth_email: string }[],
    };

    for (const profile of profiles || []) {
      if (!profile.email) continue;
      const profileEmailLower = profile.email.toLowerCase().trim();

      // Check if auth user exists by ID
      if (authIdSet.has(profile.id)) {
        const authUser = allAuthUsers.find(u => u.id === profile.id);
        if (authUser?.email?.toLowerCase() === profileEmailLower) {
          results.already_in_auth++;
        } else {
          // ID exists but email differs - update auth email to match profile
          results.id_exists_email_mismatch++;
          results.mismatches.push({
            id: profile.id,
            profile_email: profile.email,
            auth_email: authUser?.email || 'unknown',
          });
          // Update auth email to match profile
          const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, {
            email: profile.email,
            email_confirm: true,
          });
          if (updateError) {
            results.errors.push({ email: profile.email, error: `Update failed: ${updateError.message}` });
          }
        }
      } else if (authEmailSet.has(profileEmailLower)) {
        // Email exists under different ID - skip, just note it
        results.already_in_auth++;
      } else {
        // Need to create auth user with matching ID
        const tempPassword = `CFF_${crypto.randomUUID().slice(0, 12)}!`;
        const { error: createError } = await supabase.auth.admin.createUser({
          id: profile.id,
          email: profile.email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            company_name: profile.company_name,
            full_name: profile.full_name,
          },
        });

        if (createError) {
          // Try without specifying ID
          const { error: createError2 } = await supabase.auth.admin.createUser({
            email: profile.email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
              company_name: profile.company_name,
              full_name: profile.full_name,
            },
          });
          if (createError2) {
            results.errors.push({ email: profile.email, error: createError2.message });
          } else {
            results.created_in_auth++;
          }
        } else {
          results.created_in_auth++;
        }
      }
    }

    console.log('Sync results:', JSON.stringify(results));

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Sync error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
