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
import { Search, Download, Eye, Users, TrendingUp, DollarSign, Activity, ArrowLeft } from 'lucide-react';
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
  submission_status: string;
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
      assessment.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assessment.fund_name.toLowerCase().includes(searchTerm.toLowerCase())
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
        return value;
      }).join(',');
      csvRows.push(values);
    }

    const csvData = csvRows.join('\\n');
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'launch_plus_assessments.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('CSV exported successfully');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="/Launch+2.jpg" 
          alt="Launch+ Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-amber-600 bg-clip-text text-transparent mb-2">
              LAUNCH+ Assessment Analytics
            </h1>
            <p className="text-gray-700">Comprehensive overview of all assessment submissions</p>
          </div>
          <Button
            onClick={() => navigate('/admin')}
            variant="outline"
            className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-700">{totalSubmissions}</div>
              <p className="text-xs text-gray-500 mt-1">All time assessments</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Concept Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stageDistribution.concept}</div>
              <p className="text-xs text-gray-500 mt-1">Early-stage funds</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-amber-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Pilot Stage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600">{stageDistribution.pilot}</div>
              <p className="text-xs text-gray-500 mt-1">Testing phase</p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stageDistribution.implementation}</div>
              <p className="text-xs text-gray-500 mt-1">Active deployment</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="bg-white/95 backdrop-blur-sm border-blue-200 shadow-xl">
          <CardHeader className="border-b border-blue-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-blue-800">All Assessment Responses</CardTitle>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
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
                  className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-blue-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50 hover:bg-blue-50">
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
                  {filteredAssessments.map((assessment) => (
                    <TableRow key={assessment.id} className="border-blue-100 hover:bg-blue-50/50 transition-colors">
                      <TableCell className="text-gray-600">
                        {new Date(assessment.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">{assessment.full_name}</TableCell>
                      <TableCell className="text-gray-600">{assessment.fund_name}</TableCell>
                      <TableCell className="text-gray-600">{assessment.email}</TableCell>
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border-blue-200">
          <DialogHeader className="border-b border-blue-100 pb-4">
            <DialogTitle className="text-2xl font-bold text-blue-800">
              Assessment Details
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <div className="space-y-6 py-4">
              {/* Basic Information Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm">Full Name</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.full_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Email</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Fund Name</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.fund_name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Phone/WhatsApp</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.phone_whatsapp || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fund Details Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Fund Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 text-sm">Fund Website</Label>
                    <a href={selectedAssessment?.fund_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium mt-1 hover:underline">{selectedAssessment?.fund_website || 'N/A'}</a>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">LinkedIn Profile</Label>
                    <a href={selectedAssessment?.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium mt-1 hover:underline">{selectedAssessment?.linkedin_profile || 'N/A'}</a>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Address</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.address || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Other Social Media</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.other_social_media || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Stage of Fund Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Stage of Fund</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-gray-600 text-sm">Fund Stages</Label>
                    {selectedAssessment?.fund_stages?.map((stage: string, index: number) => (
                      <Badge key={index} className="bg-blue-200 text-blue-800 border-blue-300 mr-1">{stage}</Badge>
                    )) || <p className="text-gray-900 font-medium mt-1">N/A</p>}
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Stage Explanation</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.stage_explanation || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Eligibility for LAUNCH+ Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">Eligibility for LAUNCH+</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-gray-600 text-sm">Interested Services</Label>
                    {selectedAssessment?.interested_services?.map((service: string, index: number) => (
                      <Badge key={index} className="bg-blue-200 text-blue-800 border-blue-300 mr-1">{service}</Badge>
                    )) || <p className="text-gray-900 font-medium mt-1">N/A</p>}
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Geographical Focus</Label>
                    {selectedAssessment?.geographical_focus?.map((focus: string, index: number) => (
                      <Badge key={index} className="bg-blue-200 text-blue-800 border-blue-300 mr-1">{focus}</Badge>
                    )) || <p className="text-gray-900 font-medium mt-1">N/A</p>}
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Legal Status</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.legal_status || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Operations vs Domicile</Label>
                    <p className="text-gray-900 font-medium mt-1">{selectedAssessment?.operations_vs_domicile || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Capital Raised Grants</Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_grants || '0'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Capital Raised Equity</Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_equity || '0'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-600 text-sm">Capital Raised Debt</Label>
                    <p className="text-gray-900 font-medium mt-1">${selectedAssessment?.capital_raised_debt || '0'}</p>
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
    </div>
  );
};

export default AdminLaunchPlusAnalytics;
