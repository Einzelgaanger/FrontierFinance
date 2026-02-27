import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
}

/**
 * Scrolls to the top whenever the route (pathname) changes.
 * Ensures users always land at the top when navigating via header or hamburger.
 * Runs immediately and after paint so the new page is shown from the top.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop();
    const id = requestAnimationFrame(() => {
      scrollToTop();
    });
    const t = window.setTimeout(scrollToTop, 0);
    return () => {
      cancelAnimationFrame(id);
      window.clearTimeout(t);
    };
  }, [pathname]);

  return null;
}
