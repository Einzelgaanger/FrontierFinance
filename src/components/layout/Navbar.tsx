
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronRight, LogIn, UserPlus, Home, Info, Users, BookOpen, Calendar, Handshake, Rocket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open (better UX on small screens)
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
        };
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'About', path: '/about', icon: Info },
        { name: 'Network', path: '/escp-network', icon: Users },
        { name: 'Learning Hub', path: '/learning-hub', icon: BookOpen },
        { name: 'Events', path: '/our-events', icon: Calendar },
        { name: 'Partnerships', path: '/partnership', icon: Handshake },
        { name: 'Launch +', path: '/launch-plus-intro', icon: Rocket },
    ];

    const showSolidBg = isScrolled;

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans',
                'pt-[max(0.75rem,env(safe-area-inset-top,0px))] pl-[env(safe-area-inset-left,0px)] pr-[env(safe-area-inset-right,0px)]',
                showSolidBg
                    ? 'bg-navy-950/95 backdrop-blur-md shadow-finance pb-3'
                    : 'bg-transparent pb-5'
            )}
        >
            <div className="relative z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo: original on transparent hero, color logomark when scrolled/solid */}
                    <Link to="/" className="flex-shrink-0 relative group">
                        <img
                            src="/CFF%20LOGO.png"
                            alt="Collaborative for Frontier Finance"
                            className="h-12 sm:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    'text-sm font-medium transition-colors relative group',
                                    location.pathname === link.path
                                        ? 'text-gold-400'
                                        : showSolidBg ? 'text-slate-200 hover:text-white' : 'text-white/90 hover:text-white'
                                )}
                            >
                                {link.name}
                                <span className={cn(
                                    "absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full",
                                    location.pathname === link.path ? "w-full" : ""
                                )} />
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link to="/auth">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "hover:text-gold-300 hover:bg-white/10",
                                    showSolidBg ? "text-slate-200" : "text-white"
                                )}
                            >
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/auth?tab=signup">
                            <Button className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold rounded-full px-6 shadow-finance shadow-gold-500/20 hover:shadow-gold-glow transition-all duration-300 hover:-translate-y-0.5">
                                Join Network
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button - professional pill with clear affordance */}
                    <div className="lg:hidden flex items-center">
                        <button
                            type="button"
                            aria-expanded={isMobileMenuOpen}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-controls="mobile-nav"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={cn(
                                "min-w-[48px] min-h-[48px] flex flex-col items-center justify-center gap-1.5 rounded-xl border transition-all duration-200 touch-manipulation",
                                "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-950",
                                showSolidBg
                                    ? "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-slate-200"
                                    : "border-white/25 bg-white/5 hover:bg-white/10 hover:border-white/40 text-white",
                                isMobileMenuOpen && "bg-white/10 border-gold-500/40 ring-2 ring-gold-500/20"
                            )}
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-5 w-5 stroke-[2.5]" aria-hidden />
                            ) : (
                                <Menu className="h-5 w-5 stroke-[2.5]" aria-hidden />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop: click outside to close menu (mobile only) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 lg:hidden bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-hidden
                    />
                )}
            </AnimatePresence>

            {/* Mobile Menu - professional slide-down panel */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        id="mobile-nav"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Main menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="relative z-50 lg:hidden bg-navy-900/98 backdrop-blur-xl border-t border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.4)] overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,0px)]"
                    >
                        <nav className="px-3 pt-4 pb-6 space-y-0.5" aria-label="Mobile navigation">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 min-h-[40px] px-3 py-2.5 rounded-lg text-sm font-medium tracking-tight transition-colors',
                                            location.pathname === link.path
                                                ? 'bg-gold-500/10 text-gold-400'
                                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                        )}
                                    >
                                        <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={2} />
                                        <span className="flex-1 text-left">{link.name}</span>
                                        <ChevronRight className="h-3.5 w-3.5 text-slate-500 shrink-0" strokeWidth={2.5} />
                                    </Link>
                                );
                            })}
                            <div className="pt-4 mt-3 space-y-2 border-t border-white/10">
                                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                    <span className="flex items-center justify-center gap-2 w-full min-h-[40px] px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-500/50 text-slate-300 bg-white/5 hover:bg-slate-500/10 hover:text-white hover:border-slate-400/50 transition-colors">
                                        <LogIn className="h-4 w-4" /> Sign In
                                    </span>
                                </Link>
                                <Link to="/auth?tab=signup" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                    <span className="flex items-center justify-center gap-2 w-full min-h-[40px] px-4 py-2.5 rounded-lg text-sm font-semibold bg-gold-500 text-navy-950 hover:bg-gold-400 shadow-sm hover:shadow transition-colors">
                                        <UserPlus className="h-4 w-4" /> Join Network
                                    </span>
                                </Link>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
