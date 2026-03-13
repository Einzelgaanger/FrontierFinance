import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.3';

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

    // Verify admin
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

    const body = await req.json();
    const { action } = body;

    // ACTION: swap_primary - Change the primary email of a company
    if (action === 'swap_primary') {
      const { companyUserId, newPrimaryMemberUserId } = body;
      if (!companyUserId || !newPrimaryMemberUserId) {
        return new Response(JSON.stringify({ error: 'companyUserId and newPrimaryMemberUserId are required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get current primary profile
      const { data: currentPrimary } = await supabase
        .from('user_profiles')
        .select('id, email, company_name, full_name, show_in_directory')
        .eq('id', companyUserId)
        .single();

      // Get new primary (from company_members)
      const { data: newPrimaryMember } = await supabase
        .from('company_members')
        .select('member_user_id, member_email, member_name')
        .eq('company_user_id', companyUserId)
        .eq('member_user_id', newPrimaryMemberUserId)
        .single();

      if (!currentPrimary || !newPrimaryMember) {
        return new Response(JSON.stringify({ error: 'Could not find primary or member profiles' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Make new primary: show_in_directory=true, company_id=null
      await supabase.from('user_profiles').update({
        show_in_directory: true,
        company_id: null,
      }).eq('id', newPrimaryMemberUserId);

      // Make old primary: show_in_directory=false, company_id=new primary
      await supabase.from('user_profiles').update({
        show_in_directory: false,
        company_id: newPrimaryMemberUserId,
      }).eq('id', companyUserId);

      // Delete old company_members record for new primary
      await supabase.from('company_members')
        .delete()
        .eq('company_user_id', companyUserId)
        .eq('member_user_id', newPrimaryMemberUserId);

      // Create company_members record for old primary under new primary
      await supabase.from('company_members').insert({
        company_user_id: newPrimaryMemberUserId,
        member_user_id: companyUserId,
        member_email: currentPrimary.email,
        member_name: currentPrimary.full_name,
        role_in_company: 'team_member',
        invited_by: caller.id,
      });

      // Update all other company_members to point to new primary
      await supabase.from('company_members')
        .update({ company_user_id: newPrimaryMemberUserId })
        .eq('company_user_id', companyUserId)
        .neq('member_user_id', companyUserId);

      // Update other team member profiles to point to new primary
      await supabase.from('user_profiles')
        .update({ company_id: newPrimaryMemberUserId })
        .eq('company_id', companyUserId);

      // Migrate survey data
      const surveyTables = ['survey_responses_2021', 'survey_responses_2022', 'survey_responses_2023', 'survey_responses_2024'];
      for (const table of surveyTables) {
        await supabase.from(table).update({ user_id: newPrimaryMemberUserId }).eq('user_id', companyUserId);
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Primary account swapped. ${newPrimaryMember.member_email} is now the primary account.`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ACTION: update_primary_email - Change the primary account's email
    if (action === 'update_primary_email') {
      const { companyUserId, newEmail } = body;
      if (!companyUserId || !newEmail) {
        return new Response(JSON.stringify({ error: 'companyUserId and newEmail are required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Update user_profiles
      await supabase.from('user_profiles').update({ email: newEmail }).eq('id', companyUserId);
      
      // Update user_roles email if exists
      await supabase.from('user_roles').update({ email: newEmail }).eq('user_id', companyUserId);

      // Update auth.users
      const { error: authErr } = await supabase.auth.admin.updateUserById(companyUserId, {
        email: newEmail,
        email_confirm: true,
      });

      if (authErr) {
        // Try creating auth user
        const { data: profile } = await supabase.from('user_profiles').select('company_name, full_name').eq('id', companyUserId).single();
        const tempPassword = `CFF_${crypto.randomUUID().slice(0, 12)}!`;
        await supabase.auth.admin.createUser({
          id: companyUserId,
          email: newEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { company_name: profile?.company_name, full_name: profile?.full_name },
        });
      }

      return new Response(JSON.stringify({ success: true, message: `Primary email updated to ${newEmail}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ACTION: add_member
    if (action === 'add_member') {
      const { companyUserId, memberEmail, memberName } = body;
      if (!companyUserId || !memberEmail) {
        return new Response(JSON.stringify({ error: 'companyUserId and memberEmail are required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get company info
      const { data: company } = await supabase.from('user_profiles').select('company_name').eq('id', companyUserId).single();

      // Check if user exists in auth
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find((u: any) => u.email?.toLowerCase() === memberEmail.toLowerCase());

      let memberUserId: string;
      if (existingUser) {
        memberUserId = existingUser.id;
        // Check if already a company member
        const { data: existingMember } = await supabase.from('company_members').select('id').eq('member_user_id', existingUser.id).single();
        if (existingMember) {
          return new Response(JSON.stringify({ error: 'This user is already a member of a company' }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      } else {
        // Create auth user
        const tempPassword = `CFF_${crypto.randomUUID().slice(0, 12)}!`;
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: memberEmail,
          password: tempPassword,
          email_confirm: true,
          user_metadata: {
            first_name: memberName || memberEmail.split('@')[0],
            company_name: company?.company_name,
            is_secondary_member: true,
            parent_company_id: companyUserId,
          }
        });
        if (createError) {
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
        memberUserId = newUser.user!.id;

        // Create profile
        await supabase.from('user_profiles').insert({
          id: memberUserId,
          email: memberEmail,
          company_name: company?.company_name,
          full_name: memberName || memberEmail.split('@')[0],
          user_role: 'member',
          company_id: companyUserId,
          show_in_directory: false,
        });

        // Set user_roles to member (upsert to override trigger's default 'viewer')
        await supabase.from('user_roles').upsert({
          user_id: memberUserId,
          email: memberEmail,
          role: 'member',
        }, { onConflict: 'user_id' });
      }

      // Insert company_members
      const { error: memberError } = await supabase.from('company_members').insert({
        company_user_id: companyUserId,
        member_user_id: memberUserId,
        member_email: memberEmail,
        member_name: memberName || memberEmail.split('@')[0],
        role_in_company: 'team_member',
        invited_by: caller.id,
      });

      if (memberError) {
        return new Response(JSON.stringify({ error: memberError.message }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({
        success: true,
        memberUserId,
        message: `${memberName || memberEmail} added as team member`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ACTION: update_member
    if (action === 'update_member') {
      const { memberId, memberName, memberEmail, roleInCompany } = body;
      if (!memberId) {
        return new Response(JSON.stringify({ error: 'memberId is required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Get current member
      const { data: member } = await supabase.from('company_members').select('*').eq('id', memberId).single();
      if (!member) {
        return new Response(JSON.stringify({ error: 'Member not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const updates: Record<string, unknown> = {};
      if (memberName !== undefined) updates.member_name = memberName;
      if (memberEmail !== undefined) updates.member_email = memberEmail;
      if (roleInCompany !== undefined) updates.role_in_company = roleInCompany;

      await supabase.from('company_members').update(updates).eq('id', memberId);

      // Sync profile and auth if email changed
      if (memberEmail && memberEmail !== member.member_email) {
        await supabase.from('user_profiles').update({ email: memberEmail, full_name: memberName || member.member_name }).eq('id', member.member_user_id);
        await supabase.auth.admin.updateUserById(member.member_user_id, { email: memberEmail, email_confirm: true });
      } else if (memberName) {
        await supabase.from('user_profiles').update({ full_name: memberName }).eq('id', member.member_user_id);
      }

      return new Response(JSON.stringify({ success: true, message: 'Member updated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // ACTION: remove_member
    if (action === 'remove_member') {
      const { memberId } = body;
      if (!memberId) {
        return new Response(JSON.stringify({ error: 'memberId is required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      const { data: member } = await supabase.from('company_members').select('member_user_id').eq('id', memberId).single();
      
      await supabase.from('company_members').delete().eq('id', memberId);

      if (member) {
        // Update profile to remove company link
        await supabase.from('user_profiles').update({ company_id: null, show_in_directory: false }).eq('id', member.member_user_id);
      }

      return new Response(JSON.stringify({ success: true, message: 'Member removed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in admin-manage-team:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
