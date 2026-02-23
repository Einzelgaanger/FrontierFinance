import { motion } from 'framer-motion';

const impacts = [
  {
    id: 1,
    title: 'Job Creation',
    desc: 'Create quality, long-term employment opportunities that increase incomes.',
  },
  {
    id: 2,
    title: 'Goods & Services',
    desc: 'Provide access to essential goods and services like health and education.',
  },
  {
    id: 3,
    title: 'Value Chain',
    desc: 'Integrate small businesses into supply chains, creating broader economic opportunities.',
  },
  {
    id: 4,
    title: 'Innovation',
    desc: 'Catalyze new approaches to serve customers with innovative business models.',
  },
];

const Impact = () => {
  return (
    <section className="pt-10 sm:pt-14 lg:pt-20 pb-16 sm:pb-24 lg:pb-28 bg-navy-900 relative overflow-hidden">
      {/* Brighter background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: content + cards */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-gold-400 font-sans">Sustainable Development</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-normal text-white mt-3 mb-4 sm:mb-6 leading-tight">
                The Impact of <span className="text-gold-300">SGB Financing</span>
              </h2>
              <p className="text-slate-200 mb-8 sm:mb-10 leading-[1.7] font-sans font-light text-sm sm:text-base max-w-xl">
                Increasing appropriate capital for SGBs directly contributes to achieving the Sustainable Development Goals.
              </p>

              <ul className="space-y-3 sm:space-y-4">
                {impacts.map((item, index) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="group flex gap-3 sm:gap-4 pl-4 sm:pl-5 border-l-2 border-gold-500/40 hover:border-gold-400/60 transition-colors duration-300 py-0.5 sm:py-1"
                  >
                    <span className="text-gold-500/80 text-xs font-medium tabular-nums mt-0.5 shrink-0 w-5 sm:w-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold font-sans text-white mb-0.5 sm:mb-1">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg">
                        {item.desc}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right: video in Networks-style card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 lg:sticky lg:top-28"
          >
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-wider text-gold-400 mb-4 font-sans">
                Impact in action
              </p>
              {/* Card design from Networks: rounded-3xl, border */}
              <div className="relative z-20 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
                <div className="relative aspect-video min-h-[280px] sm:min-h-[320px] w-full bg-navy-900">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/vQmrvp8R2fc?autoplay=1&loop=1&playlist=vQmrvp8R2fc&controls=1&mute=1&modestbranding=1&rel=0&showinfo=0"
                    title="Impact Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              {/* Decorative elements behind card (same as Networks) */}
              <div className="absolute -top-6 -right-6 w-full h-full border-2 border-gold-500/30 rounded-3xl z-10 hidden lg:block" aria-hidden />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl z-0" aria-hidden />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Impact;
