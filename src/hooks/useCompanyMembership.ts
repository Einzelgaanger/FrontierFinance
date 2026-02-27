import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface CompanyMembership {
  isTeamMember: boolean;
  companyUserId: string | null;
  memberEmail: string | null;
  memberName: string | null;
}

/**
 * For the current user: are they a primary (company account) or a secondary (team member)?
 * Primary = not in company_members as member_user_id. Team member = has a row in company_members.
 */
export function useCompanyMembership(): CompanyMembership & { loading: boolean } {
  const { user } = useAuth();
  const [state, setState] = useState<CompanyMembership & { loading: boolean }>({
    isTeamMember: false,
    companyUserId: null,
    memberEmail: null,
    memberName: null,
    loading: true,
  });

  useEffect(() => {
    if (!user?.id) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('company_members')
        .select('company_user_id, member_email, member_name')
        .eq('member_user_id', user.id)
        .eq('is_active', true)
        .maybeSingle();
      if (cancelled) return;
      if (data) {
        setState({
          isTeamMember: true,
          companyUserId: data.company_user_id,
          memberEmail: data.member_email ?? null,
          memberName: data.member_name ?? null,
          loading: false,
        });
      } else {
        setState({
          isTeamMember: false,
          companyUserId: null,
          memberEmail: null,
          memberName: null,
          loading: false,
        });
      }
    })();
    return () => { cancelled = true; };
  }, [user?.id]);

  return state;
}

/**
 * Log an action by the current user when they are a team member.
 * Primary account holders will see this in "Team activity" on My Profile.
 */
export async function logMemberActivity(
  companyUserId: string,
  actionType: string,
  actionLabel: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, unknown>
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.email) return;
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('full_name')
    .eq('id', user.id)
    .single();
  await supabase.from('member_activity_log').insert([{
    company_user_id: companyUserId,
    member_user_id: user.id,
    member_email: user.email!,
    member_name: profile?.full_name ?? user.email!.split('@')[0],
    action_type: actionType,
    action_label: actionLabel,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
    details: (details ?? {}) as Record<string, string>,
  }]);
}
