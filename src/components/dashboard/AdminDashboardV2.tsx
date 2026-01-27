// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  Building2,
  TrendingUp,
  Activity,
  Globe,
  FileText,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Crown,
  Target,
  Star,
  Eye,
  UserPlus,
  Bell,
  Search,
  XCircle,
  Shield,
  Settings,
  Database,
  Zap,
  Award,
  Network,
  Calendar,
  Mail,
  MessageSquare,
  Download,
  Upload,
  Filter,
  Plus,
  ExternalLink,
  TrendingDown,
  ClipboardList,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  trend: { value: number; isPositive: boolean };
  change?: string;
  detail?: string;       // extra line of detail (e.g. "X members · Y viewers")
  details?: string[];    // multiple detail lines
}

interface ActivityItem {
  id: string;
  type: 'user' | 'survey' | 'system' | 'admin' | 'security' | 'performance' | 'application';
  message: string;
  detail?: string;
  timestamp: string;
  createdAt?: string;  // ISO for sorting
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action?: string;
  actionHref?: string;
  typeLabel?: string;  // e.g. "Survey", "Application", "User"
}

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  color: string;
  bgColor: string;
}

// Time-ago and date grouping for activity logs
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffM < 1) return 'Just now';
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  if (diffD === 1) return 'Yesterday';
  if (diffD < 7) return `${diffD}d ago`;
  return date.toLocaleDateString();
};
const getDateGroup = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  if (date.getTime() > today.getTime() - 7 * 86400000) return 'This week';
  return 'Earlier';
};

const AdminDashboardV2 = () => {
  const { toast } = useToast();
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [blogsCount, setBlogsCount] = useState(0);
  const [learningResourcesCount, setLearningResourcesCount] = useState(0);
  const [overview, setOverview] = useState<{
    totalApplications: number; applicationsGrowth: number; pending: number;
    totalUsers: number; members: number; viewers: number;
    surveyTotal: number; surveyThisMonth: number;
  } | null>(null);
  const [analytics, setAnalytics] = useState<{
    surveyByYear: { y2021: number; y2022: number; y2023: number; y2024: number };
    approvedApps: number; rejectedApps: number;
    thisWeekApps: number; thisWeekUsers: number; thisWeekSurveys: number;
    appsGrowthWeek: number; approvalRate: number;
  } | null>(null);

  // Quick actions for admin – meaningful links
  const quickActions: QuickAction[] = [
    {
      title: 'Review Applications',
      description: 'Review and approve membership requests',
      icon: UserPlus,
      href: '/admin',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'User Management',
      description: 'Manage users and permissions',
      icon: Users,
      href: '/network',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Survey Analytics',
      description: 'View survey insights and reports',
      icon: BarChart3,
      href: '/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'System Settings',
      description: 'Configure platform settings',
      icon: Settings,
      href: '/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50'
    },
    {
      title: 'Database Tools',
      description: 'Database management and backups',
      icon: Database,
      href: '/admin/database',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('AdminDashboardV2 - Fetching all data...');
      
      // Fetch data with individual error handling to prevent one failure from breaking all queries
      const fetchWithErrorHandling = async (query: Promise<any>, tableName: string) => {
        try {
          const result = await query;
          if (result.error) {
            // Check for table not found errors (PostgreSQL code 42P01, PostgREST code PGRST116, or 404)
            const isTableNotFound = 
              result.error.code === 'PGRST116' || 
              result.error.code === '42P01' ||
              result.error.message?.includes('404') ||
              result.error.message?.includes('does not exist') ||
              result.error.message?.includes('relation') && result.error.message?.includes('does not exist');
            
            if (isTableNotFound) {
              // Silently handle missing tables - this is expected in some deployments
              return { data: [], error: null };
            }
            // Only log actual errors (not missing tables)
            console.error(`Error fetching ${tableName}:`, result.error);
            return { data: [], error: result.error };
          }
          return result;
        } catch (err) {
          // Silently handle exceptions for missing tables
          return { data: [], error: null };
        }
      };

      // Fetch comprehensive data from all available tables with error handling
      const [
        survey2021Result, 
        survey2022Result,
        survey2023Result, 
        survey2024Result, 
        userRolesResult, 
        applicationsResult,
        userProfilesResult,
        blogsCountVal,
        learningResourcesCountVal
      ] = await Promise.all([
        fetchWithErrorHandling(
          supabase.from('survey_responses_2021').select('id, user_id, created_at, firm_name, participant_name'),
          'survey_responses_2021'
        ),
        fetchWithErrorHandling(
          supabase.from('survey_responses_2022').select('id, user_id, created_at'),
          'survey_responses_2022'
        ),
        fetchWithErrorHandling(
          supabase.from('survey_responses_2023').select('id, user_id, created_at'),
          'survey_responses_2023'
        ),
        fetchWithErrorHandling(
          supabase.from('survey_responses_2024').select('id, user_id, created_at'),
          'survey_responses_2024'
        ),
        fetchWithErrorHandling(
          supabase.from('user_roles').select('user_id, role, created_at'),
          'user_roles'
        ),
        fetchWithErrorHandling(
          supabase.from('applications').select('id, status, created_at, vehicle_name'),
          'applications'
        ),
        fetchWithErrorHandling(
          supabase.from('user_profiles').select('id, created_at, company_name'),
          'user_profiles'
        ),
        (async () => {
          try {
            const r = await supabase.from('blogs').select('id', { count: 'exact', head: true });
            return r.error ? 0 : (r.count ?? 0);
          } catch { return 0; }
        })(),
        (async () => {
          try {
            const r = await supabase.from('learning_resources').select('id', { count: 'exact', head: true }).eq('is_published', true);
            return r.error ? 0 : (r.count ?? 0);
          } catch { return 0; }
        })()
      ]);

      const survey2021Users = survey2021Result.data || [];
      const survey2022Users = survey2022Result.data || [];
      const survey2023Users = survey2023Result.data || [];
      const survey2024Users = survey2024Result.data || [];
      const userRoles = userRolesResult.data || [];
      const userProfiles = userProfilesResult.data || [];
      const membershipRequests = applicationsResult.data || [];

      // Log data counts for debugging
      console.log('AdminDashboardV2 - Raw data counts:', {
        survey2021Count: survey2021Users.length,
        survey2022Count: survey2022Users.length,
        survey2023Count: survey2023Users.length,
        survey2024Count: survey2024Users.length,
        userRolesCount: userRoles.length,
        userProfilesCount: userProfiles.length,
        applicationsCount: membershipRequests.length
      });

      // Calculate comprehensive metrics
      // Note: If user_roles query fails due to RLS, use user_profiles as fallback for total count
      // Then try to get role-specific counts from survey data or use user_profiles count
      const totalUsers = userRoles.length > 0 ? userRoles.length : userProfiles.length;
      const activeMembers = userRoles.length > 0 
        ? userRoles.filter(ur => ur.role === 'member').length 
        : 0; // If we can't get user_roles, we can't determine members
      const viewers = userRoles.length > 0 
        ? userRoles.filter(ur => ur.role === 'viewer').length 
        : 0;
      const admins = userRoles.length > 0 
        ? userRoles.filter(ur => ur.role === 'admin').length 
        : 0;
      
      // If user_roles query returned empty but we have user_profiles, log a warning
      if (userRoles.length === 0 && userProfiles.length > 0) {
        console.warn('AdminDashboardV2 - user_roles query returned 0 results but user_profiles exist. This may be due to RLS policies. Using user_profiles count as fallback.');
      }
      const totalSurveyResponses = survey2021Users.length + survey2022Users.length + survey2023Users.length + survey2024Users.length;
      const pendingApplications = membershipRequests.filter(app => app.status === 'pending').length;
      const approvedApplications = membershipRequests.filter(app => app.status === 'approved').length;
      const rejectedApplications = membershipRequests.filter(app => app.status === 'rejected').length;
      const totalApplications = membershipRequests.length;

      // Applications growth: this month vs last month
      const now = new Date();
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisMonthApps = membershipRequests.filter(r => r.created_at && new Date(r.created_at) >= thisMonthStart).length;
      const lastMonthApps = membershipRequests.filter(r => r.created_at && new Date(r.created_at) >= lastMonthStart && new Date(r.created_at) < thisMonthStart).length;
      const applicationsGrowth = lastMonthApps > 0 ? ((thisMonthApps - lastMonthApps) / lastMonthApps) * 100 : (thisMonthApps > 0 ? 100 : 0);

      // Calculate this month's activity
      const thisMonth = new Date();
      thisMonth.setDate(1);
      const thisMonthSurveys = [
        ...survey2021Users.filter(s => new Date(s.created_at) >= thisMonth),
        ...survey2022Users.filter(s => new Date(s.created_at) >= thisMonth),
        ...survey2023Users.filter(s => new Date(s.created_at) >= thisMonth),
        ...survey2024Users.filter(s => new Date(s.created_at) >= thisMonth)
      ].length;

      const thisMonthUsers = userRoles.filter(ur => ur.created_at && new Date(ur.created_at) >= thisMonth).length;

      // This week / last week for insights
      const weekAgo = new Date(now);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const twoWeeksAgo = new Date(now);
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      const thisWeekApps = membershipRequests.filter(r => r.created_at && new Date(r.created_at) >= weekAgo).length;
      const lastWeekApps = membershipRequests.filter(r => r.created_at && new Date(r.created_at) >= twoWeeksAgo && new Date(r.created_at) < weekAgo).length;
      const thisWeekUsers = userRoles.filter(ur => ur.created_at && new Date(ur.created_at) >= weekAgo).length;
      const thisWeekSurveys = [
        ...survey2021Users.filter(s => new Date(s.created_at) >= weekAgo),
        ...survey2022Users.filter(s => new Date(s.created_at) >= weekAgo),
        ...survey2023Users.filter(s => new Date(s.created_at) >= weekAgo),
        ...survey2024Users.filter(s => new Date(s.created_at) >= weekAgo)
      ].length;
      const appsGrowthWeek = lastWeekApps > 0 ? ((thisWeekApps - lastWeekApps) / lastWeekApps) * 100 : (thisWeekApps > 0 ? 100 : 0);
      const processedTotal = approvedApplications + rejectedApplications;
      const approvalRate = processedTotal > 0 ? Math.round((approvedApplications / processedTotal) * 100) : 0;

      console.log('AdminDashboardV2 - Data fetched:', {
        totalUsers,
        activeMembers,
        viewers,
        admins,
        totalSurveyResponses,
        pendingApplications,
        approvedApplications,
        rejectedApplications,
        thisMonthSurveys,
        thisMonthUsers
      });

      // Header analytics – 6 insight cards with extensive details
      const communityTotal = (blogsCountVal ?? 0) + (learningResourcesCountVal ?? 0);
      setStats([
        {
          title: 'Total Users',
          value: totalUsers.toString(),
          icon: Users,
          description: 'All registered users',
          trend: { value: thisMonthUsers, isPositive: true },
          change: `+${thisMonthUsers} this month`,
          detail: `${activeMembers} members · ${viewers} viewers · ${admins} admins`
        },
        {
          title: 'Active Members',
          value: activeMembers.toString(),
          icon: UserCheck,
          description: 'Verified fund managers',
          trend: { value: totalUsers > 0 ? Math.round((activeMembers / totalUsers) * 100) : 0, isPositive: true },
          change: totalUsers > 0 ? `${Math.round((activeMembers / totalUsers) * 100)}% of total` : 'No users yet',
          detail: totalUsers > 0 ? `${activeMembers} of ${totalUsers} total users` : undefined
        },
        {
          title: 'Survey Responses',
          value: totalSurveyResponses.toString(),
          icon: FileText,
          description: 'All survey submissions',
          trend: { value: thisMonthSurveys, isPositive: true },
          change: `+${thisMonthSurveys} this month`,
          details: [
            `2021: ${survey2021Users.length} · 2022: ${survey2022Users.length}`,
            `2023: ${survey2023Users.length} · 2024: ${survey2024Users.length}`
          ]
        },
        {
          title: 'Pending Applications',
          value: pendingApplications.toString(),
          icon: Clock,
          description: 'Awaiting review',
          trend: { value: pendingApplications, isPositive: pendingApplications < 10 },
          change: pendingApplications > 0 ? 'Needs attention' : 'All caught up',
          detail: `${approvedApplications} approved · ${rejectedApplications} rejected`
        },
        {
          title: 'Total Applications',
          value: totalApplications.toString(),
          icon: ClipboardList,
          description: 'All membership requests',
          trend: { value: applicationsGrowth, isPositive: applicationsGrowth >= 0 },
          change: `${applicationsGrowth >= 0 ? '+' : ''}${(Math.round(applicationsGrowth * 10) / 10).toFixed(1)}% vs last month`,
          detail: `${pendingApplications} pending · ${approvedApplications} approved · ${rejectedApplications} rejected`
        },
        {
          title: 'Community Content',
          value: communityTotal.toString(),
          icon: BookOpen,
          description: 'Blogs & learning resources',
          trend: { value: communityTotal, isPositive: true },
          detail: `${blogsCountVal ?? 0} posts · ${learningResourcesCountVal ?? 0} learning resources`
        }
      ]);

      // Generate detailed activity logs (real events, sorted by date)
      const activities: ActivityItem[] = [];
      const iso = (d: Date) => d.toISOString();

      const recentSurveys = [
        ...survey2021Users.slice(0, 5).map((s) => {
          const d = new Date(s.created_at);
          return {
            id: `survey-2021-${s.id}`,
            type: 'survey' as const,
            message: `2021 Survey completed`,
            detail: `${s.firm_name || 'Unknown firm'} · ${s.participant_name || 'Unknown participant'}`,
            timestamp: d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
            createdAt: iso(d),
            icon: FileText,
            color: 'text-blue-600',
            priority: 'medium' as const,
            action: 'View analytics',
            actionHref: '/analytics',
            typeLabel: 'Survey 2021'
          };
        }),
        ...survey2022Users.slice(0, 4).map((s) => {
          const d = new Date(s.created_at);
          return {
            id: `survey-2022-${s.id}`,
            type: 'survey' as const,
            message: `2022 Survey response submitted`,
            detail: `User ${s.user_id?.slice(0, 8) || '—'}...`,
            timestamp: d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
            createdAt: iso(d),
            icon: FileText,
            color: 'text-purple-600',
            priority: 'medium' as const,
            action: 'View analytics',
            actionHref: '/analytics',
            typeLabel: 'Survey 2022'
          };
        }),
        ...survey2023Users.slice(0, 4).map((s) => {
          const d = new Date(s.created_at);
          return {
            id: `survey-2023-${s.id}`,
            type: 'survey' as const,
            message: `2023 Survey response submitted`,
            detail: `User ${s.user_id?.slice(0, 8) || '—'}...`,
            timestamp: d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
            createdAt: iso(d),
            icon: FileText,
            color: 'text-green-600',
            priority: 'medium' as const,
            action: 'View analytics',
            actionHref: '/analytics',
            typeLabel: 'Survey 2023'
          };
        }),
        ...survey2024Users.slice(0, 4).map((s) => {
          const d = new Date(s.created_at);
          return {
            id: `survey-2024-${s.id}`,
            type: 'survey' as const,
            message: `2024 Survey response submitted`,
            detail: `User ${s.user_id?.slice(0, 8) || '—'}...`,
            timestamp: d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
            createdAt: iso(d),
            icon: FileText,
            color: 'text-amber-600',
            priority: 'medium' as const,
            action: 'View analytics',
            actionHref: '/analytics',
            typeLabel: 'Survey 2024'
          };
        })
      ];
      activities.push(...recentSurveys);

      const recentRequests = membershipRequests
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8)
        .map((req) => {
          const d = new Date(req.created_at);
          return {
            id: `req-${req.id}`,
            type: 'application' as const,
            message: `Membership request: ${req.vehicle_name || 'Unnamed'}`,
            detail: `Status: ${req.status.charAt(0).toUpperCase() + req.status.slice(1)}`,
            timestamp: d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
            createdAt: iso(d),
            icon: UserPlus,
            color: req.status === 'pending' ? 'text-amber-600' : req.status === 'approved' ? 'text-emerald-600' : 'text-red-600',
            priority: req.status === 'pending' ? ('high' as const) : ('medium' as const),
            action: req.status === 'pending' ? 'Review' : 'View',
            actionHref: '/admin',
            typeLabel: 'Application'
          };
        });
      activities.push(...recentRequests);

      const recentUserActivity = userRoles
        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
        .slice(0, 5)
        .map((u) => {
          const d = u.created_at ? new Date(u.created_at) : new Date();
          const roleLabel = u.role === 'admin' ? 'Admin' : u.role === 'member' ? 'Member' : 'Viewer';
          return {
            id: `user-${u.user_id}`,
            type: 'user' as const,
            message: `New ${roleLabel} registered`,
            detail: `User ID: ${u.user_id?.slice(0, 8) || '—'}...`,
            timestamp: d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
            createdAt: iso(d),
            icon: u.role === 'admin' ? Crown : u.role === 'member' ? UserCheck : Users,
            color: u.role === 'admin' ? 'text-red-600' : u.role === 'member' ? 'text-emerald-600' : 'text-blue-600',
            priority: u.role === 'admin' ? ('high' as const) : ('medium' as const),
            action: 'View users',
            actionHref: '/network',
            typeLabel: 'User'
          };
        });
      activities.push(...recentUserActivity);

      if (pendingApplications > 0) {
        activities.push({
          id: 'app-summary',
          type: 'admin',
          message: `${pendingApplications} application${pendingApplications === 1 ? '' : 's'} pending review`,
          detail: `${approvedApplications} approved · ${rejectedApplications} rejected so far`,
          timestamp: new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
          createdAt: iso(new Date()),
          icon: Clock,
          color: 'text-amber-600',
          priority: 'high',
          action: 'Review applications',
          actionHref: '/admin',
          typeLabel: 'Summary'
        });
      }
      if (thisMonthUsers > 0) {
        activities.push({
          id: 'admin-users',
          type: 'admin',
          message: `${thisMonthUsers} new user${thisMonthUsers === 1 ? '' : 's'} this month`,
          detail: `${activeMembers} members · ${viewers} viewers`,
          timestamp: new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
          createdAt: iso(new Date()),
          icon: UserPlus,
          color: 'text-blue-600',
          priority: 'medium',
          action: 'View users',
          actionHref: '/network',
          typeLabel: 'Summary'
        });
      }
      if (thisMonthSurveys > 0) {
        activities.push({
          id: 'admin-surveys',
          type: 'admin',
          message: `${thisMonthSurveys} survey response${thisMonthSurveys === 1 ? '' : 's'} this month`,
          detail: 'Across 2021–2024 surveys',
          timestamp: new Date().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }),
          createdAt: iso(new Date()),
          icon: FileText,
          color: 'text-purple-600',
          priority: 'medium',
          action: 'View analytics',
          actionHref: '/analytics',
          typeLabel: 'Summary'
        });
      }

      // Sort by date (newest first) and take up to 20
      const sorted = activities.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setRecentActivity(sorted.slice(0, 20));
      setBlogsCount(blogsCountVal ?? 0);
      setLearningResourcesCount(learningResourcesCountVal ?? 0);
      setOverview({
        totalApplications,
        applicationsGrowth: Math.round(applicationsGrowth * 10) / 10,
        pending: pendingApplications,
        totalUsers,
        members: activeMembers,
        viewers,
        surveyTotal: totalSurveyResponses,
        surveyThisMonth: thisMonthSurveys
      });
      setAnalytics({
        surveyByYear: {
          y2021: survey2021Users.length,
          y2022: survey2022Users.length,
          y2023: survey2023Users.length,
          y2024: survey2024Users.length
        },
        approvedApps: approvedApplications,
        rejectedApps: rejectedApplications,
        thisWeekApps,
        thisWeekUsers,
        thisWeekSurveys,
        appsGrowthWeek: Math.round(appsGrowthWeek * 10) / 10,
        approvalRate
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Allow scrolling on admin dashboard
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Overview of applications, members, and community activity
            </p>
            {!loading && overview && (
              <p className="text-xs text-slate-600 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span><span className="font-medium text-slate-800">{overview.members}</span> members</span>
                <span>·</span>
                <span><span className="font-medium text-slate-800">{overview.viewers}</span> viewers</span>
                <span>·</span>
                <span><span className="font-medium text-slate-800">{overview.surveyTotal}</span> survey responses</span>
                {overview.pending > 0 && (
                  <>
                    <span>·</span>
                    <span className="font-medium text-amber-700">{overview.pending} pending</span>
                  </>
                )}
              </p>
            )}
            {lastUpdated && (
              <p className="text-xs text-slate-400 mt-1">
                Last updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAllData()}
            disabled={loading}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Executive summary – needs attention */}
        {!loading && overview && overview.pending > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/80 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-semibold text-amber-900">
                  {overview.pending} membership {overview.pending === 1 ? 'application' : 'applications'} need your review
                </p>
                <p className="text-sm text-amber-700 mt-0.5">Review and approve or reject pending requests.</p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate('/admin')} className="bg-amber-600 hover:bg-amber-700 text-white shrink-0">
              Review applications
            </Button>
          </div>
        )}

        {/* Header analytics – 6 insight cards with extensive details */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {stats.map((stat, index) => {
            const gradientColors = [
              'bg-gradient-to-br from-blue-500 to-blue-600',
              'bg-gradient-to-br from-green-500 to-green-600',
              'bg-gradient-to-br from-purple-500 to-purple-600',
              'bg-gradient-to-br from-orange-500 to-orange-600',
              'bg-gradient-to-br from-indigo-500 to-indigo-600',
              'bg-gradient-to-br from-cyan-500 to-cyan-600'
            ];
            const colorClass = gradientColors[index % gradientColors.length];
            return (
              <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-600 uppercase tracking-wider mb-0.5">{stat.title}</p>
                    <div className="text-xl font-bold text-slate-900">
                      {loading ? (
                        <div className="animate-pulse bg-slate-200 h-6 w-12 rounded" />
                      ) : (
                        stat.value
                      )}
                    </div>
                  </div>
                  <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center shrink-0 shadow-sm`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-1">{stat.description}</p>
                {stat.change && (
                  <div className="flex items-center gap-1 mb-1">
                    {stat.trend.isPositive ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-500 shrink-0" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-500 shrink-0" />
                    )}
                    <span className={`text-xs font-medium ${stat.trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                )}
                {stat.detail && (
                  <p className="text-xs text-slate-600 mt-1 pt-1 border-t border-slate-100">{stat.detail}</p>
                )}
                {stat.details && stat.details.length > 0 && (
                  <div className="mt-1 pt-1 border-t border-slate-100 space-y-0.5">
                    {stat.details.map((line, i) => (
                      <p key={i} className="text-xs text-slate-600">{line}</p>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Insights – Applications pipeline, Survey breakdown, This week */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-base font-semibold text-slate-900">Applications pipeline</CardTitle>
              </div>
              <p className="text-xs text-slate-500 mt-1">Breakdown by status</p>
            </CardHeader>
            <CardContent className="p-5">
              {loading ? (
                <div className="space-y-3">
                  <div className="animate-pulse h-4 bg-slate-200 rounded w-3/4" />
                  <div className="animate-pulse h-4 bg-slate-200 rounded w-1/2" />
                  <div className="animate-pulse h-4 bg-slate-200 rounded w-2/3" />
                </div>
              ) : overview ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Approved</span>
                      <span className="font-medium text-emerald-700">{analytics?.approvedApps ?? 0}</span>
                    </div>
                    <Progress value={overview.totalApplications ? ((analytics?.approvedApps ?? 0) / overview.totalApplications) * 100 : 0} className="h-2 bg-slate-100" indicatorClassName="bg-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Pending</span>
                      <span className="font-medium text-amber-700">{overview.pending}</span>
                    </div>
                    <Progress value={overview.totalApplications ? (overview.pending / overview.totalApplications) * 100 : 0} className="h-2 bg-slate-100" indicatorClassName="bg-amber-500" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Rejected</span>
                      <span className="font-medium text-red-700">{analytics?.rejectedApps ?? 0}</span>
                    </div>
                    <Progress value={overview.totalApplications ? ((analytics?.rejectedApps ?? 0) / overview.totalApplications) * 100 : 0} className="h-2 bg-slate-100" indicatorClassName="bg-red-500" />
                  </div>
                  {analytics && (analytics.approvedApps + analytics.rejectedApps) > 0 && (
                    <p className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                      Approval rate: <span className="font-medium text-slate-700">{analytics.approvalRate}%</span> of decided applications
                    </p>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-base font-semibold text-slate-900">Survey responses by year</CardTitle>
              </div>
              <p className="text-xs text-slate-500 mt-1">All survey submissions</p>
            </CardHeader>
            <CardContent className="p-5">
              {loading ? (
                <div className="space-y-3">
                  <div className="animate-pulse h-8 bg-slate-200 rounded" />
                  <div className="animate-pulse h-8 bg-slate-200 rounded" />
                </div>
              ) : analytics ? (
                <div className="space-y-3">
                  {[
                    { label: '2021', value: analytics.surveyByYear.y2021, color: 'bg-blue-500' },
                    { label: '2022', value: analytics.surveyByYear.y2022, color: 'bg-violet-500' },
                    { label: '2023', value: analytics.surveyByYear.y2023, color: 'bg-emerald-500' },
                    { label: '2024', value: analytics.surveyByYear.y2024, color: 'bg-amber-500' }
                  ].map(({ label, value, color }) => {
                    const total = analytics.surveyByYear.y2021 + analytics.surveyByYear.y2022 + analytics.surveyByYear.y2023 + analytics.surveyByYear.y2024;
                    const pct = total > 0 ? (value / total) * 100 : 0;
                    return (
                      <div key={label} className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700 w-10">{label}</span>
                        <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${Math.max(pct, 2)}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-slate-900 w-8 text-right">{value}</span>
                      </div>
                    );
                  })}
                  <p className="text-xs text-slate-500 pt-2">
                    Total: <span className="font-medium text-slate-700">{overview?.surveyTotal ?? 0}</span> responses
                  </p>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-5 py-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-slate-600" />
                <CardTitle className="text-base font-semibold text-slate-900">This week</CardTitle>
              </div>
              <p className="text-xs text-slate-500 mt-1">Last 7 days</p>
            </CardHeader>
            <CardContent className="p-5">
              {loading ? (
                <div className="space-y-3">
                  <div className="animate-pulse h-4 bg-slate-200 rounded" />
                  <div className="animate-pulse h-4 bg-slate-200 rounded" />
                </div>
              ) : analytics ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">New applications</span>
                    <span className="font-semibold text-slate-900">{analytics.thisWeekApps}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">New users</span>
                    <span className="font-semibold text-slate-900">{analytics.thisWeekUsers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Survey responses</span>
                    <span className="font-semibold text-slate-900">{analytics.thisWeekSurveys}</span>
                  </div>
                  {analytics.appsGrowthWeek !== 0 && (
                    <p className={`text-xs font-medium pt-2 border-t border-slate-100 ${analytics.appsGrowthWeek >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      Applications {analytics.appsGrowthWeek >= 0 ? '+' : ''}{analytics.appsGrowthWeek}% vs last week
                    </p>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {/* Main content – Activity & Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity logs – detailed, grouped, well displayed */}
          <Card className="lg:col-span-2 border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-900">Activity logs</CardTitle>
                    <p className="text-sm text-slate-500 mt-0.5">Surveys, applications, new users — grouped by date</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs font-medium">{recentActivity.length} events</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {recentActivity.length === 0 && !loading ? (
                <p className="text-sm text-slate-500 py-8 text-center">No recent activity yet.</p>
              ) : (
                (() => {
                  const groups: Record<string, ActivityItem[]> = {};
                  recentActivity.forEach((a) => {
                    const d = a.createdAt ? new Date(a.createdAt) : new Date();
                    const g = getDateGroup(d);
                    if (!groups[g]) groups[g] = [];
                    groups[g].push(a);
                  });
                  const order = ['Today', 'Yesterday', 'This week', 'Earlier'];
                  return (
                    <div className="space-y-6">
                      {order.filter((k) => groups[k]?.length).map((label) => (
                        <div key={label}>
                          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-1">{label}</h3>
                          <div className="space-y-2">
                            {groups[label].map((activity) => {
                              const date = activity.createdAt ? new Date(activity.createdAt) : new Date();
                              const bg = activity.color.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-100');
                              return (
                                <div
                                  key={activity.id}
                                  className="flex gap-3 p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50/80 hover:border-slate-200 transition-colors"
                                >
                                  <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
                                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                      {activity.typeLabel && (
                                        <Badge variant="secondary" className="text-[10px] font-medium px-1.5 py-0">
                                          {activity.typeLabel}
                                        </Badge>
                                      )}
                                      <span className="text-xs text-slate-400" title={activity.timestamp}>
                                        {getTimeAgo(date)}
                                      </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-900 break-words">{activity.message}</p>
                                    {activity.detail && (
                                      <p className="text-xs text-slate-600 mt-1">{activity.detail}</p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-1" title={activity.timestamp}>
                                      {activity.timestamp}
                                    </p>
                                  </div>
                                  {activity.action && activity.actionHref && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="shrink-0 text-xs border-slate-200"
                                      onClick={() => navigate(activity.actionHref!)}
                                    >
                                      {activity.action}
                                    </Button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Platform Overview */}
          <div className="space-y-4">
            <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                <CardTitle className="text-sm font-semibold text-slate-900">Quick actions</CardTitle>
              </CardHeader>
              <CardContent className="p-3">
                <div className="space-y-1">
                  {quickActions.map((action, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => navigate(action.href)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-left transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.bgColor} flex items-center justify-center shrink-0`}>
                        <action.icon className={`w-4 h-4 ${action.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm">{action.title}</p>
                        <p className="text-xs text-slate-500 truncate">{action.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-5 py-3">
                <CardTitle className="text-sm font-semibold text-slate-900">Platform overview</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">Content & survey coverage</p>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Surveys</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">4 years</p>
                    <p className="text-xs text-slate-500 mt-0.5">2021–2024</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500 uppercase tracking-wider">Content</p>
                    <p className="text-lg font-bold text-slate-900 mt-1">{loading ? '—' : blogsCount + learningResourcesCount}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{loading ? '' : `${blogsCount} posts · ${learningResourcesCount} resources`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardV2;