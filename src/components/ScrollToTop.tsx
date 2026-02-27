import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToTop() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
}

/**
 * Scrolls to the top whenever the route (pathname) changes.
 * Ensures users always land at the top when navigating via header or hamburger.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Disable browser scroll restoration so we control scroll on navigation
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    scrollToTop();

    // Run again after React has committed the new route and browser has painted
    const rafId = requestAnimationFrame(() => {
      scrollToTop();
      requestAnimationFrame(scrollToTop);
    });

    const t1 = window.setTimeout(scrollToTop, 50);
    const t2 = window.setTimeout(scrollToTop, 150);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
