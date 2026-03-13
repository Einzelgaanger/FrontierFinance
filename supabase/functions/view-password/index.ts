import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { token } = await req.json();
    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Find the password link
    const { data: link, error: fetchError } = await supabase
      .from('password_links')
      .select('*')
      .eq('token', token)
      .single();

    if (fetchError || !link) {
      return new Response(JSON.stringify({ error: 'Invalid or expired link' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if already used
    if (link.is_used) {
      return new Response(JSON.stringify({ error: 'This link has already been used. The password was shown only once.' }), {
        status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if expired
    if (new Date(link.expires_at) < new Date()) {
      return new Response(JSON.stringify({ error: 'This link has expired.' }), {
        status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Mark as used immediately
    await supabase
      .from('password_links')
      .update({ is_used: true, viewed_at: new Date().toISOString() })
      .eq('id', link.id);

    return new Response(JSON.stringify({
      success: true,
      password: link.encrypted_password,
      email: link.user_email,
      message: 'This password is shown only once. Please save it securely.'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in view-password:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
