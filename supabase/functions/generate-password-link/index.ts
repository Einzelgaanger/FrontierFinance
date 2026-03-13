import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function generateStrongPassword(length = 16): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const digits = '0123456789';
  const special = '!@#$%^&*()_+-=';
  const all = upper + lower + digits + special;
  
  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  
  // Ensure at least one of each type
  const password = [
    upper[arr[0] % upper.length],
    lower[arr[1] % lower.length],
    digits[arr[2] % digits.length],
    special[arr[3] % special.length],
  ];
  
  for (let i = 4; i < length; i++) {
    password.push(all[arr[i] % all.length]);
  }
  
  // Shuffle
  for (let i = password.length - 1; i > 0; i--) {
    const j = arr[i] % (i + 1);
    [password[i], password[j]] = [password[j], password[i]];
  }
  
  return password.join('');
}

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
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user: caller } } = await supabaseAuth.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', caller.id).single();
    const isAdmin = roleData?.role === 'admin';

    const { userId, userEmail } = await req.json();
    if (!userId || !userEmail) {
      return new Response(JSON.stringify({ error: 'userId and userEmail are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Allow admins OR primary account holders generating for their own team members
    if (!isAdmin) {
      const { data: memberRecord } = await supabase
        .from('company_members')
        .select('id')
        .eq('company_user_id', caller.id)
        .eq('member_user_id', userId)
        .maybeSingle();
      if (!memberRecord) {
        return new Response(JSON.stringify({ error: 'You can only generate password links for your own team members' }), {
          status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Generate a strong password
    const password = generateStrongPassword(18);

    // Update the user's password in auth
    const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
      password,
    });

    if (authError) {
      // Try to create the auth user if it doesn't exist
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('company_name, full_name')
        .eq('id', userId)
        .single();

      const { error: createError } = await supabase.auth.admin.createUser({
        id: userId,
        email: userEmail,
        password,
        email_confirm: true,
        user_metadata: {
          company_name: profile?.company_name,
          full_name: profile?.full_name,
        },
      });

      if (createError) {
        return new Response(JSON.stringify({ error: `Failed to set password: ${createError.message}` }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Store the password in password_links table (the password is stored temporarily)
    const token = crypto.randomUUID() + '-' + crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const { error: linkError } = await supabase
      .from('password_links')
      .insert({
        token,
        user_id: userId,
        user_email: userEmail,
        encrypted_password: password, // stored server-side, revealed once via view endpoint
        created_by: caller.id,
        expires_at: expiresAt,
      });

    if (linkError) {
      return new Response(JSON.stringify({ error: `Failed to create link: ${linkError.message}` }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Build the one-time view link
    const siteUrl = req.headers.get('origin') || 'https://frontierfinance.org';
    const viewLink = `${siteUrl}/view-password/${token}`;

    return new Response(JSON.stringify({
      success: true,
      link: viewLink,
      expiresAt,
      message: `Password link generated for ${userEmail}. The link can only be viewed once and expires in 24 hours.`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in generate-password-link:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
