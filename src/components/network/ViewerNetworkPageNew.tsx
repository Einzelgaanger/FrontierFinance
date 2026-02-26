import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Loader2, Search, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isStaffEmail } from '@/lib/staff';
import { motion } from 'framer-motion';
import DirectoryProfileCard, { type DirectoryProfileCardProfile } from '@/components/network/DirectoryProfileCard';

interface UserProfile {
  id: string;
  email: string;
  company_name: string;
  description: string | null;
  website: string | null;
  profile_picture_url: string | null;
  user_role: string;
  has_surveys: boolean;
  team_member_count?: number;
}

export default function ViewerNetworkPageNew() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, profiles]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const [profilesResult, companyMembersResult, survey2021Result, survey2022Result, survey2023Result, survey2024Result] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('id, email, company_name, description, website, profile_picture_url, user_role')
          .not('email', 'like', '%.test@escpnetwork.net')
          .order('company_name'),
        supabase.from('company_members').select('company_user_id, member_user_id'),
        supabase.from('survey_responses_2021').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2022').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2023').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2024').select('user_id').eq('submission_status', 'completed')
      ]);

      if (profilesResult.error) throw profilesResult.error;

      const companyMembersList = companyMembersResult.data || [];
      const secondaryMemberIds = new Set(companyMembersList.map((m: { member_user_id: string }) => m.member_user_id));
      const teamCountByCompanyId = new Map<string, number>();
      companyMembersList.forEach((m: { company_user_id: string }) => {
        const cid = m.company_user_id;
        teamCountByCompanyId.set(cid, (teamCountByCompanyId.get(cid) || 0) + 1);
      });
      const allProfiles = (profilesResult.data || []).filter(
        (p: { id: string; email?: string }) => !secondaryMemberIds.has(p.id) && !isStaffEmail(p.email)
      );

      const usersWithSurveys = new Set<string>();
      [survey2021Result.data, survey2022Result.data, survey2023Result.data, survey2024Result.data].forEach(surveyData => {
        (surveyData || []).forEach((survey: { user_id?: string }) => {
          if (survey.user_id) usersWithSurveys.add(survey.user_id);
        });
      });

      const profilesWithSurveys = allProfiles.map((profile: any) => ({
        ...profile,
        has_surveys: usersWithSurveys.has(profile.id),
        team_member_count: teamCountByCompanyId.get(profile.id) || 0
      }));
      setProfiles(profilesWithSurveys);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProfiles = () => {
    if (!searchTerm.trim()) {
      setFilteredProfiles(profiles);
      return;
    }
    const filtered = profiles.filter(profile =>
      profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProfiles(filtered);
  };

  const handleCardClick = (profile: UserProfile) => {
    if (profile.has_surveys) {
      navigate(`/network/fund-manager/${profile.id}`);
    }
  };

  if (loading) {
    return (
      <div className="directory-page">
        <div className="directory-hero">
          <h1 className="directory-hero-title">Directory</h1>
          <p className="directory-hero-subtitle">Fund managers in the CFF network</p>
          <div className="directory-hero-accent" aria-hidden />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-gold-500 animate-spin" />
            <p className="text-sm font-medium text-slate-600 mt-4">Loading directory…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="directory-page selection:bg-gold-500/20 selection:text-navy-900">
      {/* Hero: same for all users */}
      <header className="directory-hero">
        <h1 className="directory-hero-title">Directory</h1>
        <p className="directory-hero-subtitle">Search and browse fund managers in the CFF network.</p>
        <div className="directory-hero-accent" aria-hidden />
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Toolbar: same layout as member, search + refresh only */}
        <div className="directory-toolbar mb-8">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search by company, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 bg-slate-50/80 border border-slate-200 text-navy-900 placeholder:text-slate-500 focus:bg-white focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 rounded-lg transition-colors"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-11 px-4 border border-slate-200 bg-slate-50/80 text-navy-900 hover:bg-white hover:border-gold-500 rounded-lg transition-colors shrink-0"
              onClick={fetchProfiles}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-6 text-sm font-medium text-slate-600">
          <span><span className="text-navy-900 font-semibold">{filteredProfiles.length}</span> members{searchTerm ? ' matching your search' : ''}</span>
        </div>

        {/* Cards grid: shared DirectoryProfileCard (same UI/UX as member directory) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProfiles.map((profile, i) => {
            const isClickable = profile.has_surveys;
            const cardProfile: DirectoryProfileCardProfile = {
              id: profile.id,
              company_name: profile.company_name,
              email: profile.email,
              description: profile.description,
              website: profile.website,
              profile_picture_url: profile.profile_picture_url,
              user_role: profile.user_role,
              team_member_count: profile.team_member_count,
            };
            return (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.25) }}
              >
                <DirectoryProfileCard
                  profile={cardProfile}
                  surveyBadgeText={profile.has_surveys ? 'Has surveys' : null}
                  isClickable={isClickable}
                  onClick={() => handleCardClick(profile)}
                />
              </motion.div>
            );
          })}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="finance-card overflow-hidden py-16 text-center border-2 border-slate-200 bg-amber-50/50">
            <div className="w-16 h-16 rounded-2xl bg-navy-900 text-gold-400 flex items-center justify-center mx-auto mb-4 shadow-finance">
              <User className="h-9 w-9" />
            </div>
            <h3 className="text-lg font-display font-semibold text-navy-900">No profiles found</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-sm mx-auto">Try adjusting your search or filters.</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-6 border border-slate-200 text-navy-900 hover:border-gold-500 hover:bg-gold-50/50 font-semibold rounded-lg"
              onClick={() => setSearchTerm('')}
            >
              Clear search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
