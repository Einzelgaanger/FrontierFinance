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

    // Action 3: Consolidate surveys to primary email and create user account
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

      // Step 1: Check if user already exists by trying to get user by email
      let userId: string | null = null
      let userExists = false
      
      try {
        // First, try to get user directly by email using getUserByEmail if available
        // Otherwise, paginate through all users
        let page = 1
        const perPage = 1000
        let found = false
        const emailLower = primaryEmail.toLowerCase().trim()
        
        while (!found) {
          const { data: usersData, error: listError } = await supabase.auth.admin.listUsers({
            page,
            perPage
          })
          
          if (listError) {
            console.error('Error listing users:', listError)
            // If listing fails, try to create user anyway
            break
          }
          
          const users = usersData?.users || []
          const matchingUser = users.find(u => {
            const userEmail = u.email?.toLowerCase().trim()
            return userEmail === emailLower
          })
          
          if (matchingUser) {
            userId = matchingUser.id
            userExists = true
            found = true
            results.userCreated = false
            
            console.log('Found existing user:', {
              id: userId,
              email: matchingUser.email,
              emailConfirmed: !!matchingUser.email_confirmed_at
            })
            
            // Update existing user's password to default password
            console.log('Updating password for existing user:', userId)
            const { data: updatedUser, error: updatePasswordError } = await supabase.auth.admin.updateUserById(
              userId,
              { 
                password: defaultPassword,
                email_confirm: true // Ensure email is confirmed
              }
            )
            
            if (updatePasswordError) {
              console.error('Error updating password:', updatePasswordError)
              results.errors.push(`Password update: ${updatePasswordError.message}`)
              // Continue anyway - maybe password is already correct
            } else {
              console.log('Password updated successfully:', updatedUser?.user?.email)
            }
            
            // Wait a moment for password update to propagate
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // Verify the user can be retrieved
            const { data: verifyUser, error: verifyError } = await supabase.auth.admin.getUserById(userId)
            if (verifyError) {
              console.error('Error verifying user:', verifyError)
            } else {
              console.log('User verified after password update:', {
                email: verifyUser?.user?.email,
                emailConfirmed: !!verifyUser?.user?.email_confirmed_at,
                userId: verifyUser?.user?.id
              })
            }
            
            // Ensure user profile exists
            const { error: profileCheckError } = await supabase
              .from('user_profiles')
              .upsert({
                id: userId,
                email: primaryEmail,
                company_name: selectedCompanies[0]
              }, { onConflict: 'id' })
            
            if (profileCheckError) {
              console.error('Error upserting profile:', profileCheckError)
            } else {
              console.log('User profile ensured')
            }
            
            // Ensure user role exists
            const { error: roleCheckError } = await supabase
              .from('user_roles')
              .upsert({
                user_id: userId,
                email: primaryEmail,
                role: 'viewer'
              }, { onConflict: 'user_id' })
            
            if (roleCheckError) {
              console.error('Error upserting role:', roleCheckError)
            } else {
              console.log('User role ensured')
            }
            
            break
          }
          
          // If we got fewer users than perPage, we've reached the end
          if (users.length < perPage) {
            break
          }
          
          page++
        }
      } catch (error) {
        console.error('Error checking for existing user:', error)
        // Continue to create new user if check fails
      }

      if (!userExists) {
        // Step 2: Create new auth user
        console.log('Creating new user with email:', primaryEmail)
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
          console.error('User creation error:', createError)
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

        if (!newUser || !newUser.user) {
          console.error('User creation returned no user data')
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
        console.log('User created successfully with ID:', userId, 'Email:', newUser.user.email)
        
        // Verify the user was created correctly
        const { data: verifyNewUser, error: verifyError } = await supabase.auth.admin.getUserById(userId)
        if (verifyError) {
          console.error('Error verifying newly created user:', verifyError)
        } else {
          console.log('New user verified:', verifyNewUser?.user?.email, 'Email confirmed:', verifyNewUser?.user?.email_confirmed_at)
        }

        // Step 3: Create user profile
        console.log('Creating user profile for:', userId)
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            email: primaryEmail,
            company_name: selectedCompanies[0] // Use first selected company as primary
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          if (!profileError.message.includes('duplicate')) {
            results.errors.push(`Profile creation: ${profileError.message}`)
          }
        } else {
          console.log('User profile created successfully')
        }

        // Step 4: Assign default viewer role
        console.log('Assigning viewer role to:', userId)
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            email: primaryEmail,
            role: 'viewer'
          })

        if (roleError) {
          console.error('Role assignment error:', roleError)
          if (!roleError.message.includes('duplicate')) {
            results.errors.push(`Role assignment: ${roleError.message}`)
          }
        } else {
          console.log('Role assigned successfully')
        }
      }

      // Verify userId is set before proceeding
      if (!userId) {
        console.error('No userId available - cannot proceed with survey updates')
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Failed to create or find user account',
            details: results
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      console.log('Proceeding with survey updates for userId:', userId)

      // Step 5: Update all survey records to use the primary email and link to user_id
      // Handle UNIQUE constraint by checking for existing surveys per year
      for (const companyName of selectedCompanies) {
        const searchTerm = companyName.toLowerCase()

        // 2021 surveys - handle UNIQUE user_id constraint
        const { data: surveys2021 } = await supabase
          .from('survey_responses_2021')
          .select('id, user_id, email_address')
          .ilike('firm_name', `%${searchTerm}%`)
        
        if (surveys2021 && surveys2021.length > 0) {
          // Check if user already has a 2021 survey
          const existingSurvey = surveys2021.find(s => s.user_id === userId)
          
          if (existingSurvey) {
            // Update existing survey email
            const { error: err2021 } = await supabase
              .from('survey_responses_2021')
              .update({ email_address: primaryEmail })
              .eq('id', existingSurvey.id)
            if (err2021) results.errors.push(`2021: ${err2021.message}`)
            else results.updated2021 = 1
          } else {
            // Use first survey found, update it
            const firstSurvey = surveys2021[0]
            const { error: err2021 } = await supabase
              .from('survey_responses_2021')
              .update({ 
                email_address: primaryEmail,
                user_id: userId
              })
              .eq('id', firstSurvey.id)
            if (err2021) results.errors.push(`2021: ${err2021.message}`)
            else results.updated2021 = 1
          }
        }

        // 2022 surveys - handle UNIQUE user_id constraint
        const { data: surveys2022 } = await supabase
          .from('survey_responses_2022')
          .select('id, user_id, email')
          .ilike('organisation', `%${searchTerm}%`)
        
        if (surveys2022 && surveys2022.length > 0) {
          const existingSurvey = surveys2022.find(s => s.user_id === userId)
          
          if (existingSurvey) {
            const { error: err2022 } = await supabase
              .from('survey_responses_2022')
              .update({ email: primaryEmail })
              .eq('id', existingSurvey.id)
            if (err2022) results.errors.push(`2022: ${err2022.message}`)
            else results.updated2022 = 1
          } else {
            const firstSurvey = surveys2022[0]
            const { error: err2022 } = await supabase
              .from('survey_responses_2022')
              .update({ 
                email: primaryEmail,
                user_id: userId
              })
              .eq('id', firstSurvey.id)
            if (err2022) results.errors.push(`2022: ${err2022.message}`)
            else results.updated2022 = 1
          }
        }

        // 2023 surveys - handle UNIQUE user_id constraint
        const { data: surveys2023 } = await supabase
          .from('survey_responses_2023')
          .select('id, user_id, email_address')
          .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
        
        if (surveys2023 && surveys2023.length > 0) {
          const existingSurvey = surveys2023.find(s => s.user_id === userId)
          
          if (existingSurvey) {
            const { error: err2023 } = await supabase
              .from('survey_responses_2023')
              .update({ email_address: primaryEmail })
              .eq('id', existingSurvey.id)
            if (err2023) results.errors.push(`2023: ${err2023.message}`)
            else results.updated2023 = 1
          } else {
            const firstSurvey = surveys2023[0]
            const { error: err2023 } = await supabase
              .from('survey_responses_2023')
              .update({ 
                email_address: primaryEmail,
                user_id: userId
              })
              .eq('id', firstSurvey.id)
            if (err2023) results.errors.push(`2023: ${err2023.message}`)
            else results.updated2023 = 1
          }
        }

        // 2024 surveys - handle UNIQUE user_id constraint
        const { data: surveys2024 } = await supabase
          .from('survey_responses_2024')
          .select('id, user_id, email_address')
          .or(`organisation_name.ilike.%${searchTerm}%,fund_name.ilike.%${searchTerm}%`)
        
        if (surveys2024 && surveys2024.length > 0) {
          const existingSurvey = surveys2024.find(s => s.user_id === userId)
          
          if (existingSurvey) {
            const { error: err2024 } = await supabase
              .from('survey_responses_2024')
              .update({ email_address: primaryEmail })
              .eq('id', existingSurvey.id)
            if (err2024) results.errors.push(`2024: ${err2024.message}`)
            else results.updated2024 = 1
          } else {
            const firstSurvey = surveys2024[0]
            const { error: err2024 } = await supabase
              .from('survey_responses_2024')
              .update({ 
                email_address: primaryEmail,
                user_id: userId
              })
              .eq('id', firstSurvey.id)
            if (err2024) results.errors.push(`2024: ${err2024.message}`)
            else results.updated2024 = 1
          }
        }
      }

      const totalUpdated = results.updated2021 + results.updated2022 + results.updated2023 + results.updated2024

      // Final verification: Try to get the user one more time to confirm everything is set
      if (userId) {
        const { data: finalVerify, error: finalVerifyError } = await supabase.auth.admin.getUserById(userId)
        if (finalVerifyError) {
          console.error('Final user verification failed:', finalVerifyError)
          results.errors.push(`Final verification: ${finalVerifyError.message}`)
        } else {
          console.log('Final verification successful:', {
            email: finalVerify?.user?.email,
            emailConfirmed: !!finalVerify?.user?.email_confirmed_at,
            userId: finalVerify?.user?.id
          })
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          totalUpdated,
          details: results,
          defaultPassword: defaultPassword,
          userId: userId,
          userCreated: results.userCreated,
          message: userId 
            ? `User account ${results.userCreated ? 'created' : 'updated'} successfully. You can now sign in with the default password.`
            : 'Warning: User account may not have been created properly. Please check logs.'
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

