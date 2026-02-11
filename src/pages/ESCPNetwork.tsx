import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Mail, Twitter, Linkedin, Database, ExternalLink, Shield, Info, Network, BookOpen, Calendar, Handshake, Rocket } from "lucide-react";

const ESCPNetwork = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white scrollbar-hide overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/home.png)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Top Left Logo */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <Link to="/">
            <img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </Link>
        </div>

        {/* Top Nav */}
        <nav className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-wrap items-center justify-end gap-1 sm:gap-1.5">
          <Link to="/about" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                <span>About</span>
              </div>
            </Button>
          </Link>
          <Link to="/escp-network" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Network className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                <span>Network</span>
              </div>
            </Button>
          </Link>
          <Link to="/learning-hub" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                <span>Learning Hub</span>
              </div>
            </Button>
          </Link>
          <Link to="/our-events" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                <span>Our Events</span>
              </div>
            </Button>
          </Link>
          <Link to="/escp-network" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                <span>ESCP Network</span>
              </div>
            </Button>
          </Link>
          <Link to="/partnership" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Handshake className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                <span>Partnership</span>
              </div>
            </Button>
          </Link>
          <Link to="/launch-plus-intro" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5">
                <Rocket className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" />
                <span>Explore LAUNCH+</span>
              </div>
            </Button>
          </Link>
        </nav>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
              ESCP Network
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Early Stage Capital Provider Network
          </h1>
          <p className="text-lg sm:text-xl text-white/95 max-w-3xl">
            Sharing learnings, best practices, and working collectively to find innovative solutions for emerging capital providers.
          </p>
        </div>
      </section>

      {/* About the ESCP Network */}
      <section className="py-16 sm:py-24 bg-amber-50 relative overflow-hidden rounded-t-[2rem] -mt-8">
        <div className="absolute top-0 left-0 right-0 h-12 bg-amber-50 rounded-t-[2rem]"></div>
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
              About the ESCP Network
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            ESCP Network
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6"></div>
          <p className="text-base text-gray-700 leading-relaxed max-w-4xl mb-6">
            The ESCP Network&apos;s approach is to share learnings, best practices, and work collectively to find innovative solutions to challenges faced by emerging capital providers. We currently have <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">100-plus members</span>, primarily based in Africa, who focus on the capital needs of Small, Growing Businesses (SGBs). Our members focus on investments ranging from $20k to $500k.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[250px] sm:h-[320px]">
              <img src="/home.png" alt="ESCP Network" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">$20K – $500K</span> investment range<br />
                <span className="font-semibold text-gray-900">30+ countries</span> across five regions<br />
                <span className="font-semibold text-gray-900">100+ members</span> and growing
              </p>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 7s infinite; }
        `}</style>
      </section>

      {/* Why It Matters */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
              Context
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Why It Matters
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-8"></div>
          
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <p className="leading-relaxed">
              ESCPs are investment vehicles that typically manage ≤$20M and invest with $50K–500K with an &apos;equity mindset&apos; into early stage companies that have the ability to grow. Given these characteristics, ESCPs play a unique role in entrepreneurial and financing ecosystems – they take high risk to nurture companies to the point at which later stage investors can invest to scale. They fill an important gap in the capital value chain because the type of company in focus is often too large for microfinance and lacks the profile required for traditional venture capital. Because of ESCPs, early-stage businesses can access a source of value-added capital without a fully validated business model and a long track record.
            </p>
            <p className="leading-relaxed">
              However, ESCPs face challenging economic models when investing in SGBs. The cost to source, perform due diligence, and manage an investment is high relative to the ticket size and risk-adjusted returns. As a result, LPs and other investors tend to shy away from this segment of the market and ESCPs are undercapitalized in two ways: they lack experimental capital to test and refine the business and operating model required to serve SGBs, and they struggle to scale.
            </p>
            <p className="leading-relaxed">
              To address these issues, support is needed to help identify and validate the investment models that are most appropriate and financially scalable and to de-risk institutional investors who are not currently investing in ESCP vehicles.
            </p>
          </div>
          
          <div className="mt-8">
            <Button variant="outline" className="group border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold">
              <span className="flex items-center gap-2">
                Click for full summary
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </Button>
          </div>
        </div>
      </section>

      {/* Progress to Date */}
      <section className="py-16 sm:py-24 bg-amber-50 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
              Our Journey
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Progress to Date
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-8"></div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-blue-800 mb-2">January 2020 – Nairobi, Kenya</h3>
              <p className="text-gray-700 leading-relaxed">
                We brought together 30 early stage capital providers with the goals of fostering peer-to-peer learnings and a network for collective action, as well as identifying priority initiatives for the Collaborative to take forward. Following the Nairobi convening, we launched five working groups for priority focus areas, a series of webinars on hot topics featuring subject matter experts, and a Slack platform for ongoing network collaboration.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-blue-800 mb-2">February 2021 – Virtual Convening</h3>
              <p className="text-gray-700 leading-relaxed">
                We hosted a second annual convening virtually, bringing almost 50 members together in 4 consecutive sessions over 2 weeks, including a final session on &apos;Demystifying frontier finance&apos; where we were joined by several investors/LPs for a dialogue on hot topics such as open ended vehicles, early stage equity, gender lens investing and angel investing / engaging local co-investors.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-blue-800 mb-2">June 2022 – Dar es Salaam, Tanzania</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We held our Annual Convening in-person. The event hosted 45 early stage capital providers from across SSA, MENA and South Asia managing a range of closed and open-ended investment vehicles. This group included members from CFF&apos;s ESCP network, the LAUNCH Program cohort, the 2X Collaborative network and the Women in Africa Investments network and the I&P portfolio. At the event, we were also joined by 15 institutional capital holders and field builders, including the newly launched Nyala Venture, as well as participation from soon to be launched initiatives by 2X Collaborative and Mastercard/MEDA/I&P, representing an estimated <span className="font-bold text-emerald-700">$200 million</span> in new fund of funds/warehousing facilities for 1st-time managers.
              </p>
              <p className="text-base font-semibold text-gray-900">
                The network has now grown to over <span className="text-blue-700">100 members</span> across <span className="text-blue-700">30 countries</span> and five regions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Can I Get Involved */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 text-sm font-semibold">
              Join Us
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            How Can I Get Involved?
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-8"></div>
          
          <div className="max-w-3xl">
            <p className="text-base text-gray-700 leading-relaxed mb-8">
              If you are an early stage capital provider who would like to join our network, reach out to Arnold Byarugaba at{" "}
              <a href="mailto:arnold@frontierfinance.org" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">
                arnold@frontierfinance.org
              </a>{" "}
              to learn more.
            </p>
            <p className="text-base text-gray-700 leading-relaxed mb-8">
              You can also complete this expression of interest form which will be reviewed by a peer committee from the network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/application">
                <Button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                  <span className="flex items-center gap-2">
                    Expression of Interest
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" className="group border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-full font-semibold">
                  <span className="flex items-center gap-2">
                    Learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-blue-950 to-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex justify-start mb-4">
                <Link to="/">
                  <img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-16 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </Link>
              </div>
              <p className="text-gray-300 mb-6 text-base leading-relaxed max-w-md">
                A multi-stakeholder initiative increasing access to capital for small and growing businesses in emerging markets through networks, research, and initiatives.
              </p>
              <a href="mailto:info@frontierfinance.org" className="flex items-center space-x-3 text-blue-300 hover:text-blue-200 transition-colors group">
                <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">info@frontierfinance.org</span>
              </a>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-base flex items-center">
                <Database className="w-4 h-4 mr-2" />
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-blue-300 hover:text-blue-200 transition-colors">About</Link></li>
                <li><Link to="/escp-network" className="text-blue-300 hover:text-blue-200 transition-colors">Network</Link></li>
                <li><Link to="/learning-hub" className="text-blue-300 hover:text-blue-200 transition-colors">Learning Hub</Link></li>
                <li><Link to="/our-events" className="text-blue-300 hover:text-blue-200 transition-colors">Our Events</Link></li>
                <li><Link to="/escp-network" className="text-blue-300 hover:text-blue-200 transition-colors">ESCP Network</Link></li>
                <li><Link to="/partnership" className="text-blue-300 hover:text-blue-200 transition-colors">Partnership</Link></li>
                <li>
                  <Link to="/auth" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group">
                    <ExternalLink className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />
                    Login / Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-base flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Connect With Us
              </h3>
              <p className="text-gray-400 text-sm mb-4">Follow us for updates on small business finance and network news</p>
              <div className="flex space-x-3">
                <a href="https://twitter.com/CollabFFinance" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a href="https://www.linkedin.com/company/collaborative-for-frontier-finance/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-blue-300 text-sm mb-2 md:mb-0">© 2025 Collaborative for Frontier Finance. All rights reserved.</p>
              <div className="flex space-x-4 text-sm">
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Privacy Policy</a>
                <span className="text-blue-600">•</span>
                <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ESCPNetwork;
