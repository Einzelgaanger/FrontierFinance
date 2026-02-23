import { Link } from 'react-router-dom';
import { ArrowUpRight, Mail, Globe } from 'lucide-react';

/* Official-style brand logos as inline SVGs for social */
const LinkedInLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const XTwitterLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* Official YouTube logo: play button in rounded rect */
const YouTubeLogo = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const quickLinks = [
  { to: '/about', label: 'About Us', accent: 'emerald' },
  { to: '/escp-network', label: 'Network', accent: 'sky' },
  { to: '/learning-hub', label: 'Learning Hub', accent: 'amber' },
  { to: '/our-events', label: 'Events', accent: 'violet' },
  { to: '/contact', label: 'Contact', accent: 'rose' },
];

const linkAccentClasses: Record<string, string> = {
  emerald: 'text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 [&>.dot]:bg-emerald-500/60 [&>.dot]:group-hover:bg-emerald-400 [&>.arrow]:text-emerald-400',
  sky: 'text-slate-300 hover:text-sky-400 hover:bg-sky-500/10 [&>.dot]:bg-sky-500/60 [&>.dot]:group-hover:bg-sky-400 [&>.arrow]:text-sky-400',
  amber: 'text-slate-300 hover:text-amber-400 hover:bg-amber-500/10 [&>.dot]:bg-amber-500/60 [&>.dot]:group-hover:bg-amber-400 [&>.arrow]:text-amber-400',
  violet: 'text-slate-300 hover:text-violet-400 hover:bg-violet-500/10 [&>.dot]:bg-violet-500/60 [&>.dot]:group-hover:bg-violet-400 [&>.arrow]:text-violet-400',
  rose: 'text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 [&>.dot]:bg-rose-500/60 [&>.dot]:group-hover:bg-rose-400 [&>.arrow]:text-rose-400',
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white font-sans relative overflow-hidden bg-black">
      {/* Subtle gradient orbs for depth */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2" aria-hidden />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl translate-y-1/2" aria-hidden />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl translate-x-1/2" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 lg:pt-14 pb-6 sm:pb-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <Link to="/" className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded">
              <img
                src="/CFF%20LOGO.png"
                alt="Collaborative for Frontier Finance"
                className="h-10 sm:h-12 w-auto object-contain hover:opacity-95 transition-opacity"
              />
            </Link>
            <p className="text-slate-400 text-sm sm:text-base max-w-md leading-relaxed">
              A multi-stakeholder initiative increasing access to capital for small and growing businesses in emerging markets through networks, research, and initiatives.
            </p>
            <div className="flex gap-2">
              <a href="https://www.linkedin.com/company/collaborative-for-frontier-finance/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/30 hover:text-[#0A66C2]/90 transition-all duration-300" aria-label="LinkedIn">
                <LinkedInLogo className="w-5 h-5" />
              </a>
              <a href="https://x.com/CollabFFinance" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white transition-all duration-300" aria-label="X (Twitter)">
                <XTwitterLogo className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/@collabforfrontierfinance?si=ua-ztIRJTQFjWasS" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-lg bg-[#FF0000]/20 text-[#FF0000] hover:bg-[#FF0000]/30 hover:text-[#ff3333] transition-all duration-300" aria-label="YouTube">
                <YouTubeLogo className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-slate-400">
              Quick Links
            </h3>
            <ul className="space-y-0.5 text-sm">
              {quickLinks.map(({ to, label, accent }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className={`inline-flex items-center gap-2 py-1.5 px-2 -mx-2 rounded-lg transition-all duration-200 group ${linkAccentClasses[accent]}`}
                  >
                    <span className="dot w-1.5 h-1.5 rounded-full transition-colors duration-200" />
                    {label}
                    <ArrowUpRight className="arrow w-3.5 h-3.5 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200 shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-slate-400">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5 group">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 shrink-0 group-hover:bg-sky-500/30 transition-all duration-300" aria-hidden>
                  <Mail className="w-4 h-4" />
                </span>
                <a href="mailto:info@frontierfinance.org" className="text-slate-400 hover:text-sky-400 transition-colors leading-relaxed">
                  info@frontierfinance.org
                </a>
              </li>
              <li className="flex items-center gap-2.5 group">
                <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 group-hover:bg-emerald-500/30 transition-all duration-300" aria-hidden>
                  <Globe className="w-4 h-4" />
                </span>
                <span className="text-slate-400 leading-relaxed">Global Network — operating remotely in key hubs</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-10 pt-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
            <p className="text-slate-500">
              &copy; {currentYear} Collaborative for Frontier Finance. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1">
              <Link to="/privacy" className="text-slate-500 hover:text-amber-400 transition-colors font-medium">Privacy</Link>
              <Link to="/terms" className="text-slate-500 hover:text-violet-400 transition-colors font-medium">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
