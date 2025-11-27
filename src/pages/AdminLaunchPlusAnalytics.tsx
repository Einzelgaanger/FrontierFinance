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
import { Search, Download, Eye, Users, TrendingUp, DollarSign, Activity, RefreshCw, User, Mail, Phone, MapPin, Briefcase, Globe, Linkedin, Share2, Target, Building2, Coins, PieChart, BarChart3, Filter, X } from 'lucide-react';
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
  const [selectedStageFilter, setSelectedStageFilter] = useState<string | null>(null);
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

  // Helper function to get stage badge colors
  const getStageBadgeColors = (stage: string) => {
    const stageLower = stage?.toLowerCase() || '';
    if (stageLower.includes('concept')) {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    } else if (stageLower.includes('pilot')) {
      return 'bg-amber-100 text-amber-700 border-amber-300';
    } else if (stageLower.includes('implementation')) {
      return 'bg-green-100 text-green-700 border-green-300';
    } else if (stageLower.includes('scale')) {
      return 'bg-purple-100 text-purple-700 border-purple-300';
    }
    return 'bg-slate-100 text-slate-700 border-slate-300';
  };

  const filteredAssessments = assessments.filter(
    (assessment) => {
      // Search filter
      const matchesSearch = 
        assessment.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.fund_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Stage filter
      const matchesStage = selectedStageFilter === null || 
        assessment.fund_stages?.some(s => s.toLowerCase() === selectedStageFilter.toLowerCase());
      
      return matchesSearch && matchesStage;
    }
  );

  const totalSubmissions = assessments.length;
  
  // Dynamically count fund stages (case-insensitive)
  const stageDistribution = {
    concept: assessments.filter(a => a.fund_stages?.some(s => s.toLowerCase() === 'concept')).length,
    pilot: assessments.filter(a => a.fund_stages?.some(s => s.toLowerCase() === 'pilot')).length,
    implementation: assessments.filter(a => a.fund_stages?.some(s => s.toLowerCase() === 'implementation')).length,
    scale: assessments.filter(a => a.fund_stages?.some(s => s.toLowerCase() === 'scale')).length,
  };

  const capitalByType = {
    grants: assessments.reduce((sum, a) => sum + (a.capital_raised_grants || 0), 0),
    equity: assessments.reduce((sum, a) => sum + (a.capital_raised_equity || 0), 0),
    debt: assessments.reduce((sum, a) => sum + (a.capital_raised_debt || 0), 0),
    firstLoss: assessments.reduce((sum, a) => sum + (a.capital_raised_first_loss || 0), 0),
    senior: assessments.reduce((sum, a) => sum + (a.capital_raised_senior || 0), 0),
    other: assessments.reduce((sum, a) => sum + (a.capital_raised_other || 0), 0),
  };

  const totalCapitalRaised = Object.values(capitalByType).reduce((sum, val) => sum + val, 0);
  
  // Dynamically count actual service interests from data
  const allServices = assessments.flatMap(a => a.interested_services || []);
  const uniqueServices = [...new Set(allServices)];
  const serviceInterests = uniqueServices.reduce((acc, service) => {
    acc[service] = assessments.filter(a => a.interested_services?.includes(service)).length;
    return acc;
  }, {} as Record<string, number>);

  // Dynamically count actual geographic regions from data
  const allRegions = assessments.flatMap(a => a.geographical_focus || []);
  const uniqueRegions = [...new Set(allRegions)];
  const geographicFocus = uniqueRegions.reduce((acc, region) => {
    acc[region] = assessments.filter(a => a.geographical_focus?.includes(region)).length;
    return acc;
  }, {} as Record<string, number>);

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
      <div className="min-h-screen bg-gradient-to-br from-[#f5f5dc] to-[#f0f0e6] p-6">
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 bg-white/50 border border-gray-200">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-white border border-slate-200 shadow-sm">
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
                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-300 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-blue-700 mb-1">Total Submissions</p>
                          <p className="text-xl font-semibold text-blue-800">{totalSubmissions}</p>
                        </div>
                        <div className="p-2 bg-blue-200 rounded-lg">
                          <Users className="w-5 h-5 text-blue-700 flex-shrink-0" />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-blue-200">
                        <span className="text-xs text-blue-600">All time assessments</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-300 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-green-700 mb-1">Total Capital Raised</p>
                          <p className="text-xl font-semibold text-green-800">${(totalCapitalRaised / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="p-2 bg-green-200 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-700 flex-shrink-0" />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-green-200">
                        <span className="text-xs text-green-600">Across all funds</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-300 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-purple-700 mb-1">Total Investments</p>
                          <p className="text-xl font-semibold text-purple-800">{totalInvestments}</p>
                        </div>
                        <div className="p-2 bg-purple-200 rounded-lg">
                          <TrendingUp className="w-5 h-5 text-purple-700 flex-shrink-0" />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-purple-200">
                        <span className="text-xs text-purple-600">Deals completed</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-amber-700 mb-1">Avg Capital/Fund</p>
                          <p className="text-xl font-semibold text-amber-800">${(avgCapitalPerFund / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="p-2 bg-amber-200 rounded-lg">
                          <PieChart className="w-5 h-5 text-amber-700 flex-shrink-0" />
                        </div>
                      </div>
                      <div className="pt-2 border-t border-amber-200">
                        <span className="text-xs text-amber-600">Per fund average</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Stage Distribution */}
            <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-md">
              <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-200 rounded">
                    <Activity className="w-5 h-5 text-blue-700" />
                  </div>
                  Fund Stage Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg border-2 border-blue-300 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-semibold text-blue-800 mb-1">{stageDistribution.concept}</div>
                    <div className="text-sm text-blue-700 font-medium">Concept</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg border-2 border-amber-300 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-semibold text-amber-800 mb-1">{stageDistribution.pilot}</div>
                    <div className="text-sm text-amber-700 font-medium">Pilot</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-2 border-green-300 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-semibold text-green-800 mb-1">{stageDistribution.implementation}</div>
                    <div className="text-sm text-green-700 font-medium">Implementation</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg border-2 border-purple-300 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-2xl font-semibold text-purple-800 mb-1">{stageDistribution.scale}</div>
                    <div className="text-sm text-purple-700 font-medium">Scale</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Capital Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-300 shadow-md">
                <CardHeader className="border-b border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-green-200 rounded">
                      <Coins className="w-5 h-5 text-green-700" />
                    </div>
                    Capital Raised by Type
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {Object.entries(capitalByType).map(([type, amount]) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-300 shadow-sm">
                      <span className="text-sm font-medium text-green-800 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-base font-semibold text-green-800">${(amount / 1000000).toFixed(2)}M</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 shadow-md">
                <CardHeader className="border-b border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-200 rounded">
                      <Target className="w-5 h-5 text-amber-700" />
                    </div>
                    Service Interests
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  {Object.entries(serviceInterests).map(([service, count]) => (
                    <div key={service} className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-lg border border-amber-300 shadow-sm">
                      <span className="text-sm font-medium text-amber-800 capitalize">{service.replace(/_/g, ' ')}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-600 rounded-full transition-all"
                            style={{ width: `${assessments.length > 0 ? (count / assessments.length) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-base font-semibold text-amber-800 w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Geographic & Investment Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-300 shadow-md">
                <CardHeader className="border-b border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-200 rounded">
                      <Globe className="w-5 h-5 text-purple-700" />
                    </div>
                    Geographic Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(geographicFocus).map(([region, count]) => (
                      <div key={region} className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg border-2 border-purple-300 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xl font-semibold text-purple-800 mb-1">{count}</div>
                        <div className="text-sm text-purple-700 capitalize font-medium">{region}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-300 shadow-md">
                <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-200 rounded">
                      <TrendingUp className="w-5 h-5 text-blue-700" />
                    </div>
                    Investment Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-300 shadow-sm">
                    <span className="text-sm font-medium text-blue-800">Capital Committed</span>
                    <span className="text-base font-semibold text-blue-800">${(totalCommitted / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-300 shadow-sm">
                    <span className="text-sm font-medium text-blue-800">Capital Disbursed</span>
                    <span className="text-base font-semibold text-blue-800">${(totalDisbursed / 1000000).toFixed(2)}M</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border border-blue-300 shadow-sm">
                    <span className="text-sm font-medium text-blue-800">Deployment Rate</span>
                    <span className="text-base font-semibold text-blue-800">
                      {totalCommitted > 0 ? ((totalDisbursed / totalCommitted) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions">
              <Card className="bg-gradient-to-br from-white to-blue-50 border border-blue-200 shadow-md">
                <CardHeader className="border-b border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-200 rounded">
                      <Users className="w-5 h-5 text-blue-700" />
                    </div>
                    All Assessment Responses
                  </CardTitle>
                </CardHeader>

              <CardContent className="p-6">
                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by name, email, or fund name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-md"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">Filter by Stage:</span>
                    <div className="flex flex-wrap gap-2">
                      {['concept', 'pilot', 'implementation', 'scale'].map((stage) => (
                        <Button
                          key={stage}
                          variant={selectedStageFilter === stage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedStageFilter(selectedStageFilter === stage ? null : stage)}
                          className={`${
                            stage === 'concept' ? selectedStageFilter === stage 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300' :
                            stage === 'pilot' ? selectedStageFilter === stage
                              ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300' :
                            stage === 'implementation' ? selectedStageFilter === stage
                              ? 'bg-green-600 hover:bg-green-700 text-white border-green-600'
                              : 'bg-green-50 hover:bg-green-100 text-green-700 border-green-300' :
                            selectedStageFilter === stage
                              ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600'
                              : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300'
                          } transition-colors`}
                        >
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </Button>
                      ))}
                      {selectedStageFilter && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStageFilter(null)}
                          className="h-8 px-2 text-slate-600 hover:text-slate-900"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Clear
                        </Button>
                      )}
                    </div>
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
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                          <TableHead className="text-slate-700 font-semibold">Submission Date</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Name</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Fund</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Email</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Stage</TableHead>
                          <TableHead className="text-slate-700 font-semibold">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAssessments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                              No assessments found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredAssessments.map((assessment) => (
                            <TableRow key={assessment.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                              <TableCell className="text-slate-600">
                                {format(new Date(assessment.created_at), 'MMM dd, yyyy')}
                              </TableCell>
                              <TableCell className="font-medium text-slate-900">{assessment.full_name || 'N/A'}</TableCell>
                              <TableCell className="text-slate-600">{assessment.fund_name || 'N/A'}</TableCell>
                              <TableCell className="text-slate-600">{assessment.email || 'N/A'}</TableCell>
                              <TableCell>
                                <Badge className={getStageBadgeColors(assessment.fund_stages?.[0] || '')}>
                                  {assessment.fund_stages?.[0] || 'N/A'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button
                                  onClick={() => handleViewDetails(assessment)}
                                  size="sm"
                                  variant="ghost"
                                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md"
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border-slate-300 rounded-lg shadow-xl">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <DialogTitle className="text-xl font-semibold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded">
                <Eye className="w-5 h-5 text-slate-600" />
              </div>
              Assessment Details
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <div className="space-y-4 py-4">
              {/* Basic Information Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="border-b border-blue-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-200 rounded">
                      <User className="w-4 h-4 text-blue-700" />
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Full Name</Label>
                    <p className="text-sm font-medium text-slate-900">{selectedAssessment?.full_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Email</Label>
                    <p className="text-sm font-medium text-slate-900">{selectedAssessment?.email || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Fund Name</Label>
                    <p className="text-sm font-medium text-slate-900">{selectedAssessment?.fund_name || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Phone/WhatsApp</Label>
                    <p className="text-sm font-medium text-slate-900">{selectedAssessment?.phone_whatsapp || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-slate-600 mb-1">Address</Label>
                    <p className="text-sm font-medium text-slate-900">{selectedAssessment?.address || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fund Details Section */}
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="border-b border-amber-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-200 rounded">
                      <Building2 className="w-4 h-4 text-amber-700" />
                    </div>
                    Fund Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Fund Website</Label>
                    {selectedAssessment?.fund_website ? (
                      <a href={selectedAssessment.fund_website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-medium hover:underline">
                        {selectedAssessment.fund_website}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-900">N/A</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">LinkedIn Profile</Label>
                    {selectedAssessment?.linkedin_profile ? (
                      <a href={selectedAssessment.linkedin_profile} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 font-medium hover:underline">
                        View Profile
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-900">N/A</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs font-medium text-slate-600 mb-1">Other Social Media</Label>
                    <p className="text-sm font-medium text-slate-900">{selectedAssessment?.other_social_media || 'N/A'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Fund Stage Section */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="border-b border-green-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-green-200 rounded">
                      <TrendingUp className="w-4 h-4 text-green-700" />
                    </div>
                    Fund Stage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-2 block">Selected Stages</Label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAssessment?.fund_stages?.map((stage: string) => (
                        <Badge key={stage} className="bg-green-200 text-green-700 border-green-300">
                          {stage}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {selectedAssessment?.stage_explanation && (
                    <div>
                      <Label className="text-xs font-medium text-slate-600 mb-1 block">Stage Explanation</Label>
                      <p className="text-sm text-slate-900 leading-relaxed">{selectedAssessment.stage_explanation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Eligibility Section */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader className="border-b border-purple-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-purple-200 rounded">
                      <Target className="w-4 h-4 text-purple-700" />
                    </div>
                    Eligibility Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-2 block">Interested Services</Label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAssessment?.interested_services?.map((service: string) => (
                        <Badge key={service} className="bg-purple-200 text-purple-700 border-purple-300">
                          {service.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-2 block">Geographical Focus</Label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedAssessment?.geographical_focus?.map((geo: string) => (
                        <Badge key={geo} className="bg-purple-200 text-purple-700 border-purple-300 capitalize">
                          {geo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs font-medium text-slate-600 mb-1 block">Legal Status</Label>
                      <p className="text-sm font-medium text-slate-900">{selectedAssessment?.legal_status || 'N/A'}</p>
                    </div>
                    <div>
                      <Label className="text-xs font-medium text-slate-600 mb-1 block">Operations vs Domicile</Label>
                      <p className="text-sm font-medium text-slate-900">{selectedAssessment?.operations_vs_domicile || 'N/A'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Capital Raised Section */}
              <Card className="bg-green-50 border-green-200">
                <CardHeader className="border-b border-green-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-green-200 rounded">
                      <Coins className="w-4 h-4 text-green-700" />
                    </div>
                    Capital Raised
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Grants</Label>
                    <p className="text-sm font-semibold text-green-700">${selectedAssessment?.capital_raised_grants?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">First Loss</Label>
                    <p className="text-sm font-semibold text-green-700">${selectedAssessment?.capital_raised_first_loss?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Equity</Label>
                    <p className="text-sm font-semibold text-green-700">${selectedAssessment?.capital_raised_equity?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Debt</Label>
                    <p className="text-sm font-semibold text-green-700">${selectedAssessment?.capital_raised_debt?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Senior Capital</Label>
                    <p className="text-sm font-semibold text-green-700">${selectedAssessment?.capital_raised_senior?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-slate-600 mb-1">Other</Label>
                    <p className="text-sm font-semibold text-green-700">${selectedAssessment?.capital_raised_other?.toLocaleString() || 0}</p>
                  </div>
                  {selectedAssessment?.capital_raised_other_description && (
                    <div className="col-span-2">
                      <Label className="text-xs font-medium text-slate-600 mb-1 block">Other Capital Description</Label>
                      <p className="text-sm text-slate-900">{selectedAssessment.capital_raised_other_description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Investments Section */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader className="border-b border-blue-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-200 rounded">
                      <Activity className="w-4 h-4 text-blue-700" />
                    </div>
                    Investment Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <Label className="text-xs font-medium text-slate-600 mb-1 block">Investments</Label>
                    <p className="text-lg font-semibold text-blue-700">{selectedAssessment?.investments_count || 0}</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs font-medium text-slate-600 mb-1 block">Committed</Label>
                    <p className="text-lg font-semibold text-blue-700">${(selectedAssessment?.capital_committed / 1000000 || 0).toFixed(2)}M</p>
                  </div>
                  <div className="text-center">
                    <Label className="text-xs font-medium text-slate-600 mb-1 block">Disbursed</Label>
                    <p className="text-lg font-semibold text-blue-700">${(selectedAssessment?.capital_disbursed / 1000000 || 0).toFixed(2)}M</p>
                  </div>
                </CardContent>
              </Card>

              {/* Program Expectations */}
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader className="border-b border-amber-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-200 rounded">
                      <Target className="w-4 h-4 text-amber-700" />
                    </div>
                    Program Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-slate-900 leading-relaxed">{selectedAssessment?.program_expectations || 'N/A'}</p>
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
