
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AuthLayout from '@/components/auth/AuthLayout';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Supabase puts tokens in the URL hash (#access_token=...); fall back to query (?access_token=...)
  const hashParams = new URLSearchParams(location.hash?.startsWith('#') ? location.hash.slice(1) : '');
  const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
  const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
  const type = hashParams.get('type') || searchParams.get('type');

  useEffect(() => {
    const handlePasswordReset = async () => {
      if (accessToken && refreshToken && type === 'recovery') {
        try {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            setError('Invalid or expired reset link. Please request a new password reset.');
          }
        } catch (error) {
          setError('Invalid or expired reset link. Please request a new password reset.');
        }
      } else if (!accessToken || !refreshToken || type !== 'recovery') {
        setError('Invalid or missing reset token. Please request a new password reset.');
      }
    };

    handlePasswordReset();
  }, [accessToken, refreshToken, type]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) errors.push(`At least ${minLength} characters`);
    if (!hasUpperCase) errors.push('One uppercase letter');
    if (!hasLowerCase) errors.push('One lowercase letter');
    if (!hasNumbers) errors.push('One number');
    if (!hasSpecialChar) errors.push('One special character');

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      setError(`Password must contain: ${passwordErrors.join(', ')}`);
      return;
    }

    if (!accessToken || type !== 'recovery') {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      setSuccess(true);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated.",
      });

      setTimeout(() => {
        navigate('/auth');
      }, 3000);

    } catch (error: unknown) {
      let message = 'Failed to update password. Please try again.';
      if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
        message = (error as { message?: string }).message!;
      }
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthLayout
        title="Password Updated!"
        description="Your password has been successfully updated. Redirecting you to sign in..."
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="space-y-3">
          <Button
            onClick={() => navigate('/auth')}
            className="w-full h-9 min-h-[36px] bg-slate-900 hover:bg-slate-800 dark:bg-gold-500 dark:hover:bg-gold-400 text-white rounded-lg text-sm font-medium touch-manipulation"
          >
            Go to Sign In
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your new password below"
    >
      <div className="space-y-4">
        {error && (
          <Alert variant="destructive" className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg text-xs py-2.5">
            <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />
            <AlertDescription className="min-w-0">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              New password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="pl-9 pr-9 h-9 min-h-[36px] bg-slate-50/80 dark:bg-navy-800/30 border-slate-200 dark:border-navy-600/80 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 rounded-lg text-sm"
                disabled={loading || !accessToken || type !== 'recovery'}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded touch-manipulation"
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-navy-400 mt-0.5">
              At least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Confirm new password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="pl-9 pr-9 h-9 min-h-[36px] bg-slate-50/80 dark:bg-navy-800/30 border-slate-200 dark:border-navy-600/80 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 rounded-lg text-sm"
                disabled={loading || !accessToken || type !== 'recovery'}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded touch-manipulation"
                disabled={loading}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-9 min-h-[36px] bg-slate-900 hover:bg-slate-800 dark:bg-gold-500 dark:hover:bg-gold-400 text-white rounded-lg text-sm font-medium touch-manipulation"
            disabled={loading || !accessToken || type !== 'recovery' || !password || !confirmPassword}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm">Updating…</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Update password</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </Button>
        </form>

        <div className="pt-3 border-t border-slate-200 dark:border-navy-700">
          <Button
            variant="ghost"
            onClick={() => navigate('/auth')}
            className="w-full h-9 min-h-[36px] text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-navy-800 rounded-lg text-sm touch-manipulation"
            disabled={loading}
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2 shrink-0" />
            Back to Sign In
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
