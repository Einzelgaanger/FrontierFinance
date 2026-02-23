import { useEffect, useState, useRef } from "react";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Users, Building2, LineChart, Target, CheckCircle2, ChevronRight, BarChart3, PieChart, Wallet, TrendingUp, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

const LaunchPlusIntro = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const services = [
    {
      icon: <Building2 className="w-8 h-8 text-gold-500" />,
      title: "Shared Back-Office",
      description: "Access to world-class accounting, finance, tax, legal, and HR services at a fraction of the cost.",
      features: ["Accounting & Finance", "Legal & Compliance", "HR & Payroll"]
    },
    {
      icon: <Wallet className="w-8 h-8 text-gold-500" />,
      title: "Fund Administration",
      description: "Streamlined fund operations and reporting to ensure transparency and efficiency.",
      features: ["NAV Calculation", "Investor Reporting", "KYC/AML"]
    },
    {
      icon: <LineChart className="w-8 h-8 text-gold-500" />,
      title: "Capacity Building",
      description: "Knowledge services and mentorship to help managers refine their investment thesis and operations.",
      features: ["Mentorship", "Workshops", "Resource Library"]
    }
  ];

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30 overflow-x-hidden">
      {/* Hero Section - Tech/Finance Aesthetic */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Abstract Tech Background */}
        <div className="absolute inset-0 bg-navy-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-gold-500/20 opacity-20 blur-[100px]"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold-500/10 border border-gold-500/30 rounded-full text-gold-400 text-xs font-mono font-semibold mb-6 uppercase tracking-wider backdrop-blur-md">
                <Rocket className="w-3 h-3" /> Capital Facility
              </div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 leading-tight">
                LAUNCH+ <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">Accelerating Growth</span>
              </h1>
              <p className="text-xl md:text-2xl text-navy-100 mb-10 font-light leading-relaxed max-w-xl">
                An integrated platform designed to accelerate the flow of "fit for purpose" financing to Africa's growth-oriented small businesses.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-8 py-6 text-lg rounded-full font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all">
                  Apply Now
                </Button>
                <Button variant="outline" className="border-navy-700 text-white hover:bg-navy-800 rounded-full px-8 py-6 text-lg">
                  Learn More
                </Button>
              </div>
            </motion.div>

            {/* Right Column - Interactive Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-navy-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Platform Services</h3>
                    <p className="text-navy-300 text-sm">Comprehensive support for fund managers</p>
                  </div>
                  <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-gold-500" />
                  </div>
                </div>

                <div className="space-y-4">
                  {['Shared Services', 'Fund Administration', 'Capacity Building'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-navy-950/50 border border-white/5 hover:border-gold-500/30 hover:bg-navy-900 transition-all cursor-default group">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-navy-800 flex items-center justify-center text-xs font-mono text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors">
                          0{i + 1}
                        </div>
                        <span className="text-white font-medium">{item}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-navy-500 group-hover:text-gold-500 transition-colors" />
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs text-navy-400 font-mono">
                    <span>STATUS: ACTIVE</span>
                    <span className="text-gold-500">PHASE 1 DEPLOYED</span>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold-500/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-32 bg-navy-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-gold-500 font-mono text-xs tracking-wider uppercase">Our Offering</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-3">Integrated Solutions</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-navy-800/50 border border-white/5 p-8 rounded-3xl hover:bg-navy-800 transition-colors group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gold-500/0 via-transparent to-transparent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="w-16 h-16 bg-navy-900 rounded-2xl flex items-center justify-center mb-6 border border-white/5 group-hover:border-gold-500/30 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-navy-200 mb-8 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-navy-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-500"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridging the Gap Section - Visualized */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-semibold tracking-wider uppercase text-sm">Challenge</span>
            <h2 className="text-4xl font-serif font-bold text-navy-900 mt-2">Bridging the Gap</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto text-lg">
              Small and local capital providers are key to financing Africa&apos;s "missing middle," but they face significant operational hurdles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 h-full">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">High Setup Costs</h3>
              <p className="text-gray-600 leading-relaxed">
                Establishing a fund involves high fixed costs for legal, administration, and compliance, which can be prohibitive for smaller funds.
              </p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 h-full">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                <LineChart className="w-6 h-6 text-navy-900" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-4">Operational Drag</h3>
              <p className="text-gray-600 leading-relaxed">
                Managing back-office functions distracts fund managers from their core competency: sourcing and supporting deals.
              </p>
            </div>
            <div className="p-8 bg-gold-500/10 rounded-2xl border border-gold-500/20 h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 relative z-10">
                <CheckCircle2 className="w-6 h-6 text-gold-600" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-4 relative z-10">The Solution</h3>
              <p className="text-navy-800 leading-relaxed relative z-10">
                LAUNCH+ provides a shared services platform to reduce costs, streamline operations, and accelerate fund launch and growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Questionnaire Section */}
      <section className="py-32 bg-navy-900 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/noise.png')] opacity-5"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-[100px]"></div>

        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-[2.5rem] p-8 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden text-left">

            <div className="relative z-10">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Interested in LAUNCH+?</h2>
                <p className="text-navy-200 text-lg">Help us understand your needs by answering a few quick questions.</p>
              </div>

              <form className="space-y-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                      <Input id="name" placeholder="John Doe" className="bg-navy-950/50 border-navy-700 text-white focus:border-gold-500 focus:ring-gold-500/20 py-6" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="bg-navy-950/50 border-navy-700 text-white focus:border-gold-500 focus:ring-gold-500/20 py-6" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white font-medium mb-2 block">Are you currently managing a fund?</Label>
                    <RadioGroup defaultValue="no" className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-3 p-4 rounded-xl border border-navy-700 hover:border-gold-500 hover:bg-navy-800 transition-all bg-navy-950/30 cursor-pointer">
                        <RadioGroupItem value="yes" id="r1" className="text-gold-500 border-gray-600" />
                        <Label htmlFor="r1" className="cursor-pointer font-normal text-gray-300">Yes, I am currently managing a fund</Label>
                      </div>
                      <div className="flex items-center space-x-3 p-4 rounded-xl border border-navy-700 hover:border-gold-500 hover:bg-navy-800 transition-all bg-navy-950/30 cursor-pointer">
                        <RadioGroupItem value="no" id="r2" className="text-gold-500 border-gray-600" />
                        <Label htmlFor="r2" className="cursor-pointer font-normal text-gray-300">No, I am in the process of setting one up</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="challenges" className="text-white font-medium">What are your biggest operational challenges?</Label>
                    <Textarea id="challenges" placeholder="Tell us about the hurdles you are facing..." className="bg-navy-950/50 border-navy-700 text-white focus:border-gold-500 focus:ring-gold-500/20 min-h-[120px]" />
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <Button className="bg-gold-500 hover:bg-gold-600 text-navy-950 px-10 py-7 text-lg rounded-full font-bold shadow-lg shadow-gold-500/20 transition-all w-full md:w-auto">
                    Submit Interest
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LaunchPlusIntro;
