import { motion, useReducedMotion } from 'framer-motion';
import { CardStack, type CardStackItem } from '@/components/ui/card-stack';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export type TeamMemberItem = CardStackItem & {
  role: string;
  bio: string;
};

const teamData: TeamMemberItem[] = [
  {
    id: 1,
    title: 'Drew von Glahn',
    role: 'Executive Director',
    imageSrc: '/drewimage.webp',
    bio: "Drew von Glahn is the Executive Director of the Collaborative for Frontier Finance. A twenty-five year veteran of Wall Street, he has led over $30 billion in capital transactions across the globe, including a number of \"first-of-kind\" financings in the emerging and developed markets. His career includes CEO of a social venture business, co-founder of a leading advisory firm for social impact bonds, executive of a VC tech fund, and CFO of a fintech start-up. He managed the World Bank's venture philanthropy fund, a portfolio of over 100 early-stage enterprises. Leveraging his risk underwriting and capital markets experience, Drew has been actively engaged in the establishment of new impact capital financing vehicles for growth-oriented small businesses across the emerging markets; as well as engaged on investment committees for impact-oriented players, including Calvert Impact Capital, Nordic Development Fund's Catalyst Facility and Nyala Ventures.",
  },
  {
    id: 2,
    title: 'Arnold Byarugaba',
    role: 'Chief Operations Officer and Head of Networks',
    imageSrc: '/arnoldimage.webp',
    bio: "Arnold Byarugaba is the Chief Operations Officer and Head of Networks at Collaborative for Frontier Finance. He has 17 years of experience in finance, including Impact Investing with a focus on Small and Growing Businesses, having supported financing to businesses across sectors. While at Standard Bank Group, he specialised in structuring risk management solutions for FX, Interest Rate and Credit Risk. His Capital Markets experience includes managing a segregated investment portfolio of US$2B in stocks, bonds, private equity, and real estate at Stanlib East Africa, where he launched the first Unit Trust Funds in Uganda, which industry has now grown to US$1B. He has also been involved in several Market System Development initiatives like development of the Startup Act and BDS standards in Uganda. He most recently served as Investment Director at Iungo Capital and Head of Entrepreneurship and MSME Finance at Mastercard Foundation. Over the years, he has been part of some notable milestones like the flagship Mastercard Foundation Africa Growth Fund, MSE Recovery Fund, Credit Guarantes, and Hi-Innovator program. He is an African Angel Investor and holds an MBA from Heriot-Watt University and a BSc. Actuarial Science and Financial Mathematics from the University of Pretoria and Executive training from Harvard Business School.",
  },
  {
    id: 3,
    title: 'Gila Norich',
    role: 'Investment & Impact Finance Professional',
    imageSrc: '/gilaimage.webp',
    bio: "Gila Norich is an investment and impact finance professional with over 15 years of experience at the intersection of capital markets, impact strategy, and ecosystem building. She works with the Collaborative for Frontier Finance (CFF) to deepen the learning agenda and expand the flow of catalytic and institutional capital to small business growth funds across Africa and emerging markets. Her career spans roles in impact investing, ESG, and advisory—guiding family offices, DFIs, and philanthropic foundations on structuring blended finance vehicles, developing impact measurement frameworks, and aligning investments to the SDGs. She has advised the Bank of Zambia on structuring a national SME fund-of-funds, co-authored market-shaping research on small business finance, and supported local capital providers in advancing innovative instruments such as revenue-based financing, mezzanine debt, and local currency solutions. Gila began her career in strategy and advisory roles with organizations such as Physicians for Human Rights-IL, ClearlySo, Social Finance Israel, and the Global Steering Group for Impact Investment (GSG), where she helped launch multi-stakeholder initiatives at the G7 and UN levels. She holds an MBA and brings a strong background in building partnerships.",
  },
  {
    id: 4,
    title: 'Lisa Mwende',
    role: 'Operations Manager',
    imageSrc: '/lisaimage.webp',
    bio: "Lisa Mwende is the CFF Operations Manager. Lisa is an accomplished professional in finance and operations with seven years of experience. She has worked for international organisations supporting teams across Africa to streamline processes, manage operations and implement projects worth millions of dollars within budget. Lisa has demonstrated & proven knowledge of financial management and oversight. She previously worked at ANDE, where she was overseeing finance operations in Africa. She has a bachelor's degree in Commerce from Kabarak University in Kenya and is currently pursuing a master's degree in Project Management.",
  },
];

const Team = () => {
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();

  const cardWidth = isMobile ? 260 : 520;
  const cardHeight = isMobile ? 380 : 440;
  const maxVisible = isMobile ? 3 : 5;
  const intervalMs = isMobile ? 5500 : 4800;

  return (
    <section className="py-20 sm:py-28 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-gold-600 font-sans">Meet the Team</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-normal text-navy-900 mt-3 mb-4 tracking-tight">
            Our Core Team
          </h2>
          <div className="w-16 h-0.5 bg-gold-500/70 mx-auto rounded-full" />
          <p className="text-slate-600 font-sans font-light text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
            Leadership dedicated to bridging the missing middle and accelerating capital for small and growing businesses.
          </p>
        </motion.div>

        <div className={cn('mx-auto w-full max-w-5xl', isMobile && '-mt-2')}>
          <CardStack<TeamMemberItem>
            items={teamData}
            initialIndex={0}
            maxVisible={maxVisible}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
            stageHeight={isMobile ? cardHeight + 24 : undefined}
            overlap={isMobile ? 0.52 : 0.48}
            spreadDeg={isMobile ? 34 : 40}
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
                <div className="relative h-full w-full bg-white flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 shadow-xl">
                  {/* Image - fixed height so bio area is consistent */}
                  <div className="relative h-28 sm:h-36 shrink-0 overflow-hidden">
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="w-full h-full object-cover object-top"
                      draggable={false}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center justify-center min-w-[2rem] h-8 px-2 rounded-lg bg-white/95 text-navy-900 font-display font-normal text-sm z-10">
                      {String(item.id).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Name + role - fixed */}
                  <div className="shrink-0 px-4 pt-3 pb-2 border-b border-slate-100">
                    <h3
                      className={cn(
                        'font-display font-normal text-navy-900 tracking-tight',
                        isActive ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-gold-600 font-sans font-semibold text-xs sm:text-sm uppercase tracking-wider mt-0.5">
                      {item.role}
                    </p>
                  </div>

                  {/* Scrollable bio - long descriptions */}
                  <div className="relative flex-1 min-h-0 px-4 py-3">
                    <div className="h-full overflow-y-auto scrollbar-hide pr-1 text-slate-600 text-xs sm:text-sm leading-relaxed font-sans font-light">
                      {item.bio}
                    </div>
                    {/* Fade at bottom when scrollable */}
                    <div
                      className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent"
                      aria-hidden
                    />
                  </div>
                </div>
              );

              if (isActive && !reduceMotion) {
                return (
                  <motion.div
                    className="h-full w-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 4,
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
      </div>
    </section>
  );
};

export default Team;
