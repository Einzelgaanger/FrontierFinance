import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, LogIn, UserPlus, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
const AUTH_HERO_IMAGE = '/home.png';
const AUTH_HERO_FALLBACK = '/CFF.jpg';

type Intent = 'signin' | 'join';

const signinSteps = [
  {
    title: 'First, find your company',
    description: 'On the next page you’ll see a search box at the top. Use it to search by your company name or work email. If your organization is already in the network, your account will appear — then you can sign in or reset your password.',
    icon: Search,
  },
  {
    title: 'Then sign in',
    description: 'After you find your company, click “Sign in” next to your email to fill in your password. If you don’t remember it, use “Forgot password” on that same page.',
    icon: LogIn,
  },
];

const joinSteps = [
  {
    title: 'Is your company already in the network?',
    description: 'If your organization is already a member, you don’t need to create a new account. On the next page, use the search box to find your company by name or email, then sign in or reset your password.',
    icon: Building2,
  },
  {
    title: 'New to the network?',
    description: 'If you don’t find your company, use “Sign up” to create an account. You’ll enter your company name, email, and set a password. After confirming your email, you can sign in and explore the platform.',
    icon: UserPlus,
  },
];

export default function GetStarted() {
  const [searchParams] = useSearchParams();
  const intentParam = searchParams.get('intent');
  const intent: Intent = intentParam === 'join' ? 'join' : 'signin';
  const steps = intent === 'signin' ? signinSteps : joinSteps;

  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const isSignIn = intent === 'signin';
  const isLastStep = step === steps.length - 1;

  const handleContinue = () => {
    if (isLastStep) {
      if (isSignIn) {
        navigate('/auth');
      } else {
        navigate('/auth?tab=signup');
      }
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      navigate('/');
      return;
    }
    setStep((s) => s - 1);
  };

  const title = isSignIn ? 'Sign in to your account' : 'Join the network';
  const description = isSignIn
    ? 'We’ll take you through the quick steps to sign in.'
    : 'Here’s how to get access — whether your company is already in the network or not.';

  return (
    <div
      className="min-h-screen min-h-[100dvh] grid grid-rows-[auto_1fr] lg:grid-rows-none lg:grid-cols-2 font-sans overflow-x-hidden pt-20 sm:pt-24 lg:pt-0"
      style={{ minHeight: '100dvh' } as React.CSSProperties}
    >
      {/* Visual side – match AuthLayout */}
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
          <img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-8 sm:h-10 w-auto object-contain drop-shadow-lg" />
          <span className="text-white font-display font-medium text-sm sm:text-base drop-shadow-md">Frontier Finance</span>
        </div>
      </div>

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
        <div className="relative z-10 max-w-md text-white space-y-6 text-left">
          <img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-16 xl:h-20 w-auto object-contain mb-5 mix-blend-lighten" />
          <h1 className="text-3xl xl:text-4xl font-display font-normal leading-tight mb-3 tracking-tight">
            Get started <br />
            <span className="text-gold-400">{isSignIn ? 'Sign in' : 'Join the network'}</span>
          </h1>
          <p className="text-sm xl:text-base text-navy-100/80 max-w-sm font-light leading-relaxed">
            {isSignIn
              ? 'Find your company on the next page, then sign in with your email and password.'
              : 'Search for your company first — or create an account if you’re new.'}
          </p>
          <div className="flex gap-2 pt-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-gold-500' : 'w-1.5 bg-navy-600'}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content side */}
      <div
        className="flex flex-col items-center justify-center p-4 sm:p-6 lg:p-12 pt-[max(1rem,env(safe-area-inset-top,0))] relative overflow-y-auto min-h-0 lg:min-h-screen lg:min-h-[100dvh] pb-[env(safe-area-inset-bottom,0)] bg-gradient-to-b from-slate-50/100 via-white to-slate-50/80 dark:from-navy-950 dark:via-navy-950 dark:to-navy-900/50"
        style={{ minHeight: 'min(100dvh, 100vh)' } as React.CSSProperties}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgb(0_0_0/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(0_0_0/0.02)_1px,transparent_1px)] bg-[size:24px_24px] dark:bg-[linear-gradient(to_right,rgb(255_255_255/0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.02)_1px,transparent_1px)] pointer-events-none" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 min-h-[44px] min-w-[44px] sm:min-w-0 sm:px-4 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-navy-400 dark:hover:text-white dark:hover:bg-white/10 rounded-full border-0 touch-manipulation font-medium"
        >
          <Home className="w-4 h-4 sm:mr-2 shrink-0" />
          <span className="hidden sm:inline">Back to Home</span>
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] relative z-10 py-6 sm:py-8 lg:py-0 mx-auto flex-1 flex flex-col justify-center"
        >
          <div className="mb-5 sm:mb-6 text-center lg:hidden">
            <img src="/CFF%20LOGO.png" alt="CFF Logo" className="h-11 sm:h-12 mx-auto mb-2 object-contain brightness-0 invert dark:brightness-100 dark:invert-0 opacity-90" />
            <p className="text-sm font-medium text-slate-600 dark:text-navy-400 tracking-wide">Frontier Finance</p>
          </div>

          <div className="bg-white dark:bg-navy-900/40 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-navy-700/80 shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-[1.75rem] font-display font-semibold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h1>
              <p className="text-slate-500 dark:text-navy-400 mt-2 text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex gap-2 mb-6 justify-center lg:hidden">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i <= step ? 'w-8 bg-gold-500' : 'w-1.5 bg-slate-200 dark:bg-navy-600'}`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {(() => {
                  const s = steps[step];
                  const Icon = s.icon;
                  return (
                    <>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-navy-800/50 border border-slate-200/80 dark:border-navy-700/50">
                        <div className="w-10 h-10 rounded-xl bg-gold-500/20 dark:bg-gold-500/30 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-gold-600 dark:text-gold-400" />
                        </div>
                        <div>
                          <h2 className="font-semibold text-slate-900 dark:text-white">{s.title}</h2>
                          <p className="text-sm text-slate-600 dark:text-navy-300 mt-1.5 leading-relaxed">{s.description}</p>
                        </div>
                      </div>

                      {!isSignIn && step === 0 && (
                        <p className="text-xs text-slate-500 dark:text-navy-400 text-center">
                          Already have an account?{' '}
                          <Link to="/get-started?intent=signin" className="font-medium text-gold-600 dark:text-gold-400 hover:underline">
                            Go to sign in
                          </Link>
                        </p>
                      )}
                    </>
                  );
                })()}
              </motion.div>
            </AnimatePresence>

            <div className="flex gap-3 mt-8">
              {step > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 min-h-[44px] rounded-xl border-slate-300 dark:border-navy-600"
                  onClick={handleBack}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={handleContinue}
                className={`${step > 0 ? 'flex-1' : 'w-full'} min-h-[44px] rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold shadow-md`}
              >
                {isLastStep ? (
                  <>
                    {isSignIn ? 'Continue to Sign in' : 'Continue to Join'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <p className="text-center mt-6 text-slate-400 dark:text-navy-500 text-[11px] sm:text-xs font-medium">
            &copy; {new Date().getFullYear()} Frontier Finance
          </p>
        </motion.div>
      </div>
    </div>
  );
}
