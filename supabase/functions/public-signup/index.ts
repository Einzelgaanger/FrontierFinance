import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'
import { Resend } from 'https://esm.sh/resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { email, password, first_name, last_name, company_name } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const userExists = (existingUsers?.users as any[])?.some((u: any) => u.email?.toLowerCase() === email.toLowerCase())
    
    if (userExists) {
      return new Response(
        JSON.stringify({ error: 'An account with this email already exists. Please sign in instead.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create user with admin API - email_confirm: true bypasses email confirmation
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: first_name || '',
        last_name: last_name || '',
        company_name: company_name || '',
        created_via: 'public_signup',
        created_at: new Date().toISOString()
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!newUser?.user) {
      return new Response(
        JSON.stringify({ error: 'User creation failed - no user data returned' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = newUser.user.id

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: email,
        company_name: company_name || first_name || email.split('@')[0]
      })

    if (profileError && !profileError.message.includes('duplicate')) {
      console.error('Error creating user profile:', profileError)
    }

    // Assign default viewer role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        email: email,
        role: 'viewer'
      })

    if (roleError && !roleError.message.includes('duplicate')) {
      console.error('Error assigning role:', roleError)
    }

    // Create profile entry (if profiles table exists)
    try {
      const { error: profilesError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          first_name: first_name || email.split('@')[0],
          last_name: last_name || 'User'
        })

      if (profilesError && !profilesError.message.includes('duplicate')) {
        console.error('Error creating profile:', profilesError)
      }
    } catch (err) {
      console.log('Profiles table not available or error:', err)
    }

    // Send welcome email via Resend (bypasses Supabase Auth rate limits)
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY')
      if (resendApiKey) {
        const resend = new Resend(resendApiKey)
        const rawFrom = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@frontierfinance.org'
        const fromAddress = rawFrom.includes('<') ? rawFrom : `CFF Network <${rawFrom}>`
        const displayName = company_name || first_name || email.split('@')[0]

        const welcomeHtml = `
          <div style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;padding:24px;">
            <div style="max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <div style="background:#0f1d2e;padding:28px;text-align:center;"><img src="https://escpnetwork.net/CFF%20LOGO.png" alt="CFF Network" width="160" height="64" /></div>
              <div style="height:4px;background:#c49a2b;"></div>
              <div style="padding:28px;">
                <h1 style="margin:0 0 12px;color:#0f1d2e;font-size:24px;">Welcome to CFF Network!</h1>
                <p style="margin:0 0 20px;color:#1a1a2e;line-height:1.6;">Hello ${displayName}, your account has been created successfully. You can now sign in to access the CFF Network platform.</p>
                <a href="https://frontierfinance.org/auth" style="display:inline-block;background:#c49a2b;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:8px;font-weight:700;">Sign In Now</a>
                <p style="margin:20px 0 0;color:#5a5a6e;font-size:13px;">If you did not create this account, please ignore this email.</p>
              </div>
            </div>
          </div>`

        await resend.emails.send({
          from: fromAddress,
          to: [email],
          subject: 'Welcome to CFF Network - Your Account is Ready',
          html: welcomeHtml,
        })
        console.log('Welcome email sent via Resend to:', email)
      }
    } catch (emailErr) {
      console.error('Failed to send welcome email (non-blocking):', emailErr)
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userId,
          email: newUser.user.email,
          email_confirmed: true
        },
        message: 'Account created successfully! You can now sign in.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in public-signup:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
