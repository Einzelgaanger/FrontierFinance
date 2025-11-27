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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Download, Eye, Users, TrendingUp, DollarSign, Activity, RefreshCw } from 'lucide-react';
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0">
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
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {totalSubmissions}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">All time assessments</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Concept Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                    {stageDistribution.concept}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Early-stage funds</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Pilot Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    {stageDistribution.pilot}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Testing phase</p>
                </CardContent>
              </Card>

              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Implementation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {stageDistribution.implementation}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Active deployment</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content Card */}
        <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                All Assessment Responses
              </CardTitle>
            </div>
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
                    <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50">
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
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border-gray-200 rounded-3xl">
          <DialogHeader className="border-b border-gray-200 pb-4">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Assessment Details
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <div className="space-y-6 py-4">
              {/* Basic Information Section */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm">Full Name</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Email</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Fund Name</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.fund_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Phone/WhatsApp</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.phone_whatsapp || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Address</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.address || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fund Details Section */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Fund Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm">Fund Website</Label>
                    {selectedAssessment?.fund_website ? (
                      <a href={selectedAssessment.fund_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium mt-1 hover:underline block">
                        {selectedAssessment.fund_website}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium mt-1">N/A</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">LinkedIn Profile</Label>
                    {selectedAssessment?.linkedin_profile ? (
                      <a href={selectedAssessment.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium mt-1 hover:underline block">
                        {selectedAssessment.linkedin_profile}
                      </a>
                    ) : (
                      <p className="text-gray-900 font-medium mt-1">N/A</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Other Social Media</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.other_social_media || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Stage of Fund Section */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Stage of Fund</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-gray-600 text-sm">Fund Stages</Label>
                    <div className="mt-1">
                      {selectedAssessment?.fund_stages?.length ? (
                        selectedAssessment.fund_stages.map((stage: string, index: number) => (
                          <Badge key={index} className="bg-blue-200 text-blue-800 border-blue-300 mr-1 mb-1">
                            {stage}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-900 font-medium">N/A</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Stage Explanation</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.stage_explanation || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility for LAUNCH+ Section */}
              <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Eligibility for LAUNCH+</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-gray-600 text-sm">Interested Services</Label>
                    <div className="mt-1">
                      {selectedAssessment?.interested_services?.length ? (
                        selectedAssessment.interested_services.map((service: string, index: number) => (
                          <Badge key={index} className="bg-blue-200 text-blue-800 border-blue-300 mr-1 mb-1">
                            {service}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-900 font-medium">N/A</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Geographical Focus</Label>
                    <div className="mt-1">
                      {selectedAssessment?.geographical_focus?.length ? (
                        selectedAssessment.geographical_focus.map((focus: string, index: number) => (
                          <Badge key={index} className="bg-blue-200 text-blue-800 border-blue-300 mr-1 mb-1">
                            {focus}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-gray-900 font-medium">N/A</p>
                      )}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-600 text-sm">Capital Raised - Grants</Label>
                      <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_grants?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-sm">Capital Raised - Equity</Label>
                      <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_equity?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-sm">Capital Raised - Debt</Label>
                      <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_debt?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-sm">Capital Raised - First Loss</Label>
                      <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_first_loss?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-sm">Capital Raised - Senior</Label>
                      <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_senior?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-sm">Capital Raised - Other</Label>
                      <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_other?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-sm">Capital Committed</Label>
                      <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_committed?.toLocaleString() || '0'}</p>
                    </div>
                    <div>
                      <Label className="text-gray-600 text-sm">Capital Disbursed</Label>
                      <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_disbursed?.toLocaleString() || '0'}</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Investments Count</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.investments_count || '0'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Program Expectations</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.program_expectations || 'N/A'}</p>
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
