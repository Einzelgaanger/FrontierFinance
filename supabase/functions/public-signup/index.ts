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

    // Block signups from company domains that already exist in the database
    const genericDomains = new Set([
      'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
      'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.co.in',
      'aol.com', 'icloud.com', 'me.com', 'mac.com',
      'protonmail.com', 'proton.me', 'pm.me',
      'zoho.com', 'zohomail.com', 'yandex.com', 'mail.com', 'gmx.com', 'gmx.net',
      'tutanota.com', 'tutamail.com', 'fastmail.com',
      'mail.ru', 'inbox.com', 'email.com', 'usa.com',
      'consultant.com', 'europe.com', 'asia.com', 'post.com',
    ])

    const emailDomain = email.toLowerCase().split('@')[1]
    if (emailDomain && !genericDomains.has(emailDomain)) {
      // Check if any existing user_profiles already use this company domain
      const { data: domainMatches } = await supabase
        .from('user_profiles')
        .select('email')
        .ilike('email', `%@${emailDomain}`)
        .limit(1)

      if (domainMatches && domainMatches.length > 0) {
        return new Response(
          JSON.stringify({
            error: `An account from your organization (@${emailDomain}) already exists in our system. Please use the search tool on the signup page to find available company emails, then sign in using "Forgot Password." If you no longer have access to that email and need your data transferred to a different company email, please contact developer@frontierfinance.org.`
          }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Create user with admin API - email_confirm: false so they must verify email first
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
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
        role: 'viewer'
      })

    if (roleError && !roleError.message?.includes('duplicate')) {
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

    // Generate email confirmation link via admin API (bypasses rate limits)
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      password: password,
      options: {
        redirectTo: 'https://frontierfinance.org/auth'
      }
    })

    if (linkError) {
      console.error('Error generating confirmation link:', linkError)
      // User was created but we couldn't send confirmation - still report success
    }

    // Send confirmation email via Resend
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY')
      if (resendApiKey && linkData?.properties?.action_link) {
        const resend = new Resend(resendApiKey)
        const rawFrom = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@frontierfinance.org'
        const senderEmail = (rawFrom.match(/<([^>]+)>/)?.[1] || rawFrom).trim()
        const fromAddress = `Collaborative For Frontier Finance <${senderEmail}>`
        const displayName = company_name || first_name || email.split('@')[0]
        const confirmLink = linkData.properties.action_link

        const confirmHtml = `
          <div style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;padding:24px;">
            <div style="max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
              <div style="background:#0f1d2e;padding:28px;text-align:center;"><img src="https://escpnetwork.net/CFF%20LOGO.png" alt="Collaborative For Frontier Finance" width="160" height="64" /></div>
              <div style="height:4px;background:#c49a2b;"></div>
              <div style="padding:28px;">
                <h1 style="margin:0 0 12px;color:#0f1d2e;font-size:24px;">Confirm Your Email</h1>
                <p style="margin:0 0 20px;color:#1a1a2e;line-height:1.6;">Hello ${displayName}, thank you for signing up for Collaborative For Frontier Finance. Please confirm your email address by clicking the button below.</p>
                <a href="${confirmLink}" style="display:inline-block;background:#c49a2b;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:8px;font-weight:700;">Confirm Email Address</a>
                <p style="margin:20px 0 0;color:#5a5a6e;font-size:13px;">If you did not create this account, please ignore this email.</p>
                <p style="margin:12px 0 0;color:#5a5a6e;font-size:11px;">Or copy and paste this link: ${confirmLink}</p>
              </div>
            </div>
          </div>`

        await resend.emails.send({
          from: fromAddress,
          to: [email],
          subject: 'Collaborative For Frontier Finance - Confirm Your Email Address',
          html: confirmHtml,
        })
        console.log('Confirmation email sent via Resend to:', email)
      } else {
        console.warn('Missing RESEND_API_KEY or action_link, could not send confirmation email')
      }
    } catch (emailErr) {
      console.error('Failed to send confirmation email (non-blocking):', emailErr)
    }

    return new Response(
      JSON.stringify({
        success: true,
        requires_confirmation: true,
        user: {
          id: userId,
          email: newUser.user.email,
          email_confirmed: false
        },
        message: 'Account created! Please check your email to confirm your account before signing in.'
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
