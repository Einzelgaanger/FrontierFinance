import { Resend } from 'https://esm.sh/resend@4.0.0'

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
    const rawFromEmail = Deno.env.get('RESEND_FROM_EMAIL') || ''
    // Use a clean email if the secret is empty or malformed
    // Use a clean email if the secret is empty or malformed
    const fromEmail = rawFromEmail && rawFromEmail.includes('@') && !rawFromEmail.includes('<')
      ? `CFF Network <${rawFromEmail}>`
      : rawFromEmail && rawFromEmail.includes('<')
        ? rawFromEmail
        : 'CFF Network <noreply@frontierfinance.org>'

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured', success: false }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const resend = new Resend(resendApiKey)

    const {
      applicantName,
      vehicleName,
      email,
      organizationWebsite,
      location,
      roleJobTitle,
      typicalCheckSize,
      numberOfInvestments,
      amountRaisedToDate,
      howHeardAboutNetwork,
    } = await req.json()

    if (!applicantName || !email) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminEmails = ['alfred@frontierfinance.org', 'arnold@frontierfinance.org']

    const detailRow = (label: string, value: string) => value ? `
      <tr>
        <td style="padding:12px 16px;color:#5a5a6e;font-weight:600;width:40%;border-bottom:1px solid #f0f0f5;font-size:14px;">${label}</td>
        <td style="padding:12px 16px;color:#1a1a2e;border-bottom:1px solid #f0f0f5;font-size:14px;">${value}</td>
      </tr>` : ''

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>New Membership Application</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
</head>
<body style="background:#ffffff;margin:0;padding:40px 20px;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;">
    
    <!-- Navy Header -->
    <div style="background:#0f1d2e;padding:36px 40px 28px;text-align:center;">
      <img src="https://escpnetwork.net/CFF%20LOGO.png" width="160" height="64" alt="CFF Network" style="display:block;margin:0 auto;" />
    </div>
    
    <!-- Gold accent bar -->
    <div style="background:#c49a2b;height:4px;"></div>
    
    <!-- Alert banner -->
    <div style="background:#fefce8;padding:20px 40px;border-bottom:1px solid #fde68a;">
      <p style="color:#78350f;font-size:15px;margin:0;font-weight:600;text-align:center;">
        📋 New Membership Application Received
      </p>
    </div>
    
    <!-- Content -->
    <div style="padding:32px 40px;">
      <p style="color:#1a1a2e;font-size:15px;line-height:26px;margin:0 0 24px;">
        A new membership application has been submitted to the CFF Network and requires your review. Here are the details:
      </p>

      <!-- Applicant Details Card -->
      <div style="border:1px solid #e8e8ee;border-radius:10px;overflow:hidden;margin-bottom:28px;">
        <div style="background:#0f1d2e;padding:14px 16px;">
          <p style="color:#ffffff;font-size:14px;font-weight:700;margin:0;letter-spacing:0.3px;">APPLICANT DETAILS</p>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${detailRow('Name', applicantName)}
          ${detailRow('Email', email)}
          ${detailRow('Vehicle Name', vehicleName)}
          ${detailRow('Role / Job Title', roleJobTitle)}
          ${detailRow('Location', location)}
          ${detailRow('Website', organizationWebsite ? `<a href="${organizationWebsite}" style="color:#c49a2b;text-decoration:none;">${organizationWebsite}</a>` : '')}
          ${detailRow('Typical Check Size', typicalCheckSize)}
          ${detailRow('Number of Investments', numberOfInvestments)}
          ${detailRow('Amount Raised to Date', amountRaisedToDate)}
          ${detailRow('How They Heard About Us', howHeardAboutNetwork)}
        </table>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0 16px;">
        <a href="https://frontierfinance.org/admin" style="background:#c49a2b;color:#ffffff;padding:16px 40px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700;font-size:16px;letter-spacing:0.3px;box-shadow:0 2px 8px rgba(196,154,43,0.3);">
          Review Application →
        </a>
      </div>
      <p style="color:#5a5a6e;font-size:13px;text-align:center;margin:0;">
        Log in to the CFF Network admin dashboard to approve or reject this application.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8f9fa;padding:28px 40px;border-top:1px solid #e8e8ee;text-align:center;">
      <img src="https://escpnetwork.net/CFF%20LOGO.png" width="100" height="40" alt="CFF Network" style="display:block;margin:0 auto 12px;opacity:0.6;" />
      <p style="color:#0f1d2e;font-size:14px;font-weight:700;margin:0 0 4px;">Collaborative for Frontier Finance</p>
      <p style="color:#5a5a6e;font-size:12px;margin:0 0 12px;">Advancing MSME financing in Africa and the Middle East</p>
      <hr style="border:none;border-top:1px solid #e8e8ee;margin:0 0 12px;" />
      <p style="color:#999;font-size:11px;margin:0 0 4px;">© ${new Date().getFullYear()} CFF Network. All rights reserved.</p>
      <p style="color:#999;font-size:11px;margin:0;"><a href="https://frontierfinance.org" style="color:#c49a2b;text-decoration:none;">frontierfinance.org</a></p>
    </div>
  </div>
</body>
</html>`

    const { error: emailError } = await resend.emails.send({
      from: fromEmail.includes('<') ? fromEmail : `CFF Network <${fromEmail}>`,
      to: adminEmails,
      subject: `New Application: ${applicantName}${vehicleName ? ` — ${vehicleName}` : ''}`,
      html,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return new Response(
        JSON.stringify({ success: false, error: emailError.message }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Admin notification sent for new application from:', applicantName)

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in notify-admin-new-application:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error), success: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
