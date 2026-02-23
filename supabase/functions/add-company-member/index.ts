import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the caller is authenticated and is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseAuth = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user: caller }, error: authError } = await supabaseAuth.auth.getUser()
    if (authError || !caller) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check caller is admin
    const { data: callerRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', caller.id)
      .single()

    if (callerRole?.role !== 'admin') {
      return new Response(
        JSON.stringify({ error: 'Only admins can add company members' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { company_user_id, member_email, member_name, password } = await req.json()

    if (!company_user_id || !member_email || !password) {
      return new Response(
        JSON.stringify({ error: 'company_user_id, member_email, and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(member_email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the company exists
    const { data: company } = await supabaseAdmin
      .from('user_profiles')
      .select('id, company_name')
      .eq('id', company_user_id)
      .single()

    if (!company) {
      return new Response(
        JSON.stringify({ error: 'Company not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if email already exists as a user
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === member_email.toLowerCase())

    let memberUserId: string

    if (existingUser) {
      // Check if already a company member
      const { data: existingMember } = await supabaseAdmin
        .from('company_members')
        .select('id')
        .eq('member_user_id', existingUser.id)
        .single()

      if (existingMember) {
        return new Response(
          JSON.stringify({ error: 'This user is already a member of a company' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      memberUserId = existingUser.id
    } else {
      // Create the user account
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: member_email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: member_name || member_email.split('@')[0],
          company_name: company.company_name,
          is_secondary_member: true,
          parent_company_id: company_user_id,
          created_via: 'admin_add_member'
        }
      })

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      memberUserId = newUser.user!.id

      // Create user_profiles entry (secondary member, not a company)
      await supabaseAdmin.from('user_profiles').insert({
        id: memberUserId,
        email: member_email,
        company_name: company.company_name,
        full_name: member_name || member_email.split('@')[0],
        user_role: 'member',
        company_id: company_user_id
      }).single()

      // Create user_roles entry as member
      await supabaseAdmin.from('user_roles').insert({
        user_id: memberUserId,
        email: member_email,
        role: 'member'
      }).single()
    }

    // Insert into company_members
    const { error: memberError } = await supabaseAdmin
      .from('company_members')
      .insert({
        company_user_id,
        member_user_id: memberUserId,
        member_email,
        member_name: member_name || member_email.split('@')[0],
        invited_by: caller.id
      })

    if (memberError) {
      return new Response(
        JSON.stringify({ error: memberError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        member: {
          user_id: memberUserId,
          email: member_email,
          name: member_name,
          company: company.company_name
        },
        message: `${member_name || member_email} has been added as a team member of ${company.company_name}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in add-company-member:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
