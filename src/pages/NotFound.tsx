import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 safe-area-top">
      <div className="text-center max-w-md w-full min-w-0">
        <h1 className="text-4xl sm:text-5xl font-display font-normal text-navy-900 mb-3">404</h1>
        <p className="text-lg sm:text-xl text-slate-600 mb-6">Oops! Page not found</p>
        <a
          href="/"
          className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold transition-colors touch-manipulation"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
