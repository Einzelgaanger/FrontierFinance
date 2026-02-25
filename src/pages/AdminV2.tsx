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

// Group logs by date bucket
const getDateGroup = (date: Date): string => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  if (date.getTime() >= weekStart.getTime()) return 'This week';
  return 'Earlier';
};

// Icon and color by action type
function getActivityMeta(actionType: string): { icon: React.ReactNode; bg: string; text: string; label: string } {
  const raw = actionType.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  if (/application|approve|reject|pending/i.test(actionType))
    return ({ icon: <ClipboardCheck className="w-4 h-4" />, bg: 'bg-amber-100', text: 'text-amber-800', label: raw });
  if (/role|member|user|login|sign/i.test(actionType))
    return ({ icon: <UserCheck className="w-4 h-4" />, bg: 'bg-blue-100', text: 'text-blue-800', label: raw });
  if (/blog|post/i.test(actionType))
    return ({ icon: <FileText className="w-4 h-4" />, bg: 'bg-emerald-100', text: 'text-emerald-800', label: raw });
  if (/survey|network|populate/i.test(actionType))
    return ({ icon: <BarChart3 className="w-4 h-4" />, bg: 'bg-violet-100', text: 'text-violet-800', label: raw });
  return ({ icon: <Activity className="w-4 h-4" />, bg: 'bg-slate-100', text: 'text-slate-800', label: raw });
}

// Enhanced Activity Log section with filters, grouping, and clear layout
function EnhancedActivityLog(props: { activityLogs: ActivityLog[]; getTimeAgo: (d: Date) => string }) {
  const { activityLogs, getTimeAgo } = props;
  const [activitySearch, setActivitySearch] = useState('');
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>('all');

  const actionTypes = useMemo(() => {
    const set = new Set<string>();
    activityLogs.forEach((log) => set.add(log.action || log.activity_type || 'unknown'));
    return Array.from(set).sort();
  }, [activityLogs]);

  const filteredAndGrouped = useMemo(() => {
    let list = activityLogs;
    const q = activitySearch.toLowerCase().trim();
    if (q) {
      list = list.filter((log) => {
        const action = (log.action || log.activity_type || '').toLowerCase();
        const desc = (log.description || '').toLowerCase();
        const userStr = [log.user?.full_name, log.user?.email, log.user?.company_name].filter(Boolean).join(' ').toLowerCase();
        const detailsStr = typeof log.details === 'object' ? JSON.stringify(log.details).toLowerCase() : '';
        return action.includes(q) || desc.includes(q) || userStr.includes(q) || detailsStr.includes(q);
      });
    }
    if (activityTypeFilter !== 'all') {
      list = list.filter((log) => (log.action || log.activity_type || 'unknown') === activityTypeFilter);
    }
    const groups: Record<string, ActivityLog[]> = {};
    list.forEach((log) => {
      const bucket = getDateGroup(new Date(log.created_at));
      if (!groups[bucket]) groups[bucket] = [];
      groups[bucket].push(log);
    });
    const order = ['Today', 'Yesterday', 'This week', 'Earlier'];
    return order.filter((k) => groups[k]?.length).map((k) => ({ label: k, logs: groups[k] }));
  }, [activityLogs, activitySearch, activityTypeFilter]);

  const buildDescription = (log: ActivityLog) => {
    const desc = log.description || '';
    const details = log.details || {};
    if (desc) return desc;
    const parts: string[] = [];
    if (log.user) {
      parts.push(`${log.user.full_name || log.user.email || 'Unknown'}`);
      if (log.user.company_name) parts.push(` · ${log.user.company_name}`);
    } else if (log.user_id) parts.push(`User: ${String(log.user_id).slice(0, 8)}…`);
    if (details.applicant_name) parts.push(`Applicant: ${details.applicant_name}`);
    if (details.old_role && details.new_role) parts.push(`Role: ${details.old_role} → ${details.new_role}`);
    if (log.points_earned != null) parts.push(`Points: ${log.points_earned}`);
    if (log.resource_type) parts.push(`Resource: ${log.resource_type}`);
    if (details.blog_title) parts.push(`Blog: ${details.blog_title}`);
    if (details.survey_year) parts.push(`Survey: ${details.survey_year}`);
    return parts.length ? parts.join(' · ') : 'No additional details';
  };

  return (
    <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-navy-900">Activity log</CardTitle>
            <CardDescription className="text-slate-500 mt-0.5">
              System events, user actions, and admin changes. Use search and filters to narrow results.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 sm:flex-initial min-w-[180px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search activity..."
                value={activitySearch}
                onChange={(e) => setActivitySearch(e.target.value)}
                className="pl-9 h-9 text-sm border-slate-200 bg-white"
              />
            </div>
            <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
              <SelectTrigger className="w-[180px] h-9 border-slate-200 bg-white text-sm">
                <SelectValue placeholder="Action type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                {actionTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {activityLogs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-12">No activity logs yet.</p>
        ) : filteredAndGrouped.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-12">No matches for your filters.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAndGrouped.map(({ label, logs }) => (
              <div key={label} className="py-4 first:pt-4">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-1 mb-3">{label}</h3>
                <div className="space-y-2">
                  {logs.map((log) => {
                    const actionType = log.action || log.activity_type || 'unknown';
                    const meta = getActivityMeta(actionType);
                    const timestamp = new Date(log.created_at);
                    return (
                      <div
                        key={log.id}
                        className="flex gap-4 p-4 rounded-lg border border-slate-100 bg-white hover:bg-slate-50/80 hover:border-slate-200 transition-colors"
                      >
                        <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${meta.bg} ${meta.text}`}>
                          {meta.icon}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="secondary" className={`text-xs font-medium ${meta.bg} ${meta.text} border-0`}>
                              {meta.label}
                            </Badge>
                            {log.user && (
                              <span className="text-xs text-slate-600">
                                {log.user.full_name || log.user.email}
                                {log.user.company_name ? ` · ${log.user.company_name}` : ''}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-700 break-words">{buildDescription(log)}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs text-slate-500">
                            <span title={timestamp.toISOString()}>{timestamp.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                            <span>{getTimeAgo(timestamp)}</span>
                            {log.ip_address && <span>IP: {log.ip_address}</span>}
                            {log.resource_type && <span>Resource: {log.resource_type}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

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
  const [learningResourcesCount, setLearningResourcesCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<MembershipRequest | null>(null);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [requestsResult, profilesResult, logsResult, blogsResult, learningResult] = await Promise.all([
        supabase.from('applications').select('*').order('created_at', { ascending: false }),
        supabase.from('user_profiles').select('id, email, company_name, full_name, user_role, created_at, updated_at').order('created_at', { ascending: false }),
        supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('blogs').select('id', { count: 'exact', head: true }),
        supabase.from('learning_resources').select('id', { count: 'exact', head: true }).eq('is_published', true)
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
      if (!learningResult.error && learningResult.count != null) {
        setLearningResourcesCount(learningResult.count);
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

    // Subscribe to activity_log table changes
    const activityLogsSubscription = supabase
      .channel('activity-logs-changes')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'activity_log' },
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
    const viewersCount = profiles.filter(p => p.user_role === 'viewer').length;
    const recentActivityCount = activityLogs.length;

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalProfiles,
      activeProfiles,
      activeMembers,
      viewersCount,
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
        await supabase.from('activity_log').insert({
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

  // Application lifetime data - cumulative totals over time
  const lifetimeData = useMemo(() => {
    if (membershipRequests.length === 0) {
      return [];
    }

    // Sort requests by creation date
    const sortedRequests = [...membershipRequests]
      .filter(r => r.created_at)
      .sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());

    if (sortedRequests.length === 0) {
      return [];
    }

    // Get date range from first application to today
    const firstDate = new Date(sortedRequests[0].created_at!);
    const today = new Date();

    // Group by month for better visualization
    const monthlyData: Record<string, {
      date: string;
      dateValue: string;
      applications: number;
      approved: number;
      rejected: number;
      pending: number;
    }> = {};

    // Initialize all months from first application to today
    const currentDate = new Date(firstDate);
    currentDate.setDate(1); // Start of month

    while (currentDate <= today) {
      const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM
      const displayDate = currentDate.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });

      monthlyData[monthKey] = {
        date: displayDate,
        dateValue: monthKey,
        applications: 0,
        approved: 0,
        rejected: 0,
        pending: 0
      };

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Convert to array and calculate cumulative values
    const result: Array<{
      date: string;
      dateValue: string;
      applications: number;
      approved: number;
      rejected: number;
      pending: number;
    }> = [];

    let runningApplications = 0;
    let runningApproved = 0;
    let runningRejected = 0;
    let runningPending = 0;

    // Sort months chronologically
    const sortedMonths = Object.keys(monthlyData).sort();

    sortedMonths.forEach(monthKey => {
      // Count new applications created in this specific month
      const monthRequests = sortedRequests.filter(r => {
        const rDate = new Date(r.created_at!);
        return rDate.toISOString().slice(0, 7) === monthKey;
      });

      // Add new applications to running totals (cumulative)
      runningApplications += monthRequests.length;
      runningApproved += monthRequests.filter(r => r.status === 'approved').length;
      runningRejected += monthRequests.filter(r => r.status === 'rejected').length;
      runningPending += monthRequests.filter(r => r.status === 'pending').length;

      result.push({
        date: monthlyData[monthKey].date,
        dateValue: monthlyData[monthKey].dateValue,
        applications: runningApplications,
        approved: runningApproved,
        rejected: runningRejected,
        pending: runningPending
      });
    });

    return result;
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
      <div className="min-h-screen bg-gradient-to-b from-navy-50/40 via-white to-slate-50/60 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
            <div>
              <span className="section-label text-gold-600">Admin</span>
              <h1 className="text-2xl sm:text-3xl font-display font-normal text-navy-900 mt-1 tracking-tight">
                Admin Dashboard
              </h1>
              <div className="w-14 h-0.5 bg-gold-500/60 mt-3 rounded-full" />
              <p className="text-sm text-slate-600 mt-3 max-w-xl">
                Overview of applications, members, and community activity
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAllData()}
              disabled={loading}
              className="border-navy-200 text-navy-800 hover:bg-navy-50 hover:border-gold-300 shrink-0 rounded-xl transition-colors"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* KPI cards – meaningful, readable metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
            <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:border-gold-200/50 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Applications</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalRequests}</p>
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                      {stats.applicationsGrowth >= 0 ? <TrendingUp className="w-3 h-3 text-emerald-600" /> : <TrendingDown className="w-3 h-3 text-red-600" />}
                      <span className={stats.applicationsGrowth >= 0 ? 'text-emerald-600' : 'text-red-600'}>
                        {Math.abs(stats.applicationsGrowth).toFixed(1)}%
                      </span>
                      vs last month
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                    <ClipboardList className="w-5 h-5 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`bg-white border shadow-sm rounded-2xl overflow-hidden transition-all duration-300 ${stats.pendingRequests > 0 ? 'border-amber-200 ring-1 ring-amber-100 hover:shadow-md' : 'border-slate-100 hover:shadow-md hover:border-gold-200/50'}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pending review</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.pendingRequests}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {stats.pendingRequests > 0 ? 'Needs attention' : 'All caught up'}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stats.pendingRequests > 0 ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    <AlertCircle className={`w-5 h-5 ${stats.pendingRequests > 0 ? 'text-amber-600' : 'text-slate-600'}`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:border-gold-200/50 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Members & users</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalProfiles}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {stats.activeMembers} members · {(stats.viewersCount ?? (stats.totalProfiles - stats.activeMembers))} viewers
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:border-gold-200/50 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Community</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{blogsCount + learningResourcesCount}</p>
                    <p className="text-xs text-slate-500 mt-2">
                      {blogsCount} posts · {learningResourcesCount} learning resources
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden hover:shadow-md hover:border-gold-200/50 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg. decision time</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{stats.avgProcessingDays}</p>
                    <p className="text-xs text-slate-500 mt-2">days to approve or reject</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white border border-slate-100 shadow-sm rounded-2xl p-1.5 h-12">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-navy-900 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl text-slate-600 font-medium transition-all"
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="data-[state=active]:bg-navy-900 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl text-slate-600 font-medium transition-all"
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Applications
              </TabsTrigger>
              <TabsTrigger
                value="activity"
                className="data-[state=active]:bg-navy-900 data-[state=active]:text-white data-[state=active]:shadow-md rounded-xl text-slate-600 font-medium transition-all"
              >
                <History className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8 mt-6">
              <div>
                <span className="section-label text-gold-600">Insights</span>
                <h2 className="text-xl font-display font-normal text-navy-900 mt-1">Applications pipeline</h2>
                <p className="text-sm text-slate-600 mt-1">Trends and distribution over time.</p>
                <div className="w-14 h-0.5 bg-gold-500/60 mt-2 rounded-full" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Applications Trend Chart */}
                <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                    <CardTitle className="text-base font-semibold text-navy-900">Applications this week</CardTitle>
                    <CardDescription className="text-slate-500 text-sm mt-0.5">Daily submissions by outcome</CardDescription>
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
                <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                    <CardTitle className="text-base font-semibold text-navy-900">Status breakdown</CardTitle>
                    <CardDescription className="text-slate-500 text-sm mt-0.5">Pending, approved, and rejected</CardDescription>
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
              <Card className="border border-slate-100 bg-white shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                  <CardTitle className="text-base font-semibold text-navy-900">Applications over time</CardTitle>
                  <CardDescription className="text-slate-500 text-sm mt-0.5">Cumulative applications, approved, rejected, and pending</CardDescription>
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

            {/* Activity Tab – detailed, well-presented log */}
            <TabsContent value="activity" className="space-y-6">
              <EnhancedActivityLog activityLogs={activityLogs} getTimeAgo={getTimeAgo} />
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