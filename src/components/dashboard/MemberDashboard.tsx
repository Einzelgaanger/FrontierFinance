import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  FileText, 
  CheckCircle,
  ArrowRight,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Leaderboard } from './Leaderboard';

const MemberDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [memberStats, setMemberStats] = useState({
    networkConnections: 0,
    surveysCompleted: 0
  });
  const [loading, setLoading] = useState(true);

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
        
        setMemberStats({
          networkConnections: networkCount || 0,
          surveysCompleted: surveysCount || 0
        });
      } catch (error) {
        console.error('Error fetching member stats:', error);
        // Fallback to default values
        setMemberStats({
          networkConnections: 0,
          surveysCompleted: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMemberStats();
  }, [user]);



  const quickActions = [
    { title: 'Browse Network', description: 'Connect with fund managers', icon: Users, color: 'blue', href: '/network' },
    { title: 'Complete Surveys', description: 'Share your insights', icon: FileText, color: 'purple', href: '/survey' }
  ];

  const surveyYears = [
    { year: '2021', path: '/survey/2021', available: true },
    { year: '2022', path: '/survey/2022', available: true },
    { year: '2023', path: '/survey/2023', available: true },
    { year: '2024', path: '/survey/2024', available: true }
  ];


  return (
    <div className="h-screen overflow-y-auto bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Compact Header */}
        <div className="mb-4">
          <h1 className="text-lg font-bold text-slate-900">Member Dashboard</h1>
          <p className="text-xs text-slate-600 mt-0.5">Your gateway to the fund manager community</p>
        </div>

        {/* Main Content - Compact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          
          {/* Left Column - Stats and Quick Actions */}
          <div className="lg:col-span-1 space-y-3">
            {/* Your Activity - Compact */}
            <div className="rounded-lg bg-white border border-slate-200 shadow-sm p-3">
              <h2 className="text-sm font-semibold text-slate-900 mb-3">Your Activity</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-blue-50 rounded-md border border-blue-100">
                  <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-slate-600 mb-0.5">Network</p>
                  <div className="text-lg font-bold text-slate-900">
                    {loading ? (
                      <div className="animate-pulse bg-slate-200 h-5 w-8 rounded mx-auto"></div>
                    ) : (
                      memberStats.networkConnections
                    )}
                  </div>
                </div>

                <div className="text-center p-2 bg-purple-50 rounded-md border border-purple-100">
                  <FileText className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-[10px] font-medium text-slate-600 mb-0.5">Surveys</p>
                  <div className="text-lg font-bold text-slate-900">
                    {loading ? (
                      <div className="animate-pulse bg-slate-200 h-5 w-8 rounded mx-auto"></div>
                    ) : (
                      memberStats.surveysCompleted
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions - Compact */}
            <div className="rounded-lg bg-white border border-slate-200 shadow-sm p-3">
              <h2 className="text-sm font-semibold text-slate-900 mb-2">Quick Actions</h2>
              <div className="space-y-2">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto p-2 text-left hover:bg-slate-50 border border-slate-200 rounded-md"
                    onClick={() => navigate(action.href)}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        action.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        <action.icon className={`w-3.5 h-3.5 ${
                          action.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 text-xs">
                          {action.title}
                        </h4>
                        <p className="text-[10px] text-slate-600 truncate">{action.description}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Benefits and Leaderboard */}
          <div className="lg:col-span-2 space-y-3">
            {/* Leaderboard */}
            <Leaderboard />
            
            {/* Benefits Grid - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Global Network */}
              <div className="rounded-lg bg-white border border-slate-200 shadow-sm p-3 hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900">Global Network</h3>
                </div>
                <p className="text-[10px] text-slate-600 mb-2 leading-relaxed">
                  Connect with 200+ fund managers across 25+ countries.
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>200+ Members</span>
                  <span>25+ Countries</span>
                </div>
              </div>

              {/* Survey Access */}
              <div className="rounded-lg bg-white border border-slate-200 shadow-sm p-3 hover:border-green-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-green-600 rounded-md flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900">Survey Access</h3>
                </div>
                <p className="text-[10px] text-slate-600 mb-2 leading-relaxed">
                  Complete annual surveys and access insights.
                </p>
                
                {/* Survey Year Buttons - Compact */}
                <div className="grid grid-cols-4 gap-1.5 mb-1.5">
                  {surveyYears.map((survey) => (
                    <Button
                      key={survey.year}
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(survey.path)}
                      className="h-6 text-[10px] font-medium bg-white hover:bg-green-50 hover:text-green-700 hover:border-green-300 border-slate-200 px-1"
                    >
                      {survey.year}
                    </Button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>4 Years Data</span>
                  <span>Trend Analysis</span>
                </div>
              </div>

              {/* Professional Development */}
              <div className="rounded-lg bg-white border border-slate-200 shadow-sm p-3 hover:border-purple-300 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center">
                    <Award className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-900">Professional Growth</h3>
                </div>
                <p className="text-[10px] text-slate-600 mb-2 leading-relaxed">
                  Enhance expertise through exclusive events and resources.
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Webinars</span>
                  <span>Workshops</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
