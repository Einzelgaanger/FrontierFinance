import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Lock, User, Eye, EyeOff, CheckCircle, ArrowRight, Search, LogIn, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from './AuthLayout';
import { supabase } from '@/integrations/supabase/client';

export interface AccountLookupResult {
  email: string;
  company_name: string;
}

const getErrorMessage = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string') {
    const message = (error as any).message;

    if (message.includes('500')) {
      return 'Server error (500). This might be a temporary Supabase service issue. Please try again in a few moments.';
    }
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Please check your email and click the confirmation link before signing in.';
    }
    if (message.includes('Too many requests')) {
      return 'Too many login attempts. Please wait a few minutes before trying again.';
    }

    return message;
  }
  return 'An unexpected error occurred. Please try again.';
};

export default function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signInForm, setSignInForm] = useState({ email: '', password: '' });
  const [signUpForm, setSignUpForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: ''
  });

  const location = useLocation();
  const tabFromUrl = new URLSearchParams(location.search).get('tab');
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>(tabFromUrl === 'signup' ? 'signup' : 'signin');

  const [accountQuery, setAccountQuery] = useState('');
  const [accountResults, setAccountResults] = useState<AccountLookupResult[]>([]);
  const [accountLoading, setAccountLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const runAccountLookup = useCallback(async (q: string) => {
    if (q.length < 2) {
      setAccountResults([]);
      return;
    }
    setAccountLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke<{ results: AccountLookupResult[]; error?: string }>('account-lookup', { body: { q } });
      if (error) throw error;
      setAccountResults(data?.results ?? []);
    } catch {
      setAccountResults([]);
    } finally {
      setAccountLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => runAccountLookup(accountQuery), 300);
    return () => clearTimeout(t);
  }, [accountQuery, runAccountLookup]);

  const checkPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score, strength: score < 3 ? 'weak' : score < 4 ? 'medium' : 'strong' };
  };

  const passwordStrength = checkPasswordStrength(signUpForm.password);
  const passwordsMatch = signUpForm.password === signUpForm.confirmPassword;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(signInForm.email, signInForm.password);

      if (error) {
        const errorMessage = getErrorMessage(error);
        toast({
          title: "Sign In Failed",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Sign In Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordStrength.score < 3) {
      toast({
        title: "Weak Password",
        description: "Please choose a stronger password",
        variant: "destructive",
      });
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error, warning, data } = await signUp(
        signUpForm.email,
        signUpForm.password,
        {
          first_name: signUpForm.firstName,
          last_name: signUpForm.lastName,
          company_name: signUpForm.companyName,
        }
      );

      if (error) {
        const errorMessage = getErrorMessage(error);
        if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
        } else if (errorMessage.includes('500') || errorMessage.toLowerCase().includes('email')) {
          toast({
            title: "Account Created (Email Issue)",
            description: "Your account was created, but there was an issue sending the confirmation email. Try signing in - your account may already be active. If not, contact support.",
            variant: "default",
          });
          setSignUpForm({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            companyName: ''
          });
        } else {
          toast({
            title: "Sign Up Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Check Your Email ✉️",
          description: warning || "We've sent a confirmation link to your email. Please click it to activate your account.",
          duration: 10000,
        });
        setSignUpForm({
          email: '',
          password: '',
          confirmPassword: '',
          firstName: '',
          lastName: '',
          companyName: ''
        });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      toast({
        title: "Sign Up Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = "pl-9 h-9 min-h-[36px] bg-slate-50/80 dark:bg-navy-800/30 border-slate-200 dark:border-navy-600/80 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 dark:focus:border-gold-500/60 dark:focus:ring-gold-500/20 rounded-lg text-sm placeholder:text-slate-400 dark:placeholder:text-navy-500 transition-colors";
  const labelClass = "text-xs font-medium text-slate-600 dark:text-slate-400";

  return (
    <AuthLayout
      title={activeTab === 'signin' ? 'Welcome back' : 'Create account'}
      description={activeTab === 'signin' ? 'Sign in to access your account' : 'Join the Frontier Finance platform'}
    >
      <div className="mb-5 rounded-lg border border-slate-200 dark:border-navy-600/60 bg-slate-50/50 dark:bg-navy-800/30 p-3">
        <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Already have a company in the network?
        </p>
        <p className="text-[11px] text-slate-500 dark:text-navy-400 mb-2">
          Search by company name or email to sign in or reset your password — no need to create a new account.
        </p>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Search company or email..."
            value={accountQuery}
            onChange={(e) => setAccountQuery(e.target.value)}
            className="pl-8 h-8 text-sm bg-white dark:bg-navy-800/50 border-slate-200 dark:border-navy-600 rounded-md"
          />
        </div>
        {accountLoading && (
          <p className="text-[11px] text-slate-500 dark:text-navy-400 mt-2">Searching…</p>
        )}
        {!accountLoading && accountQuery.length >= 2 && accountResults.length > 0 && (
          <ul className="mt-2 max-h-40 overflow-y-auto space-y-1 border-t border-slate-200 dark:border-navy-600 pt-2">
            {accountResults.map((r) => (
              <li
                key={`${r.email}-${r.company_name}`}
                className="flex flex-wrap items-center justify-between gap-2 py-1.5 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-navy-700/50 text-xs"
              >
                <span className="text-slate-700 dark:text-slate-300 truncate">
                  <span className="font-medium">{r.company_name}</span>
                  <span className="text-slate-500 dark:text-navy-400 mx-1">·</span>
                  <span className="text-slate-600 dark:text-slate-400">{r.email}</span>
                </span>
                <span className="flex gap-1 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[11px] px-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => {
                      setActiveTab('signin');
                      setSignInForm((prev) => ({ ...prev, email: r.email }));
                      setAccountQuery('');
                      setAccountResults([]);
                    }}
                  >
                    <LogIn className="w-3 h-3 mr-1" />
                    Sign in
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-[11px] px-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    onClick={() => {
                      navigate('/forgot-password', { state: { email: r.email } });
                      setAccountQuery('');
                      setAccountResults([]);
                    }}
                  >
                    <KeyRound className="w-3 h-3 mr-1" />
                    Forgot password
                  </Button>
                </span>
              </li>
            ))}
          </ul>
        )}
        {!accountLoading && accountQuery.length >= 2 && accountResults.length === 0 && (
          <p className="text-[11px] text-slate-500 dark:text-navy-400 mt-2">No account found. You can sign up below.</p>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'signin' | 'signup')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-5 bg-slate-100/80 dark:bg-navy-800/30 p-0.5 rounded-lg min-h-[40px] border border-slate-200/80 dark:border-navy-700/50">
          <TabsTrigger
            value="signin"
            className="rounded-md min-h-[36px] text-xs font-medium text-slate-600 dark:text-navy-400 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-navy-700/50 dark:data-[state=active]:text-white transition-all duration-200 touch-manipulation py-2"
          >
            Sign in
          </TabsTrigger>
          <TabsTrigger
            value="signup"
            className="rounded-md min-h-[36px] text-xs font-medium text-slate-600 dark:text-navy-400 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-navy-700/50 dark:data-[state=active]:text-white transition-all duration-200 touch-manipulation py-2"
          >
            Sign up
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="signin" className="mt-0">
            <motion.form
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSignIn}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="signin-email" className={labelClass}>Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-gold-400 transition-colors w-3.5 h-3.5 pointer-events-none" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@company.com"
                    className={inputBase}
                    value={signInForm.email}
                    onChange={(e) => setSignInForm({ ...signInForm, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="signin-password" className={labelClass}>Password</Label>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-slate-500 hover:text-slate-800 dark:text-gold-400/90 dark:hover:text-gold-400 transition-colors px-1 -mr-1 touch-manipulation"
                    onClick={() => navigate('/forgot-password')}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-gold-400 transition-colors w-3.5 h-3.5 pointer-events-none" />
                  <Input
                    id="signin-password"
                    type={showSignInPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`${inputBase} pr-9`}
                    value={signInForm.password}
                    onChange={(e) => setSignInForm({ ...signInForm, password: e.target.value })}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gold-400/90 p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded touch-manipulation"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    aria-label={showSignInPassword ? 'Hide password' : 'Show password'}
                  >
                    {showSignInPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-9 min-h-[36px] bg-slate-900 hover:bg-slate-800 dark:bg-gold-500 dark:hover:bg-gold-400 text-white font-medium rounded-lg text-sm mt-0.5 shadow-md transition-all touch-manipulation"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in…</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </motion.form>
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <motion.form
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSignUp}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="company-name" className={labelClass}>Company name</Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-gold-400 transition-colors w-3.5 h-3.5 pointer-events-none" />
                  <Input
                    id="company-name"
                    placeholder="Your company or fund"
                    className={inputBase}
                    value={signUpForm.companyName}
                    onChange={(e) => setSignUpForm({ ...signUpForm, companyName: e.target.value })}
                    required
                    autoComplete="organization"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className={labelClass}>Email</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-gold-400 transition-colors w-3.5 h-3.5 pointer-events-none" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@company.com"
                    className={inputBase}
                    value={signUpForm.email}
                    onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className={labelClass}>Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 dark:group-focus-within:text-gold-400 w-3.5 h-3.5 pointer-events-none" />
                    <Input
                      id="signup-password"
                      type={showSignUpPassword ? "text" : "password"}
                      className={`${inputBase} pr-9`}
                      value={signUpForm.password}
                      onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gold-400/90 p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded touch-manipulation"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                    >
                      {showSignUpPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className={labelClass}>Confirm</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      className={`${inputBase} pr-9`}
                      value={signUpForm.confirmPassword}
                      onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-gold-400/90 p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded touch-manipulation"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {signUpForm.password && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="rounded-lg bg-slate-50 dark:bg-navy-800/30 border border-slate-200/80 dark:border-navy-600/50 p-3"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">Strength</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-8 rounded-full transition-colors ${
                            passwordStrength.score >= i
                              ? passwordStrength.score < 3
                                ? 'bg-rose-400'
                                : passwordStrength.score < 4
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-500'
                              : 'bg-slate-200 dark:bg-navy-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {Object.entries(passwordStrength.checks).map(([key, value]) => (
                      <span
                        key={key}
                        className={`text-[11px] flex items-center gap-1 ${value ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-navy-500'}`}
                      >
                        {value ? <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" /> : <span className="w-3 h-3 rounded-full border border-slate-300 dark:border-navy-500 shrink-0" />}
                        {key === 'length' ? '8+ characters' : key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              <Button
                type="submit"
                className="w-full h-9 min-h-[36px] bg-slate-900 hover:bg-slate-800 dark:bg-gold-500 dark:hover:bg-gold-400 text-white font-medium rounded-lg text-sm shadow-md transition-all touch-manipulation disabled:opacity-60"
                disabled={isLoading || passwordStrength.score < 3 || !passwordsMatch}
              >
                {isLoading ? 'Creating account…' : 'Create account'}
              </Button>
            </motion.form>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </AuthLayout>
  );
}
