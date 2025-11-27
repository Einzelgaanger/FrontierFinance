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
      <Button onClick={fetchAssessments} variant="outline" size="sm" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Refresh
      </Button>
      <Button onClick={exportToCSV} size="sm" className="gap-2">
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
        <div className="container mx-auto p-6 space-y-6">
          {/* Summary Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="relative overflow-hidden border-none">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-5 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Content Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout headerActions={headerActions}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{totalSubmissions}</div>
              <p className="text-xs text-muted-foreground mt-1">Assessment submissions</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Total Capital Raised</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">${(totalCapitalRaised / 1000000).toFixed(1)}M</div>
              <p className="text-xs text-muted-foreground mt-1">Combined capital</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{totalInvestments}</div>
              <p className="text-xs text-muted-foreground mt-1">Total investments</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Avg Investments/Fund</CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{avgInvestmentsPerFund}</div>
              <p className="text-xs text-muted-foreground mt-1">Per fund average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="responses" className="space-y-6">
          <TabsList className="bg-white/95 backdrop-blur-md shadow-md rounded-lg p-1 border">
            <TabsTrigger value="responses" className="rounded-md">
              All Responses
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-md">
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="responses" className="space-y-4">
            {/* Search */}
            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, or fund name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Assessments List */}
            <div className="space-y-4">
              {filteredAssessments.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
                      <p>No assessments found</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                filteredAssessments.map((assessment) => (
                  <Card
                    key={assessment.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedAssessment(assessment)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{assessment.full_name}</CardTitle>
                          <CardDescription className="mt-1">
                            {assessment.fund_name} • {assessment.email}
                          </CardDescription>
                        </div>
                        <Badge variant="outline" className="ml-2">
                          {format(new Date(assessment.created_at), 'MMM dd, yyyy')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {(assessment.fund_stages || []).map((stage: string) => (
                          <Badge key={stage} variant="secondary" className="capitalize">
                            {stage}
                          </Badge>
                        ))}
                        {(assessment.geographical_focus || []).slice(0, 3).map((geo: string) => (
                          <Badge key={geo} variant="outline">
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
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Avg Capital/Fund</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${avgCapitalPerFund}M
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Total Committed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ${(totalCommitted / 1000000).toFixed(1)}M
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-700">Total Disbursed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    ${(totalDisbursed / 1000000).toFixed(1)}M
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Stage Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Fund Stage Distribution</CardTitle>
                  <CardDescription>Distribution of fund stages across all submissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.keys(stageDistribution).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Activity className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No stage data available</p>
                      </div>
                    ) : (
                      Object.entries(stageDistribution)
                        .sort(([, a], [, b]) => b - a)
                        .map(([stage, count]) => (
                          <div key={stage} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium capitalize">{stage}</span>
                              <span className="text-muted-foreground">{count} ({((count / totalSubmissions) * 100).toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
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
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                  <CardDescription>Top geographic focus areas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.keys(geoDistribution).length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
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
                              <span className="font-medium">{geo}</span>
                              <span className="text-muted-foreground">{count} ({((count / totalSubmissions) * 100).toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-secondary rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-500"
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
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Services Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(servicesDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .map(([service, count]) => (
                        <div key={service} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700 line-clamp-2 flex-1 mr-3">{service}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${(count / totalSubmissions) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold w-8 text-right bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                              {count}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {/* Capital Breakdown */}
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Capital Raised Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(capitalBreakdown).map(([type, amount]) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                        <span className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                          ${(amount / 1000000).toFixed(2)}M
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Detail Modal */}
        <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-blue-50/95 via-white to-purple-50/95 backdrop-blur-xl border-0 shadow-2xl">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {selectedAssessment?.full_name}
                  </DialogTitle>
                  <p className="text-lg text-gray-600">{selectedAssessment?.fund_name}</p>
                </div>
                <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-sm rounded-full">
                  {selectedAssessment && format(new Date(selectedAssessment.created_at), 'MMM dd, yyyy')}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2 custom-scrollbar">
              {selectedAssessment && (
                <div className="space-y-6 py-4">
                  {/* Basic Information */}
                  <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border-0">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</p>
                          <p className="text-base font-medium text-gray-900">{selectedAssessment.full_name}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</p>
                          <p className="text-base font-medium text-gray-900">{selectedAssessment.email}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone / WhatsApp</p>
                          <p className="text-base font-medium text-gray-900">{selectedAssessment.phone_whatsapp || 'Not provided'}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Fund Name</p>
                          <p className="text-base font-medium text-gray-900">{selectedAssessment.fund_name}</p>
                        </div>
                        {selectedAssessment.address && (
                          <div className="md:col-span-2 space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</p>
                            <p className="text-base font-medium text-gray-900">{selectedAssessment.address}</p>
                          </div>
                        )}
                        {selectedAssessment.fund_website && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Website</p>
                            <a href={selectedAssessment.fund_website} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-blue-600 hover:underline">
                              {selectedAssessment.fund_website}
                            </a>
                          </div>
                        )}
                        {selectedAssessment.linkedin_profile && (
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">LinkedIn</p>
                            <a href={selectedAssessment.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-blue-600 hover:underline truncate block">
                              {selectedAssessment.linkedin_profile}
                            </a>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Fund Stage */}
                  <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border-0">
                    <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-t-2xl">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                        Fund Stage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Selected Stages</p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedAssessment.fund_stages || []).map((stage: string) => (
                            <Badge key={stage} className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full capitalize text-sm">
                              {stage}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {selectedAssessment.stage_explanation && (
                        <div className="bg-purple-50/50 p-4 rounded-xl">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Stage Explanation</p>
                          <p className="text-sm text-gray-700 leading-relaxed">{selectedAssessment.stage_explanation}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Eligibility Details */}
                  <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border-0">
                    <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-2xl">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-600"></div>
                        Eligibility for LAUNCH+
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div className="bg-blue-50/50 p-5 rounded-xl">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Interested Services</p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedAssessment.interested_services || []).map((service: string) => (
                            <Badge key={service} className="bg-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="bg-purple-50/50 p-5 rounded-xl">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Geographic Focus</p>
                        <div className="flex flex-wrap gap-2">
                          {(selectedAssessment.geographical_focus || []).map((geo: string) => (
                            <Badge key={geo} className="bg-white text-purple-700 border border-purple-200 px-3 py-1.5 rounded-lg text-xs">
                              {geo}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Legal Status</p>
                          <p className="text-sm font-medium text-gray-900">{selectedAssessment.legal_status || 'Not specified'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Operations vs Domicile</p>
                          <p className="text-sm font-medium text-gray-900">{selectedAssessment.operations_vs_domicile || 'Not specified'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Capital Information */}
                  <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border-0">
                    <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-2xl">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        Capital Raised Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Grants</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${(selectedAssessment.capital_raised_grants || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Equity</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${(selectedAssessment.capital_raised_equity || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-5 rounded-xl border border-purple-100">
                          <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Debt</p>
                          <p className="text-2xl font-bold text-purple-600">
                            ${(selectedAssessment.capital_raised_debt || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-5 rounded-xl border border-amber-100">
                          <p className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">First Loss</p>
                          <p className="text-2xl font-bold text-amber-600">
                            ${(selectedAssessment.capital_raised_first_loss || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-5 rounded-xl border border-indigo-100">
                          <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wide mb-1">Senior Capital</p>
                          <p className="text-2xl font-bold text-indigo-600">
                            ${(selectedAssessment.capital_raised_senior || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-5 rounded-xl border border-pink-100">
                          <p className="text-xs font-semibold text-pink-700 uppercase tracking-wide mb-1">Other</p>
                          <p className="text-2xl font-bold text-pink-600">
                            ${(selectedAssessment.capital_raised_other || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Investment Information */}
                  <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border-0">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        Investment Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-5 rounded-xl border border-gray-200">
                          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">Total Investments</p>
                          <p className="text-3xl font-bold text-gray-900">{selectedAssessment.investments_count || 0}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-xl border border-blue-100">
                          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">Capital Committed</p>
                          <p className="text-2xl font-bold text-blue-600">
                            ${(selectedAssessment.capital_committed || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
                          <p className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">Capital Disbursed</p>
                          <p className="text-2xl font-bold text-green-600">
                            ${(selectedAssessment.capital_disbursed || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Program Expectations */}
                  {selectedAssessment.program_expectations && (
                    <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border-0">
                      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl">
                        <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-amber-600"></div>
                          Program Expectations
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="bg-amber-50/50 p-5 rounded-xl">
                          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {selectedAssessment.program_expectations}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Submission Metadata */}
                  <Card className="bg-white/90 backdrop-blur-md shadow-lg rounded-2xl border-0">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-2xl">
                      <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                        Submission Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Submission Date & Time</p>
                          <p className="text-base font-medium text-gray-900">
                            {format(new Date(selectedAssessment.created_at), 'PPpp')}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</p>
                          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-full text-sm">
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
