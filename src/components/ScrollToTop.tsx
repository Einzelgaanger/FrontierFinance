import { useLayoutEffect, useEffect } from "react";
import { useLocation } from "react-router-dom";

function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  document.documentElement.scrollTop = 0;
  document.documentElement.scrollLeft = 0;
  document.body.scrollTop = 0;
  document.body.scrollLeft = 0;
}

// Prevent browser from restoring scroll on navigation (e.g. when returning to privacy/terms)
if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

/**
 * Scrolls to the top whenever the route (pathname) changes.
 * useLayoutEffect runs before paint so the user never sees a mid-page scroll position.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    scrollToTop();
  }, [pathname]);

  // Delayed scroll for long pages (e.g. privacy, terms) in case content/layout finishes after paint
  useEffect(() => {
    const t1 = window.setTimeout(scrollToTop, 100);
    const t2 = window.setTimeout(scrollToTop, 400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [pathname]);

  return null;
}
