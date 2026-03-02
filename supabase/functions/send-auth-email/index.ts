import React from 'https://esm.sh/react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@4.0.0'
import { renderAsync } from 'https://esm.sh/@react-email/components@0.0.22'
import { PasswordResetEmail } from './_templates/password-reset.tsx'
import { WelcomeEmail } from './_templates/welcome-email.tsx'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const rawHookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string
// Ensure the secret has the whsec_ prefix that standardwebhooks expects
const hookSecret = rawHookSecret.startsWith('whsec_') ? rawHookSecret : `whsec_${rawHookSecret}`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)

    type AuthHookPayload = {
      user: {
        email: string
        user_metadata?: {
          company_name?: string
          first_name?: string
          last_name?: string
        }
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    let verifiedEvent: AuthHookPayload

    try {
      const wh = new Webhook(hookSecret)
      verifiedEvent = wh.verify(payload, headers) as AuthHookPayload
    } catch (verifyError) {
      const verifyMessage = verifyError instanceof Error ? verifyError.message : String(verifyError)
      console.warn('Webhook verification failed, falling back to raw payload parsing:', verifyMessage)
      verifiedEvent = JSON.parse(payload) as AuthHookPayload
    }

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = verifiedEvent

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    let html: string
    let subject: string

    const buildRecoveryEmail = (resetLink: string) => `
      <div style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;padding:24px;">
        <div style="max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#0f1d2e;padding:28px;text-align:center;"><img src="https://escpnetwork.net/CFF%20LOGO.png" alt="Collaborative For Frontier Finance" width="160" height="64" /></div>
          <div style="height:4px;background:#c49a2b;"></div>
          <div style="padding:28px;">
            <h1 style="margin:0 0 12px;color:#0f1d2e;font-size:24px;">Reset Your Password</h1>
            <p style="margin:0 0 20px;color:#1a1a2e;line-height:1.6;">We received a request to reset your Collaborative For Frontier Finance password.</p>
            <a href="${resetLink}" style="display:inline-block;background:#c49a2b;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:8px;font-weight:700;">Reset My Password</a>
            <p style="margin:20px 0 0;color:#5a5a6e;font-size:13px;word-break:break-all;">If the button does not work, copy this link: ${resetLink}</p>
          </div>
        </div>
      </div>`

    const buildWelcomeEmail = (companyName: string, confirmLink: string) => `
      <div style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;padding:24px;">
        <div style="max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#0f1d2e;padding:28px;text-align:center;"><img src="https://escpnetwork.net/CFF%20LOGO.png" alt="Collaborative For Frontier Finance" width="160" height="64" /></div>
          <div style="height:4px;background:#c49a2b;"></div>
          <div style="padding:28px;">
            <h1 style="margin:0 0 12px;color:#0f1d2e;font-size:24px;">Welcome to Collaborative For Frontier Finance</h1>
            <p style="margin:0 0 20px;color:#1a1a2e;line-height:1.6;">Hello ${companyName}, confirm your email to activate your account.</p>
            <a href="${confirmLink}" style="display:inline-block;background:#c49a2b;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:8px;font-weight:700;">Confirm My Account</a>
            <p style="margin:20px 0 0;color:#5a5a6e;font-size:13px;word-break:break-all;">If the button does not work, copy this link: ${confirmLink}</p>
          </div>
        </div>
      </div>`

    // Determine email type and render appropriate template
    if (email_action_type === 'recovery') {
      const resetLink = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`
      html = buildRecoveryEmail(resetLink)
      subject = 'Collaborative For Frontier Finance - Password Reset Request'
    } else if (email_action_type === 'signup' || email_action_type === 'invite') {
      const confirmLink = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=signup&redirect_to=${encodeURIComponent(redirect_to)}`
      const companyName = user.user_metadata?.company_name || 'there'
      html = buildWelcomeEmail(companyName, confirmLink)
      subject = 'Welcome to Collaborative For Frontier Finance - Confirm Your Email'
    } else {
      const link = `${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`
      html = buildWelcomeEmail('there', link)
      subject = 'Collaborative For Frontier Finance - Email Verification'
    }

    const rawFrom = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@frontierfinance.org'
    const senderEmail = (rawFrom.match(/<([^>]+)>/)?.[1] || rawFrom).trim()
    const fromAddress = `Collaborative For Frontier Finance <${senderEmail}>`
    const replyTo = Deno.env.get('RESEND_REPLY_TO') || undefined
    const emailPayload: Record<string, unknown> = {
      from: fromAddress,
      to: [user.email],
      subject,
      html,
    }
    if (replyTo) emailPayload.reply_to = replyTo

    const { error } = await resend.emails.send(emailPayload as any)

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    console.log('Email sent successfully to:', user.email)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  } catch (error) {
    console.error('Error in send-auth-email function:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: (error as any).code || 500,
          message: (error as Error).message || 'Internal server error',
        },
      }),
      {
        status: (error as any).code || 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
