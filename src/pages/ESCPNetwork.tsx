import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import NewsletterSection from "@/components/home/NewsletterSection";
import { ArrowRight, Users, Target, Globe } from "lucide-react";
import { motion, useInView } from "framer-motion";

function NetworkAnimatedStat({
  num,
  prefix = '',
  suffix = '',
  label,
  index,
  startCount,
}: {
  num: number;
  prefix?: string;
  suffix?: string;
  label: string;
  index: number;
  startCount: boolean;
}) {
  const [displayNum, setDisplayNum] = useState(0);

  useEffect(() => {
    if (!startCount) return;
    const duration = 1500;
    const startTime = performance.now();
    const step = (t: number) => {
      const elapsed = t - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 2;
      setDisplayNum(num * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [startCount, num]);

  const formatted = `${prefix}${Math.round(displayNum)}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
      className="flex flex-col items-center"
    >
      <span className="font-display text-2xl sm:text-3xl text-white tabular-nums">{formatted}</span>
      <span className="text-slate-400 text-sm font-sans mt-0.5">{label}</span>
    </motion.div>
  );
}

const ESCPNetwork = () => {
  const containerRef = useRef(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(heroStatsRef, { once: true, amount: 0.5 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const journeySteps = [
    {
      year: "January 2020",
      title: "Nairobi Convening",
      location: "Nairobi, Kenya",
      description: "We brought together a group of 30 early stage capital providers in Nairobi, Kenya with the goals of fostering peer-to-peer learnings and a network for collective action, as well as identifying priority initiatives for the Collaborative to take forward. Following the Nairobi convening, we launched five working groups for priority focus areas, a series of webinars on hot topics featuring subject matter experts, and a Slack platform for ongoing network collaboration."
    },
    {
      year: "February 2021",
      title: "Virtual Convening",
      location: "Remote",
      description: "We hosted a second annual convening virtually, bringing almost 50 members together in 4 consecutive sessions over 2 weeks, including a final session on 'Demystifying frontier finance' where we were joined by several investors/LPs for a dialogue on hot topics such as open ended vehicles, early stage equity, gender lens investing and angel investing / engaging local co-investors."
    },
    {
      year: "June 2022",
      title: "Annual Convening",
      location: "Dar es Salaam, Tanzania",
      description: "We held our Annual Convening in-person in Dar es Salaam, Tanzania. The event hosted 45 early stage capital providers from across SSA, MENA and South Asia managing a range of closed and open-ended investment vehicles. This group included members from CFF's ESCP network, the LAUNCH Program cohort, the 2X Collaborative network and the Women in Africa Investments network and the I&P portfolio. At the event, we were also joined by 15 institutional capital holders and field builders, including the newly launched Nyala Venture, as well as participation from soon to be launched initiatives by 2X Collaborative and Mastercard/MEDA/I&P, representing an estimated $200 million in new fund of funds/warehousing facilities for 1st-time managers. The network has now grown to over 100 members across 30 countries and five regions."
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30 overflow-x-hidden" ref={containerRef}>
      {/* Hero Section – clear, centered layout */}
      <section className="relative min-h-[60vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/home.png)' }}
          />
          <div className="absolute inset-0 bg-navy-950/45" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-navy-950/90" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-[max(5rem,calc(4.5rem+env(safe-area-inset-top,0px)))] sm:pt-32 pb-16 sm:pb-24 text-center min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-6xl font-display font-normal text-white leading-[1.12] tracking-tight">
              Early Stage Capital
              <br />
              <span className="text-gold-300">Provider Network</span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed font-sans font-light">
              A peer network of 100+ capital providers across 30+ countries, sharing learnings and working collectively to support Small, Growing Businesses.
            </p>

            {/* Simple stat row – count-up like homepage hero */}
            <div ref={heroStatsRef} className="mt-10 sm:mt-12 flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-4">
              <NetworkAnimatedStat num={100} suffix="+" label="Members" index={0} startCount={isStatsInView} />
              <NetworkAnimatedStat num={30} suffix="+" label="Countries" index={1} startCount={isStatsInView} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36, duration: 0.4 }}
                className="flex flex-col items-center"
              >
                <span className="font-display text-2xl sm:text-3xl text-white tabular-nums">$20K–$500K</span>
                <span className="text-slate-400 text-sm font-sans mt-0.5">Deal focus</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section – protrudes into hero with rounded top */}
      <section className="py-12 sm:py-24 lg:py-32 bg-slate-50 relative rounded-t-[2.5rem] sm:rounded-t-[3rem] overflow-hidden -mt-8 sm:-mt-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-w-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 lg:gap-20 items-center">

            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gold-600 font-semibold tracking-widest uppercase text-xs mb-3 font-sans">ESCP Network</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-normal text-navy-900 mb-4 sm:mb-6 leading-tight">Collective Action for Impact</h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-4 font-sans">
                The ESCP Network&apos;s approach is to share learnings, best practices, and work collectively to find innovative solutions to challenges faced by emerging capital providers.
              </p>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-8 font-sans">
                We currently have <strong className="text-navy-900 font-semibold">100-plus members</strong>, primarily based in Africa, who focus on the capital needs of Small, Growing Businesses (SGBs). Our members focus on investments ranging from <strong className="text-gold-600 font-semibold">$20k to $500k</strong>.
              </p>

              {/* Professional stat cards - horizontal, clear hierarchy */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="flex-1 flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-gold-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-gold-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl sm:text-2xl font-display font-normal text-navy-900 tabular-nums">$20K – $500K</p>
                    <p className="text-sm font-sans font-medium text-slate-500 uppercase tracking-wider mt-0.5">Investment Range</p>
                  </div>
                </div>
                <div className="flex-1 flex items-center gap-4 p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-gold-200 transition-all duration-300">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <Globe className="w-6 h-6 text-gold-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl sm:text-2xl font-display font-normal text-navy-900 tabular-nums">30+</p>
                    <p className="text-sm font-sans font-medium text-slate-500 uppercase tracking-wider mt-0.5">Countries · Global Reach</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -right-4 -bottom-4 w-full h-full rounded-2xl border-2 border-gold-200/40 z-0" aria-hidden />
              <div className="absolute top-2 -left-10 w-56 h-40 sm:w-72 sm:h-44 rounded-xl bg-gold-600/30 sm:bg-gold-600/35 rotate-6 z-0" aria-hidden />
              <div className="relative z-20 rounded-2xl overflow-hidden border border-slate-200/80 shadow-lg shadow-slate-200/50 ring-2 ring-white/80">
                <img
                  src="/member.jpg"
                  alt="ESCP Meeting"
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-[1.02]"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                <blockquote className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-white font-serif text-lg sm:text-xl italic leading-relaxed drop-shadow-md">
                    &quot;Connecting the capital that fuels the future of emerging markets.&quot;
                  </p>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why It Matters – same design as About "Our Purpose" */}
      <section className="py-16 sm:py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-900/80 skew-x-12 transform translate-x-32" aria-hidden />
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 min-w-0">
          <span className="section-label text-gold-400/90">Context</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-normal text-white mt-2 mb-6 sm:mb-8">Why It Matters</h2>
          <div className="w-16 h-1 bg-gold-500 rounded-full mb-8" />

          <div className="space-y-8 text-slate-300 text-base sm:text-lg leading-relaxed font-sans">
            <div>
              <h3 className="text-white font-semibold text-lg font-sans mb-2">The role of ESCPs</h3>
              <p>
                ESCPs typically manage ≤$20M and invest $50K–500K with an equity mindset into early-stage companies. They fill a gap in the capital value chain: too large for microfinance, often below the profile for traditional venture capital. ESCPs enable early-stage businesses to access value-added capital without a fully validated business model or long track record.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg font-sans mb-2">The challenge</h3>
              <p>
                Costs to source, diligence, and manage investments are high relative to ticket size and risk-adjusted returns. LPs and other investors tend to shy away; ESCPs are undercapitalized and struggle to scale and to test the operating models needed to serve SGBs.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg font-sans mb-2">How we respond</h3>
              <p>
                Support is needed to validate investment models that are appropriate and scalable, and to de-risk institutional investors who are not yet investing in ESCP vehicles.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 font-sans">Related</p>
            <a
              href="/CFF+Local+Capital+Provider+Survey+2022+Inforgraphic.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium text-sm font-sans transition-colors"
            >
              CFF Local Capital Provider Survey 2022 — Infographic
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
          </div>
        </div>
      </section>

      {/* Progress to Date – clean timeline */}
      <section id="progress" className="py-16 sm:py-24 lg:py-32 bg-slate-100 relative scroll-mt-20 border-t border-slate-200/80 overflow-hidden">
        {/* Scattered background shapes and designs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-gold-500/10 blur-3xl" />
          <div className="absolute top-1/4 -right-40 w-80 h-80 rounded-full bg-navy-900/6 blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-72 h-72 rounded-full bg-gold-500/8 blur-2xl" />
          <div className="absolute top-1/3 right-1/4 w-44 h-44 border border-gold-300/30 rounded-2xl rotate-12" />
          <div className="absolute bottom-1/3 left-1/3 w-28 h-28 border border-navy-300/25 rounded-xl -rotate-6" />
          <div className="absolute top-2/3 right-0 w-36 h-36 rounded-full bg-slate-300/20 blur-xl" />
          <div className="absolute top-1/2 left-1/2 w-24 h-24 border border-gold-400/20 rounded-lg rotate-45" />
        </div>
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 min-w-0">
          <div className="mb-12 sm:mb-16">
            <p className="text-gold-600 font-semibold tracking-widest uppercase text-xs mb-2 font-sans">Our Journey</p>
            <h2 className="text-2xl sm:text-3xl font-display font-normal text-navy-900">Progress to Date</h2>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-slate-200">
            {journeySteps.map((step, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="relative pb-12 last:pb-0"
              >
                <div className="absolute -left-[29px] sm:-left-[33px] top-0 w-4 h-4 rounded-full bg-gold-500 border-4 border-white shadow-sm" aria-hidden />
                <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-6 sm:p-8 hover:border-gold-200/60 hover:bg-slate-50 transition-colors duration-300">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gold-600 mb-2 font-sans">{step.year}</p>
                  <h3 className="text-xl sm:text-2xl font-display font-normal text-navy-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-slate-500 font-sans mb-4">{step.location}</p>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
                    {step.description}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Get involved + Stay updated – integrated */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80"
            >
              <h2 className="text-xl sm:text-2xl font-display font-normal text-navy-900 mb-3">How Can I Get Involved?</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans mb-4">
                If you are an early stage capital provider who would like to join our network, reach out to Arnold Byarugaba to learn more.
              </p>
              <a
                href="mailto:arnold@frontierfinance.org"
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium text-sm font-sans transition-colors"
              >
                arnold@frontierfinance.org
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200/80"
            >
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 mb-2 font-sans">Newsletter</p>
              <h2 className="text-xl sm:text-2xl font-display font-normal text-navy-900 mb-3">Stay updated</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans mb-4">
                Receive occasional news and updates from the Collaborative for Frontier Finance.
              </p>
              <a
                href="https://fvco2.share-eu1.hsforms.com/2GephDJrwRPay5zTsxJoG2A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium text-sm font-sans transition-colors"
              >
                Sign up for updates
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ESCPNetwork;
