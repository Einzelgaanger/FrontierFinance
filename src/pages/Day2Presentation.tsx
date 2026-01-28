import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  ArrowRight,
  Circle,
  Square,
  Target,
  BarChart3,
  Shield,
  Users,
  Globe,
  Zap,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  Rocket,
  Activity,
  PieChart,
  FileText,
  Settings,
  Brain,
  ArrowUp,
  ArrowDown,
  Building2,
  DollarSign,
  AlertTriangle,
  Eye,
  Gauge,
  Database,
  Network,
  Lock,
  BookOpen,
  Code,
  Palette,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, LineChart, Line, AreaChart, Area, ComposedChart } from 'recharts';

const BRAND = {
  navy: '#28098d',
  gold: '#f8b521',
  white: '#ffffff',
  lightGold: '#fef9e7',
  lightNavy: '#e8e5f5',
};

const Day2Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 12;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSlide]);

  // Chart data
  const focusAreasData = [
    { area: 'Platform Robustness', target: 90, current: 75 },
    { area: 'User Analytics', target: 100, current: 60 },
    { area: 'Data Collection', target: 95, current: 80 },
    { area: 'Impact Measurement', target: 100, current: 50 },
    { area: 'Admin Efficiency', target: 50, current: 30 },
    { area: 'Website Dev', target: 100, current: 40 },
    { area: 'Security', target: 100, current: 85 },
  ];

  const q1RoadmapData = [
    { week: '1-2', progress: 100, status: 'Done' },
    { week: '3-4', progress: 100, status: 'Done' },
    { week: '5-6', progress: 60, status: 'In Progress' },
    { week: '7-8', progress: 0, status: 'Pending' },
    { week: '9-10', progress: 0, status: 'Pending' },
    { week: '11-12', progress: 0, status: 'Pending' },
  ];

  const metricsData = [
    { metric: 'MAU', target: 80, current: 45 },
    { metric: 'Data Accuracy', target: 95, current: 78 },
    { metric: 'Security', target: 100, current: 95 },
    { metric: 'Satisfaction', target: 4.5, current: 3.8 },
    { metric: 'Load Time', target: 200, current: 350 },
    { metric: 'Task Time', target: 50, current: 75 },
    { metric: 'Uptime', target: 90, current: 85 },
  ];

  const resourceCostsData = [
    { name: 'Supabase Pro', cost: 25, color: '#3b82f6' },
    { name: 'Edge Functions', cost: 75, color: '#10b981' },
    { name: 'Email (Resend)', cost: 20, color: '#f59e0b' },
    { name: 'Monitoring', cost: 30, color: '#ef4444' },
  ];

  const slides = [
    // Slide 1: Hero Title
    <div key="slide-1" className="min-h-full flex flex-col bg-gradient-to-br from-[#28098d] via-[#1e0758] to-[#28098d] text-white relative overflow-hidden py-12">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8b521] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f8b521] rounded-full blur-[120px] opacity-20"></div>
      </div>
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-6 py-20">
        <div className="mb-8 animate-fade-in">
          <img src="/CCF_ColorLogoHorizontal (1).png" alt="CFF Logo" className="h-20 mx-auto drop-shadow-lg" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
        </div>
        <div className="w-24 h-1 bg-[#f8b521] mb-8 mx-auto"></div>
        <h1 className="text-7xl md:text-8xl font-bold mb-6 text-center leading-tight">
          <span className="block">Data & Technology</span>
          <span className="block text-[#f8b521]">Strategic Plan</span>
        </h1>
        <div className="bg-[#f8b521] text-[#28098d] px-6 py-2 rounded-full font-bold text-xl mb-8">
          DATA and TECHNOLOGY PLAN: ALFRED
        </div>
        <div className="flex items-center gap-6 mt-4 text-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#f8b521]" />
            <span>Session 3 | Day 2</span>
          </div>
          <div className="w-1 h-6 bg-[#f8b521]"></div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#f8b521]" />
            <span>Allie & Alfred</span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xl text-gray-300 mb-2">Platform Roadmap & Strategic Discussion</p>
          <p className="text-lg text-gray-400">Fund Manager Portal • Launch+ • Learning Hub • Website</p>
        </div>
        <div className="mt-12 text-center space-y-2">
          <p className="text-lg">30th January 2026 | Fair Acres Nairobi</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-[#f8b521] to-transparent"></div>
      <div className="absolute bottom-6 right-8 text-white/40 text-sm font-mono">01</div>
    </div>,

    // Slide 2: Session Agenda - Key Platforms
    <div key="slide-2" className="min-h-full bg-gradient-to-br from-white via-[#fef9e7] to-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#28098d] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Session Agenda</h2>
          </div>
          <div className="w-32 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>
        
        {/* Key Platforms Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            { num: '01', icon: Network, title: 'Fund Manager Portal', desc: 'Core platform features & capabilities', color: 'from-blue-500 to-blue-600' },
            { num: '02', icon: Users, title: 'Member Onboarding', desc: 'User journey & activation', color: 'from-purple-500 to-purple-600' },
            { num: '03', icon: Rocket, title: 'Launch+ Platform', desc: 'New platform development', color: 'from-green-500 to-green-600' },
            { num: '04', icon: BookOpen, title: 'Learning Hub', desc: 'Knowledge management & resources', color: 'from-orange-500 to-orange-600' },
            { num: '05', icon: Database, title: 'Survey Database', desc: 'Data collection & analytics', color: 'from-pink-500 to-pink-600' },
            { num: '06', icon: Globe, title: 'Refreshed Website', desc: 'Public presence & engagement', color: 'from-indigo-500 to-indigo-600' },
          ].map((item, idx) => (
            <Card key={idx} className="border-2 border-[#e8e5f5] hover:border-[#28098d] transition-all hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-[#28098d] text-white text-xs font-bold px-2 py-0.5">{item.num}</Badge>
                      <h3 className="text-xl font-bold text-[#28098d]">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Discussion Topics */}
        <Card className="bg-gradient-to-r from-[#28098d] to-[#1e0758] border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <MessageSquare className="w-8 h-8 text-[#f8b521] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Strategic Discussion Topics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <p className="text-white text-base">• Data infrastructure & technology stack</p>
                  <p className="text-white text-base">• Technology prioritization & roadmap</p>
                  <p className="text-white text-base">• Data integrity & compliance</p>
                  <p className="text-white text-base">• Cost-effectiveness & risk management</p>
                  <p className="text-white text-base">• KPIs & success metrics</p>
                  <p className="text-white text-base">• Feedback mechanisms & agility</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">02</div>
      </div>
    </div>,

    // Slide 3: Strategic Focus Areas with Chart
    <div key="slide-3" className="min-h-full bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-[#f8b521] rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">2026 Strategic Focus Areas</h2>
          </div>
          <div className="w-44 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        {/* Progress Chart */}
        <Card className="mb-8 border-2 border-[#e8e5f5]">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-[#28098d] mb-6">Current vs Target Progress</h3>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={focusAreasData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e5f5" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#28098d' }} />
                <YAxis dataKey="area" type="category" width={180} tick={{ fill: '#28098d', fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#28098d', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="target" fill="#e8e5f5" radius={[0, 4, 4, 0]} />
                <Bar dataKey="current" fill="#f8b521" radius={[0, 4, 4, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Focus Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { num: '1', title: 'Platform Robustness & User Adoption', target: '>90% uptime, 80%+ MAU', icon: Gauge, color: 'from-blue-500 to-cyan-500' },
            { num: '2', title: 'User Analytics & Behavioral Intelligence', target: 'Complete journey tracking', icon: BarChart3, color: 'from-purple-500 to-violet-500' },
            { num: '3', title: 'Data Collection & System Integration', target: '95%+ data accuracy', icon: Database, color: 'from-green-500 to-emerald-500' },
            { num: '4', title: 'Impact Measurement & Reporting', target: 'Automated KPI dashboards', icon: PieChart, color: 'from-orange-500 to-red-500' },
            { num: '5', title: 'Admin Control & Operational Efficiency', target: '50% overhead reduction', icon: Settings, color: 'from-pink-500 to-rose-500' },
            { num: '6', title: 'Website Development & Public Presence', target: 'SEO-optimized launch', icon: Globe, color: 'from-indigo-500 to-blue-500' },
            { num: '7', title: 'Security, Privacy & Compliance', target: 'Zero breaches, GDPR ready', icon: Shield, color: 'from-red-500 to-orange-500' },
          ].map((area) => (
            <Card key={area.num} className="border-2 border-[#e8e5f5] hover:border-[#28098d] transition-all hover:shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${area.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <area.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-[#f8b521] text-[#28098d] text-xs font-bold px-2 py-0.5">{area.num}</Badge>
                      <h3 className="text-lg font-bold text-[#28098d] leading-tight">{area.title}</h3>
                    </div>
                    <p className="text-[#f8b521] font-semibold text-sm">Target: {area.target}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">03</div>
      </div>
    </div>,

    // Slide 4: Q1 Roadmap with Timeline
    <div key="slide-3" className="min-h-full bg-gradient-to-br from-[#fef9e7] to-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Q1 2026 Roadmap</h2>
            <Badge className="bg-[#28098d] text-white text-lg px-3 py-1 ml-4">Jan - Mar</Badge>
          </div>
          <div className="w-40 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        {/* Timeline Visualization */}
        <Card className="mb-8 border-2 border-[#28098d] bg-white">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-[#28098d] mb-6">Q1 Timeline Progress</h3>
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-[#e8e5f5]"></div>
              <div className="space-y-6">
                {[
                  { week: '1-2', task: 'Fund Manager Portal launch readiness review', status: 'Done ✓', icon: CheckCircle2, color: 'green' },
                  { week: '3-4', task: 'User onboarding flow redesign', status: 'Done ✓', icon: CheckCircle2, color: 'green' },
                  { week: '5-6', task: 'Analytics infrastructure deployment', status: 'In Progress', icon: Clock, color: 'gold' },
                  { week: '7-8', task: 'Admin Dashboard V2 polish and deployment', status: 'Pending', icon: Circle, color: 'gray' },
                  { week: '9-10', task: 'Core security framework (MFA, audit logging)', status: 'Pending', icon: Circle, color: 'gray' },
                  { week: '11-12', task: 'User migration and training', status: 'Pending', icon: Circle, color: 'gray' },
                ].map((item, idx) => (
                  <div key={idx} className="relative flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      item.color === 'green' ? 'bg-green-500' : item.color === 'gold' ? 'bg-[#f8b521]' : 'bg-gray-300'
                    } shadow-lg`}>
                      <item.icon className={`w-8 h-8 ${
                        item.color === 'green' || item.color === 'gold' ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={`${
                          item.color === 'green' ? 'bg-green-100 text-green-700' : 
                          item.color === 'gold' ? 'bg-[#fef9e7] text-[#28098d] border border-[#f8b521]' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          Week {item.week}
                        </Badge>
                        <span className="font-semibold text-[#28098d]">{item.task}</span>
                      </div>
                      <Badge className={item.color === 'green' ? 'bg-green-500 text-white' : item.color === 'gold' ? 'bg-[#f8b521] text-[#28098d]' : 'bg-gray-400 text-white'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Q1 Milestones */}
        <Card className="bg-[#fef9e7] border-2 border-[#f8b521] shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-8 h-8 text-[#28098d]" />
              <h3 className="text-2xl font-bold text-[#28098d]">Q1 Milestones</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['50+ active users', 'Admin dashboard operational', 'MFA for all admins', 'Website specs finalized'].map((milestone, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 border border-[#f8b521] text-center">
                  <Check className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-[#28098d]">{milestone}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">04</div>
      </div>
    </div>,

    // Slide 5: Q2 Roadmap
    <div key="slide-4" className="min-h-full bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Q2 2026 Roadmap</h2>
            <Badge className="bg-green-500 text-white text-lg px-3 py-1 ml-4">Apr - Jun</Badge>
          </div>
          <div className="w-40 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { week: '1-3', task: 'WhatsApp and HubSpot CRM integration (Phase 1: Contacts sync)', icon: Network, color: 'from-blue-500 to-cyan-500' },
            { week: '4-6', task: 'Advanced analytics dashboards with export (SNA, Network Survey)', icon: BarChart3, color: 'from-purple-500 to-violet-500' },
            { week: '7-9', task: 'Learning Hub CMS & Impact tracking tool (Phase 1: KPI framework)', icon: FileText, color: 'from-green-500 to-emerald-500' },
            { week: '10-12', task: 'User onboarding optimization based on Q1 data', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
          ].map((item, idx) => (
            <Card key={idx} className={`border-2 ${idx % 2 === 0 ? 'bg-[#e8e5f5] border-[#28098d]' : 'bg-white border-[#28098d]'} hover:shadow-xl transition-all`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <Badge className="bg-[#28098d] text-white mb-2">Week {item.week}</Badge>
                    <p className="text-gray-700 text-lg leading-relaxed">{item.task}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Q2 Milestones */}
        <Card className="bg-[#e8e5f5] border-2 border-[#28098d] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#f8b521]"></div>
          <CardContent className="p-8 ml-4">
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-8 h-8 text-[#28098d]" />
              <h3 className="text-2xl font-bold text-[#28098d]">Q2 Milestones</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'WhatsApp and HubSpot contact sync operational',
                'Data sharing rooms enabled for secure member collaboration',
                'Member Blogs enabled with engagement reports',
                'Learning Modules Hub live (text, visuals, videos, webinars)',
                '80% user activation rate achieved',
              ].map((milestone, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white rounded-lg p-4">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{milestone}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">05</div>
      </div>
    </div>,

    // Slide 6: Q3 & Q4 Overview
    <div key="slide-5" className="min-h-full bg-gradient-to-br from-white to-[#e8e5f5] py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Q3 & Q4 2026 Overview</h2>
          </div>
          <div className="w-36 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Q3 */}
          <Card className="bg-[#e8e5f5] border-2 border-[#28098d] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#28098d]"></div>
            <CardContent className="p-8 ml-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-blue-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#28098d]">Q3: Jul - Sep</h3>
              </div>
              <ul className="space-y-4 mb-6">
                {[
                  'AI-powered features (PortIQ enhancements)',
                  'Data sharing rooms deployment',
                  'Impact tracking tool launch',
                  'Community features expansion',
                  'Website upgrade & polish',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-[#f8b521] mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-[#fef9e7] rounded-lg p-4 border border-[#f8b521]">
                <p className="text-sm font-semibold text-[#28098d]">
                  🎯 Target: AI handles 70%+ queries, 30% engagement ↑
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Q4 */}
          <Card className="bg-[#fef9e7] border-2 border-[#f8b521] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#f8b521]"></div>
            <CardContent className="p-8 ml-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f8b521] to-orange-500 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#28098d]">Q4: Oct - Dec</h3>
              </div>
              <ul className="space-y-4 mb-6">
                {[
                  'Platform performance optimization',
                  'Impact reporting system finalization',
                  'Documentation & knowledge base',
                  '2026 review and 2027 planning',
                  'All contract deliverables complete',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-[#28098d] mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-[#e8e5f5] rounded-lg p-4 border border-[#28098d]">
                <p className="text-sm font-semibold text-[#28098d]">
                  🎯 Target: &lt;150ms page load, 100% on-time reports
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Year-End Summary */}
        <Card className="bg-gradient-to-r from-[#28098d] to-[#1e0758] border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <CheckCircle2 className="w-8 h-8 text-[#f8b521]" />
              <h3 className="text-2xl font-bold text-white">Year-End Deliverables</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                'Revamped CFF website',
                'Functional Fund Manager Portal',
                'Accurate data dashboards',
                'Well-structured CRM',
                'Monthly support logs',
              ].map((deliverable, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
                  <Check className="w-5 h-5 text-[#f8b521] mx-auto mb-2" />
                  <p className="text-white text-sm">{deliverable}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">06</div>
      </div>
    </div>,

    // Slide 7: Platform Improvement Backlog
    <div key="slide-6" className="min-h-full bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Platform Improvement Backlog</h2>
          </div>
          <div className="w-48 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Learning Hub', items: ['Resource editing/deletion', 'Progress tracking', 'Completion rewards', 'AI recommendations', 'Analytics (views, completion)'], icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
            { title: 'Admin Dashboard', items: ['Real-time refresh indicators', 'Advanced user search', 'Bulk operations', 'Survey detail polish', 'Pending action widget'], icon: Settings, color: 'from-purple-500 to-violet-500' },
            { title: 'Analytics', items: ['Cross-year comparison', 'Geographic map view', 'Custom date filtering', 'Report scheduling', 'PDF/Excel exports'], icon: BarChart3, color: 'from-green-500 to-emerald-500' },
            { title: 'Community', items: ['Blog scheduling', 'Content moderation', 'Comment threading', 'Featured rotation', 'Email digests'], icon: Users, color: 'from-orange-500 to-red-500' },
          ].map((cat, idx) => (
            <Card key={idx} className={`border-2 ${idx % 2 === 0 ? 'bg-[#e8e5f5] border-[#28098d]' : 'bg-[#fef9e7] border-[#f8b521]'} hover:shadow-xl transition-all`}>
              <CardContent className="p-6">
                <div className={`w-14 h-14 bg-gradient-to-br ${cat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <cat.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#28098d] mb-4">{cat.title}</h3>
                <ul className="space-y-2">
                  {cat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-[#f8b521]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">07</div>
      </div>
    </div>,

    // Slide 8: Success Metrics with Charts
    <div key="slide-7" className="min-h-full bg-gradient-to-br from-[#e8e5f5] to-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
              <Gauge className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Success Metrics</h2>
          </div>
          <div className="w-32 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        {/* Metrics Comparison Chart */}
        <Card className="mb-8 border-2 border-[#e8e5f5]">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-[#28098d] mb-6">Current Performance vs Targets</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={metricsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8e5f5" />
                <XAxis dataKey="metric" tick={{ fill: '#28098d', fontSize: 11 }} />
                <YAxis tick={{ fill: '#28098d' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#28098d', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend />
                <Bar dataKey="target" fill="#e8e5f5" name="Target" radius={[8, 8, 0, 0]} />
                <Bar dataKey="current" fill="#f8b521" name="Current" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Metrics Table */}
        <div className="space-y-3">
          {[
            { metric: 'Monthly Active Users', target: '80%+ of registered', method: 'Analytics dashboard', icon: Users, current: '45%' },
            { metric: 'Data Accuracy', target: '95%+ field completion', method: 'Data quality reports', icon: Database, current: '78%' },
            { metric: 'Security Incidents', target: 'Zero breaches', method: 'Security monitoring', icon: Shield, current: '0' },
            { metric: 'User Satisfaction', target: '4.5+ rating', method: 'Engagement analytics', icon: Star, current: '3.8' },
            { metric: 'Page Load Time', target: '<200ms average', method: 'Performance monitoring', icon: Clock, current: '350ms' },
            { metric: 'Admin Task Time', target: '50% reduction', method: 'Time tracking comparison', icon: TrendingUp, current: '25%' },
            { metric: 'System Uptime', target: '>90%', method: 'Infrastructure monitoring', icon: Activity, current: '85%' },
          ].map((m, idx) => (
            <Card key={idx} className={`border-2 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#e8e5f5]'} hover:shadow-lg transition-all`}>
              <CardContent className="p-5">
                <div className="grid grid-cols-4 gap-6 items-center">
                  <div className="flex items-center gap-3">
                    <m.icon className="w-6 h-6 text-[#28098d]" />
                    <span className="font-bold text-[#28098d]">{m.metric}</span>
                  </div>
                  <div>
                    <Badge className="bg-[#fef9e7] text-[#28098d] border border-[#f8b521]">
                      {m.target}
                    </Badge>
                  </div>
                  <div className="text-gray-600">{m.method}</div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Current: </span>
                    <span className="font-bold text-[#28098d]">{m.current}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">08</div>
      </div>
    </div>,

    // Slide 9: Resource Requirements with Cost Breakdown
    <div key="slide-8" className="min-h-full bg-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Resource Requirements</h2>
          </div>
          <div className="w-44 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Technical Resources */}
          <Card className="bg-[#e8e5f5] border-2 border-[#28098d] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#28098d]"></div>
            <CardContent className="p-8 ml-4">
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-8 h-8 text-[#28098d]" />
                <h3 className="text-2xl font-bold text-[#28098d]">Technical Resources</h3>
              </div>
              <div className="space-y-4">
                {[
                  { role: 'Full-stack Developer', type: 'Dedicated', icon: Code },
                  { role: 'DevOps/Security Engineer', type: 'Part-time', icon: Shield },
                  { role: 'Design Support', type: 'As needed', icon: Palette },
                ].map((resource, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white rounded-lg p-4">
                    <resource.icon className="w-6 h-6 text-[#28098d]" />
                    <div className="flex-1">
                      <p className="font-semibold text-[#28098d]">{resource.role}</p>
                      <p className="text-sm text-gray-600">{resource.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Costs */}
          <Card className="bg-[#fef9e7] border-2 border-[#f8b521] relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#f8b521]"></div>
            <CardContent className="p-8 ml-4">
              <div className="flex items-center gap-3 mb-6">
                <DollarSign className="w-8 h-8 text-[#28098d]" />
                <h3 className="text-2xl font-bold text-[#28098d]">Est. Monthly Infrastructure</h3>
              </div>
              
              {/* Cost Pie Chart */}
              <div className="mb-6">
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={resourceCostsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, cost }) => `${name}: $${cost}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cost"
                    >
                      {resourceCostsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 mb-6">
                {resourceCostsData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-bold text-[#28098d]">${item.cost}/mo</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#28098d] rounded-lg p-4 text-center">
                <p className="text-[#f8b521] font-bold text-2xl">Total: $185-245/month</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Mitigation */}
        <Card className="bg-[#e8e5f5] border-2 border-[#28098d] relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#28098d]"></div>
          <CardContent className="p-8 ml-4">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-[#28098d]" />
              <h3 className="text-2xl font-bold text-[#28098d]">Risk Mitigation</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { risk: 'User adoption below target', mitigation: 'Admin monitoring, onboarding redesign, efficient feedback loop', icon: Users },
                { risk: 'Data quality issues', mitigation: 'Automated validation, quality dashboards, admin alerts', icon: Database },
                { risk: 'Security breach', mitigation: 'MFA, audit logging, regular security reviews', icon: Lock },
                { risk: 'Scope creep', mitigation: 'Monthly priority review, clear documentation, stakeholder alignment', icon: AlertTriangle },
              ].map((r, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <r.icon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#28098d] mb-1">• {r.risk}:</p>
                      <p className="text-sm text-gray-600">{r.mitigation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">09</div>
      </div>
    </div>,

    // Slide 10: Engagement Strategy
    <div key="slide-9" className="min-h-full bg-gradient-to-br from-white to-[#fef9e7] py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Engagement & Communication Strategy</h2>
          </div>
          <p className="text-xl text-[#f8b521] font-semibold mb-4">How We Keep Members Active & Informed</p>
          <div className="w-56 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          {[
            { freq: 'Weekly', action: 'Content posts on blog/learning hub to drive engagement', icon: Star, color: 'from-blue-500 to-cyan-500' },
            { freq: 'Weekly', action: 'Monitor platform analytics for drop-off patterns', icon: BarChart3, color: 'from-green-500 to-emerald-500' },
            { freq: 'Bi-weekly', action: 'Review DevTasks feedback and prioritize fixes', icon: CheckCircle2, color: 'from-purple-500 to-violet-500' },
            { freq: 'Monthly', action: 'Technical support logs and system health report', icon: FileText, color: 'from-orange-500 to-red-500' },
            { freq: 'Monthly', action: 'User engagement summary for leadership', icon: TrendingUp, color: 'from-pink-500 to-rose-500' },
            { freq: 'Quarterly', action: 'Platform performance review and optimization sprint', icon: Rocket, color: 'from-indigo-500 to-blue-500' },
          ].map((item, idx) => (
            <Card key={idx} className={`border-2 ${idx % 2 === 0 ? 'bg-[#e8e5f5] border-[#28098d]' : 'bg-[#fef9e7] border-[#f8b521]'} hover:shadow-xl transition-all`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <Badge className="bg-[#28098d] text-white text-lg px-4 py-1">
                        {item.freq}
                      </Badge>
                      <span className="text-gray-700 text-lg">{item.action}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">10</div>
      </div>
    </div>,

    // Slide 11: Strategic Discussion Questions
    <div key="slide-10" className="min-h-full bg-gradient-to-br from-[#28098d] via-[#1e0758] to-[#28098d] text-white py-12 px-8 relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#f8b521] rounded-full blur-[120px]"></div>
      </div>
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10 text-center">
          <div className="w-16 h-1.5 bg-[#f8b521] mx-auto mb-6 rounded-full"></div>
          <h2 className="text-6xl font-bold mb-4">Strategic Discussion Questions</h2>
          <div className="w-48 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Infrastructure & Stack */}
          <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-8 h-8 text-[#f8b521]" />
                <h3 className="text-2xl font-bold">Infrastructure & Stack</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span>What is the current stage/level of our data infrastructure and technology stack?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span>Which technologies are currently prioritized for development and why?</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Roadmap & Delivery */}
          <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-[#f8b521]" />
                <h3 className="text-2xl font-bold">Roadmap & Delivery</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span>What is the roadmap for delivery of various tech/tools and enablements?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span>What mechanisms ensure agility and adaptability in our technology roadmap?</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Integrity & Compliance */}
          <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-[#f8b521]" />
                <h3 className="text-2xl font-bold">Data Integrity & Compliance</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span>How do we ensure data integrity, accuracy, and compliance with best practices?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span>How do we balance technology needs with cost-effectiveness and risk management?</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* KPIs & Success Metrics */}
          <Card className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/20 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gauge className="w-8 h-8 text-[#f8b521]" />
                <h3 className="text-2xl font-bold">KPIs & Success</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span>What KPIs will track progress and success for data and technology initiatives?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span>How do we incorporate feedback and lessons learned into the development process?</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Key Platforms Focus */}
        <Card className="bg-[#f8b521] border-0 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Network className="w-8 h-8 text-[#28098d]" />
              <h3 className="text-2xl font-bold text-[#28098d]">Platform Focus Areas</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                'Fund Manager Portal',
                'Member Onboarding',
                'Launch+ Platform',
                'Learning Hub',
                'Survey Database',
                'Refreshed Website',
              ].map((platform, idx) => (
                <div key={idx} className="bg-white/20 rounded-lg p-3 text-center">
                  <p className="text-[#28098d] font-semibold">{platform}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-white/40 text-sm font-mono">11</div>
      </div>
    </div>,

    // Slide 12: Thank You
    <div key="slide-12" className="min-h-full flex flex-col bg-gradient-to-br from-[#28098d] via-[#1e0758] to-[#28098d] text-white relative overflow-hidden py-12">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f8b521] rounded-full blur-[150px] opacity-20"></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 py-20">
        <div className="mb-8 animate-fade-in">
          <img src="/CCF_ColorLogoHorizontal (1).png" alt="CFF Logo" className="h-24 mx-auto drop-shadow-2xl" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
        </div>
        <div className="w-32 h-1.5 bg-[#f8b521] mb-8 mx-auto rounded-full"></div>
        <h2 className="text-8xl font-bold mb-6 text-center">Thank You</h2>
        <p className="text-4xl text-[#f8b521] mb-8 font-semibold">Questions & Discussion</p>
        <p className="text-xl text-gray-300 mb-4">Let's build something great together in 2026</p>
        <div className="text-center space-y-2 mt-8">
          <p className="text-lg text-gray-400">Day 2 | Data & Technology Development Plans</p>
          <p className="text-base text-gray-500">30th January 2026</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-[#f8b521] to-transparent"></div>
      <div className="absolute bottom-6 right-8 text-white/40 text-sm font-mono">12</div>
    </div>,
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Fixed Navigation Bar - Hidden on first slide */}
      {currentSlide > 0 && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#28098d] shadow-xl border-b-2 border-[#f8b521]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/CCF_ColorLogoHorizontal (1).png" alt="CFF Logo" className="h-10" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
              <div className="h-8 w-px bg-[#f8b521]"></div>
              <span className="text-white font-semibold text-lg">Day 2 Presentation</span>
            </div>
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === index ? 'bg-[#f8b521] w-10 shadow-lg' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* Slide Container */}
      <div className={`relative h-screen overflow-hidden ${currentSlide > 0 ? 'pt-20' : ''}`}>
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0 relative overflow-y-auto overflow-x-hidden" style={{ scrollBehavior: 'smooth' }}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-[#28098d] text-white shadow-2xl flex items-center justify-center transition-all border-2 border-[#f8b521] ${
          currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#1e0758] hover:scale-110 hover:shadow-[#f8b521]'
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-10 h-10" />
      </button>

      <button
        onClick={nextSlide}
        disabled={currentSlide === totalSlides - 1}
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 w-16 h-16 rounded-full bg-[#28098d] text-white shadow-2xl flex items-center justify-center transition-all border-2 border-[#f8b521] ${
          currentSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#1e0758] hover:scale-110 hover:shadow-[#f8b521]'
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-10 h-10" />
      </button>

      {/* Slide Counter */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-[#28098d] text-white px-8 py-3 rounded-full shadow-2xl border-2 border-[#f8b521]">
        <span className="text-sm font-bold font-mono">
          {String(currentSlide + 1).padStart(2, '0')} / {String(totalSlides).padStart(2, '0')}
        </span>
      </div>
    </div>
  );
};

export default Day2Presentation;
