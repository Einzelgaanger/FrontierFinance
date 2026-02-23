import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/home/NewsletterSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Database, TrendingUp, Download } from "lucide-react";
import { motion } from "framer-motion";

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

  const publications: { title: string; type: string; desc: string; links: { label: string; href: string }[]; year: string }[] = [
    { title: "Reaching Small and Growing Businesses in Frontier Markets - ARIA", type: "Full Report", year: "2024", desc: "ARIA's Foundations of Growth Publication, a DFI-focused initiative by Proparco, British International Investment (BII), and FMO - Dutch entrepreneurial development bank to expand investment in frontier markets. Using examples from the CFF network, our article highlights the investment approaches used by local fund managers to support small and growing businesses in these markets, and offers a set of concrete suggestions on where we hope to see DFIs engage.", links: [{ label: "Full Report", href: "#" }] },
    { title: "CFF Annual Local Capital Provider Survey 2024", type: "Preliminary Report", year: "2024", desc: "Our Newly Published State of Play Report_Issue Brief No. 1. The 2024 Annual Survey Report highlights the current state-of-play and trends within small business finance funds. With 100 respondents, an almost twofold increase from last year's survey, the report showcases a new acceleration of growth for the asset class, shifts towards more investor-friendly fund set ups, and continued innovation. Respondents are collectively aiming to raise $2.25 billion to invest into Africa and MENA's small businesses.", links: [{ label: "Preliminary Report", href: "#" }] },
    { title: "African Fund of Fund Platforms: Building the small business finance ecosystem", type: "Analysis", year: "2023", desc: "A new group of public and private fund of funds platforms are achieving system-level changes by efficiently moving institutional capital to local small business growth funds in their markets. Six of those platforms including 2X Global (pan-African), Venture Capital Trust Fund (Ghana), MSMEDA (Egypt), SA SME Fund (South Africa), 27four Black Business Growth Fund (South Africa) and CFF share insights as to the role they are playing in addition to capitalising this new intermediary segment.", links: [{ label: "Full report", href: "#" }] },
    { title: "CFF Annual Local Capital Provider Survey 2023", type: "Full Report", year: "2023", desc: "This year's publication highlights the increasing influence of local capital providers throughout Africa and the Middle East. It categorises the small business finance asset class, delineating their pivotal role in supplying growth capital to businesses and reveals the strategies fund managers are using to build track record, address fund economics and raise capital. The 60 survey respondents aim to secure $1.5 billion in capital, following their investments in 1200 businesses to date.", links: [{ label: "Full report", href: "#" }, { label: "Summary", href: "#" }] },
    { title: "CFF Annual Local Capital Provider Survey 2022", type: "Full Report", year: "2022", desc: "The CFF has developed this survey to assess the \"state-of-play\" with regard to the small business financing sector in Africa and the Middle East. It is designed to better understand the emerging class of LCPs who are a heterogeneous group of indigenous fund managers using alternative structures to provide capital to SGBs in their local markets. This flagship publication builds on the initial edition published in 2020, highlighting the market movement that has taken place during that time and revealing new insights into this asset class.", links: [{ label: "Full Report", href: "#" }, { label: "Summary infographic", href: "#" }] },
    { title: "Unlocking Local Pension Fund Capital for Small Business Finance", type: "Report", year: "—", desc: "The purpose of this report is to highlight some of the work of market builders working closely with pension fund industry bodies in South Africa, Ghana and Zambia to unlock capital for small business finance in Africa. There is a shortage of growth capital for small and growing businesses in African markets, which can be partially filled by local institutional investors, particularly local pension funds.", links: [] },
    { title: "Launch of Nyala Venture", type: "Partnership", year: "—", desc: "In partnership with CFF and the facility manager (Cardano Development and Total Impact Capital Europe), FSDAi will provide the critical anchor funding for Nyala Venture. Nyala Venture will bridge the funding gap by targeting a new class of capital providers serving small and growing businesses, particularly those led by women or applying a gender lens investment strategy in Nigeria, Ghana, Kenya, Senegal, South Africa, and Uganda. The facility will be highly flexible; funds will be available in the form of debt or equity. Technical assistance funding will be made available to managers. FSDAi is also funding the development of the Frontier Capital Learning Lab.", links: [] },
    { title: "Fund of Funds Vehicles for Small and Growing Businesses Report", type: "Full Report", year: "—", desc: "A consortium including the World Economic Forum Global Alliance for Social Entrepreneurship, CFF, GSG and SDIP worked with Impact Investing Ghana to accelerate the design and implementation of a Fund of Funds vehicle for Ghana. This report shares key learnings from the FoF design process and insights from a wider group of nine FoFs.", links: [{ label: "Full Report", href: "#" }, { label: "Executive Summary", href: "#" }] },
    { title: "The New Operating Environment Facing Latin American Capital Providers", type: "Report", year: "2020", desc: "Collaborative for Frontier Finance, Sonen Capital, Fondo de Fondos, and Dalberg. A survey of capital managers supporting MSMEs in the region on the impact of COVID-19. The survey reveals an expanding network of LatAm capital providers and focuses on current plans to support portfolios and expand resources and AUM, plus how capital providers are thinking about impact in terms of gender and employment.", links: [] },
    { title: "Emerging Market Small & Growing Business Capital Provider's Survey Results", type: "Survey", year: "2020", desc: "CFF with support of Visa Foundation conducted a survey of capital managers that target SGBs in emerging markets. The survey is a snapshot of this sector pre- and post-COVID-19 – and in particular, what is happening with the gender-oriented impact sector. The results offer a pathway for systemic change by supporting highly effective local capital providers that prioritize gender-oriented investments.", links: [] },
    { title: "Insights on SME Fund Performance: Generating learnings to catalyse interest and action in SME investing", type: "Report", year: "2019", desc: "Shell Foundation, Omidyar Network, and Deloitte. Key findings from a SME fund performance study which analyzed data from 365 funds across 5 DFIs. The report seeks to establish realistic expectations for development outcomes and financial returns, thereby encouraging the flow of capital into SME segments.", links: [] },
    { title: "Closing the Gaps - Finance Pathways for Serving the Missing Middles", type: "Report", year: "2019", desc: "CFF and founding members produced a follow-up to \"Missing Middles\". The new report identifies five alternative approaches or \"pathways\" for providing finance that meets the diverse needs of each SGB segment and investor, and highlights critical actions that ecosystem stakeholders can take to help support these approaches.", links: [] },
    { title: "The Missing Middles - Segmenting Enterprises to Better Understand their Financial Needs", type: "Report", year: "2018", desc: "Omidyar Network and CFF. This report aims to help investors, intermediaries, and entrepreneurs better navigate the complex landscape of SGB investment in frontier and emerging markets. Segmenting the SGB market into multiple \"missing middles\" will help more effectively diagnose the distinct financing needs and gaps faced by different types of enterprises.", links: [] },
    { title: "Scaling Access to Finance for Early-Stage Enterprises in Emerging Markets", type: "Report", year: "2018", desc: "Dutch Good Growth Fund. This report explores scaling access to finance for early-stage enterprises in emerging markets and shares lessons from the field. It seeks to explore how to improve the scalability and viability of early-stage finance provision, thereby reducing the need for philanthropic capital and subsidies.", links: [] },
    { title: "Reaching deep in low-income markets: Enterprises achieving impact, sustainability, and scale at the base of the pyramid", type: "Report", year: "2017", desc: "Omidyar Network and MacArthur Foundation. Explores 20 enterprises that serve people living at the bottom of the pyramid to better understand the impact, sustainability, and scale of these businesses. The research aims to help provide transparency and guidance to advance the broader field of funding for businesses serving the deep BOP.", links: [] },
    { title: "SME Finance in Sub-Saharan Africa", type: "Study", year: "2017", desc: "Shell Foundation and Enclude. The study focuses on SMEs that are commercially viable with five to 250 employees and have significant potential and ambition for growth. The \"Target Market\" focus is on businesses in the \"validate\" and \"prepare\" stages seeking growth and working capital of between $250,000 and $1 million.", links: [] },
    { title: "The State of Early Stage Investing and Opportunity for Venture Debt", type: "Study", year: "2016", desc: "Global Development Incubator. Omidyar Network and GDI conducted a study with 50+ fund managers, fieldbuilders, and other intermediaries to detail the size of the market for SGB investments, existing debt and equity structures and products, progress by local and international investors, and success factors. Includes recommendations for the sector based on gaps identified.", links: [] },
    { title: "Investing in Africa's Small and Growing Businesses: An Introduction to Private Equity in Africa", type: "Handbook", year: "2015", desc: "I&P. The handbook is a tool to foster the development of early-stage SME investment in Africa and encourage the rise of new investors on the continent. Intended for investors, entrepreneurs and anyone interested in the field of SME financing in Africa.", links: [] },
    { title: "Innovations in Financing Structures for Impact Enterprises: Spotlight on Latin America", type: "Report", year: "2017", desc: "Transform Finance. Outlines the specific problems with traditional financing structure for impact enterprises, including how investment funds and deal structures are innovating to alleviate the capital gap, and recommendations for fund managers, investors, entrepreneurs. Highlights 16 cases across Latin America.", links: [] },
    { title: "New Perspectives on Financing Small Cap SMEs in Emerging Markets: The Case for Mezzanine Finance", type: "Report", year: "2016", desc: "Dutch Good Growth Fund. Mezzanine finance blends elements from traditional PE and debt financing. This study provides an understanding of the specificities, diversity and complexities of it, critical to spur innovative thinking on both the fund managers and investors sides.", links: [] },
    { title: "Private Credit Solutions: Mezzanine Financing in Emerging Markets", type: "Report", year: "2014", desc: "EMPEA. EMPEA's first in-depth look at the role that private credit plays in supporting the development of small- and medium-size companies across the emerging markets, and in offering institutional investors a means of accessing this growth.", links: [] },
  ];

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30">
      {/* Hero Section – 75vh like About/Network, layout like homepage */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url(/learninghub.jpg)' }}
        >
          <div className="absolute inset-0 bg-navy-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/50" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 pb-16 sm:pb-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center">
            {/* Left: Main content */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 order-1 text-center lg:text-left lg:pr-12 xl:pr-16"
            >
              <p className="font-display text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-5">
                Resources
              </p>
              <h1 className="text-[2rem] sm:text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] xl:text-[4.5rem] font-display font-normal text-white leading-[1.12] tracking-tight">
                Learning Lab
              </h1>
              <p className="text-base sm:text-lg text-slate-200 max-w-xl mt-5 sm:mt-6 mx-auto lg:mx-0 leading-[1.7] font-sans font-light">
                Curated resources for fund managers, funders, and fieldbuilders to mobilize capital for small and growing businesses in emerging markets.
              </p>
              <p className="text-sm text-slate-300 font-sans mt-4 mx-auto lg:mx-0 max-w-xl">
                To recommend a resource,{' '}
                <a href="mailto:info@frontierfinance.org" className="text-gold-400 hover:text-gold-300 transition-colors">get in touch</a>.
              </p>
            </motion.div>

            {/* Right: Nav links with icons (like homepage stats column) */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-5 order-2 relative"
            >
              <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 xl:-translate-x-8 w-px h-32 bg-gold-500/60" aria-hidden />
              <p className="font-display text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-5 sm:mb-6 text-center lg:text-left">
                Explore
              </p>
              <nav className="space-y-4 sm:space-y-5">
                {[
                  { title: "Fund Manager Portal", subtitle: "Tools, templates and video", icon: Database, href: "#fund-manager-portal" },
                  { title: "Market Insights", subtitle: "Latest analysis and updates", icon: TrendingUp, href: "#market-insights" },
                  { title: "Publications", subtitle: "Reports, surveys and research", icon: FileText, href: "#publications" }
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.08, duration: 0.4 }}
                    className="group flex items-start gap-4 text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-gold-500/20 group-hover:border-gold-400/40 transition-colors">
                      <item.icon className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <p className="font-sans font-semibold text-white group-hover:text-gold-200 transition-colors">
                        {item.title}
                      </p>
                      <p className="font-sans text-sm text-slate-400 mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </nav>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fund Manager Portal – protrudes into hero with rounded top (same as About/Network) */}
      <section id="fund-manager-portal" className="py-24 bg-white rounded-t-[2.5rem] sm:rounded-t-[3rem] overflow-hidden -mt-8 sm:-mt-12 z-10 relative shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="section-label text-gold-600">Toolkit</span>
              <h2 className="text-4xl font-display font-normal text-navy-900 mt-2 mb-6">Fund Manager Portal</h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-lg font-sans">
                SME Ventures and the Collaborative for Frontier Finance have partnered to curate a collection of open-source resources which can be accessed by fund managers operating in emerging markets at various stages of their vehicle&apos;s lifecycle.
              </p>
              <p className="text-slate-600 leading-relaxed mb-6 font-sans">
                The portal is a repository of resources and templates organized by the stage of a vehicle&apos;s lifecycle, incorporating content for: Investment thesis and set-up, capital raising, team, track record, investment process, operations, ESG, impact and SME support.
              </p>
              <p className="text-slate-700 leading-relaxed mb-8 font-sans">
                We invite you to explore the portal,{' '}
                <a href="https://youtu.be/jTKHwZnMztM" target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:text-gold-700 font-semibold underline underline-offset-2 transition-colors">watch the video</a>
                {' '}to learn more, and share feedback on how we can improve the tool going forward.
              </p>
              <Button className="bg-navy-900 text-white hover:bg-navy-800 rounded-full px-8 py-6 text-lg shadow-finance-lg">
                Access Portal
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-2xl bg-gold-500/10 border-2 border-gold-200/40 -rotate-2 z-0" aria-hidden />
              <div className="absolute top-8 right-8 w-16 h-16 rounded-xl bg-navy-900/5 border border-slate-200 rotate-12 z-0" aria-hidden />
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-navy-100 ring-2 ring-white">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src="https://www.youtube.com/embed/jTKHwZnMztM?rel=0&modestbranding=1"
                  title="Fund Manager Portal – learn more"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold-500 rounded-full blur-3xl opacity-20 z-0" aria-hidden />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Insights */}
      <section id="market-insights" className="py-24 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="section-label text-gold-600">Latest Updates</span>
            <h2 className="text-4xl font-display font-normal text-navy-900 mt-2">Market Insights</h2>
            <div className="w-14 h-0.5 bg-gold-500/60 mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {marketInsights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-finance border border-slate-100 hover:shadow-card-hover transition-all group flex flex-col h-full"
              >
                <div className="p-8 flex-1">
                  <span className="text-xs text-slate-500 font-sans">{item.date}</span>
                  <h3 className="text-xl font-display font-normal text-navy-900 mb-4 mt-2 group-hover:text-gold-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm mb-6 line-clamp-4 font-sans">
                    {item.excerpt}
                  </p>
                </div>
                <div className="p-6 border-t border-slate-100">
                  <a href={item.link} className="text-navy-900 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">
                    Read More <ArrowRight className="w-4 h-4 text-gold-500" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/blogs">
              <Button variant="outline" className="border-navy-200 text-navy-700 hover:bg-navy-50 rounded-full">See all</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Publications – compact, creative */}
      <section id="publications" className="py-16 sm:py-20 bg-slate-50/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="section-label text-gold-600">Research</span>
            <h2 className="text-2xl sm:text-3xl font-display font-normal text-navy-900 mt-2">Publications</h2>
            <div className="w-10 h-0.5 bg-gold-500/70 mt-3 rounded-full" />
            <p className="text-slate-600 font-sans text-sm mt-4 max-w-xl leading-relaxed">
              Reports, surveys and research from CFF and partners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {publications.map((pub, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-16px" }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.02, 0.25) }}
                className={`group relative flex flex-col min-w-0 overflow-hidden transition-all duration-300
                  ${i % 3 === 0 ? "bg-white rounded-2xl border-l-4 border-l-gold-500/70 shadow-sm hover:shadow-md hover:border-l-gold-500" : ""}
                  ${i % 3 === 1 ? "bg-white rounded-2xl ring-1 ring-slate-200/80 hover:ring-gold-300/50" : ""}
                  ${i % 3 === 2 ? "bg-white rounded-2xl shadow-sm hover:shadow-md before:content-[''] before:absolute before:top-0 before:right-0 before:w-10 before:h-10 before:bg-gold-500/10 before:rounded-bl-full" : ""}`}
              >
                <div className="relative p-4 flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-bold tabular-nums text-slate-400 font-sans uppercase tracking-widest">
                      {pub.year}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full font-sans uppercase tracking-wider
                      ${i % 3 === 0 ? "text-gold-700 bg-gold-500/15" : ""}
                      ${i % 3 === 1 ? "text-navy-600 bg-slate-100" : ""}
                      ${i % 3 === 2 ? "text-gold-700 border border-gold-300/50" : ""}`}>
                      {pub.type}
                    </span>
                  </div>
                  <h3 className="text-sm font-display font-normal text-navy-900 leading-snug mb-2 group-hover:text-gold-700 transition-colors line-clamp-2">
                    {pub.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-sans flex-1 line-clamp-2 mb-3">
                    {pub.desc}
                  </p>
                  {pub.links.length > 0 ? (
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 pt-2 border-t border-slate-100/80">
                      {pub.links.map((link, j) => (
                        <span key={j} className="inline-flex items-center gap-1">
                          {j > 0 && <span className="text-slate-300 text-[10px]">·</span>}
                          <a
                            href={link.href}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy-800 hover:text-gold-600 font-sans transition-colors"
                          >
                            <Download className="w-3 h-3 shrink-0" />
                            {link.label}
                          </a>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-100/80">
                      <span className="text-[10px] text-slate-400 font-sans">—</span>
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default LearningHub;
