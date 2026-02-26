import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Loader2, User, ListFilter, Search, RefreshCw, Shield, UserCheck, Calendar } from 'lucide-react';
import DirectoryProfileCard, { type DirectoryProfileCardProfile } from '@/components/network/DirectoryProfileCard';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { isStaffEmail } from '@/lib/staff';
import { motion, AnimatePresence } from 'framer-motion';

interface UserProfile {
  id: string;
  email: string;
  company_name: string;
  description: string | null;
  website: string | null;
  profile_picture_url: string | null;
  user_role: string;
  completed_surveys: string[];
  team_member_count?: number;
}

export default function MemberNetworkPageNew() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [showYearFilter, setShowYearFilter] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, profiles, selectedYears]);

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
      const secondaryToPrimary = new Map<string, string>();
      companyMembersList.forEach((m: { company_user_id: string; member_user_id: string }) => {
        const cid = m.company_user_id;
        teamCountByCompanyId.set(cid, (teamCountByCompanyId.get(cid) || 0) + 1);
        secondaryToPrimary.set(m.member_user_id, cid);
      });
      const allProfiles = (profilesResult.data || []).filter(
        (p: { id: string; email?: string }) => !secondaryMemberIds.has(p.id) && !isStaffEmail(p.email)
      );

      // Aggregate survey years at company level: primary + any team member's surveys count for the primary
      const companySurveyYears = new Map<string, string[]>();
      const resolvePrimaryId = (userId: string) => secondaryToPrimary.get(userId) || userId;
      const addSurveyYear = (primaryId: string, year: string) => {
        const existing = companySurveyYears.get(primaryId) || [];
        if (!existing.includes(year)) companySurveyYears.set(primaryId, [...existing, year]);
      };
      const processSurveys = (data: any[], year: string) => {
        data?.forEach(survey => {
          if (survey.user_id) {
            const primaryId = resolvePrimaryId(survey.user_id);
            addSurveyYear(primaryId, year);
          }
        });
      };
      processSurveys(survey2021Result.data || [], '2021');
      processSurveys(survey2022Result.data || [], '2022');
      processSurveys(survey2023Result.data || [], '2023');
      processSurveys(survey2024Result.data || [], '2024');

      const profilesWithSurveys = allProfiles.map((profile: any) => ({
        ...profile,
        completed_surveys: companySurveyYears.get(profile.id) || [],
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
    let filtered = profiles;
    if (searchTerm.trim()) {
      filtered = filtered.filter(profile =>
        profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedYears.length > 0) {
      filtered = filtered.filter(profile =>
        selectedYears.every(year => profile.completed_surveys.includes(year))
      );
    }
    setFilteredProfiles(filtered);
  };

  const getYearCounts = () => {
    const counts: Record<string, number> = { '2021': 0, '2022': 0, '2023': 0, '2024': 0 };
    profiles.forEach(profile => {
      profile.completed_surveys.forEach(year => {
        if (counts[year] !== undefined) counts[year]++;
      });
    });
    return counts;
  };

  const yearCounts = getYearCounts();
  const allYears = ['2021', '2022', '2023', '2024'];
  const toggleYear = (year: string) => {
    setSelectedYears(prev => prev.includes(year) ? prev.filter(y => y !== year) : [...prev, year]);
  };

  const handleCardClick = (profile: UserProfile) => {
    if (profile.completed_surveys.length > 0 || userRole === 'admin') {
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
        {/* Toolbar: one bar for all */}
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
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-11 px-4 border border-slate-200 bg-slate-50/80 text-navy-900 hover:bg-white hover:border-gold-500 rounded-lg transition-colors ${selectedYears.length > 0 ? 'border-gold-500 bg-gold-50/80 text-gold-800' : ''}`}
                  onClick={() => setShowYearFilter(!showYearFilter)}
                >
                  <ListFilter className="h-4 w-4 mr-2" />
                  Survey year
                  {selectedYears.length > 0 && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 bg-gold-500/20 text-gold-800 text-xs font-semibold border-0">
                      {selectedYears.length}
                    </Badge>
                  )}
                </Button>
                <AnimatePresence>
                  {showYearFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-card-hover py-2 z-50"
                    >
                      <div className="flex justify-between items-center px-3 pb-2 mb-2 border-b border-slate-100">
                        <span className="text-xs font-semibold text-navy-900 uppercase tracking-wider">Year</span>
                        {selectedYears.length > 0 && (
                          <button type="button" onClick={() => setSelectedYears([])} className="text-xs text-gold-600 hover:text-gold-700 font-medium">
                            Clear
                          </button>
                        )}
                      </div>
                      <div className="space-y-0.5 px-2">
                        {allYears.map(year => (
                          <div
                            key={year}
                            onClick={() => toggleYear(year)}
                            className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-slate-50 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={selectedYears.includes(year)}
                                onCheckedChange={() => toggleYear(year)}
                                className="border-slate-300 data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-500"
                              />
                              <span className="text-sm font-medium text-navy-900">{year}</span>
                            </div>
                            <span className="text-xs text-slate-500 tabular-nums">{yearCounts[year]}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-11 px-4 border border-slate-200 bg-slate-50/80 text-navy-900 hover:bg-white hover:border-gold-500 rounded-lg transition-colors"
                onClick={fetchProfiles}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-6 text-sm font-medium text-slate-600">
          <span><span className="text-navy-900 font-semibold">{profiles.length}</span> members</span>
          {(searchTerm || selectedYears.length > 0) && (
            <span><span className="text-gold-700 font-semibold">{filteredProfiles.length}</span> shown</span>
          )}
        </div>

        {/* Cards grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProfiles.map((profile, i) => {
              const hasSurveys = profile.completed_surveys.length > 0;
              const isClickable = hasSurveys || userRole === 'admin';
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
                    surveyBadgeText={hasSurveys ? `${profile.completed_surveys.length} surveys` : null}
                    isClickable={isClickable}
                    onClick={() => handleCardClick(profile)}
                  />
                </motion.div>
              );
            })}
          </div>
        ) : (
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
              onClick={() => { setSearchTerm(''); setSelectedYears([]); }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
