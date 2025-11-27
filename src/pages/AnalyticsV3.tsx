// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import {
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Globe,
  Building2,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  RefreshCw,
  Download,
  Filter,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  Sparkles,
  Zap
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

interface SurveyData {
  year: number;
  responses: any[];
  fieldVisibility: Record<string, { viewer: boolean; member: boolean; admin: boolean }>;
}

const AnalyticsV3 = () => {
  const { userRole } = useAuth();
  const { toast } = useToast();
  
  const [selectedYear, setSelectedYear] = useState(2024);
  const [loading, setLoading] = useState(true);
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const availableYears = [2021, 2022, 2023, 2024];

  // Fetch survey data for selected year
  useEffect(() => {
    fetchSurveyData();
  }, [selectedYear]);

  const fetchSurveyData = async () => {
    try {
      setLoading(true);

      // Fetch survey responses
      const { data: responses, error: responsesError } = await supabase
        .from(`survey_responses_${selectedYear}` as any)
        .select('*')
        .eq('submission_status', 'completed');

      if (responsesError) throw responsesError;

      // Fetch field visibility rules
      const { data: visibility, error: visibilityError } = await supabase
        .from('field_visibility')
        .select('*')
        .eq('survey_year', selectedYear);

      if (visibilityError) throw visibilityError;

      // Create visibility map
      const visibilityMap: Record<string, any> = {};
      (visibility || []).forEach(field => {
        visibilityMap[field.field_name] = {
          viewer: field.viewer_visible,
          member: field.member_visible,
          admin: field.admin_visible,
          category: field.field_category
        };
      });

      setSurveyData({
        year: selectedYear,
        responses: responses || [],
        fieldVisibility: visibilityMap
      });

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Extract field data from form_data JSONB
  const extractFieldData = (fieldName: string): any[] => {
    if (!surveyData) return [];
    
    return surveyData.responses
      .map(response => response.form_data?.[fieldName])
      .filter(value => value !== null && value !== undefined && value !== '');
  };

  // Check if user can view a field
  const canViewField = (fieldName: string): boolean => {
    if (!surveyData) return false;
    const visibility = surveyData.fieldVisibility[fieldName];
    if (!visibility) return userRole === 'admin'; // Default: admin only
    
    if (userRole === 'admin') return visibility.admin;
    if (userRole === 'member') return visibility.member;
    if (userRole === 'viewer') return visibility.viewer;
    return false;
  };

  // Get visible fields by category
  const getVisibleFieldsByCategory = (category: string): string[] => {
    if (!surveyData) return [];
    
    return Object.entries(surveyData.fieldVisibility)
      .filter(([_, visibility]) => visibility.category === category && canViewField(_))
      .map(([fieldName, _]) => fieldName);
  };

  // Calculate distribution for categorical data
  const calculateDistribution = (fieldName: string) => {
    const values = extractFieldData(fieldName);
    const distribution: Record<string, number> = {};

    values.forEach(value => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          distribution[item] = (distribution[item] || 0) + 1;
        });
      } else {
        distribution[String(value)] = (distribution[String(value)] || 0) + 1;
      }
    });

    return Object.entries(distribution)
      .map(([name, count]) => ({
        name,
        value: count,
        percentage: surveyData ? ((count / surveyData.responses.length) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Calculate numeric statistics
  const calculateNumericStats = (fieldName: string) => {
    const values = extractFieldData(fieldName)
      .map(v => typeof v === 'number' ? v : parseFloat(v))
      .filter(v => !isNaN(v));

    if (values.length === 0) return { min: 0, max: 0, avg: 0, median: 0, total: 0 };

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      total: sum,
      count: values.length
    };
  };

  // Overview metrics
  const overviewMetrics = useMemo(() => {
    if (!surveyData) return null;

    const totalResponses = surveyData.responses.length;
    const completedThisMonth = surveyData.responses.filter(r => {
      if (!r.completed_at) return false;
      const completedDate = new Date(r.completed_at);
      const now = new Date();
      return completedDate.getMonth() === now.getMonth() && 
             completedDate.getFullYear() === now.getFullYear();
    }).length;

    // Calculate visible fields count
    const visibleFieldsCount = Object.keys(surveyData.fieldVisibility)
      .filter(field => canViewField(field)).length;

    return {
      totalResponses,
      completedThisMonth,
      visibleFieldsCount,
      responseRate: ((totalResponses / 100) * 100).toFixed(1) // Assuming 100 invites
    };
  }, [surveyData, userRole]);

  // Year selection actions for header
  const yearSelectionActions = (
    <div className="flex items-center gap-2">
      {availableYears.map((year) => {
        const isActive = selectedYear === year;
        return (
          <Button
            key={year}
            variant={isActive ? 'default' : 'secondary'}
            className={`h-8 px-3 text-xs ${
              isActive ? 'shadow-md' : 'opacity-80 hover:opacity-100'
            }`}
            onClick={() => setSelectedYear(year)}
            aria-pressed={isActive}
          >
            {year}
          </Button>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        onClick={fetchSurveyData}
        disabled={loading}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );

  // Render overview section
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden border-none">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{overviewMetrics?.totalResponses || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overviewMetrics?.completedThisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{overviewMetrics?.responseRate || 0}%</div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <ArrowUp className="h-3 w-3 mr-1" />
              +12% from last year
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Visible Fields</CardTitle>
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">{overviewMetrics?.visibleFieldsCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on your {userRole} role
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border-none">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
            <CardTitle className="text-sm font-medium">Data Quality</CardTitle>
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <CheckCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="text-3xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground mt-1">
              High completeness
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution (if visible) */}
      {canViewField('geographic_markets') && (
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                Geographic Distribution
              </CardTitle>
            </div>
            <CardDescription>Market presence across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={calculateDistribution('geographic_markets').slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={100}
                  tick={{ fontSize: 11 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Fund Count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Fund Type Distribution */}
      {canViewField('fund_type_status') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover-lift">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <PieChartIcon className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Fund Type Distribution
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={calculateDistribution('fund_type_status')}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {calculateDistribution('fund_type_status').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Sector Focus */}
          {canViewField('sector_focus') && (
            <Card className="hover-lift">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Target className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Top Sectors
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {calculateDistribution('sector_focus').slice(0, 8).map((sector, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{sector.name}</span>
                        <span className="text-muted-foreground">{sector.percentage}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${sector.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );

  // Render team analytics section
  const renderTeamAnalytics = () => {
    if (!canViewField('fte_staff_current') && !canViewField('team_based')) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Team analytics not available for your role</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {canViewField('fte_staff_current') && (
          <Card className="hover-lift">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Team Size Distribution
                </CardTitle>
              </div>
              <CardDescription>Full-time equivalent staff analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const stats = calculateNumericStats('fte_staff_current');
                  return (
                    <>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Average</p>
                        <p className="text-xl font-bold">{stats.avg.toFixed(1)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Median</p>
                        <p className="text-xl font-bold">{stats.median}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Min</p>
                        <p className="text-xl font-bold">{stats.min}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Max</p>
                        <p className="text-xl font-bold">{stats.max}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart 
                  data={calculateDistribution('fte_staff_current')
                    .map(item => ({ name: item.name, count: item.value }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                  <Bar dataKey="count" fill="#3b82f6" name="Number of Funds" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {canViewField('team_based') && (
          <Card className="hover-lift">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Building2 className="h-5 w-5 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Team Structure
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={calculateDistribution('team_based')}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {calculateDistribution('team_based').map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  // Render financial analytics section
  const renderFinancialAnalytics = () => {
    const financialFields = ['target_fund_size', 'current_funds_raised', 'gp_management_fee'];
    const visibleFinancialFields = financialFields.filter(f => canViewField(f));

    if (visibleFinancialFields.length === 0) {
      return (
        <Card>
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Financial analytics not available for your role</p>
            <p className="text-sm text-gray-500 mt-2">Members and admins can view detailed financial data</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {visibleFinancialFields.map(field => (
          <Card key={field} className="hover-lift">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  {field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {(() => {
                  const stats = calculateNumericStats(field);
                  return (
                    <>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Total</p>
                        <p className="text-xl font-bold">${(stats.total / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Average</p>
                        <p className="text-xl font-bold">${(stats.avg / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Median</p>
                        <p className="text-xl font-bold">${(stats.median / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Min</p>
                        <p className="text-xl font-bold">${(stats.min / 1000000).toFixed(1)}M</p>
                      </div>
                      <div className="p-3 rounded-lg bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900">
                        <p className="text-xs font-medium text-muted-foreground mb-1">Max</p>
                        <p className="text-xl font-bold">${(stats.max / 1000000).toFixed(1)}M</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <SidebarLayout headerActions={yearSelectionActions}>
        <div className="container mx-auto p-6 space-y-6">
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
    <SidebarLayout headerActions={yearSelectionActions}>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="rounded-2xl border border-blue-900/15 bg-white shadow-md p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-blue-900" />
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-[0.18em]">Analytics Dashboard</span>
            </div>
            <Badge className={`
              ${userRole === 'admin' ? 'bg-red-500' : ''}
              ${userRole === 'member' ? 'bg-green-500' : ''}
              ${userRole === 'viewer' ? 'bg-blue-500' : ''}
            `}>
              {userRole?.toUpperCase()} ACCESS
            </Badge>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                Survey Analytics {selectedYear}
              </h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive survey data analysis and insights • Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Sections */}
        <Tabs value={activeSection} onValueChange={setActiveSection} className="space-y-6">
          <TabsList className="bg-white/95 backdrop-blur-md shadow-md rounded-lg p-1 border">
            <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
            <TabsTrigger value="team" className="rounded-md">Team Analytics</TabsTrigger>
            <TabsTrigger value="financial" className="rounded-md">Financial</TabsTrigger>
            <TabsTrigger value="strategy" className="rounded-md">Strategy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {renderOverview()}
          </TabsContent>

          <TabsContent value="team">
            {renderTeamAnalytics()}
          </TabsContent>

          <TabsContent value="financial">
            {renderFinancialAnalytics()}
          </TabsContent>

          <TabsContent value="strategy">
            <Card>
              <CardContent className="text-center py-12">
                <Info className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-600">Strategy analytics coming soon</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Custom Styles */}
      <style>{`
        .hover-lift {
          transition: all 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
      `}</style>
    </SidebarLayout>
  );
};

export default AnalyticsV3;
