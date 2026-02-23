import Footer from '@/components/layout/Footer';
import Team from '@/components/about/Team';
import NewsletterSection from '@/components/home/NewsletterSection';
import { motion } from 'framer-motion';
import { Users, BookOpen, Rocket } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-gold-500/30">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: 'url(/CFF.jpg)' }}
        >
          <div className="absolute inset-0 bg-navy-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/50"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-20 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm font-semibold mb-6">
              About Us
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-normal text-white mb-4 sm:mb-6">
              Collaborative for <br />
              <span className="text-gold-400">Frontier Finance</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed px-1">
              The Collaborative for Frontier Finance is a multi-stakeholder initiative that aims to increase access to capital for small and growing businesses in emerging markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Frontier Finance – protrudes into hero with rounded top */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-amber-50/30 relative overflow-hidden rounded-t-[2.5rem] sm:rounded-t-[3rem] -mt-8 sm:-mt-12 z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_70%_0%,rgba(212,175,55,0.06),transparent)] pointer-events-none" aria-hidden />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="section-label">Context</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-normal text-navy-900 mt-2 mb-6 sm:mb-10">Why Frontier Finance</h2>
          <div className="w-14 h-0.5 bg-gold-500/60 mx-auto rounded-full mb-10" />

          <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-sans text-left">
            <p>
              Small and growing businesses (SGBs) create roughly <strong className="text-navy-900 font-semibold">80%</strong> of formal employment opportunities in frontier and emerging markets, making them an essential part of every economy and an important lever for social and environmental impact. However, SGBs face an estimated <strong className="text-gold-600">$940B</strong> financing gap in appropriate capital they need to grow.
            </p>
            <p>
              SGBs are often called the <strong className="text-navy-900 font-semibold">"missing middle"</strong> because few investment models are tailored to their needs. They are too big for microfinance, too small for private equity, too risky and lack sufficient collateral for commercial banks, and lack the growth trajectory that venture capital seeks. Additionally, because SGBs require small amounts of capital to grow, the cost of conducting the transaction is often disproportionately high relative to the size of the investment.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 sm:py-24 bg-navy-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-navy-900/80 skew-x-12 transform translate-x-32" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="section-label text-gold-400/90">Our Purpose</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-normal text-white mt-2 mb-6 sm:mb-8">Our Vision and Mission</h2>
          <div className="w-16 h-1 bg-gold-500 rounded-full mb-8" />
          <p className="text-lg text-slate-300 leading-relaxed font-sans">
            To achieve a sustainable and growing small business finance ecosystem in Africa and beyond by addressing the "missing middle" financing gap. We do this by supporting and enabling local capital providers to accelerate financing solutions that target small and growing businesses in frontier markets.
          </p>
        </div>
      </section>

      {/* How We Work */}
      <section id="how-we-work" className="py-16 sm:py-24 bg-amber-50/40 scroll-mt-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-navy-900/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full h-0.5 sm:h-1 bg-gold-500/80 rounded-full mb-12 sm:mb-14" aria-hidden />
          <span className="section-label block mb-4">Our Approach</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-normal text-navy-900 mb-6 sm:mb-8">How We Work</h2>
          <div className="w-14 h-0.5 bg-gold-500/60 rounded-full mb-10" />
          <p className="text-lg text-slate-700 leading-relaxed font-sans max-w-4xl mb-6">
            We work with diverse stakeholders – including fund managers, funders, and fieldbuilders – to accelerate financing solutions that target SGBs. We aim to set a common action agenda for SGB finance; to test and scale promising financing models; and to facilitate the flow of capital to the SGB market. With a bias to action, CFF works with stakeholders to identify, co-design and launch initiatives – or specific solutions that table SGB financing challenges – that are too complex for any one stakeholder to launch on their own. We do this in three ways:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { subtitle: 'Network', title: 'The Collective', lead: 'Where peers align.', icon: Users, desc: 'We connect stakeholders facing similar pain-points to a peer network of actors operating with shared principles, values, and ambitions to learn from and support one another.' },
              { subtitle: 'Actionable Research', title: 'Evidence in Motion', lead: 'From data to decisions.', icon: BookOpen, desc: 'We facilitate research on hot topics to improve transparency within the sector, provide a practical guide for those less familiar with the sector, and dispel common misconceptions.' },
              { subtitle: 'Initiatives', title: 'Built Together', lead: 'Co-design, then launch.', icon: Rocket, desc: "We identify concrete initiatives which CFF can take ownership of to provide tangible support to the broader early-stage investing sector. Through leveraging the resources of the CFF network, we're working to amplify the voices of local capital providers." },
            ].map((item, i) => (
              <motion.div key={item.subtitle} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="finance-card p-8">
                <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-500 flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 font-sans mb-1.5 block">{item.subtitle}</span>
                <h3 className="text-xl sm:text-2xl font-display font-normal text-navy-900 mb-2">{item.title}</h3>
                <p className="text-gold-700/90 text-sm font-serif italic mb-4 border-l-2 border-gold-400/60 pl-4">
                  {item.lead}
                </p>
                <p className="text-slate-600 leading-relaxed font-sans">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="w-full h-0.5 sm:h-1 bg-gold-500/80 rounded-full mt-12 sm:mt-14" aria-hidden />
        </div>
      </section>

      {/* Impact of SGB Financing */}
      <section className="py-16 sm:py-24 bg-slate-100/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_100%,rgba(15,23,42,0.04),transparent)] pointer-events-none" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="section-label block mb-4">Sustainable Development</span>
          <h2 className="text-3xl md:text-4xl font-display font-normal text-navy-900 mb-4">The Impact of SGB Financing</h2>
          <p className="text-lg text-slate-600 font-sans mb-12 max-w-2xl">
            Increasing appropriate capital available for SGBs will directly contribute to achieving the Sustainable Development Goals:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Job Creation', desc: 'Create new, quality, and long-term jobs that increase incomes', goals: 'Goals 1, 8, and 10', icon: 'Job Creation.png' },
              { title: 'Goods and Services', desc: 'Provide access to essential goods and services like health, education, transportation, and more', goals: 'Goals 2, 3, 4, 6, 7, and 12', icon: 'Goods and Services.png' },
              { title: 'Value Chain', desc: 'Integrate small businesses into supply chains, creating broader economic opportunities', goals: 'Goals 2, 3, 4, 6, 7, and 12', icon: 'Value Chain.png' },
              { title: 'Innovation', desc: 'Catalyze new approaches to serve customers in frontier markets in business model, strategy, and distribution', goals: 'Goals 2, 3, 4, 6, 7, and 12', icon: 'Innovation.png' },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="bg-white rounded-xl border border-slate-200 p-6 shadow-finance hover:shadow-card-hover transition-shadow">
                <div className="text-2xl font-display font-normal text-navy-900 mb-2">{item.title}</div>
                <p className="text-slate-600 text-sm leading-relaxed font-sans mb-3">{item.desc}</p>
                <p className="text-xs text-gold-600 font-medium">({item.goals})</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50/80 relative">
        <div className="absolute inset-0 bg-[linear-gradient(165deg,transparent_0%,rgba(212,175,55,0.03)_50%,transparent_100%)] pointer-events-none" aria-hidden />
        <div className="relative z-10">
          <Team />
        </div>
      </div>

      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default About;
