// @ts-nocheck
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  Area
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
  RefreshCw,
  Download,
  Activity,
  Briefcase,
  PieChart as PieChartIcon
} from 'lucide-react';

const CHART_COLORS = [
  'hsl(221.2 83.2% 53.3%)', // primary
  'hsl(142.1 76.2% 36.3%)', // green
  'hsl(262.1 83.3% 57.8%)', // purple  
  'hsl(346.8 77.2% 49.8%)', // pink
  'hsl(24.6 95% 53.1%)', // orange
  'hsl(199.89 89.26% 48.43%)', // cyan
  'hsl(47.9 95.8% 53.1%)', // yellow
  'hsl(280.7 83.3% 50%)', // violet
];

const AVAILABLE_YEARS = [2021, 2022, 2023, 2024] as const;

// Section configurations for each year
const SURVEY_SECTIONS = {
  2021: [
    { id: 1, title: 'Background Information', fields: ['role_title', 'team_based', 'geographic_focus', 'fund_stage'] },
    { id: 2, title: 'Investment Thesis & Capital', fields: ['investment_vehicle_type', 'current_fund_size', 'target_fund_size', 'investment_timeframe'] },
    { id: 3, title: 'Portfolio & Team', fields: ['investment_forms', 'target_sectors', 'carried_interest_principals', 'current_ftes'] },
    { id: 4, title: 'Portfolio Development', fields: ['investment_monetization', 'exits_achieved'] },
    { id: 5, title: 'COVID-19 Impact', fields: ['covid_impact_aggregate', 'covid_government_support'] },
    { id: 6, title: 'Network Feedback', fields: ['network_value_rating', 'communication_platform'] },
    { id: 7, title: 'Convening Objectives', fields: ['participate_mentoring_program'] },
  ],
  2022: [
    { id: 1, title: 'Organization Details', fields: ['role_title'] },
    { id: 2, title: 'Fund Information', fields: ['legal_domicile', 'fund_operations', 'current_funds_raised', 'target_fund_size'] },
    { id: 3, title: 'Investment Strategy', fields: ['financial_instruments', 'sector_activities', 'business_stages'] },
    { id: 4, title: 'Team & Operations', fields: ['current_ftes', 'principals_count', 'team_based'] },
    { id: 5, title: 'Portfolio Performance', fields: ['investments_made_to_date', 'equity_exits_achieved', 'revenue_growth_recent_12_months'] },
    { id: 6, title: 'Market Factors', fields: ['domestic_factors_concerns', 'international_factors_concerns'] },
  ],
  2023: [
    { id: 1, title: 'Basic Information', fields: ['email_address', 'organisation_name', 'fund_name', 'funds_raising_investing'] },
    { id: 2, title: 'Fund Structure', fields: ['legal_domicile', 'fund_type_status', 'current_funds_raised', 'target_fund_size'] },
    { id: 3, title: 'Investment Approach', fields: ['financial_instruments', 'sector_focus', 'business_stages'] },
    { id: 4, title: 'Team Composition', fields: ['fte_staff_current', 'principals_count', 'team_based'] },
    { id: 5, title: 'Performance Metrics', fields: ['revenue_growth_historical', 'cash_flow_growth_historical', 'jobs_impact_historical_direct'] },
    { id: 6, title: 'Strategic Priorities', fields: ['fund_priorities', 'concerns_ranking'] },
  ],
  2024: [
    { id: 1, title: 'Organization Profile', fields: ['email_address', 'organisation_name', 'fund_name', 'funds_raising_investing'] },
    { id: 2, title: 'Fund Details', fields: ['legal_domicile', 'fund_type_status', 'hard_commitments_current', 'target_fund_size_current'] },
    { id: 3, title: 'Investment Focus', fields: ['sector_target_allocation', 'business_stages', 'financial_instruments_ranking'] },
    { id: 4, title: 'Operations', fields: ['fte_staff_current', 'principals_total', 'team_based'] },
    { id: 5, title: 'Portfolio Outcomes', fields: ['equity_investments_made', 'portfolio_revenue_growth_12m', 'direct_jobs_current'] },
    { id: 6, title: 'Strategic Focus', fields: ['fund_priorities_next_12m', 'fundraising_barriers'] },
  ],
};

export default function AdminAnalytics() {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const [selectedYear, setSelectedYear] = useState(2021);
  const [selectedSection, setSelectedSection] = useState(1);
  const [surveyData, setSurveyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const yearSelectionActions = (
    <div className="flex items-center gap-2">
      {AVAILABLE_YEARS.map((year) => {
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
    </div>
  );

  const fetchSurveyData = useCallback(async () => {
    try {
      setLoading(true);
      // Optimize query with limit and only fetch completed submissions
      const { data, error } = await supabase
        .from(`survey_responses_${selectedYear}` as any)
        .select('*')
        .eq('submission_status', 'completed')
        .limit(500); // Limit to improve performance

      if (error) throw error;
      setSurveyData(data || []);
    } catch (error) {
      console.error('Error fetching survey data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load survey data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [selectedYear, toast]);

  useEffect(() => {
    fetchSurveyData();
  }, [fetchSurveyData]);

  const calculateDistribution = useCallback((fieldName: string) => {
    const distribution: Record<string, number> = {};
    let totalCount = 0;

    surveyData.forEach(response => {
      const value = response[fieldName];
      if (Array.isArray(value)) {
        value.forEach(item => {
          if (item !== null && item !== undefined && item !== '') {
            distribution[String(item)] = (distribution[String(item)] || 0) + 1;
            totalCount++;
          }
        });
      } else if (value !== null && value !== undefined && value !== '') {
        distribution[String(value)] = (distribution[String(value)] || 0) + 1;
        totalCount++;
      }
    });

    // Use actual count for percentage calculation, not surveyData.length
    return Object.entries(distribution)
      .map(([raw, count]) => {
        const name = formatValueLabel(fieldName, raw);
        return {
          name: name.length > 30 ? name.substring(0, 27) + '…' : name,
          value: count,
          percentage: totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0'
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [surveyData]);

  const calculateNumericStats = useCallback((fieldName: string) => {
    const values = surveyData
      .map(r => {
        const val = r[fieldName];
        if (typeof val === 'number') return val;
        if (typeof val === 'string') {
          const parsed = parseFloat(val.replace(/[^0-9.-]/g, ''));
          return isNaN(parsed) ? null : parsed;
        }
        return null;
      })
      .filter((v): v is number => v !== null && !isNaN(v) && isFinite(v));

    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const median = sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

    return {
      min: sorted[0],
      max: sorted[sorted.length - 1],
      avg: sum / values.length,
      median,
      total: sum,
      count: values.length
    };
  }, [surveyData]);

  const formatFieldName = (field: string): string => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  /** Format raw survey values for chart labels (e.g. legal_domicile: kenya → Kenya, south_africa → South Africa). */
  const formatValueLabel = (fieldName: string, raw: string): string => {
    const s = String(raw).trim();
    if (!s) return s;
    if (fieldName === 'legal_domicile') {
      const map: Record<string, string> = {
        location_pending: 'Location Pending',
        mauritius: 'Mauritius',
        netherlands: 'Netherlands',
        dutch_antilles: 'Dutch Antilles',
        luxembourg: 'Luxembourg',
        ireland: 'Ireland',
        delaware: 'Delaware',
        cayman_island: 'Cayman Island',
        kenya: 'Kenya',
        senegal: 'Senegal',
        nigeria: 'Nigeria',
        south_africa: 'South Africa',
        ghana: 'Ghana',
        other: 'Other'
      };
      const key = s.toLowerCase().replace(/\s+/g, '_');
      if (map[key]) return map[key];
    }
    return s
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  const renderSectionAnalytics = () => {
    const sections = SURVEY_SECTIONS[selectedYear as keyof typeof SURVEY_SECTIONS] || [];
    const currentSection = sections[selectedSection - 1];
    
    if (!currentSection) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{currentSection.title}</h2>
            <p className="text-muted-foreground mt-1">Analyzing {surveyData.length} survey responses</p>
          </div>
          <Button onClick={fetchSurveyData} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>

        {/* Summary Cards with Gradients */}
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
              <div className="text-3xl font-bold">{surveyData.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed surveys</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-green-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Fields Analyzed</CardTitle>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{currentSection.fields.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Data points</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-purple-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Survey Year</CardTitle>
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{selectedYear}</div>
              <p className="text-xs text-muted-foreground mt-1">Current dataset</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-none">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-orange-600/5 to-transparent" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
              <CardTitle className="text-sm font-medium">Section Progress</CardTitle>
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Target className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-3xl font-bold">{selectedSection} / {sections.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Sections reviewed</p>
            </CardContent>
          </Card>
        </div>

        {/* Field Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentSection.fields.map((field, idx) => {
            const distribution = calculateDistribution(field);
            const stats = calculateNumericStats(field);
            const shouldHideNumericSummary = (
              (field === 'fund_stage' && selectedYear === 2021 && selectedSection === 1) ||
              (field === 'current_fund_size' && selectedYear === 2021 && selectedSection === 2) ||
              (selectedYear === 2022 && selectedSection === 2 && ['fund_operations', 'current_funds_raised', 'target_fund_size'].includes(field))
            );
            const hasNumericData = stats !== null && stats.count > 0 && !shouldHideNumericSummary;

            return (
              <Card key={field} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{formatFieldName(field)}</CardTitle>
                      <CardDescription className="mt-1">
                        {hasNumericData ? `${stats.count} numeric values` : `${distribution.reduce((sum, d) => sum + d.value, 0)} responses`}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {hasNumericData ? 'Numeric' : 'Categorical'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {hasNumericData ? (
                    <div className="space-y-4">
                      {!shouldHideNumericSummary && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Average</p>
                            <p className="text-xl font-bold">{stats.avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Median</p>
                            <p className="text-xl font-bold">{stats.median.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Min</p>
                            <p className="text-xl font-bold">{stats.min.toLocaleString()}</p>
                          </div>
                          <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Max</p>
                            <p className="text-xl font-bold">{stats.max.toLocaleString()}</p>
                          </div>
                        </div>
                      )}
                      {distribution.length > 0 && (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={distribution}>
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
                            <Bar dataKey="value" fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  ) : distribution.length > 0 ? (
                    <div className="space-y-4">
                      <ResponsiveContainer width="100%" height={280}>
                        {distribution.length > 6 ? (
                          <BarChart data={distribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 10 }} 
                              angle={-45} 
                              textAnchor="end" 
                              height={100}
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
                            <Bar dataKey="value" fill={CHART_COLORS[idx % CHART_COLORS.length]} radius={[4, 4, 0, 0]} />
                          </BarChart>
                        ) : (
                          <PieChart>
                            <Pie
                              data={distribution}
                              cx="50%"
                              cy="50%"
                              labelLine={true}
                              label={({ name, percentage }) => `${name}: ${percentage}%`}
                              outerRadius={90}
                              dataKey="value"
                            >
                              {distribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
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
                        )}
                      </ResponsiveContainer>
                      <div className="space-y-2">
                        {distribution.slice(0, 5).map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}
                              />
                              <span className="text-muted-foreground">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{item.value}</span>
                              <Badge variant="secondary">{item.percentage}%</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <PieChartIcon className="h-12 w-12 mb-3 opacity-20" />
                      <p className="text-sm">No data available for this field</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
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

  const renderLoadingSkeleton = () => (
    <SidebarLayout headerActions={yearSelectionActions}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="rounded-2xl border border-blue-900/15 bg-white shadow-md p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <Skeleton className="h-3 w-32 rounded-full" />
            <Skeleton className="h-2.5 w-44 rounded-full" />
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-36 rounded-full" />
            ))}
          </div>
        </div>

        {/* Analytics Content Skeleton */}
        <div className="space-y-6">
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

          {/* Field Analytics Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[...Array(4)].map((_, j) => (
                        <Skeleton key={j} className="h-20 w-full rounded-lg" />
                      ))}
                    </div>
                    <Skeleton className="h-64 w-full rounded" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );

  if (loading) {
    return renderLoadingSkeleton();
  }

  const sections = SURVEY_SECTIONS[selectedYear as keyof typeof SURVEY_SECTIONS] || [];

  return (
    <SidebarLayout headerActions={yearSelectionActions}>
      <div className="container mx-auto p-6 space-y-6">
        <div className="rounded-2xl border border-blue-900/15 bg-white shadow-md p-5">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-blue-900" />
              <span className="text-xs font-semibold text-blue-900 uppercase tracking-[0.18em]">Survey Sections</span>
            </div>
            <span className="text-[11px] text-slate-500">Choose a focus area to explore metrics</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => {
              const isActive = selectedSection === section.id;
              return (
                <Button
                  key={section.id}
                  size="sm"
                  variant="ghost"
                  className={`h-9 px-4 text-[11px] font-medium tracking-wide transition-all rounded-full ${
                    isActive
                      ? 'bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white shadow-md hover:brightness-110'
                      : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
                  }`}
                  onClick={() => setSelectedSection(section.id)}
                  aria-pressed={isActive}
                >
                  <span className="mr-2 font-semibold">{section.id}.</span>
                  <span className="truncate max-w-[140px]">{section.title}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Analytics Content */}
        <div className="space-y-6">
          {renderSectionAnalytics()}
        </div>
      </div>
    </SidebarLayout>
  );
}
