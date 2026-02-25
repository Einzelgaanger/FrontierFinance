import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Mail, Globe, User, Loader2, FileText, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  company_name: string;
  description: string | null;
  website: string | null;
  profile_picture_url: string | null;
  user_role: string;
  has_surveys: boolean;
}

export default function ViewerNetworkPageNew() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});

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
        supabase.from('company_members').select('member_user_id'),
        supabase.from('survey_responses_2021').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2022').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2023').select('user_id').eq('submission_status', 'completed'),
        supabase.from('survey_responses_2024').select('user_id').eq('submission_status', 'completed')
      ]);

      if (profilesResult.error) throw profilesResult.error;

      const secondaryMemberIds = new Set((companyMembersResult.data || []).map((m: { member_user_id: string }) => m.member_user_id));
      const allProfiles = (profilesResult.data || []).filter((p: { id: string }) => !secondaryMemberIds.has(p.id));

      const usersWithSurveys = new Set<string>();
      [survey2021Result.data, survey2022Result.data, survey2023Result.data, survey2024Result.data].forEach(surveyData => {
        (surveyData || []).forEach((survey: { user_id?: string }) => {
          if (survey.user_id) usersWithSurveys.add(survey.user_id);
        });
      });

      const profilesWithSurveys = allProfiles.map((profile: any) => ({
        ...profile,
        has_surveys: usersWithSurveys.has(profile.id)
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

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-300';
      case 'member': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'viewer': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const handleCardClick = (profile: UserProfile) => {
    if (profile.has_surveys) {
      navigate(`/network/fund-manager/${profile.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 font-sans p-6 sm:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-gold-500 animate-spin" />
          <p className="text-navy-300 animate-pulse">Loading Network...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-navy-950 font-sans p-6 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="section-label text-gold-400/90">Network</span>
              <h1 className="text-2xl sm:text-3xl font-display font-normal text-white mt-1 tracking-tight">Network Directory</h1>
              <div className="w-14 h-0.5 bg-gold-500/60 mt-3 rounded-full" />
              <p className="text-navy-200 mt-3">Browse fund managers in the CFF Network. Only primary account holders are listed.</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-4 sm:p-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
              <Input
                placeholder="Search by company name, email, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-navy-900/50 border-navy-700 text-white placeholder:text-navy-400 focus:border-gold-500/50 focus:ring-gold-500/20 rounded-xl h-12"
              />
            </div>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => {
          const isClickable = profile.has_surveys;
          return (
            <Card
              key={profile.id}
              className={`transition-all duration-300 relative overflow-hidden min-h-[380px] bg-navy-900/60 backdrop-blur-sm border border-navy-700 hover:border-gold-500/30 ${
                isClickable ? 'cursor-pointer hover:shadow-xl hover:shadow-gold-900/10 hover:-translate-y-0.5' : 'opacity-80'
              }`}
              onClick={() => handleCardClick(profile)}
            >
                {/* Profile Picture as Background */}
                <div className="absolute inset-0">
                  <Avatar className="w-full h-full rounded-lg">
                    <AvatarImage src={profile.profile_picture_url || ''} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      <Building2 className="w-24 h-24" />
                    </AvatarFallback>
                  </Avatar>
                  {/* Strong dark overlay - nearly opaque for solid card feel */}
                  <div className="absolute inset-0 bg-black/85 group-hover:bg-black/80 transition-all duration-300"></div>
                  {/* Opaque content strip at bottom so text sits on solid background */}
                  <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-900 via-slate-900/98 to-transparent pointer-events-none" aria-hidden></div>
                </div>

                                 {/* Content Overlay - Directly on Image */}
                 <div className="relative z-[1] h-full flex flex-col justify-end p-6 space-y-1">
                   {/* Company Name - only show when provided (not placeholder) */}
                   {profile.company_name && profile.company_name.trim().toLowerCase() !== 'not provided' && (
                     <div className="flex items-center gap-2">
                       <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                       <CardTitle className="text-lg text-white drop-shadow-md">{profile.company_name}</CardTitle>
                     </div>
                   )}

                   {/* Email - only show when provided */}
                   {profile.email && profile.email.trim().toLowerCase() !== 'no email provided' && (
                     <div className="flex items-center gap-2 text-sm text-gray-100">
                       <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                       <span className="truncate drop-shadow">{profile.email}</span>
                     </div>
                   )}

                   {/* Website */}
                   {profile.website && (
                     <div className="flex items-center gap-2 text-sm text-gray-100">
                       <Globe className="w-4 h-4 text-blue-400 flex-shrink-0" />
                       <a
                         href={profile.website}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-blue-300 hover:text-blue-200 hover:underline truncate drop-shadow"
                         onClick={(e) => e.stopPropagation()}
                       >
                         {profile.website}
                       </a>
                     </div>
                   )}

                                       {/* Description */}
                    {profile.description && (
                      <div className="relative">
                        <div 
                          className={`text-sm text-gray-200 drop-shadow transition-all duration-300 ${
                            expandedDescriptions[profile.id] ? 'max-h-32 overflow-y-auto' : 'line-clamp-2'
                          }`}
                          style={{ maxHeight: expandedDescriptions[profile.id] ? '8rem' : 'none' }}
                        >
                          {profile.description}
                        </div>
                        {profile.description.length > 100 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedDescriptions(prev => ({
                                ...prev,
                                [profile.id]: !prev[profile.id]
                              }));
                            }}
                            className="text-blue-400 hover:text-blue-300 text-xs mt-1 flex items-center gap-1"
                          >
                            {expandedDescriptions[profile.id] ? (
                              <>
                                <span>Read Less</span>
                                <ChevronUp className="w-3 h-3" />
                              </>
                            ) : (
                              <>
                                <span>Read More</span>
                                <ChevronDown className="w-3 h-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    )}

                   {/* Badges - solid opaque styling */}
                   <div className="flex flex-wrap gap-2 pt-2">
                     <Badge className="bg-slate-700 text-white border-slate-500">
                       {profile.user_role}
                     </Badge>
                     {profile.has_surveys && (
                       <Badge className="bg-emerald-700 text-white border-emerald-600 font-medium">
                         <FileText className="w-3 h-3 mr-1" />
                         Has Surveys
                       </Badge>
                     )}
                   </div>
                 </div>
          </Card>
          );
        })}
      </div>

      {filteredProfiles.length === 0 && (
        <div className="text-center py-20 bg-navy-900/30 rounded-2xl border border-navy-800 border-dashed">
          <User className="w-16 h-16 mx-auto text-navy-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No profiles found</h3>
          <p className="text-navy-300">Try adjusting your search</p>
        </div>
      )}
        </div>
      </div>

    {/* Modal no longer used for viewers; navigation to detail page instead */}
  </>
  );
}
