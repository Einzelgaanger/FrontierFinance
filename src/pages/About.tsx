import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, FileText, Rocket, Mail, Twitter, Linkedin, Database, ExternalLink, Shield, Info, Network, BookOpen, Calendar, Handshake } from "lucide-react";

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white scrollbar-hide overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/CFF.jpg)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Top Left Logo */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <Link to="/">
            <img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </Link>
        </div>

        {/* Top Nav - Homepage UI/UX */}
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
              About
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Collaborative for Frontier Finance
          </h1>
          <p className="text-lg sm:text-xl text-white/95 max-w-3xl">
            The Collaborative for Frontier Finance is a multi-stakeholder initiative that aims to increase access to capital for small and growing businesses in emerging markets.
          </p>
        </div>
      </section>

      {/* Why Frontier Finance */}
      <section className="py-16 sm:py-24 bg-amber-50 relative overflow-hidden rounded-t-[2rem] -mt-8">
        <div className="absolute top-0 left-0 right-0 h-12 bg-amber-50 rounded-t-[2rem]"></div>
        <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="hidden md:block absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
              Context
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Why Frontier Finance
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6"></div>
          <p className="text-base text-gray-700 leading-relaxed mb-6 max-w-4xl">
            Small and growing businesses (SGBs) create roughly <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">80%</span> of formal employment opportunities in frontier and emerging markets, making them an essential part of every economy and an important lever for social and environmental impact. However, SGBs face an estimated <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">$940B</span> financing gap in appropriate capital they need to grow.
          </p>
          <p className="text-base text-gray-700 leading-relaxed max-w-4xl">
            SGBs are often called the &quot;missing middle&quot; because few investment models are tailored to their needs. They are too big for microfinance, too small for private equity, too risky and lack sufficient collateral for commercial banks, and lack the growth trajectory that venture capital seeks. Additionally, because SGBs require small amounts of capital to grow, the cost of conducting the transaction is often disproportionately high relative to the size of the investment.
          </p>
        </div>
      </section>

      {/* Vision and Mission */}
      <section className="py-16 sm:py-24 relative overflow-hidden bg-white">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block mb-3">
                <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
                  Our Purpose
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
                Our Vision and Mission
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6"></div>
              <p className="text-base text-gray-700 leading-relaxed">
                To achieve a sustainable and growing small business finance ecosystem in Africa and beyond by addressing the &quot;missing middle&quot; financing gap. We do this by supporting and enabling local capital providers to accelerate financing solutions that target small and growing businesses in frontier markets.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[300px] sm:h-[400px]">
              <img src="/home.png" alt="CFF Vision" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 sm:py-24 bg-amber-50 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="inline-block mb-3">
              <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
                Our Approach
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
              How We Work
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-6"></div>
            <p className="text-base text-gray-700 leading-relaxed max-w-4xl mb-8">
              We work with diverse stakeholders – including fund managers, funders, and fieldbuilders – to accelerate financing solutions that target SGBs. We aim to set a common action agenda for SGB finance; to test and scale promising financing models; and to facilitate the flow of capital to the SGB market. With a bias to action, CFF works with stakeholders to identify, co-design and launch initiatives – or specific solutions that table SGB financing challenges – that are too complex for any one stakeholder to launch on their own. We do this in three ways:
            </p>
          </div>

          {/* Three Pillars */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/home.png" alt="Network" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mb-3"></div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent mb-2">Network</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We connect stakeholders facing similar pain-points to a peer network of actors operating with shared principles, values, and ambitions to learn from and support one another.
                </p>
              </div>
            </div>
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/eeee.png" alt="Actionable Research" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="w-12 h-1 bg-gradient-to-r from-purple-600 to-purple-400 mb-3"></div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-500 bg-clip-text text-transparent mb-2">Actionable Research</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We facilitate research on hot topics to improve transparency within the sector, provide a practical guide for those less familiar with the sector, and dispel common misconceptions.
                </p>
              </div>
            </div>
            <div className="relative bg-white/80 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/12.png" alt="Initiatives" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="w-12 h-1 bg-gradient-to-r from-amber-600 to-orange-500 mb-3"></div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent mb-2">Initiatives</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  We identify concrete initiatives which CFF can take ownership of to provide tangible support to the broader early-stage investing sector. Through leveraging the resources of the CFF network, we&apos;re working to amplify the voices of local capital providers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact of SGB Financing */}
      <section className="py-24 relative overflow-hidden rounded-t-[3rem] -mt-4 bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-3">
              <span className="px-6 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full text-green-400 text-sm font-semibold border border-green-500/30">
                Sustainable Development
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-green-300 to-emerald-300 bg-clip-text text-transparent mb-4">
              The Impact of SGB Financing
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 mx-auto mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Increasing appropriate capital available for SGBs will directly contribute to achieving the Sustainable Development Goals:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-gray-800">
                <img src="/Job%20Creation.png" alt="Job Creation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; (e.target as HTMLImageElement).className = "w-full h-full object-cover"; }} />
              </div>
              <h3 className="text-lg font-bold text-green-400 mb-2">Job Creation</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-2">Create new, quality, and long-term jobs that increase incomes</p>
              <p className="text-xs text-gray-500">(Goals 1, 8, and 10)</p>
            </div>
            <div className="group">
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-gray-800">
                <img src="/Goods%20and%20Services.png" alt="Goods and Services" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; (e.target as HTMLImageElement).className = "w-full h-full object-cover"; }} />
              </div>
              <h3 className="text-lg font-bold text-blue-400 mb-2">Goods and Services</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-2">Provide access to essential goods and services like health, education, transportation, and more</p>
              <p className="text-xs text-gray-500">(Goals 2, 3, 4, 6, 7, and 12)</p>
            </div>
            <div className="group">
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-gray-800">
                <img src="/Value%20Chain.png" alt="Value Chain" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; (e.target as HTMLImageElement).className = "w-full h-full object-cover"; }} />
              </div>
              <h3 className="text-lg font-bold text-purple-400 mb-2">Value Chain</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-2">Integrate small businesses into supply chains, creating broader economic opportunities</p>
              <p className="text-xs text-gray-500">(Goals 2, 3, 4, 6, 7, and 12)</p>
            </div>
            <div className="group">
              <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-gray-800">
                <img src="/Innovation.png" alt="Innovation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; (e.target as HTMLImageElement).className = "w-full h-full object-cover"; }} />
              </div>
              <h3 className="text-lg font-bold text-orange-400 mb-2">Innovation</h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-2">Catalyze new approaches to serve customers in frontier markets in business model, strategy, and distribution</p>
              <p className="text-xs text-gray-500">(Goals 2, 3, 4, 6, 7, and 12)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Team */}
      <section className="py-24 bg-amber-50 relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-block mb-3">
              <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">
                Meet the Team
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
              Our Core Team
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="shrink-0 w-48 h-64 sm:w-56 sm:h-72 rounded-2xl overflow-hidden self-center sm:self-start">
                <img src="/drewimage.webp" alt="Drew von Glahn" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
              </div>
              <div className="flex-1 w-full min-w-0 pt-6 sm:pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Drew von Glahn</h3>
                <p className="text-sm font-semibold text-blue-700 mb-4">Executive Director</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Drew is the Executive Director of the Collaborative for Frontier Finance. A twenty-five year veteran of Wall Street, he has led over $30 billion in capital transactions across the globe, including a number of &quot;first-of-kind&quot; financings in the emerging and developed markets. His career includes CEO of a social venture business, co-founder of a leading advisory firm for social impact bonds, executive of VC tech fund, and CFO of a fintech start-up. He managed the World Bank&apos;s venture philanthropy fund, a portfolio of over 100 early-stage enterprises. Leveraging his risk underwriting and capital markets experience, Drew has been actively engaged in the establishment of new impact capital financing vehicles for growth-oriented small businesses across the emerging markets; as well as engaged on investment committees for impact-oriented players; including Calvert Impact Capital, Nordic Development Fund&apos;s Catalyst Facility and Nyala Ventures.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="shrink-0 w-48 h-64 sm:w-56 sm:h-72 rounded-2xl overflow-hidden self-center sm:self-start">
                <img src="/arnoldimage.webp" alt="Arnold Byarugaba" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
              </div>
              <div className="flex-1 w-full min-w-0 pt-6 sm:pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Arnold Byarugaba</h3>
                <p className="text-sm font-semibold text-blue-700 mb-4">Chief Operations Officer & Head of Networks</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Arnold has 17 years of experience in finance, including Impact Investing with a focus on Small and Growing Businesses, having supported financing to businesses across sectors. While at Standard Bank Group, he specialised in structuring risk management solutions for FX, Interest Rate and Credit Risk. His Capital Markets experience includes managing a segregated investment portfolio of US$2B in stocks, bonds, private equity, and real estate at Stanlib East Africa, where he launched the first Unit Trust Funds in Uganda. He has also been involved in several Market System Development initiatives like development of the Startup Act and BDS standards in Uganda. He most recently served as Investment Director at Iungo Capital and Head of Entrepreneurship and MSME Finance at Mastercard Foundation. He is an African Angel Investor and holds an MBA from Heriot-Watt University and a BSc. Actuarial Science and Financial Mathematics from the University of Pretoria and Executive training from Harvard Business School.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="shrink-0 w-48 h-64 sm:w-56 sm:h-72 rounded-2xl overflow-hidden self-center sm:self-start">
                <img src="/gilaimage.webp" alt="Gila Norich" className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
              </div>
              <div className="flex-1 w-full min-w-0 pt-6 sm:pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Gila Norich</h3>
                <p className="text-sm font-semibold text-blue-700 mb-4">Investment & Impact Finance Professional</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Gila is an investment and impact finance professional with over 15 years of experience at the intersection of capital markets, impact strategy, and ecosystem building. She works with CFF to deepen the learning agenda and expand the flow of catalytic and institutional capital to small business growth funds across Africa and emerging markets. Her career spans roles in impact investing, ESG, and advisory—guiding family offices, DFIs, and philanthropic foundations on structuring blended finance vehicles, developing impact measurement frameworks, and aligning investments to the SDGs. She has advised the Bank of Zambia on structuring a national SME fund-of-funds, co-authored market-shaping research on small business finance, and supported local capital providers in advancing innovative instruments. She holds an MBA and brings a strong background in building partnerships.
                </p>
              </div>
            </div>

            <div className="flex flex-col bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-10 shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="shrink-0 w-48 h-64 sm:w-56 sm:h-72 rounded-2xl overflow-hidden self-center sm:self-start">
                <img src="/lisaimage.webp" alt="Lisa Mwende" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }} />
              </div>
              <div className="flex-1 w-full min-w-0 pt-6 sm:pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Lisa Mwende</h3>
                <p className="text-sm font-semibold text-blue-700 mb-4">Operations Manager</p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Lisa is the CFF Operations Manager. She is an accomplished professional in finance and operations with seven years of experience. She has worked for international organisations supporting teams across Africa to streamline processes, manage operations and implement projects worth millions of dollars within budget. Lisa has demonstrated and proven knowledge of financial management and oversight. She previously worked at ANDE, where she was overseeing finance operations in Africa. She has a bachelor&apos;s degree in Commerce from Kabarak University in Kenya and is currently pursuing a master&apos;s degree in Project Management.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link to="/partnership">
              <Button className="group border-2 border-blue-600 text-blue-700 hover:bg-blue-50 bg-white px-8 py-4 text-base font-semibold shadow-xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 rounded-full">
                <span className="flex items-center gap-2">
                  See Partners
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </Link>
          </div>
        </div>
        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
        `}</style>
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

export default About;
