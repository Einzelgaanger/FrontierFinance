import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Award,
  Zap,
  Globe,
  TrendingUp,
  BarChart3,
  Network,
  Target,
  Sparkles,
  Calendar,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Leaderboard } from './Leaderboard';

const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [memberStats, setMemberStats] = useState({
    networkConnections: 0,
    surveysCompleted: 0,
    profileCompletion: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchMemberStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch network connections count
        const { count: networkCount } = await supabase
          .from('user_roles')
          .select('*', { count: 'exact', head: true })
          .neq('user_id', user.id)
          .eq('role', 'member');
        
        // Fetch surveys completed count from all survey tables
        const [survey2021, survey2022, survey2023, survey2024] = await Promise.all([
          supabase.from('survey_responses_2021' as any).select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('survey_responses_2022' as any).select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('survey_responses_2023' as any).select('*', { count: 'exact', head: true }).eq('user_id', user.id),
          supabase.from('survey_responses_2024' as any).select('*', { count: 'exact', head: true }).eq('user_id', user.id)
        ]);
        
        const surveysCount = (survey2021.count || 0) + (survey2022.count || 0) + (survey2023.count || 0) + (survey2024.count || 0);
        
        // Calculate profile completion (simplified - can be enhanced)
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        let profileCompletion = 0;
        if (profile) {
          const fields = ['email', 'company_name', 'first_name', 'last_name'];
          const completedFields = fields.filter(field => profile[field]).length;
          profileCompletion = (completedFields / fields.length) * 100;
        }
        
        setMemberStats({
          networkConnections: networkCount || 0,
          surveysCompleted: surveysCount || 0,
          profileCompletion: Math.round(profileCompletion)
        });
      } catch (error) {
        console.error('Error fetching member stats:', error);
        setMemberStats({
          networkConnections: 0,
          surveysCompleted: 0,
          profileCompletion: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMemberStats();
  }, [user]);

  const quickActions = [
    { 
      title: 'Explore Network', 
      description: 'Connect with 200+ fund managers', 
      icon: Network, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      href: '/network' 
    },
    { 
      title: 'Complete Surveys', 
      description: 'Share your insights & access data', 
      icon: FileText, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      href: '/survey' 
    },
    { 
      title: 'View Analytics', 
      description: 'Track trends & market insights', 
      icon: BarChart3, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      href: '/analytics' 
    },
    { 
      title: 'Community', 
      description: 'Engage with peers & resources', 
      icon: MessageSquare, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      href: '/community' 
    }
  ];

  const surveyYears = [
    { year: '2021', path: '/survey/2021', available: true, color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { year: '2022', path: '/survey/2022', available: true, color: 'bg-green-100 text-green-700 border-green-200' },
    { year: '2023', path: '/survey/2023', available: true, color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { year: '2024', path: '/survey/2024', available: true, color: 'bg-orange-100 text-orange-700 border-orange-200' }
  ];

  const features = [
    {
      icon: Globe,
      title: 'Global Network',
      description: 'Connect with 200+ fund managers across 25+ countries',
      stats: '200+ Members',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Access 4 years of comprehensive survey data and trends',
      stats: '4 Years Data',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      icon: Target,
      title: 'Strategic Opportunities',
      description: 'Discover investment opportunities and partnerships',
      stats: 'Active Deals',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: Award,
      title: 'Professional Growth',
      description: 'Exclusive events, webinars, and learning resources',
      stats: 'Monthly Events',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 font-sans antialiased selection:bg-gold-500/20 selection:text-navy-900 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
        <span className="section-label">Member</span>
        <h1 className="text-2xl sm:text-3xl font-display font-normal text-navy-900 mt-1 tracking-tight">Dashboard</h1>
        <div className="w-14 h-0.5 bg-gold-500/60 rounded-full my-3" aria-hidden />
        <p className="text-sm text-slate-600 mb-8">Quick actions, surveys, and network overview.</p>

        {/* Quick Actions – CFF finance-card */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="finance-card cursor-pointer"
                onClick={() => navigate(action.href)}
              >
                <CardContent className="p-5">
                  <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center mb-4">
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-normal text-navy-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 font-sans">{action.description}</p>
                  <div className="flex items-center text-sm font-medium text-gold-600 group-hover:gap-2 transition-all">
                    Get started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="finance-card overflow-hidden">
              <CardHeader className="border-b border-slate-200/60 bg-amber-50 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-display font-normal text-navy-900">Survey Access & Insights</CardTitle>
                    <p className="text-xs section-label mt-1">2021–2024</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <p className="text-slate-600 mb-4 font-sans">
                  Complete annual surveys to share your insights and access comprehensive market data from 2021-2024.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4">
                  {surveyYears.map((survey) => (
                    <Button
                      key={survey.year}
                      variant="outline"
                      onClick={() => navigate(survey.path)}
                      className="h-auto min-h-[44px] py-3 font-semibold border-2 border-slate-200 text-navy-900 hover:border-gold-500/40 hover:bg-amber-50 rounded-xl font-sans text-sm sm:text-base touch-manipulation"
                    >
                      {survey.year}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600 pt-4 border-t border-slate-200 font-sans">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4 text-gold-600" />
                    Trend Analysis Available
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gold-600" />
                    4 Years of Data
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card key={index} className="finance-card cursor-pointer">
                  <CardContent className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-display font-normal text-navy-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 mb-3 font-sans">{feature.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <span className="text-xs font-medium text-gold-600 font-sans">{feature.stats}</span>
                      <ArrowRight className="w-4 h-4 text-gold-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
