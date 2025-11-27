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

  const totalCapitalRaised = assessments.reduce((sum, a) => {
    return sum + (a.capital_raised_grants || 0) + (a.capital_raised_equity || 0) + 
           (a.capital_raised_debt || 0) + (a.capital_raised_first_loss || 0) + 
           (a.capital_raised_senior || 0) + (a.capital_raised_other || 0);
  }, 0);

  const totalInvestments = assessments.reduce((sum, a) => sum + (a.investments_count || 0), 0);
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
            <Card className="bg-white shadow-lg rounded-2xl border border-gray-200">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  Fund Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stageDistribution.concept}</div>
                    <div className="text-sm text-gray-600">Concept Stage</div>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <div className="text-3xl font-bold text-amber-600 mb-2">{stageDistribution.pilot}</div>
                    <div className="text-sm text-gray-600">Pilot Stage</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="text-3xl font-bold text-green-600 mb-2">{stageDistribution.implementation}</div>
                    <div className="text-sm text-gray-600">Implementation</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{stageDistribution.scale}</div>
                    <div className="text-sm text-gray-600">Scale Stage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border-gray-200 rounded-3xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-600" />
              Assessment Details
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <div className="space-y-6 py-4">
              {/* Basic Information Section */}
              <Card className="bg-blue-50 border-blue-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Full Name
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      Fund Name
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.fund_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Phone/WhatsApp
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.phone_whatsapp || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Address
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.address || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fund Details Section */}
              <Card className="bg-amber-50 border-amber-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Fund Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Fund Website
                    </Label>
                    {selectedAssessment?.fund_website ? (
                      <a href={selectedAssessment.fund_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium mt-1 hover:underline block">
                        {selectedAssessment.fund_website}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium mt-1">N/A</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <Linkedin className="w-3 h-3" />
                      LinkedIn Profile
                    </Label>
                    {selectedAssessment?.linkedin_profile ? (
                      <a href={selectedAssessment.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium mt-1 hover:underline block">
                        View Profile
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium mt-1">N/A</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      Other Social Media
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.other_social_media || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fund Stage Section */}
              <Card className="bg-green-50 border-green-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Fund Stage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      Selected Stages
                    </Label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {selectedAssessment?.fund_stages?.map((stage: string) => (
                        <Badge key={stage} className="bg-green-100 text-green-700 border-green-300">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Stage Explanation</Label>
                    <p className="text-gray-900 mt-1">{selectedAssessment?.stage_explanation || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility Section */}
              <Card className="bg-purple-50 border-purple-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Eligibility Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-gray-600 text-sm">Interested Services</Label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {selectedAssessment?.interested_services?.map((service: string) => (
                        <Badge key={service} className="bg-purple-100 text-purple-700 border-purple-300">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Geographical Focus</Label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {selectedAssessment?.geographical_focus?.map((geo: string) => (
                        <Badge key={geo} className="bg-purple-100 text-purple-700 border-purple-300">
                          {geo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Legal Status</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.legal_status || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Operations vs Domicile</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.operations_vs_domicile || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Capital Raised Section */}
              <Card className="bg-blue-50 border-blue-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                    <Coins className="w-5 h-5" />
                    Capital Raised
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Grants
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_grants?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      First Loss
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_first_loss?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Equity
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_equity?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Debt
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_debt?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Senior Capital
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_senior?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Other
                    </Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_other?.toLocaleString() || 0}</p>
                  </div>
                  {selectedAssessment?.capital_raised_other_description && (
                    <div className="col-span-2">
                      <Label className="text-gray-600 text-sm">Other Capital Description</Label>
                      <p className="text-gray-900 mt-1">{selectedAssessment.capital_raised_other_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Investments Section */}
              <Card className="bg-amber-50 border-amber-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Investment Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm">Number of Investments</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.investments_count || 0}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Capital Committed</Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_committed?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Capital Disbursed</Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_disbursed?.toLocaleString() || 0}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Program Expectations */}
              <Card className="bg-green-50 border-green-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Program Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-900">{selectedAssessment?.program_expectations || 'N/A'}</p>
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