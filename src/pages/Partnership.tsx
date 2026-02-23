
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake, Globe, TrendingUp, Building2, Users, Mail } from "lucide-react";
import { motion } from "framer-motion";

const Partnership = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const benefits = [
        {
            icon: Globe,
            title: "Global Reach",
            description: "Connect with a diverse network of over 100 capital providers across 30+ countries in Africa and the Middle East."
        },
        {
            icon: TrendingUp,
            title: "Systemic Impact",
            description: "Contribute to solving the 'missing middle' financing gap and unlocking growth for thousands of small businesses."
        },
        {
            icon: Users,
            title: "Collaborative Action",
            description: "Join working groups and innovative initiatives to co-create solutions for the early-stage investment ecosystem."
        }
    ];

    const partnerTypes = [
        {
            title: "Institutional Investors",
            description: "DFIs, Foundations, and Family Offices looking to deploy capital effectively into the SGB market through local intermediaries.",
            icon: Building2
        },
        {
            title: "Field Builders",
            description: "Organizations dedicated to strengthening the ecosystem through research, advocacy, and capacity building.",
            icon: Handshake
        },
        {
            title: "Technical Assistance Providers",
            description: "Experts offering specialized support to fund managers and their portfolio companies to accelerate growth.",
            icon: Users
        }
    ];

    return (
        <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30">
            {/* Hero Section */}
            <section className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url(/home.png)' }}
                >
                    <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-[2px]"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center pt-24 sm:pt-20 pb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 uppercase tracking-wider backdrop-blur-md">
                            <Handshake className="w-4 h-4 shrink-0" /> Partner With Us
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
                            Building the Future <br />
                            <span className="text-gold-500">Together</span>
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed px-1">
                            We believe in the power of collaboration to transform the landscape of small business finance. Join us in our mission to bridge the gap.
                        </p>
                        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                            <Button className="w-full sm:w-auto min-h-[48px] bg-gold-500 hover:bg-gold-600 text-navy-950 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full font-bold shadow-lg shadow-gold-500/20">
                                Become a Partner
                            </Button>
                            <Button variant="outline" className="w-full sm:w-auto min-h-[48px] border-white/20 text-white hover:bg-white/10 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 rounded-full">
                                View Current Partners
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Impact Section – protrudes into hero with rounded top */}
            <section className="py-16 sm:py-24 bg-white relative rounded-t-[2.5rem] sm:rounded-t-[3rem] overflow-hidden -mt-8 sm:-mt-12 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10 sm:mb-16">
                        <span className="text-gold-600 font-semibold tracking-wider uppercase text-sm">Why Partner</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-navy-900 mt-2">Shared Value for Shared Goals</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {benefits.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-navy-50 p-8 rounded-2xl border border-navy-100 text-center hover:shadow-lg transition-shadow"
                            >
                                <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-6">
                                    <item.icon className="w-8 h-8 text-gold-600" />
                                </div>
                                <h3 className="text-xl font-bold text-navy-900 mb-4">{item.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who We Work With */}
            <section className="py-24 bg-navy-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(45deg, #FFD700 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-gold-500 font-semibold tracking-wider uppercase text-sm">Ecosystem</span>
                            <h2 className="text-4xl font-serif font-bold text-white mt-2 mb-6">Who We Work With</h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                The Collaborative for Frontier Finance brings together a diverse ecosystem of stakeholders committed to unlocking capital for small and growing businesses.
                            </p>
                            <div className="space-y-6">
                                {partnerTypes.map((type, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="shrink-0 w-12 h-12 rounded-xl bg-navy-800 border border-navy-700 flex items-center justify-center">
                                            <type.icon className="w-6 h-6 text-gold-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{type.title}</h3>
                                            <p className="text-gray-400 text-sm">{type.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-navy-800 to-navy-950 rounded-full border border-white/5 shadow-2xl flex items-center justify-center p-12 relative">
                                {/* Abstract Circle Graphic */}
                                <div className="absolute inset-0 rounded-full border border-gold-500/20 animate-[spin_10s_linear_infinite]"></div>
                                <div className="absolute inset-4 rounded-full border border-white/10 animate-[spin_15s_linear_infinite_reverse]"></div>

                                <div className="text-center">
                                    <span className="block text-6xl font-serif font-bold text-white mb-2">50+</span>
                                    <span className="text-gold-500 uppercase tracking-widest text-sm font-semibold">Strategic Partners</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-serif font-bold text-navy-900 mb-6">Let's Make an Impact</h2>
                    <p className="text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
                        Whether you are an investor, a field builder, or a technical assistance provider, there is a role for you in our network.
                    </p>
                    <a href="mailto:info@frontierfinance.org">
                        <Button className="bg-navy-900 hover:bg-navy-800 text-white text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all">
                            <Mail className="w-5 h-5 mr-2" /> Contact Our Partnership Team
                        </Button>
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Partnership;
