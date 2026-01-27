import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CompanyResult {
  name: string
  year: number
  email: string
  displayName: string // Name with year for display
}

// Common words to ignore in search (stop words)
const COMMON_WORDS = new Set([
  'fund', 'funds', 'funding',
  'growth', 'capital', 'venture', 'private', 'equity',
  'management', 'managers', 'group', 'partners', 'partnership',
  'limited', 'ltd', 'inc', 'incorporated', 'llc',
  'investment', 'investments', 'investors',
  'the', 'a', 'an', 'and', 'or', 'of', 'for', 'in', 'on', 'at', 'to', 'with'
])

// Helper to normalize company names for comparison
const normalizeName = (name: string): string => {
  return name.toLowerCase().trim().replace(/\s+/g, ' ')
}

// Extract significant (non-common) words from search term
const getSignificantWords = (searchTerm: string): string[] => {
  const words = searchTerm.toLowerCase().split(/\s+/)
    .filter(w => w.length >= 3) // At least 3 characters
    .filter(w => !COMMON_WORDS.has(w)) // Filter out common words
  return words
}

// Helper to calculate relevance score for sorting
const calculateRelevance = (name: string, searchTerm: string): number => {
  const normalizedName = normalizeName(name)
  const normalizedSearch = normalizeName(searchTerm)
  
  // Exact match = highest score
  if (normalizedName === normalizedSearch) return 100
  
  // Starts with search term = high score
  if (normalizedName.startsWith(normalizedSearch)) return 80
  
  // Contains search term = medium-high score
  if (normalizedName.includes(normalizedSearch)) return 60
  
  // Check if significant words match
  const significantWords = getSignificantWords(searchTerm)
  if (significantWords.length > 0) {
    const nameWords = normalizedName.split(/\s+/)
    const matchingSignificantWords = significantWords.filter(sw => 
      nameWords.some(nw => nw.includes(sw) || sw.includes(nw))
    )
    
    // If all significant words match = medium score
    if (matchingSignificantWords.length === significantWords.length && significantWords.length >= 2) {
      return 50
    }
    
    // If most significant words match = low-medium score
    if (matchingSignificantWords.length >= Math.ceil(significantWords.length * 0.7) && significantWords.length >= 2) {
      return 30
    }
    
    // If at least one significant word matches = low score
    if (matchingSignificantWords.length > 0) {
      return 20
    }
  }
  
  return 10
}

// Check if a result is relevant enough to include (minimum relevance threshold)
const isRelevant = (name: string, searchTerm: string): boolean => {
  const score = calculateRelevance(name, searchTerm)
  // Only include results with score >= 20 (at least one significant word match or contains search term)
  return score >= 20
}

// Search companies in a specific survey table
async function searchSurveyTable(
  supabase: any,
  table: string,
  nameField: string,
  emailField: string,
  year: number,
  searchTerm: string
): Promise<CompanyResult[]> {
  const results: CompanyResult[] = []
  const seen = new Set<string>()
  
  try {
    const significantWords = getSignificantWords(searchTerm)
    
    // Strategy 1: Full phrase match (most specific)
    const searchPattern = `%${searchTerm}%`
    let { data, error } = await supabase
      .from(table)
      .select(`${nameField}, ${emailField}`)
      .not(nameField, 'is', null)
      .ilike(nameField, searchPattern)
      .limit(200)
    
    if (error) {
      console.error(`Error searching ${table} with full phrase:`, error)
    } else if (data && data.length > 0) {
      for (const row of data) {
        const name = row[nameField]
        if (!name) continue
        // Only add if relevant
        if (isRelevant(name, searchTerm)) {
          const key = `${normalizeName(name)}-${year}`
          if (!seen.has(key)) {
            seen.add(key)
            results.push({
              name,
              year,
              email: row[emailField] || '',
              displayName: `${name} (${year})`
            })
          }
        }
      }
    }
    
    // Strategy 2: If we have significant words, try matching on them (but require at least 2 significant words to match)
    if (significantWords.length >= 2 && results.length < 20) {
      // Build AND query - require ALL significant words to be present
      const andConditions = significantWords.map(word => `${nameField}.ilike.%${word}%`)
      // Use a single query that requires all words (PostgreSQL pattern)
      // We'll filter in code to ensure all words match
      
      const { data: wordData, error: wordError } = await supabase
        .from(table)
        .select(`${nameField}, ${emailField}`)
        .not(nameField, 'is', null)
        .or(andConditions.join(','))
        .limit(500) // Get more to filter
      
      if (wordError) {
        console.error(`Error searching ${table} with words:`, wordError)
      } else if (wordData) {
        for (const row of wordData) {
          const name = row[nameField]
          if (!name) continue
          
          // Verify that ALL significant words are present in the name
          const nameLower = normalizeName(name)
          const allWordsMatch = significantWords.every(sw => nameLower.includes(sw))
          
          if (allWordsMatch && isRelevant(name, searchTerm)) {
            const key = `${normalizeName(name)}-${year}`
            if (!seen.has(key)) {
              seen.add(key)
              results.push({
                name,
                year,
                email: row[emailField] || '',
                displayName: `${name} (${year})`
              })
            }
          }
        }
      }
    }
    
    // Strategy 3: If we have at least one very significant word (5+ chars), try matching just that
    if (results.length < 10 && significantWords.length > 0) {
      const verySignificantWords = significantWords.filter(w => w.length >= 5)
      if (verySignificantWords.length > 0) {
        // Use the longest/most unique word
        const primaryWord = verySignificantWords.sort((a, b) => b.length - a.length)[0]
        
        const { data: primaryData, error: primaryError } = await supabase
          .from(table)
          .select(`${nameField}, ${emailField}`)
          .not(nameField, 'is', null)
          .ilike(nameField, `%${primaryWord}%`)
          .limit(100)
        
        if (primaryError) {
          console.error(`Error searching ${table} with primary word:`, primaryError)
        } else if (primaryData) {
          for (const row of primaryData) {
            const name = row[nameField]
            if (!name) continue
            // Only add if it has good relevance (at least 20)
            if (isRelevant(name, searchTerm)) {
              const key = `${normalizeName(name)}-${year}`
              if (!seen.has(key)) {
                seen.add(key)
                results.push({
                  name,
                  year,
                  email: row[emailField] || '',
                  displayName: `${name} (${year})`
                })
              }
            }
          }
        }
      }
    }
    
    // Strategy 4: If still no results, try removing spaces (e.g., "AgriFrontier" matches "Agri Frontier")
    if (results.length === 0 && searchTerm.includes(' ')) {
      const noSpaceTerm = searchTerm.replace(/\s+/g, '')
      const { data: noSpaceData, error: noSpaceError } = await supabase
        .from(table)
        .select(`${nameField}, ${emailField}`)
        .not(nameField, 'is', null)
        .ilike(nameField, `%${noSpaceTerm}%`)
        .limit(200)
      
      if (noSpaceError) {
        console.error(`Error searching ${table} with no spaces:`, noSpaceError)
      } else if (noSpaceData) {
        for (const row of noSpaceData) {
          const name = row[nameField]
          if (!name) continue
          if (isRelevant(name, searchTerm)) {
            const key = `${normalizeName(name)}-${year}`
            if (!seen.has(key)) {
              seen.add(key)
              results.push({
                name,
                year,
                email: row[emailField] || '',
                displayName: `${name} (${year})`
              })
            }
          }
        }
      }
    }
    
  } catch (err) {
    console.error(`Unexpected error searching ${table}:`, err)
  }
  
  return results
}

// Search companies in 2023/2024 tables (which have both organisation_name and fund_name)
async function searchSurveyTableWithFund(
  supabase: any,
  table: string,
  year: number,
  searchTerm: string
): Promise<CompanyResult[]> {
  const results: CompanyResult[] = []
  const seen = new Set<string>()
  
  try {
    const significantWords = getSignificantWords(searchTerm)
    
    // Strategy 1: Full phrase match on both fields
    const searchPattern = `%${searchTerm}%`
    let { data, error } = await supabase
      .from(table)
      .select('organisation_name, fund_name, email_address')
      .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
      .limit(200)
    
    if (error) {
      console.error(`Error searching ${table} with full phrase:`, error)
    } else if (data) {
      for (const row of data) {
        // Check organisation_name
        if (row.organisation_name && isRelevant(row.organisation_name, searchTerm)) {
          const key = `${normalizeName(row.organisation_name)}-${year}`
          if (!seen.has(key)) {
            seen.add(key)
            results.push({
              name: row.organisation_name,
              year,
              email: row.email_address || '',
              displayName: `${row.organisation_name} (${year})`
            })
          }
        }
        
        // Check fund_name (if different from org name)
        if (row.fund_name && row.fund_name !== row.organisation_name && isRelevant(row.fund_name, searchTerm)) {
          const key = `${normalizeName(row.fund_name)}-${year}`
          if (!seen.has(key)) {
            seen.add(key)
            results.push({
              name: row.fund_name,
              year,
              email: row.email_address || '',
              displayName: `${row.fund_name} (${year})`
            })
          }
        }
      }
    }
    
    // Strategy 2: If we have significant words, require ALL to match
    if (significantWords.length >= 2 && results.length < 20) {
      const andConditions = significantWords.map(w => `organisation_name.ilike.%${w}%`)
      const fundConditions = significantWords.map(w => `fund_name.ilike.%${w}%`)
      const allConditions = [...andConditions, ...fundConditions].join(',')
      
      const { data: wordData, error: wordError } = await supabase
        .from(table)
        .select('organisation_name, fund_name, email_address')
        .or(allConditions)
        .limit(500)
      
      if (wordError) {
        console.error(`Error searching ${table} with words:`, wordError)
      } else if (wordData) {
        for (const row of wordData) {
          if (row.organisation_name) {
            const nameLower = normalizeName(row.organisation_name)
            const allWordsMatch = significantWords.every(sw => nameLower.includes(sw))
            if (allWordsMatch && isRelevant(row.organisation_name, searchTerm)) {
              const key = `${normalizeName(row.organisation_name)}-${year}`
              if (!seen.has(key)) {
                seen.add(key)
                results.push({
                  name: row.organisation_name,
                  year,
                  email: row.email_address || '',
                  displayName: `${row.organisation_name} (${year})`
                })
              }
            }
          }
          if (row.fund_name && row.fund_name !== row.organisation_name) {
            const nameLower = normalizeName(row.fund_name)
            const allWordsMatch = significantWords.every(sw => nameLower.includes(sw))
            if (allWordsMatch && isRelevant(row.fund_name, searchTerm)) {
              const key = `${normalizeName(row.fund_name)}-${year}`
              if (!seen.has(key)) {
                seen.add(key)
                results.push({
                  name: row.fund_name,
                  year,
                  email: row.email_address || '',
                  displayName: `${row.fund_name} (${year})`
                })
              }
            }
          }
        }
      }
    }
    
    // Strategy 3: Match on most significant word (5+ chars) if we have one
    if (results.length < 10 && significantWords.length > 0) {
      const verySignificantWords = significantWords.filter(w => w.length >= 5)
      if (verySignificantWords.length > 0) {
        const primaryWord = verySignificantWords.sort((a, b) => b.length - a.length)[0]
        
        const { data: primaryData, error: primaryError } = await supabase
          .from(table)
          .select('organisation_name, fund_name, email_address')
          .or(`organisation_name.ilike.%${primaryWord}%,fund_name.ilike.%${primaryWord}%`)
          .limit(100)
        
        if (primaryError) {
          console.error(`Error searching ${table} with primary word:`, primaryError)
        } else if (primaryData) {
          for (const row of primaryData) {
            if (row.organisation_name && isRelevant(row.organisation_name, searchTerm)) {
              const key = `${normalizeName(row.organisation_name)}-${year}`
              if (!seen.has(key)) {
                seen.add(key)
                results.push({
                  name: row.organisation_name,
                  year,
                  email: row.email_address || '',
                  displayName: `${row.organisation_name} (${year})`
                })
              }
            }
            if (row.fund_name && row.fund_name !== row.organisation_name && isRelevant(row.fund_name, searchTerm)) {
              const key = `${normalizeName(row.fund_name)}-${year}`
              if (!seen.has(key)) {
                seen.add(key)
                results.push({
                  name: row.fund_name,
                  year,
                  email: row.email_address || '',
                  displayName: `${row.fund_name} (${year})`
                })
              }
            }
          }
        }
      }
    }
    
    // Strategy 4: Try without spaces
    if (results.length === 0 && searchTerm.includes(' ')) {
      const noSpaceTerm = searchTerm.replace(/\s+/g, '')
      const { data: noSpaceData, error: noSpaceError } = await supabase
        .from(table)
        .select('organisation_name, fund_name, email_address')
        .or(`organisation_name.ilike.%${noSpaceTerm}%,fund_name.ilike.%${noSpaceTerm}%`)
        .limit(200)
      
      if (noSpaceError) {
        console.error(`Error searching ${table} with no spaces:`, noSpaceError)
      } else if (noSpaceData) {
        for (const row of noSpaceData) {
          if (row.organisation_name && isRelevant(row.organisation_name, searchTerm)) {
            const key = `${normalizeName(row.organisation_name)}-${year}`
            if (!seen.has(key)) {
              seen.add(key)
              results.push({
                name: row.organisation_name,
                year,
                email: row.email_address || '',
                displayName: `${row.organisation_name} (${year})`
              })
            }
          }
          if (row.fund_name && row.fund_name !== row.organisation_name && isRelevant(row.fund_name, searchTerm)) {
            const key = `${normalizeName(row.fund_name)}-${year}`
            if (!seen.has(key)) {
              seen.add(key)
              results.push({
                name: row.fund_name,
                year,
                email: row.email_address || '',
                displayName: `${row.fund_name} (${year})`
              })
            }
          }
        }
      }
    }
    
  } catch (err) {
    console.error(`Unexpected error searching ${table}:`, err)
  }
  
  return results
}

// Find user by email (optimized)
async function findUserByEmail(supabase: any, email: string): Promise<{ id: string; exists: boolean } | null> {
  const emailLower = email.toLowerCase().trim()
  
  // Try to find user by paginating (Supabase doesn't have direct email lookup in admin API)
  // But limit to first few pages for performance
  for (let page = 1; page <= 3; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000
    })
    
    if (error) {
      console.error('Error listing users:', error)
      break
    }
    
    const users = data?.users || []
    const matchingUser = users.find(u => {
      const userEmail = u.email?.toLowerCase().trim()
      return userEmail === emailLower
    })
    
    if (matchingUser) {
      return { id: matchingUser.id, exists: true }
    }
    
    // If we got fewer users than perPage, we've reached the end
    if (users.length < 1000) {
      break
    }
  }
  
  return null
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { action, companyName, selectedCompanies, primaryEmail } = await req.json()

    // Helper function for regular search (fallback)
    async function handleRegularSearch(supabase: any, searchTerm: string) {
      console.log('[Company Lookup] Falling back to regular search')
      
      // Search all survey tables in parallel
      const [results2021, results2022, results2023, results2024] = await Promise.all([
        searchSurveyTable(supabase, 'survey_responses_2021', 'firm_name', 'email_address', 2021, searchTerm),
        searchSurveyTable(supabase, 'survey_responses_2022', 'organisation', 'email', 2022, searchTerm),
        searchSurveyTableWithFund(supabase, 'survey_responses_2023', 2023, searchTerm),
        searchSurveyTableWithFund(supabase, 'survey_responses_2024', 2024, searchTerm)
      ])
      
      const allResults = [...results2021, ...results2022, ...results2023, ...results2024]
      const relevantResults = allResults.filter(r => isRelevant(r.name, searchTerm))
      
      relevantResults.sort((a, b) => {
        const scoreA = calculateRelevance(a.name, searchTerm)
        const scoreB = calculateRelevance(b.name, searchTerm)
        if (scoreB !== scoreA) return scoreB - scoreA
        const nameMatch = normalizeName(a.name).localeCompare(normalizeName(b.name))
        if (nameMatch !== 0) return nameMatch
        return b.year - a.year
      })
      
      const limitedResults = relevantResults.slice(0, 50)
      
      return new Response(
        JSON.stringify({ 
          companies: limitedResults.map(r => r.displayName),
          companyDetails: limitedResults.map(r => ({ 
            displayName: r.displayName,
            name: r.name,
            year: r.year,
            email: r.email
          }))
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Action 1: AI-powered intelligent company search
    if (action === 'aiSearch' || action === 'search') {
      if (!companyName || companyName.trim().length < 2) {
        return new Response(
          JSON.stringify({ companies: [], error: 'Search term must be at least 2 characters' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const searchTerm = companyName.trim()
      console.log(`[Company Lookup AI] AI-powered search for: "${searchTerm}"`)
      
      try {
        // Step 1: Fetch all unique company names from all survey tables
        console.log('[Company Lookup AI] Fetching all company names from database...')
        const [data2021, data2022, data2023, data2024] = await Promise.all([
          supabase.from('survey_responses_2021')
            .select('firm_name, email_address')
            .not('firm_name', 'is', null),
          supabase.from('survey_responses_2022')
            .select('organisation, email')
            .not('organisation', 'is', null),
          supabase.from('survey_responses_2023')
            .select('organisation_name, fund_name, email_address'),
          supabase.from('survey_responses_2024')
            .select('organisation_name, fund_name, email_address')
        ])

        // Collect all unique company names with their years and emails
        const allCompanies: Array<{ name: string; year: number; email: string }> = []
        const seen = new Set<string>()

        // Process 2021
        if (data2021.data) {
          for (const row of data2021.data) {
            if (row.firm_name) {
              const key = `${normalizeName(row.firm_name)}-2021`
              if (!seen.has(key)) {
                seen.add(key)
                allCompanies.push({
                  name: row.firm_name,
                  year: 2021,
                  email: row.email_address || ''
                })
              }
            }
          }
        }

        // Process 2022
        if (data2022.data) {
          for (const row of data2022.data) {
            if (row.organisation) {
              const key = `${normalizeName(row.organisation)}-2022`
              if (!seen.has(key)) {
                seen.add(key)
                allCompanies.push({
                  name: row.organisation,
                  year: 2022,
                  email: row.email || ''
                })
              }
            }
          }
        }

        // Process 2023
        if (data2023.data) {
          for (const row of data2023.data) {
            if (row.organisation_name) {
              const key = `${normalizeName(row.organisation_name)}-2023`
              if (!seen.has(key)) {
                seen.add(key)
                allCompanies.push({
                  name: row.organisation_name,
                  year: 2023,
                  email: row.email_address || ''
                })
              }
            }
            if (row.fund_name && row.fund_name !== row.organisation_name) {
              const key = `${normalizeName(row.fund_name)}-2023`
              if (!seen.has(key)) {
                seen.add(key)
                allCompanies.push({
                  name: row.fund_name,
                  year: 2023,
                  email: row.email_address || ''
                })
              }
            }
          }
        }

        // Process 2024
        if (data2024.data) {
          for (const row of data2024.data) {
            if (row.organisation_name) {
              const key = `${normalizeName(row.organisation_name)}-2024`
              if (!seen.has(key)) {
                seen.add(key)
                allCompanies.push({
                  name: row.organisation_name,
                  year: 2024,
                  email: row.email_address || ''
                })
              }
            }
            if (row.fund_name && row.fund_name !== row.organisation_name) {
              const key = `${normalizeName(row.fund_name)}-2024`
              if (!seen.has(key)) {
                seen.add(key)
                allCompanies.push({
                  name: row.fund_name,
                  year: 2024,
                  email: row.email_address || ''
                })
              }
            }
          }
        }

        console.log(`[Company Lookup AI] Found ${allCompanies.length} unique companies in database`)

        // Step 2: Send to AI for intelligent matching
        const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY')
        if (!LOVABLE_API_KEY) {
          console.error('[Company Lookup AI] LOVABLE_API_KEY not configured, falling back to regular search')
          // Fall back to regular search
          return await handleRegularSearch(supabase, searchTerm)
        }

        // Prepare company list for AI (limit to prevent token overflow)
        const companyList = allCompanies.slice(0, 2000).map((c, idx) => 
          `${idx + 1}. "${c.name}" (Year: ${c.year})`
        ).join('\n')

        const aiPrompt = `You are an expert at matching company names. A user is searching for a company called "${searchTerm}".

Below is a list of all companies in our database. Your task is to identify which companies from this list match or are likely the same as "${searchTerm}".

Consider:
- Exact matches
- Variations in spelling (e.g., "AgriFrontier" vs "Agri Frontier")
- Abbreviations (e.g., "ABC Fund" vs "ABC Growth Fund")
- Common name variations
- Companies that are clearly the same entity even if names differ slightly

Return ONLY a JSON array of the matching company names (the exact names as they appear in the list), ordered by relevance (most relevant first). If no matches, return an empty array [].

Company list:
${companyList}

Return format (JSON only, no other text):
["Company Name 1", "Company Name 2", ...]`

        console.log('[Company Lookup AI] Sending to AI for intelligent matching...')
        const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: 'You are a company name matching expert. Return only valid JSON arrays, no explanations.'
              },
              {
                role: 'user',
                content: aiPrompt
              }
            ],
            temperature: 0.3, // Lower temperature for more consistent matching
            max_tokens: 2000
          }),
        })

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text()
          console.error('[Company Lookup AI] AI API error:', aiResponse.status, errorText)
          // Fall back to regular search on AI error
          return await handleRegularSearch(supabase, searchTerm)
        }

        const aiData = await aiResponse.json()
        const aiText = aiData.choices?.[0]?.message?.content || '[]'
        
        // Parse AI response (might be JSON or text with JSON)
        let matchedNames: string[] = []
        try {
          // Try to extract JSON from response
          const jsonMatch = aiText.match(/\[.*\]/s)
          if (jsonMatch) {
            matchedNames = JSON.parse(jsonMatch[0])
          } else {
            matchedNames = JSON.parse(aiText)
          }
        } catch (parseError) {
          console.error('[Company Lookup AI] Failed to parse AI response:', aiText)
          // Fall back to regular search
          return await handleRegularSearch(supabase, searchTerm)
        }

        console.log(`[Company Lookup AI] AI found ${matchedNames.length} matching companies`)

        // Step 3: Map AI-matched names back to full company details with years
        const matchedCompanies: CompanyResult[] = []
        const matchedSet = new Set(matchedNames.map(n => normalizeName(n)))

        for (const company of allCompanies) {
          if (matchedSet.has(normalizeName(company.name))) {
            matchedCompanies.push({
              name: company.name,
              year: company.year,
              email: company.email,
              displayName: `${company.name} (${company.year})`
            })
          }
        }

        // Sort by year (newer first) and then by name
        matchedCompanies.sort((a, b) => {
          if (b.year !== a.year) return b.year - a.year
          return normalizeName(a.name).localeCompare(normalizeName(b.name))
        })

        // Limit to top 50
        const limitedResults = matchedCompanies.slice(0, 50)

        console.log(`[Company Lookup AI] Returning ${limitedResults.length} AI-matched results`)

        return new Response(
          JSON.stringify({
            companies: limitedResults.map(r => r.displayName),
            companyDetails: limitedResults.map(r => ({
              displayName: r.displayName,
              name: r.name,
              year: r.year,
              email: r.email
            })),
            aiPowered: true
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      } catch (aiError) {
        console.error('[Company Lookup AI] Error during AI search:', aiError)
        // Fall back to regular search on any error
        return await handleRegularSearch(supabase, searchTerm)
      }
    }

    // Action 1 (Legacy): Real-time search as user types - shows ALL matches including same name different years
    if (action === 'legacySearch') {
      if (!companyName || companyName.trim().length < 2) {
        return new Response(
          JSON.stringify({ companies: [], error: 'Search term must be at least 2 characters' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const searchTerm = companyName.trim()
      console.log(`[Company Lookup] Searching for: "${searchTerm}"`)
      
      try {
        // Search all survey tables in parallel
        const [results2021, results2022, results2023, results2024] = await Promise.all([
          searchSurveyTable(supabase, 'survey_responses_2021', 'firm_name', 'email_address', 2021, searchTerm),
          searchSurveyTable(supabase, 'survey_responses_2022', 'organisation', 'email', 2022, searchTerm),
          searchSurveyTableWithFund(supabase, 'survey_responses_2023', 2023, searchTerm),
          searchSurveyTableWithFund(supabase, 'survey_responses_2024', 2024, searchTerm)
        ])
        
        console.log(`[Company Lookup] Results: 2021=${results2021.length}, 2022=${results2022.length}, 2023=${results2023.length}, 2024=${results2024.length}`)

        // Combine all results - DON'T deduplicate, show all variations
        const allResults = [...results2021, ...results2022, ...results2023, ...results2024]
        
        console.log(`[Company Lookup] Total results before sorting: ${allResults.length}`)
        
        // Filter out low-relevance results and sort by relevance
        const relevantResults = allResults.filter(r => isRelevant(r.name, searchTerm))
        
        relevantResults.sort((a, b) => {
          const scoreA = calculateRelevance(a.name, searchTerm)
          const scoreB = calculateRelevance(b.name, searchTerm)
          if (scoreB !== scoreA) return scoreB - scoreA // Higher score first
          
          // If same relevance, prefer exact name matches, then by year (newer first)
          const nameMatch = normalizeName(a.name).localeCompare(normalizeName(b.name))
          if (nameMatch !== 0) return nameMatch
          return b.year - a.year
        })
        
        // Limit to top 50 results to prevent overwhelming the UI
        const limitedResults = relevantResults.slice(0, 50)
        
        console.log(`[Company Lookup] Returning ${limitedResults.length} results`)
        
        // Return both display names (with year) and actual names for selection
        return new Response(
          JSON.stringify({ 
            companies: limitedResults.map(r => r.displayName), // Display names with year
            companyDetails: limitedResults.map(r => ({ 
              displayName: r.displayName,
              name: r.name,
              year: r.year,
              email: r.email
            }))
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (searchError) {
        console.error('[Company Lookup] Error during search:', searchError)
        return new Response(
          JSON.stringify({ 
            companies: [], 
            error: searchError.message || 'Search failed',
            details: String(searchError)
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

    // Action 2: Get all surveys for selected companies
    if (action === 'getSurveys') {
      if (!selectedCompanies || selectedCompanies.length === 0) {
        return new Response(
          JSON.stringify({ surveys: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const surveys: Array<{
        year: number
        company: string
        email: string
        id: number
        table: string
      }> = []

      // Extract company name and year from display name (format: "Company Name (2021)")
      const parseCompanyName = (displayName: string): { name: string; year?: number } => {
        const match = displayName.match(/^(.+?)\s*\((\d{4})\)$/)
        if (match) {
          return { name: match[1].trim(), year: parseInt(match[2]) }
        }
        return { name: displayName.trim() }
      }

      for (const displayName of selectedCompanies) {
        const { name: companyName, year: targetYear } = parseCompanyName(displayName)
        const searchTerm = companyName.toLowerCase()

        // If year is specified, only search that year's table
        // Otherwise search all tables
        const yearsToSearch = targetYear ? [targetYear] : [2021, 2022, 2023, 2024]

        for (const year of yearsToSearch) {
          if (year === 2021) {
            const { data } = await supabase
              .from('survey_responses_2021')
              .select('id, firm_name, email_address')
              .ilike('firm_name', `%${searchTerm}%`)
            
            if (data) {
              for (const row of data) {
                if (normalizeName(row.firm_name) === normalizeName(companyName)) {
                  surveys.push({
                    year: 2021,
                    company: row.firm_name,
                    email: row.email_address || '',
                    id: row.id,
                    table: 'survey_responses_2021'
                  })
                }
              }
            }
          } else if (year === 2022) {
            const { data } = await supabase
              .from('survey_responses_2022')
              .select('id, organisation, email')
              .ilike('organisation', `%${searchTerm}%`)
            
            if (data) {
              for (const row of data) {
                if (normalizeName(row.organisation) === normalizeName(companyName)) {
                  surveys.push({
                    year: 2022,
                    company: row.organisation,
                    email: row.email || '',
                    id: row.id,
                    table: 'survey_responses_2022'
                  })
                }
              }
            }
          } else if (year === 2023) {
            const { data } = await supabase
              .from('survey_responses_2023')
              .select('id, organisation_name, fund_name, email_address')
              .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
            
            if (data) {
              for (const row of data) {
                const matchName = row.organisation_name || row.fund_name
                if (matchName && normalizeName(matchName) === normalizeName(companyName)) {
                  surveys.push({
                    year: 2023,
                    company: matchName,
                    email: row.email_address || '',
                    id: row.id,
                    table: 'survey_responses_2023'
                  })
                }
              }
            }
          } else if (year === 2024) {
            const { data } = await supabase
              .from('survey_responses_2024')
              .select('id, organisation_name, fund_name, email_address')
              .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
            
            if (data) {
              for (const row of data) {
                const matchName = row.organisation_name || row.fund_name
                if (matchName && normalizeName(matchName) === normalizeName(companyName)) {
                  surveys.push({
                    year: 2024,
                    company: matchName,
                    email: row.email_address || '',
                    id: row.id,
                    table: 'survey_responses_2024'
                  })
                }
              }
            }
          }
        }
      }

      return new Response(
        JSON.stringify({ surveys }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Action 3: Get all emails for selected companies (kept for backward compatibility)
    if (action === 'getEmails') {
      if (!selectedCompanies || selectedCompanies.length === 0) {
        return new Response(
          JSON.stringify({ emails: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const emailsWithDetails: { email: string; company: string; year: number }[] = []
      const seenEmails = new Set<string>()

      // Parse company names from display format
      const parseCompanyName = (displayName: string): { name: string; year?: number } => {
        const match = displayName.match(/^(.+?)\s*\((\d{4})\)$/)
        if (match) {
          return { name: match[1].trim(), year: parseInt(match[2]) }
        }
        return { name: displayName.trim() }
      }

      for (const displayName of selectedCompanies) {
        const { name: companyName } = parseCompanyName(displayName)
        const searchTerm = companyName.toLowerCase()

        // Search all tables in parallel
        const [data2021, data2022, data2023, data2024] = await Promise.all([
          supabase.from('survey_responses_2021')
            .select('firm_name, email_address')
            .ilike('firm_name', `%${searchTerm}%`),
          supabase.from('survey_responses_2022')
            .select('organisation, email')
            .ilike('organisation', `%${searchTerm}%`),
          supabase.from('survey_responses_2023')
            .select('organisation_name, fund_name, email_address')
            .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`),
          supabase.from('survey_responses_2024')
            .select('organisation_name, fund_name, email_address')
            .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
        ])

        // Process 2021
        if (data2021.data) {
          for (const row of data2021.data) {
            if (row.email_address && !seenEmails.has(row.email_address)) {
              seenEmails.add(row.email_address)
              emailsWithDetails.push({ 
                email: row.email_address, 
                company: row.firm_name, 
                year: 2021 
              })
            }
          }
        }

        // Process 2022
        if (data2022.data) {
          for (const row of data2022.data) {
            if (row.email && !seenEmails.has(row.email)) {
              seenEmails.add(row.email)
              emailsWithDetails.push({ 
                email: row.email, 
                company: row.organisation, 
                year: 2022 
              })
            }
          }
        }

        // Process 2023
        if (data2023.data) {
          for (const row of data2023.data) {
            if (row.email_address && !seenEmails.has(row.email_address)) {
              seenEmails.add(row.email_address)
              emailsWithDetails.push({ 
                email: row.email_address, 
                company: row.organisation_name || row.fund_name, 
                year: 2023 
              })
            }
          }
        }

        // Process 2024
        if (data2024.data) {
          for (const row of data2024.data) {
            if (row.email_address && !seenEmails.has(row.email_address)) {
              seenEmails.add(row.email_address)
              emailsWithDetails.push({ 
                email: row.email_address, 
                company: row.organisation_name || row.fund_name, 
                year: 2024 
              })
            }
          }
        }
      }

      return new Response(
        JSON.stringify({ emails: emailsWithDetails }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Action 4: Consolidate surveys to primary email and create user account
    if (action === 'consolidate') {
      if (!primaryEmail || !selectedCompanies || selectedCompanies.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const defaultPassword = '@ESCPNetwork2025#'
      const results = {
        updated2021: 0,
        updated2022: 0,
        updated2023: 0,
        updated2024: 0,
        userCreated: false,
        userId: null as string | null,
        errors: [] as string[]
      }

      // Step 1: Check if user already exists
      let userId: string | null = null
      let userExists = false
      
      const userResult = await findUserByEmail(supabase, primaryEmail)
      
      if (userResult) {
        userId = userResult.id
        userExists = true
        results.userCreated = false
        
        // Update existing user's password
        const { error: updatePasswordError } = await supabase.auth.admin.updateUserById(
          userId,
          { 
            password: defaultPassword,
            email_confirm: true
          }
        )
        
        if (updatePasswordError) {
          console.error('Error updating password:', updatePasswordError)
          results.errors.push(`Password update: ${updatePasswordError.message}`)
        }
        
        // Ensure user profile exists
        await supabase
          .from('user_profiles')
          .upsert({
            id: userId,
            email: primaryEmail,
            company_name: selectedCompanies[0].replace(/\s*\(\d{4}\)$/, '') // Remove year suffix
          }, { onConflict: 'id' })
        
        // Ensure user role exists
        await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            email: primaryEmail,
            role: 'viewer'
          }, { onConflict: 'user_id' })
      }

      if (!userExists) {
        // Step 2: Create new auth user
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: primaryEmail,
          password: defaultPassword,
          email_confirm: true,
          user_metadata: {
            company_consolidated: true,
            consolidated_at: new Date().toISOString()
          }
        })

        if (createError) {
          results.errors.push(`User creation: ${createError.message}`)
          return new Response(
            JSON.stringify({ 
              success: false,
              error: `Failed to create user: ${createError.message}`,
              details: results
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        if (!newUser?.user) {
          return new Response(
            JSON.stringify({ 
              success: false,
              error: 'User creation succeeded but no user data returned',
              details: results
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }

        userId = newUser.user.id
        results.userCreated = true
        results.userId = userId

        // Step 3: Create user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: primaryEmail,
            company_name: selectedCompanies[0].replace(/\s*\(\d{4}\)$/, '') // Remove year suffix
          })

        if (profileError && !profileError.message.includes('duplicate')) {
          results.errors.push(`Profile creation: ${profileError.message}`)
        }

        // Step 4: Assign default viewer role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            email: primaryEmail,
            role: 'viewer'
          })

        if (roleError && !roleError.message.includes('duplicate')) {
          results.errors.push(`Role assignment: ${roleError.message}`)
        }
      }

      if (!userId) {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to create or find user account',
            details: results
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Step 5: Update all survey records to use the primary email and link to user_id
      // Parse company names from display format
      const parseCompanyName = (displayName: string): { name: string; year?: number } => {
        const match = displayName.match(/^(.+?)\s*\((\d{4})\)$/)
        if (match) {
          return { name: match[1].trim(), year: parseInt(match[2]) }
        }
        return { name: displayName.trim() }
      }

      for (const displayName of selectedCompanies) {
        const { name: companyName, year: targetYear } = parseCompanyName(displayName)
        const searchTerm = companyName.toLowerCase()

        // Update surveys for the specific year if specified, otherwise update all matching
        const yearsToUpdate = targetYear ? [targetYear] : [2021, 2022, 2023, 2024]

        for (const year of yearsToUpdate) {
          if (year === 2021) {
            const { data: surveys2021 } = await supabase
              .from('survey_responses_2021')
              .select('id, user_id')
              .ilike('firm_name', `%${searchTerm}%`)
              .limit(1)
            
            if (surveys2021 && surveys2021.length > 0) {
              const survey = surveys2021[0]
              const { error: err2021 } = await supabase
                .from('survey_responses_2021')
                .update({ 
                  email_address: primaryEmail,
                  user_id: userId
                })
                .eq('id', survey.id)
              
              if (!err2021) results.updated2021 = 1
              else results.errors.push(`2021: ${err2021.message}`)
            }
          } else if (year === 2022) {
            const { data: surveys2022 } = await supabase
              .from('survey_responses_2022')
              .select('id, user_id')
              .ilike('organisation', `%${searchTerm}%`)
              .limit(1)
            
            if (surveys2022 && surveys2022.length > 0) {
              const survey = surveys2022[0]
              const { error: err2022 } = await supabase
                .from('survey_responses_2022')
                .update({ 
                  email: primaryEmail,
                  user_id: userId
                })
                .eq('id', survey.id)
              
              if (!err2022) results.updated2022 = 1
              else results.errors.push(`2022: ${err2022.message}`)
            }
          } else if (year === 2023) {
            const { data: surveys2023 } = await supabase
              .from('survey_responses_2023')
              .select('id, user_id')
              .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
              .limit(1)
            
            if (surveys2023 && surveys2023.length > 0) {
              const survey = surveys2023[0]
              const { error: err2023 } = await supabase
                .from('survey_responses_2023')
                .update({ 
                  email_address: primaryEmail,
                  user_id: userId
                })
                .eq('id', survey.id)
              
              if (!err2023) results.updated2023 = 1
              else results.errors.push(`2023: ${err2023.message}`)
            }
          } else if (year === 2024) {
            const { data: surveys2024 } = await supabase
              .from('survey_responses_2024')
              .select('id, user_id')
              .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
              .limit(1)
            
            if (surveys2024 && surveys2024.length > 0) {
              const survey = surveys2024[0]
              const { error: err2024 } = await supabase
                .from('survey_responses_2024')
                .update({ 
                  email_address: primaryEmail,
                  user_id: userId
                })
                .eq('id', survey.id)
              
              if (!err2024) results.updated2024 = 1
              else results.errors.push(`2024: ${err2024.message}`)
            }
          }
        }
      }

      const totalUpdated = results.updated2021 + results.updated2022 + results.updated2023 + results.updated2024

      return new Response(
        JSON.stringify({ 
          success: true,
          totalUpdated,
          details: results,
          defaultPassword: defaultPassword,
          userId: userId,
          userCreated: results.userCreated,
          message: `User account ${results.userCreated ? 'created' : 'updated'} successfully. You can now sign in with the default password.`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in company-lookup function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
