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
    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'noreply@frontierfinance.org'

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

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>New Membership Application</title>
</head>
<body style="background:#f8f8fa;margin:0;padding:40px 20px;font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.07);overflow:hidden;">
    <div style="background:#1a1a1a;padding:32px;text-align:center;">
      <h1 style="color:#f5f5dc;margin:0;font-size:22px;letter-spacing:0.5px;">CFF Network</h1>
      <p style="color:#d4d4a8;margin:8px 0 0;font-size:14px;">New Membership Application</p>
    </div>
    <div style="padding:32px;">
      <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:24px;">
        <p style="color:#92400e;font-size:14px;margin:0;font-weight:600;">
          📋 A new membership application has been submitted and requires your review.
        </p>
      </div>

      <h2 style="color:#1a1a1a;font-size:18px;margin:0 0 16px;border-bottom:2px solid #f0f0f0;padding-bottom:8px;">Applicant Details</h2>
      
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;width:40%;border-bottom:1px solid #f3f4f6;">Name</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${applicantName}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">Email</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${email}</td>
        </tr>
        ${vehicleName ? `<tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">Vehicle Name</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${vehicleName}</td>
        </tr>` : ''}
        ${roleJobTitle ? `<tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">Role / Job Title</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${roleJobTitle}</td>
        </tr>` : ''}
        ${location ? `<tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">Location</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${location}</td>
        </tr>` : ''}
        ${organizationWebsite ? `<tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">Website</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;"><a href="${organizationWebsite}" style="color:#1a56db;">${organizationWebsite}</a></td>
        </tr>` : ''}
        ${typicalCheckSize ? `<tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">Typical Check Size</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${typicalCheckSize}</td>
        </tr>` : ''}
        ${numberOfInvestments ? `<tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">Number of Investments</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${numberOfInvestments}</td>
        </tr>` : ''}
        ${amountRaisedToDate ? `<tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">Amount Raised to Date</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${amountRaisedToDate}</td>
        </tr>` : ''}
        ${howHeardAboutNetwork ? `<tr>
          <td style="padding:8px 12px;color:#6b7280;font-weight:600;border-bottom:1px solid #f3f4f6;">How They Heard About Us</td>
          <td style="padding:8px 12px;color:#1a1a1a;border-bottom:1px solid #f3f4f6;">${howHeardAboutNetwork}</td>
        </tr>` : ''}
      </table>

      <div style="text-align:center;margin:32px 0 16px;">
        <a href="https://frontierfinance.org/admin/applications" style="background:#1a1a1a;color:#f5f5dc;padding:14px 32px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:15px;">
          Review Application →
        </a>
      </div>
      <p style="color:#9ca3af;font-size:12px;text-align:center;margin:0;">
        Log in to the CFF Network admin dashboard to approve or reject this application.
      </p>
    </div>
    <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
      <p style="color:#9ca3af;font-size:12px;line-height:18px;margin:0;text-align:center;">
        This is an automated notification from the CFF Network platform.
      </p>
    </div>
  </div>
</body>
</html>`

    const { error: emailError } = await resend.emails.send({
      from: `CFF Network <${fromEmail}>`,
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
