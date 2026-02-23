import { motion } from 'framer-motion';

const Mission = () => {
    return (
        <section className="pt-16 sm:pt-24 lg:pt-28 pb-10 sm:pb-14 lg:pb-16 bg-slate-50/80 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-50/30" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="order-2 lg:order-1"
                    >
                        <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-gold-600 mb-6 font-sans">Our Purpose</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-normal text-navy-900 mb-6 leading-[1.15]">
                            Bridging the <br />
                            <span className="text-gold-600 italic">"Missing Middle"</span>{' '}
                            <span className="text-navy-800">Gap</span>
                        </h2>
                        <div className="w-20 h-1 bg-gold-500 rounded-full mb-8" />

                        <p className="text-lg sm:text-xl text-slate-700 leading-[1.75] mb-6 font-sans font-light">
                            Small and growing businesses (SGBs) are the backbone of frontier economies, yet they face a massive funding gap. Too big for microfinance, too small for traditional private equity.
                        </p>
                        <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-sans font-light">
                            We exist to <span className="font-semibold text-navy-800">accelerate financing solutions</span> that unlock growth for these businesses. By supporting local capital providers, we help create jobs, foster innovation, and build resilient economies.
                        </p>
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans font-light mt-6">
                            The Collaborative for Frontier Finance works with <span className="font-medium text-navy-800">fund managers, funders, and fieldbuilders</span> to set a common action agenda, test and scale promising financing models, and facilitate the flow of capital to the SGB market.
                        </p>
                    </motion.div>

                    {/* Image + floating stat card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="order-1 lg:order-2 relative"
                    >
                        <div className="relative">
                            <div className="absolute -top-8 -right-8 w-full h-full border border-gold-500/40 rounded-2xl z-0" aria-hidden />
                            <div className="relative rounded-2xl overflow-hidden shadow-finance-lg border border-slate-200/60 z-10">
                                <img
                                    src="/home.png"
                                    alt="Frontier Finance Impact"
                                    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.03]"
                                />
                            </div>
                        </div>

                        <motion.div
                            initial={{ y: 24, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.35, duration: 0.5 }}
                            className="absolute -bottom-6 -left-4 md:-left-6 bg-white p-6 rounded-xl shadow-card-hover max-w-[260px] hidden md:block border border-slate-100 animate-float-subtle"
                        >
                            <div className="text-4xl sm:text-5xl font-display font-normal text-gold-600 mb-1">80%</div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-snug font-sans font-medium">
                                of formal employment in frontier markets comes from SGBs
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Mission;
