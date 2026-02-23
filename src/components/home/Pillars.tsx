import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pillars = () => {
    const pillars = [
        {
            id: 1,
            title: 'The Collective',
            subtitle: 'Networks',
            lead: 'Where peers align.',
            description: 'Connect with stakeholders facing similar challenges and join a peer network of actors operating with shared principles and ambitions.',
            image: '/home.png',
        },
        {
            id: 2,
            title: 'Evidence in Motion',
            subtitle: 'Actionable Research',
            lead: 'From data to decisions.',
            description: 'Access practical guidance and transparent data. We facilitate research to dispel common misconceptions in the sector.',
            image: '/eeee.png',
        },
        {
            id: 3,
            title: 'Built Together',
            subtitle: 'Initiatives',
            lead: 'Co-design, then launch.',
            description: 'Tangible support for early-stage investors. We co-design and launch initiatives that tackle complex SGB financing challenges.',
            image: '/12.png',
        }
    ];

    return (
        <section id="how-it-works" className="pt-10 sm:pt-14 lg:pt-16 pb-10 sm:pb-14 lg:pb-16 bg-white relative scroll-mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10 sm:mb-16">
                    <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-gold-600 font-sans">Our Approach</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-display font-normal text-navy-900 mt-3 mb-4 sm:mb-6 px-2 leading-tight">
                        How Does the Collaborative for <span className="text-gold-600">Frontier Finance</span> Work?
                    </h2>
                    <div className="w-16 sm:w-20 h-0.5 bg-gold-500 mx-auto rounded-full mb-8" />
                    <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-4xl mx-auto font-sans font-light leading-[1.7] mb-4 sm:mb-6 px-1">
                        The Collaborative for Frontier Finance works with diverse stakeholders – including fund managers, funders, and fieldbuilders – to accelerate financing solutions that target SGBs. We aim to set a common action agenda for SGB finance; to test and scale promising financing models; and to facilitate the flow of capital to the SGB market.
                    </p>
                    <p className="text-sm sm:text-base text-slate-600 max-w-4xl mx-auto font-sans font-light leading-relaxed mb-6 sm:mb-10 px-1">
                        With a bias to action, CFF works with stakeholders to identify, co-design and launch initiatives – specific solutions to SGB financing challenges – that are too complex for any one stakeholder to launch on their own.
                    </p>
                    <p className="text-sm font-display font-normal text-navy-800 uppercase tracking-[0.2em] mb-8 sm:mb-12">We do this in three ways:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    {pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.id}
                            initial={{ opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                            className="group finance-card flex flex-col h-full"
                        >
                            <div className="h-44 sm:h-52 overflow-hidden relative rounded-t-2xl">
                                {index === 0 && <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gold-500/20 blur-2xl z-0" aria-hidden />}
                                {index === 1 && <div className="absolute -top-4 -left-4 w-20 h-20 border-2 border-gold-300/40 rounded-xl rotate-12 z-0" aria-hidden />}
                                {index === 2 && <div className="absolute top-1/2 -right-8 w-16 h-32 bg-navy-900/10 rounded-full blur-sm z-0" aria-hidden />}
                                <img
                                    src={pillar.image}
                                    alt={pillar.title}
                                    className="relative z-10 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-navy-950/30 z-10" />
                                <span className="absolute bottom-4 left-4 inline-flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-lg bg-white/95 text-navy-900 font-display font-normal text-lg shadow-finance group-hover:bg-gold-500 group-hover:text-white transition-colors duration-300 z-20">
                                    {String(pillar.id).padStart(2, '0')}
                                </span>
                            </div>

                            <div className="p-6 sm:p-8 flex-1 flex flex-col">
                                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600 font-sans mb-1.5">{pillar.subtitle}</span>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-display font-normal text-navy-900 mb-2">{pillar.title}</h3>
                                <p className="text-gold-700/90 text-sm sm:text-base font-serif italic mb-4 border-l-2 border-gold-400/60 pl-4">
                                    {pillar.lead}
                                </p>
                                <p className="text-slate-600 text-sm sm:text-base flex-1 leading-relaxed font-sans">
                                    {pillar.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-8 sm:mt-10">
                    <Link to="/about#how-we-work" className="inline-block">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[48px] rounded-full border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white font-semibold px-8 transition-all duration-300 group">
                            How we work
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Pillars;
