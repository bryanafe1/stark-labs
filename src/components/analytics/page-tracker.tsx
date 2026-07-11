"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * First-party pageview beacon. Posts the current path + referrer + query to
 * /api/track on every route change. `keepalive` lets the beacon survive an
 * instant bounce (tab close). Admin pages are not tracked.
 */
export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;
    try {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          referrer: document.referrer || "",
          query: window.location.search || "",
        }),
        keepalive: true,
      }).catch(() => {});
    } catch {
      /* never break navigation */
    }
  }, [pathname]);

  return null;
}
