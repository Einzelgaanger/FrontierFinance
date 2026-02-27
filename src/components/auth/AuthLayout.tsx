import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    description: string;
}

const AUTH_HERO_IMAGE = '/home.png';
const AUTH_HERO_FALLBACK = '/CFF.jpg';

const AuthLayout = ({ children, title, description }: AuthLayoutProps) => {
    const navigate = useNavigate();

    return (
        <div
            className="min-h-screen min-h-[100dvh] grid grid-rows-[auto_1fr] lg:grid-rows-none lg:grid-cols-2 font-sans overflow-x-hidden"
            style={{ minHeight: '100dvh' } as React.CSSProperties}
        >
            {/* Visual side – desktop: full panel; mobile: top image strip */}
            <div className="lg:hidden relative w-full aspect-[2/1] min-h-[140px] max-h-[220px] sm:max-h-[260px] shrink-0 overflow-hidden bg-navy-950">
                <img
                    src={AUTH_HERO_IMAGE}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                    onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        if (!t.dataset.fallback) {
                            t.dataset.fallback = '1';
                            t.src = AUTH_HERO_FALLBACK;
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
                    <img
                        src="/CFF%20LOGO.png"
                        alt="CFF Logo"
                        className="h-8 sm:h-10 w-auto object-contain drop-shadow-lg"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                        }}
                    />
                    <span className="text-white font-display font-medium text-sm sm:text-base drop-shadow-md">Frontier Finance</span>
                </div>
            </div>

            {/* Desktop-only visual panel with local image */}
            <div className="hidden lg:flex relative bg-navy-950 items-center justify-start pl-8 xl:pl-12 pr-8 xl:pr-12 overflow-hidden">
                <img
                    src={AUTH_HERO_IMAGE}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-45"
                    onError={(e) => {
                        const t = e.target as HTMLImageElement;
                        if (!t.dataset.fallback) {
                            t.dataset.fallback = '1';
                            t.src = AUTH_HERO_FALLBACK;
                        }
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-navy-950/92 via-navy-900/88 to-navy-950/92" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-royal-light/20 rounded-full blur-3xl animate-float" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
                </div>
                <div className="relative z-10 max-w-md text-white space-y-6 text-left">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src="/CFF%20LOGO.png"
                            alt="CFF Logo"
                            className="h-16 xl:h-20 w-auto object-contain mb-5 mix-blend-lighten"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                        <h1 className="text-3xl xl:text-4xl font-display font-normal leading-tight mb-3 tracking-tight">
                            Frontier Finance <br />
                            <span className="text-gold-400">Database Platform</span>
                        </h1>
                        <p className="text-sm xl:text-base text-navy-100/80 max-w-sm font-light leading-relaxed">
                            Access comprehensive fund manager data, analytics, and community insights in one professional ecosystem.
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex gap-3 items-center"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-navy-900 bg-navy-800 flex items-center justify-center text-xs font-medium text-white">
                                    {i}
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium text-white">Trusted by Industry Leaders</span>
                            <span className="text-[11px] text-navy-300">Join the growing network</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Form side – scrollable, safe-area aware */}
            <div
                className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 pt-[max(1rem,env(safe-area-inset-top,0))] relative overflow-y-auto min-h-0 lg:min-h-screen lg:min-h-[100dvh] pb-[env(safe-area-inset-bottom,0)] bg-gradient-to-b from-slate-50/100 via-white to-slate-50/80 dark:from-navy-950 dark:via-navy-950 dark:to-navy-900/50"
                style={{ minHeight: 'min(100dvh, 100vh)' } as React.CSSProperties}
            >
                {/* Subtle grid texture */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.02)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.02)_1px,transparent_1px)] pointer-events-none" />

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/')}
                    className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 min-h-[44px] min-w-[44px] sm:min-w-0 sm:px-4 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-navy-400 dark:hover:text-white dark:hover:bg-white/10 rounded-full border-0 touch-manipulation font-medium"
                >
                    <Home className="w-4 h-4 sm:mr-2 shrink-0" />
                    <span className="hidden sm:inline">Back to Home</span>
                </Button>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="w-full max-w-[400px] relative z-10 py-6 sm:py-8 lg:py-0 mx-auto flex-1 flex flex-col justify-center"
                >
                    <div className="mb-5 sm:mb-6 text-center lg:hidden">
                        <img
                            src="/CFF%20LOGO.png"
                            alt="CFF Logo"
                            className="h-11 sm:h-12 mx-auto mb-2 object-contain brightness-0 invert dark:brightness-100 dark:invert-0 opacity-90"
                        />
                        <p className="text-sm font-medium text-slate-600 dark:text-navy-400 tracking-wide">Frontier Finance</p>
                    </div>

                    <div className="bg-white dark:bg-navy-900/40 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-navy-700/80 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08),0_2px_8px_-2px_rgba(15,23,42,0.04)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] p-6 sm:p-8 lg:p-8">
                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-2xl sm:text-[1.75rem] font-display font-semibold text-slate-900 dark:text-white tracking-tight">
                                {title}
                            </h1>
                            <p className="text-slate-500 dark:text-navy-400 mt-2 text-sm sm:text-base max-w-[280px] mx-auto leading-relaxed">
                                {description}
                            </p>
                        </div>
                        {children}
                    </div>

                    <p className="text-center mt-6 text-slate-400 dark:text-navy-500 text-[11px] sm:text-xs font-medium">
                        &copy; {new Date().getFullYear()} Frontier Finance
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
