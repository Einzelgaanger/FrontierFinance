import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Users } from 'lucide-react';
import { getBadge } from '@/utils/badgeSystem';

interface MemberPoints {
  member_user_id: string;
  member_name: string | null;
  member_email: string;
  total_points: number;
}

export function TeamContributions() {
  const { user } = useAuth();
  const [members, setMembers] = useState<MemberPoints[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetch = async () => {
      // Get team members
      const { data: teamMembers } = await supabase
        .from('company_members')
        .select('member_user_id, member_name, member_email')
        .eq('company_user_id', user.id)
        .eq('is_active', true);

      if (!teamMembers?.length) {
        setLoading(false);
        return;
      }

      const memberIds = teamMembers.map(m => m.member_user_id);
      const { data: credits } = await supabase
        .from('user_credits')
        .select('user_id, total_points')
        .in('user_id', memberIds);

      const merged = teamMembers.map(m => ({
        ...m,
        total_points: credits?.find(c => c.user_id === m.member_user_id)?.total_points || 0,
      })).sort((a, b) => b.total_points - a.total_points);

      setMembers(merged);
      setLoading(false);
    };
    fetch();
  }, [user?.id]);

  if (loading) return null;
  if (members.length === 0) return null;

  return (
    <Card className="finance-card">
      <CardHeader className="border-b border-slate-200/60 px-5 py-4">
        <CardTitle className="flex items-center gap-2 text-sm font-display text-navy-900">
          <Users className="w-4 h-4 text-gold-500" />
          Team Contributions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-slate-100">
        {members.map(m => {
          const badge = getBadge(m.total_points);
          return (
            <div key={m.member_user_id} className="flex items-center gap-3 px-5 py-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-slate-200 text-navy-900 text-xs">
                  {m.member_name?.charAt(0) || m.member_email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-900 truncate">
                  {m.member_name || m.member_email}
                </p>
                <div className="flex items-center gap-1">
                  <img src={badge.image} alt={badge.name} className="w-3 h-3" />
                  <span className="text-[10px] text-slate-500">{badge.name}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-gold-600">{m.total_points} pts</span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
