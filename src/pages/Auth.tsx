import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expiredLinkError, setExpiredLinkError] = useState(false);

  useEffect(() => {
    // Handle Supabase recovery tokens from URL hash first (e.g. #access_token=...)
    const rawHash = location.hash?.startsWith('#') ? location.hash.slice(1) : '';
    const hashParams = new URLSearchParams(rawHash);
    const hashAccessToken = hashParams.get('access_token');
    const hashRefreshToken = hashParams.get('refresh_token');
    const hashType = hashParams.get('type');
    const hashError = hashParams.get('error');
    const hashErrorCode = hashParams.get('error_code');
    const hashErrorDesc = hashParams.get('error_description') ?? '';

    if (hashError === 'access_denied' && (hashErrorCode === 'otp_expired' || hashErrorDesc.toLowerCase().includes('expired') || hashErrorDesc.toLowerCase().includes('invalid'))) {
      setExpiredLinkError(true);
      window.history.replaceState(null, '', location.pathname + location.search);
      return;
    }

    if (hashAccessToken && hashRefreshToken && hashType === 'recovery') {
      // Redirect to reset-password with tokens as query params
      const qs = `?access_token=${encodeURIComponent(hashAccessToken)}&refresh_token=${encodeURIComponent(hashRefreshToken)}&type=recovery`;
      navigate(`/reset-password${qs}`, { replace: true });
      return; // Prevent rendering AuthForm while redirecting
    }

    // Fallback: Clean up the URL by removing any remaining hash fragments
    if (location.hash) {
      const cleanUrl = location.pathname + location.search;
      window.history.replaceState(null, '', cleanUrl);
    }

    // Also support tokens already in search (edge case)
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const type = params.get('type');

    if (accessToken && refreshToken && type === 'recovery') {
      navigate(`/reset-password${location.search}`, { replace: true });
      return;
    }
  }, [location, navigate]);

  // Check if we have recovery tokens in the URL
  const params = new URLSearchParams(location.search);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const type = params.get('type');
  
  // If we have recovery tokens, don't render the auth form
  if (accessToken && refreshToken && type === 'recovery') {
    return null; // This will prevent the auth form from showing while redirecting
  }

  return (
    <>
      {expiredLinkError && (
        <Alert variant="destructive" className="mb-4 border-amber-200 bg-amber-50 text-amber-900 [&>svg]:text-amber-600">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Link expired or invalid</AlertTitle>
          <AlertDescription>
            This sign-in or password reset link has expired. Request a new link: go to{" "}
            <Link to="/forgot-password" className="font-medium underline">Forgot password</Link> and enter your email, or ask your company admin to send you a new link from <strong>My Profile → Company Team Members</strong> (key icon next to your name).
          </AlertDescription>
        </Alert>
      )}
      <AuthForm />
    </>
  );
};

export default Auth;
