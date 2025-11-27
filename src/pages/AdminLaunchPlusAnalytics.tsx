import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Download, Users, TrendingUp, DollarSign, Calendar, RefreshCw, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Assessment {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  fund_name: string;
  fund_stages: string[];
  geographical_focus: string[];
  interested_services: string[];
  capital_raised_grants: number;
  capital_raised_equity: number;
  capital_raised_debt: number;
  investments_count: number;
  program_expectations: string;
  phone_whatsapp?: string;
  fund_website?: string;
  [key: string]: any;
}

const AdminLaunchPlusAnalytics = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    fetchAssessments();
  }, [userRole, navigate]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('launch_plus_assessments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAssessments(data || []);
    } catch (error: any) {
      toast.error('Failed to load assessments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = assessments.filter(
    (assessment) =>
      assessment.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.fund_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Analytics calculations
  const totalSubmissions = assessments.length;
  const totalCapitalRaised = assessments.reduce(
    (sum, a) => sum + (a.capital_raised_grants || 0) + (a.capital_raised_equity || 0) + (a.capital_raised_debt || 0) + (a.capital_raised_first_loss || 0) + (a.capital_raised_senior || 0) + (a.capital_raised_other || 0),
    0
  );
  const totalInvestments = assessments.reduce((sum, a) => sum + (a.investments_count || 0), 0);
  const avgInvestmentsPerFund = totalSubmissions > 0 ? (totalInvestments / totalSubmissions).toFixed(1) : 0;
  const avgCapitalPerFund = totalSubmissions > 0 ? (totalCapitalRaised / totalSubmissions / 1000000).toFixed(2) : 0;
  const totalCommitted = assessments.reduce((sum, a) => sum + (a.capital_committed || 0), 0);
  const totalDisbursed = assessments.reduce((sum, a) => sum + (a.capital_disbursed || 0), 0);

  // Stage distribution
  const stageDistribution = assessments.reduce((acc, a) => {
    (a.fund_stages || []).forEach(stage => {
      acc[stage] = (acc[stage] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Geographic distribution
  const geoDistribution = assessments.reduce((acc, a) => {
    (a.geographical_focus || []).forEach(geo => {
      acc[geo] = (acc[geo] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Services interest distribution
  const servicesDistribution = assessments.reduce((acc, a) => {
    (a.interested_services || []).forEach(service => {
      acc[service] = (acc[service] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  // Capital breakdown
  const capitalBreakdown = {
    grants: assessments.reduce((sum, a) => sum + (a.capital_raised_grants || 0), 0),
    equity: assessments.reduce((sum, a) => sum + (a.capital_raised_equity || 0), 0),
    debt: assessments.reduce((sum, a) => sum + (a.capital_raised_debt || 0), 0),
    firstLoss: assessments.reduce((sum, a) => sum + (a.capital_raised_first_loss || 0), 0),
    senior: assessments.reduce((sum, a) => sum + (a.capital_raised_senior || 0), 0),
    other: assessments.reduce((sum, a) => sum + (a.capital_raised_other || 0), 0),
  };

  const exportToCSV = () => {
    const headers = [
      'Submission ID',
      'Submission Date',
      'Submission Time',
      'Submission Status',
      'Full Name',
      'Email',
      'Phone/WhatsApp',
      'Address',
      'Fund Name',
      'Fund Website',
      'LinkedIn Profile',
      'Other Social Media',
      'Fund Stages',
      'Stage Explanation',
      'Geographical Focus',
      'Interested Services',
      'Legal Status',
      'Operations vs Domicile',
      'Capital Raised - Grants ($)',
      'Capital Raised - First Loss ($)',
      'Capital Raised - Equity ($)',
      'Capital Raised - Debt ($)',
      'Capital Raised - Senior ($)',
      'Capital Raised - Other ($)',
      'Capital Raised - Other Description',
      'Total Capital Raised ($)',
      'Capital Committed ($)',
      'Capital Disbursed ($)',
      'Number of Investments',
      'Program Expectations',
      'IP Address',
      'User Agent'
    ];
    
    const rows = assessments.map(a => [
      a.id || '',
      format(new Date(a.created_at), 'yyyy-MM-dd'),
      format(new Date(a.created_at), 'HH:mm:ss'),
      a.submission_status || 'completed',
      a.full_name || '',
      a.email || '',
      a.phone_whatsapp || '',
      a.address || '',
      a.fund_name || '',
      a.fund_website || '',
      a.linkedin_profile || '',
      a.other_social_media || '',
      (a.fund_stages || []).join('; '),
      a.stage_explanation || '',
      (a.geographical_focus || []).join('; '),
      (a.interested_services || []).join('; '),
      a.legal_status || '',
      a.operations_vs_domicile || '',
      (a.capital_raised_grants || 0).toString(),
      (a.capital_raised_first_loss || 0).toString(),
      (a.capital_raised_equity || 0).toString(),
      (a.capital_raised_debt || 0).toString(),
      (a.capital_raised_senior || 0).toString(),
      (a.capital_raised_other || 0).toString(),
      a.capital_raised_other_description || '',
      ((a.capital_raised_grants || 0) + (a.capital_raised_first_loss || 0) + (a.capital_raised_equity || 0) + (a.capital_raised_debt || 0) + (a.capital_raised_senior || 0) + (a.capital_raised_other || 0)).toString(),
      (a.capital_committed || 0).toString(),
      (a.capital_disbursed || 0).toString(),
      (a.investments_count || 0).toString(),
      a.program_expectations || '',
      a.ip_address || '',
      a.user_agent || ''
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `launch-plus-assessments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button onClick={fetchAssessments} variant="outline" size="sm" className="gap-2 border-white/10 bg-slate-800/50 text-gray-200 hover:bg-slate-700/50">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
      <Button onClick={exportToCSV} size="sm" className="gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-600 hover:shadow-lg">
        <Download className="h-4 w-4" />
        Export CSV
      </Button>
    </div>
  );

  if (userRole !== 'admin') {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Access denied. Admin only.</p>
        </div>
      </SidebarLayout>
    );
  }

  if (loading) {
    return (
      <SidebarLayout headerActions={headerActions}>
        <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <div className="fixed inset-0 z-0">
            <img 
              src="/Launch+2.jpg" 
              alt="Launch+ Background" 
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
          </div>
          <div className="relative z-10 container mx-auto p-6 space-y-6">
            {/* Summary Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="relative overflow-hidden border-white/10 bg-slate-900/40 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-24 bg-slate-700/50" />
                    <Skeleton className="h-5 w-5 rounded bg-slate-700/50" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 mb-2 bg-slate-700/50" />
                    <Skeleton className="h-3 w-20 bg-slate-700/50" />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Content Skeleton */}
            <Card className="border-white/10 bg-slate-900/40 backdrop-blur-xl">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-slate-700/50" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-64 w-full bg-slate-700/50" />
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout headerActions={headerActions}>
      <div className="min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Background Image with Overlay */}
        <div className="fixed inset-0 z-0">
          <img 
            src="/Launch+2.jpg" 
            alt="Launch+ Background" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-purple-900/95" />
        </div>

        {/* Animated gradient orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent mb-2">
              LAUNCH+ Assessment Analytics
            </h1>
            <p className="text-gray-300 text-lg">Track and analyze fund manager applications</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="relative overflow-hidden border border-white/10 backdrop-blur-xl bg-slate-900/40 hover:shadow-blue-500/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-gray-200">Total Submissions</CardTitle>
                <div className="p-2 bg-blue-500/20 rounded-lg backdrop-blur-sm border border-blue-500/30">
                  <Users className="h-5 w-5 text-blue-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white">{totalSubmissions}</div>
                <p className="text-xs text-gray-400 mt-1">Assessment submissions</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-white/10 backdrop-blur-xl bg-slate-900/40 hover:shadow-green-500/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-gray-200">Total Capital Raised</CardTitle>
                <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm border border-green-500/30">
                  <DollarSign className="h-5 w-5 text-green-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white">${(totalCapitalRaised / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-gray-400 mt-1">Combined capital</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-white/10 backdrop-blur-xl bg-slate-900/40 hover:shadow-purple-500/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-gray-200">Total Investments</CardTitle>
                <div className="p-2 bg-purple-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30">
                  <TrendingUp className="h-5 w-5 text-purple-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white">{totalInvestments}</div>
                <p className="text-xs text-gray-400 mt-1">Total investments</p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border border-white/10 backdrop-blur-xl bg-slate-900/40 hover:shadow-amber-500/20 transition-all">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                <CardTitle className="text-sm font-medium text-gray-200">Avg Investments/Fund</CardTitle>
                <div className="p-2 bg-amber-500/20 rounded-lg backdrop-blur-sm border border-amber-500/30">
                  <Activity className="h-5 w-5 text-amber-400" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-white">{avgInvestmentsPerFund}</div>
                <p className="text-xs text-gray-400 mt-1">Per fund average</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="responses" className="space-y-6">
            <TabsList className="backdrop-blur-xl bg-slate-900/40 border border-white/10 shadow-md rounded-xl p-1">
              <TabsTrigger value="responses" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300">
                All Responses
              </TabsTrigger>
              <TabsTrigger value="analytics" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white text-gray-300">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="responses" className="space-y-4">
              {/* Search */}
              <Card className="border border-white/10 backdrop-blur-xl bg-slate-900/40">
                <CardContent className="pt-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or fund name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-white/10 bg-slate-800/50 text-white placeholder:text-gray-400 focus:border-blue-500"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Assessments List */}
              <div className="space-y-4">
                {filteredAssessments.length === 0 ? (
                  <Card className="border border-white/10 backdrop-blur-xl bg-slate-900/40">
                    <CardContent className="pt-6">
                      <div className="text-center py-8 text-gray-400">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No assessments found</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  filteredAssessments.map((assessment) => (
                    <Card
                      key={assessment.id}
                      className="cursor-pointer border border-white/10 backdrop-blur-xl bg-slate-900/40 hover:bg-slate-800/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all"
                      onClick={() => setSelectedAssessment(assessment)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-100">{assessment.full_name}</CardTitle>
                            <CardDescription className="mt-1 text-gray-300">
                              {assessment.fund_name} • {assessment.email}
                            </CardDescription>
                          </div>
                          <Badge variant="outline" className="ml-2 border-blue-500/30 bg-blue-500/10 text-blue-300">
                            {format(new Date(assessment.created_at), 'MMM dd, yyyy')}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {(assessment.fund_stages || []).map((stage: string) => (
                            <Badge key={stage} className="capitalize bg-purple-500/20 text-purple-300 border-purple-500/30">
                              {stage}
                            </Badge>
                          ))}
                          {(assessment.geographical_focus || []).slice(0, 3).map((geo: string) => (
                            <Badge key={geo} className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {geo}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Additional Stats Row */}
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <Card className="backdrop-blur-xl bg-slate-900/40 shadow-xl rounded-3xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-200">Avg Capital/Fund</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      ${avgCapitalPerFund}M
                    </div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-xl bg-slate-900/40 shadow-xl rounded-3xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-200">Total Committed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      ${(totalCommitted / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
                <Card className="backdrop-blur-xl bg-slate-900/40 shadow-xl rounded-3xl border border-white/10">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-200">Total Disbursed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ${(totalDisbursed / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Stage Distribution */}
                <Card className="border border-white/10 backdrop-blur-xl bg-slate-900/40">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Fund Stage Distribution</CardTitle>
                    <CardDescription className="text-gray-300">Distribution of fund stages across all submissions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.keys(stageDistribution).length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p>No stage data available</p>
                        </div>
                      ) : (
                        Object.entries(stageDistribution)
                          .sort(([, a], [, b]) => b - a)
                          .map(([stage, count]) => (
                            <div key={stage} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium capitalize text-gray-200">{stage}</span>
                                <span className="text-gray-400">{count} ({((count / totalSubmissions) * 100).toFixed(1)}%)</span>
                              </div>
                              <div className="w-full bg-slate-800/50 rounded-full h-2 border border-white/5">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(count / totalSubmissions) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Geographic Distribution */}
                <Card className="border border-white/10 backdrop-blur-xl bg-slate-900/40">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Geographic Distribution</CardTitle>
                    <CardDescription className="text-gray-300">Top geographic focus areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.keys(geoDistribution).length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p>No geographic data available</p>
                        </div>
                      ) : (
                        Object.entries(geoDistribution)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 10)
                          .map(([geo, count]) => (
                            <div key={geo} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-200">{geo}</span>
                                <span className="text-gray-400">{count} ({((count / totalSubmissions) * 100).toFixed(1)}%)</span>
                              </div>
                              <div className="w-full bg-slate-800/50 rounded-full h-2 border border-white/5">
                                <div
                                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(count / totalSubmissions) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Services Interest */}
                <Card className="border border-white/10 backdrop-blur-xl bg-slate-900/40">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Services Interest</CardTitle>
                    <CardDescription className="text-gray-300">Most requested LAUNCH+ services</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.keys(servicesDistribution).length === 0 ? (
                        <div className="text-center py-8 text-gray-400">
                          <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p>No services data available</p>
                        </div>
                      ) : (
                        Object.entries(servicesDistribution)
                          .sort(([, a], [, b]) => b - a)
                          .map(([service, count]) => (
                            <div key={service} className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-200 text-xs">{service}</span>
                                <span className="text-gray-400">{count}</span>
                              </div>
                              <div className="w-full bg-slate-800/50 rounded-full h-2 border border-white/5">
                                <div
                                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(count / totalSubmissions) * 100}%` }}
                                />
                              </div>
                            </div>
                          ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Capital Breakdown */}
                <Card className="border border-white/10 backdrop-blur-xl bg-slate-900/40">
                  <CardHeader>
                    <CardTitle className="text-gray-100">Capital Breakdown</CardTitle>
                    <CardDescription className="text-gray-300">Total capital raised by type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { label: 'Grants', value: capitalBreakdown.grants, color: 'from-green-500 to-emerald-500' },
                        { label: 'Equity', value: capitalBreakdown.equity, color: 'from-blue-500 to-cyan-500' },
                        { label: 'Debt', value: capitalBreakdown.debt, color: 'from-purple-500 to-indigo-500' },
                        { label: 'First Loss', value: capitalBreakdown.firstLoss, color: 'from-amber-500 to-yellow-500' },
                        { label: 'Senior', value: capitalBreakdown.senior, color: 'from-indigo-500 to-violet-500' },
                        { label: 'Other', value: capitalBreakdown.other, color: 'from-pink-500 to-rose-500' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5">
                          <span className="text-sm font-medium text-gray-200">{item.label}</span>
                          <span className={`text-lg font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                            ${(item.value / 1000000).toFixed(2)}M
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Assessment Detail Modal */}
        <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] backdrop-blur-xl bg-slate-900/95 border border-white/10 text-white">
            <DialogHeader className="border-b border-white/10 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent mb-2">
                    {selectedAssessment?.full_name}
                  </DialogTitle>
                  <p className="text-lg text-gray-300">{selectedAssessment?.fund_name}</p>
                </div>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm rounded-full border-0">
                  {selectedAssessment && format(new Date(selectedAssessment.created_at), 'MMM dd, yyyy')}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2 custom-scrollbar">
              {selectedAssessment && (
                <div className="space-y-6 py-4">
                  {/* Basic Information */}
                  <Card className="backdrop-blur-xl bg-slate-800/40 shadow-lg rounded-2xl border border-white/10">
                    <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-t-2xl border-b border-white/10">
                      <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Full Name</p>
                          <p className="text-base font-medium text-gray-100">{selectedAssessment.full_name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Email</p>
                          <p className="text-base font-medium text-gray-100">{selectedAssessment.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Phone / WhatsApp</p>
                          <p className="text-base font-medium text-gray-100">{selectedAssessment.phone_whatsapp || 'Not provided'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fund Name</p>
                          <p className="text-base font-medium text-gray-100">{selectedAssessment.fund_name}</p>
                        </div>
                        {selectedAssessment.address && (
                          <div className="md:col-span-2 space-y-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Address</p>
                            <p className="text-base font-medium text-gray-100">{selectedAssessment.address}</p>
                          </div>
                        )}
                        {selectedAssessment.fund_website && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Website</p>
                            <a href={selectedAssessment.fund_website} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-blue-400 hover:underline">
                              {selectedAssessment.fund_website}
                            </a>
                          </div>
                        )}
                        {selectedAssessment.linkedin_profile && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">LinkedIn</p>
                            <a href={selectedAssessment.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-blue-400 hover:underline truncate block">
                              {selectedAssessment.linkedin_profile}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fund Stage */}
                  <Card className="backdrop-blur-xl bg-slate-800/40 shadow-lg rounded-2xl border border-white/10">
                    <CardHeader className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-t-2xl border-b border-white/10">
                      <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                        Fund Stage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Selected Stages</p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedAssessment.fund_stages || []).map((stage: string) => (
                            <Badge key={stage} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full capitalize text-sm border-0">
                              {stage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedAssessment.stage_explanation && (
                        <div className="bg-purple-900/20 p-4 rounded-xl border border-purple-500/20">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Stage Explanation</p>
                          <p className="text-sm text-gray-200 leading-relaxed">{selectedAssessment.stage_explanation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Eligibility Details */}
                  <Card className="backdrop-blur-xl bg-slate-800/40 shadow-lg rounded-2xl border border-white/10">
                    <CardHeader className="bg-gradient-to-r from-green-900/50 to-blue-900/50 rounded-t-2xl border-b border-white/10">
                      <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        Eligibility for LAUNCH+
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div className="bg-blue-900/20 p-5 rounded-xl border border-blue-500/20">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Interested Services</p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedAssessment.interested_services || []).map((service: string) => (
                            <Badge key={service} className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1.5 rounded-lg text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-purple-900/20 p-5 rounded-xl border border-purple-500/20">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Geographic Focus</p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedAssessment.geographical_focus || []).map((geo: string) => (
                            <Badge key={geo} className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs">
                              {geo}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-700/30 p-4 rounded-xl border border-white/5">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Legal Status</p>
                          <p className="text-sm font-medium text-gray-100">{selectedAssessment.legal_status || 'Not specified'}</p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-xl border border-white/5">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Operations vs Domicile</p>
                          <p className="text-sm font-medium text-gray-100">{selectedAssessment.operations_vs_domicile || 'Not specified'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Capital Information */}
                  <Card className="backdrop-blur-xl bg-slate-800/40 shadow-lg rounded-2xl border border-white/10">
                    <CardHeader className="bg-gradient-to-r from-emerald-900/50 to-green-900/50 rounded-t-2xl border-b border-white/10">
                      <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                        Capital Raised Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-5 rounded-xl border border-green-500/20">
                          <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">Grants</p>
                          <p className="text-2xl font-bold text-green-300">
                            ${(selectedAssessment.capital_raised_grants || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-5 rounded-xl border border-blue-500/20">
                          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">Equity</p>
                          <p className="text-2xl font-bold text-blue-300">
                            ${(selectedAssessment.capital_raised_equity || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 p-5 rounded-xl border border-purple-500/20">
                          <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-1">Debt</p>
                          <p className="text-2xl font-bold text-purple-300">
                            ${(selectedAssessment.capital_raised_debt || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 p-5 rounded-xl border border-amber-500/20">
                          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide mb-1">First Loss</p>
                          <p className="text-2xl font-bold text-amber-300">
                            ${(selectedAssessment.capital_raised_first_loss || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-900/30 to-violet-900/30 p-5 rounded-xl border border-indigo-500/20">
                          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wide mb-1">Senior Capital</p>
                          <p className="text-2xl font-bold text-indigo-300">
                            ${(selectedAssessment.capital_raised_senior || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-900/30 to-rose-900/30 p-5 rounded-xl border border-pink-500/20">
                          <p className="text-xs font-semibold text-pink-400 uppercase tracking-wide mb-1">Other</p>
                          <p className="text-2xl font-bold text-pink-300">
                            ${(selectedAssessment.capital_raised_other || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Investment Information */}
                  <Card className="backdrop-blur-xl bg-slate-800/40 shadow-lg rounded-2xl border border-white/10">
                    <CardHeader className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 rounded-t-2xl border-b border-white/10">
                      <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        Investment Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-slate-700/30 to-slate-800/30 p-5 rounded-xl border border-white/10">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Investments</p>
                          <p className="text-3xl font-bold text-gray-100">{selectedAssessment.investments_count || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-5 rounded-xl border border-blue-500/20">
                          <p className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-1">Capital Committed</p>
                          <p className="text-2xl font-bold text-blue-300">
                            ${(selectedAssessment.capital_committed || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-5 rounded-xl border border-green-500/20">
                          <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-1">Capital Disbursed</p>
                          <p className="text-2xl font-bold text-green-300">
                            ${(selectedAssessment.capital_disbursed || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Program Expectations */}
                  {selectedAssessment.program_expectations && (
                    <Card className="backdrop-blur-xl bg-slate-800/40 shadow-lg rounded-2xl border border-white/10">
                      <CardHeader className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-t-2xl border-b border-white/10">
                        <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                          Program Expectations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="bg-amber-900/20 p-5 rounded-xl border border-amber-500/20">
                          <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {selectedAssessment.program_expectations}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Submission Metadata */}
                  <Card className="backdrop-blur-xl bg-slate-800/40 shadow-lg rounded-2xl border border-white/10">
                    <CardHeader className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-t-2xl border-b border-white/10">
                      <CardTitle className="text-xl font-bold text-gray-100 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                        Submission Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-slate-700/30 p-4 rounded-xl border border-white/5">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Submission Date & Time</p>
                          <p className="text-base font-medium text-gray-100">
                            {format(new Date(selectedAssessment.created_at), 'PPpp')}
                          </p>
                        </div>
                        <div className="bg-slate-700/30 p-4 rounded-xl border border-white/5">
                          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Status</p>
                          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm border-0">
                            {selectedAssessment.submission_status || 'Completed'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        <style>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #3b82f6, #a855f7);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #2563eb, #9333ea);
          }
        `}</style>
      </div>
    </SidebarLayout>
  );
};

export default AdminLaunchPlusAnalytics;
