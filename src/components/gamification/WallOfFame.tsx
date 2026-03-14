import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Crown, Medal } from 'lucide-react';
import { getBadge } from '@/utils/badgeSystem';

interface CompanyRanking {
  company_user_id: string;
  company_name: string;
  company_logo: string | null;
  total_company_points: number;
  member_count: number;
}

export function WallOfFame() {
  const [companies, setCompanies] = useState<CompanyRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data, error } = await supabase.rpc('get_company_leaderboard', { p_limit: 10 });
        if (!error && data) {
          setCompanies(data as CompanyRanking[]);
        }
      } catch (e) {
        console.error('Error fetching wall of fame:', e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getRankDisplay = (index: number) => {
    if (index === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
    if (index === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm font-bold text-slate-400">#{index + 1}</span>;
  };

  if (loading) {
    return (
      <Card className="finance-card">
        <CardHeader className="border-b border-slate-200/60 bg-amber-50 px-5 py-4">
          <CardTitle className="flex items-center gap-2 font-display text-navy-900">
            <Trophy className="w-5 h-5 text-gold-500" />
            Wall of Fame
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="h-10 w-10 bg-slate-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="finance-card overflow-hidden">
      <CardHeader className="border-b border-slate-200/60 bg-gradient-to-r from-amber-50 to-yellow-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-display font-normal text-navy-900">Wall of Fame</CardTitle>
            <p className="text-[10px] section-label mt-0.5">Top 10 Companies by Engagement</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {companies.length === 0 ? (
          <div className="p-6 text-center text-sm text-slate-500">
            No engagement data yet. Start contributing to appear here!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {companies.map((company, index) => {
              const badge = getBadge(company.total_company_points);
              return (
                <div
                  key={company.company_user_id}
                  className={`flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-amber-50/50 ${
                    index === 0 ? 'bg-gradient-to-r from-yellow-50/80 to-transparent' : ''
                  }`}
                >
                  <div className="w-8 flex items-center justify-center shrink-0">
                    {getRankDisplay(index)}
                  </div>
                  
                  <Avatar className="h-10 w-10 border-2 border-slate-200">
                    <AvatarImage src={company.company_logo || ''} />
                    <AvatarFallback className="bg-navy-900 text-gold-500 text-xs font-bold">
                      {company.company_name?.charAt(0) || 'C'}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-navy-900 truncate">
                      {company.company_name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <img src={badge.image} alt={badge.name} className="w-4 h-4" />
                      <span className="text-[10px] text-slate-500 font-medium">{badge.name}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-gold-600">
                      {company.total_company_points.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">points</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
