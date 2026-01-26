import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Mail, Globe, Loader2, User, ChevronDown, ChevronUp, ListFilter, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import FundManagerDetailModal from './FundManagerDetailModal';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  email: string;
  company_name: string;
  description: string | null;
  website: string | null;
  profile_picture_url: string | null;
  user_role: string;
  completed_surveys: string[]; // Array of years: ['2021', '2022', etc.]
}

export default function MemberNetworkPageNew() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({});
  const [selectedYears, setSelectedYears] = useState<string[]>([]); // Empty array = show all
  const [showYearFilter, setShowYearFilter] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchTerm, profiles, selectedYears]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    if (!showYearFilter) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const filterContainer = document.querySelector('.year-filter-container');
      
      // Check if click is outside the filter container
      if (filterContainer && !filterContainer.contains(target)) {
        setShowYearFilter(false);
      }
    };

    // Use a small delay to ensure the click event that opened it doesn't immediately close it
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside, true);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showYearFilter]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles and all survey data in parallel (optimized: only 5 queries total)
      const [profilesResult, survey2021Result, survey2022Result, survey2023Result, survey2024Result] = await Promise.all([
        supabase
          .from('user_profiles')
          .select('id, email, company_name, description, website, profile_picture_url, user_role')
          .not('email', 'like', '%.test@escpnetwork.net')
          .order('company_name'),
        supabase
          .from('survey_responses_2021')
          .select('user_id')
          .eq('submission_status', 'completed'),
        supabase
          .from('survey_responses_2022')
          .select('user_id')
          .eq('submission_status', 'completed'),
        supabase
          .from('survey_responses_2023')
          .select('user_id')
          .eq('submission_status', 'completed'),
        supabase
          .from('survey_responses_2024')
          .select('user_id')
          .eq('submission_status', 'completed')
      ]);

      if (profilesResult.error) throw profilesResult.error;

      // Create a Map of user_id -> array of completed survey years
      const userSurveyYears = new Map<string, string[]>();
      
      // Track which years each user has completed
      if (survey2021Result.data) {
        survey2021Result.data.forEach(survey => {
          if (survey.user_id) {
            const existing = userSurveyYears.get(survey.user_id) || [];
            if (!existing.includes('2021')) {
              userSurveyYears.set(survey.user_id, [...existing, '2021']);
            }
          }
        });
      }
      
      if (survey2022Result.data) {
        survey2022Result.data.forEach(survey => {
          if (survey.user_id) {
            const existing = userSurveyYears.get(survey.user_id) || [];
            if (!existing.includes('2022')) {
              userSurveyYears.set(survey.user_id, [...existing, '2022']);
            }
          }
        });
      }
      
      if (survey2023Result.data) {
        survey2023Result.data.forEach(survey => {
          if (survey.user_id) {
            const existing = userSurveyYears.get(survey.user_id) || [];
            if (!existing.includes('2023')) {
              userSurveyYears.set(survey.user_id, [...existing, '2023']);
            }
          }
        });
      }
      
      if (survey2024Result.data) {
        survey2024Result.data.forEach(survey => {
          if (survey.user_id) {
            const existing = userSurveyYears.get(survey.user_id) || [];
            if (!existing.includes('2024')) {
              userSurveyYears.set(survey.user_id, [...existing, '2024']);
            }
          }
        });
      }

      // Map profiles and include completed survey years
      const profilesWithSurveys = (profilesResult.data || []).map(profile => ({
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

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(profile =>
        profile.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected years - must have ALL selected years (AND logic)
    if (selectedYears.length > 0) {
      filtered = filtered.filter(profile => {
        // Show profiles that have ALL of the selected years
        return selectedYears.every(year => profile.completed_surveys.includes(year));
      });
    }

    setFilteredProfiles(filtered);
  };

  // Calculate counts for each year
  const getYearCounts = () => {
    const counts: Record<string, number> = {
      '2021': 0,
      '2022': 0,
      '2023': 0,
      '2024': 0
    };

    profiles.forEach(profile => {
      profile.completed_surveys.forEach(year => {
        if (counts[year] !== undefined) {
          counts[year]++;
        }
      });
    });

    return counts;
  };

  const yearCounts = getYearCounts();
  const allYears = ['2021', '2022', '2023', '2024'];

  const toggleYear = (year: string) => {
    setSelectedYears(prev => {
      if (prev.includes(year)) {
        return prev.filter(y => y !== year);
      } else {
        return [...prev, year];
      }
    });
  };

  const clearYearFilter = () => {
    setSelectedYears([]);
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
    if (profile.completed_surveys.length > 0 || userRole === 'admin') {
      navigate(`/network/fund-manager/${profile.id}`);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse max-w-md"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="relative overflow-hidden min-h-[400px] animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400"></div>
              <div className="relative z-10 h-full flex flex-col justify-end p-6 space-y-4">
                <div className="h-6 bg-gray-500/50 rounded w-3/4"></div>
                <div className="h-4 bg-gray-500/40 rounded w-1/2"></div>
                <div className="h-4 bg-gray-500/40 rounded w-2/3"></div>
                <div className="h-3 bg-gray-500/30 rounded w-full"></div>
                <div className="h-3 bg-gray-500/30 rounded w-5/6"></div>
                <div className="flex gap-2 pt-2">
                  <div className="h-6 bg-gray-500/40 rounded-full w-16"></div>
                  <div className="h-6 bg-gray-500/40 rounded-full w-24"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="min-h-screen"
        style={{
          backgroundImage: 'url(/member.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="container mx-auto py-8 px-4 relative z-10">
        <div className="mb-8 space-y-4">
          {/* Search and Filter Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <Input
              placeholder="Search by company name, email, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md rounded-lg bg-white/95 backdrop-blur-sm border-gray-300/50 shadow-lg"
            />
            
            {/* Year Filter */}
            <div className="relative year-filter-container">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowYearFilter(prev => !prev);
                }}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-lg border-slate-300 hover:border-emerald-400 hover:bg-emerald-50 transition-all backdrop-blur-sm ${
                  selectedYears.length > 0 
                    ? 'bg-emerald-50/95 border-emerald-300 text-emerald-700 shadow-lg' 
                    : 'bg-white/95 text-slate-700 hover:bg-white shadow-lg'
                }`}
                type="button"
              >
                <ListFilter className={`w-4 h-4 ${
                  selectedYears.length > 0 
                    ? 'text-emerald-700' 
                    : 'text-slate-600'
                }`} />
                <span className="text-sm font-medium">Year</span>
                {selectedYears.length > 0 && (
                  <Badge className="ml-0.5 bg-emerald-600 text-white font-semibold px-1.5 py-0 text-xs h-5 min-w-[20px] flex items-center justify-center">
                    {selectedYears.length}
                  </Badge>
                )}
              </Button>

              {showYearFilter && (
                <Card 
                  className="absolute right-0 top-full mt-2 z-[100] min-w-[280px] shadow-xl border border-slate-200 bg-white/98 backdrop-blur-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">Filter by Survey Year</CardTitle>
                      {selectedYears.length > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clearYearFilter();
                          }}
                          className="h-6 px-2 text-xs"
                          type="button"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {allYears.map(year => {
                        const count = yearCounts[year];
                        const isSelected = selectedYears.includes(year);
                        return (
                          <div
                            key={year}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleYear(year);
                            }}
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  if (checked !== isSelected) {
                                    toggleYear(year);
                                  }
                                }}
                                id={`year-${year}`}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <label
                                htmlFor={`year-${year}`}
                                className="text-sm font-medium text-slate-900 cursor-pointer flex-1"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  toggleYear(year);
                                }}
                              >
                                {year} Survey
                              </label>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`${
                                isSelected
                                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              {count}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                    {selectedYears.length === 0 && (
                      <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                        Showing all profiles ({profiles.length} total)
                      </p>
                    )}
                    {selectedYears.length > 0 && (
                      <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                        Showing {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''} with all selected year{selectedYears.length !== 1 ? 's' : ''} ({selectedYears.join(', ')})
                      </p>
                    )}
                    </CardContent>
                  </Card>
                )}
            </div>
          </div>

          {/* Active Filters Display */}
          {selectedYears.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600">Active filters:</span>
              {selectedYears.map(year => (
                <Badge
                  key={year}
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 border-emerald-300 cursor-pointer hover:bg-emerald-200"
                  onClick={() => toggleYear(year)}
                >
                  {year}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => {
            const isClickable = profile.completed_surveys.length > 0 || userRole === 'admin';
            
            return (
              <Card 
                key={profile.id} 
                className={`transition-shadow relative overflow-hidden min-h-[400px] backdrop-blur-sm ${
                  isClickable 
                    ? 'hover:shadow-xl cursor-pointer hover:border-primary hover:scale-[1.02]' 
                    : 'opacity-75'
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
                  {/* Dark overlay for readability */}
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300"></div>
                </div>

                                 {/* Content Overlay - Directly on Image */}
                 <div className="relative z-[1] h-full flex flex-col justify-end p-6 space-y-1">
                   {/* Company Name */}
                   <div className="flex items-center gap-2">
                     <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                     <CardTitle className="text-lg text-white drop-shadow-md">{profile.company_name || 'No Company Name'}</CardTitle>
                   </div>

                   {/* Email */}
                   <div className="flex items-center gap-2 text-sm text-gray-100">
                     <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                     <span className="truncate drop-shadow">{profile.email}</span>
                   </div>

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

                   {/* Badges */}
                   <div className="flex flex-wrap gap-2 pt-2">
                     <Badge className="bg-black/40 backdrop-blur-sm text-white border-white/20">
                       {profile.user_role}
                     </Badge>
                     {profile.completed_surveys.map((year) => (
                       <Badge 
                         key={year}
                         className="bg-emerald-700/90 backdrop-blur-sm text-white border-emerald-600/70 font-medium"
                       >
                         {year}
                       </Badge>
                     ))}
                   </div>
                 </div>
              </Card>
            );
          })}
        </div>

        {filteredProfiles.length === 0 && (
          <div className="text-center py-12">
            <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No profiles found matching your search</p>
          </div>
        )}
        </div>
      </div>

      {/* Modal no longer used; redirecting to detail page */}
    </>
  );
}
