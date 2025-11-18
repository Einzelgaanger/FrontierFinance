// @ts-nocheck
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import AdminFundManagers from '@/components/admin/AdminFundManagers';
import ApplicationManagement from '@/components/admin/ApplicationManagement';
import CreateUserModal from '@/components/admin/CreateUserModal';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  Shield, 
  User, 
  FileText, 
  Clock, 
  CheckCircle, 
  Users, 
  Activity, 
  UserPlus, 
  Mail, 
  MapPin, 
  Calendar, 
  XCircle, 
  Eye,
  RefreshCw,
  Search,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ClipboardList,
  UserCheck,
  AlertCircle,
  BookOpen,
  X,
  LayoutDashboard,
  ClipboardCheck,
  UsersRound,
  History
} from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

interface Profile {
  id: string;
  email: string;
  company_name?: string | null;
  full_name?: string | null;
  user_role?: string | null;
  created_at: string;
  updated_at: string;
}

interface MembershipRequest {
  id: string;
  user_id: string;
  email: string;
  company_name?: string | null;
  applicant_name: string;
  vehicle_name: string;
  organization_website?: string | null;
  domicile_countries?: string[] | null;
  role_job_title?: string | null;
  team_overview?: string | null;
  investment_thesis?: string | null;
  typical_check_size?: string | null;
  number_of_investments?: string | null;
  amount_raised_to_date?: string | null;
  supporting_documents?: string[] | null;
  supporting_document_links?: string[] | null;
  expectations_from_network?: string | null;
  how_heard_about_network?: string | null;
  topics_of_interest?: string[] | null;
  status: string;
  created_at: string | null;
  updated_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  admin_notes?: string | null;
  review_notes?: string | null;
}

interface ActivityLogDetails {
  applicant_name?: string;
  old_role?: string;
  new_role?: string;
  target_user_id?: string;
  [key: string]: any;
}

interface ActivityLog {
  id: string;
  user_id: string | null;
  activity_type?: string;
  action?: string;
  details?: any;
  description?: string;
  points_earned?: number;
  created_at: string;
  user_agent?: string | null;
  resource_type?: string | null;
  resource_id?: string | null;
  ip_address?: string | null;
  user?: {
    email?: string;
    full_name?: string;
    company_name?: string;
  };
}

// Helper function to calculate time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return `${Math.floor(diffInSeconds / 604800)}w ago`;
};

const AdminV2 = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [membershipRequests, setMembershipRequests] = useState<MembershipRequest[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [blogsCount, setBlogsCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [requestsResult, profilesResult, logsResult, blogsResult] = await Promise.all([
        supabase.from('applications').select('*').order('created_at', { ascending: false }),
        supabase.from('user_profiles').select('id, email, company_name, full_name, user_role, created_at, updated_at').order('created_at', { ascending: false }),
        supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('blogs').select('id', { count: 'exact', head: true })
      ]);

      if (requestsResult.error) {
        console.error('Error fetching applications:', requestsResult.error);
      }
      if (profilesResult.error) {
        console.error('Error fetching profiles:', profilesResult.error);
      }
      
      let activityLogsData: any[] = [];
      if (logsResult.error) {
        console.error('Error fetching activity logs:', logsResult.error);
        // Try alternative table name as fallback
        const { data: altLogsData } = await supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(100);
        if (altLogsData) {
          activityLogsData = altLogsData;
        }
      } else {
        activityLogsData = logsResult.data || [];
      }

      // Fetch user information for each log entry
      if (activityLogsData.length > 0) {
        const userIds = [...new Set(activityLogsData.map(log => log.user_id).filter(Boolean))];
        if (userIds.length > 0) {
          const { data: userProfiles } = await supabase
            .from('user_profiles')
            .select('id, email, full_name, company_name')
            .in('id', userIds);

          // Map user info to logs
          const userMap = new Map(userProfiles?.map(profile => [profile.id, profile]) || []);
          activityLogsData = activityLogsData.map(log => ({
            ...log,
            user: log.user_id ? userMap.get(log.user_id) : null
          }));
        }
      }

      setActivityLogs(activityLogsData);
      if (blogsResult.error) {
        console.error('Error fetching blogs:', blogsResult.error);
      } else {
        setBlogsCount(blogsResult.count || 0);
      }

      setMembershipRequests(requestsResult.data || []);
      setProfiles(profilesResult.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchAllData();

    // Set up real-time subscriptions for live updates
    const subscriptions: any[] = [];

    // Subscribe to applications table changes
    const applicationsSubscription = supabase
      .channel('applications-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'applications' },
        (payload) => {
          console.log('Applications change detected:', payload);
          fetchAllData(); // Refresh all data when applications change
        }
      )
      .subscribe();

    // Subscribe to activity_logs table changes
    const activityLogsSubscription = supabase
      .channel('activity-logs-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_logs' },
        (payload) => {
          console.log('New activity log:', payload);
          // Add new log to the list
          if (payload.new) {
            setActivityLogs(prev => {
              const newLog = payload.new as ActivityLog;
              // Fetch user info for the new log
              if (newLog.user_id) {
                supabase
                  .from('user_profiles')
                  .select('id, email, full_name, company_name')
                  .eq('id', newLog.user_id)
                  .single()
                  .then(({ data }) => {
                    if (data) {
                      setActivityLogs(current => 
                        current.map(log => 
                          log.id === newLog.id 
                            ? { ...log, user: data }
                            : log
                        )
                      );
                    }
                  });
              }
              return [newLog, ...prev].slice(0, 100);
            });
          }
        }
      )
      .subscribe();

    // Subscribe to user_profiles table changes
    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'user_profiles' },
        (payload) => {
          console.log('Profiles change detected:', payload);
          fetchAllData(); // Refresh all data when profiles change
        }
      )
      .subscribe();

    // Subscribe to blogs table changes
    const blogsSubscription = supabase
      .channel('blogs-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'blogs' },
        (payload) => {
          console.log('Blogs change detected:', payload);
          // Update blogs count
          supabase
            .from('blogs')
            .select('id', { count: 'exact', head: true })
            .then(({ count }) => {
              if (count !== null) {
                setBlogsCount(count);
              }
            });
        }
      )
      .subscribe();

    subscriptions.push(applicationsSubscription, activityLogsSubscription, profilesSubscription, blogsSubscription);

    // Cleanup subscriptions on unmount
    return () => {
      subscriptions.forEach(sub => {
        supabase.removeChannel(sub);
      });
    };
  }, [fetchAllData]);

  // Computed values with growth calculations
  const stats = useMemo(() => {
    const totalRequests = membershipRequests.length;
    const pendingRequests = membershipRequests.filter(r => r.status === 'pending').length;
    const approvedRequests = membershipRequests.filter(r => r.status === 'approved').length;
    const rejectedRequests = membershipRequests.filter(r => r.status === 'rejected').length;
    const totalProfiles = profiles.length;
    const activeProfiles = profiles.length;

    // Calculate growth metrics (this month vs last month)
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthRequests = membershipRequests.filter(r => {
      if (!r.created_at) return false;
      const date = new Date(r.created_at);
      return date >= thisMonth;
    }).length;

    const lastMonthRequests = membershipRequests.filter(r => {
      if (!r.created_at) return false;
      const date = new Date(r.created_at);
      return date >= lastMonth && date < thisMonth;
    }).length;

    const thisMonthProfiles = profiles.filter(p => {
      if (!p.created_at) return false;
      const date = new Date(p.created_at);
      return date >= thisMonth;
    }).length;

    const lastMonthProfiles = profiles.filter(p => {
      if (!p.created_at) return false;
      const date = new Date(p.created_at);
      return date >= lastMonth && date < thisMonth;
    }).length;

    const applicationsGrowth = lastMonthRequests > 0 
      ? ((thisMonthRequests - lastMonthRequests) / lastMonthRequests) * 100 
      : thisMonthRequests > 0 ? 100 : 0;

    const usersGrowth = lastMonthProfiles > 0 
      ? ((thisMonthProfiles - lastMonthProfiles) / lastMonthProfiles) * 100 
      : thisMonthProfiles > 0 ? 100 : 0;

    // Calculate average processing time (for approved/rejected)
    const processedRequests = membershipRequests.filter(r => 
      r.status === 'approved' || r.status === 'rejected'
    );
    const avgProcessingDays = processedRequests.length > 0
      ? processedRequests.reduce((sum, r) => {
          if (r.created_at && r.reviewed_at) {
            const days = (new Date(r.reviewed_at).getTime() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24);
            return sum + days;
          }
          return sum;
        }, 0) / processedRequests.length
      : 0;

    // Calculate additional metrics
    const activeMembers = profiles.filter(p => p.user_role === 'member').length;
    const recentActivityCount = activityLogs.length;

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalProfiles,
      activeProfiles,
      activeMembers,
      approvalRate: totalRequests > 0 ? Math.round((approvedRequests / totalRequests) * 100) : 0,
      rejectionRate: totalRequests > 0 ? Math.round((rejectedRequests / totalRequests) * 100) : 0,
      thisMonthRequests,
      applicationsGrowth: Math.round(applicationsGrowth * 10) / 10,
      thisMonthProfiles,
      usersGrowth: Math.round(usersGrowth * 10) / 10,
      avgProcessingDays: Math.round(avgProcessingDays * 10) / 10,
      recentActivityCount
    };
  }, [membershipRequests, profiles, activityLogs]);

  // Filter data
  const filteredRequests = useMemo(() => {
    let filtered = membershipRequests;
    
     if (searchTerm) {
       filtered = filtered.filter(request =>
         (request.applicant_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
         request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         request.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         (request.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
       );
     }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter);
    }
    
    return filtered;
  }, [membershipRequests, searchTerm, statusFilter]);

  // Handle application review
  const handleReviewApplication = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', requestId);

      if (error) throw error;

      // Log the activity (try both table names)
      const activityData = {
        user_id: user?.id,
        activity_type: `application_${status}`,
        points_earned: 0,
        description: `Application ${status} for ${membershipRequests.find(r => r.id === requestId)?.applicant_name || 'unknown'}`
      };
      
      const { error: logError } = await supabase.from('activity_log').insert(activityData);
      if (logError) {
        // Try alternative table name
        await supabase.from('activity_logs').insert({
          user_id: user?.id,
          action: `application_${status}`,
          details: {
            applicant_name: membershipRequests.find(r => r.id === requestId)?.applicant_name,
            target_user_id: membershipRequests.find(r => r.id === requestId)?.user_id
          }
        });
      }

      toast({
        title: "Success",
        description: `Application ${status} successfully.`,
      });

      fetchAllData();
    } catch (error) {
      console.error('Error reviewing application:', error);
      toast({
        title: "Error",
        description: "Failed to review application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewApplication = (request: MembershipRequest) => {
    setSelectedRequest(request);
    setShowApplicationModal(true);
  };

  // Chart data (last 7 days)
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayRequests = membershipRequests.filter(r => 
        r.created_at && r.created_at.split('T')[0] === date
      );
      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        applications: dayRequests.length,
        approved: dayRequests.filter(r => r.status === 'approved').length,
        rejected: dayRequests.filter(r => r.status === 'rejected').length
      };
    });
  }, [membershipRequests]);

  const statusDistribution = useMemo(() => {
    const statuses = ['pending', 'approved', 'rejected'];
    return statuses.map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: membershipRequests.filter(r => r.status === status).length,
      color: status === 'pending' ? '#D97706' : status === 'approved' ? '#059669' : '#DC2626'
    }));
  }, [membershipRequests]);

  // Application lifetime data (last 7 days - same as bar chart)
  const lifetimeData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      // Count applications created on this specific date
      const dayRequests = membershipRequests.filter(r => 
        r.created_at && r.created_at.split('T')[0] === date
      );

      // Format date for display
      const displayDate = new Date(date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      });

      return {
        date: displayDate,
        dateValue: date,
        applications: dayRequests.length,
        approved: dayRequests.filter(r => r.status === 'approved').length,
        rejected: dayRequests.filter(r => r.status === 'rejected').length,
        pending: dayRequests.filter(r => r.status === 'pending').length
      };
    });
  }, [membershipRequests]);

  if (userRole !== 'admin') {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-slate-50">
        {/* Main Content */}
        <div className="p-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-8 gap-2 mb-8">
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5 leading-tight">Total Applications</p>
                    <p className="text-base font-semibold text-slate-900">{stats.totalRequests}</p>
                  </div>
                  <ClipboardList className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-0.5 pt-1 border-t border-slate-100">
                  {stats.applicationsGrowth >= 0 ? (
                    <TrendingUp className="w-2 h-2 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-2 h-2 text-red-600" />
                  )}
                  <span className={`text-[10px] font-medium ${stats.applicationsGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Math.abs(stats.applicationsGrowth).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5 leading-tight">Pending Review</p>
                    <p className="text-base font-semibold text-slate-900">{stats.pendingRequests}</p>
                  </div>
                  <AlertCircle className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-600 leading-tight">
                    {stats.pendingRequests > 0 ? `${Math.round((stats.pendingRequests / stats.totalRequests) * 100)}%` : '0%'}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1">of total</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5 leading-tight">Approved</p>
                    <p className="text-base font-semibold text-slate-900">{stats.approvedRequests}</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-medium text-slate-600">{stats.approvalRate}%</span>
                  <span className="text-[10px] text-slate-500 ml-1">approval rate</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5 leading-tight">Rejected</p>
                    <p className="text-base font-semibold text-slate-900">{stats.rejectedRequests}</p>
                  </div>
                  <X className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <span className="text-[10px] font-medium text-slate-600">{stats.rejectionRate}%</span>
                  <span className="text-[10px] text-slate-500 ml-1">rejection rate</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5 leading-tight">Active Members</p>
                    <p className="text-base font-semibold text-slate-900">{stats.activeMembers}</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-600 leading-tight">
                    {stats.totalProfiles > 0 ? `${Math.round((stats.activeMembers / stats.totalProfiles) * 100)}%` : '0%'}
                  </span>
                  <span className="text-[10px] text-slate-500 ml-1">of total users</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5 leading-tight">Total Users</p>
                    <p className="text-base font-semibold text-slate-900">{stats.activeProfiles}</p>
                  </div>
                  <Users className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
                <div className="flex items-center gap-0.5 pt-1 border-t border-slate-100">
                  {stats.usersGrowth >= 0 ? (
                    <TrendingUp className="w-2 h-2 text-emerald-600" />
                  ) : (
                    <TrendingDown className="w-2 h-2 text-red-600" />
                  )}
                  <span className={`text-[10px] font-medium ${stats.usersGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {Math.abs(stats.usersGrowth).toFixed(1)}%
                  </span>
                  <span className="text-[10px] text-slate-500">vs last month</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5 leading-tight">Total Blogs</p>
                    <p className="text-base font-semibold text-slate-900">{blogsCount}</p>
                  </div>
                  <BookOpen className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-600 leading-tight">Posts</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardContent className="p-2">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium text-slate-500 mb-0.5 leading-tight">Recent Activity</p>
                    <p className="text-base font-semibold text-slate-900">{stats.recentActivityCount}</p>
                  </div>
                  <Activity className="w-4 h-4 text-slate-600 flex-shrink-0 mt-0.5" />
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <span className="text-[10px] text-slate-600 leading-tight">Events</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200 shadow-sm rounded-lg p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 font-medium"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="applications" 
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 font-medium"
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger 
                value="members" 
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 font-medium"
              >
                <UsersRound className="w-4 h-4 mr-2" />
                Members
              </TabsTrigger>
              <TabsTrigger 
                value="activity" 
                className="data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm text-slate-600 font-medium"
              >
                <History className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Applications Trend Chart */}
                        <Card className="border border-slate-200 bg-white shadow-sm">
                          <CardHeader className="border-b border-slate-200">
                            <CardTitle className="text-lg font-semibold text-slate-900">Applications Trend</CardTitle>
                            <CardDescription className="text-slate-500">Daily application submissions over the last 7 days</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <ResponsiveContainer width="100%" height={300}>
                              <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                                <YAxis stroke="#64748b" fontSize={12} />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    fontSize: '12px'
                                  }} 
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="applications" fill="#475569" name="Total Applications" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="approved" fill="#059669" name="Approved" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="rejected" fill="#dc2626" name="Rejected" radius={[4, 4, 0, 0]} />
                              </BarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        {/* Status Distribution */}
                        <Card className="border border-slate-200 bg-white shadow-sm">
                          <CardHeader className="border-b border-slate-200">
                            <CardTitle className="text-lg font-semibold text-slate-900">Status Distribution</CardTitle>
                            <CardDescription className="text-slate-500">Current application status breakdown</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-6">
                            <ResponsiveContainer width="100%" height={300}>
                              <RechartsPieChart>
                                <Pie
                                  data={statusDistribution}
                                  cx="50%"
                                  cy="50%"
                                  innerRadius={60}
                                  outerRadius={120}
                                  paddingAngle={2}
                                  dataKey="value"
                                >
                                  {statusDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                                  ))}
                                </Pie>
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'white', 
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    fontSize: '12px'
                                  }} 
                                />
                                <Legend wrapperStyle={{ fontSize: '12px' }} />
                              </RechartsPieChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Application Lifetime Chart */}
                      <Card className="border border-slate-200 bg-white shadow-sm">
                        <CardHeader className="border-b border-slate-200">
                          <CardTitle className="text-lg font-semibold text-slate-900">Application Lifetime</CardTitle>
                          <CardDescription className="text-slate-500">Number of applications over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={lifetimeData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                              <XAxis 
                                dataKey="date" 
                                stroke="#64748b" 
                                fontSize={12} 
                                tick={{ fill: '#64748b' }}
                              />
                              <YAxis stroke="#64748b" fontSize={12} tick={{ fill: '#64748b' }} label={{ value: 'Applications', angle: -90, position: 'insideLeft', fill: '#64748b' }} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                  fontSize: '12px'
                                }} 
                              />
                              <Legend wrapperStyle={{ fontSize: '12px' }} />
                              <Line 
                                type="monotone" 
                                dataKey="applications" 
                                stroke="#475569" 
                                strokeWidth={2}
                                name="Total Applications"
                                dot={{ fill: '#475569', r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="approved" 
                                stroke="#059669" 
                                strokeWidth={2}
                                name="Approved"
                                dot={{ fill: '#059669', r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="rejected" 
                                stroke="#dc2626" 
                                strokeWidth={2}
                                name="Rejected"
                                dot={{ fill: '#dc2626', r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                              <Line 
                                type="monotone" 
                                dataKey="pending" 
                                stroke="#D97706" 
                                strokeWidth={2}
                                name="Pending"
                                dot={{ fill: '#D97706', r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </TabsContent>

            {/* Applications Tab */}
            <TabsContent value="applications" className="space-y-6">
              <ApplicationManagement />
            </TabsContent>

            {/* Members Tab */}
            <TabsContent value="members" className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg font-semibold text-slate-900">User Profiles</CardTitle>
                  <CardDescription className="text-slate-500">All registered users in the system</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                     {profiles.length === 0 ? (
                       <p className="text-sm text-slate-500 text-center py-12">No user profiles found</p>
                     ) : (
                       profiles.map((profile) => (
                         <div key={profile.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all">
                           <div className="flex items-center space-x-4">
                             <div className="w-10 h-10 bg-slate-100 rounded-md flex items-center justify-center border border-slate-200">
                               <User className="w-5 h-5 text-slate-600" />
                             </div>
                             <div>
                               <p className="font-semibold text-slate-900">
                                 {profile.full_name || profile.company_name || profile.email}
                               </p>
                               <p className="text-sm text-slate-600">{profile.email}</p>
                               {profile.company_name && (
                                 <p className="text-xs text-slate-500 mt-0.5">{profile.company_name}</p>
                               )}
                             </div>
                           </div>
                           <div className="flex items-center space-x-3">
                             <Badge 
                               variant="outline" 
                               className={
                                 profile.user_role === 'admin' ? 'border-slate-700 bg-slate-50 text-slate-700 font-medium' :
                                 profile.user_role === 'member' ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-medium' :
                                 'border-slate-300 bg-slate-50 text-slate-600 font-medium'
                               }
                             >
                               {profile.user_role || 'viewer'}
                             </Badge>
                             <Button size="sm" variant="outline" className="border-slate-300 text-slate-600 hover:bg-slate-100">
                               <Eye className="w-4 h-4" />
                             </Button>
                           </div>
                         </div>
                       ))
                     )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-lg font-semibold text-slate-900">Recent Activity</CardTitle>
                  <CardDescription className="text-slate-500">Latest system activities and changes</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                     {activityLogs.length === 0 ? (
                       <p className="text-sm text-slate-500 text-center py-12">No activity logs found</p>
                     ) : (
                       activityLogs.map((log) => {
                         // Format action/activity type
                         const actionType = log.action || log.activity_type || 'Unknown Action';
                         const formattedAction = actionType
                           .replace(/_/g, ' ')
                           .replace(/\b\w/g, l => l.toUpperCase());

                         // Build detailed description
                         let description = log.description || '';
                         const details = log.details || {};

                         // Build comprehensive description based on action type and details
                         if (!description) {
                           const parts: string[] = [];
                           
                           // User information
                           if (log.user) {
                             parts.push(`User: ${log.user.full_name || log.user.email || 'Unknown'}`);
                             if (log.user.company_name) {
                               parts.push(`(${log.user.company_name})`);
                             }
                           } else if (log.user_id) {
                             parts.push(`User ID: ${log.user_id.substring(0, 8)}...`);
                           }

                           // Action-specific details
                           if (details.applicant_name) {
                             parts.push(`Applicant: ${details.applicant_name}`);
                           }
                           if (details.target_user_id) {
                             parts.push(`Target User: ${details.target_user_id.substring(0, 8)}...`);
                           }
                           if (details.old_role && details.new_role) {
                             parts.push(`Role: ${details.old_role} → ${details.new_role}`);
                           }
                           if (log.points_earned !== undefined && log.points_earned !== null) {
                             parts.push(`Points: ${log.points_earned}`);
                           }
                           if (log.resource_type) {
                             parts.push(`Resource: ${log.resource_type}`);
                           }
                           if (details.blog_title) {
                             parts.push(`Blog: ${details.blog_title}`);
                           }
                           if (details.survey_year) {
                             parts.push(`Survey: ${details.survey_year}`);
                           }

                           description = parts.length > 0 ? parts.join(' • ') : 'No additional details';
                         }

                         // Format timestamp
                         const timestamp = new Date(log.created_at);
                         const timeAgo = getTimeAgo(timestamp);

                         return (
                           <div key={log.id} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                             <div className="w-8 h-8 bg-slate-100 rounded-md flex items-center justify-center flex-shrink-0 border border-slate-200">
                               <Activity className="w-4 h-4 text-slate-600" />
                             </div>
                             <div className="flex-1 min-w-0">
                               <div className="flex items-start justify-between gap-4">
                                 <div className="flex-1 min-w-0">
                                   <p className="text-sm font-semibold text-slate-900">
                                     {formattedAction}
                                   </p>
                                   <p className="text-sm text-slate-600 mt-1">
                                     {description}
                                   </p>
                                   <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                     <span>{timestamp.toLocaleString()}</span>
                                     <span>•</span>
                                     <span>{timeAgo}</span>
                                     {log.ip_address && (
                                       <>
                                         <span>•</span>
                                         <span>IP: {log.ip_address}</span>
                                       </>
                                     )}
                                   </div>
                                 </div>
                               </div>
                             </div>
                           </div>
                         );
                       })
                     )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modals */}
        <CreateUserModal
          open={showCreateUserModal}
          onClose={() => setShowCreateUserModal(false)}
          onSuccess={fetchAllData}
        />

        <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-slate-200">
            <DialogHeader className="border-b border-slate-200 pb-4">
              <DialogTitle className="text-xl font-semibold text-slate-900">Application Details</DialogTitle>
              <DialogDescription className="text-slate-500">
                Review the complete application information
              </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                     <div>
                       <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3 pb-2 border-b border-slate-200">Applicant Information</h3>
                       <div className="space-y-3 text-sm">
                         <div>
                           <p className="text-slate-500 mb-1">Name</p>
                           <p className="font-medium text-slate-900">{selectedRequest.applicant_name || 'Not provided'}</p>
                         </div>
                         <div>
                           <p className="text-slate-500 mb-1">Email</p>
                           <p className="font-medium text-slate-900">{selectedRequest.email}</p>
                         </div>
                         <div>
                           <p className="text-slate-500 mb-1">Company</p>
                           <p className="font-medium text-slate-900">{selectedRequest.company_name || selectedRequest.vehicle_name || 'Not provided'}</p>
                         </div>
                         <div>
                           <p className="text-slate-500 mb-1">Role/Title</p>
                           <p className="font-medium text-slate-900">{selectedRequest.role_job_title || 'Not provided'}</p>
                         </div>
                       </div>
                     </div>
                   </div>
                   <div className="space-y-4">
                     <div>
                       <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3 pb-2 border-b border-slate-200">Fund Information</h3>
                       <div className="space-y-3 text-sm">
                         <div>
                           <p className="text-slate-500 mb-1">Vehicle Name</p>
                           <p className="font-medium text-slate-900">{selectedRequest.vehicle_name || 'Not provided'}</p>
                         </div>
                         <div>
                           <p className="text-slate-500 mb-1">Website</p>
                           <p className="font-medium text-slate-900">{selectedRequest.organization_website || 'Not provided'}</p>
                         </div>
                         <div>
                           <p className="text-slate-500 mb-1">Domicile Countries</p>
                           <p className="font-medium text-slate-900">{selectedRequest.domicile_countries?.join(', ') || 'Not provided'}</p>
                         </div>
                         <div>
                           <p className="text-slate-500 mb-1">Check Size</p>
                           <p className="font-medium text-slate-900">{selectedRequest.typical_check_size || 'Not provided'}</p>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 
                 {selectedRequest.team_overview && (
                   <div className="border-t border-slate-200 pt-6">
                     <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">Team Overview</h3>
                     <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 p-4 rounded-lg whitespace-pre-wrap leading-relaxed">
                       {selectedRequest.team_overview}
                     </div>
                   </div>
                 )}
                 
                 {selectedRequest.investment_thesis && (
                   <div className="border-t border-slate-200 pt-6">
                     <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">Investment Thesis</h3>
                     <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 p-4 rounded-lg whitespace-pre-wrap leading-relaxed">
                       {selectedRequest.investment_thesis}
                     </div>
                   </div>
                 )}
                 
                 <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
                   <div>
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Number of Investments</p>
                     <p className="text-sm font-semibold text-slate-900">{selectedRequest.number_of_investments || 'Not provided'}</p>
                   </div>
                   <div>
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Amount Raised</p>
                     <p className="text-sm font-semibold text-slate-900">{selectedRequest.amount_raised_to_date || 'Not provided'}</p>
                   </div>
                   <div>
                     <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Check Size</p>
                     <p className="text-sm font-semibold text-slate-900">{selectedRequest.typical_check_size || 'Not provided'}</p>
                   </div>
                 </div>
                 
                 {selectedRequest.expectations_from_network && (
                   <div className="border-t border-slate-200 pt-6">
                     <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">Network Expectations</h3>
                     <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 p-4 rounded-lg whitespace-pre-wrap leading-relaxed">
                       {selectedRequest.expectations_from_network}
                     </div>
                   </div>
                 )}
                 
                 {selectedRequest.how_heard_about_network && (
                   <div className="border-t border-slate-200 pt-6">
                     <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">How They Heard About Us</h3>
                     <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 p-4 rounded-lg">
                       {selectedRequest.how_heard_about_network}
                     </div>
                   </div>
                 )}

                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-3 pt-6 border-t border-slate-200">
                    <Button
                      onClick={() => {
                        handleReviewApplication(selectedRequest.id, 'approved');
                        setShowApplicationModal(false);
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve Application
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleReviewApplication(selectedRequest.id, 'rejected');
                        setShowApplicationModal(false);
                      }}
                      className="border-red-300 text-red-700 hover:bg-red-50 font-medium"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject Application
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
};

export default AdminV2;