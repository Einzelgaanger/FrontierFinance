import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Search, Download, Users, TrendingUp, DollarSign, Calendar } from 'lucide-react';
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
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    fetchAssessments();
  }, [userRole, navigate]);

  const fetchAssessments = async () => {
    try {
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
    (sum, a) => sum + (a.capital_raised_grants || 0) + (a.capital_raised_equity || 0) + (a.capital_raised_debt || 0),
    0
  );
  const totalInvestments = assessments.reduce((sum, a) => sum + (a.investments_count || 0), 0);
  const avgInvestmentsPerFund = totalSubmissions > 0 ? (totalInvestments / totalSubmissions).toFixed(1) : 0;

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate('/admin')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-primary">LAUNCH+ Assessment Analytics</h1>
              <p className="text-muted-foreground">View and analyze all assessment submissions</p>
            </div>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold text-primary">{totalSubmissions}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Capital Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <DollarSign className="h-8 w-8 text-success" />
                <span className="text-3xl font-bold text-success">
                  ${(totalCapitalRaised / 1000000).toFixed(1)}M
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-accent" />
                <span className="text-3xl font-bold text-accent">{totalInvestments}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Investments/Fund</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-8 w-8 text-primary" />
                <span className="text-3xl font-bold text-primary">{avgInvestmentsPerFund}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="responses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="responses">All Responses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
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
              {filteredAssessments.map((assessment) => (
                <Card
                  key={assessment.id}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedAssessment(assessment)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{assessment.full_name}</CardTitle>
                        <CardDescription className="mt-1">
                          {assessment.fund_name} • {assessment.email}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {format(new Date(assessment.created_at), 'MMM dd, yyyy')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(assessment.fund_stages || []).map((stage: string) => (
                        <Badge key={stage} variant="secondary">{stage}</Badge>
                      ))}
                      {(assessment.geographical_focus || []).slice(0, 3).map((geo: string) => (
                        <Badge key={geo} className="bg-accent/10 text-accent">{geo}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Stage Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Fund Stage Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(stageDistribution).map(([stage, count]) => (
                      <div key={stage} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{stage}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-secondary rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(count / totalSubmissions) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold w-12 text-right">{count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Geographic Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(geoDistribution)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 8)
                      .map(([geo, count]) => (
                        <div key={geo} className="flex items-center justify-between">
                          <span className="text-sm">{geo}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-secondary rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full"
                                style={{ width: `${(count / totalSubmissions) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold w-12 text-right">{count}</span>
                          </div>
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
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assessment Details</DialogTitle>
            </DialogHeader>
            {selectedAssessment && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {selectedAssessment.full_name}</p>
                      <p><strong>Email:</strong> {selectedAssessment.email}</p>
                      <p><strong>Phone:</strong> {selectedAssessment.phone_whatsapp || 'N/A'}</p>
                      <p><strong>Fund:</strong> {selectedAssessment.fund_name}</p>
                      <p><strong>Website:</strong> {selectedAssessment.fund_website || 'N/A'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Fund Stages</h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedAssessment.fund_stages || []).map((stage: string) => (
                        <Badge key={stage}>{stage}</Badge>
                      ))}
                    </div>
                    <h3 className="font-semibold mt-4 mb-2">Geographic Focus</h3>
                    <div className="flex flex-wrap gap-2">
                      {(selectedAssessment.geographical_focus || []).map((geo: string) => (
                        <Badge key={geo} variant="secondary">{geo}</Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Capital Raised (USD)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Grants</p>
                      <p className="font-semibold">${(selectedAssessment.capital_raised_grants || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Equity</p>
                      <p className="font-semibold">${(selectedAssessment.capital_raised_equity || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Debt</p>
                      <p className="font-semibold">${(selectedAssessment.capital_raised_debt || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Program Expectations</h3>
                  <p className="text-sm bg-secondary/30 p-4 rounded-lg">
                    {selectedAssessment.program_expectations || 'No expectations provided'}
                  </p>
                </div>

                <div className="text-xs text-muted-foreground">
                  Submitted: {format(new Date(selectedAssessment.created_at), 'PPpp')}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminLaunchPlusAnalytics;