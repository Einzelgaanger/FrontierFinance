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

    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate a password reset link using admin API (bypasses Auth rate limits)
    let { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: {
        redirectTo: 'https://frontierfinance.org/reset-password',
      }
    })

    // If user not found in auth, check user_profiles and auto-create auth account
    if (linkError && linkError.message?.includes('User with this email not found')) {
      console.log('User not found in auth, checking user_profiles for:', email)
      
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('id, email, company_name, full_name')
        .ilike('email', email.trim())
        .maybeSingle()

      if (profile) {
        console.log('Found profile, syncing auth user for:', profile.email, 'with ID:', profile.id)
        
        // First try to update existing auth user's email (handles ID exists but email mismatch)
        const { error: updateError } = await supabase.auth.admin.updateUserById(profile.id, {
          email: profile.email,
          email_confirm: true,
        })

        if (updateError) {
          console.log('Update failed (user may not exist in auth), trying to create:', updateError.message)
          // User doesn't exist in auth at all - create them
          const tempPassword = `CFF_${crypto.randomUUID().slice(0, 12)}!`
          const { error: createError } = await supabase.auth.admin.createUser({
            id: profile.id,
            email: profile.email,
            password: tempPassword,
            email_confirm: true,
            user_metadata: {
              company_name: profile.company_name,
              full_name: profile.full_name,
            },
          })

          if (createError) {
            console.error('Error creating auth user:', createError)
            return new Response(
              JSON.stringify({ success: true, message: 'If an account exists with this email, a password reset link has been sent.' }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
          }
        } else {
          console.log('Auth user email updated to match profile for:', profile.email)
        }

        // Retry generating the reset link now that the auth user exists
        console.log('Auth user created, retrying reset link generation for:', profile.email)
        const retryResult = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: profile.email,
          options: {
            redirectTo: 'https://frontierfinance.org/reset-password',
          }
        })
        linkData = retryResult.data
        linkError = retryResult.error
        
        if (linkError) {
          console.error('Error generating reset link after creating user:', linkError)
          return new Response(
            JSON.stringify({ success: true, message: 'If an account exists with this email, a password reset link has been sent.' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      } else {
        console.log('Email not found in user_profiles either:', email)
        return new Response(
          JSON.stringify({ success: true, message: 'If an account exists with this email, a password reset link has been sent.' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    } else if (linkError) {
      console.error('Error generating reset link:', linkError)
      return new Response(
        JSON.stringify({ success: true, message: 'If an account exists with this email, a password reset link has been sent.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!linkData?.properties?.action_link) {
      console.error('No action_link returned from generateLink')
      return new Response(
        JSON.stringify({ success: true, message: 'If an account exists with this email, a password reset link has been sent.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // The action_link from generateLink points to the Supabase Auth server
    // which will verify the token and redirect to our reset-password page
    const resetLink = linkData.properties.action_link

    // Send reset email via Resend (no Supabase Auth rate limits)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const resend = new Resend(resendApiKey)
    const rawFrom = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@frontierfinance.org'
    const senderEmail = (rawFrom.match(/<([^>]+)>/)?.[1] || rawFrom).trim()
    const fromAddress = `Collaborative For Frontier Finance <${senderEmail}>`

    const resetHtml = `
      <div style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;padding:24px;">
        <div style="max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#0f1d2e;padding:28px;text-align:center;"><img <div style="background:#0f1d2e;padding:28px;text-align:center;"><img src="https://frontierfinance.org/CFF%20LOGO.png" alt="Collaborative For Frontier Finance" width="160" height="64" /></div> alt="Collaborative For Frontier Finance" width="160" height="64" /></div>
          <div style="height:4px;background:#c49a2b;"></div>
          <div style="padding:28px;">
            <h1 style="margin:0 0 12px;color:#0f1d2e;font-size:24px;">Reset Your Password</h1>
            <p style="margin:0 0 20px;color:#1a1a2e;line-height:1.6;">We received a request to reset your Collaborative For Frontier Finance password. Click the button below to set a new password.</p>
            <a href="${resetLink}" style="display:inline-block;background:#c49a2b;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:8px;font-weight:700;">Reset My Password</a>
            <p style="margin:20px 0 0;color:#5a5a6e;font-size:13px;word-break:break-all;">If the button does not work, copy this link: ${resetLink}</p>
            <p style="margin:16px 0 0;color:#5a5a6e;font-size:13px;">If you did not request a password reset, please ignore this email. This link will expire in 1 hour.</p>
          </div>
        </div>
      </div>`

    const { error: emailError } = await resend.emails.send({
      from: fromAddress,
      to: [email],
      subject: 'Collaborative For Frontier Finance - Password Reset Request',
      html: resetHtml,
    })

    if (emailError) {
      console.error('Resend error sending reset email:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send reset email. Please try again.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Password reset email sent via Resend to:', email)

    return new Response(
      JSON.stringify({ success: true, message: 'Password reset email sent. Please check your inbox.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in request-password-reset:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
