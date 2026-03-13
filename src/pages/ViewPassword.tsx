import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Eye, EyeOff, Copy, CheckCircle, AlertTriangle, Clock, Lock } from 'lucide-react';

export default function ViewPassword() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (token) {
      revealPassword();
    }
  }, [token]);

  const revealPassword = async () => {
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('view-password', {
        body: { token },
      });

      if (fnError) {
        setError(fnError.message || 'Failed to retrieve password');
      } else if (data?.error) {
        setError(data.error);
      } else if (data?.success) {
        setPassword(data.password);
        setEmail(data.email);
      }
    } catch (e) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0f1d2e] text-[#c49a2b] flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#0f1d2e]">Secure Password</h1>
          <p className="text-slate-500 text-sm mt-1">Collaborative For Frontier Finance</p>
        </div>

        <div className="bg-white rounded-2xl border-2 border-slate-200 shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-2 border-[#c49a2b] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Retrieving your password...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                {error.includes('already been used') ? (
                  <Clock className="w-6 h-6 text-red-500" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                {error.includes('already been used') ? 'Link Already Used' : 'Link Unavailable'}
              </h2>
              <p className="text-sm text-red-600">{error}</p>
              <p className="text-xs text-slate-500 mt-4">
                Contact your administrator if you need a new password link.
              </p>
            </div>
          ) : password ? (
            <div className="p-6 space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                <p className="text-xs font-semibold text-amber-800 flex items-center justify-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  This password is shown only once. Save it now.
                </p>
              </div>

              {email && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</label>
                  <p className="text-sm font-medium text-[#0f1d2e] mt-1">{email}</p>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Password</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-lg px-4 py-3 font-mono text-sm text-[#0f1d2e] select-all break-all">
                    {showPassword ? password : '•'.repeat(password.length)}
                  </div>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2.5 rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-colors"
                    title={showPassword ? 'Hide' : 'Show'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-slate-600" /> : <Eye className="w-4 h-4 text-slate-600" />}
                  </button>
                  <button
                    onClick={copyPassword}
                    className="p-2.5 rounded-lg border-2 border-slate-200 hover:bg-slate-50 transition-colors"
                    title="Copy"
                  >
                    {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-600" />}
                  </button>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                <p>• Use this password to log in at <strong>frontierfinance.org</strong></p>
                <p>• You can change it after logging in via your profile settings</p>
                <p>• This link is now expired and cannot be reused</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
