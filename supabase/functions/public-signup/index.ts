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

    const { email, password, first_name, last_name, company_name } = await req.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const userExists = (existingUsers?.users as any[])?.some((u: any) => u.email?.toLowerCase() === email.toLowerCase())
    
    if (userExists) {
      return new Response(
        JSON.stringify({ error: 'An account with this email already exists. Please sign in instead.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create user with admin API - email_confirm: true bypasses email confirmation
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email to bypass email service
      user_metadata: {
        first_name: first_name || '',
        last_name: last_name || '',
        company_name: company_name || '',
        created_via: 'public_signup',
        created_at: new Date().toISOString()
      }
    })

    if (createError) {
      console.error('Error creating user:', createError)
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!newUser?.user) {
      return new Response(
        JSON.stringify({ error: 'User creation failed - no user data returned' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const userId = newUser.user.id

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        email: email,
        company_name: company_name || first_name || email.split('@')[0]
      })

    if (profileError && !profileError.message.includes('duplicate')) {
      console.error('Error creating user profile:', profileError)
      // Don't fail - profile might already exist from trigger
    }

    // Assign default viewer role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        email: email,
        role: 'viewer'
      })

    if (roleError && !roleError.message.includes('duplicate')) {
      console.error('Error assigning role:', roleError)
      // Don't fail - role might already exist from trigger
    }

    // Create profile entry (if profiles table exists)
    try {
      const { error: profilesError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          first_name: first_name || email.split('@')[0],
          last_name: last_name || 'User'
        })

      if (profilesError && !profilesError.message.includes('duplicate')) {
        console.error('Error creating profile:', profilesError)
      }
    } catch (err) {
      // Profiles table might not exist, that's okay
      console.log('Profiles table not available or error:', err)
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: userId,
          email: newUser.user.email,
          email_confirmed: true
        },
        message: 'Account created successfully! You can now sign in.'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Unexpected error in public-signup:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
