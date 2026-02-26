import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

const partnerLogos = [
  { name: "Argidius Foundation", image: { name: "supporter1.webp" } },
  { name: "MacArthur Foundation", image: { name: "supporter2.webp" } },
  { name: "Small Foundation", image: { name: "supporter3.webp" } },
  { name: "FCDO", image: { name: "supporter4.webp" } },
  { name: "FSD Africa", image: { name: "supporter5.webp" } },
  { name: "The Lemelson Foundation", image: { name: "supporter6.webp" } },
];

// Inline SVG data URIs so images always show (no 404s, no external APIs)
const PLACEHOLDER_LOGO_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60" viewBox="0 0 120 60"><rect width="120" height="60" fill="#f1f5f9" rx="4"/><text x="60" y="36" font-family="system-ui,sans-serif" font-size="14" fill="#94a3b8" text-anchor="middle">Logo</text></svg>'
  );
function getAvatarSvgDataUri(initial: string) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><circle cx="64" cy="64" r="64" fill="#1e3a5f"/><text x="64" y="82" font-family="system-ui,sans-serif" font-size="56" font-weight="600" fill="#e5c158" text-anchor="middle">' +
        initial +
        "</text></svg>"
    )
  );
}

const boardMembers = [
  {
    name: "Thiaba Camara Sy",
    role: "Board Member",
    image: "/imagethiaba.webp",
    bio: "Thiaba is co-founder, chair of the board of directors and chair of the investment committee of WIC CAPITAL, the first impact fund dedicated to supporting women entrepreneurs in West Africa. During a rich career spanning 33 years in auditing, accounting and management consulting, Thiaba has served numerous public institutions and private companies in virtually every sector of the West African economy, which has enabled her to develop a strong international professional network over the years.",
  },
  {
    name: "Njeri Wagacha",
    role: "Board Member",
    image: "/imagenjeri.webp",
    bio: "Njeri Wagacha is a Corporate & Commercial Partner specialising in mergers and acquisitions, private equity and venture capital in that context, Employment Law and Competition Law. Njeri is the Co-Head of East Africa Industrials, Manufacturing & Trade sector. Njeri started off as Trainee Solicitor at Orrick, Herrington & Sutcliffe (Europe) LLP. She later joined a firm in Nairobi as an Associate. She was a Secondee at Anjarwalla, Collins & Haidermota, Dubai. In 2018 she was appointed as a Senior Associate at the firm in Nairobi. In 2020, Njeri joined Kieti Advocates LLP as a Partner.",
  },
  {
    name: "Paul Breloff",
    role: "Board Member",
    image: "/imagepaul.webp",
    bio: "Paul Breloff is the co-founder and CEO of Shortlist, a talent advisory firm offering executive search for leadership hiring at African startups and social enterprises scale their hiring, and driving workforce enablement programs to help young people access career on-ramps in climate, clean energy, and tech. Prior to that, Paul worked with SKS Microfinance, India's largest microfinance institution, leading a team of 20 in Hyderabad on business development, product, and strategic partnerships. Paul has also advised CGAP, Root Capital, Shell Foundation, BRAC, and others on access-to-finance issues globally and practiced corporate law with Mayer Brown. He is also an active angel investor and one of the founding members of Nairobi Business Angels.",
  },
  {
    name: "Hamdiya Ismaila",
    role: "Board Member",
    image: "/imagehamdiya.webp",
    bio: "Hamdiya is Founder and Chief Executive Officer of Savannah Impact Advisory who are managers of the Ci-Gaba Fund of Funds, the first private sector led fund of funds to be domiciled in Ghana and investing across the West African sub-region. She has over 23 years of experience in Finance and Investment with over 16 years' experience in fund of funds investing. She was the General Manager of Venture Capital Trust Fund (VCTF), a Ghanaian based fund of funds vehicle established to support emerging managers investing across West Africa. She has significant experience in Venture Capital/Private Equity (VC/PE) Fund Structuring, fund investing, fund management and understands the entrepreneurial ecosystem development issues firsthand.",
  },
];

function BoardMemberCard({
  member,
  index,
  flip,
}: {
  member: { name: string; role: string; image: string; bio: string };
  index: number;
  flip: boolean;
}) {
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const initial = member.name.charAt(0).toUpperCase();
  const avatarDataUri = getAvatarSvgDataUri(initial);
  const imageSrc = imageError ? avatarDataUri : member.image;
  const showToggle = member.bio.length > 200;

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative flex flex-col sm:flex-row gap-8 sm:gap-12 items-center ${flip ? "sm:flex-row-reverse" : ""}`}
    >
      <div className="shrink-0 w-full sm:w-[42%] max-w-sm">
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-navy-900 shadow-2xl">
          <div className="absolute inset-0 ring-2 ring-gold-400/40 ring-offset-4 ring-offset-amber-50 rounded-2xl z-10 pointer-events-none" aria-hidden />
          <img
            src={imageSrc}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-navy-900/90 to-transparent pointer-events-none" aria-hidden />
        </div>
      </div>
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-gold-600 mb-2">
          {member.role}
        </span>
        <h3 className="text-2xl sm:text-3xl font-display font-normal text-navy-900 mb-4">
          {member.name}
        </h3>
        <div className="text-slate-600 leading-relaxed font-sans text-sm sm:text-base">
          {showToggle ? (
            <>
              <p className={expanded ? "" : "line-clamp-4"}>{member.bio}</p>
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="mt-3 text-gold-600 hover:text-gold-700 font-semibold text-sm inline-flex items-center gap-1 underline-offset-2 hover:underline"
              >
                {expanded ? "Show less" : "Read more"}
              </button>
            </>
          ) : (
            <p>{member.bio}</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

const Partnership = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30">
      {/* Hero: full-bleed, bold typography */}
      <section className="relative scroll-mt-24 min-h-[85vh] flex flex-col justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{ backgroundImage: "url(/home.png)" }}
        >
          <div className="absolute inset-0 bg-navy-900/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,175,55,0.12),transparent)]" aria-hidden />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-24 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <p className="text-gold-400 text-sm font-bold uppercase tracking-[0.35em] mb-6">
              Partnerships
            </p>
            <h1 className="font-display font-normal text-white leading-[1.05] tracking-tight">
              <span className="block text-[3rem] sm:text-[4rem] md:text-[5rem] lg:text-[6rem] xl:text-[7rem]">Partners</span>
              <span className="block text-[2rem] sm:text-[2.5rem] md:text-3xl lg:text-4xl text-gold-400 mt-2 font-light">
                who back the mission
              </span>
            </h1>
            <div className="flex items-center gap-4 mt-10">
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-gold-500 to-transparent" aria-hidden />
              <p className="text-slate-300 text-lg sm:text-xl font-light leading-relaxed max-w-xl">
                A growing community of fund managers, funders, and fieldbuilders advancing finance for small and growing businesses in frontier markets.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner logos: bento-style band */}
      <section className="relative py-16 sm:py-20 bg-[#0f172a] border-y border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(212,175,55,0.03)_50%,transparent_100%)]" aria-hidden />
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gold-500/90 text-xs font-bold uppercase tracking-[0.25em] mb-10">
            Supporting the CFF mission
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {partnerLogos.map((logo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group flex items-center justify-center p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-gold-500/30 hover:bg-white/[0.06] transition-all duration-300"
              >
                <img
                  src={`/${logo.image.name}`}
                  alt={logo.name}
                  className="max-h-14 sm:max-h-20 w-full max-w-[180px] object-contain object-center opacity-90 group-hover:opacity-100 transition-opacity"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.onerror = null;
                    el.src = PLACEHOLDER_LOGO_SVG;
                    el.style.display = "";
                  }}
                />
                <span className="sr-only">{logo.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Members: alternating editorial layout */}
      <section className="scroll-mt-24 py-20 sm:py-28 lg:py-32 bg-gradient-to-b from-amber-50/80 via-white to-slate-50/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 sm:mb-20"
          >
            <span className="section-label text-gold-600">Governance</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-normal text-navy-900 mt-2">
              Board Members
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent rounded-full mt-5 mx-auto" />
            <p className="text-slate-600 font-sans text-lg mt-5 max-w-2xl mx-auto">
              Leadership guiding the Collaborative’s mission and strategy.
            </p>
          </motion.div>
          <div className="space-y-20 sm:space-y-28">
            {boardMembers.map((member, i) => (
              <BoardMemberCard key={i} member={member} index={i} flip={i % 2 === 1} />
            ))}
          </div>
        </div>
      </section>

      {/* Legal: compact strip */}
      <section className="py-12 sm:py-14 bg-navy-950 text-white border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
          <span className="shrink-0 inline-flex items-center gap-2 rounded-full bg-gold-500/15 px-4 py-1.5 text-gold-400 text-xs font-bold uppercase tracking-wider">
            Legal
          </span>
          <p className="text-slate-400 font-sans text-base sm:text-lg">
            CFF is a registered <strong className="text-slate-300">501(c)(3)</strong> non-profit incorporated in Delaware, United States.
          </p>
        </div>
      </section>

      {/* CTA: bold gradient band */}
      <section className="relative py-24 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(212,175,55,0.08),transparent_70%)]" aria-hidden />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-normal text-white mb-4">
            Get in touch
          </h2>
          <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-xl mx-auto font-sans leading-relaxed">
            Investor, field builder, or technical assistance provider—there’s a role for you in our network.
          </p>
          <Button
            asChild
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold text-base sm:text-lg px-10 sm:px-12 py-6 rounded-full shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 transition-all duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
          >
            <a href="mailto:hello@frontierfinance.org">
              <Mail className="w-5 h-5 mr-2 inline-block" aria-hidden /> Contact Our Partnership Team
            </a>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Partnership;
