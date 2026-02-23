import { motion } from "framer-motion";

const stats = [
  {
    value: "100+",
    title: "Fund Manager Members",
    subtitle: "Across 30+ countries",
  },
  {
    value: "$2.25B",
    title: "Capital Target",
    subtitle: "Collectively raising",
  },
  {
    value: "1,200+",
    title: "SGBs Invested",
    subtitle: "Portfolio companies",
  },
];

const ImpactNumbers = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Big royal typography */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col justify-center"
          >
            <div className="space-y-2 sm:space-y-3">
              <p className="font-display text-navy-950 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[0.95] tracking-tight">
                Our
              </p>
              <p className="font-display text-gold-600 text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal leading-[0.95] tracking-tight">
                Impact
              </p>
              <p className="font-display text-navy-800/90 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[0.95] tracking-tight italic">
                in Numbers
              </p>
            </div>
            <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full mt-6 sm:mt-8" />
          </motion.div>

          {/* Vertical line - visible on lg+ */}
          <div className="hidden lg:block lg:col-span-1 self-stretch flex justify-center">
            <div className="w-px h-full min-h-[280px] bg-gradient-to-b from-transparent via-gold-500/60 to-transparent" />
          </div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6"
          >
            <div className="lg:hidden w-16 h-0.5 bg-gold-500/60 rounded-full mb-6" />
            <h3 className="font-display font-normal text-navy-900 text-2xl sm:text-3xl mb-8 sm:mb-10 tracking-tight">
              Our Impact in Numbers
            </h3>
            <div className="space-y-6 sm:space-y-8">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-6"
                >
                  <span className="font-display text-gold-600 text-3xl sm:text-4xl md:text-5xl font-normal tabular-nums">
                    {stat.value}
                  </span>
                  <div>
                    <p className="font-sans font-semibold text-navy-900 text-lg sm:text-xl">
                      {stat.title}
                    </p>
                    <p className="font-sans text-slate-600 text-sm sm:text-base">
                      {stat.subtitle}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

              </div>
    </section>
  );
};

export default ImpactNumbers;
