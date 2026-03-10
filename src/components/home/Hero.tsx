import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

const heroStats = [
  { num: 100, prefix: '', suffix: '+', title: 'Fund Manager Members', subtitle: 'Across 30+ countries' },
  { num: 2.25, prefix: '$', suffix: 'B', title: 'Capital Target', subtitle: 'Collectively raising' },
  { num: 1200, prefix: '', suffix: '+', title: 'SGBs Invested', subtitle: 'Portfolio companies' },
];

function AnimatedStat({
  stat,
  index,
  startCount,
}: {
  stat: (typeof heroStats)[0];
  index: number;
  startCount: boolean;
}) {
  const [displayNum, setDisplayNum] = useState(0);
  const { num, prefix, suffix, title, subtitle } = stat;

  useEffect(() => {
    if (!startCount) return;
    const duration = 1800;
    const startTime = performance.now();
    const step = (t: number) => {
      const elapsed = t - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) ** 2;
      const value = num * eased;
      setDisplayNum(value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [startCount, num]);

  const formatted =
    num >= 1000
      ? `${prefix}${Math.round(displayNum).toLocaleString()}${suffix}`
      : num >= 1 && num < 10
        ? `${prefix}${displayNum.toFixed(2)}${suffix}`
        : `${prefix}${Math.round(displayNum)}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.15 * (index + 1), duration: 0.5 }}
      className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-5"
    >
      <span
        className={`font-display tabular-nums font-normal ${index === 1 ? 'text-2xl sm:text-4xl md:text-5xl lg:text-6xl text-gold-300' : 'text-2xl sm:text-4xl md:text-5xl text-white'}`}
      >
        {formatted}
      </span>
      <div>
        <p className="font-sans font-semibold text-white/95 text-xs sm:text-base">{title}</p>
        <p className="font-sans text-white/60 text-[10px] sm:text-sm">{subtitle}</p>
      </div>
    </motion.div>
  );
}

const Hero = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(statsRef, { once: true, amount: 0.3 });
  const scrollToHowItWorks = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url(/CFF.jpg)' }}
      >
        <div className="absolute inset-0 bg-navy-950/25" />
        <div className="absolute inset-0 bg-navy-950/45" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-[max(5rem,calc(4.5rem+env(safe-area-inset-top,0px)))] sm:pt-20 pb-10 sm:pb-20 w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-10 lg:gap-12 xl:gap-16 items-center min-h-0 lg:min-h-[calc(100vh-8rem)]">
          {/* 1: Headline + tagline (phone: first; lg: left column top) */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:col-span-7 lg:col-start-1 text-center lg:text-left lg:pr-12 xl:pr-16"
          >
            <h1 className="text-[2.35rem] sm:text-[3rem] md:text-[3.75rem] lg:text-[4.5rem] xl:text-[5.75rem] font-marck font-semibold text-white leading-[1.12] tracking-tight">
              We Are Building a Better{' '}
              <br className="hidden sm:block" />
              <span className="text-gold-200 font-marck">
                Financial Ecosystem
              </span>
            </h1>

            <p className="text-sm sm:text-lg md:text-xl text-slate-200 max-w-xl mt-6 sm:mt-10 mx-auto lg:mx-0 leading-snug sm:leading-[1.7] font-sans font-medium">
              The Collaborative for Frontier Finance is a multi-stakeholder initiative that aims to increase access to capital for small and growing businesses in emerging markets.
            </p>
          </motion.div>

          {/* 2: Impact numbers (phone: second, above buttons; lg: right column) */}
          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:col-span-5 lg:col-start-8 relative mt-6 sm:mt-8"
          >
            {/* Short vertical line in the middle between sections (lg only) */}
            <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 xl:-translate-x-8 w-px h-40 bg-gold-500/60" aria-hidden />
            <p className="font-display text-gold-400 text-[10px] sm:text-sm font-semibold uppercase tracking-[0.25em] sm:tracking-[0.3em] mb-3 sm:mb-6">
              Our Impact in Numbers
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-6">
              {heroStats.map((stat, i) => (
                <AnimatedStat key={stat.title} stat={stat} index={i} startCount={isInView} />
              ))}
            </div>
          </motion.div>

          {/* 3: Buttons (phone: third, below stats; lg: left column below tagline) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="order-3 lg:col-span-7 lg:col-start-1 lg:row-start-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2 sm:gap-4 mt-6 sm:mt-8"
          >
            <a
              href="https://fvco2.share-eu1.hsforms.com/2GephDJrwRPay5zTsxJoG2A"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto min-h-[40px] sm:min-h-[48px] bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold px-5 sm:px-8 h-10 sm:h-14 text-sm sm:text-lg rounded-full shadow-finance-lg shadow-gold-500/25 hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Sign up for updates
                <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" />
              </Button>
            </a>
            <Link to="/#how-it-works" onClick={scrollToHowItWorks} className="w-full sm:w-auto flex justify-center lg:justify-start">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-h-[40px] sm:min-h-[48px] border-2 border-white text-white bg-white/10 hover:bg-white/20 hover:border-gold-400 hover:text-gold-100 px-5 sm:px-8 h-10 sm:h-14 text-sm sm:text-lg rounded-full backdrop-blur-md font-semibold shadow-[0_0_0_1px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <PlayCircle className="mr-1.5 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 shrink-0" aria-hidden />
                How It Works
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
