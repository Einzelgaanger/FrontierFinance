
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronRight, LogIn } from 'lucide-react';
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
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Network', path: '/escp-network' },
        { name: 'Learning Hub', path: '/learning-hub' },
        { name: 'Events', path: '/our-events' },
        { name: 'Partnerships', path: '/partnership' },
        { name: 'Launch +', path: '/launch-plus-intro' },
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

                    {/* Mobile Menu Button - 44px min touch target for accessibility */}
                    <div className="lg:hidden flex items-center -mr-2">
                        <button
                            type="button"
                            aria-expanded={isMobileMenuOpen}
                            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className={cn(
                                "min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors touch-manipulation",
                                showSolidBg ? "text-slate-200" : "text-white"
                            )}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - scrollable when many links, safe area padding */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="lg:hidden bg-navy-900/98 backdrop-blur-xl border-t border-white/10 overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom,0px)]"
                    >
                        <nav className="px-4 pt-4 pb-8 space-y-1" aria-label="Mobile navigation">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        'block min-h-[48px] px-4 py-3 rounded-xl text-base font-medium transition-colors flex items-center justify-between',
                                        location.pathname === link.path
                                            ? 'bg-white/10 text-gold-400'
                                            : 'text-gray-300 hover:bg-white/5 hover:text-white active:bg-white/10'
                                    )}
                                >
                                    {link.name}
                                    <ChevronRight className="h-5 w-5 opacity-50 shrink-0" />
                                </Link>
                            ))}
                            <div className="pt-4 mt-2 space-y-3 border-t border-white/10">
                                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                    <Button variant="outline" className="w-full min-h-[48px] border-white/20 text-white hover:bg-white/10 hover:text-white justify-center rounded-xl">
                                        <LogIn className="mr-2 h-4 w-4" /> Sign In
                                    </Button>
                                </Link>
                                <Link to="/auth?tab=signup" onClick={() => setIsMobileMenuOpen(false)} className="block">
                                    <Button className="w-full min-h-[48px] bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold justify-center rounded-xl">
                                        Join Network
                                    </Button>
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
