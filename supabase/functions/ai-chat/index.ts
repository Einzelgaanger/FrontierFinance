import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { messages } = await req.json()
    const userMessage = messages?.[messages.length - 1]?.content || ''

    // Get user role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()
    const userRole = roleData?.role || 'viewer'

    // Service role client for full data access
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured')
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    )

    // ====== STEP 1: Get compact summary stats (always) ======
    const surveyYears = [2021, 2022, 2023, 2024]
    const surveyCounts: Record<number, number> = {}
    let totalSurveys = 0
    
    for (const year of surveyYears) {
      const { count } = await supabaseAdmin
        .from(`survey_responses_${year}`)
        .select('*', { count: 'exact', head: true })
        .or('completed_at.not.is.null,submission_status.eq.completed')
      surveyCounts[year] = count || 0
      totalSurveys += count || 0
    }

    const { count: profilesCount } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    const { data: allRoles } = await supabaseAdmin.from('user_roles').select('role')
    const { data: applicationsStats } = await supabaseAdmin.from('applications').select('status')

    const systemStats = {
      total_users: profilesCount || 0,
      admins: allRoles?.filter(r => r.role === 'admin').length || 0,
      members: allRoles?.filter(r => r.role === 'member').length || 0,
      viewers: allRoles?.filter(r => r.role === 'viewer').length || 0,
      total_applications: applicationsStats?.length || 0,
      pending_applications: applicationsStats?.filter(a => a.status === 'pending').length || 0,
      approved_applications: applicationsStats?.filter(a => a.status === 'approved').length || 0,
    }

    // ====== STEP 2: Targeted data fetch based on user query ======
    const queryLower = userMessage.toLowerCase()
    let targetedData: any = {}

    // Detect company/fund name mentions for targeted lookup
    const companySearchTerms = extractSearchTerms(queryLower)
    
    if (companySearchTerms.length > 0) {
      // User is asking about specific companies - do targeted search
      targetedData.company_search_results = {}
      for (const term of companySearchTerms) {
        const results = await searchCompanyAcrossYears(supabaseAdmin, term, userRole)
        if (Object.keys(results).length > 0) {
          targetedData.company_search_results[term] = results
        }
      }
    }

    // If asking about surveys generally, get a structured summary per year
    if (queryLower.match(/survey|response|data|fund|how many|total|count|statistic|overview|summary|report/)) {
      targetedData.survey_overview = {}
      for (const year of surveyYears) {
        if (surveyCounts[year] > 0) {
          const nameCol = year === 2021 ? 'firm_name' : year === 2022 ? 'organisation' : 'organisation_name'
          const { data } = await supabaseAdmin
            .from(`survey_responses_${year}`)
            .select(`${nameCol}`)
            .or('completed_at.not.is.null,submission_status.eq.completed')
          if (data) {
            targetedData.survey_overview[year] = {
              count: surveyCounts[year],
              companies: data.map((d: any) => d[nameCol]).filter(Boolean)
            }
          }
        }
      }
    }

    // If asking about specific year
    const yearMatch = queryLower.match(/\b(2021|2022|2023|2024)\b/)
    if (yearMatch) {
      const year = parseInt(yearMatch[1])
      const { data } = await supabaseAdmin
        .from(`survey_responses_${year}`)
        .select('*')
        .or('completed_at.not.is.null,submission_status.eq.completed')
        .limit(50)
      if (data && data.length > 0) {
        targetedData[`survey_data_${year}`] = data
      }
    }

    // If asking about sectors, geographic focus, etc.
    if (queryLower.match(/sector|geograph|region|country|location|where|africa|asia|europe/)) {
      targetedData.geographic_sector_data = {}
      for (const year of surveyYears) {
        if (surveyCounts[year] === 0) continue
        const geoCol = year === 2021 ? 'geographic_focus' : 'geographic_markets'
        const sectorCol = year === 2021 ? 'target_sectors' : (year === 2022 ? 'sector_activities' : 'sector_target_allocation')
        const nameCol = year === 2021 ? 'firm_name' : year === 2022 ? 'organisation' : 'organisation_name'
        const { data } = await supabaseAdmin
          .from(`survey_responses_${year}`)
          .select(`${nameCol}, ${geoCol}, ${sectorCol}`)
          .or('completed_at.not.is.null,submission_status.eq.completed')
        if (data) {
          targetedData.geographic_sector_data[year] = data
        }
      }
    }

    // If asking about network/profiles/directory
    if (queryLower.match(/network|profile|director|member|compan/)) {
      const { data } = await supabaseAdmin
        .from('user_profiles')
        .select('id, company_name, full_name, email')
        .order('company_name')
        .limit(200)
      targetedData.network_profiles = data || []
    }

    // If asking about applications
    if (queryLower.match(/application|apply|pending|approved|rejected/)) {
      if (userRole === 'admin') {
        const { data } = await supabaseAdmin
          .from('applications')
          .select('company_name, applicant_name, email, status, created_at')
          .order('created_at', { ascending: false })
          .limit(50)
        targetedData.applications = data || []
      }
    }

    // If asking about blogs
    if (queryLower.match(/blog|post|article|content/)) {
      const { data } = await supabaseAdmin
        .from('blogs')
        .select('title, created_at, caption')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(20)
      targetedData.blogs = data || []
    }

    // User's own credits/activity
    if (queryLower.match(/point|credit|activity|streak|engagement|leaderboard|score/)) {
      const { data: creditsData } = await supabaseAdmin
        .from('user_credits')
        .select('total_points, ai_usage_count, blog_posts_count, login_streak')
        .eq('user_id', user.id)
        .maybeSingle()
      targetedData.user_credits = creditsData
      
      const { data: leaderboard } = await supabaseAdmin
        .from('user_credits')
        .select('user_id, total_points')
        .order('total_points', { ascending: false })
        .limit(10)
      targetedData.leaderboard = leaderboard || []
    }

    // If asking about fund size, investments, financials
    if (queryLower.match(/fund size|invest|capital|raise|commit|financ|amount|dollar|\$/)) {
      for (const year of surveyYears) {
        if (surveyCounts[year] === 0) continue
        const nameCol = year === 2021 ? 'firm_name' : year === 2022 ? 'organisation' : 'organisation_name'
        let selectCols = `${nameCol}`
        if (year === 2021) selectCols += ', target_fund_size, current_fund_size, investment_size_total_raise, investment_size_your_amount'
        else if (year === 2022) selectCols += ', target_fund_size, current_funds_raised, current_amount_invested, investment_size, average_investment_size_per_company'
        else if (year === 2023) selectCols += ', target_fund_size, current_funds_raised, current_amount_invested, average_investment_size, average_investment_size_per_company'
        else selectCols += ', target_fund_size_current, hard_commitments_current, amount_invested_current, target_number_investments'
        
        const { data } = await supabaseAdmin
          .from(`survey_responses_${year}`)
          .select(selectCols)
          .or('completed_at.not.is.null,submission_status.eq.completed')
        if (data) {
          targetedData[`financials_${year}`] = data
        }
      }
    }

    // ====== STEP 3: Build concise, targeted system prompt ======
    const context = `You are PortIQ, an AI data analyst for the CFF (Collaborative for Frontier Finance) Network platform.

# YOUR ROLE
You analyze fund manager survey data across 2021-2024, network profiles, applications, blogs, and user engagement. You provide precise, data-driven answers.

# CURRENT USER
- Role: ${userRole} | Email: ${user.email}
- Role permissions: ${userRole === 'admin' ? 'Full access to all data including emails, financials, and contact info.' : userRole === 'member' ? 'Can see survey data, investment details, team info. Cannot see emails or personal contact info.' : 'Can see aggregate statistics and basic survey info. Cannot see emails, financials, or detailed profiles.'}

# DATABASE SUMMARY (Exact counts)
- Total completed surveys: ${totalSurveys} (2021: ${surveyCounts[2021]}, 2022: ${surveyCounts[2022]}, 2023: ${surveyCounts[2023]}, 2024: ${surveyCounts[2024]})
- Network profiles: ${profilesCount || 0}
- System users: ${systemStats.total_users} (${systemStats.admins} admins, ${systemStats.members} members, ${systemStats.viewers} viewers)
- Applications: ${systemStats.total_applications} total (${systemStats.pending_applications} pending, ${systemStats.approved_applications} approved)

# CRITICAL: COLUMN NAME MAPPING (differs by year!)
| Field | 2021 | 2022 | 2023 | 2024 |
|-------|------|------|------|------|
| Company/Org | firm_name | organisation | organisation_name | organisation_name |
| Fund | (same as firm) | (same as org) | fund_name | fund_name |
| Email | email_address | email | email_address | email_address |
| Respondent | participant_name | name | (in email) | (in email) |
| Geography | geographic_focus | geographic_markets | geographic_markets | geographic_markets |
| Sectors | target_sectors | sector_activities | sector_focus | sector_target_allocation |

# TARGETED DATA FOR THIS QUERY
${JSON.stringify(targetedData, null, 2)}

# RESPONSE RULES
1. **ACCURACY IS PARAMOUNT**: Only state facts from the data above. Never guess or approximate. If data isn't in the targeted data, say "Let me check" or "I don't have that specific data point."
2. **Company name matching**: Companies may appear with slightly different names across years (e.g., "wCap Limited" and "WIC CAPITAL" are DIFFERENT companies). Match carefully by checking both name AND email.
3. **Cross-year analysis**: When summarizing a company across years, use the column mapping table above. The same company may use different emails across years.
4. **Format responses clearly**: Use markdown tables for comparative data, bullet points for lists, headers for sections.
5. **Role enforcement**: ${userRole === 'admin' ? 'You can share all data.' : userRole === 'member' ? 'Do NOT share email addresses or personal contact info.' : 'Only share aggregate statistics and basic org names.'}
6. **When data is tabular**: Present it in a clean markdown table.
7. **Be specific**: Always cite the exact year and source when stating numbers.
8. **Never fabricate**: If you don't have the answer, say so clearly rather than guessing.`

    // Call Lovable AI
    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: context },
          ...messages
        ],
      }),
    })

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'AI rate limit exceeded. Please try again shortly.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage credits exceeded.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      const errText = await aiResponse.text()
      console.error('AI API error:', aiResponse.status, errText)
      return new Response(
        JSON.stringify({ error: 'AI gateway error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const aiData = await aiResponse.json()
    const reply = aiData.choices[0].message.content

    // Award points (fire and forget)
    supabaseClient.rpc('award_points', {
      p_user_id: user.id,
      p_activity_type: 'ai_usage',
      p_points: 5,
      p_description: 'Used AI assistant'
    }).then(() => {}).catch(() => {})

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ai-chat function:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

// ====== Helper: Extract company/fund search terms from user query ======
function extractSearchTerms(query: string): string[] {
  const terms: string[] = []
  
  // Common patterns: "about X", "summary of X", "tell me about X", "X survey", "X data"
  // Also handle quoted terms
  const quotedMatches = query.match(/[""]([^""]+)[""]|"([^"]+)"/g)
  if (quotedMatches) {
    quotedMatches.forEach(m => {
      terms.push(m.replace(/[""\u201c\u201d"]/g, '').trim())
    })
  }
  
  // Pattern: "about/of/for [Company Name]"
  const aboutMatch = query.match(/(?:about|of|for|from|at)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+(?:survey|data|fund|in\s+\d|response|capital|venture|limited|partner|group|invest)|\?|$)/i)
  if (aboutMatch) {
    const term = aboutMatch[1].trim()
    if (term.length > 2 && !['the', 'our', 'all', 'any', 'this', 'that', 'some'].includes(term.toLowerCase())) {
      terms.push(term)
    }
  }

  // Pattern: "[Company] survey/data" at start
  const startMatch = query.match(/^([A-Z][a-zA-Z\s&]+?)(?:\s+(?:survey|data|fund|response|capital))/i)
  if (startMatch) {
    const term = startMatch[1].trim()
    if (term.length > 2) terms.push(term)
  }

  // Deduplicate
  return [...new Set(terms.map(t => t.toLowerCase()))]
}

// ====== Helper: Search for a company across all survey years ======
async function searchCompanyAcrossYears(supabaseAdmin: any, searchTerm: string, userRole: string) {
  const results: any = {}
  const yearConfigs = [
    { year: 2021, nameCol: 'firm_name', emailCol: 'email_address' },
    { year: 2022, nameCol: 'organisation', emailCol: 'email' },
    { year: 2023, nameCol: 'organisation_name', emailCol: 'email_address' },
    { year: 2024, nameCol: 'organisation_name', emailCol: 'email_address' },
  ]

  for (const config of yearConfigs) {
    const { data, error } = await supabaseAdmin
      .from(`survey_responses_${config.year}`)
      .select('*')
      .or('completed_at.not.is.null,submission_status.eq.completed')
      .ilike(config.nameCol, `%${searchTerm}%`)

    if (!error && data && data.length > 0) {
      results[config.year] = data
    }
  }

  // Also search by email domain if the search term looks like a domain
  if (searchTerm.includes('.') || searchTerm.includes('@')) {
    for (const config of yearConfigs) {
      if (results[config.year]) continue // Already found
      const { data } = await supabaseAdmin
        .from(`survey_responses_${config.year}`)
        .select('*')
        .or('completed_at.not.is.null,submission_status.eq.completed')
        .ilike(config.emailCol, `%${searchTerm}%`)
      if (data && data.length > 0) {
        results[config.year] = data
      }
    }
  }

  return results
}
