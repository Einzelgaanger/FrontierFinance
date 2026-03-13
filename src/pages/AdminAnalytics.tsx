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

  const yearButtons = (
    <div className="flex items-center gap-1.5 shrink-0">
      {AVAILABLE_YEARS.map((year) => {
        const isActive = selectedYear === year;
        return (
          <Button
            key={year}
            variant="ghost"
            size="sm"
            className={`h-8 px-3 text-xs rounded-lg font-sans ${isActive
              ? 'bg-navy-900 text-gold-400 hover:bg-navy-800 shadow-finance'
              : 'bg-slate-50 text-navy-900 border border-slate-200 hover:border-gold-500/40 hover:bg-amber-50/50'
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

  /** Split label into max 2 lines, 2 words per line, for readable pie labels. */
  const wrapLabelTwoWordsPerLine = (text: string): [string, string?] => {
    const words = String(text || '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (words.length <= 2) return [words.join(' ') || ''];
    const line1 = words.slice(0, 2).join(' ');
    const rest = words.slice(2, 4);
    const line2 = rest.length
      ? rest.join(' ') + (words.length > 4 ? '…' : '')
      : undefined;
    return line2 != null ? [line1, line2] : [line1];
  };

  /** Custom pie label: 2 words per row (max 2 lines) + percentage, outside pie, medium weight. */
  const renderPieLabelWrapped = (props: {
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
    percent: number;
    name?: string;
    percentage?: string;
  }) => {
    const { cx, cy, midAngle, outerRadius, percent, name = '', percentage } = props;
    const RADIAN = Math.PI / 180;
    const r = outerRadius + 42;
    const x = cx + r * Math.cos(-midAngle * RADIAN);
    const y = cy + r * Math.sin(-midAngle * RADIAN);
    const [line1, line2] = wrapLabelTwoWordsPerLine(name);
    const pct = percentage ?? `${(percent * 100).toFixed(1)}`;
    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontWeight="500">
        <tspan x={x} dy={line2 ? -7 : -3}>{line1 || '\u00A0'}</tspan>
        {line2 && <tspan x={x} dy={14}>{line2}</tspan>}
        <tspan x={x} dy={14}>{pct}%</tspan>
      </text>
    );
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-xl font-display font-normal text-navy-900">{currentSection.title}</h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">{surveyData.length} survey responses</p>
          </div>
          <Button onClick={fetchSurveyData} variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200 text-navy-900 hover:border-gold-500 font-sans">
            <RefreshCw className="h-4 w-4" />
            Refresh data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="finance-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs section-label">Total responses</p>
                <p className="text-2xl font-display font-normal text-navy-900 tabular-nums mt-1">{surveyData.length}</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Completed surveys</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="finance-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs section-label">Fields analyzed</p>
                <p className="text-2xl font-display font-normal text-navy-900 tabular-nums mt-1">{currentSection.fields.length}</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Data points</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="finance-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs section-label">Survey year</p>
                <p className="text-2xl font-display font-normal text-navy-900 tabular-nums mt-1">{selectedYear}</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Current dataset</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </div>
          <div className="finance-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs section-label">Section progress</p>
                <p className="text-2xl font-display font-normal text-navy-900 tabular-nums mt-1">{selectedSection} / {sections.length}</p>
                <p className="text-xs text-slate-500 font-sans mt-1">Sections reviewed</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">
                <Target className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

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
              <div key={field} className="finance-card overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-200/80 flex items-start justify-between">
                  <div>
                    <h3 className="font-display font-normal text-navy-900 text-lg">{formatFieldName(field)}</h3>
                    <p className="text-xs text-slate-500 font-sans mt-0.5">
                      {hasNumericData ? `${stats.count} numeric values` : `${distribution.reduce((sum, d) => sum + d.value, 0)} responses`}
                    </p>
                  </div>
                  <Badge variant="secondary" className="rounded-lg border-slate-200 text-slate-600 font-sans text-[11px]">
                    {hasNumericData ? 'Numeric' : 'Categorical'}
                  </Badge>
                </div>
                <div className="p-5">
                  {hasNumericData ? (
                    <div className="space-y-4">
                      {!shouldHideNumericSummary && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
                            <p className="text-xs font-medium text-slate-500 font-sans mb-1">Average</p>
                            <p className="text-xl font-display font-normal text-navy-900 tabular-nums">{stats.avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
                            <p className="text-xs font-medium text-slate-500 font-sans mb-1">Median</p>
                            <p className="text-xl font-display font-normal text-navy-900 tabular-nums">{stats.median.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
                            <p className="text-xs font-medium text-slate-500 font-sans mb-1">Min</p>
                            <p className="text-xl font-display font-normal text-navy-900 tabular-nums">{stats.min.toLocaleString()}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80">
                            <p className="text-xs font-medium text-slate-500 font-sans mb-1">Max</p>
                            <p className="text-xl font-display font-normal text-navy-900 tabular-nums">{stats.max.toLocaleString()}</p>
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
                          <PieChart margin={{ top: 12, right: 12, bottom: 32, left: 12 }}>
                            <Pie
                              data={distribution}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderPieLabelWrapped}
                              outerRadius={68}
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
                    <div className="flex flex-col items-center justify-center py-12 text-slate-500 font-sans">
                      <PieChartIcon className="h-12 w-12 mb-3 opacity-20 text-gold-500/50" />
                      <p className="text-sm">No data available for this field</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (userRole !== 'admin') {
    return (
      <SidebarLayout>
        <div className="min-h-screen bg-[#faf6f0] flex items-center justify-center">
          <p className="text-slate-600 font-sans">Access denied. Admin only.</p>
        </div>
      </SidebarLayout>
    );
  }

  const renderLoadingSkeleton = () => (
    <SidebarLayout>
      <div className="min-h-screen bg-[#faf6f0] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="finance-card p-5 space-y-3">
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
    <SidebarLayout>
      <div className="min-h-screen bg-[#faf6f0] font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900">
        {/* Page header — same pattern as Community, Admin, Network */}
        <header className="sticky top-0 z-20 border-b border-slate-200/60 bg-[#faf6f0]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="flex flex-wrap items-baseline gap-2 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold-600 font-sans">Analytics</span>
                <h1 className="text-base sm:text-lg font-display font-normal text-navy-900">Survey analytics</h1>
                <div className="w-5 h-0.5 bg-gold-500 rounded-full shrink-0" aria-hidden />
                <p className="text-[10px] text-slate-500 font-sans hidden sm:inline">Explore survey responses by year and section</p>
              </div>
              {yearButtons}
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 min-w-0 overflow-x-hidden">
          <div className="finance-card p-5">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-gold-500 rounded-full" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-600 font-sans">Survey sections</span>
              </div>
              <span className="text-[11px] text-slate-500 font-sans">Choose a focus area</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => {
                const isActive = selectedSection === section.id;
                return (
                  <Button
                    key={section.id}
                    size="sm"
                    variant="ghost"
                    className={`h-9 px-4 text-[11px] font-medium tracking-wide transition-all rounded-xl font-sans ${isActive
                        ? 'bg-navy-900 text-gold-400 hover:bg-navy-800 shadow-finance'
                        : 'bg-slate-50 text-navy-900 border border-slate-200 hover:border-gold-500/40 hover:bg-amber-50/50'
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
      </div>
    </SidebarLayout>
  );
}
