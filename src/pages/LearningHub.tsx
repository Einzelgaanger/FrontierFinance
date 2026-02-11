import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Twitter, Linkedin, Database, ExternalLink, Shield, Info, Network, BookOpen, Calendar, Handshake, Rocket, Users, FileText } from "lucide-react";

const LearningHub = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const marketInsights = [
    {
      title: "Empowering Emerging Fund Managers in Underserved Markets",
      excerpt: "Established in 2020 as a business-to-business marketplace connecting African producers to global buyers, Kwely quickly established traction with a revenue-generating model. But within 18 months it was caught in the \"missing middle\" funding gap, a challenge faced by small and growing businesses that are too big for microfinance and too small or risky for traditional bank lending.",
      date: "Dec 20, 2023",
      link: "#",
    },
    {
      title: "Funds of funds provide more than capital for local investors in small and growing businesses",
      excerpt: "An expanding range of financing mechanisms and vehicles are emerging to help private capital providers direct money and resources to their small business communities. Among these, fund of funds are proving to be an instrumental early supply of capital for fund managers investing in small and growing businesses in Africa and the Middle East.",
      date: "Dec 4, 2023",
      link: "#",
    },
    {
      title: "Tapping the creativity of local fund managers to scale small business finance",
      excerpt: "Small businesses are the growth engine for inclusive and resilient development in Africa. Yet the $330 billion annual financing gap remains stubbornly sticky because few financial institutions and investors are prepared to fund small businesses.",
      date: "Oct 17, 2023",
      link: "#",
    },
  ];

  const publications = [
    {
      title: "Reaching Small and Growing Businesses in Frontier Markets - ARIA",
      type: "Full Report",
      desc: "ARIA's Foundations of Growth Publication a DFI-focused initiative by Proparco, British International Investment (BII), and FMO - Dutch entrepreneurial development bank to expand investment in frontier markets. Using examples from the CFF network, our article highlights the investment approaches used by local fund managers to support small and growing businesses in these markets, and offers a set of concrete suggestions on where we hope to see DFIs engage.",
      links: [{ label: "Full Report", href: "#" }],
    },
    {
      title: "CFF Annual Local Capital Provider Survey 2024",
      type: "Preliminary Report",
      desc: "Our Newly Published State of Play Report_Issue Brief No. 1 - The 2024 Annual Survey Report highlights the current state-of-play and trends within small business finance funds. With 100 respondents, an almost twofold increase from last year's survey, the report showcases a new acceleration of growth for the asset class, shifts towards more investor-friendly fund set ups, and continued innovation. Respondents are collectively aiming to raise $2.25 billion to invest into Africa and MENA's small businesses.",
      links: [{ label: "Preliminary Report", href: "#" }],
    },
    {
      title: "African Fund of Fund Platforms: Building the small business finance ecosystem",
      desc: "A new group of public and private fund of funds platforms are achieving system-level changes by efficiently moving institutional capital to local small business growth funds in their markets. Six of those platforms including 2X Global (pan-African), Venture Capital Trust Fund (Ghana), MSMEDA (Egypt), SA SME Fund (South Africa), 27four Black Business Growth Fund (South Africa) and CFF share insights.",
      links: [{ label: "Full report", href: "#" }],
    },
    {
      title: "CFF Annual Local Capital Provider Survey 2023",
      desc: "This year's publication highlights the increasing influence of local capital providers throughout Africa and the Middle East. It categorises the small business finance asset class, delineating their pivotal role in supplying growth capital to businesses and reveals the strategies fund managers are using to build track record, address fund economics and raise capital. The 60 survey respondents aim to secure $1.5 billion in capital, following their investments in 1200 businesses to date.",
      links: [{ label: "Full report", href: "#" }, { label: "Summary", href: "#" }],
    },
    {
      title: "CFF Annual Local Capital Provider Survey 2022",
      desc: "The CFF has developed this survey to assess the \"state-of-play\" with regard to the small business financing sector in Africa and the Middle East. It is designed to better understand the emerging class of LCPs who are a heterogeneous group of indigenous fund managers using alternative structures to provide capital to SGBs in their local markets.",
      links: [{ label: "Full Report", href: "#" }, { label: "Summary infographic", href: "#" }],
    },
    {
      title: "Unlocking Local Pension Fund Capital for Small Business Finance",
      desc: "The purpose of this report is to highlight some of the work of market builders working closely with pension fund industry bodies in South Africa, Ghana and Zambia to unlock capital for small business finance in Africa. While pension funds have historically been deterred by the risk profile, many are considering the de-risked opportunities in this market segment.",
      links: [],
    },
    {
      title: "Launch of Nyala Venture",
      desc: "In partnership with CFF and the facility manager, FSDAi will provide the critical anchor funding for Nyala Venture. Nyala Venture will bridge the funding gap by targeting a new class of capital providers serving small and growing businesses, particularly those led by women or applying a gender lens investment strategy in Nigeria, Ghana, Kenya, Senegal, South Africa, and Uganda.",
      links: [],
    },
    {
      title: "Fund of Funds Vehicles for Small and Growing Businesses Report",
      desc: "A consortium of partners, initiated by the World Economic Forum Global Alliance for Social Entrepreneurship and including CFF, worked with Impact Investing Ghana to accelerate the design and implementation of a Fund of Funds (FoF) investment vehicle that could address some of the key barriers to growth finance for small and growing businesses in Ghana.",
      links: [{ label: "Full Report", href: "#" }, { label: "Executive Summary", href: "#" }],
    },
    {
      title: "The New Operating Environment Facing Latin American Capital Providers",
      desc: "Collaborative for Frontier Finance, Sonen Capital, Fondo de Fondos, and Dalberg - 2020. To better understand the impact of COVID-19 on Latin American impact-oriented capital managers targeting MSMEs, CFF and partners conducted a survey of capital managers supporting MSMEs in the region.",
      links: [],
    },
    {
      title: "Emerging Market Small & Growing Business Capital Provider's Survey Results",
      desc: "Collaborative for Frontier Finance - 2020. To better understand impact of COVID-19 on small and growing businesses and the local capital providers that support them, CFF, with the support of Visa Foundation, conducted a survey of capital managers that target SGBs in emerging markets.",
      links: [],
    },
    {
      title: "Insights on SME Fund Performance: Generating learnings with the potential to catalyse interest and action in SME investing",
      desc: "Shell Foundation, Omidyar Network, and Deloitte - 2019. This report highlights key findings from a SME fund performance study which analyzed data from 365 funds across 5 development finance institutions (DFIs).",
      links: [],
    },
    {
      title: "Closing the Gaps - Finance Pathways for Serving the Missing Middles",
      desc: "2019. The Collaborative for Frontier Finance and its founding members have produced a follow-up report identifying five alternative approaches or \"pathways\" for providing finance that meets the diverse needs of each SGB segment.",
      links: [],
    },
    {
      title: "The Missing Middles - Segmenting Enterprises to Better Understand their Financial Needs",
      desc: "Omidyar Network and the Collaborative for Frontier Finance - 2018. This report aims to help investors, intermediaries, and entrepreneurs better navigate the complex landscape of SGB investment in frontier and emerging markets.",
      links: [],
    },
    {
      title: "Scaling Access to Finance for Early-Stage Enterprises in Emerging Markets",
      desc: "Dutch Good Growth Fund - 2018. This report explores scaling access to finance for early-stage enterprises in emerging markets and shares lessons from the field.",
      links: [],
    },
    {
      title: "Reaching deep in low-income markets: Enterprises achieving impact, sustainability, and scale at the base of the pyramid",
      desc: "Omidyar Network and MacArthur Foundation - 2017. This report explores 20 enterprises that serve people living at the bottom of the pyramid.",
      links: [],
    },
    {
      title: "SME Finance in Sub-Saharan Africa",
      desc: "Shell Foundation and Enclude - 2017. The study focuses on SMEs that are commercially viable with five to 250 employees and have significant potential and ambition for growth.",
      links: [],
    },
    {
      title: "The State of Early Stage Investing and Opportunity for Venture Debt",
      desc: "Global Development Incubator - 2016. Omidyar Network and GDI conducted a study with 50+ fund managers, fieldbuilders, and other intermediaries to detail the size of the market for SGB investments.",
      links: [],
    },
    {
      title: "Investing in Africa's Small and Growing Businesses: An Introduction to Private Equity in Africa",
      desc: "I&P - 2015. The handbook is a tool to foster the development of early-stage SME investment in Africa and encourage the rise of new investors on the continent.",
      links: [],
    },
    {
      title: "MEZZANINE FINANCE - Analysis of mezzanine instruments and appropriate investment structures to serve small and growing businesses",
      desc: "",
      links: [],
    },
    {
      title: "Innovations in Financing Structures for Impact Enterprises: Spotlight on Latin America",
      desc: "Transform Finance - 2017. This report outlines the specific problems with traditional financing structure for impact enterprises, including how investment funds and deal structures are innovating.",
      links: [],
    },
    {
      title: "New Perspectives on Financing Small Cap SMEs in Emerging Markets: The Case for Mezzanine Finance",
      desc: "Dutch Good Growth Fund - 2016. In search for new models to provide risk capital, mezzanine finance provides an additional offer in the SME finance ecosystem for missing middle entrepreneurs.",
      links: [],
    },
    {
      title: "Private Credit Solutions: Mezzanine Financing in Emerging Markets",
      desc: "EMPEA - 2014. EMPEA's first in-depth look at the role that private credit plays in supporting the development of small- and medium-size companies across the emerging markets.",
      links: [],
    },
  ];

  return (
    <div className="min-h-screen bg-white scrollbar-hide overflow-x-hidden">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/blogsbackground.jpeg)' }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
          <Link to="/">
            <img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-12 sm:h-16 md:h-20 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          </Link>
        </div>
        <nav className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex flex-wrap items-center justify-end gap-1 sm:gap-1.5">
          <Link to="/about" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Info className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>About</span></div>
            </Button>
          </Link>
          <Link to="/escp-network" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Network className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Network</span></div>
            </Button>
          </Link>
          <Link to="/learning-hub" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><BookOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Learning Hub</span></div>
            </Button>
          </Link>
          <Link to="/our-events" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Our Events</span></div>
            </Button>
          </Link>
          <Link to="/escp-network" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>ESCP Network</span></div>
            </Button>
          </Link>
          <Link to="/partnership" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Handshake className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Partnership</span></div>
            </Button>
          </Link>
          <Link to="/launch-plus-intro" className="shrink-0">
            <Button variant="outline" size="sm" className="group border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 bg-white/5 backdrop-blur-md px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold shadow-xl hover:shadow-white/10 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-105 rounded-full min-h-0">
              <div className="flex items-center gap-1 sm:gap-1.5"><Rocket className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:scale-110 transition-transform duration-300" /><span>Explore LAUNCH+</span></div>
            </Button>
          </Link>
        </nav>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
          <div className="inline-block mb-4">
            <span className="px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold">Learning Lab</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Learning Lab</h1>
          <p className="text-lg sm:text-xl text-white/95 max-w-3xl">
            The Collaborative for Frontier Finance curates the below collection of key resources for fund managers, funders, and fieldbuilders to help mobilize additional capital for small and growing businesses in emerging markets.
          </p>
        </div>
      </section>

      {/* Intro & Quick Links */}
      <section className="py-16 sm:py-20 bg-amber-50 rounded-t-[2rem] -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="#fund-manager-portal" className="px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100 font-semibold text-gray-800 hover:bg-blue-50 hover:border-blue-200 transition-colors">Fund Manager Portal</a>
            <a href="#market-insights" className="px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100 font-semibold text-gray-800 hover:bg-blue-50 hover:border-blue-200 transition-colors">Market Insights</a>
            <a href="#publications" className="px-6 py-3 bg-white rounded-full shadow-lg border border-gray-100 font-semibold text-gray-800 hover:bg-blue-50 hover:border-blue-200 transition-colors">Publications</a>
          </div>
          <p className="text-gray-700">
            If you would like to recommend a new resource,{" "}
            <a href="mailto:info@frontierfinance.org" className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2">get in touch</a>.
          </p>
        </div>
      </section>

      {/* Fund Manager Portal */}
      <section id="fund-manager-portal" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">Resources</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Fund Manager Portal
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-gray-700 leading-relaxed mb-6">
                SME Ventures and the Collaborative for Frontier Finance have partnered to curate a collection of open-source resources which can be accessed by fund managers operating in emerging markets at various stages of their vehicle&apos;s lifecycle.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                The portal is a repository of resources and templates organized by the stage of a vehicle&apos;s lifecycle, incorporating content for: Investment thesis and set-up, capital raising, team, track record, investment process, operations, ESG, impact and SME support.
              </p>
              <p className="text-gray-700 leading-relaxed mb-8">
                We invite you to explore the portal, watch the video to learn more, and share feedback on how we can improve the tool going forward.
              </p>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Button className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full font-semibold shadow-xl">
                  <span className="flex items-center gap-2">
                    Explore the Portal
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </a>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[280px] sm:h-[360px]">
              <img src="/home.png" alt="Fund Manager Portal" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section id="market-insights" className="py-16 sm:py-24 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">Insights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8">
            Market Insights
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {marketInsights.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all">
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">{item.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{item.date}</span>
                  <a href={item.link} className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                    Read More <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-2 border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-full font-semibold">
              See all
            </Button>
          </div>
        </div>
      </section>

      {/* Publications */}
      <section id="publications" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-block mb-3">
            <span className="px-6 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-blue-700 text-sm font-semibold">Research</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-8">
            Publications
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-12"></div>
          <div className="space-y-6">
            {publications.map((pub, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{pub.title}</h3>
                    {pub.type && (
                      <span className="inline-block px-3 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-2">{pub.type}</span>
                    )}
                    {pub.desc && <p className="text-sm text-gray-600 leading-relaxed mb-3">{pub.desc}</p>}
                    {pub.links && pub.links.length > 0 && (
                      <div className="flex flex-wrap gap-3">
                        {pub.links.map((l, j) => (
                          <a key={j} href={l.href} className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
                            {l.label} <ExternalLink className="w-3 h-3" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-black via-blue-950 to-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="col-span-1 lg:col-span-2">
              <Link to="/"><img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-16 w-auto object-contain mb-4" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /></Link>
              <p className="text-gray-300 mb-6 text-base leading-relaxed max-w-md">A multi-stakeholder initiative increasing access to capital for small and growing businesses in emerging markets.</p>
              <a href="mailto:info@frontierfinance.org" className="flex items-center space-x-3 text-blue-300 hover:text-blue-200 transition-colors group">
                <div className="w-8 h-8 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors"><Mail className="w-4 h-4" /></div>
                <span className="text-sm font-medium">info@frontierfinance.org</span>
              </a>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-base flex items-center"><Database className="w-4 h-4 mr-2" />Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-blue-300 hover:text-blue-200 transition-colors">About</Link></li>
                <li><Link to="/escp-network" className="text-blue-300 hover:text-blue-200 transition-colors">Network</Link></li>
                <li><Link to="/learning-hub" className="text-blue-300 hover:text-blue-200 transition-colors">Learning Hub</Link></li>
                <li><Link to="/our-events" className="text-blue-300 hover:text-blue-200 transition-colors">Our Events</Link></li>
                <li><Link to="/escp-network" className="text-blue-300 hover:text-blue-200 transition-colors">ESCP Network</Link></li>
                <li><Link to="/partnership" className="text-blue-300 hover:text-blue-200 transition-colors">Partnership</Link></li>
                <li><Link to="/auth" className="text-blue-300 hover:text-blue-200 transition-colors flex items-center group"><ExternalLink className="w-3 h-3 mr-2 group-hover:scale-110 transition-transform" />Login / Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4 text-base flex items-center"><Shield className="w-4 h-4 mr-2" />Connect With Us</h3>
              <p className="text-gray-400 text-sm mb-4">Follow us for updates on small business finance and network news</p>
              <div className="flex space-x-3">
                <a href="https://twitter.com/CollabFFinance" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"><Twitter className="w-5 h-5 text-white" /></a>
                <a href="https://www.linkedin.com/company/collaborative-for-frontier-finance/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"><Linkedin className="w-5 h-5 text-white" /></a>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-blue-300 text-sm mb-2 md:mb-0">© 2025 Collaborative for Frontier Finance. All rights reserved.</p>
            <div className="flex space-x-4 text-sm">
              <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Privacy Policy</a>
              <span className="text-blue-600">•</span>
              <a href="#" className="text-blue-300 hover:text-blue-200 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LearningHub;
