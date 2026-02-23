
import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Network, DollarSign, Briefcase } from 'lucide-react';

const Stats = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    const [counts, setCounts] = useState({
        fund: 0,
        capital: 0,
        sgb: 0
    });

    useEffect(() => {
        if (isInView) {
            // Reset
            setCounts({ fund: 0, capital: 0, sgb: 0 });

            // Animate fund count (target 100)
            const fundDuration = 2000;
            const fundEnd = 100;
            let fundStart = 0;
            const fundStep = fundEnd / (fundDuration / 16);

            const fundTimer = setInterval(() => {
                fundStart += fundStep;
                if (fundStart >= fundEnd) {
                    setCounts(prev => ({ ...prev, fund: fundEnd }));
                    clearInterval(fundTimer);
                } else {
                    setCounts(prev => ({ ...prev, fund: Math.floor(fundStart) }));
                }
            }, 16);

            // Animate capital count (target 2.25)
            const capDuration = 2000;
            const capEnd = 2.25;
            let capStart = 0;
            const capStep = capEnd / (capDuration / 16);

            const capTimer = setInterval(() => {
                capStart += capStep;
                if (capStart >= capEnd) {
                    setCounts(prev => ({ ...prev, capital: capEnd }));
                    clearInterval(capTimer);
                } else {
                    setCounts(prev => ({ ...prev, capital: parseFloat(capStart.toFixed(2)) }));
                }
            }, 16);

            // Animate SGB count (target 1200)
            const sgbDuration = 2000;
            const sgbEnd = 1200;
            let sgbStart = 0;
            const sgbStep = sgbEnd / (sgbDuration / 16);

            const sgbTimer = setInterval(() => {
                sgbStart += sgbStep;
                if (sgbStart >= sgbEnd) {
                    setCounts(prev => ({ ...prev, sgb: sgbEnd }));
                    clearInterval(sgbTimer);
                } else {
                    setCounts(prev => ({ ...prev, sgb: Math.floor(sgbStart) }));
                }
            }, 16);

            return () => {
                clearInterval(fundTimer);
                clearInterval(capTimer);
                clearInterval(sgbTimer);
            };
        }
    }, [isInView]);

    const stats = [
        {
            id: 1,
            icon: Network,
            value: `${counts.fund}+`,
            label: 'Fund Manager Members',
            sub: 'Across 30+ countries',
            color: 'blue'
        },
        {
            id: 2,
            icon: DollarSign,
            value: `$${counts.capital}B`,
            label: 'Capital Target',
            sub: 'Collectively raising',
            color: 'emerald'
        },
        {
            id: 3,
            icon: Briefcase,
            value: `${counts.sgb.toLocaleString()}+`,
            label: 'SGBs Invested',
            sub: 'Portfolio companies',
            color: 'purple'
        }
    ];

    return (
        <section ref={ref} className="py-20 bg-navy-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-navy-700 via-navy-900 to-black"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-3xl md:text-4xl font-serif font-bold text-white mb-4"
                    >
                        Our Impact in Numbers
                    </motion.h2>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: '80px' } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-1 bg-gold-500 mx-auto"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                            className="text-center group"
                        >
                            <div className="flex justify-center mb-6">
                                <div className={`w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-${stat.color}-500/10`}>
                                    <stat.icon className={`w-10 h-10 text-gold-400`} />
                                </div>
                            </div>
                            <div className="text-5xl md:text-6xl font-bold font-serif text-white mb-2 tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-xl text-gold-200 font-medium mb-1">{stat.label}</div>
                            <div className="text-sm text-navy-200">{stat.sub}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Stats;
