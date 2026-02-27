import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PartnersSection = () => {
  return (
    <section className="pt-10 sm:pt-14 lg:pt-16 pb-16 sm:pb-24 lg:pb-28 bg-slate-50/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-50/50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-gold-600 mb-4 font-sans">Community</span>
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-normal text-navy-900 mb-4 sm:mb-6 leading-[1.15]">
              Who's Involved in the <span className="text-gold-600">Collaborative</span> for Frontier Finance?
            </h2>
            <div className="w-20 h-1 bg-gold-500 rounded-full mb-8" />
            <p className="text-base sm:text-lg text-slate-700 leading-[1.7] font-sans font-light">
              With input from <span className="font-semibold text-gold-600">80+ fund managers, funders, and fieldbuilders</span> over the past year, the Collaborative for Frontier Finance is a multi-stakeholder initiative.
            </p>
            <Link to="/partnership" className="inline-flex mt-8 sm:mt-10">
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[48px] bg-navy-900 hover:bg-navy-800 text-white font-semibold rounded-full px-8 shadow-finance-lg group transition-all duration-300 hover:-translate-y-0.5"
              >
                See partners
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-navy-900/5 border border-slate-200/80 flex items-center justify-center">
                <Users className="w-24 h-24 md:w-32 md:h-32 text-gold-500/40" />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-card-hover border border-slate-100 px-6 py-4">
                <span className="text-3xl sm:text-4xl font-display font-normal text-gold-600">80+</span>
                <p className="text-xs sm:text-sm text-slate-600 font-sans font-medium mt-1">stakeholders</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
