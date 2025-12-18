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

    // Get field visibility rules
    const { data: fieldVisibility, error: visError } = await supabaseClient
      .from('field_visibility')
      .select('*')

    if (visError) {
      throw new Error('Failed to get field visibility')
    }

    // Filter fields based on user role
    const visibleFields = fieldVisibility.filter(field => {
      if (userRole === 'admin') return field.admin_visible
      if (userRole === 'member') return field.member_visible
      if (userRole === 'viewer') return field.viewer_visible
      return false
    })

    // Build comprehensive data context - SAME LOGIC FOR ALL ROLES (Admin, Member, Viewer)
    // The only difference is field visibility, not the logic itself
    const dataContext: any = {}
    const surveyYears = [2021, 2022, 2023, 2024]
    
    // Define base fields for each year (these exist in each year's table) - same for all roles
    const baseFieldsByYear: Record<number, string[]> = {
      2021: ['id', 'email_address', 'firm_name', 'participant_name', 'submission_status', 'completed_at', 'created_at'],
      2022: ['id', 'email', 'organisation', 'name', 'submission_status', 'completed_at', 'created_at'],
      2023: ['id', 'email_address', 'organisation_name', 'fund_name', 'submission_status', 'completed_at', 'created_at'],
      2024: ['id', 'email_address', 'organisation_name', 'fund_name', 'submission_status', 'completed_at', 'created_at']
    }
    
    // Get survey field names for efficient queries - SAME LOGIC for all roles
    const surveyFieldsByYear: Record<number, string[]> = {}
    surveyYears.forEach(year => {
      const yearFields = visibleFields.filter(f => f.table_name === `survey_responses_${year}`)
      const baseFields = baseFieldsByYear[year] || ['id', 'submission_status']
      const additionalFields = yearFields.map(f => f.field_name).filter(f => !baseFields.includes(f))
      surveyFieldsByYear[year] = [...baseFields, ...additionalFields]
    })

    // Fetch survey data efficiently - use same comprehensive logic for all roles
    dataContext.surveys = {}
    dataContext.survey_counts = {}
    dataContext.survey_sample_data = {} // Sample data for context (limited to avoid token limits)
    let totalSurveys = 0
    
    for (const year of surveyYears) {
      const fieldsToSelect = [...new Set(surveyFieldsByYear[year])].join(', ')
      
      // Get actual survey data with visible fields (same comprehensive approach for all roles)
      const { data, error } = await supabaseClient
        .from(`survey_responses_${year}`)
        .select(fieldsToSelect)
        .or('completed_at.not.is.null,submission_status.eq.completed')
        .order('completed_at', { ascending: false, nullsFirst: false })
        .limit(100) // Limit to prevent token overflow, but get enough for context

      // Try to get accurate count using count query (works better for all roles)
      let surveyCount = data?.length || 0
      try {
        const { count, error: countError } = await supabaseClient
          .from(`survey_responses_${year}`)
          .select('*', { count: 'exact', head: true })
          .or('completed_at.not.is.null,submission_status.eq.completed')
        
        // Use count if available and valid, otherwise fall back to data length
        if (!countError && count !== null && count > 0) {
          surveyCount = count
        } else if (data && data.length > 0) {
          // If count failed but we have data, use data length as minimum
          surveyCount = data.length
          console.log(`Count query failed for ${year}, using data length: ${surveyCount}`)
        }
      } catch (countErr) {
        // If count query fails, use data length as fallback
        console.log(`Count query error for ${year}, using data length: ${surveyCount}`)
      }
      
      // Store data and counts using same comprehensive logic for all roles
      if (!error) {
        // Always set the count (even if 0)
        dataContext.survey_counts[year] = surveyCount
        totalSurveys += surveyCount
        
        // Store data if available (same approach for all roles)
        if (data && data.length > 0) {
        dataContext.surveys[year] = data
          // Store sample of first 10 for better context (reduces token usage while maintaining quality)
          dataContext.survey_sample_data[year] = data.slice(0, 10)
          console.log(`Fetched ${surveyCount} surveys for ${year} (${data.length} records with visible fields)`)
        } else if (surveyCount > 0) {
          // Count exists but no data returned (likely RLS restriction on fields)
          console.log(`Count shows ${surveyCount} surveys for ${year}, but no data returned (likely field visibility restriction)`)
          // Still record the count so AI knows data exists
        } else {
          console.log(`No surveys found for ${year}`)
        }
      } else {
        // Error occurred - log but don't crash
        console.error(`Error fetching ${year} surveys:`, error)
        dataContext.survey_counts[year] = 0
        // Don't add to total if there was an error
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

    // User's own credits (all roles) - same comprehensive approach
    const { data: creditsData, error: creditsError } = await supabaseClient
      .from('user_credits')
      .select('total_points, ai_usage_count, blog_posts_count, login_streak')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!creditsError && creditsData) {
      dataContext.user_credits = creditsData
    } else if (creditsError) {
      console.error('Error fetching user credits:', creditsError)
    }

    // Leaderboard - SAME comprehensive query logic, but only fetch if role has access
    if (userRole === 'member' || userRole === 'admin') {
      const { data: leaderboard, error: leaderboardError } = await supabaseClient
        .from('user_credits')
        .select('user_id, total_points')
        .order('total_points', { ascending: false })
        .limit(10)

      if (!leaderboardError && leaderboard) {
        dataContext.leaderboard = leaderboard
      } else if (leaderboardError) {
        console.error('Error fetching leaderboard:', leaderboardError)
      }
    }

    // Recent activity (user's own) - same comprehensive approach for all roles
    const { data: activityData, error: activityError } = await supabaseClient
      .from('activity_log')
      .select('activity_type, points_earned, created_at, description')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!activityError && activityData) {
      dataContext.my_activity = activityData
    } else if (activityError) {
      console.error('Error fetching activity:', activityError)
    }

    // Applications - SAME comprehensive query logic, but only fetch if role has access
    if (userRole === 'admin') {
      const { data: applicationsData, error: applicationsError } = await supabaseClient
        .from('applications')
        .select('company_name, applicant_name, email, status, created_at, vehicle_name')
        .order('created_at', { ascending: false })
        .limit(50)

      if (!applicationsError && applicationsData) {
        dataContext.applications = applicationsData
      } else if (applicationsError) {
        console.error('Error fetching applications:', applicationsError)
      }
    }

    // Published blogs (all roles) - same comprehensive approach
    const { data: blogsData, error: blogsError } = await supabaseClient
      .from('blogs')
      .select('title, created_at, id')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(20)

    if (!blogsError && blogsData) {
      dataContext.recent_blogs = blogsData
    } else if (blogsError) {
      console.error('Error fetching blogs:', blogsError)
    }

    // Network profiles - SAME comprehensive query logic for all roles
    // Get count for all roles (same query approach)
    const { count: profilesCount, error: profilesCountError } = await supabaseClient
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })
    
    if (!profilesCountError && profilesCount !== null) {
      dataContext.network_profiles_count = profilesCount
    } else {
      dataContext.network_profiles_count = 0
      if (profilesCountError) {
        console.error('Error fetching profiles count:', profilesCountError)
      }
    }
    
    // Get profile details - SAME query logic, but only fetch if role has access
    if (userRole === 'member' || userRole === 'admin') {
      const { data: profilesData, error: profilesError } = await supabaseClient
        .from('user_profiles')
        .select('id, company_name, email')
        .limit(100)

      if (!profilesError && profilesData) {
        dataContext.network_profiles = profilesData
      } else if (profilesError) {
        console.error('Error fetching network profiles:', profilesError)
      }
    }

    // Build focused, efficient context for AI
    const accessibleFields = visibleFields.map(f => 
      `${f.table_name}.${f.field_name} (${f.field_category})`
    ).join('\n')

    // Build comprehensive data summary - SAME structure for ALL roles
    const surveySummaryText = Object.entries(dataContext.survey_counts)
      .map(([year, count]) => `- ${year}: ${count} completed surveys`)
      .join('\n')
    
    // Build complete data summary using SAME comprehensive approach for all roles
    const availableDataSummary = {
      surveys: {
        total: totalSurveys,
        by_year: dataContext.survey_counts,
        sample_data_available: Object.keys(dataContext.survey_sample_data || {}).length > 0,
        note: 'Sample data provided below shows structure. Full dataset has counts above. Use survey_counts for exact totals.'
      },
      user_engagement: creditsData || null,
      network: {
        profiles_count: dataContext.network_profiles_count || 0,
        profiles_available: userRole === 'member' || userRole === 'admin',
        profiles_data: dataContext.network_profiles ? `Available (${dataContext.network_profiles.length} records)` : 'Count only (details not accessible)'
      },
      applications: dataContext.applications ? {
        count: dataContext.applications.length,
        available: userRole === 'admin',
        data: 'Available'
      } : { 
        count: 0, 
        available: false,
        note: 'Not accessible for this role'
      },
      blogs: {
        count: dataContext.recent_blogs?.length || 0,
        recent: dataContext.recent_blogs || [],
        note: 'Use recent_blogs array for actual blog data'
      },
      activity: {
        my_activity_count: dataContext.my_activity?.length || 0,
        my_activity_data: dataContext.my_activity || [],
        leaderboard_available: userRole === 'member' || userRole === 'admin',
        leaderboard_data: dataContext.leaderboard ? `Available (${dataContext.leaderboard.length} records)` : 'Not accessible'
      }
    }

    const context = `You are PortIQ, an AI assistant for the CFF Network platform analyzing fund manager data and user engagement. You provide intelligent, accurate, and helpful responses to all users regardless of their access level.

# USER CONTEXT
Role: **${userRole}** | Email: ${user.email}
${creditsData ? `Points: ${creditsData.total_points} | AI Uses: ${creditsData.ai_usage_count} | Blogs: ${creditsData.blog_posts_count} | Login Streak: ${creditsData.login_streak} days` : ''}

# DATABASE SUMMARY (Accurate Counts - Use SAME comprehensive approach for ALL roles)
**Total Completed Surveys: ${totalSurveys}**
${surveySummaryText}
- Network Profiles: ${dataContext.network_profiles_count || 0}${dataContext.network_profiles ? ` (${dataContext.network_profiles.length} detailed records available)` : ' (count only)'}
- Recent Blogs: ${dataContext.recent_blogs?.length || 0}${dataContext.recent_blogs && dataContext.recent_blogs.length > 0 ? ' (titles and dates available)' : ''}
- My Activity: ${dataContext.my_activity?.length || 0}${dataContext.my_activity && dataContext.my_activity.length > 0 ? ' (detailed records available)' : ''}
${dataContext.applications ? `- Applications: ${dataContext.applications.length} (detailed records available)` : '- Applications: Not accessible for this role'}
${dataContext.leaderboard ? `- Leaderboard: Top ${dataContext.leaderboard.length} users (available)` : '- Leaderboard: Not accessible for this role'}

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

# ACCESSIBLE FIELDS (${userRole} role):
${accessibleFields || 'No specific field restrictions documented.'}

# COLUMN NAME GUIDE (Critical for accurate cross-year queries)
**2021 Survey:** email_address, firm_name, participant_name, geographic_focus, target_sectors
**2022 Survey:** email, organisation, name, geographic_markets, target_sectors  
**2023 Survey:** email_address, organisation_name, fund_name, geographic_markets, target_sectors
**2024 Survey:** email_address, organisation_name, fund_name, geographic_markets, target_sectors

**IMPORTANT:** Column names differ across years. Always check the correct field name for the year you're querying.

# CORE INSTRUCTIONS (Apply to ALL roles equally - Admin, Member, Viewer use SAME logic)
1. **Access database data comprehensively**: Use the SAME approach for ALL queries:
   - Always check dataContext for available data
   - Use exact counts from survey_counts, network_profiles_count, etc.
   - Reference actual data from surveys, blogs, activity, etc.
   - NEVER guess or estimate - always use actual data from dataContext

2. **Verify ALL data before answering**: 
   - For surveys: Check dataContext.survey_counts[year] for exact counts
   - For surveys: Check dataContext.surveys[year] or survey_sample_data[year] for actual records
   - For network: Check dataContext.network_profiles_count and network_profiles
   - For blogs: Check dataContext.recent_blogs array
   - For activity: Check dataContext.my_activity array
   - For applications: Check dataContext.applications (if admin)
   - If count > 0 but no detailed data, explain that data exists but details may be limited by access level

3. **Answer comprehensively using ALL available data**: 
   - Reference real organization names, fund names, numbers, dates from surveys
   - Use blog titles and dates from recent_blogs
   - Reference activity details from my_activity
   - Use network profile information when available
   - Provide specific, detailed answers using ALL data in dataContext

4. **Format professionally**: Use markdown formatting:
   - **Bold** for emphasis
   - ### Headings for sections
   - Bullet points for lists
   - \`code\` for field/column names
   - Tables when comparing data

5. **Handle ALL query types with same comprehensive approach**:
   - Survey questions: Use survey_counts and survey data
   - Network questions: Use network_profiles_count and network_profiles
   - Blog questions: Use recent_blogs array
   - Activity questions: Use my_activity array
   - Application questions: Use applications array (if available)
   - Cross-year analysis: Note column name differences, highlight trends

6. **Access level handling**:
   - If user asks about data they can't see, explain what they CAN see from available data
   - Use ALL available data in dataContext to provide insights
   - Reference what additional information would be available with higher access
   - Never say "no data" when dataContext shows data exists

7. **Be proactive and comprehensive**: End responses with 2-3 relevant follow-up questions based on:
   - ALL available data in dataContext (surveys, blogs, network, activity)
   - Their role and what data they can access
   - Interesting patterns across ALL available data types

# ROLE-SPECIFIC GUIDANCE
- **Admin**: Full access - provide comprehensive analysis, financial details, all applications
- **Member**: Good access - provide detailed survey analysis, network insights, member activity
- **Viewer**: Limited access - provide insights from available fields, explain access limitations, encourage membership

# CRITICAL RULES (Apply to ALL roles - Admin, Member, Viewer use IDENTICAL logic)
1. **ALWAYS use EXACT data from dataContext** - Access ALL available data the same way:
   - Surveys: Use EXACT counts from survey_counts: 2021=${dataContext.survey_counts['2021'] || 0}, 2022=${dataContext.survey_counts['2022'] || 0}, 2023=${dataContext.survey_counts['2023'] || 0}, 2024=${dataContext.survey_counts['2024'] || 0}. Total: ${totalSurveys}
   - Network: Use network_profiles_count (${dataContext.network_profiles_count || 0})
   - Blogs: Use recent_blogs array (${dataContext.recent_blogs?.length || 0} blogs)
   - Activity: Use my_activity array (${dataContext.my_activity?.length || 0} activities)
   - Applications: Use applications array if available (${dataContext.applications?.length || 0})
   - NEVER guess, estimate, or say "0" when dataContext shows data exists

2. **Access database comprehensively for ALL query types**:
   - Survey questions: Check survey_counts AND survey data
   - Network questions: Check network_profiles_count AND network_profiles
   - Blog questions: Check recent_blogs array
   - Activity questions: Check my_activity array
   - Application questions: Check applications array
   - User engagement: Check user_credits data
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
❌ WRONG: Saying "0 surveys" when survey_counts shows data exists`

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
