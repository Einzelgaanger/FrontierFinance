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

    const { applicationId, status, adminNotes, cooldownDate } = await req.json()

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

    const applicantName = application.applicant_name || application.company_name || 'Applicant'
    const vehicleName = application.vehicle_name || application.company_name || 'your vehicle'
    const isApproved = status === 'approved'
    const cooldownFormatted = cooldownDate ? new Date(cooldownDate).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : null

    const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>ESCP Network - Application ${isApproved ? 'Approved' : 'Update'}</title>
</head>
<body style="background:#f8f9fa;margin:0;padding:40px 20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1);overflow:hidden;">
    <div style="background:#1a1a1a;padding:32px;text-align:center;">
      <h1 style="color:#f5f5dc;margin:0;font-size:24px;">ESCP Network</h1>
    </div>
    <div style="padding:40px 32px;">
      <h2 style="color:${isApproved ? '#059669' : '#dc2626'};margin:0 0 24px;font-size:20px;">
        ${isApproved ? '🎉 Congratulations! Your Application Has Been Approved' : '📋 Application Status Update'}
      </h2>
      
      <p style="color:#333;font-size:16px;line-height:26px;margin:0 0 20px;">Dear ${applicantName},</p>
      
      ${isApproved ? `
        <p style="color:#333;font-size:16px;line-height:26px;margin:0 0 20px;">
          We are delighted to inform you that your application for <strong>${vehicleName}</strong> to join the ESCP Network has been <strong style="color:#059669;">approved</strong>!
        </p>
        <p style="color:#333;font-size:16px;line-height:26px;margin:0 0 20px;">
          You now have full member access to our peer-to-peer learning network. Here's what you can do:
        </p>
        <ul style="color:#333;font-size:15px;line-height:28px;margin:0 0 24px;padding-left:20px;">
          <li>Access the complete network directory of fund managers</li>
          <li>View detailed survey data and insights</li>
          <li>Participate in knowledge sharing and discussions</li>
          <li>Connect with peers for co-investment opportunities</li>
          <li>Contribute to our community resources</li>
        </ul>
      ` : `
        <p style="color:#333;font-size:16px;line-height:26px;margin:0 0 20px;">
          Thank you for your interest in joining the ESCP Network. After careful review, we regret to inform you that your application for <strong>${vehicleName}</strong> was not approved at this time.
        </p>
        ${cooldownFormatted ? `
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:0 0 20px;">
          <p style="color:#991b1b;font-size:14px;margin:0;">
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
          <a href="https://escpnetwork.net/dashboard" style="background:#1a1a1a;color:#f5f5dc;padding:14px 32px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:600;font-size:16px;">
            Access Your Dashboard →
          </a>
        </div>
      ` : `
        <p style="color:#333;font-size:16px;line-height:26px;margin:20px 0 0;">
          We encourage you to revisit your application based on the feedback provided and reapply when eligible. If you have questions, please don't hesitate to reach out.
        </p>
      `}
    </div>
    <div style="background:#f9fafb;padding:24px 32px;border-top:1px solid #e5e7eb;">
      <p style="color:#6b7280;font-size:13px;line-height:20px;margin:0;text-align:center;">
        This email was sent by the ESCP Network.<br/>
        If you have any questions, please contact our team.
      </p>
    </div>
  </div>
</body>
</html>`

    const { error: emailError } = await resend.emails.send({
      from: 'ESCP Network <onboarding@resend.dev>',
      to: [application.email],
      subject: isApproved 
        ? '🎉 Welcome to the ESCP Network - Your Application Has Been Approved!' 
        : 'ESCP Network - Application Status Update',
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

    console.log('Application status email sent to:', application.email, 'Status:', status)

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (error) {
    console.error('Error in send-application-status function:', error)
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      {
        status: 200, // Return 200 to avoid breaking the approval flow
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
