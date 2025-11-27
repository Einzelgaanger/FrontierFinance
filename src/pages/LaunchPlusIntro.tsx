import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, TrendingUp, Rocket } from 'lucide-react';

const LaunchPlusIntro = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white scrollbar-hide overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/home.png)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Hero Content - Distributed Left and Right */}
        <div className="relative z-10 flex items-start min-h-screen px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 md:pt-8">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Left Column */}
            <div className="px-2 sm:px-6 lg:px-8 text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-5 leading-tight">
                LAUNCH+ Capital Facility
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/95 mb-4 sm:mb-5 max-w-3xl font-medium">
                Accelerating Small Business Growth Funds Across Africa
              </p>
              <p className="text-xs sm:text-sm md:text-base text-white/90 mb-8 sm:mb-10 max-w-2xl leading-relaxed">
                An integrated fund administration platform designed to accelerate the flow of "fit for purpose" financing to Africa's growth-oriented small businesses
              </p>

              {/* CTA Content */}
              <div className="space-y-4">
                <div className="inline-block">
                  <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-semibold">
                    Join Us
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent">
                  Are You an Early Stage Fund Manager?
                </h3>
                <p className="text-sm sm:text-base text-white/90 max-w-2xl leading-relaxed">
                  If you are fundraising with an existing investment vehicle and struggling with 
                  fund setup, administration, and achieving first close, we would like to hear from you.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="px-2 sm:px-6 lg:px-8 text-left">
              {/* Shared Services */}
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-purple-800 rounded-lg flex items-center justify-center shadow-lg">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-300 bg-clip-text text-transparent">
                    Shared Services
                  </h3>
                </div>
                <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Mandatory, Phase I (Partially Subsidized)
                  </p>
                </div>
                <ul className="space-y-2 text-sm sm:text-base text-white/90 leading-relaxed ml-11">
                  <li className="flex items-start">
                    <span className="text-purple-300 mr-3 text-lg font-bold">•</span>
                    <span>Shared back-office services (accounting, finance, tax, legal, HR)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-300 mr-3 text-lg font-bold">•</span>
                    <span>Fund administration services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-300 mr-3 text-lg font-bold">•</span>
                    <span>Capacity building and knowledge services</span>
                  </li>
                </ul>
              </div>

              {/* Capital Support */}
              <div className="mb-8 sm:mb-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-700 to-green-800 rounded-lg flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white via-green-200 to-green-300 bg-clip-text text-transparent">
                    Capital Support
                  </h3>
                </div>
                <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <p className="text-xs sm:text-sm font-semibold text-white">
                    Optional, Phase II (Repayable)
                  </p>
                </div>
                <ul className="space-y-2 text-sm sm:text-base text-white/90 leading-relaxed ml-11">
                  <li className="flex items-start">
                    <span className="text-green-300 mr-3 text-lg font-bold">•</span>
                    <span>Op-Ex line of credit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-3 text-lg font-bold">•</span>
                    <span>Warehousing line of credit</span>
                  </li>
                </ul>
              </div>

              {/* Start Questionnaire Button */}
              <div>
                <Button
                  size="lg"
                  onClick={() => navigate('/launch-plus-assessment')}
                  className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-10 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full"
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <Rocket className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-sm sm:text-base">Start Questionnaire</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={sectionRef} className="relative py-8 sm:py-12 md:py-16 overflow-hidden rounded-t-[1.5rem] sm:rounded-t-[2rem] md:rounded-t-[2.5rem] bg-amber-50 -mt-8 sm:-mt-10 md:-mt-12">
        {/* Extra padding at the top to compensate for the negative margin */}
        <div className="absolute top-0 left-0 right-0 h-10 sm:h-14 md:h-18 bg-amber-50 rounded-t-[1.5rem] sm:rounded-t-[2rem] md:rounded-t-[2.5rem]"></div>
        
        {/* Floating Orbs Animation - Hidden on mobile */}
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="hidden md:block absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="hidden md:block absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mt-0 sm:mt-2 md:mt-4">
          {/* Top Section: Title and Image Side by Side */}
          <div className={`grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6 sm:gap-8 mb-8 sm:mb-12 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Title and Content on the Left */}
            <div className="order-1 lg:order-1 flex flex-col justify-center">
              <div className="inline-block mb-2 sm:mb-3">
                <span className="px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-xs sm:text-sm font-semibold">
                  About LAUNCH+
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 sm:mb-4 md:mb-6">
                Accelerating Small Business Growth Funds
              </h2>
              <div className="w-16 sm:w-20 md:w-24 h-1 sm:h-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2 sm:mb-3 md:mb-4"></div>
              
              <div className="space-y-4 sm:space-y-6 text-sm sm:text-base text-gray-700 leading-relaxed">
                <p>
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">LAUNCH+</span> is an integrated Mauritius domiciled fund administration platform, 
                  structured as a registered Variable Capital Company (VCC) vehicle, developed by the 
                  Collaborative for Frontier Finance (CFF) together with its network of Small Business 
                  Growth Fund Managers.
                </p>

                <p>
                  The platform is designed to accelerate the flow of "fit for purpose" financing to Africa's 
                  growth-oriented small businesses - key drivers of job creation and economic resilience. 
                  CFF research shows there are now over <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">100 Small Business Growth Funds (GFs)</span> aiming 
                  to deploy <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">$2.25bn</span> in funding to support the growth of Africa's "missing middle," 
                  yet to date, these funds have only been able to secure 1/3rd of the institutional and 
                  development capital they are targeting.
                </p>
              </div>
            </div>
            
            {/* Large Image on the Right */}
            <div className="order-2 lg:order-2">
              <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-0 shadow-2xl border border-white/20 overflow-hidden group hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[500px]">
                  <img 
                    src="/Launch+1.jpg" 
                    alt="LAUNCH+ Network Gathering" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Image and Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 -mt-6 sm:-mt-8 md:-mt-12">
            {/* Left Column: Second Image */}
            <div className="space-y-4 sm:space-y-6">
              <div className={`transition-all duration-500 delay-100 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl p-0 shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 mt-8 sm:mt-12">
                  <div className="relative h-[200px] sm:h-[250px] md:h-[280px]">
                    <img 
                      src="/Launch+2.jpg" 
                      alt="LAUNCH+ Convening Event" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Platform Description */}
            <div className={`-mt-4 sm:-mt-6 transition-all duration-500 delay-150 ease-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Platform Benefits
              </h3>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
                The platform is designed to accelerate cohorts of GFs, providing support needed to refine 
                their investment strategies, attract institutional and development capital and scale more 
                rapidly. By offering cost-efficient shared services, LAUNCH+ ensures world class governance 
                and operational performance.
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Join a network of fund managers working together to bridge the financing gap for Africa's growing businesses.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Animations CSS */}
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          
          .animate-blob {
            animation: blob 7s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </section>
    </div>
  );
};

export default LaunchPlusIntro;
