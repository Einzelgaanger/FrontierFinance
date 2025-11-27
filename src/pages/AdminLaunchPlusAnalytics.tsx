import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Download, Eye, Users, TrendingUp, DollarSign, Activity, RefreshCw, User, Mail, Phone, MapPin, Briefcase, Globe, Linkedin, Share2, Target, Building2, Coins, TrendingDown, PieChart, BarChart3 } from 'lucide-react';
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
  capital_raised_first_loss: number;
  capital_raised_senior: number;
  capital_raised_other: number;
  capital_raised_other_description: string;
  investments_count: number;
  capital_committed: number;
  capital_disbursed: number;
  program_expectations: string;
  submission_status: string;
  phone_whatsapp?: string;
  address?: string;
  fund_website?: string;
  linkedin_profile?: string;
  other_social_media?: string;
  [key: string]: any;
}

const AdminLaunchPlusAnalytics = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);

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
      assessment.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.fund_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalSubmissions = assessments.length;
  const stageDistribution = {
    concept: assessments.filter(a => a.fund_stages?.includes('concept')).length,
    pilot: assessments.filter(a => a.fund_stages?.includes('pilot')).length,
    implementation: assessments.filter(a => a.fund_stages?.includes('implementation')).length,
    scale: assessments.filter(a => a.fund_stages?.includes('scale')).length,
  };

  // Capital breakdown by type
  const capitalByType = {
    grants: assessments.reduce((sum, a) => sum + (a.capital_raised_grants || 0), 0),
    equity: assessments.reduce((sum, a) => sum + (a.capital_raised_equity || 0), 0),
    debt: assessments.reduce((sum, a) => sum + (a.capital_raised_debt || 0), 0),
    firstLoss: assessments.reduce((sum, a) => sum + (a.capital_raised_first_loss || 0), 0),
    senior: assessments.reduce((sum, a) => sum + (a.capital_raised_senior || 0), 0),
    other: assessments.reduce((sum, a) => sum + (a.capital_raised_other || 0), 0),
  };

  const totalCapitalRaised = Object.values(capitalByType).reduce((sum, val) => sum + val, 0);

  // Service interests breakdown
  const serviceInterests = {
    investment: assessments.filter(a => a.interested_services?.includes('investment')).length,
    technical_assistance: assessments.filter(a => a.interested_services?.includes('technical_assistance')).length,
    networking: assessments.filter(a => a.interested_services?.includes('networking')).length,
    capacity_building: assessments.filter(a => a.interested_services?.includes('capacity_building')).length,
    other: assessments.filter(a => a.interested_services?.includes('other')).length,
  };

  // Geographic distribution
  const geographicFocus = {
    local: assessments.filter(a => a.geographical_focus?.includes('local')).length,
    regional: assessments.filter(a => a.geographical_focus?.includes('regional')).length,
    national: assessments.filter(a => a.geographical_focus?.includes('national')).length,
    international: assessments.filter(a => a.geographical_focus?.includes('international')).length,
  };

  const totalInvestments = assessments.reduce((sum, a) => sum + (a.investments_count || 0), 0);
  const totalCommitted = assessments.reduce((sum, a) => sum + (a.capital_committed || 0), 0);
  const totalDisbursed = assessments.reduce((sum, a) => sum + (a.capital_disbursed || 0), 0);
  const avgCapitalPerFund = assessments.length > 0 ? totalCapitalRaised / assessments.length : 0;

  const handleViewDetails = (assessment: Assessment) => {
    setSelectedAssessment(assessment);
  };

  const handleExportCSV = () => {
    const csvRows = [];
    const headers = Object.keys(assessments[0] || {}).join(',');
    csvRows.push(headers);

    for (const assessment of assessments) {
      const values = Object.values(assessment).map(value => {
        if (typeof value === 'string') {
          return `"${value.replace(/"/g, '""')}"`;
        }
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`;
        }
        return value;
      }).join(',');
      csvRows.push(values);
    }

    const csvData = csvRows.join('\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `launch_plus_assessments_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('CSV exported successfully');
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={fetchAssessments}
        variant="outline"
        size="sm"
        className="border-white/30 text-white hover:bg-white/20 bg-white/5"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Refresh
      </Button>
      <Button
        onClick={handleExportCSV}
        variant="outline"
        size="sm"
        className="border-white/30 text-white hover:bg-white/20 bg-white/5"
      >
        <Download className="w-4 h-4 mr-2" />
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

  return (
    <SidebarLayout headerActions={headerActions}>
      <div className="p-6 space-y-6">
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="submissions" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Submissions
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-white shadow-lg rounded-2xl border border-gray-200">
                      <CardHeader>
                        <Skeleton className="h-4 w-24" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-8 w-16" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <Card className="bg-white shadow-lg rounded-2xl border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        Total Submissions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {totalSubmissions}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">All time assessments</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg rounded-2xl border border-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-amber-600" />
                        Total Capital Raised
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-amber-600">
                        ${(totalCapitalRaised / 1000000).toFixed(1)}M
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Across all funds</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg rounded-2xl border border-green-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        Total Investments
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {totalInvestments}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Deals completed</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white shadow-lg rounded-2xl border border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <PieChart className="w-4 h-4 text-purple-600" />
                        Avg Capital/Fund
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        ${(avgCapitalPerFund / 1000000).toFixed(1)}M
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Per fund average</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Stage Distribution */}
            <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl border border-gray-200">
              <CardHeader className="border-b border-gray-200 bg-white/50 backdrop-blur">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Fund Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 hover:shadow-md transition-all">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stageDistribution.concept}</div>
                    <div className="text-sm text-gray-700 font-medium">Concept</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200 hover:shadow-md transition-all">
                    <div className="text-3xl font-bold text-amber-600 mb-2">{stageDistribution.pilot}</div>
                    <div className="text-sm text-gray-700 font-medium">Pilot</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 hover:shadow-md transition-all">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stageDistribution.implementation}</div>
                    <div className="text-sm text-gray-700 font-medium">Implementation</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200 hover:shadow-md transition-all">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stageDistribution.scale}</div>
                    <div className="text-sm text-gray-700 font-medium">Scale</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capital Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-white to-blue-50/30 shadow-lg rounded-2xl border border-gray-200">
                <CardHeader className="border-b border-gray-200 bg-white/50 backdrop-blur">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-blue-600" />
                    Capital Raised by Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {Object.entries(capitalByType).map(([type, amount]) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <span className="text-sm font-medium text-gray-700 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-lg font-bold text-blue-600">${(amount / 1000000).toFixed(2)}M</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-amber-50/30 shadow-lg rounded-2xl border border-gray-200">
                <CardHeader className="border-b border-gray-200 bg-white/50 backdrop-blur">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-amber-600" />
                    Service Interests
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {Object.entries(serviceInterests).map(([service, count]) => (
                    <div key={service} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                      <span className="text-sm font-medium text-gray-700 capitalize">{service.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full transition-all"
                            style={{ width: `${assessments.length > 0 ? (count / assessments.length) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-lg font-bold text-amber-600 w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Geographic & Investment Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-white to-green-50/30 shadow-lg rounded-2xl border border-gray-200">
                <CardHeader className="border-b border-gray-200 bg-white/50 backdrop-blur">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-600" />
                    Geographic Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(geographicFocus).map(([region, count]) => (
                      <div key={region} className="p-4 bg-white rounded-lg border border-gray-100 text-center hover:shadow-md transition-all">
                        <div className="text-2xl font-bold text-green-600 mb-1">{count}</div>
                        <div className="text-sm text-gray-600 capitalize">{region}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-white to-purple-50/30 shadow-lg rounded-2xl border border-gray-200">
                <CardHeader className="border-b border-gray-200 bg-white/50 backdrop-blur">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    Investment Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Capital Committed</span>
                    <span className="text-lg font-bold text-purple-600">${(totalCommitted / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Capital Disbursed</span>
                    <span className="text-lg font-bold text-purple-600">${(totalDisbursed / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">Deployment Rate</span>
                    <span className="text-lg font-bold text-purple-600">
                      {totalCommitted > 0 ? ((totalDisbursed / totalCommitted) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
            <Card className="bg-white shadow-lg rounded-2xl border border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-2xl font-bold text-gray-900">
                  All Assessment Responses
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6">
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search by name, email, or fund name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* Table */}
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="text-gray-700 font-semibold">Submission Date</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Fund</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Email</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Stage</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                          <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAssessments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                              No assessments found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAssessments.map((assessment) => (
                            <TableRow key={assessment.id} className="border-gray-100 hover:bg-blue-50/50 transition-colors">
                              <TableCell className="text-gray-600">
                                {format(new Date(assessment.created_at), 'MMM dd, yyyy')}
                              </TableCell>
                              <TableCell className="font-medium text-gray-900">{assessment.full_name || 'N/A'}</TableCell>
                              <TableCell className="text-gray-600">{assessment.fund_name || 'N/A'}</TableCell>
                              <TableCell className="text-gray-600">{assessment.email || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                  {assessment.fund_stages?.[0] || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                                  {assessment.submission_status || 'Submitted'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => handleViewDetails(assessment)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-white to-gray-50 border-gray-300 rounded-3xl shadow-2xl">
          <DialogHeader className="border-b border-gray-200 pb-4 bg-white/50 backdrop-blur">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              Assessment Details
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <div className="space-y-6 py-4">
              {/* Basic Information Section */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 rounded-2xl shadow-sm">
                <CardHeader className="bg-white/50 backdrop-blur border-b border-blue-200">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2 font-bold">
                    <div className="p-1.5 bg-blue-200 rounded-lg">
                      <User className="w-5 h-5 text-blue-700" />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Full Name
                    </Label>
                    <p className="text-gray-900 font-medium">{selectedAssessment?.full_name || 'N/A'}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      Email
                    </Label>
                    <p className="text-gray-900 font-medium">{selectedAssessment?.email || 'N/A'}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                      Fund Name
                    </Label>
                    <p className="text-gray-900 font-medium">{selectedAssessment?.fund_name || 'N/A'}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      Phone/WhatsApp
                    </Label>
                    <p className="text-gray-900 font-medium">{selectedAssessment?.phone_whatsapp || 'N/A'}</p>
                  </div>
                  <div className="col-span-2 bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      Address
                    </Label>
                    <p className="text-gray-900 font-medium">{selectedAssessment?.address || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fund Details Section */}
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 rounded-2xl shadow-sm">
                <CardHeader className="bg-white/50 backdrop-blur border-b border-amber-200">
                  <CardTitle className="text-lg text-amber-900 flex items-center gap-2 font-bold">
                    <div className="p-1.5 bg-amber-200 rounded-lg">
                      <Building2 className="w-5 h-5 text-amber-700" />
                    </div>
                    Fund Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <Globe className="w-3.5 h-3.5 text-amber-600" />
                      Fund Website
                    </Label>
                    {selectedAssessment?.fund_website ? (
                      <a href={selectedAssessment.fund_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                        {selectedAssessment.fund_website}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium">N/A</p>
                    )}
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <Linkedin className="w-3.5 h-3.5 text-amber-600" />
                      LinkedIn Profile
                    </Label>
                    {selectedAssessment?.linkedin_profile ? (
                      <a href={selectedAssessment.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                        View Profile
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium">N/A</p>
                    )}
                  </div>
                  <div className="col-span-2 bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <Share2 className="w-3.5 h-3.5 text-amber-600" />
                      Other Social Media
                    </Label>
                    <p className="text-gray-900 font-medium">{selectedAssessment?.other_social_media || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fund Stage Section */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 rounded-2xl shadow-sm">
                <CardHeader className="bg-white/50 backdrop-blur border-b border-green-200">
                  <CardTitle className="text-lg text-green-900 flex items-center gap-2 font-bold">
                    <div className="p-1.5 bg-green-200 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-700" />
                    </div>
                    Fund Stage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-2">
                      <Activity className="w-3.5 h-3.5 text-green-600" />
                      Selected Stages
                    </Label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAssessment?.fund_stages?.map((stage: string) => (
                        <Badge key={stage} className="bg-green-200 text-green-800 border-green-300 font-medium">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedAssessment?.stage_explanation && (
                    <div className="bg-white/70 p-3 rounded-lg">
                      <Label className="text-gray-600 text-xs font-semibold mb-1">Stage Explanation</Label>
                      <p className="text-gray-900 leading-relaxed">{selectedAssessment.stage_explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Eligibility Section */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200 rounded-2xl shadow-sm">
                <CardHeader className="bg-white/50 backdrop-blur border-b border-purple-200">
                  <CardTitle className="text-lg text-purple-900 flex items-center gap-2 font-bold">
                    <div className="p-1.5 bg-purple-200 rounded-lg">
                      <Target className="w-5 h-5 text-purple-700" />
                    </div>
                    Eligibility Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold mb-2 block">Interested Services</Label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAssessment?.interested_services?.map((service: string) => (
                        <Badge key={service} className="bg-purple-200 text-purple-800 border-purple-300 font-medium">
                          {service.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold mb-2 block">Geographical Focus</Label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAssessment?.geographical_focus?.map((geo: string) => (
                        <Badge key={geo} className="bg-purple-200 text-purple-800 border-purple-300 font-medium capitalize">
                          {geo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 p-3 rounded-lg">
                      <Label className="text-gray-600 text-xs font-semibold mb-1 block">Legal Status</Label>
                      <p className="text-gray-900 font-medium">{selectedAssessment?.legal_status || 'N/A'}</p>
                    </div>
                    <div className="bg-white/70 p-3 rounded-lg">
                      <Label className="text-gray-600 text-xs font-semibold mb-1 block">Operations vs Domicile</Label>
                      <p className="text-gray-900 font-medium">{selectedAssessment?.operations_vs_domicile || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capital Raised Section */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200 rounded-2xl shadow-sm">
                <CardHeader className="bg-white/50 backdrop-blur border-b border-blue-200">
                  <CardTitle className="text-lg text-blue-900 flex items-center gap-2 font-bold">
                    <div className="p-1.5 bg-blue-200 rounded-lg">
                      <Coins className="w-5 h-5 text-blue-700" />
                    </div>
                    Capital Raised
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-4">
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      Grants
                    </Label>
                    <p className="text-gray-900 font-bold text-lg">${selectedAssessment?.capital_raised_grants?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      First Loss
                    </Label>
                    <p className="text-gray-900 font-bold text-lg">${selectedAssessment?.capital_raised_first_loss?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      Equity
                    </Label>
                    <p className="text-gray-900 font-bold text-lg">${selectedAssessment?.capital_raised_equity?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      Debt
                    </Label>
                    <p className="text-gray-900 font-bold text-lg">${selectedAssessment?.capital_raised_debt?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      Senior Capital
                    </Label>
                    <p className="text-gray-900 font-bold text-lg">${selectedAssessment?.capital_raised_senior?.toLocaleString() || 0}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg">
                    <Label className="text-gray-600 text-xs font-semibold flex items-center gap-1.5 mb-1">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      Other
                    </Label>
                    <p className="text-gray-900 font-bold text-lg">${selectedAssessment?.capital_raised_other?.toLocaleString() || 0}</p>
                  </div>
                  {selectedAssessment?.capital_raised_other_description && (
                    <div className="col-span-2 bg-white/70 p-3 rounded-lg">
                      <Label className="text-gray-600 text-xs font-semibold mb-1 block">Other Capital Description</Label>
                      <p className="text-gray-900">{selectedAssessment.capital_raised_other_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Investments Section */}
              <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 rounded-2xl shadow-sm">
                <CardHeader className="bg-white/50 backdrop-blur border-b border-amber-200">
                  <CardTitle className="text-lg text-amber-900 flex items-center gap-2 font-bold">
                    <div className="p-1.5 bg-amber-200 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-amber-700" />
                    </div>
                    Investment Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <Label className="text-gray-600 text-xs font-semibold mb-2 block">Investments</Label>
                    <p className="text-gray-900 font-bold text-2xl">{selectedAssessment?.investments_count || 0}</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <Label className="text-gray-600 text-xs font-semibold mb-2 block">Committed</Label>
                    <p className="text-gray-900 font-bold text-xl">${(selectedAssessment?.capital_committed / 1000000 || 0).toFixed(2)}M</p>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg text-center">
                    <Label className="text-gray-600 text-xs font-semibold mb-2 block">Disbursed</Label>
                    <p className="text-gray-900 font-bold text-xl">${(selectedAssessment?.capital_disbursed / 1000000 || 0).toFixed(2)}M</p>
                  </div>
                </CardContent>
              </Card>

              {/* Program Expectations */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200 rounded-2xl shadow-sm">
                <CardHeader className="bg-white/50 backdrop-blur border-b border-green-200">
                  <CardTitle className="text-lg text-green-900 flex items-center gap-2 font-bold">
                    <div className="p-1.5 bg-green-200 rounded-lg">
                      <Target className="w-5 h-5 text-green-700" />
                    </div>
                    Program Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="bg-white/70 p-4 rounded-lg">
                    <p className="text-gray-900 leading-relaxed">{selectedAssessment?.program_expectations || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </SidebarLayout>
  );
};

export default AdminLaunchPlusAnalytics;