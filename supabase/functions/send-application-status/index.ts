import { Resend } from 'https://esm.sh/resend@4.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured', success: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const resend = new Resend(resendApiKey)

    const body = await req.json()
    const { applicationId, status, adminNotes, cooldownDate, testMode, email: directEmail, applicantName: directName, vehicleName: directVehicle } = body

    let applicantName: string
    let vehicleName: string
    let recipientEmail: string

    if (testMode && directEmail) {
      // Direct test mode - skip DB lookup
      applicantName = directName || 'Test Applicant'
      vehicleName = directVehicle || 'Test Vehicle'
      recipientEmail = directEmail
      console.log('Test mode: sending directly to', directEmail)
    } else {
      if (!applicationId || !status) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const supabaseUrl = Deno.env.get('SUPABASE_URL')!
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data: application, error: appError } = await supabase
        .from('applications')
        .select('user_id, email, company_name, applicant_name, vehicle_name')
        .eq('id', applicationId)
        .single()

      if (appError || !application) {
        console.error('Error fetching application:', appError)
        return new Response(
          JSON.stringify({ error: 'Application not found', success: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      applicantName = application.applicant_name || application.company_name || 'Applicant'
      vehicleName = application.vehicle_name || application.company_name || 'your vehicle'
      recipientEmail = application.email
    }
    const isApproved = status === 'approved'
    const cooldownFormatted = cooldownDate ? new Date(cooldownDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : null

    // Base HTML structure using CFF brand identity
    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Collaborative For Frontier Finance - Application ${isApproved ? 'Approved' : 'Update'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="background:#ffffff;margin:0;padding:40px 20px;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
    
    <!-- Navy Header -->
    <div style="background:#0f1d2e;padding:36px 40px 28px;text-align:center;">
      <img src="https://escpnetwork.net/CFF%20LOGO.png" width="160" height="64" alt="Collaborative For Frontier Finance" style="display:block;margin:0 auto;" />
    </div>
    
    <!-- Gold accent bar -->
    <div style="background:#c49a2b;height:4px;"></div>
    
    <!-- Content -->
    <div style="padding:40px 32px;">
      <h2 style="color:${isApproved ? '#059669' : '#dc2626'};margin:0 0 24px;font-size:20px;text-align:center;">
        ${isApproved ? '🎉 Congratulations! Your Application Has Been Approved' : '📋 Application Status Update'}
      </h2>
      
      <p style="color:#1a1a2e;font-size:16px;line-height:26px;margin:0 0 20px;">Dear ${applicantName},</p>
      
      ${isApproved ? `
        <p style="color:#1a1a2e;font-size:16px;line-height:26px;margin:0 0 20px;">
          We are delighted to inform you that your application for <strong>${vehicleName}</strong> to join the Collaborative For Frontier Finance Network has been <strong style="color:#059669;">approved</strong>!
        </p>
        <p style="color:#1a1a2e;font-size:16px;line-height:26px;margin:0 0 20px;">
          You now have full member access to our peer-to-peer learning network. Here's what you can do:
        </p>
        
        <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin:0 0 24px;">
          <p style="color:#92400e;font-size:14px;margin:0;line-height:20px;">
            <strong>⚠️ Important:</strong> To activate your new member access, please <strong>sign out</strong> and <strong>sign back in</strong> to your account.
          </p>
        </div>
        
        <ul style="color:#1a1a2e;font-size:15px;line-height:28px;margin:0 0 24px;padding-left:20px;">
          <li>Access the complete network directory of fund managers</li>
          <li>View detailed survey data and insights</li>
          <li>Participate in knowledge sharing and discussions</li>
          <li>Connect with peers for co-investment opportunities</li>
          <li>Contribute to our community resources</li>
        </ul>
      ` : `
        <p style="color:#1a1a2e;font-size:16px;line-height:26px;margin:0 0 20px;">
          Thank you for your interest in joining the Collaborative For Frontier Finance Network. After careful review, we regret to inform you that your application for <strong>${vehicleName}</strong> was not approved at this time.
        </p>
        ${cooldownFormatted ? `
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:0 0 20px;">
          <p style="color:#991b1b;font-size:14px;margin:0;line-height:20px;">
            <strong>⏳ Reapplication Period:</strong> You may submit a new application after <strong>${cooldownFormatted}</strong>.
          </p>
        </div>
        ` : ''}
      `}
      
      ${adminNotes ? `
        <div style="background:#f9fafb;border-left:4px solid ${isApproved ? '#059669' : '#f59e0b'};padding:16px 20px;margin:24px 0;border-radius:0 8px 8px 0;">
          <p style="color:#374151;font-weight:600;margin:0 0 8px;font-size:14px;">Message from our team:</p>
          <p style="color:#4b5563;font-size:14px;line-height:22px;margin:0;">${adminNotes}</p>
        </div>
      ` : ''}
      
      ${isApproved ? `
        <div style="text-align:center;margin:32px 0;">
          <a href="https://frontierfinance.org/dashboard" style="background:#c49a2b;color:#ffffff;padding:16px 40px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700;font-size:16px;letter-spacing:0.3px;box-shadow:0 2px 8px rgba(196,154,43,0.3);">
            Access Your Dashboard →
          </a>
        </div>
      ` : `
        <p style="color:#1a1a2e;font-size:16px;line-height:26px;margin:20px 0 0;">
          We encourage you to revisit your application based on the feedback provided and reapply when eligible. If you have questions, please don't hesitate to reach out.
        </p>
      `}
    </div>
    
    <!-- Footer -->
    <div style="background:#f8f9fa;padding:28px 40px;border-top:1px solid #e8e8ee;text-align:center;">
      <p style="color:#0f1d2e;font-size:14px;font-weight:700;margin:0 0 4px;">Collaborative For Frontier Finance</p>
      <p style="color:#5a5a6e;font-size:12px;margin:0 0 12px;">Advancing MSME financing in Africa and the Middle East</p>
      <hr style="border:none;border-top:1px solid #e8e8ee;margin:0 0 12px;" />
      <p style="color:#999;font-size:11px;margin:0 0 4px;">© ${new Date().getFullYear()} Collaborative For Frontier Finance. All rights reserved.</p>
      <p style="color:#999;font-size:11px;margin:0;"><a href="https://frontierfinance.org" style="color:#c49a2b;text-decoration:none;">frontierfinance.org</a></p>
    </div>
  </div>
</body>
</html>`

    const rawFromEmail = Deno.env.get('RESEND_FROM_EMAIL') || ''
    // Use a clean email format: "Name <email@domain.com>"
    const fromEmail = rawFromEmail && rawFromEmail.includes('@') && !rawFromEmail.includes('<')
      ? `Collaborative For Frontier Finance <${rawFromEmail}>`
      : rawFromEmail && rawFromEmail.includes('<')
        ? rawFromEmail.replace(/.*<(.+)>/, 'Collaborative For Frontier Finance <$1>') // Replace name part if exists
        : 'Collaborative For Frontier Finance <noreply@frontierfinance.org>'

    console.log('Sending email from:', fromEmail, 'to:', recipientEmail)

    const { error: emailError } = await resend.emails.send({
      from: fromEmail,
      to: [recipientEmail],
      subject: isApproved 
        ? '🎉 Welcome to Collaborative For Frontier Finance - Your Application Has Been Approved!' 
        : 'Collaborative For Frontier Finance - Application Status Update',
      html,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      // Return success false but 200 status so the main operation doesn't fail
      return new Response(
        JSON.stringify({ success: false, error: emailError.message }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      )
    }

    console.log('Application status email sent to:', recipientEmail, 'Status:', status)

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error) {
    console.error('Error in send-application-status function:', error)
    const message = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({ error: message, success: false }),
      {
        status: 200, // Always 200 so the client approval flow never sees 500
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
