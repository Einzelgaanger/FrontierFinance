import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

const partnerLogos = [
  { src: "/partners/Logo_Argidius_Transparent.png", alt: "Argidius Foundation" },
  { src: "/partners/MacArth_primary_logo_stacked.svg.png", alt: "MacArthur Foundation" },
  { src: "/partners/Small-Foundation-Logo-RGB-Black.png", alt: "Small Foundation" },
  { src: "/partners/FCDO Logo.png", alt: "FCDO" },
  { src: "/partners/FSD-Africa-Logo.png", alt: "FSD Africa" },
  { src: "/partners/The Lemelson Fooundation (1).png", alt: "The Lemelson Foundation" },
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
    image: "/board/thiaba-camara-sy.jpg",
    bio: "Thiaba is co-founder, chair of the board of directors and chair of the investment committee of WIC CAPITAL, the first impact fund dedicated to supporting women entrepreneurs in West Africa. During a rich career spanning 33 years in auditing, accounting and management consulting, Thiaba has served numerous public institutions and private companies in virtually every sector of the West African economy, which has enabled her to develop a strong international professional network over the years.",
  },
  {
    name: "Njeri Wagacha",
    role: "Board Member",
    image: "/board/njeri-wagacha.jpg",
    bio: "Njeri Wagacha is a Corporate & Commercial Partner specialising in mergers and acquisitions, private equity and venture capital in that context, Employment Law and Competition Law. Njeri is the Co-Head of East Africa Industrials, Manufacturing & Trade sector. Njeri started off as Trainee Solicitor at Orrick, Herrington & Sutcliffe (Europe) LLP. She later joined a firm in Nairobi as an Associate. She was a Secondee at Anjarwalla, Collins & Haidermota, Dubai. In 2018 she was appointed as a Senior Associate at the firm in Nairobi. In 2020, Njeri joined Kieti Advocates LLP as a Partner.",
  },
  {
    name: "Paul Breloff",
    role: "Board Member",
    image: "/board/paul-breloff.jpg",
    bio: "Paul Breloff is the co-founder and CEO of Shortlist, a talent advisory firm offering executive search for leadership hiring at African startups and social enterprises scale their hiring, and driving workforce enablement programs to help young people access career on-ramps in climate, clean energy, and tech. Prior to that, Paul worked with SKS Microfinance, India's largest microfinance institution, leading a team of 20 in Hyderabad on business development, product, and strategic partnerships. Paul has also advised CGAP, Root Capital, Shell Foundation, BRAC, and others on access-to-finance issues globally and practiced corporate law with Mayer Brown. He is also an active angel investor and one of the founding members of Nairobi Business Angels.",
  },
  {
    name: "Hamdiya Ismaila",
    role: "Board Member",
    image: "/board/hamdiya-ismaila.jpg",
    bio: "Hamdiya is Founder and Chief Executive Officer of Savannah Impact Advisory who are managers of the Ci-Gaba Fund of Funds, the first private sector led fund of funds to be domiciled in Ghana and investing across the West African sub-region. She has over 23 years of experience in Finance and Investment with over 16 years' experience in fund of funds investing. She was the General Manager of Venture Capital Trust Fund (VCTF), a Ghanaian based fund of funds vehicle established to support emerging managers investing across West Africa. She has significant experience in Venture Capital/Private Equity (VC/PE) Fund Structuring, fund investing, fund management and understands the entrepreneurial ecosystem development issues firsthand.",
  },
];

function BoardMemberCard({
  member,
  index,
}: {
  member: { name: string; role: string; image: string; bio: string };
  index: number;
}) {
  const [imageError, setImageError] = useState(false);
  const initial = member.name.charAt(0).toUpperCase();
  const avatarDataUri = getAvatarSvgDataUri(initial);
  const imageSrc = avatarDataUri;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gold-200/50 transition-all duration-300 p-8"
    >
      <div className="flex items-start gap-5 mb-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-navy-900 flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src={imageSrc}
            alt={member.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        </div>
        <div className="min-w-0">
          <h3 className="text-xl font-display font-normal text-navy-900">
            {member.name}
          </h3>
          <p className="text-sm text-gold-600 font-sans font-medium mt-0.5">
            {member.role}
          </p>
        </div>
      </div>
      <p className="text-slate-600 leading-relaxed font-sans text-base">
        {member.bio}
      </p>
    </motion.article>
  );
}

const Partnership = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-navy-950 font-sans selection:bg-gold-500/30">
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url(/home.png)" }}
        >
          <div className="absolute inset-0 bg-navy-900/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-navy-900/50" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 pb-16 sm:pb-20 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto"
          >
            <p className="font-display text-gold-400 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] mb-5">
              Partners
            </p>
            <h1 className="text-[2rem] sm:text-[2.6rem] md:text-[3.4rem] lg:text-[4rem] xl:text-[4.5rem] font-display font-normal text-white leading-[1.12] tracking-tight">
              Partners
            </h1>
            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto mt-6 leading-[1.7] font-sans font-light">
              The Collaborative is the product of a growing community of stakeholders interested in finance for small and growing businesses in frontier and emerging markets.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partner logos */}
      <section className="scroll-mt-24 py-24 bg-white rounded-t-[2.5rem] sm:rounded-t-[3rem] overflow-hidden -mt-8 sm:-mt-12 z-10 relative shadow-[0_-20px_50px_rgba(0,0,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <span className="section-label text-gold-600">Our Partners</span>
            <h2 className="text-3xl sm:text-4xl font-display font-normal text-navy-900 mt-2">
              Supporting the CFF mission
            </h2>
            <div className="w-14 h-0.5 bg-gold-500/60 mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 sm:gap-10 items-center min-h-[100px]">
            {partnerLogos.map((logo, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center justify-center p-4 h-24 grayscale hover:grayscale-0 opacity-80 hover:opacity-100 transition-all duration-300"
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-16 w-full object-contain object-center"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.onerror = null;
                    el.src = PLACEHOLDER_LOGO_SVG;
                    el.style.display = "";
                  }}
                />
                <span className="hidden text-slate-300 text-sm font-medium text-center" aria-hidden>
                  {logo.alt}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Board Members */}
      <section className="scroll-mt-24 py-24 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <span className="section-label text-gold-600">Governance</span>
            <h2 className="text-3xl sm:text-4xl font-display font-normal text-navy-900 mt-2">
              Board Members
            </h2>
            <div className="w-14 h-0.5 bg-gold-500/60 mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {boardMembers.map((member, i) => (
              <BoardMemberCard key={i} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Legal status */}
      <section className="py-24 bg-navy-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900 via-navy-950 to-navy-900" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="section-label text-gold-400/90">Legal</span>
          <h2 className="text-2xl sm:text-3xl font-display font-normal text-white mt-2 mb-6">
            Our legal status
          </h2>
          <p className="text-slate-300 font-sans text-lg leading-relaxed">
            CFF is a registered 501(c)(3) non-profit organization incorporated in the state of Delaware, United States.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-display font-normal text-navy-900 mb-6">
            Get in touch
          </h2>
          <p className="text-slate-600 text-lg mb-10 max-w-2xl mx-auto font-sans">
            Whether you are an investor, a field builder, or a technical assistance provider, there is a role for you in our network.
          </p>
          <Button asChild className="bg-navy-900 hover:bg-navy-800 text-white text-lg px-10 py-6 rounded-full shadow-xl hover:shadow-2xl transition-all focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2">
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
