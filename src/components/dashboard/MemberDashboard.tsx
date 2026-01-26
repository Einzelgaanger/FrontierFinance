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
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(/member.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
                onClick={() => navigate(action.href)}
              >
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                  <div className="flex items-center text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
                    Get started
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Survey Access & Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Survey Access Card */}
            <Card className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Survey Access & Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  Complete annual surveys to share your insights and access comprehensive market data from 2021-2024.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {surveyYears.map((survey) => (
                    <Button
                      key={survey.year}
                      variant="outline"
                      onClick={() => navigate(survey.path)}
                      className={`h-auto py-3 font-semibold border-2 hover:scale-105 transition-transform ${survey.color}`}
                    >
                      {survey.year}
                    </Button>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    Trend Analysis Available
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    4 Years of Data
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} border-2 ${feature.borderColor} flex items-center justify-center mb-4`}>
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs font-medium text-gray-500">{feature.stats}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
