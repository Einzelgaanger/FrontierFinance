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
      'Date', 'Name', 'Email', 'Fund Name', 'Fund Stages', 'Geographic Focus',
      'Services Interested', 'Capital Raised (Total)', 'Investments Count'
    ];
    
    const rows = assessments.map(a => [
      format(new Date(a.created_at), 'yyyy-MM-dd HH:mm'),
      a.full_name,
      a.email,
      a.fund_name,
      (a.fund_stages || []).join('; '),
      (a.geographical_focus || []).join('; '),
      (a.interested_services || []).join('; '),
      ((a.capital_raised_grants || 0) + (a.capital_raised_equity || 0) + (a.capital_raised_debt || 0)).toString(),
      (a.investments_count || 0).toString()
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

        {/* Detail Modal */}
        <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
          <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-white rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Complete Assessment Details
              </DialogTitle>
            </DialogHeader>
            {selectedAssessment && (
              <div className="space-y-8">
                {/* Section 1: Basic Information */}
                <div className="bg-blue-50/50 p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Section 1: Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Full Name</p>
                      <p className="text-base text-gray-900 font-medium">{selectedAssessment.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Email</p>
                      <p className="text-base text-gray-900 font-medium">{selectedAssessment.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Phone / WhatsApp</p>
                      <p className="text-base text-gray-900 font-medium">{selectedAssessment.phone_whatsapp || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Address</p>
                      <p className="text-base text-gray-900 font-medium">{selectedAssessment.address || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Fund Name</p>
                      <p className="text-base text-gray-900 font-medium">{selectedAssessment.fund_name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Fund Website</p>
                      <p className="text-base text-gray-900 font-medium">{selectedAssessment.fund_website || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">LinkedIn Profile</p>
                      <p className="text-base text-gray-900 font-medium">{selectedAssessment.linkedin_profile || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-1">Other Social Media</p>
                      <p className="text-base text-gray-900 font-medium">{selectedAssessment.other_social_media || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Section 2: Stage of Fund */}
                <div className="bg-purple-50/50 p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Section 2: Stage of Fund
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        Which stage best represents your current fund? (Select all that apply)
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedAssessment.fund_stages || []).length > 0 ? (
                          (selectedAssessment.fund_stages || []).map((stage: string) => (
                            <Badge key={stage} className="bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-full capitalize text-sm px-4 py-1">
                              {stage}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No stages selected</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        If you fall between two stages, please explain
                      </p>
                      <p className="text-base text-gray-900 bg-white p-4 rounded-xl border border-gray-200">
                        {selectedAssessment.stage_explanation || 'No explanation provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section 3: Eligibility for LAUNCH+ */}
                <div className="bg-green-50/50 p-6 rounded-2xl">
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Section 3: Eligibility for LAUNCH+
                  </h3>
                  <div className="space-y-6">
                    {/* Services */}
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        Which LAUNCH+ services are you interested in?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedAssessment.interested_services || []).length > 0 ? (
                          (selectedAssessment.interested_services || []).map((service: string) => (
                            <Badge key={service} className="bg-green-100 text-green-700 hover:bg-green-200 rounded-full text-sm px-4 py-1">
                              {service}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No services selected</p>
                        )}
                      </div>
                    </div>

                    {/* Geographic Focus */}
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        What is the geographical focus of your fund?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(selectedAssessment.geographical_focus || []).length > 0 ? (
                          (selectedAssessment.geographical_focus || []).map((geo: string) => (
                            <Badge key={geo} className="bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-full text-sm px-4 py-1">
                              {geo}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No geographic focus specified</p>
                        )}
                      </div>
                    </div>

                    {/* Legal Status */}
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        What/where is your fund's current legal status?
                      </p>
                      <p className="text-base text-gray-900 bg-white p-4 rounded-xl border border-gray-200">
                        {selectedAssessment.legal_status || 'Not provided'}
                      </p>
                    </div>

                    {/* Operations vs Domicile */}
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        Where are your fund operations vs. legal domiciliation?
                      </p>
                      <p className="text-base text-gray-900 bg-white p-4 rounded-xl border border-gray-200">
                        {selectedAssessment.operations_vs_domicile || 'Not provided'}
                      </p>
                    </div>

                    {/* Capital Raised */}
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-3">
                        How much have you raised to date in your current fund? (USD Equivalent)
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Grants</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(selectedAssessment.capital_raised_grants || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">First Loss/Guarantee</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(selectedAssessment.capital_raised_first_loss || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Equity</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(selectedAssessment.capital_raised_equity || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Debt</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(selectedAssessment.capital_raised_debt || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Senior Capital</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(selectedAssessment.capital_raised_senior || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Other</p>
                          <p className="text-lg font-bold text-gray-900">
                            ${(selectedAssessment.capital_raised_other || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {selectedAssessment.capital_raised_other_description && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Other Capital Description</p>
                          <p className="text-sm text-gray-900 bg-white p-3 rounded-xl border border-gray-200">
                            {selectedAssessment.capital_raised_other_description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Investment Information */}
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-3">Investment Information</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Number of Investments</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {selectedAssessment.investments_count || 0}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Capital Committed (USD)</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${(selectedAssessment.capital_committed || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Capital Disbursed (USD)</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${(selectedAssessment.capital_disbursed || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Program Expectations */}
                    <div>
                      <p className="text-sm font-semibold text-gray-500 mb-2">
                        What are you looking to get out of the LAUNCH+ Program?
                      </p>
                      <p className="text-base text-gray-900 bg-white p-4 rounded-xl border border-gray-200 leading-relaxed">
                        {selectedAssessment.program_expectations || 'No expectations provided'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submission Info */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500">
                    Submitted on: <span className="font-semibold text-gray-700">{format(new Date(selectedAssessment.created_at), 'PPpp')}</span>
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SidebarLayout>
  );
};

export default AdminLaunchPlusAnalytics;
