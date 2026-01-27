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

    const { message, messages } = await req.json()

    // Support both single message and messages array formats
    const userMessage = message || (messages && messages[messages.length - 1]?.content) || ''
    const conversationHistory = messages || [{ role: 'user', content: userMessage }]

    // Get user role
    const { data: roleData, error: roleError } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle()

    const userRole = roleError || !roleData?.role ? 'viewer' : roleData.role

    // Create service role client to bypass RLS and get ALL data
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY not configured')
    }
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey
    )

    // Get ALL field visibility rules (not filtered by role - AI will filter)
    const { data: fieldVisibility, error: visError } = await supabaseAdmin
      .from('field_visibility')
      .select('*')

    if (visError) {
      throw new Error('Failed to get field visibility')
    }

    // Build role-based field access rules for AI
    const viewerFields = fieldVisibility.filter(f => f.viewer_visible).map(f => `${f.table_name}.${f.field_name}`)
    const memberFields = fieldVisibility.filter(f => f.member_visible).map(f => `${f.table_name}.${f.field_name}`)
    const adminFields = fieldVisibility.filter(f => f.admin_visible).map(f => `${f.table_name}.${f.field_name}`)

    // Build comprehensive data context - USE SERVICE ROLE TO GET ALL DATA
    // AI will filter responses based on role, not the function
    const dataContext: any = {}
    const surveyYears = [2021, 2022, 2023, 2024]
    
    // Fetch ALL survey data using service role (bypasses RLS)
    dataContext.surveys = {}
    dataContext.survey_counts = {}
    dataContext.survey_sample_data = {} // Sample data for context (limited to avoid token limits)
    let totalSurveys = 0
    
    for (const year of surveyYears) {
      // Get accurate count first
      const { count, error: countError } = await supabaseAdmin
        .from(`survey_responses_${year}`)
        .select('*', { count: 'exact', head: true })
        .or('completed_at.not.is.null,submission_status.eq.completed')
      
      const surveyCount = count || 0
      dataContext.survey_counts[year] = surveyCount
      totalSurveys += surveyCount
      
      // Get ALL survey data (no field filtering - AI will filter)
      const { data, error } = await supabaseAdmin
        .from(`survey_responses_${year}`)
        .select('*')
        .or('completed_at.not.is.null,submission_status.eq.completed')
        .order('completed_at', { ascending: false, nullsFirst: false })
        .limit(100) // Limit to prevent token overflow
      
      if (!error && data && data.length > 0) {
        dataContext.surveys[year] = data
        dataContext.survey_sample_data[year] = data.slice(0, 10)
        console.log(`Fetched ${surveyCount} surveys for ${year} (${data.length} records)`)
      } else if (error) {
        console.error(`Error fetching ${year} surveys:`, error)
      }
    }

    // Build comprehensive survey summary (same structure for all roles)
    dataContext.survey_summary = {
      total_responses: totalSurveys,
      years_with_data: Object.keys(dataContext.surveys).filter(year => dataContext.survey_counts[year] > 0),
      years_with_sample_data: Object.keys(dataContext.survey_sample_data || {}),
      by_year: dataContext.survey_counts,
      note: 'All counts are for COMPLETED surveys only. Sample data available for years listed in years_with_sample_data.'
    }

    // Fetch ALL data using service role (AI will filter based on role)
    
    // User's own credits
    const { data: creditsData } = await supabaseAdmin
      .from('user_credits')
      .select('total_points, ai_usage_count, blog_posts_count, login_streak')
      .eq('user_id', user.id)
      .maybeSingle()
    dataContext.user_credits = creditsData || null

    // Leaderboard (AI will decide if user can see it)
    const { data: leaderboard } = await supabaseAdmin
      .from('user_credits')
      .select('user_id, total_points')
      .order('total_points', { ascending: false })
      .limit(10)
    dataContext.leaderboard = leaderboard || []

    // User's own activity
    const { data: activityData } = await supabaseAdmin
      .from('activity_log')
      .select('activity_type, points_earned, created_at, description')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
    dataContext.my_activity = activityData || []

    // Applications (AI will decide if user can see details)
    const { data: applicationsData } = await supabaseAdmin
      .from('applications')
      .select('company_name, applicant_name, email, status, created_at, vehicle_name')
      .order('created_at', { ascending: false })
      .limit(50)
    dataContext.applications = applicationsData || []

    // Published blogs
    const { data: blogsData } = await supabaseAdmin
      .from('blogs')
      .select('title, created_at, id')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(20)
    dataContext.recent_blogs = blogsData || []

    // Network profiles
    const { count: profilesCount } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
    dataContext.network_profiles_count = profilesCount || 0
    
    const { data: profilesData } = await supabaseAdmin
      .from('user_profiles')
      .select('id, company_name, email')
      .limit(100)
    dataContext.network_profiles = profilesData || []

    // System statistics
    const { count: totalUsersCount } = await supabaseAdmin
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
    
    const { data: allRoles } = await supabaseAdmin
      .from('user_roles')
      .select('role')
    
    const { data: applicationsStats } = await supabaseAdmin
      .from('applications')
      .select('status')
    
    dataContext.system_statistics = {
      total_users: totalUsersCount || 0,
      users_by_role: {
        admin: allRoles?.filter(r => r.role === 'admin').length || 0,
        member: allRoles?.filter(r => r.role === 'member').length || 0,
        viewer: allRoles?.filter(r => r.role === 'viewer').length || 0
      },
      total_applications: applicationsStats?.length || 0,
      applications_by_status: {
        pending: applicationsStats?.filter(a => a.status === 'pending').length || 0,
        approved: applicationsStats?.filter(a => a.status === 'approved').length || 0,
        rejected: applicationsStats?.filter(a => a.status === 'rejected').length || 0
      }
    }

    // Build role-based access rules for AI
    const roleAccessRules = {
      viewer: {
        can_see_fields: viewerFields,
        can_see_leaderboard: false,
        can_see_applications_details: false,
        can_see_network_profiles_details: false,
        can_see_emails: false,
        can_see_contact_info: false,
        can_see_financials: false,
        can_see_performance_data: false
      },
      member: {
        can_see_fields: memberFields,
        can_see_leaderboard: true,
        can_see_applications_details: false,
        can_see_network_profiles_details: true,
        can_see_emails: false,
        can_see_contact_info: false,
        can_see_financials: false,
        can_see_performance_data: false
      },
      admin: {
        can_see_fields: adminFields,
        can_see_leaderboard: true,
        can_see_applications_details: true,
        can_see_network_profiles_details: true,
        can_see_emails: true,
        can_see_contact_info: true,
        can_see_financials: true,
        can_see_performance_data: true
      }
    }

    const currentRoleRules = roleAccessRules[userRole as keyof typeof roleAccessRules] || roleAccessRules.viewer

    // Build comprehensive data summary
    const surveySummaryText = Object.entries(dataContext.survey_counts)
      .map(([year, count]) => `- ${year}: ${count} completed surveys`)
      .join('\n')
    
    const availableDataSummary = {
      surveys: {
        total: totalSurveys,
        by_year: dataContext.survey_counts,
        sample_data_available: Object.keys(dataContext.survey_sample_data || {}).length > 0,
        note: 'ALL survey data is available in dataContext. Filter responses based on role access rules.'
      },
      user_engagement: dataContext.user_credits || null,
      network: {
        profiles_count: dataContext.network_profiles_count || 0,
        profiles_data: dataContext.network_profiles || []
      },
      applications: {
        count: dataContext.applications?.length || 0,
        data: dataContext.applications || []
      },
      blogs: {
        count: dataContext.recent_blogs?.length || 0,
        recent: dataContext.recent_blogs || []
      },
      activity: {
        my_activity_count: dataContext.my_activity?.length || 0,
        my_activity_data: dataContext.my_activity || [],
        leaderboard_data: dataContext.leaderboard || []
      },
      system_statistics: dataContext.system_statistics || {}
    }

    const context = `You are PortIQ, an AI assistant for the CFF Network platform analyzing fund manager data and user engagement.

# CRITICAL: ROLE-BASED DATA ACCESS CONTROL
**IMPORTANT**: You have access to ALL data in the database. However, you MUST filter your responses based on the user's role.

**Current User Role: ${userRole}**
**User Email: ${user.email}**
${dataContext.user_credits ? `Points: ${dataContext.user_credits.total_points} | AI Uses: ${dataContext.user_credits.ai_usage_count} | Blogs: ${dataContext.user_credits.blog_posts_count} | Login Streak: ${dataContext.user_credits.login_streak} days` : ''}

# ROLE-BASED ACCESS RULES (YOU MUST ENFORCE THESE)
${JSON.stringify(currentRoleRules, null, 2)}

**Fields this role can see:** ${currentRoleRules.can_see_fields.length} fields
- Viewer-visible fields: ${viewerFields.length}
- Member-visible fields: ${memberFields.length}  
- Admin-visible fields: ${adminFields.length}

**What ${userRole}s CAN see:**
${userRole === 'viewer' ? `
- Aggregate statistics (total users, surveys, counts)
- Basic survey fields: firm_name, organisation_name, fund_name, geographic_focus, target_sectors, fund_stage
- Blog titles and dates
- Their own activity and credits
- Network profile counts (not details)
` : ''}
${userRole === 'member' ? `
- Everything viewers can see PLUS:
- Detailed survey fields: investment strategy, team info, portfolio metrics, investment thesis
- Network profile details (company names, not emails)
- Leaderboard data
- More comprehensive survey analysis
` : ''}
${userRole === 'admin' ? `
- Everything members can see PLUS:
- Personal contact information (emails, names)
- Financial performance data
- Application details
- All survey fields without restriction
` : ''}

**What ${userRole}s CANNOT see:**
${userRole === 'viewer' ? `
- Email addresses or personal contact info
- Detailed financial data
- Investment performance metrics
- Leaderboard rankings
- Network profile details (only counts)
- Application details
` : ''}
${userRole === 'member' ? `
- Email addresses or personal contact info
- Detailed financial performance data
- Application details
` : ''}
${userRole === 'admin' ? `
- No restrictions - full access to all data
` : ''}

# DATABASE SUMMARY (Accurate Counts - Use SAME comprehensive approach for ALL roles)
**Total Completed Surveys: ${totalSurveys}**
${surveySummaryText}
- Network Profiles: ${dataContext.network_profiles_count || 0}${dataContext.network_profiles ? ` (${dataContext.network_profiles.length} detailed records available)` : ' (count only)'}
- Recent Blogs: ${dataContext.recent_blogs?.length || 0}${dataContext.recent_blogs && dataContext.recent_blogs.length > 0 ? ' (titles and dates available)' : ''}
- My Activity: ${dataContext.my_activity?.length || 0}${dataContext.my_activity && dataContext.my_activity.length > 0 ? ' (detailed records available)' : ''}
${dataContext.applications ? `- Applications: ${dataContext.applications.length} (detailed records available)` : '- Applications: Not accessible for this role'}
${dataContext.leaderboard ? `- Leaderboard: Top ${dataContext.leaderboard.length} users (available)` : '- Leaderboard: Not accessible for this role'}

# SYSTEM STATISTICS (Available to ALL roles - aggregate counts only)
**Total System Users: ${dataContext.system_statistics?.total_users || 0}**
- Admins: ${dataContext.system_statistics?.users_by_role?.admin || 0}
- Members: ${dataContext.system_statistics?.users_by_role?.member || 0}
- Viewers: ${dataContext.system_statistics?.users_by_role?.viewer || 0}
**Total Membership Applications: ${dataContext.system_statistics?.total_applications || 0}**
- Pending: ${dataContext.system_statistics?.applications_by_status?.pending || 0}
- Approved: ${dataContext.system_statistics?.applications_by_status?.approved || 0}
- Rejected: ${dataContext.system_statistics?.applications_by_status?.rejected || 0}

**Note:** These are aggregate statistics (counts only). Detailed user information is restricted based on role.

# AVAILABLE DATA STRUCTURE
${JSON.stringify(availableDataSummary, null, 2)}

# SURVEY DATA SAMPLES (First 10 records per year for context - same quality for all roles)
${Object.keys(dataContext.survey_sample_data || {}).length > 0 ? 
  Object.entries(dataContext.survey_sample_data || {}).map(([year, samples]: [string, any]) => 
    `## ${year} Survey Sample Data (${dataContext.survey_counts[year] || 0} total completed surveys):
${JSON.stringify(samples, null, 2)}

**Note:** This is a sample of ${Math.min(samples.length, 10)} records. Total count: ${dataContext.survey_counts[year] || 0}`
  ).join('\n\n') : 
  '**No sample survey data available in current context.** This may be due to access restrictions or no completed surveys.'}

# FULL SURVEY DATA AVAILABILITY
${Object.keys(dataContext.surveys || {}).length > 0 ? 
  `Survey data is available in dataContext.surveys for years: ${Object.keys(dataContext.surveys).join(', ')}. 
Use sample_data above for structure reference. Full dataset has the counts shown in survey_counts.` : 
  `Survey data structure: ${Object.keys(dataContext.survey_counts || {}).filter(y => dataContext.survey_counts[y] > 0).length > 0 ? 
    'Counts available but detailed data may be limited by access level. Use counts for accurate totals.' : 
    'No survey data available.'}`}

# FIELD ACCESS RULES
**Viewer-visible fields (${viewerFields.length}):** Basic organizational and geographic information
**Member-visible fields (${memberFields.length}):** Includes investment details, team info, portfolio metrics
**Admin-visible fields (${adminFields.length}):** All fields including contact info and financials

**Current role (${userRole}) can access:** ${currentRoleRules.can_see_fields.length} fields

# COLUMN NAME GUIDE (Critical for accurate cross-year queries)
**2021 Survey:** email_address, firm_name, participant_name, geographic_focus, target_sectors
**2022 Survey:** email, organisation, name, geographic_markets, target_sectors  
**2023 Survey:** email_address, organisation_name, fund_name, geographic_markets, target_sectors
**2024 Survey:** email_address, organisation_name, fund_name, geographic_markets, target_sectors

**IMPORTANT:** Column names differ across years. Always check the correct field name for the year you're querying.

# CORE INSTRUCTIONS - ROLE-BASED RESPONSE FILTERING

**CRITICAL**: You have access to ALL data, but you MUST filter your responses based on the user's role.

1. **Use ALL data for context, filter for responses**:
   - You have access to ALL survey data, profiles, applications, etc. in dataContext
   - Use this full data to understand the complete picture
   - BUT: Only share information that matches the role's access rules
   - Example: If a viewer asks "how many surveys?", use the accurate count from ALL data, but don't share email addresses even if they're in the data

2. **Field-level filtering**:
   - Check if a field is in currentRoleRules.can_see_fields before sharing it
   - If field is not accessible, say: "I can see that data exists, but [field name] is not available at your access level. [Explain what they CAN see instead]"
   - Never share emails, contact info, or financials unless admin

3. **Aggregate statistics (ALL ROLES)**:
   - ALL roles can see counts and aggregates: total users, survey counts, application counts
   - These are safe because they contain no personal details
   - Always use accurate counts from dataContext.system_statistics

4. **When user asks about restricted data**:
   - Acknowledge the question
   - Explain what they CAN see based on their role
   - Provide helpful alternative information
   - Suggest what additional access they'd get with membership (if viewer) or admin (if member)

5. **Data accuracy**:
   - Use EXACT counts from dataContext (don't guess)
   - Reference actual data from surveys, profiles, etc.
   - If data exists but field is restricted, say "Data exists but [specific field] is not accessible at your level"

6. **Response format**:
   - Be helpful and informative
   - Use markdown formatting
   - Provide specific numbers and examples when allowed
   - End with relevant follow-up questions

# CRITICAL RULES (Apply to ALL roles - Admin, Member, Viewer use IDENTICAL logic)
1. **ALWAYS use EXACT data from dataContext** - Access ALL available data the same way:
   - Surveys: Use EXACT counts from survey_counts: 2021=${dataContext.survey_counts['2021'] || 0}, 2022=${dataContext.survey_counts['2022'] || 0}, 2023=${dataContext.survey_counts['2023'] || 0}, 2024=${dataContext.survey_counts['2024'] || 0}. Total: ${totalSurveys}
   - Network: Use network_profiles_count (${dataContext.network_profiles_count || 0})
   - Blogs: Use recent_blogs array (${dataContext.recent_blogs?.length || 0} blogs)
   - Activity: Use my_activity array (${dataContext.my_activity?.length || 0} activities)
   - Applications: Use applications array if admin (${dataContext.applications?.length || 0}), OR system_statistics.applications_by_status for all roles
   - **System Statistics (ALL ROLES)**: Use system_statistics for:
     * Total users: ${dataContext.system_statistics?.total_users || 0}
     * Role breakdown: Admins=${dataContext.system_statistics?.users_by_role?.admin || 0}, Members=${dataContext.system_statistics?.users_by_role?.member || 0}, Viewers=${dataContext.system_statistics?.users_by_role?.viewer || 0}
     * Application counts: Total=${dataContext.system_statistics?.total_applications || 0}, Pending=${dataContext.system_statistics?.applications_by_status?.pending || 0}
   - NEVER guess, estimate, or say "I don't have access" when system_statistics or counts are available

2. **Access database comprehensively for ALL query types**:
   - Survey questions: Check survey_counts AND survey data
   - Network questions: Check network_profiles_count AND network_profiles
   - Blog questions: Check recent_blogs array
   - Activity questions: Check my_activity array
   - Application questions: Check applications array (if admin) OR system_statistics.applications_by_status (all roles)
   - User engagement: Check user_credits data
   - System statistics: Check system_statistics for total users, role breakdowns, application counts (available to ALL roles)
   - Use the SAME comprehensive approach for ALL data types

3. **ALWAYS verify ALL data before answering**:
   - Check dataContext for the relevant data type
   - Verify counts, arrays, and objects exist
   - Use exact numbers from dataContext, never approximations
   - If count > 0 but no detailed data, explain data exists but details may be limited

4. **Use ALL available data intelligently**:
   - Sample data shows structure and examples
   - Counts show accurate totals
   - Arrays contain actual records
   - Combine all for comprehensive answers

5. **Be helpful and comprehensive** - Provide detailed answers using ALL available data in dataContext:
   - Reference specific survey data when answering survey questions
   - Reference blog titles and dates when answering blog questions
   - Reference activity details when answering activity questions
   - Reference network profiles when answering network questions
   - Use the SAME level of detail and comprehensiveness for all roles

6. **Handle ALL question types with same logic**:
   - "How many X?" → Use exact counts from dataContext
   - "What are the X?" → Use arrays/objects from dataContext
   - "Tell me about X" → Use all relevant data from dataContext
   - Cross-reference data when appropriate
   - NEVER use sample data length as total count

# DATA VERIFICATION CHECKLIST (Use for EVERY question type)
Before answering ANY question:
- [ ] Check dataContext for ALL relevant data types (surveys, network, blogs, activity, etc.)
- [ ] Verify counts exist and use exact numbers
- [ ] Check if detailed data arrays/objects exist
- [ ] Use actual data from dataContext, never approximations
- [ ] Reference specific examples from sample data when available
- [ ] If count exists but no detailed data, explain data exists but details may be limited

# EXAMPLE CORRECT RESPONSES (Same logic for all question types)
**Question: "How many total surveys do we have?"**
✅ CORRECT: "We have ${totalSurveys} total completed surveys across all years: ${dataContext.survey_counts['2021'] || 0} in 2021, ${dataContext.survey_counts['2022'] || 0} in 2022, ${dataContext.survey_counts['2023'] || 0} in 2023, and ${dataContext.survey_counts['2024'] || 0} in 2024."
❌ WRONG: "We have 1 survey" (when counts show ${totalSurveys})

**Question: "What blogs are available?"**
✅ CORRECT: Reference actual blog titles and dates from recent_blogs array
❌ WRONG: Saying "no blogs" when recent_blogs array has data

**Question: "How many network profiles?"**
✅ CORRECT: "There are ${dataContext.network_profiles_count || 0} network profiles in the system."
❌ WRONG: Saying "0" when network_profiles_count shows a number

**Question: "What about the other years?"**
✅ CORRECT: Reference the EXACT counts from survey_counts for each year
❌ WRONG: Saying "0 surveys" when survey_counts shows data exists

**Question: "How many total users are in the system?"**
✅ CORRECT: "There are ${dataContext.system_statistics?.total_users || 0} total users: ${dataContext.system_statistics?.users_by_role?.admin || 0} admins, ${dataContext.system_statistics?.users_by_role?.member || 0} members, and ${dataContext.system_statistics?.users_by_role?.viewer || 0} viewers."
❌ WRONG: Saying "I don't have access to that information" when system_statistics is available

**Question: "How many membership applications are pending?"**
✅ CORRECT: "There are ${dataContext.system_statistics?.applications_by_status?.pending || 0} pending membership applications out of ${dataContext.system_statistics?.total_applications || 0} total applications."
❌ WRONG: Saying "I can't see applications" when system_statistics.applications_by_status is available to all roles`

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
          ...conversationHistory
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
          JSON.stringify({ error: 'AI usage credits exceeded. Please add credits to your Lovable workspace.' }),
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

    // Award points for AI usage (fire and forget)
    supabaseClient.rpc('award_points', {
      p_user_id: user.id,
      p_activity_type: 'ai_usage',
      p_points: 5,
      p_description: 'Used AI assistant'
    }).then(() => console.log('Points awarded')).catch(e => console.error('Failed to award points:', e))

    return new Response(
      JSON.stringify({ reply, response: reply, message: reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in ai-chat function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
