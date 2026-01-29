import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Star, ArrowRight, Circle, Square, AlertTriangle, BarChart3, RefreshCw, Link2, Zap, MessageSquare, Target, TrendingUp, Users, Globe, Shield, FileText, Settings, Workflow, Brain, Rocket, ArrowDown, ArrowUpRight, PieChart, Activity, Clock, CheckCircle2, XCircle, AlertCircle, Calendar, Eye, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BRAND = {
  navy: '#28098d',
  gold: '#f8b521',
  white: '#ffffff',
  lightGold: '#fef9e7',
  lightNavy: '#e8e5f5',
};

const Day1Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 11;

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


  const slides = [
    // Slide 1: Hero Title
    <div key="slide-1" className="min-h-full flex flex-col bg-gradient-to-br from-[#28098d] via-[#1e0758] to-[#28098d] text-white relative overflow-hidden py-6">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8b521] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f8b521] rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5"></div>
      </div>
      <div className="flex-1 flex flex-col justify-start items-center relative z-10 px-6 pt-8">
        <div className="mb-8 animate-fade-in">
          <img src="/CCF_ColorLogoHorizontal (1).png" alt="CFF Logo" className="h-20 mx-auto drop-shadow-lg" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
        </div>
        <div className="w-24 h-1 bg-[#f8b521] mb-8 mx-auto"></div>
        <h1 className="text-7xl md:text-8xl font-bold mb-6 text-center leading-tight">
          <span className="block">CFF Tools, Website</span>
          <span className="block text-[#f8b521]">& Team Productivity</span>
        </h1>
        <div className="flex items-center gap-6 mt-8 text-xl">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#f8b521]" />
            <span>Session 3 | Day 1</span>
          </div>
          <div className="w-1 h-6 bg-[#f8b521]"></div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#f8b521]" />
            <span>Allie & Alfred</span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-xl text-gray-300 mb-2">Strategic Discussion & Planning</p>
          <p className="text-lg text-gray-400">Tools • Website • Productivity</p>
        </div>
        <div className="mt-12 text-center space-y-2">
          <p className="text-lg">2026 Planning Meeting</p>
          <p className="text-gray-300">29th January 2026 | Fair Acres Nairobi</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-[#f8b521] to-transparent"></div>
      <div className="absolute bottom-6 right-8 text-white/40 text-sm font-mono">01</div>
    </div>,

    // Slide 2: Agenda with Visual Flow
    <div key="slide-2" className="min-h-full bg-gradient-to-br from-white via-[#fef9e7] to-white py-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[#28098d] rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Session Agenda</h2>
          </div>
          <div className="w-32 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>
        
        {/* Three Main Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[
            { icon: Settings, title: 'Tools', desc: 'Assessment, gaps, integration & upgrades', color: 'from-blue-500 to-cyan-500', questions: 6 },
            { icon: Globe, title: 'Website', desc: 'Effectiveness, metrics & 2026 enhancements', color: 'from-purple-500 to-violet-500', questions: 5 },
            { icon: TrendingUp, title: 'Productivity', desc: 'Processes, collaboration & measurement', color: 'from-green-500 to-emerald-500', questions: 5 },
          ].map((area, idx) => (
            <Card key={idx} className={`border-2 border-[#e8e5f5] hover:border-[#28098d] transition-all hover:shadow-xl hover:scale-105`}>
              <CardContent className="p-6 text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  <area.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#28098d] mb-2">{area.title}</h3>
                <p className="text-gray-600 mb-3">{area.desc}</p>
                <Badge className="bg-[#28098d] text-white">{area.questions} Discussion Points</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {[
            { num: '01', icon: BarChart3, title: 'Current Tools Assessment', desc: 'Are our tools meeting team needs?', color: 'from-blue-500 to-blue-600' },
            { num: '02', icon: Globe, title: 'Website Effectiveness', desc: 'Value delivery & user experience', color: 'from-purple-500 to-purple-600' },
            { num: '03', title: 'Productivity Analysis', desc: 'Processes, collaboration, roles & measurement', icon: TrendingUp, color: 'from-green-500 to-green-600' },
            { num: '04', icon: Rocket, title: 'Platform Capabilities', desc: 'What we\'ve already built', color: 'from-orange-500 to-orange-600' },
            { num: '05', icon: MessageSquare, title: 'Discussion & Action Planning', desc: 'Open floor for team input & next steps', color: 'from-pink-500 to-pink-600', colSpan: 'lg:col-span-2' },
          ].map((item, idx) => (
            <Card key={idx} className={`border-2 border-[#e8e5f5] hover:border-[#28098d] transition-all hover:shadow-xl ${item.colSpan || ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="bg-[#28098d] text-white text-xs font-bold px-2 py-0.5">{item.num}</Badge>
                      <h3 className="text-2xl font-bold text-[#28098d]">{item.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visual Flow Diagram */}
        <div className="bg-gradient-to-r from-[#e8e5f5] to-[#fef9e7] rounded-2xl p-8 border-2 border-[#28098d]">
          <h3 className="text-2xl font-bold text-[#28098d] mb-6 text-center">Session Flow</h3>
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((num, idx) => (
              <div key={idx} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#28098d] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {num}
                  </div>
                  <div className="w-2 h-8 bg-[#f8b521] mt-2"></div>
                </div>
                {idx < 4 && (
                  <ArrowRight className="w-8 h-8 text-[#f8b521] mx-2 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">02</div>
      </div>
    </div>,

    // Slide 3: Current Tools Landscape with Charts
    <div key="slide-3" className="min-h-full bg-white py-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-[#1e0758] rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Current Tools Landscape</h2>
          </div>
          <div className="w-40 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        {/* Current Tools - How to Use Better */}
        <Card className="mb-6 border-2 border-[#28098d] bg-gradient-to-r from-[#e8e5f5] to-white">
          <CardContent className="p-6">
            <h3 className="text-2xl font-bold text-[#28098d] mb-4">Current Tools - Optimize Usage</h3>
            <p className="text-gray-600 mb-6">Practical recommendations for tools we use and how to integrate them better into our workflows.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  name: 'Slack', 
                  status: 'Active',
                  bullets: [
                    'Use channels strategically: #general for announcements, #projects for specific work',
                    'Set up platform notifications to Slack for new applications, survey completions',
                    'Use Slack threads to keep conversations organized',
                    'Consider: Can we reduce Slack noise by moving some notifications to platform?',
                    'Use Slack for team coordination, not member communication'
                  ],
                  icon: MessageSquare
                },
                { 
                  name: 'HubSpot', 
                  status: 'Underutilized',
                  bullets: [
                    'Sync member profiles from ESCP Platform automatically via API',
                    'Track member engagement (logins, survey completions) as HubSpot activities',
                    'Create automated workflows: New member → HubSpot contact → Welcome sequence',
                    'Use for email campaigns to members (newsletters, announcements)',
                    'Replace manual contact management with automated sync from platform'
                  ],
                  icon: Users
                },
                { 
                  name: 'MailChimp', 
                  status: 'Active',
                  bullets: [
                    'Consider migrating to HubSpot for unified CRM + email',
                    'If keeping: Use for external newsletters only, not member communication',
                    'Member emails should come from platform (Resend) for better tracking',
                    'Sync subscriber lists with HubSpot for unified contact management',
                    'Use MailChimp for public-facing content, platform for member-specific'
                  ],
                  icon: Mail
                },
                { 
                  name: 'Dropbox', 
                  status: 'Active',
                  bullets: [
                    'Use for team file sharing and collaboration',
                    'Consider: Can we move member documents to platform storage?',
                    'Keep Dropbox for internal team files, use platform storage for member-facing docs',
                    'Set up folder structure: /Team, /Members, /Public',
                    'Use platform storage (Supabase) for survey attachments and member uploads'
                  ],
                  icon: FileText
                },
                { 
                  name: 'Google Workspace', 
                  status: 'Underutilized',
                  bullets: [
                    'Use Google Drive for collaborative document editing',
                    'Google Sheets for data analysis and reporting',
                    'Google Calendar for team scheduling and meetings',
                    'Consider: Can we integrate Google Calendar with platform for member events?',
                    'Use Google Docs for internal documentation, platform for member-facing content'
                  ],
                  icon: Globe
                },
                { 
                  name: 'ESCP Platform', 
                  status: 'Core System',
                  bullets: [
                    'This is our central hub - all member data lives here',
                    'Use platform analytics instead of external analytics tools',
                    'Member communication should happen through platform notifications',
                    'Use platform for surveys, not external survey tools',
                    'Build more features into platform to reduce tool sprawl'
                  ],
                  icon: Rocket
                },
              ].map((tool, idx) => (
                <div key={idx} className={`bg-white rounded-lg p-4 border-2 ${
                  tool.status === 'Underutilized' ? 'border-[#f8b521] bg-[#fef9e7]' : 
                  tool.status === 'Core System' ? 'border-green-500 bg-green-50' :
                  'border-[#28098d]'
                }`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <tool.icon className="w-5 h-5 text-[#28098d]" />
                      <h4 className="font-bold text-[#28098d]">{tool.name}</h4>
                    </div>
                    <Badge className={
                      tool.status === 'Underutilized' ? 'bg-[#f8b521] text-[#28098d]' : 
                      tool.status === 'Core System' ? 'bg-green-500 text-white' :
                      'bg-[#28098d] text-white'
                    }>{tool.status}</Badge>
                  </div>
                  <ul className="space-y-2">
                    {tool.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-[#f8b521] mt-1">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tools Discussion Questions */}
        <Card className="bg-gradient-to-r from-[#28098d] to-[#1e0758] border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <Settings className="w-8 h-8 text-[#f8b521] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Tools Discussion Questions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-white text-base">✓ Are our tools meeting team & organization needs?</p>
                    <p className="text-white text-base">✓ Which tools are underutilized, and why?</p>
                    <p className="text-white text-base">✓ What gaps hinder productivity?</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-white text-base">✓ How well do tools integrate with workflows?</p>
                    <p className="text-white text-base">✓ What new tools/upgrades should we consider?</p>
                    <p className="text-white text-base">✓ Technology's role in fundraising?</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">03</div>
      </div>
    </div>,

    // Slide 4: Identified Gaps with Visual Diagram
    <div key="slide-4" className="min-h-full bg-gradient-to-br from-[#e8e5f5] via-white to-[#fef9e7] py-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Identified Gaps</h2>
          </div>
          <div className="w-24 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            { icon: Eye, title: 'Cross-Project Visibility', desc: 'What\'s happening where, and when? Lack of unified view.', color: 'from-red-500 to-pink-500', impact: 'High' },
            { icon: BarChart3, title: 'Structured Data Capture', desc: 'Data needs to feed learning, fundraising, and reporting systematically.', color: 'from-blue-500 to-cyan-500', impact: 'High' },
            { icon: RefreshCw, title: 'Workflow Automation', desc: 'Repetitive tasks still done manually. Need lightweight automation.', color: 'from-green-500 to-emerald-500', impact: 'Medium' },
            { icon: Link2, title: 'Tool Integration', desc: 'Workflows not clearly mapped. Tools don\'t talk to each other.', color: 'from-purple-500 to-violet-500', impact: 'High' },
          ].map((gap, idx) => (
            <Card key={idx} className="border-2 border-[#28098d] hover:shadow-2xl transition-all hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${gap.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <gap.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-[#28098d]">{gap.title}</h3>
                      <Badge className={gap.impact === 'High' ? 'bg-red-500' : 'bg-orange-500'}>{gap.impact}</Badge>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">{gap.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tools to Drop / Build Into Platform */}
        <Card className="bg-white border-2 border-red-300">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-[#28098d] mb-4">Drop These - Build Into Platform Instead</h3>
            <p className="text-gray-600 mb-6">These external tools can be replaced with features built directly into our platform, reducing costs and improving user experience.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { 
                  name: 'External Survey Tools', 
                  current: 'Using Typeform/SurveyMonkey for some surveys',
                  build: [
                    'Use platform survey system (already built and superior)',
                    'Multi-year survey tracking',
                    'Conditional logic and validation',
                    'Progress saving and auto-complete'
                  ],
                  benefit: 'Data stays in platform, better integration'
                },
                { 
                  name: 'Separate Analytics Tools', 
                  current: 'Using external analytics for member behavior',
                  build: [
                    'Use platform analytics dashboard (already built)',
                    'Member activity tracking within platform',
                    'Survey completion analytics',
                    'Engagement metrics (logins, content views)'
                  ],
                  benefit: 'All data in one place, no external tool costs'
                },
                { 
                  name: 'External Notification Tools', 
                  current: 'Using Slack/Email for all notifications',
                  build: [
                    'In-platform notification center (already have basic version)',
                    'Real-time notification bell with unread count',
                    'Email digest option for members who prefer email',
                    'Push notifications for mobile users (PWA)'
                  ],
                  benefit: 'Members stay in platform, better engagement tracking'
                },
                { 
                  name: 'Manual Contact Management', 
                  current: 'Managing contacts in spreadsheets or separate CRM',
                  build: [
                    'Member directory with advanced filtering (already built)',
                    'Contact export functionality',
                    'Member relationship tracking',
                    'Communication history within member profiles'
                  ],
                  benefit: 'Single source of truth, automatic updates'
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h4 className="font-bold text-[#28098d] mb-2">{item.name}</h4>
                  <p className="text-xs text-gray-600 mb-2 italic">Current: {item.current}</p>
                  <p className="text-xs font-semibold text-gray-700 mb-2">Build instead:</p>
                  <ul className="space-y-1 mb-2">
                    {item.build.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
                        <span className="text-red-600 mt-1">→</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Badge className="bg-green-100 text-green-700 text-xs">Benefit: {item.benefit}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">04</div>
      </div>
    </div>,

    // Slide 5: Website Assessment with Comparison
    <div key="slide-5" className="min-h-full bg-white py-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Website Assessment</h2>
          </div>
          <div className="w-36 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Current State */}
          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <XCircle className="w-8 h-8 text-red-500" />
                <h3 className="text-3xl font-bold text-red-600">Current State</h3>
              </div>
              <div className="w-24 h-1 bg-red-500 mb-6 rounded-full"></div>
              <ul className="space-y-4">
                {[
                  'Works as reference point only',
                  'Content not easy to find/update',
                  'Pages serve multiple audiences',
                  'No clear pathways for users',
                  '"Who we are" vs "How to engage"',
                ].map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Circle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{issue}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Target State */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <h3 className="text-3xl font-bold text-green-600">Target State</h3>
              </div>
              <div className="w-24 h-1 bg-green-500 mb-6 rounded-full"></div>
              <ul className="space-y-4">
                {[
                  'Platform, not just reference',
                  'Clear audience pathways',
                  'Better learning integration',
                  'Modular update capability',
                  'SEO & accessibility optimized',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Website Discussion Questions */}
        <Card className="bg-gradient-to-r from-[#28098d] to-[#1e0758] border-0 shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-start gap-4">
              <Globe className="w-8 h-8 text-[#f8b521] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-4">Website Discussion Questions</h3>
                <div className="space-y-3 mb-6">
                  <p className="text-white text-lg">• How effective is the website in delivering value to users and stakeholders?</p>
                  <p className="text-white text-lg">• Are there usability issues or performance bottlenecks?</p>
                  <p className="text-white text-lg">• How can we improve the website to align with strategic goals?</p>
                  <p className="text-white text-lg">• What metrics indicate success, and how can we improve them?</p>
                  <p className="text-white text-lg">• What enhancements should be prioritized for 2026?</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/20">
                  {[
                    { label: 'Engagement', value: 'Key Pages' },
                    { label: 'Time on Site', value: 'User Retention' },
                    { label: 'Referral Traffic', value: 'Events & Partners' },
                  ].map((metric, idx) => (
                    <div key={idx} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <p className="text-[#f8b521] font-semibold mb-1">{metric.label}</p>
                      <p className="text-white text-sm">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">05</div>
      </div>
    </div>,

    // Slide 6: Productivity Challenges with Chart
    <div key="slide-6" className="min-h-full bg-gradient-to-br from-[#fef9e7] to-white py-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Productivity Challenges</h2>
          </div>
          <div className="w-44 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>


        {/* Challenges Table */}
        <div className="space-y-4">
          {[
            { title: 'Context Switching', impact: 'High', solution: 'Consolidated tools & dashboards', icon: RefreshCw, color: 'red' },
            { title: 'Unclear Handoffs', impact: 'High', solution: 'Defined workflows & ownership', icon: Workflow, color: 'red' },
            { title: 'Rebuilding Existing Work', impact: 'Medium', solution: 'Shared templates & documentation', icon: FileText, color: 'orange' },
            { title: 'Work in People\'s Heads', impact: 'High', solution: 'Documentation culture', icon: Brain, color: 'red' },
            { title: 'Too Many Channels', impact: 'Medium', solution: 'Channel consolidation', icon: MessageSquare, color: 'orange' },
            { title: 'Undocumented Decisions', impact: 'High', solution: 'Decision logs & playbooks', icon: AlertCircle, color: 'red' },
          ].map((challenge, idx) => (
            <Card key={idx} className={`border-2 ${idx % 2 === 0 ? 'bg-white border-[#e8e5f5]' : 'bg-[#e8e5f5] border-[#28098d]'} hover:shadow-lg transition-all`}>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-6 items-center">
                  <div className="flex items-center gap-4">
                    <challenge.icon className={`w-8 h-8 text-${challenge.color}-500`} />
                    <span className="font-bold text-[#28098d] text-lg">{challenge.title}</span>
                  </div>
                  <div>
                    <Badge className={challenge.impact === 'High' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'}>
                      {challenge.impact}
                    </Badge>
                  </div>
                  <div className="col-span-2 text-gray-600">{challenge.solution}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">06</div>
      </div>
    </div>,

    // Slide 7: What We've Built - Platform Features
    <div key="slide-7" className="min-h-full bg-gradient-to-br from-[#e8e5f5] via-white to-[#fef9e7] py-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-[#f8b521] rounded-xl flex items-center justify-center shadow-lg">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">What We've Already Built</h2>
          </div>
          <Badge className="bg-[#f8b521] text-[#28098d] text-lg px-4 py-1 mb-4">ESCP Fund Manager Portal - Live & Operational</Badge>
          <div className="w-48 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>


        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { category: 'Authentication', items: ['Role-based access', 'Secure login', 'Password reset'], icon: Shield, color: 'from-blue-500 to-cyan-500', count: 3 },
            { category: 'Survey System', items: ['Multi-year (2021-2024)', '260+ responses', 'Auto-save'], icon: FileText, color: 'from-green-500 to-emerald-500', count: 260 },
            { category: 'Analytics', items: ['Visual dashboards', 'Cross-year comparison', 'Export capability'], icon: BarChart3, color: 'from-purple-500 to-violet-500', count: '100%' },
            { category: 'Network', items: ['Member directory', 'Profile management', 'Search & filter'], icon: Users, color: 'from-orange-500 to-red-500', count: '200+' },
            { category: 'AI Assistant', items: ['PortIQ chatbot', 'Data insights', 'Query support'], icon: Brain, color: 'from-pink-500 to-rose-500', count: 'AI' },
            { category: 'Admin', items: ['User management', 'Application workflow', 'Bulk operations'], icon: Settings, color: 'from-indigo-500 to-blue-500', count: 'Full' },
          ].map((feat, idx) => (
            <Card key={idx} className="border-2 border-[#28098d] hover:shadow-2xl transition-all hover:scale-105 group">
              <CardContent className="p-6">
                <div className={`w-16 h-16 bg-gradient-to-br ${feat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-[#28098d]">{feat.category}</h3>
                  <Badge className="bg-[#28098d] text-white">{feat.count}</Badge>
                </div>
                <ul className="space-y-2">
                  {feat.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
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

    // Slide 8: New Intelligent Features
    <div key="slide-8" className="min-h-full bg-white py-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#f8b521] to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">New Intelligent Features</h2>
          </div>
          <div className="w-40 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        {/* AI Company Checker */}
        <Card className="mb-6 border-2 border-[#f8b521] bg-gradient-to-br from-[#fef9e7] to-white shadow-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#f8b521] to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <Badge className="bg-[#28098d] text-white mb-2">NEW</Badge>
                <h3 className="text-3xl font-bold text-[#28098d]">AI-Powered Company Checker</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Automatically searches all survey years (2021-2024) for company matches',
                'Fuzzy matching identifies similar company names across different surveys',
                'Consolidates survey data under one email - solving the multi-email problem',
                'Provides default credentials for returning members to access all their data',
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-[#f8b521]">
                  <Star className="w-5 h-5 text-[#f8b521] mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* DevTasks */}
          <Card className="border-2 border-[#28098d] hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#28098d] to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#28098d]">DevTasks Dashboard</h3>
              </div>
              <ul className="space-y-3">
                {['Feedback collection from all pages', 'Priority & status tracking', 'Admin-only secure access'].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#28098d] mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Feedback Button */}
          <Card className="border-2 border-[#f8b521] bg-[#fef9e7] hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f8b521] to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#28098d]">Floating Feedback Button</h3>
              </div>
              <ul className="space-y-3">
                {['Available on every page', 'Captures page context automatically', 'Direct pipeline to DevTasks'].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#f8b521] mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">08</div>
      </div>
    </div>,

    // Slide 9: How Technology Supports Strategy
    <div key="slide-9" className="min-h-full bg-gradient-to-br from-white via-[#e8e5f5] to-[#fef9e7] py-6 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">How Technology Supports Strategy</h2>
          </div>
          <div className="w-56 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-6">
          {[
            { area: 'Fundraising', support: 'Data dashboards provide evidence of momentum; relationship tracking in CRM', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
            { area: 'Partnerships', support: 'Narrative consistency through shared templates; engagement analytics', icon: Users, color: 'from-blue-500 to-cyan-500' },
            { area: 'Thought Leadership', support: 'Blog platform, learning hub content management, automated distribution', icon: FileText, color: 'from-purple-500 to-violet-500' },
            { area: 'Network Engagement', support: 'Member directory, survey insights, peer connection facilitation', icon: Globe, color: 'from-orange-500 to-red-500' },
            { area: 'Impact Reporting', support: 'Automated KPI tracking, visual reports, donor dashboard (planned)', icon: BarChart3, color: 'from-pink-500 to-rose-500' },
          ].map((item, idx) => (
            <Card key={idx} className={`border-2 ${idx % 2 === 0 ? 'bg-white border-[#28098d]' : 'bg-[#fef9e7] border-[#f8b521]'} hover:shadow-xl transition-all`}>
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#28098d] mb-2">{item.area}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.support}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">09</div>
      </div>
    </div>,

    // Slide 10: Productivity Discussion Questions
    <div key="slide-10" className="min-h-full bg-gradient-to-br from-white via-[#e8e5f5] to-[#fef9e7] py-6 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#28098d] to-[#f8b521] rounded-xl flex items-center justify-center shadow-lg">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-5xl font-bold text-[#28098d]">Productivity Discussion</h2>
          </div>
          <div className="w-48 h-1.5 bg-[#f8b521] mx-auto rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Processes & Collaboration */}
          <Card className="border-2 border-[#28098d] bg-white hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <RefreshCw className="w-8 h-8 text-[#28098d]" />
                <h3 className="text-2xl font-bold text-[#28098d]">Processes & Collaboration</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span className="text-gray-700">What processes currently slow down team productivity?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span className="text-gray-700">How can we improve collaboration and communication?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span className="text-gray-700">Are roles and responsibilities clearly defined?</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Resources & Measurement */}
          <Card className="border-2 border-[#f8b521] bg-[#fef9e7] hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-[#28098d]" />
                <h3 className="text-2xl font-bold text-[#28098d]">Resources & Measurement</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span className="text-gray-700">What training or resources would help efficiency?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span className="text-gray-700">How do we measure and track team performance?</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#f8b521]">•</span>
                  <span className="text-gray-700">Who is responsible/accountable for key outcomes?</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tools & Technology Role */}
        <Card className="border-2 border-[#28098d] bg-[#e8e5f5] mb-6 hover:shadow-xl transition-all">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-[#28098d]" />
              <h3 className="text-2xl font-bold text-[#28098d]">Technology & Fundraising</h3>
            </div>
            <p className="text-gray-700 text-lg mb-4">What role should technology and data play in enhancing fundraising initiatives?</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {[
                { icon: BarChart3, label: 'Data Insights', desc: 'Evidence-based storytelling' },
                { icon: Users, label: 'Relationship Tracking', desc: 'CRM & engagement' },
                { icon: TrendingUp, label: 'Impact Metrics', desc: 'Outcome visualization' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-4 text-center border border-[#f8b521]">
                  <item.icon className="w-6 h-6 text-[#28098d] mx-auto mb-2" />
                  <p className="font-semibold text-[#28098d] mb-1">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-[#f8b521] bg-[#fef9e7] shadow-xl">
          <CardContent className="p-6">
            <p className="text-[#28098d] font-bold text-center text-lg">
              Focus: Cycle time | Rework | Bottlenecks — Not individual output volume
            </p>
          </CardContent>
        </Card>
        <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">10</div>
      </div>
    </div>,

    // Slide 11: Thank You
    <div key="slide-11" className="min-h-full flex flex-col bg-gradient-to-br from-[#28098d] via-[#1e0758] to-[#28098d] text-white relative overflow-hidden py-6">
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f8b521] rounded-full blur-[150px] opacity-20"></div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-start relative z-10 px-6 pt-12">
        <div className="mb-8 animate-fade-in">
          <img src="/CCF_ColorLogoHorizontal (1).png" alt="CFF Logo" className="h-24 mx-auto drop-shadow-2xl" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
        </div>
        <div className="w-32 h-1.5 bg-[#f8b521] mb-8 mx-auto rounded-full"></div>
        <h2 className="text-8xl font-bold mb-6 text-center">Thank You</h2>
        <p className="text-4xl text-[#f8b521] mb-12 font-semibold">Questions & Discussion</p>
        <div className="text-center space-y-3">
          <p className="text-xl text-gray-300">Session 3 | Day 1</p>
          <p className="text-lg text-gray-400">CFF Tools, Website & Team Productivity</p>
          <p className="text-base text-gray-500 mt-6">29th January 2026</p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-transparent via-[#f8b521] to-transparent"></div>
      <div className="absolute bottom-6 right-8 text-white/40 text-sm font-mono">11</div>
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
              <span className="text-white font-semibold text-lg">Day 1 Presentation</span>
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

export default Day1Presentation;
