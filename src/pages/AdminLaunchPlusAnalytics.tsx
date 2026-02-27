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
      <div className="min-h-screen bg-slate-100 font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 min-w-0 overflow-x-hidden">
          {/* Page header */}
          <div className="mb-10">
            <span className="section-label text-gold-600">Launch+</span>
            <h1 className="text-2xl sm:text-3xl font-display font-normal text-navy-900 mt-1 tracking-tight">
              Launch+ Analytics
            </h1>
            <div className="w-14 h-0.5 bg-gold-500/60 mt-3 rounded-full" />
            <p className="text-sm text-slate-600 mt-3">View and analyze LAUNCH+ assessment submissions</p>
          </div>

          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8 bg-white border border-slate-200 shadow-sm rounded-2xl p-1.5 h-12">
              <TabsTrigger value="analytics" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-navy-900 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 font-medium transition-all">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="submissions" className="flex items-center gap-2 rounded-xl data-[state=active]:bg-navy-900 data-[state=active]:text-white data-[state=active]:shadow-md text-slate-600 font-medium transition-all">
                <Users className="w-4 h-4" />
                Submissions
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-8 mt-0">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-white border border-slate-200 shadow-sm rounded-2xl">
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
                  <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Submissions</p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">{totalSubmissions}</p>
                          <p className="text-xs text-slate-500 mt-2">All time assessments</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-indigo-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Capital Raised</p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">${(totalCapitalRaised / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-slate-500 mt-2">Across all funds</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                          <DollarSign className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Investments</p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">{totalInvestments}</p>
                          <p className="text-xs text-slate-500 mt-2">Deals completed</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-5 h-5 text-violet-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Avg Capital/Fund</p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">${(avgCapitalPerFund / 1000000).toFixed(1)}M</p>
                          <p className="text-xs text-slate-500 mt-2">Per fund average</p>
                        </div>
                        <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <PieChart className="w-5 h-5 text-amber-600" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Stage Distribution */}
            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-500" />
                Fund Stage Distribution
              </h2>
              <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-5 rounded-xl border border-slate-200 bg-amber-50 hover:bg-indigo-100 hover:border-indigo-200 transition-colors">
                      <div className="text-2xl font-bold text-slate-900 mb-1">{stageDistribution.concept}</div>
                      <div className="text-sm font-medium text-slate-600">Concept</div>
                    </div>
                    <div className="text-center p-5 rounded-xl border border-slate-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-200 transition-colors">
                      <div className="text-2xl font-bold text-slate-900 mb-1">{stageDistribution.pilot}</div>
                      <div className="text-sm font-medium text-slate-600">Pilot</div>
                    </div>
                    <div className="text-center p-5 rounded-xl border border-slate-200 bg-amber-50 hover:bg-emerald-100 hover:border-emerald-200 transition-colors">
                      <div className="text-2xl font-bold text-slate-900 mb-1">{stageDistribution.implementation}</div>
                      <div className="text-sm font-medium text-slate-600">Implementation</div>
                    </div>
                    <div className="text-center p-5 rounded-xl border border-slate-200 bg-amber-50 hover:bg-violet-100 hover:border-violet-200 transition-colors">
                      <div className="text-2xl font-bold text-slate-900 mb-1">{stageDistribution.scale}</div>
                      <div className="text-sm font-medium text-slate-600">Scale</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Capital Breakdown & Service Interests */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  Capital Raised by Type
                </h2>
                <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden">
                  <CardContent className="p-6 space-y-3">
                    {Object.entries(capitalByType).map(([type, amount]) => (
                      <div key={type} className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-emerald-100 hover:border-emerald-100 transition-colors">
                        <span className="text-sm font-medium text-slate-700 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-sm font-semibold text-slate-900">${(amount / 1000000).toFixed(2)}M</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-amber-600" />
                  Service Interests
                </h2>
                <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden">
                  <CardContent className="p-6 space-y-3">
                    {Object.entries(serviceInterests).map(([service, count]) => (
                      <div key={service} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-amber-100 hover:border-amber-100 transition-colors">
                        <span className="text-sm font-medium text-slate-700 capitalize flex-1 min-w-0 truncate">{service.replace(/_/g, ' ')}</span>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-500 rounded-full transition-all"
                              style={{ width: `${assessments.length > 0 ? (count / assessments.length) * 100 : 0}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-900 w-6 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Geographic Focus & Investment Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-violet-600" />
                  Geographic Focus
                </h2>
                <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(geographicFocus).map(([region, count]) => (
                        <div key={region} className="p-4 rounded-xl border border-slate-200 bg-amber-50 hover:bg-violet-100 hover:border-violet-100 text-center transition-colors">
                          <div className="text-xl font-bold text-slate-900 mb-1">{count}</div>
                          <div className="text-sm text-slate-600 capitalize font-medium">{region}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  Investment Activity
                </h2>
                <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-indigo-100 hover:border-indigo-100 transition-colors">
                      <span className="text-sm font-medium text-slate-700">Capital Committed</span>
                      <span className="text-sm font-semibold text-slate-900">${(totalCommitted / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-indigo-100 hover:border-indigo-100 transition-colors">
                      <span className="text-sm font-medium text-slate-700">Capital Disbursed</span>
                      <span className="text-sm font-semibold text-slate-900">${(totalDisbursed / 1000000).toFixed(2)}M</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-100 border border-slate-200 hover:bg-indigo-100 hover:border-indigo-100 transition-colors">
                      <span className="text-sm font-medium text-slate-700">Deployment Rate</span>
                      <span className="text-sm font-semibold text-slate-900">
                        {totalCommitted > 0 ? ((totalDisbursed / totalCommitted) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="mt-0">
            <div>
              <h2 className="text-base font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                All Assessment Responses
              </h2>
              <Card className="bg-white border border-slate-200 shadow-sm rounded-2xl rounded-xl overflow-hidden">
                <CardContent className="p-6">
                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search by name, email, or fund name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
                  <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-100 hover:bg-slate-100 border-b border-slate-200">
                          <TableHead className="text-slate-600 font-semibold text-xs uppercase tracking-wider">Submission Date</TableHead>
                          <TableHead className="text-slate-600 font-semibold text-xs uppercase tracking-wider">Name</TableHead>
                          <TableHead className="text-slate-600 font-semibold text-xs uppercase tracking-wider">Fund</TableHead>
                          <TableHead className="text-slate-600 font-semibold text-xs uppercase tracking-wider">Email</TableHead>
                          <TableHead className="text-slate-600 font-semibold text-xs uppercase tracking-wider">Stage</TableHead>
                          <TableHead className="text-slate-600 font-semibold text-xs uppercase tracking-wider">Actions</TableHead>
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
                            <TableRow key={assessment.id} className="border-slate-200 hover:bg-slate-100 transition-colors">
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
            </div>
          </TabsContent>
        </Tabs>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white border border-slate-200 rounded-xl shadow-xl">
          <DialogHeader className="border-b border-slate-200 pb-4">
            <DialogTitle className="text-xl font-semibold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Eye className="w-5 h-5 text-indigo-600" />
              </div>
              Assessment Details
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-8rem)] pr-4">
            <div className="space-y-4 py-4">
              {/* Basic Information Section */}
              <Card className="bg-slate-100 border border-slate-200 rounded-xl">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <User className="w-4 h-4 text-indigo-600" />
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
              <Card className="bg-slate-100 border border-slate-200 rounded-xl">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Building2 className="w-4 h-4 text-amber-600" />
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
              <Card className="bg-slate-100 border border-slate-200 rounded-xl">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
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
              <Card className="bg-slate-100 border border-slate-200 rounded-xl">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-violet-100 rounded-lg">
                      <Target className="w-4 h-4 text-violet-600" />
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
              <Card className="bg-slate-100 border border-slate-200 rounded-xl">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 rounded-lg">
                      <Coins className="w-4 h-4 text-emerald-600" />
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
              <Card className="bg-slate-100 border border-slate-200 rounded-xl">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 rounded-lg">
                      <Activity className="w-4 h-4 text-indigo-600" />
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
              <Card className="bg-slate-100 border border-slate-200 rounded-xl">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 rounded-lg">
                      <Target className="w-4 h-4 text-amber-600" />
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
