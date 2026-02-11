import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Network, Users, Rocket, BookOpen, Database, Globe, Calendar, FileText, Target, Shield, Gauge, MessageSquare, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const NAVY = '#28098d';
const GOLD = '#f8b521';

const Day2Presentation = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 7;

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
    // 1. Hero
    <div key="hero" className="min-h-full flex flex-col bg-gradient-to-br from-[#28098d] via-[#1e0758] to-[#28098d] text-white relative overflow-hidden py-12">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f8b521] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#f8b521] rounded-full blur-[120px]" />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 px-6">
        <img src="/CCF_ColorLogoHorizontal (1).png" alt="CFF Logo" className="h-20 mx-auto mb-8 drop-shadow-lg" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
        <div className="w-24 h-1 bg-[#f8b521] mb-8 mx-auto" />
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-6 leading-tight">Data & Technology<br />Strategic Plan</h1>
        <Badge className="bg-[#f8b521] text-[#28098d] text-lg px-6 py-2 mb-6">DATA and TECHNOLOGY PLAN: ALFRED</Badge>
        <div className="flex items-center gap-6 text-white/90">
          <span className="flex items-center gap-2"><Calendar className="w-5 h-5 text-[#f8b521]" /> Session 3 · Day 2</span>
          <span className="flex items-center gap-2"><Users className="w-5 h-5 text-[#f8b521]" /> Presented by Alfred</span>
        </div>
        <p className="text-white/70 mt-8">30th January 2026 · Fair Acres Nairobi</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f8b521]/50" />
      <div className="absolute bottom-6 right-8 text-white/40 text-sm font-mono">01</div>
    </div>,

    // 2. Agenda — six platforms overview
    <div key="agenda" className="min-h-full bg-[#fef9e7] py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-[#28098d] rounded-xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-[#28098d] mb-2">Today's agenda</h2>
          <p className="text-gray-600">Six key platforms we'll cover</p>
          <div className="w-24 h-1 bg-[#f8b521] mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { num: '01', title: 'Fund Manager Portal and Its Features', desc: 'The central hub for members: dashboard, profiles, surveys, and directory.', icon: Network, color: 'from-blue-500 to-blue-600' },
            { num: '02', title: 'Member Onboarding', desc: 'Application flow, approval, and first steps into the community.', icon: Users, color: 'from-purple-500 to-purple-600' },
            { num: '03', title: 'Launch+ Platform', desc: 'Assessment and growth support for early-stage fund managers.', icon: Rocket, color: 'from-emerald-500 to-emerald-600' },
            { num: '04', title: 'Learning Hub', desc: 'Resources, training, webinars, and best practices for continuous learning.', icon: BookOpen, color: 'from-orange-500 to-orange-600' },
            { num: '05', title: 'Survey Database', desc: 'Data collection, analytics, and insights for fund performance and impact.', icon: Database, color: 'from-pink-500 to-pink-600' },
            { num: '06', title: 'Refreshed Website', desc: 'Public site: SEO, modern design, and engagement to attract new members.', icon: Globe, color: 'from-indigo-500 to-indigo-600' },
          ].map((item) => (
            <Card key={item.num} className="border-2 border-[#e8e5f5] bg-white hover:border-[#28098d] transition-all shadow-sm">
              <CardContent className="p-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-[#28098d] text-white text-xs mb-2">{item.num}</Badge>
                <h3 className="font-bold text-[#28098d] text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">02</div>
    </div>,

    // 3. Fund Manager Portal (deep dive)
    <div key="portal" className="min-h-full bg-white py-12 px-8">
      <div className="max-w-4xl mx-auto flex flex-col justify-center min-h-full">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
          <Network className="w-8 h-8 text-white" />
        </div>
        <Badge className="w-fit bg-[#28098d] text-white mb-3">Platform 01</Badge>
        <h2 className="text-4xl font-bold text-[#28098d] mb-4">Fund Manager Portal and Its Features</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          The central hub where fund managers access their profiles, manage data, and interact with the CFF network. Includes dashboard analytics, survey management, and member directory features.
        </p>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2"><span className="text-[#f8b521]">•</span> Dashboard and analytics</li>
          <li className="flex items-center gap-2"><span className="text-[#f8b521]">•</span> Survey management</li>
          <li className="flex items-center gap-2"><span className="text-[#f8b521]">•</span> Member directory</li>
        </ul>
      </div>
      <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">03</div>
    </div>,

    // 4. Member Onboarding + Launch+
    <div key="onboard-launch" className="min-h-full bg-[#fef9e7] py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#28098d] text-center mb-8">Member journey & growth</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2 border-[#e8e5f5] bg-white">
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#28098d] mb-2">Member Onboarding</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Streamlined application, approval, and first steps so new members get up and running quickly.</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#e8e5f5] bg-white">
            <CardContent className="p-6">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-4">
                <Rocket className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#28098d] mb-2">Launch+ Platform</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Assessment tools, mentorship connections, and growth tracking for early-stage fund managers.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">04</div>
    </div>,

    // 5. Learning Hub + Survey Database + Website
    <div key="hub-db-web" className="min-h-full bg-white py-12 px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-[#28098d] text-center mb-8">Learning, data & presence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 border-[#e8e5f5] bg-white">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#28098d] mb-2">Learning Hub</h3>
              <p className="text-gray-600 text-sm">Resources, training, webinars, and best practices.</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#e8e5f5] bg-white">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-3">
                <Database className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#28098d] mb-2">Survey Database</h3>
              <p className="text-gray-600 text-sm">Data collection, analytics, and impact insights.</p>
            </CardContent>
          </Card>
          <Card className="border-2 border-[#e8e5f5] bg-white">
            <CardContent className="p-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#28098d] mb-2">Refreshed Website</h3>
              <p className="text-gray-600 text-sm">Public site, SEO, and engagement for new members.</p>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">05</div>
    </div>,

    // 6. Discussion — eight questions (with icons)
    <div key="questions" className="min-h-full bg-[#e8e5f5] py-12 px-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: 'What is the current stage or level of our data infrastructure and technology stack?', icon: Database },
            { q: 'Which technologies are currently being prioritized for development and why?', icon: Zap },
            { q: 'What is the roadmap for delivery of the various tech/tools and enablements?', icon: Target },
            { q: 'How do we ensure data integrity, accuracy, and compliance with best practice?', icon: Shield },
            { q: 'How do we balance the need for technology and its development with cost-effectiveness and risk management?', icon: Gauge },
            { q: 'What KPIs will track progress and success for data and technology initiatives?', icon: Gauge },
            { q: 'How do we incorporate feedback and lessons learned into development process?', icon: MessageSquare },
            { q: 'What mechanisms ensure agility and adaptability in our technology roadmap?', icon: Zap },
          ].map((item, i) => (
            <Card key={i} className="border border-[#28098d]/20 bg-white">
              <CardContent className="p-4 flex gap-3">
                <item.icon className="w-6 h-6 text-[#28098d] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#f8b521] font-bold text-sm">{i + 1}.</span>
                  <p className="text-gray-700 text-sm leading-relaxed mt-0.5">{item.q}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="absolute bottom-6 right-8 text-gray-400 text-sm font-mono">06</div>
    </div>,

    // 7. Thank you
    <div key="thanks" className="min-h-full flex flex-col bg-gradient-to-br from-[#28098d] via-[#1e0758] to-[#28098d] text-white relative py-12">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <img src="/CCF_ColorLogoHorizontal (1).png" alt="CFF Logo" className="h-24 mx-auto mb-8 drop-shadow-2xl" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
        <div className="w-28 h-1 bg-[#f8b521] mb-8 rounded-full" />
        <h2 className="text-7xl font-bold mb-6">Thank you</h2>
        <p className="text-3xl text-[#f8b521] font-semibold mb-4">Questions & discussion</p>
        <p className="text-white/80 text-lg">Day 2 · Data & Technology · 30th January 2026</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f8b521]/50" />
      <div className="absolute bottom-6 right-8 text-white/40 text-sm font-mono">07</div>
    </div>,
  ];

  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {currentSlide > 0 && (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#28098d] shadow-xl border-b-2 border-[#f8b521]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src="/CCF_ColorLogoHorizontal (1).png" alt="CFF Logo" className="h-10" onError={(e) => {(e.target as HTMLImageElement).style.display = 'none';}} />
              <span className="text-white font-semibold text-lg">Day 2 · Data & Technology</span>
            </div>
            <div className="flex items-center gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentSlide === index ? 'bg-[#f8b521] w-8 shadow-lg' : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </nav>
      )}

      <div className={`relative h-screen overflow-hidden ${currentSlide > 0 ? 'pt-16' : ''}`}>
        <div
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="min-w-full h-full flex-shrink-0 relative overflow-y-auto">
              {slide}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-[#28098d] text-white flex items-center justify-center border-2 border-[#f8b521] shadow-xl ${
          currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:opacity-90'
        }`}
        aria-label="Previous"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>
      <button
        onClick={nextSlide}
        disabled={currentSlide === totalSlides - 1}
        className={`fixed right-6 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-[#28098d] text-white flex items-center justify-center border-2 border-[#f8b521] shadow-xl ${
          currentSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 hover:opacity-90'
        }`}
        aria-label="Next"
      >
        <ChevronRight className="w-7 h-7" />
      </button>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#28098d] text-white px-5 py-2.5 rounded-full text-sm font-mono border-2 border-[#f8b521] shadow-lg">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default Day2Presentation;
