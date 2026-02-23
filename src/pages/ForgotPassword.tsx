
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import AuthLayout from '@/components/auth/AuthLayout';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { resetPassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        let message = 'Failed to send reset email. Please try again.';
        if (error && typeof error === 'object' && 'message' in error && typeof (error as { message?: unknown }).message === 'string') {
          message = (error as { message: string }).message;
        }
        setError(message);
        toast({
          title: "Reset Failed",
          description: message,
          variant: "destructive"
        });
      } else {
        setEmailSent(true);
        toast({
          title: "Reset Email Sent",
          description: "Please check your email for password reset instructions.",
        });
      }
    } catch (error: unknown) {
      let message = 'Failed to send reset email. Please try again.';
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

  if (emailSent) {
    return (
      <AuthLayout
        title="Email Sent!"
        description={`We've sent password reset instructions to ${email}`}
      >
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="bg-slate-50 dark:bg-navy-800/30 rounded-lg p-3 border border-slate-200 dark:border-navy-600/50">
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed">
              Check your email and click the reset link to create a new password.
              The link will expire in 1 hour.
            </p>
          </div>
          <div className="space-y-2">
            <Button
              onClick={() => navigate('/auth')}
              className="w-full h-9 min-h-[36px] bg-slate-900 hover:bg-slate-800 dark:bg-gold-500 dark:hover:bg-gold-400 text-white rounded-lg text-sm font-medium touch-manipulation"
            >
              Back to Sign In
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setError('');
              }}
              className="w-full h-9 min-h-[36px] border-slate-200 dark:border-navy-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 rounded-lg text-sm touch-manipulation"
            >
              Send Another Email
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg p-2.5 text-xs flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1" />
            <span className="min-w-0">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Email address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5 pointer-events-none" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="pl-9 h-9 min-h-[36px] bg-slate-50/80 dark:bg-navy-800/30 border-slate-200 dark:border-navy-600/80 focus:border-slate-400 focus:ring-2 focus:ring-slate-400/20 rounded-lg text-sm"
                disabled={loading}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-9 min-h-[36px] bg-slate-900 hover:bg-slate-800 dark:bg-gold-500 dark:hover:bg-gold-400 text-white rounded-lg text-sm font-medium touch-manipulation"
            disabled={loading || !email.trim()}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="text-sm">Sending…</span>
              </div>
            ) : (
              'Send reset instructions'
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

export default ForgotPassword;