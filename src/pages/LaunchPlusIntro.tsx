import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users, TrendingUp, Rocket } from 'lucide-react';

const LaunchPlusIntro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white scrollbar-hide overflow-x-hidden">
      {/* Hero Section with Background Image */}
      <section className="relative min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/CFF2025(Day2)-87+(1).webp)' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/75 to-purple-900/80"></div>
        
        {/* Hero Content */}
        <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6 animate-scale-in">
              <div className="p-6 bg-white/10 rounded-full backdrop-blur-sm shadow-2xl">
                <Rocket className="h-20 w-20 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in drop-shadow-lg">
              LAUNCH+ Capital Facility
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl text-white/95 mb-8 sm:mb-10 max-w-4xl mx-auto font-medium animate-fade-in-delay px-2">
              Accelerating Small Business Growth Funds Across Africa
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/launch-plus-assessment')}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 sm:px-12 py-6 sm:py-7 text-lg sm:text-xl font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full animate-slide-up"
            >
              Start Application
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-16 overflow-hidden rounded-t-[3rem] bg-amber-50 -mt-12">
        <div className="absolute top-0 left-0 right-0 h-14 bg-amber-50 rounded-t-[3rem]"></div>
        
        {/* Floating Orbs */}
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="hidden md:block absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Content Card */}
          <Card className="bg-white/95 backdrop-blur-md shadow-2xl mb-8 rounded-3xl border-0 hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-6">
              <CardTitle className="text-3xl sm:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold">
                About LAUNCH+
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-base sm:text-lg leading-relaxed">
              <p className="text-gray-700">
                <span className="font-bold text-blue-600">LAUNCH+</span> is an integrated Mauritius domiciled fund administration platform, 
                structured as a registered Variable Capital Company (VCC) vehicle, developed by the 
                Collaborative for Frontier Finance (CFF) together with its network of Small Business 
                Growth Fund Managers.
              </p>

              <p className="text-gray-700">
                The platform is designed to accelerate the flow of "fit for purpose" financing to Africa's 
                growth-oriented small businesses - key drivers of job creation and economic resilience. 
                CFF research shows there are now over <span className="font-bold text-purple-600">100 Small Business Growth Funds (GFs)</span> aiming 
                to deploy <span className="font-bold text-purple-600">$2.25bn</span> in funding to support the growth of Africa's "missing middle," 
                yet to date, these funds have only been able to secure 1/3rd of the institutional and 
                development capital they are targeting.
              </p>

              <p className="text-gray-700">
                The platform is designed to accelerate cohorts of GFs, providing support needed to refine 
                their investment strategies, attract institutional and development capital and scale more 
                rapidly. By offering cost-efficient shared services, LAUNCH+ ensures world class governance 
                and operational performance.
              </p>
            </CardContent>
          </Card>

          {/* Services Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Shared Services
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
                  <p className="text-sm font-semibold text-purple-700">
                    Mandatory, Phase I (Partially Subsidized)
                  </p>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start p-2 rounded-xl hover:bg-purple-50 transition-colors">
                    <span className="text-purple-600 mr-3 text-xl">•</span>
                    <span className="leading-relaxed">Shared back-office services (accounting, finance, tax, legal, HR)</span>
                  </li>
                  <li className="flex items-start p-2 rounded-xl hover:bg-purple-50 transition-colors">
                    <span className="text-purple-600 mr-3 text-xl">•</span>
                    <span className="leading-relaxed">Fund administration services</span>
                  </li>
                  <li className="flex items-start p-2 rounded-xl hover:bg-purple-50 transition-colors">
                    <span className="text-purple-600 mr-3 text-xl">•</span>
                    <span className="leading-relaxed">Capacity building and knowledge services</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-3xl border-0 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Capital Support
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="inline-block mb-4 px-4 py-2 bg-green-100 rounded-full">
                  <p className="text-sm font-semibold text-green-700">
                    Optional, Phase II (Repayable)
                  </p>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start p-2 rounded-xl hover:bg-green-50 transition-colors">
                    <span className="text-green-600 mr-3 text-xl">•</span>
                    <span className="leading-relaxed">Op-Ex line of credit</span>
                  </li>
                  <li className="flex items-start p-2 rounded-xl hover:bg-green-50 transition-colors">
                    <span className="text-green-600 mr-3 text-xl">•</span>
                    <span className="leading-relaxed">Warehousing line of credit</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 shadow-2xl rounded-3xl border-0 hover:shadow-blue-500/20 transition-all duration-300">
            <CardContent className="py-12 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Are You an Early Stage Fund Manager?
              </h2>
              <p className="text-white/95 text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
                If you are fundraising with an existing investment vehicle and struggling with 
                fund setup, administration, and achieving first close, we would like to hear from you.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/launch-plus-assessment')}
                className="group bg-white text-blue-700 hover:bg-white/90 text-lg sm:text-xl px-10 sm:px-14 py-6 sm:py-7 h-auto shadow-2xl rounded-full font-bold hover:scale-110 transition-all duration-300"
              >
                Start Questionnaire
                <ArrowRight className="ml-3 h-6 sm:h-7 w-6 sm:w-7 group-hover:translate-x-2 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Custom Animations */}
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
      `}</style>
    </div>
  );
};

export default LaunchPlusIntro;