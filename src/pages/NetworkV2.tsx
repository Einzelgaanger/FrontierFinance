// @ts-nocheck
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { isStaffEmail } from '@/lib/staff';
import { 
  Search,
  Filter,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  RotateCcw,
  Download,
  Share2,
  Plus,
  BarChart3,
  MoreHorizontal,
  Heart,
  Eye,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  CheckCircle,
  Globe,
  Building2,
  Target,
  Network as NetworkIcon,
  Sparkles,
  TrendingUp,
  Flame,
  Play,
  Pause,
  RefreshCw,
  ArrowUpRight,
  FileText
} from 'lucide-react';

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
  team_member_count?: number;
  profile?: {
    first_name: string;
    last_name: string;
    email: string;
  };
  profiles?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const NetworkV2 = React.memo(() => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [fundManagers, setFundManagers] = useState<FundManager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<FundManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyWithSurveys, setShowOnlyWithSurveys] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedManager, setSelectedManager] = useState<FundManager | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<FundManager[]>([]);
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);

  // Fetch all fund managers
  const fetchFundManagers = useCallback(async () => {
    try {
      if (initialLoad) {
      setLoading(true);
      }
      console.log('Fetching network data...');

      // Fetch user profiles, roles, survey data, and company members (to exclude secondary members)
      const [userProfilesResult, userRolesResult, companyMembersResult, survey2021Result, survey2022Result, survey2023Result, survey2024Result] = await Promise.all([
        supabase.from('user_profiles').select('id, company_name, email, full_name, role_title, profile_picture_url, user_role, is_active, created_at').eq('show_in_directory', true),
        supabase.from('user_roles' as any).select('user_id, role'),
        supabase.from('company_members').select('company_user_id, member_user_id'),
        supabase.from('survey_responses_2021').select('id, user_id, email_address, firm_name, participant_name, role_title, company_name, completed_at'),
        supabase.from('survey_responses_2022').select('id, user_id, email_address, organisation_name, participant_name, role_title, completed_at'),
        supabase.from('survey_responses_2023').select('id, user_id, email_address, organisation_name, completed_at'),
        supabase.from('survey_responses_2024').select('id, user_id, email_address, organisation_name, completed_at')
      ]);

      // Build set of secondary member user IDs to exclude from directory
      const companyMembersList = companyMembersResult.data || [];
      const secondaryMemberIds = new Set(
        companyMembersList.map((m: any) => m.member_user_id)
      );
      // Count team members per company and list of team member IDs per primary
      const teamCountByCompanyId = new Map<string, number>();
      const teamMemberIdsByCompanyId = new Map<string, string[]>();
      companyMembersList.forEach((m: any) => {
        const cid = m.company_user_id;
        teamCountByCompanyId.set(cid, (teamCountByCompanyId.get(cid) || 0) + 1);
        const list = teamMemberIdsByCompanyId.get(cid) || [];
        list.push(m.member_user_id);
        teamMemberIdsByCompanyId.set(cid, list);
      });

      // Handle errors gracefully
      if (userProfilesResult.error) {
        console.warn('Could not fetch user profiles:', userProfilesResult.error);
      }
      if (survey2021Result.error) {
        console.warn('Could not fetch 2021 survey data:', survey2021Result.error);
      }
      if (survey2022Result.error) {
        console.warn('Could not fetch 2022 survey data:', survey2022Result.error);
      }
      if (survey2023Result.error) {
        console.warn('Could not fetch 2023 survey data:', survey2023Result.error);
      }
      if (survey2024Result.error) {
        console.warn('Could not fetch 2024 survey data:', survey2024Result.error);
      }

      // Get all users from user_profiles and roles
      const allUserProfiles = userProfilesResult.data || [];
      const allUserRoles = userRolesResult.data || [];
      const survey2021Users = survey2021Result.data || [];
      const survey2022Users = survey2022Result.data || [];
      const survey2023Users = survey2023Result.data || [];
      const survey2024Users = survey2024Result.data || [];

      // Create a map of user roles for quick lookup
      const rolesMap = new Map();
      allUserRoles.forEach(roleRecord => {
        rolesMap.set(roleRecord.user_id, roleRecord.role);
      });

      // Create a map of survey data for enhanced profiles
      const surveyDataMap = new Map();
      [...survey2021Users, ...survey2022Users, ...survey2023Users, ...survey2024Users].forEach(survey => {
        if (!surveyDataMap.has(survey.user_id)) {
          surveyDataMap.set(survey.user_id, []);
        }
        surveyDataMap.get(survey.user_id).push(survey);
      });

      // Process all users to create network profiles from user_profiles
      // Exclude secondary members and CFF admin team (they should not appear in the directory)
      const filteredProfiles = allUserProfiles.filter(
        (p: any) => !secondaryMemberIds.has(p.id) && !isStaffEmail(p.email)
      );
      let processedManagers = filteredProfiles.map(userProfile => {
        const userId = userProfile.id;
        const teamMemberIds = teamMemberIdsByCompanyId.get(userId) || [];
        const primarySurveys = surveyDataMap.get(userId) || [];
        const teamSurveys = teamMemberIds.flatMap((mid: string) => surveyDataMap.get(mid) || []);
        const userSurveys = [...primarySurveys, ...teamSurveys];

        // Use profile data for company information
        const companyName = userProfile.company_name || '';
        const email = userProfile.email || '';
        const fullName = userProfile.full_name || '';
        const roleTitle = userProfile.role_title || '';
        const profilePhoto = userProfile.profile_picture_url || '';
        const userRole = rolesMap.get(userId) || 'viewer'; // Get role from user_roles table
        const isActive = userProfile.is_active !== false;
        
        return {
          id: userId,
          user_id: userId,
          fund_name: companyName,
          firm_name: companyName,
          participant_name: fullName,
          email_address: email,
          website: '', // Not available in new schema
          description: '', // Not available in new schema
          profile_photo_url: profilePhoto,
          has_survey: userSurveys.length > 0,
          surveys_completed: userSurveys.length,
          survey_data: userSurveys,
          profile: {
            first_name: fullName.split(' ')[0] || '',
            last_name: fullName.split(' ').slice(1).join(' ') || '',
            email: email
          },
          geographic_focus: ['Global'], // Simplified
          vehicle_type: 'Network Participant', // Simplified
          fund_stage: 'Active', // Simplified
          team_size: 1, // Simplified
          year_founded: 2020, // Simplified
          role_title: roleTitle,
          created_at: userProfile.created_at || new Date().toISOString(),
          role_badge: userRole,
          is_active: isActive,
          team_member_count: teamCountByCompanyId.get(userId) || 0
        };
      });

      if (processedManagers.length === 0) {
        // Fallback: create realistic sample data
        console.log('No users found in system, creating realistic sample data');
        processedManagers = [
          {
            id: 'sample-1',
            user_id: 'sample-1',
            fund_name: 'Sample Investment Fund',
            firm_name: 'Sample Investment Fund',
            participant_name: 'Sample Manager',
            email_address: 'sample@example.com',
            has_survey: false,
            profile: {
              first_name: 'Sample',
              last_name: 'Manager',
              email: 'sample@example.com'
            },
            geographic_focus: ['Global'],
            vehicle_type: 'Investment Fund',
            fund_stage: 'Active',
            team_size: 5,
            year_founded: 2020
          }
        ];
      }

      // Batch state updates to prevent blinking
      setFundManagers(processedManagers);
      setFilteredManagers(processedManagers);
      setLastUpdated(new Date());
      setInitialLoad(false);
    } catch (error) {
      console.error('Error fetching fund managers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch network data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, initialLoad]);

  useEffect(() => {
    fetchFundManagers();
  }, [fetchFundManagers]);

  // Filter and search logic
  useEffect(() => {
    let filtered = [...fundManagers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(manager =>
        manager.fund_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.firm_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.participant_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.role_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email_address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Region filter
    if (filterRegion !== 'all') {
      filtered = filtered.filter(manager =>
        manager.geographic_focus?.includes(filterRegion) ||
        manager.primary_investment_region === filterRegion
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(manager =>
        manager.vehicle_type === filterType ||
        manager.fund_type === filterType
      );
    }

    // Stage filter
    if (filterStage !== 'all') {
      filtered = filtered.filter(manager =>
        manager.fund_stage === filterStage ||
        manager.stage_focus?.includes(filterStage)
      );
    }

    if (showOnlyWithSurveys) {
      filtered = filtered.filter(manager => manager.has_survey);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = '';
      let bValue = '';

      switch (sortBy) {
        case 'name':
          aValue = a.fund_name || a.firm_name || '';
          bValue = b.fund_name || b.firm_name || '';
          break;
        case 'region':
          aValue = a.primary_investment_region || '';
          bValue = b.primary_investment_region || '';
          break;
        case 'type':
          aValue = a.vehicle_type || a.fund_type || '';
          bValue = b.vehicle_type || b.fund_type || '';
          break;
        case 'stage':
          aValue = a.fund_stage || '';
          bValue = b.fund_stage || '';
          break;
        default:
          aValue = a.fund_name || a.firm_name || '';
          bValue = b.fund_name || b.firm_name || '';
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setFilteredManagers(filtered);
  }, [fundManagers, searchTerm, filterRegion, filterType, filterStage, showOnlyWithSurveys, sortBy, sortOrder]);

  // Get unique values for filters
  const getRegions = () => {
    const regions = new Set<string>();
    fundManagers.forEach(manager => {
      if (manager.geographic_focus) {
        manager.geographic_focus.forEach(region => regions.add(region));
      }
      if (manager.primary_investment_region) {
        regions.add(manager.primary_investment_region);
      }
    });
    return Array.from(regions).sort();
  };

  const getFundTypes = () => {
    const types = new Set<string>();
    fundManagers.forEach(manager => {
      if (manager.vehicle_type) types.add(manager.vehicle_type);
      if (manager.fund_type) types.add(manager.fund_type);
    });
    return Array.from(types).sort();
  };

  const getFundStages = () => {
    const stages = new Set<string>();
    fundManagers.forEach(manager => {
      if (manager.fund_stage) stages.add(manager.fund_stage);
      if (manager.stage_focus) {
        manager.stage_focus.forEach(stage => stages.add(stage));
      }
    });
    return Array.from(stages).sort();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterRegion('all');
    setFilterType('all');
    setFilterStage('all');
    setShowOnlyWithSurveys(false);
  };

  // Enhanced network statistics
  const networkStats = useMemo(() => {
    const total = filteredManagers.length;
    const withSurveys = filteredManagers.filter(m => m.has_survey).length;
    const regions = new Set(filteredManagers.flatMap(m => m.geographic_focus || []).filter(Boolean)).size;
    const fundTypes = new Set(filteredManagers.map(m => m.vehicle_type || m.fund_stage).filter(Boolean)).size;
    const avgTeamSize = Math.round(
      filteredManagers
        .map(m => m.team_size || m.team_size_max)
        .filter(Boolean)
        .reduce((sum, size) => sum + (size as number), 0) / 
      filteredManagers.filter(m => m.team_size || m.team_size_max).length || 0
    );
    
    return {
      total,
      withSurveys,
      regions,
      fundTypes,
      avgTeamSize,
      completionRate: total > 0 ? Math.round((withSurveys / total) * 100) : 0,
      topRegions: Array.from(new Set(filteredManagers.flatMap(m => m.geographic_focus || []).filter(Boolean)))
        .slice(0, 3),
      activeMembers: filteredManagers.filter(m => m.fund_stage === 'Active').length
    };
  }, [filteredManagers]);

  // Pagination
  const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);
  const paginatedManagers = filteredManagers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Auto-refresh functionality
  useEffect(() => {
    if (isAutoRefresh) {
      const interval = setInterval(() => {
        fetchFundManagers();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [isAutoRefresh, fetchFundManagers]);

  // Favorite management
  const toggleFavorite = (managerId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(managerId)) {
      newFavorites.delete(managerId);
    } else {
      newFavorites.add(managerId);
    }
    setFavorites(newFavorites);
  };

  // Recently viewed management
  const addToRecentlyViewed = (manager: FundManager) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(m => m.id !== manager.id);
      return [manager, ...filtered].slice(0, 5);
    });
  };

  // Quick actions
  const quickActions = [
    { icon: Download, label: 'Export Data', action: () => console.log('Export') },
    { icon: Share2, label: 'Share Network', action: () => console.log('Share') },
    { icon: Plus, label: 'Add Member', action: () => console.log('Add') },
    { icon: BarChart3, label: 'Analytics', action: () => navigate('/analytics') }
  ];

  return (
    <SidebarLayout>
      <div key="network-container" className="min-h-screen bg-[#faf6f0] font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
        {/* Page header — same pattern as Community, Analytics, Admin */}
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Network</span>
                <h1 className="text-base sm:text-lg font-display font-normal text-navy-900">Directory</h1>
                <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
                <p className="text-[10px] text-slate-500 font-sans hidden sm:inline">Fund managers and organizations in the CFF network</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 rounded-full bg-white border border-slate-200/80 px-2 py-0.5 text-[10px] font-medium text-slate-600 font-sans">
                  <Users className="w-3 h-3 text-gold-600" />
                  {networkStats.total} members
                </span>
                <span className="flex items-center gap-1 rounded-full bg-white border border-slate-200/80 px-2 py-0.5 text-[10px] font-medium text-slate-600 font-sans">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  {networkStats.completionRate}% with surveys
                </span>
                {userRole === 'admin' && (
                  <Select onValueChange={(value) => value && navigate(`/survey/${value}`)}>
                    <SelectTrigger className="w-[100px] h-7 rounded-lg border-slate-200 bg-white text-[10px] font-sans px-2">
                      <FileText className="w-3 h-3 mr-1 text-slate-500" />
                      <SelectValue placeholder="Survey" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2021">2021</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2024">2024</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">

        {/* Search and toolbar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search by name, firm, role or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11 rounded-xl border-slate-200 bg-white shadow-sm focus-visible:ring-2 focus-visible:ring-amber-500/30 focus-visible:border-amber-400"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchTerm('')}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl border-slate-200 h-10"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" size="sm" onClick={clearFilters} className="rounded-xl border-slate-200 h-10 text-slate-600">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <div className="flex rounded-xl border border-slate-200 p-0.5 bg-slate-50">
              <Button
                variant={viewMode === 'grid' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-lg h-9 px-3"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-lg h-9 px-3"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Region</label>
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    {getRegions().map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Fund type</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    {getFundTypes().map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Stage</label>
                <Select value={filterStage} onValueChange={setFilterStage}>
                  <SelectTrigger className="h-10 rounded-xl border-slate-200">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All stages</SelectItem>
                    {getFundStages().map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">Sort</label>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-10 rounded-xl border-slate-200 flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="region">Region</SelectItem>
                      <SelectItem value="type">Type</SelectItem>
                      <SelectItem value="stage">Stage</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="h-10 w-10 rounded-xl shrink-0">
                    {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-end">
                <Button
                  variant={showOnlyWithSurveys ? 'secondary' : 'outline'}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setShowOnlyWithSurveys(!showOnlyWithSurveys)}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  With surveys
                </Button>
                <Button
                  variant={filterStage === 'Active' ? 'secondary' : 'outline'}
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setFilterStage(filterStage === 'Active' ? 'all' : 'Active')}
                >
                  <Flame className="w-3.5 h-3.5 mr-1.5" />
                  Active
                </Button>
              </div>
            </div>
          </div>
        )}


        {/* Content */}
        {loading && initialLoad ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 animate-pulse">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-200" />
                  <div className="w-full space-y-2 text-center">
                    <div className="h-4 bg-slate-200 rounded w-4/5 mx-auto" />
                    <div className="h-3 bg-slate-100 rounded w-2/3 mx-auto" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-7 w-12 rounded-lg bg-slate-100" />
                    <div className="h-7 w-12 rounded-lg bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredManagers.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <NetworkIcon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No members found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Try different search terms or clear filters to see the full directory.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={clearFilters} size="sm" className="rounded-xl bg-slate-900 hover:bg-slate-800">
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear filters
              </Button>
              <Button variant="outline" size="sm" onClick={() => setSearchTerm('')} className="rounded-xl">
                <Search className="w-4 h-4 mr-2" />
                New search
              </Button>
            </div>
          </div>
        ) : (
          <>
            {recentlyViewed.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Recently viewed
                </p>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {recentlyViewed.map((manager) => (
                    <button
                      key={manager.id}
                      type="button"
                      className="flex flex-shrink-0 items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50 transition-colors text-left min-w-0"
                      onClick={(e) => { e.stopPropagation(); addToRecentlyViewed(manager); navigate(`/network/fund-manager/${manager.id}`, { state: { fundManager: manager } }); }}
                    >
                      <Avatar className="w-8 h-8 rounded-lg shrink-0">
                        <AvatarFallback className="bg-amber-100 text-amber-800 text-sm font-medium">
                          {(manager.fund_name || manager.firm_name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-slate-800 truncate max-w-[120px]">
                        {manager.fund_name || manager.firm_name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={viewMode === 'list' ? 'space-y-2' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'}>
              {paginatedManagers.map((manager) => (
                <button
                  key={manager.id}
                  type="button"
                  className={
                    viewMode === 'list'
                      ? 'flex items-center gap-4 w-full rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-amber-300 hover:shadow-md transition-all'
                      : 'flex flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left hover:border-amber-300 hover:shadow-lg transition-all group'
                  }
                  onClick={() => navigate(`/network/fund-manager/${manager.id}`, { state: { fundManager: manager } })}
                >
                  <div className={viewMode === 'list' ? 'flex items-center gap-4 flex-1 min-w-0' : 'flex flex-col items-center'}>
                    <Avatar className={viewMode === 'list' ? 'w-12 h-12 rounded-xl shrink-0' : 'w-20 h-20 rounded-2xl border-2 border-slate-100 shrink-0 mb-4 group-hover:border-amber-200 transition-colors'}>
                      <AvatarFallback className={viewMode === 'list' ? 'bg-slate-100 text-slate-700 font-semibold' : 'bg-amber-100 text-amber-800 font-semibold text-xl'}>
                        {(manager.fund_name || manager.firm_name || manager.participant_name || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={viewMode === 'list' ? 'min-w-0 flex-1' : 'text-center w-full'}>
                      <h3 className="font-semibold text-slate-900 truncate">
                        {manager.firm_name || manager.fund_name || '—'}
                      </h3>
                      <p className="text-sm text-slate-500 truncate mt-0.5">
                        {manager.participant_name || manager.role_title || manager.email_address || ''}
                      </p>
                      {(manager.team_member_count ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs text-slate-500">
                          <Users className="w-3 h-3" />
                          {manager.team_member_count} team {manager.team_member_count === 1 ? 'member' : 'members'}
                        </span>
                      )}
                      {manager.has_survey && (
                        <div className="flex flex-wrap justify-center gap-1 mt-3">
                          {['2021', '2022', '2023', '2024'].map((year) => (
                            <button
                              key={year}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/survey-response/${manager.user_id}/${year}`);
                              }}
                              className="inline-flex h-6 items-center rounded-md bg-slate-100 px-2 text-xs font-medium text-slate-600 hover:bg-amber-100 hover:text-amber-800 transition-colors"
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {viewMode === 'list' && (
                      <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl h-9"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="rounded-xl h-9 w-9 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl h-9"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </SidebarLayout>
  );
});

export default NetworkV2;
