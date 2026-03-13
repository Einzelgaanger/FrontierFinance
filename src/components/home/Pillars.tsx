import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardStack, type CardStackItem } from '@/components/ui/card-stack';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export type PillarItem = CardStackItem & {
  subtitle?: string;
  lead?: string;
};

const pillarsData: PillarItem[] = [
  {
    id: 1,
    title: 'The Collective',
    subtitle: 'Networks',
    lead: 'Where peers align.',
    description: 'Connect with stakeholders facing similar challenges and join a peer network of actors operating with shared principles and ambitions.',
    imageSrc: '/home.png',
    href: '/about#how-we-work',
  },
  {
    id: 2,
    title: 'Evidence in Motion',
    subtitle: 'Actionable Research',
    lead: 'From data to decisions.',
    description: 'Access practical guidance and transparent data. We facilitate research to dispel common misconceptions in the sector.',
    imageSrc: '/eeee.png',
    href: '/about#how-we-work',
  },
  {
    id: 3,
    title: 'Built Together',
    subtitle: 'Initiatives',
    lead: 'Co-design, then launch.',
    description: 'Tangible support for early-stage investors. We co-design and launch initiatives that tackle complex SGB financing challenges.',
    imageSrc: '/12.png',
    href: '/about#how-we-work',
  },
];

const Pillars = () => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  // Laptop: more rectangular cards (wider, shorter); mobile: smaller cards, positioned higher
  const cardWidth = isMobile ? 240 : 520;
  const cardHeight = isMobile ? 260 : 280;
  const maxVisible = isMobile ? 3 : 5;
  const intervalMs = isMobile ? 4000 : 3200;

  return (
    <section
      id="how-it-works"
      className="pt-8 sm:pt-14 lg:pt-20 pb-8 sm:pb-14 lg:pb-20 bg-[#faf6f0] relative scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-5 sm:mb-16 lg:mb-12">
          <span className="inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-gold-600 font-sans">
            Our Approach
          </span>
          <h2 className="text-lg sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl font-display font-normal text-navy-900 mt-1.5 sm:mt-3 mb-2 sm:mb-6 px-2 leading-tight">
            How Does the Collaborative for <span className="text-gold-600">Frontier Finance</span> Work?
          </h2>
          <div className="w-12 sm:w-20 h-0.5 bg-gold-500 mx-auto rounded-full mb-3 sm:mb-8 lg:mb-6" />
          <p className="text-[12px] sm:text-lg md:text-xl lg:text-lg text-slate-600 max-w-4xl mx-auto font-sans font-light leading-snug sm:leading-[1.7] mb-2 sm:mb-6 px-1">
            The Collaborative for Frontier Finance works with diverse stakeholders – including fund managers, funders, and fieldbuilders – to accelerate financing solutions that target SGBs. We aim to set a common action agenda for SGB finance; to test and scale promising financing models; and to facilitate the flow of capital to the SGB market.
          </p>
          <p className="text-[11px] sm:text-base lg:text-sm text-slate-600 max-w-4xl mx-auto font-sans font-light leading-snug sm:leading-relaxed mb-3 sm:mb-10 lg:mb-8 px-1">
            With a bias to action, CFF works with stakeholders to identify, co-design and launch initiatives – specific solutions to SGB financing challenges – that are too complex for any one stakeholder to launch on their own.
          </p>
          <p className="text-[10px] sm:text-sm lg:text-xs font-display font-normal text-navy-800 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-4 sm:mb-12 lg:mb-8">
            We do this in three ways:
          </p>
        </div>

        <div className={cn('mx-auto w-full max-w-5xl px-0 sm:px-4', isMobile && '-mt-2')}>
          <CardStack<PillarItem>
            items={pillarsData}
            initialIndex={0}
            maxVisible={maxVisible}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            stageHeight={isMobile ? cardHeight + 24 : undefined}
            overlap={isMobile ? 0.55 : 0.5}
            spreadDeg={isMobile ? 36 : 42}
            activeLiftPx={isMobile ? 10 : 18}
            activeScale={1.02}
            inactiveScale={0.92}
            autoAdvance
            intervalMs={intervalMs}
            pauseOnHover
            showDots={!isMobile}
            showArrows={isMobile}
            showProgressBar={!isMobile}
            renderCard={(item, { active: isActive }) => {
              const content = (
                <div className="relative h-full w-full bg-navy-900">
                  <div className="absolute inset-0">
                    {item.imageSrc ? (
                      <img
                        src={item.imageSrc}
                        alt={item.title}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : null}
                  </div>
                  <div className="absolute inset-0 bg-navy-950/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent pointer-events-none z-[5]" aria-hidden />
                  <span className="absolute top-3 left-3 inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg bg-white/95 text-navy-900 font-display font-normal text-sm z-10">
                    {String(item.id).padStart(2, '0')}
                  </span>
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5 z-10">
                    {item.subtitle ? (
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-400 font-sans mb-1">
                        {item.subtitle}
                      </span>
                    ) : null}
                    <h3
                      className={cn(
                        'font-display font-normal text-white',
                        isActive ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                      )}
                    >
                      {item.title}
                    </h3>
                    {item.lead ? (
                      <p className="text-gold-200/90 text-xs sm:text-sm font-serif italic mt-1 border-l-2 border-gold-400/60 pl-3">
                        {item.lead}
                      </p>
                    ) : null}
                    {item.description ? (
                      <p className={cn(
                        'mt-2 leading-snug text-white',
                        isMobile ? 'text-[11px] line-clamp-2' : 'text-sm sm:text-base line-clamp-3'
                      )}>
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
              if (isActive && !reduceMotion) {
                return (
                  <motion.div
                    className="h-full w-full"
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 3.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {content}
                  </motion.div>
                );
              }
              return content;
            }}
          />
        </div>

        <div className="text-center mt-5 sm:mt-10 lg:mt-8">
          <Link to="/about#how-we-work" className="inline-block">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto min-h-[40px] sm:min-h-[48px] lg:min-h-12 lg:text-base text-sm sm:text-base rounded-full border-2 border-navy-900 text-navy-900 hover:bg-navy-900 hover:text-white font-semibold px-6 sm:px-8 lg:px-6 transition-all duration-300 group"
            >
              How we work
              <ArrowRight className="ml-1.5 sm:ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Pillars;
