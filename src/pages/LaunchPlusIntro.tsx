import { useEffect } from "react";
import { Link } from "react-router-dom";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, LineChart, Wallet, FileText } from "lucide-react";
import { motion } from "framer-motion";

const LaunchPlusIntro = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: Building2,
      title: "Shared Back-Office",
      description: "Access to world-class accounting, finance, tax, legal, and HR services at a fraction of the cost.",
      features: ["Accounting & Finance", "Legal & Compliance", "HR & Payroll"],
    },
    {
      icon: Wallet,
      title: "Fund Administration",
      description: "Streamlined fund operations and reporting to ensure transparency and efficiency.",
      features: ["NAV Calculation", "Investor Reporting", "KYC/AML"],
    },
    {
      icon: LineChart,
      title: "Capacity Building",
      description: "Knowledge services and mentorship to help managers refine their investment thesis and operations.",
      features: ["Mentorship", "Workshops", "Resource Library"],
    },
  ];

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30">
      {/* Hero – same pattern as About / Learning Hub */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url(/CFF.jpg)" }}
        >
          <div className="absolute inset-0 bg-navy-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/50" />
        </div>

        <div className="relative z-10 container mx-auto px-3 sm:px-6 lg:px-8 pt-[max(5rem,calc(4.5rem+env(safe-area-inset-top,0px)))] sm:pt-20 pb-12 sm:pb-20 w-full text-center min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-4">
              Shared services for fund managers
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-normal text-white leading-tight tracking-tight mb-4 sm:mb-6">
              LAUNCH+
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-light leading-relaxed mb-8">
              An integrated platform to accelerate the flow of fit-for-purpose financing to Africa&apos;s growth-oriented small businesses.
            </p>
            <Button asChild className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-8 py-6 text-base rounded-full shadow-finance shadow-gold-500/25 hover:-translate-y-0.5 transition-all">
              <Link to="/launch-plus-assessment">
                Start questionnaire <ArrowRight className="ml-2 h-4 w-4 inline" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Our offering – rounded top, light bg, section-label + cards like About */}
      <section id="services" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-amber-50/30 relative overflow-hidden rounded-t-[2.5rem] sm:rounded-t-[3rem] -mt-8 sm:-mt-12 z-10 scroll-mt-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_0%,rgba(212,175,55,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 min-w-0">
          <span className="section-label block mb-4">Our offering</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-normal text-navy-900 mt-2 mb-6 sm:mb-8">
            Integrated solutions
          </h2>
          <div className="w-14 h-0.5 bg-gold-500/60 rounded-full mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="finance-card p-8 h-full"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-normal text-navy-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed font-sans mb-6">
                  {item.description}
                </p>
                <ul className="space-y-2">
                  {item.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridging the gap – dark section like About Vision */}
      <section className="py-16 sm:py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 min-w-0">
          <span className="section-label text-gold-400/90">The challenge</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-normal text-white mt-2 mb-6 sm:mb-8">
            Bridging the gap
          </h2>
          <div className="w-16 h-1 bg-gold-500 rounded-full mb-8" />
          <p className="text-lg text-slate-300 leading-relaxed font-sans mb-10">
            Small and local capital providers are key to financing Africa&apos;s &ldquo;missing middle,&rdquo; but they face significant operational hurdles: high setup costs for legal, administration, and compliance, and the drag of back-office functions that distract from sourcing and supporting deals.
          </p>
          <p className="text-lg text-slate-200 leading-relaxed font-sans">
            LAUNCH+ provides a shared services platform to reduce costs, streamline operations, and accelerate fund launch and growth.
          </p>
        </div>
      </section>

      {/* Questionnaire CTA – light section, explicit redirect like site CTAs */}
      <section id="questionnaire" className="py-16 sm:py-24 bg-amber-50/40 scroll-mt-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
        <div className="max-w-3xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 text-center min-w-0">
          <span className="section-label block mb-4">Get started</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-normal text-navy-900 mt-2 mb-6">
            Complete the LAUNCH+ questionnaire
          </h2>
          <div className="w-14 h-0.5 bg-gold-500/60 rounded-full mx-auto mb-8" />
          <p className="text-lg text-slate-600 leading-relaxed font-sans mb-10 max-w-2xl mx-auto">
            To help us understand your fund profile and how LAUNCH+ can support you, please complete our short assessment. Your responses will be used to tailor our engagement and connect you with relevant services.
          </p>
          <Button asChild size="lg" className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-8 py-6 text-base rounded-full shadow-finance shadow-gold-500/25 hover:-translate-y-0.5 transition-all focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">
            <Link to="/launch-plus-assessment">
              Go to questionnaire <ArrowRight className="ml-2 h-4 w-4 inline" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LaunchPlusIntro;
