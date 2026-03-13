import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';
import { Resend } from 'https://esm.sh/resend@4.0.0';

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

    // Verify caller is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    });
    const { data: { user: caller } } = await supabaseAuth.auth.getUser();
    if (!caller) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', caller.id).single();
    if (!roleData || roleData.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const {
      resourceTitle,
      resourceDescription,
      resourceUrl,
      thumbnailUrl,
      topic,
      mediaType,
      notifyMode, // 'all_members' | 'specific' | 'all_except'
      specificEmails, // string[] - emails to send to (for 'specific') or exclude (for 'all_except')
    } = await req.json();

    if (!resourceTitle) {
      return new Response(JSON.stringify({ error: 'resourceTitle is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 1: Determine recipient list
    let recipientEmails: string[] = [];

    if (notifyMode === 'specific') {
      recipientEmails = specificEmails || [];
    } else {
      // Get all members and admins (not viewers) — both primary and team members
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('email, user_role')
        .in('user_role', ['member', 'admin']);

      const allMemberEmails = (profiles || [])
        .map(p => p.email)
        .filter(Boolean) as string[];

      if (notifyMode === 'all_except') {
        const excludeSet = new Set((specificEmails || []).map((e: string) => e.toLowerCase()));
        recipientEmails = allMemberEmails.filter(e => !excludeSet.has(e.toLowerCase()));
      } else {
        recipientEmails = allMemberEmails;
      }
    }

    // Deduplicate
    recipientEmails = [...new Set(recipientEmails.map(e => e.toLowerCase()))];

    if (recipientEmails.length === 0) {
      return new Response(JSON.stringify({ error: 'No recipients found' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Step 2: AI polish the description for marketing
    let polishedDescription = resourceDescription || resourceTitle;
    try {
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are a marketing copywriter for a professional investment network called "Collaborative For Frontier Finance" (CFF). Write a brief, engaging email blurb (2-3 sentences max) to promote a new learning resource. Be professional but warm. Do NOT include subject lines, greetings, or sign-offs — just the promotional body text. Keep it concise and action-oriented.`
            },
            {
              role: 'user',
              content: `Resource title: "${resourceTitle}"\nTopic: ${topic || 'General'}\nDescription: ${resourceDescription || 'No description provided'}\nType: ${mediaType || 'article'}`
            }
          ],
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        polishedDescription = aiData.choices?.[0]?.message?.content || polishedDescription;
      }
    } catch (aiErr) {
      console.warn('AI polish failed, using original description:', aiErr);
    }

    // Step 3: Build the email HTML
    const platformUrl = 'https://frontierfinance.org/community?tab=learning';
    const imageSection = thumbnailUrl ? `
      <div style="margin:0 0 20px;border-radius:8px;overflow:hidden;">
        <img src="${thumbnailUrl}" alt="${resourceTitle}" style="width:100%;max-height:300px;object-fit:cover;display:block;" />
      </div>` : '';

    const topicBadge = topic ? `<span style="display:inline-block;background:#f0e6d2;color:#8b6914;padding:4px 12px;border-radius:16px;font-size:12px;font-weight:600;margin-bottom:12px;">${topic.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}</span>` : '';

    const emailHtml = `
      <div style="font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#ffffff;padding:24px;">
        <div style="max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#0f1d2e;padding:28px;text-align:center;">
            <img src="https://escpnetwork.net/CFF%20LOGO.png" alt="Collaborative For Frontier Finance" width="160" height="64" />
          </div>
          <div style="height:4px;background:linear-gradient(90deg,#c49a2b,#d4aa3b);"></div>
          <div style="padding:28px;">
            <p style="margin:0 0 4px;color:#5a5a6e;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">New in the Learning Hub</p>
            ${topicBadge}
            <h1 style="margin:0 0 16px;color:#0f1d2e;font-size:22px;line-height:1.3;">${resourceTitle}</h1>
            ${imageSection}
            <p style="margin:0 0 24px;color:#1a1a2e;line-height:1.7;font-size:15px;">${polishedDescription}</p>
            <a href="${platformUrl}" style="display:inline-block;background:#c49a2b;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;">
              View Resource →
            </a>
            <p style="margin:24px 0 0;color:#9ca3af;font-size:12px;line-height:1.5;">
              You're receiving this because you're a member of the CFF Network.<br/>
              <a href="https://frontierfinance.org" style="color:#c49a2b;text-decoration:none;">frontierfinance.org</a>
            </p>
          </div>
        </div>
      </div>`;

    // Step 4: Send via Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const resend = new Resend(resendApiKey);
    const rawFrom = Deno.env.get('RESEND_FROM_EMAIL') || 'hello@frontierfinance.org';
    const senderEmail = (rawFrom.match(/<([^>]+)>/)?.[1] || rawFrom).trim();
    const fromAddress = `Collaborative For Frontier Finance <${senderEmail}>`;

    // Send in batches of 50 (Resend limit)
    const batchSize = 50;
    let sentCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < recipientEmails.length; i += batchSize) {
      const batch = recipientEmails.slice(i, i + batchSize);
      
      // Send individually to avoid BCC exposure
      const sendPromises = batch.map(async (email) => {
        try {
          const { error } = await resend.emails.send({
            from: fromAddress,
            to: [email],
            subject: `📚 New Resource: ${resourceTitle} — CFF Learning Hub`,
            html: emailHtml,
          } as any);
          if (error) {
            console.error(`Failed to send to ${email}:`, error);
            errors.push(email);
          } else {
            sentCount++;
          }
        } catch (err) {
          console.error(`Error sending to ${email}:`, err);
          errors.push(email);
        }
      });

      await Promise.all(sendPromises);
    }

    console.log(`Resource notification sent: ${sentCount}/${recipientEmails.length} emails delivered`);

    return new Response(JSON.stringify({
      success: true,
      sentCount,
      totalRecipients: recipientEmails.length,
      failedEmails: errors,
      polishedDescription,
      message: `Notification sent to ${sentCount} of ${recipientEmails.length} recipients.`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in notify-resource-posted:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
