import { motion } from 'framer-motion';

const Team = () => {
  const team = [
    {
      id: 1,
      name: 'Drew von Glahn',
      role: 'Executive Director',
      image: '/drewimage.webp',
      bio: "Drew von Glahn is the Executive Director of the Collaborative for Frontier Finance. A twenty-five year veteran of Wall Street, he has led over $30 billion in capital transactions across the globe, including a number of \"first-of-kind\" financings in the emerging and developed markets. His career includes CEO of a social venture business, co-founder of a leading advisory firm for social impact bonds, executive of a VC tech fund, and CFO of a fintech start-up. He managed the World Bank's venture philanthropy fund, a portfolio of over 100 early-stage enterprises. Leveraging his risk underwriting and capital markets experience, Drew has been actively engaged in the establishment of new impact capital financing vehicles for growth-oriented small businesses across the emerging markets; as well as engaged on investment committees for impact-oriented players, including Calvert Impact Capital, Nordic Development Fund's Catalyst Facility and Nyala Ventures.",
    },
    {
      id: 2,
      name: 'Arnold Byarugaba',
      role: 'Chief Operations Officer and Head of Networks',
      image: '/arnoldimage.webp',
      bio: "Arnold Byarugaba is the Chief Operations Officer and Head of Networks at Collaborative for Frontier Finance. He has 17 years of experience in finance, including Impact Investing with a focus on Small and Growing Businesses, having supported financing to businesses across sectors. While at Standard Bank Group, he specialised in structuring risk management solutions for FX, Interest Rate and Credit Risk. His Capital Markets experience includes managing a segregated investment portfolio of US$2B in stocks, bonds, private equity, and real estate at Stanlib East Africa, where he launched the first Unit Trust Funds in Uganda, which industry has now grown to US$1B. He has also been involved in several Market System Development initiatives like development of the Startup Act and BDS standards in Uganda. He most recently served as Investment Director at Iungo Capital and Head of Entrepreneurship and MSME Finance at Mastercard Foundation. Over the years, he has been part of some notable milestones like the flagship Mastercard Foundation Africa Growth Fund, MSE Recovery Fund, Credit Guarantes, and Hi-Innovator program. He is an African Angel Investor and holds an MBA from Heriot-Watt University and a BSc. Actuarial Science and Financial Mathematics from the University of Pretoria and Executive training from Harvard Business School.",
    },
    {
      id: 3,
      name: 'Gila Norich',
      role: 'Investment & Impact Finance Professional',
      image: '/gilaimage.webp',
      bio: "Gila Norich is an investment and impact finance professional with over 15 years of experience at the intersection of capital markets, impact strategy, and ecosystem building. She works with the Collaborative for Frontier Finance (CFF) to deepen the learning agenda and expand the flow of catalytic and institutional capital to small business growth funds across Africa and emerging markets. Her career spans roles in impact investing, ESG, and advisory—guiding family offices, DFIs, and philanthropic foundations on structuring blended finance vehicles, developing impact measurement frameworks, and aligning investments to the SDGs. She has advised the Bank of Zambia on structuring a national SME fund-of-funds, co-authored market-shaping research on small business finance, and supported local capital providers in advancing innovative instruments such as revenue-based financing, mezzanine debt, and local currency solutions. Gila began her career in strategy and advisory roles with organizations such as Physicians for Human Rights-IL, ClearlySo, Social Finance Israel, and the Global Steering Group for Impact Investment (GSG), where she helped launch multi-stakeholder initiatives at the G7 and UN levels. She holds an MBA and brings a strong background in building partnerships.",
    },
    {
      id: 4,
      name: 'Lisa Mwende',
      role: 'Operations Manager',
      image: '/lisaimage.webp',
      bio: "Lisa Mwende is the CFF Operations Manager. Lisa is an accomplished professional in finance and operations with seven years of experience. She has worked for international organisations supporting teams across Africa to streamline processes, manage operations and implement projects worth millions of dollars within budget. Lisa has demonstrated & proven knowledge of financial management and oversight. She previously worked at ANDE, where she was overseeing finance operations in Africa. She has a bachelor's degree in Commerce from Kabarak University in Kenya and is currently pursuing a master's degree in Project Management.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-slate-50/50 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
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

        {/* Team members: alternating layout */}
        <div className="space-y-20 sm:space-y-24">
          {team.map((member, index) => (
            <motion.article
              key={member.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.06 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start"
            >
              {/* Image block — always left */}
              <div className="lg:col-span-5 lg:col-start-1">
                <div className="relative max-w-sm mx-auto lg:mx-0">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-200/50 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200/80">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border border-gold-400/30 -z-10" aria-hidden />
                </div>
              </div>

              {/* Content block — always right */}
              <div className="lg:col-span-7 lg:col-start-6 flex flex-col justify-center lg:pl-4">
                <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-600/90 font-sans mb-3 block">
                  Leadership
                </span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-normal text-navy-900 tracking-tight leading-tight mb-2">
                  {member.name}
                </h3>
                <div className="w-12 h-0.5 bg-gold-500 rounded-full mb-4" />
                <p className="text-gold-700 font-semibold text-sm uppercase tracking-wider font-sans mb-6">
                  {member.role}
                </p>
                <div className="border-l-2 border-gold-400/50 pl-5 sm:pl-6">
                  <p className="text-slate-600 text-sm sm:text-base leading-[1.75] font-sans font-light max-w-xl">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
