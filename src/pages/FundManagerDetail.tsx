// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Mail, 
  MapPin, 
  Calendar, 
  Globe, 
  Building2, 
  Target, 
  Users, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Phone,
  Briefcase,
  TrendingUp,
  DollarSign,
  FileText,
  Award,
  Star,
  Shield,
  BarChart3,
  ArrowLeft,
  Pencil
} from 'lucide-react';
import { getSurveySections } from '@/utils/surveySectionMappings';
import { getQuestionLabel } from '@/utils/surveyQuestionLabels';
import AdminEditProfileDialog from '@/components/network/AdminEditProfileDialog';

interface FundManager {
  id: string;
  user_id: string;
  fund_name: string;
  year?: number;
  firm_name?: string;
  vehicle_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  linkedin?: string;
  team_based?: string[];
  geographic_focus?: string[];
  fund_stage?: string;
  investment_timeframe?: string;
  target_sectors?: string[];
  vehicle_websites?: string;
  vehicle_type?: string;
  thesis?: string;
  team_size_max?: number;
  legal_domicile?: string;
  ticket_size_min?: string;
  ticket_size_max?: string;
  target_capital?: string;
  sectors_allocation?: string[];
  website?: string;
  primary_investment_region?: string;
  fund_type?: string;
  year_founded?: number;
  team_size?: number;
  typical_check_size?: string;
  completed_at?: string;
  aum?: string;
  investment_thesis?: string;
  sector_focus?: string[];
  stage_focus?: string[];
  role_badge?: string;
  has_survey?: boolean;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  // Comprehensive survey data
  survey2021?: Record<string, unknown>;
  survey2022?: Record<string, unknown>;
  survey2023?: Record<string, unknown>;
  survey2024?: Record<string, unknown>;
}

interface FundManagerProfile {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  fund_name?: string;
  firm_name?: string;
  vehicle_name?: string;
  participant_name?: string;
  role_title?: string;
  email_address?: string;
  phone?: string;
  linkedin?: string;
  team_based?: string[];
  geographic_focus?: string[];
  fund_stage?: string;
  investment_timeframe?: string;
  target_sectors?: string[];
  vehicle_websites?: string;
  vehicle_type?: string;
  thesis?: string;
  team_size_max?: number;
  legal_domicile?: string;
  ticket_size_min?: string;
  ticket_size_max?: string;
  target_capital?: string;
  sectors_allocation?: string[];
  website?: string;
  primary_investment_region?: string;
  fund_type?: string;
  year_founded?: number;
  team_size?: number;
  typical_check_size?: string;
  completed_at?: string;
  aum?: string;
  investment_thesis?: string;
  sector_focus?: string[];
  stage_focus?: string[];
  role_badge?: string;
  has_survey?: boolean;
  profile_picture_url?: string;
}

const FundManagerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole } = useAuth();
  const { toast } = useToast();
  
  const [fundManager, setFundManager] = useState<FundManager | null>(null);
  const [loading, setLoading] = useState(true);
  const [surveyStatus, setSurveyStatus] = useState<{[key: string]: boolean}>({});
  const [surveys, setSurveys] = useState<Array<{ year: number; data: any }>>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<number>(1);
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, { viewer: boolean; member: boolean; admin: boolean }>>({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);


  const fetchFundManagerData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching fund manager data for user:', id);

      // Fetch from user_profiles table (same as network page)
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        toast({
          title: "Error",
          description: "Failed to fetch profile data",
          variant: "destructive",
        });
        return;
      }

      // Process the data
      const processedProfile: FundManagerProfile = {
        id: profileData.id,
        user_id: profileData.id,
        fund_name: profileData.company_name && profileData.company_name.trim().toLowerCase() !== 'not provided' ? profileData.company_name : '',
        firm_name: profileData.company_name && profileData.company_name.trim().toLowerCase() !== 'not provided' ? profileData.company_name : '',
        participant_name: profileData.company_name && profileData.company_name.trim().toLowerCase() !== 'not provided' ? profileData.company_name : '',
        role_title: 'Fund Manager',
        email_address: profileData.email,
        phone: profileData.phone || '',
        website: profileData.website || '',
        linkedin: '',
        first_name: profileData.company_name?.split(' ')[0] || '',
        last_name: profileData.company_name?.split(' ').slice(1).join(' ') || '',
        email: profileData.email || '',
        profile_picture_url: profileData.profile_photo_url || '',
        description: profileData.description || ''
      };

        setFundManager(processedProfile as FundManager);
      } catch (error) {
        console.error('Error fetching fund manager data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch fund manager data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }, [id, toast]);

    const checkSurveyStatus = async () => {
      const years = ['2021', '2022', '2023', '2024'];
      const status: {[key: string]: boolean} = {};
      for (const year of years) {
        try {
          const { data } = await supabase
            .from(`survey_responses_${year}` as any)
            .select('id')
            .eq('user_id', id)
            .eq('submission_status', 'completed')
            .maybeSingle();
          status[year] = Boolean(data);
        } catch (error) {
          status[year] = false;
        }
      }
      setSurveyStatus(status);
    };

    const fetchFieldVisibility = async () => {
      try {
        const { data, error } = await supabase
          .from('field_visibility')
          .select('field_name, viewer_visible, member_visible, admin_visible, survey_year');
        if (error) throw error;
        const visibilityMap: Record<string, { viewer: boolean; member: boolean; admin: boolean }> = {};
        data?.forEach((field: any) => {
          visibilityMap[`${field.field_name}_${field.survey_year}`] = {
            viewer: field.viewer_visible,
            member: field.member_visible,
            admin: field.admin_visible,
          };
        });
        setFieldVisibility(visibilityMap);
      } catch (error) {
        // noop
      }
    };

    const fetchSurveys = async () => {
      if (!id) return;
      const years = [2021, 2022, 2023, 2024];
      const collected: Array<{ year: number; data: any }> = [];
      for (const year of years) {
        try {
          const { data, error } = await supabase
            .from(`survey_responses_${year}` as any)
            .select('*')
            .eq('user_id', id)
            .eq('submission_status', 'completed')
            .maybeSingle();
          if (data && !error) collected.push({ year, data });
        } catch (e) {
          // continue
        }
      }
      setSurveys(collected);
      if (collected.length > 0) {
        setSelectedYear(collected[0].year);
        setSelectedSection(1); // Reset to first section when year changes
      }
    };

  // Helper functions - must be defined before useEffects that use them
  const isFieldVisible = (fieldName: string, year: number): boolean => {
    const key = `${fieldName}_${year}`;
    const visibility = fieldVisibility[key];
    if (!visibility) return false;
    if (userRole === 'admin') return visibility.admin;
    if (userRole === 'member') return visibility.member;
    if (userRole === 'viewer') return visibility.viewer;
    return false;
  };

  const getSectionData = (surveyData: any, year: number) => {
    if (!surveyData) return [];
    
    // Get the proper sections for this year
    const yearSections = getSurveySections(year);
    if (!yearSections || yearSections.length === 0) return [];
    
    // Build sections with visible fields
    const sections = yearSections.map(section => {
      const visibleFields = section.fields.filter(fieldName => {
        // Exclude metadata fields
        if (['id', 'user_id', 'created_at', 'updated_at', 'submission_status', 'completed_at', 'form_data'].includes(fieldName)) {
          return false;
        }
        // Check if field exists in survey data
        if (!(fieldName in surveyData)) {
          return false;
        }
        // Check visibility
        return isFieldVisible(fieldName, year);
      });
      
      return {
        id: section.id,
        title: section.title,
        fields: visibleFields
      };
    }).filter(section => section.fields.length > 0); // Only return sections with visible fields
    
    return sections;
  };

  useEffect(() => {
    if (id && (userRole === 'viewer' || userRole === 'member' || userRole === 'admin')) {
      fetchFundManagerData();
    }
  }, [id, userRole, fetchFundManagerData]);

  useEffect(() => {
    if (id) {
      checkSurveyStatus();
      fetchFieldVisibility();
      fetchSurveys();
    }
  }, [id]);

  // Reset selected section when year changes or ensure it's valid
  useEffect(() => {
    if (selectedYear && surveys.find(s => s.year === selectedYear)) {
      const surveyData = surveys.find(s => s.year === selectedYear)?.data;
      if (surveyData) {
        const sections = getSectionData(surveyData, selectedYear);
        if (sections.length > 0) {
          // If current selected section doesn't exist in new year, reset to first section
          const sectionExists = sections.some(s => s.id === selectedSection);
          if (!sectionExists) {
            setSelectedSection(sections[0].id);
          }
        } else {
          // No sections available, reset to 1
          setSelectedSection(1);
        }
      }
    }
  }, [selectedYear, surveys]);

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!fundManager) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Fund Manager Not Found</h1>
            <p className="text-gray-600 mb-6">The requested fund manager could not be found.</p>
            <Button onClick={() => navigate('/network')} className="inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Network
            </Button>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  const isPlainObject = (val: unknown): val is Record<string, unknown> => {
    return Object.prototype.toString.call(val) === '[object Object]';
  };

  const renderArray = (arr: unknown[]) => {
    if (arr.length === 0) return <span className="text-muted-foreground">N/A</span>;
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((item, idx) => (
          <Badge key={idx} variant="secondary" className="px-2 py-0.5">
            {String(item)}
          </Badge>
        ))}
      </div>
    );
  };

  const renderObject = (obj: Record<string, unknown>) => {
    const entries = Object.entries(obj).filter(([k]) => k !== '_id');
    if (entries.length === 0) return <span className="text-muted-foreground">N/A</span>;
    return (
      <div className="space-y-2">
        {entries.map(([key, val]) => (
          <div key={key} className="flex flex-col sm:flex-row sm:items-start sm:gap-3">
            <span className="text-xs font-medium text-muted-foreground sm:w-1/3">{formatFieldName(key)}</span>
            <div className="text-sm sm:flex-1">
              {val === null || val === undefined ? (
                <span className="text-muted-foreground">N/A</span>
              ) : Array.isArray(val) ? (
                renderArray(val)
              ) : isPlainObject(val) ? (
                <div className="space-y-1">
                  {Object.entries(val as Record<string, unknown>)
                    .filter(([k2, v2]) => {
                      const trimmedKey = k2.trim();
                      // Filter out standalone "G" or "g" keys - these are artifacts from data issues
                      if (trimmedKey === 'G' || trimmedKey === 'g') return false;
                      // Don't render truncated key row when value is empty and there's no "G" to merge - avoids empty space
                      const emptyOrMissing = v2 === null || v2 === undefined || (typeof v2 === 'string' && String(v2).trim() === '');
                      const truncatedOnly = (k2.endsWith('(e') && !k2.includes('(e.g.')) || k2.trim().endsWith('(e');
                      const gVal = (val as Record<string, unknown>)['G'] ?? (val as Record<string, unknown>)['g'];
                      if (emptyOrMissing && truncatedOnly && (gVal == null || (typeof gVal === 'string' && gVal.trim() === ''))) return false;
                      return true;
                    })
                    .map(([k2, v2]) => {
                      // Handle nested objects properly
                      let displayValue: string;
                      const emptyOrMissing = v2 === null || v2 === undefined || (typeof v2 === 'string' && v2.trim() === '');
                      const truncatedKeyNeedsMerge = (k2.endsWith('(e') && !k2.includes('(e.g.')) || k2.trim().endsWith('(e');
                      const gVal = (val as Record<string, unknown>)['G'] ?? (val as Record<string, unknown>)['g'];

                      if (emptyOrMissing && truncatedKeyNeedsMerge && gVal != null) {
                        // Value for this criterion is stored under "G" due to data truncation
                        if (typeof gVal === 'string') {
                          displayValue = gVal;
                        } else if (isPlainObject(gVal)) {
                          const nested = gVal as Record<string, unknown>;
                          if (typeof nested.value === 'string') displayValue = nested.value;
                          else if (typeof nested.label === 'string') displayValue = nested.label;
                          else if (typeof nested.text === 'string') displayValue = nested.text;
                          else displayValue = String(Object.values(nested).find(v => typeof v === 'string') ?? 'N/A');
                        } else {
                          displayValue = String(gVal);
                        }
                      } else if (v2 === null || v2 === undefined) {
                        displayValue = 'N/A';
                      } else if (Array.isArray(v2)) {
                        displayValue = v2.length > 0 ? v2.join(', ') : 'N/A';
                      } else if (isPlainObject(v2)) {
                        // If the value is itself an object, try to extract meaningful data
                        const nestedObj = v2 as Record<string, unknown>;
                        if ('value' in nestedObj && typeof nestedObj.value === 'string') {
                          displayValue = nestedObj.value;
                        } else if ('label' in nestedObj && typeof nestedObj.label === 'string') {
                          displayValue = nestedObj.label;
                        } else if ('text' in nestedObj && typeof nestedObj.text === 'string') {
                          displayValue = nestedObj.text;
                        } else {
                          // Fallback: try to find the first string value in the object
                          const firstStringValue = Object.values(nestedObj).find(v => typeof v === 'string');
                          displayValue = firstStringValue ? String(firstStringValue) : JSON.stringify(nestedObj, null, 2);
                        }
                      } else {
                        displayValue = String(v2);
                      }
                      
                      // For gender_lens_investing and similar fields, keys are human-readable strings
                      // Don't format them as field names - display as-is
                      // Check if key looks like a human-readable sentence (contains spaces and punctuation)
                      const isHumanReadableKey = k2.includes(' ') || k2.includes('(') || k2.includes(')') || k2.length > 20;
                      let displayKey = isHumanReadableKey ? k2 : formatFieldName(k2);
                      
                      // Fix truncated keys that end with "(e" - complete them properly
                      if (displayKey.endsWith('(e') && !displayKey.includes('(e.g.')) {
                        // Complete the common pattern for gender equality policies
                        displayKey = displayKey + '.g. equal compensation)';
                      }
                      
                      return (
                        <div key={k2} className="flex items-start gap-2">
                          <span className="text-xs font-medium text-muted-foreground min-w-[12rem] break-words">{displayKey}</span>
                          <span className="text-sm break-words">{displayValue}</span>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <span>{String(val)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const formatFieldValue = (value: any): JSX.Element => {
    if (value === null || value === undefined) return <span className="text-muted-foreground">N/A</span>;
    if (typeof value === 'boolean') return <span>{value ? 'Yes' : 'No'}</span>;
    if (Array.isArray(value)) return renderArray(value);
    if (isPlainObject(value)) return renderObject(value);
    return <span>{String(value)}</span>;
  };

  const formatFieldName = (field: string): string => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Year selection actions for header (matching AdminAnalytics design)
  const availableYears = [2021, 2022, 2023, 2024];
  const yearSelectionActions = surveys.length > 0 ? (
    <div className="flex items-center gap-2">
      {availableYears.map((year) => {
        const isCompleted = surveyStatus[String(year)];
        const isActive = selectedYear === year;
        if (!isCompleted) return null;
        return (
          <Button
            key={year}
            variant={isActive ? 'default' : 'secondary'}
            className={`h-8 px-3 text-xs ${
              isActive ? 'shadow-md' : 'opacity-80 hover:opacity-100'
            }`}
            onClick={() => {
              setSelectedYear(year);
              setSelectedSection(1); // Reset to first section when year changes
            }}
            aria-pressed={isActive}
          >
            {year}
          </Button>
        );
      })}
    </div>
  ) : null;

  return (
    <SidebarLayout headerActions={yearSelectionActions}>
       <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">

         {/* Main Content - Proper spacing below header */}
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">

            {/* Company Information Section */}
            <div className="mb-8">
              <div className="group relative overflow-hidden rounded-lg bg-[#f5f5dc] border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                <div className="relative flex items-start justify-between gap-4">
                  {/* Left side - Content */}
                  <div className="flex-1 p-6 max-w-[60%] lg:max-w-[65%]">
                     <div className="flex items-center space-x-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                        <Building2 className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-lg font-bold text-gray-800">Company Information</h2>
                      {userRole === 'admin' && (
                        <Button size="sm" variant="outline" className="ml-auto" onClick={(e) => { e.stopPropagation(); setEditDialogOpen(true); }}>
                          <Pencil className="w-3.5 h-3.5 mr-1.5" />
                          Edit
                        </Button>
                      )}
                    </div>

                   <div className="space-y-4">
                     {/* Company Name - only show when provided */}
                     {fundManager.firm_name && (
                       <div className="flex items-center space-x-3">
                         <Building2 className="w-5 h-5 text-blue-600" />
                         <div>
                           <p className="text-sm font-medium text-gray-700">Company Name</p>
                           <p className="text-sm text-gray-900 font-semibold">{fundManager.firm_name}</p>
                         </div>
                       </div>
                     )}

                     {/* Email - only show when provided */}
                     {fundManager.email_address && (
                       <div className="flex items-center space-x-3">
                         <Mail className="w-5 h-5 text-blue-600" />
                         <div>
                           <p className="text-sm font-medium text-gray-700">Email</p>
                           <p className="text-sm text-gray-900">{fundManager.email_address}</p>
                         </div>
                       </div>
                     )}

                     {/* Website - only show when provided */}
                     {fundManager.website && (
                       <div className="flex items-center space-x-3">
                         <Globe className="w-5 h-5 text-blue-600" />
                         <div>
                           <p className="text-sm font-medium text-gray-700">Website</p>
                           <a 
                             href={fundManager.website.startsWith('http') ? fundManager.website : `https://${fundManager.website}`}
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-sm text-blue-600 hover:underline break-all"
                           >
                             {fundManager.website}
                           </a>
                         </div>
                       </div>
                     )}

                     {/* Description - only show when provided */}
                     {fundManager.description && (
                       <div className="flex items-start space-x-3">
                         <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                         <div>
                           <p className="text-sm font-medium text-gray-700">Description</p>
                           <p className="text-sm text-gray-900">{fundManager.description}</p>
                         </div>
                       </div>
                     )}
                   </div>
                 </div>

                {/* Right side - Large Profile Picture inside card */}
                <div className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 flex-none border-4 border-white shadow-lg rounded-xl overflow-hidden ml-auto mr-2 mt-4 mb-6">
                   {fundManager.profile_picture_url ? (
                     <img 
                       src={fundManager.profile_picture_url} 
                       alt="Profile" 
                       className="w-full h-full object-cover"
                     />
                   ) : (
                     <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                       <span className="text-6xl font-bold text-white">
                         {fundManager.participant_name?.charAt(0) || fundManager.first_name?.charAt(0) || 'F'}
                       </span>
                     </div>
                   )}
                 </div>
               </div>
             </div>

            {/* Survey Responses Section - Full Width */}
            {surveys.length > 0 && selectedYear && surveys.find(s => s.year === selectedYear) ? (
              <div className="mt-8">
                {(() => {
                  const sections = getSectionData(surveys.find(s => s.year === selectedYear)?.data, selectedYear);
                  if (sections.length === 0) {
                    return <p className="text-sm text-gray-500">No visible data for your access level.</p>;
                  }
                  
                  // Ensure selectedSection is valid
                  const validSection = sections.find(s => s.id === selectedSection) || sections[0];
                  const currentSection = validSection;
                  const surveyData = surveys.find(s => s.year === selectedYear)?.data;
                  
                  return (
                    <>
                      {/* Section Selector - Matching AdminAnalytics Design */}
                      <div className="rounded-2xl border border-blue-900/15 bg-white shadow-md p-5 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-blue-900" />
                            <span className="text-xs font-semibold text-blue-900 uppercase tracking-[0.18em]">Survey Sections</span>
                          </div>
                          <span className="text-[11px] text-slate-500">Choose a focus area to explore data</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {sections.map((section) => {
                            const isActive = selectedSection === section.id;
                            return (
                              <Button
                                key={section.id}
                                size="sm"
                                variant="ghost"
                                className={`h-9 px-4 text-[11px] font-medium tracking-wide transition-all rounded-full ${
                                  isActive
                                    ? 'bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-md hover:brightness-110'
                                    : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                                }`}
                                onClick={() => setSelectedSection(section.id)}
                                aria-pressed={isActive}
                              >
                                <span className="mr-2 font-semibold">{section.id}.</span>
                                <span className="truncate max-w-[140px]">{section.title}</span>
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section Content */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{currentSection.title}</h2>
                            <p className="text-muted-foreground mt-1">Survey year {selectedYear}</p>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 border-blue-300" variant="outline">
                            {currentSection.fields.length} fields
                          </Badge>
                        </div>

                        <Card className="border-2 border-blue-200/60 shadow-sm bg-white">
                          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-200/60 rounded-t-md">
                            <CardTitle className="flex items-center justify-between text-gray-800">
                              <span className="text-lg font-bold">{currentSection.title}</span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {currentSection.fields.map((field: string) => (
                                <div key={field} className="rounded-lg border border-blue-200/60 bg-gradient-to-br from-white to-blue-50/30 p-4 hover:shadow-md transition-shadow">
                                  <p className="font-semibold text-[11px] uppercase tracking-wide text-gray-600 mb-2">
                                    {getQuestionLabel(field, selectedYear)}
                                  </p>
                                  <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-900">
                                    {formatFieldValue(surveyData?.[field])}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : surveys.length === 0 ? (
              <div className="mt-8">
                <p className="text-sm text-gray-500">No survey responses available for this fund manager.</p>
              </div>
            ) : null}
           </div>
        </div>
       </div>

      {userRole === 'admin' && id && (
        <AdminEditProfileDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          userId={id}
          onSaved={() => fetchFundManagerData()}
        />
      )}
    </SidebarLayout>
  );
};

export default FundManagerDetail;