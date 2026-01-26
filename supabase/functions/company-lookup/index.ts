import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Action 1: Search for companies across all survey years
    if (action === 'search') {
      if (!companyName || companyName.trim().length < 2) {
        return new Response(
          JSON.stringify({ companies: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const searchTerm = companyName.trim().toLowerCase()
      const allCompanies: { name: string; year: number; email: string }[] = []

      // Search 2021 survey (firm_name, email_address)
      const { data: data2021 } = await supabase
        .from('survey_responses_2021')
        .select('firm_name, email_address')
        .or(`firm_name.ilike.%${searchTerm}%`)
      
      if (data2021) {
        data2021.forEach(row => {
          if (row.firm_name) {
            allCompanies.push({ name: row.firm_name, year: 2021, email: row.email_address })
          }
        })
      }

      // Search 2022 survey (organisation, email)
      const { data: data2022 } = await supabase
        .from('survey_responses_2022')
        .select('organisation, email')
        .or(`organisation.ilike.%${searchTerm}%`)
      
      if (data2022) {
        data2022.forEach(row => {
          if (row.organisation) {
            allCompanies.push({ name: row.organisation, year: 2022, email: row.email })
          }
        })
      }

      // Search 2023 survey (organisation_name, fund_name, email_address)
      const { data: data2023 } = await supabase
        .from('survey_responses_2023')
        .select('organisation_name, fund_name, email_address')
        .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
      
      if (data2023) {
        data2023.forEach(row => {
          const name = row.organisation_name || row.fund_name
          if (name) {
            allCompanies.push({ name, year: 2023, email: row.email_address })
          }
        })
      }

      // Search 2024 survey (organisation_name, fund_name, email_address)
      const { data: data2024 } = await supabase
        .from('survey_responses_2024')
        .select('organisation_name, fund_name, email_address')
        .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
      
      if (data2024) {
        data2024.forEach(row => {
          const name = row.organisation_name || row.fund_name
          if (name) {
            allCompanies.push({ name, year: 2024, email: row.email_address })
          }
        })
      }

      // Deduplicate company names (case-insensitive) but keep all records for email lookup
      const uniqueCompanies = Array.from(
        new Map(allCompanies.map(c => [c.name.toLowerCase(), c.name])).values()
      )

      return new Response(
        JSON.stringify({ 
          companies: uniqueCompanies,
          allRecords: allCompanies 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Action 2: Get all emails for selected companies
    if (action === 'getEmails') {
      if (!selectedCompanies || selectedCompanies.length === 0) {
        return new Response(
          JSON.stringify({ emails: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const emailsWithDetails: { email: string; company: string; year: number }[] = []

      for (const companyName of selectedCompanies) {
        const searchTerm = companyName.toLowerCase()

        // 2021
        const { data: data2021 } = await supabase
          .from('survey_responses_2021')
          .select('firm_name, email_address')
          .ilike('firm_name', `%${searchTerm}%`)
        
        if (data2021) {
          data2021.forEach(row => {
            if (row.email_address && !emailsWithDetails.find(e => e.email === row.email_address)) {
              emailsWithDetails.push({ email: row.email_address, company: row.firm_name, year: 2021 })
            }
          })
        }

        // 2022
        const { data: data2022 } = await supabase
          .from('survey_responses_2022')
          .select('organisation, email')
          .ilike('organisation', `%${searchTerm}%`)
        
        if (data2022) {
          data2022.forEach(row => {
            if (row.email && !emailsWithDetails.find(e => e.email === row.email)) {
              emailsWithDetails.push({ email: row.email, company: row.organisation, year: 2022 })
            }
          })
        }

        // 2023
        const { data: data2023 } = await supabase
          .from('survey_responses_2023')
          .select('organisation_name, fund_name, email_address')
          .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
        
        if (data2023) {
          data2023.forEach(row => {
            if (row.email_address && !emailsWithDetails.find(e => e.email === row.email_address)) {
              emailsWithDetails.push({ 
                email: row.email_address, 
                company: row.organisation_name || row.fund_name, 
                year: 2023 
              })
            }
          })
        }

        // 2024
        const { data: data2024 } = await supabase
          .from('survey_responses_2024')
          .select('organisation_name, fund_name, email_address')
          .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
        
        if (data2024) {
          data2024.forEach(row => {
            if (row.email_address && !emailsWithDetails.find(e => e.email === row.email_address)) {
              emailsWithDetails.push({ 
                email: row.email_address, 
                company: row.organisation_name || row.fund_name, 
                year: 2024 
              })
            }
          })
        }
      }

      return new Response(
        JSON.stringify({ emails: emailsWithDetails }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Action 3: Consolidate surveys to primary email
    if (action === 'consolidate') {
      if (!primaryEmail || !selectedCompanies || selectedCompanies.length === 0) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const results = {
        updated2021: 0,
        updated2022: 0,
        updated2023: 0,
        updated2024: 0,
        errors: [] as string[]
      }

      for (const companyName of selectedCompanies) {
        const searchTerm = companyName.toLowerCase()

        // Update 2021 surveys
        const { error: err2021, count: count2021 } = await supabase
          .from('survey_responses_2021')
          .update({ email_address: primaryEmail })
          .ilike('firm_name', `%${searchTerm}%`)
        
        if (err2021) results.errors.push(`2021: ${err2021.message}`)
        else results.updated2021 += count2021 || 0

        // Update 2022 surveys
        const { error: err2022, count: count2022 } = await supabase
          .from('survey_responses_2022')
          .update({ email: primaryEmail })
          .ilike('organisation', `%${searchTerm}%`)
        
        if (err2022) results.errors.push(`2022: ${err2022.message}`)
        else results.updated2022 += count2022 || 0

        // Update 2023 surveys
        const { error: err2023, count: count2023 } = await supabase
          .from('survey_responses_2023')
          .update({ email_address: primaryEmail })
          .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
        
        if (err2023) results.errors.push(`2023: ${err2023.message}`)
        else results.updated2023 += count2023 || 0

        // Update 2024 surveys
        const { error: err2024, count: count2024 } = await supabase
          .from('survey_responses_2024')
          .update({ email_address: primaryEmail })
          .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
        
        if (err2024) results.errors.push(`2024: ${err2024.message}`)
        else results.updated2024 += count2024 || 0
      }

      const totalUpdated = results.updated2021 + results.updated2022 + results.updated2023 + results.updated2024

      return new Response(
        JSON.stringify({ 
          success: true,
          totalUpdated,
          details: results,
          defaultPassword: 'ESCPNetwork2024!'
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

