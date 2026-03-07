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

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)
    const resend = new Resend(resendApiKey)

    // Check for test mode (manual trigger to send test email)
    const body = await req.json().catch(() => ({}))
    const isTest = body.testMode === true

    let pendingApps: Array<{
      id: string
      applicant_name: string | null
      vehicle_name: string | null
      email: string
      created_at: string
      location: string | null
      typical_check_size: string | null
    }> = []

    if (isTest) {
      // Use fake data for test
      pendingApps = [{
        id: 'test-id',
        applicant_name: 'Test Applicant',
        vehicle_name: 'Test Fund',
        email: 'test@example.com',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Nairobi, Kenya',
        typical_check_size: '$500K - $1M',
      }]
    } else {
      // Find applications that are still pending after 48 hours
      const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()

      const { data, error } = await supabase
        .from('applications')
        .select('id, applicant_name, vehicle_name, email, created_at, location, typical_check_size')
        .eq('status', 'pending')
        .lt('created_at', cutoff)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching pending applications:', error)
        return new Response(
          JSON.stringify({ error: error.message, success: false }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      pendingApps = data || []
    }

    if (pendingApps.length === 0) {
      console.log('No pending applications older than 48 hours')
      return new Response(
        JSON.stringify({ success: true, message: 'No pending applications to remind about', count: 0 }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${pendingApps.length} pending application(s) older than 48 hours`)

    const adminEmails = ['alfred@frontierfinance.org', 'arnold@frontierfinance.org']

    // Build application rows for the email
    const appRows = pendingApps.map((app) => {
      const submittedDate = new Date(app.created_at)
      const hoursAgo = Math.round((Date.now() - submittedDate.getTime()) / (1000 * 60 * 60))
      const daysAgo = Math.floor(hoursAgo / 24)
      const timeLabel = daysAgo >= 1 ? `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago` : `${hoursAgo} hours ago`

      return `
        <tr>
          <td style="padding:14px 16px;border-bottom:1px solid #f0f0f5;">
            <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#1a1a2e;">${app.applicant_name || 'Unknown'}</p>
            <p style="margin:0;font-size:13px;color:#5a5a6e;">${app.vehicle_name || 'No vehicle name'}</p>
          </td>
          <td style="padding:14px 16px;border-bottom:1px solid #f0f0f5;font-size:13px;color:#5a5a6e;">
            ${app.location || '—'}
          </td>
          <td style="padding:14px 16px;border-bottom:1px solid #f0f0f5;text-align:right;">
            <span style="display:inline-block;background:#fef3c7;color:#92400e;font-size:12px;font-weight:600;padding:4px 10px;border-radius:12px;">
              ${timeLabel}
            </span>
          </td>
        </tr>`
    }).join('')

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Pending Applications Reminder</title>
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
    
    <!-- Alert banner -->
    <div style="background:#fef3c7;padding:20px 40px;border-bottom:1px solid #fde68a;">
      <p style="color:#92400e;font-size:15px;margin:0;font-weight:600;text-align:center;">
        ⏰ Reminder: ${pendingApps.length} Application${pendingApps.length > 1 ? 's' : ''} Awaiting Review
      </p>
    </div>
    
    <!-- Content -->
    <div style="padding:32px 40px;">
      <p style="color:#1a1a2e;font-size:15px;line-height:26px;margin:0 0 8px;">
        Hi Team,
      </p>
      <p style="color:#1a1a2e;font-size:15px;line-height:26px;margin:0 0 24px;">
        The following membership application${pendingApps.length > 1 ? 's have' : ' has'} been pending for more than <strong>48 hours</strong> and ${pendingApps.length > 1 ? 'require' : 'requires'} your review:
      </p>

      <!-- Applications Table -->
      <div style="border:1px solid #e8e8ee;border-radius:10px;overflow:hidden;margin-bottom:28px;">
        <div style="background:#0f1d2e;padding:12px 16px;">
          <table style="width:100%;">
            <tr>
              <td style="color:#c49a2b;font-size:12px;font-weight:700;letter-spacing:0.5px;">APPLICANT</td>
              <td style="color:#c49a2b;font-size:12px;font-weight:700;letter-spacing:0.5px;">LOCATION</td>
              <td style="color:#c49a2b;font-size:12px;font-weight:700;letter-spacing:0.5px;text-align:right;">SUBMITTED</td>
            </tr>
          </table>
        </div>
        <table style="width:100%;border-collapse:collapse;">
          ${appRows}
        </table>
      </div>

      <!-- CTA Button -->
      <div style="text-align:center;margin:32px 0 16px;">
        <a href="https://frontierfinance.org/admin" style="background:#c49a2b;color:#ffffff;padding:16px 40px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:700;font-size:16px;letter-spacing:0.3px;box-shadow:0 2px 8px rgba(196,154,43,0.3);">
          Review Applications →
        </a>
      </div>
      <p style="color:#5a5a6e;font-size:13px;text-align:center;margin:0;">
        Log in to the admin dashboard to approve or reject pending applications.
      </p>
    </div>

    <!-- Footer -->
    <div style="background:#f8f9fa;padding:28px 40px;border-top:1px solid #e8e8ee;text-align:center;">
      <img src="https://escpnetwork.net/CFF%20LOGO.png" width="100" height="40" alt="Collaborative For Frontier Finance" style="display:block;margin:0 auto 12px;opacity:0.6;" />
      <p style="color:#0f1d2e;font-size:14px;font-weight:700;margin:0 0 4px;">Collaborative For Frontier Finance</p>
      <p style="color:#5a5a6e;font-size:12px;margin:0 0 12px;">Advancing MSME financing in Africa and the Middle East</p>
      <hr style="border:none;border-top:1px solid #e8e8ee;margin:0 0 12px;" />
      <p style="color:#999;font-size:11px;margin:0 0 4px;">© ${new Date().getFullYear()} Collaborative For Frontier Finance. All rights reserved.</p>
      <p style="color:#999;font-size:11px;margin:0;">
        <a href="https://frontierfinance.org" style="color:#c49a2b;text-decoration:none;">frontierfinance.org</a>
        &nbsp;·&nbsp;
        <span style="color:#bbb;">This is an automated reminder</span>
      </p>
    </div>
  </div>
</body>
</html>`

    const rawFromEmail = Deno.env.get('RESEND_FROM_EMAIL') || ''
    const fromEmail = rawFromEmail && rawFromEmail.includes('@')
      ? `Collaborative For Frontier Finance <${(rawFromEmail.match(/<([^>]+)>/)?.[1] || rawFromEmail).trim()}>`
      : 'Collaborative For Frontier Finance <noreply@frontierfinance.org>'

    const { error: emailError } = await resend.emails.send({
      from: fromEmail.includes('<') ? fromEmail : `Collaborative For Frontier Finance <${fromEmail}>`,
      to: adminEmails,
      subject: `⏰ Reminder: ${pendingApps.length} Pending Application${pendingApps.length > 1 ? 's' : ''} Awaiting Review`,
      html,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return new Response(
        JSON.stringify({ success: false, error: emailError.message }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Reminder sent for ${pendingApps.length} pending application(s)`)

    return new Response(
      JSON.stringify({ success: true, count: pendingApps.length }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in remind-pending-applications:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error), success: false }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
