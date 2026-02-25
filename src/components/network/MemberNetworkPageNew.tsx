
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Mail, Globe, Loader2, User, ChevronDown, ChevronUp, ListFilter, X, Search, Filter, RefreshCw, Briefcase } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
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
}

export default function MemberNetworkPageNew() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
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
        supabase.from('company_members').select('member_user_id'),
        supabase.from('survey_responses_2021').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2022').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2023').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2024').select('user_id').eq('submission_status', 'completed')
      ]);

      if (profilesResult.error) throw profilesResult.error;

      const secondaryMemberIds = new Set((companyMembersResult.data || []).map((m: { member_user_id: string }) => m.member_user_id));
      const allProfiles = (profilesResult.data || []).filter((p: { id: string }) => !secondaryMemberIds.has(p.id));

      const userSurveyYears = new Map<string, string[]>();

      const processSurveys = (data: any[], year: string) => {
        data?.forEach(survey => {
          if (survey.user_id) {
            const existing = userSurveyYears.get(survey.user_id) || [];
            if (!existing.includes(year)) userSurveyYears.set(survey.user_id, [...existing, year]);
          }
        });
      };

      processSurveys(survey2021Result.data || [], '2021');
      processSurveys(survey2022Result.data || [], '2022');
      processSurveys(survey2023Result.data || [], '2023');
      processSurveys(survey2024Result.data || [], '2024');

      const profilesWithSurveys = allProfiles.map((profile: any) => ({
        ...profile,
        completed_surveys: userSurveyYears.get(profile.id) || []
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
      filtered = filtered.filter(profile => {
        return selectedYears.every(year => profile.completed_surveys.includes(year));
      });
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
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-gold-500 animate-spin" />
          <p className="text-navy-300 animate-pulse">Loading Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-950 font-sans p-6 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <span className="section-label text-gold-400/90">Network</span>
            <h1 className="text-2xl sm:text-3xl font-display font-normal text-white mt-1 tracking-tight">Network Directory</h1>
            <div className="w-14 h-0.5 bg-gold-500/60 mt-3 rounded-full" />
            <p className="text-navy-200 mt-3">Connect with fund managers participating in the CFF Network. Only primary account holders are listed.</p>
          </div>
          <Button
            onClick={fetchProfiles}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 hover:text-gold-400 gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </Button>
        </div>

        {/* Filters Bar - Glassmorphism */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-md group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-navy-400 group-focus-within:text-gold-500 transition-colors" />
            <Input
              placeholder="Search companies, emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-navy-900/50 border-navy-700 text-white placeholder:text-navy-400 focus:border-gold-500/50 focus:ring-gold-500/20 rounded-xl h-12"
            />
          </div>

          {/* Year Filter */}
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full lg:w-auto z-20">
              <Button
                variant="outline"
                className={`w-full lg:w-auto justify-between border-navy-700 bg-navy-900/50 text-white hover:bg-navy-800 hover:border-gold-500/30 ${selectedYears.length > 0 ? 'border-gold-500/50 text-gold-400' : ''}`}
                onClick={() => setShowYearFilter(!showYearFilter)}
              >
                <div className="flex items-center gap-2">
                  <ListFilter className="w-4 h-4" />
                  <span>Filter by Survey Year</span>
                </div>
                {selectedYears.length > 0 && (
                  <Badge className="ml-2 bg-gold-500 text-navy-950 px-1.5 h-5">{selectedYears.length}</Badge>
                )}
              </Button>

              <AnimatePresence>
                {showYearFilter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-72 glass-card bg-navy-900 rounded-xl border border-navy-700 shadow-2xl p-4 z-50"
                  >
                    <div className="flex justify-between items-center mb-4 border-b border-navy-800 pb-2">
                      <span className="text-sm font-semibold text-white">Select Years</span>
                      {selectedYears.length > 0 && (
                        <button onClick={() => setSelectedYears([])} className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1">
                          <X className="w-3 h-3" /> Clear
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      {allYears.map(year => (
                        <div
                          key={year}
                          onClick={() => toggleYear(year)}
                          className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedYears.includes(year) ? 'bg-gold-500/10' : 'hover:bg-navy-800'}`}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={selectedYears.includes(year)}
                              onCheckedChange={() => toggleYear(year)}
                              className="border-navy-500 data-[state=checked]:bg-gold-500 data-[state=checked]:border-gold-500"
                            />
                            <span className={`text-sm ${selectedYears.includes(year) ? 'text-gold-400 font-medium' : 'text-gray-300'}`}>
                              {year} Survey
                            </span>
                          </div>
                          <Badge variant="secondary" className="bg-navy-800 text-navy-200 border-navy-700">{yearCounts[year]}</Badge>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Grid Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-navy-900/40 border border-navy-800 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-navy-800/40 transition-colors">
            <span className="text-3xl font-bold text-white mb-1">{profiles.length}</span>
            <span className="text-xs text-navy-300 font-medium uppercase tracking-wider">Total Members</span>
          </div>
          <div className="bg-navy-900/40 border border-navy-800 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-navy-800/40 transition-colors">
            <span className="text-3xl font-bold text-gold-400 mb-1">{filteredProfiles.length}</span>
            <span className="text-xs text-navy-300 font-medium uppercase tracking-wider">Filtered</span>
          </div>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, i) => {
              const hasSurveys = profile.completed_surveys.length > 0;
              const isClickable = hasSurveys || userRole === 'admin';

              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    onClick={() => handleCardClick(profile)}
                    className={`h-full border-0 bg-navy-900/60 backdrop-blur-sm hover:bg-navy-800/60 transition-all duration-300 group overflow-hidden relative ${isClickable ? 'cursor-pointer hover:shadow-2xl hover:shadow-gold-900/20 hover:-translate-y-1' : 'opacity-80'}`}
                  >
                    {/* Top Decorative Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800 group-hover:via-gold-500 transition-all duration-500"></div>

                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-6">
                        <Avatar className="w-16 h-16 rounded-xl border-2 border-navy-700 shadow-lg group-hover:border-gold-500/50 transition-colors">
                          <AvatarImage src={profile.profile_picture_url || ''} className="object-cover" />
                          <AvatarFallback className="bg-navy-800 text-gold-500 rounded-xl">
                            <Building2 className="w-8 h-8" />
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" className="border-navy-600 text-navy-300 text-xs">
                            {profile.user_role}
                          </Badge>
                          {hasSurveys && (
                            <Badge className="bg-gold-500/10 text-gold-400 border-gold-500/20 hover:bg-gold-500/20">
                              {profile.completed_surveys.length} Surveys
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-gold-400 transition-colors">
                            {profile.company_name}
                          </h3>
                          {profile.email && !profile.email.includes('test@') && (
                            <div className="flex items-center text-sm text-navy-300 gap-2 mb-3">
                              <Mail className="w-3.5 h-3.5" />
                              <span className="truncate">{profile.email}</span>
                            </div>
                          )}
                        </div>

                        {profile.description && (
                          <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                            {profile.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-6 mt-4 border-t border-navy-800 flex items-center justify-between">
                        {profile.website ? (
                          <a
                            href={profile.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-navy-400 hover:text-white flex items-center gap-1.5 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="w-3.5 h-3.5" /> Website
                          </a>
                        ) : <span></span>}

                        {isClickable && (
                          <span className="text-xs font-semibold text-gold-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            View Details <span className="text-lg leading-none">›</span>
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-navy-900/30 rounded-3xl border border-navy-800 border-dashed">
            <User className="w-16 h-16 mx-auto text-navy-700 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Profiles Found</h3>
            <p className="text-navy-300">Try adjusting your filters or search terms</p>
            <Button
              variant="link"
              onClick={() => { setSearchTerm(''); setSelectedYears([]); }}
              className="text-gold-500 mt-2"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
