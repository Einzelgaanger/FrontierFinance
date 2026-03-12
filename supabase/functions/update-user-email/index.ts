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

    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', caller.id).single();
    if (!roleData || roleData.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { userId, newEmail, companyName, fullName, description, website, profilePhotoUrl } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Get current profile to detect email change
    const { data: currentProfile } = await supabase
      .from('user_profiles')
      .select('email')
      .eq('id', userId)
      .single();

    const emailChanged = currentProfile && newEmail && currentProfile.email?.toLowerCase() !== newEmail.toLowerCase();

    // Update user_profiles
    const updatePayload: Record<string, any> = {};
    if (newEmail !== undefined) updatePayload.email = newEmail;
    if (companyName !== undefined) updatePayload.company_name = companyName;
    if (fullName !== undefined) updatePayload.full_name = fullName;
    if (description !== undefined) updatePayload.description = description;
    if (website !== undefined) updatePayload.website = website;
    if (profilePhotoUrl !== undefined) updatePayload.profile_picture_url = profilePhotoUrl;

    const { error: profileError } = await supabase
      .from('user_profiles')
      .update(updatePayload)
      .eq('id', userId);

    if (profileError) {
      return new Response(JSON.stringify({ error: `Profile update failed: ${profileError.message}` }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // If email changed, also update auth.users
    let authUpdated = false;
    let authError = null;
    if (emailChanged && newEmail) {
      const { error: authUpdateError } = await supabase.auth.admin.updateUserById(userId, {
        email: newEmail,
        email_confirm: true, // Auto-confirm so they can log in immediately
      });

      if (authUpdateError) {
        authError = authUpdateError.message;
        console.error('Auth email update error:', authUpdateError);
      } else {
        authUpdated = true;
        console.log(`Auth email updated for ${userId}: ${currentProfile?.email} -> ${newEmail}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      emailChanged,
      authUpdated,
      authError,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update user email error:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
