"use client";

import { useEffect, useRef } from "react";
import { markSignupTracked } from "@/server/actions/tracking";

// Google Ads account tag (matches src/app/layout.tsx).
const GADS_ID = "AW-18285186111";

declare global {
  interface Window {
    // gtag is defined by the Google tag loaded in the root layout.
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Fires the signup conversion to Google Ads exactly once, on the user's first
 * authenticated page load. `fire` = the user hasn't been tracked yet. Renders
 * nothing. To count as a *conversion* (not just an audience event), create a
 * "Sign up" conversion action in Google Ads and set its label as
 * NEXT_PUBLIC_GADS_SIGNUP_LABEL — otherwise only the sign_up event fires.
 */
export function SignupConversion({ fire }: { fire: boolean }) {
  const done = useRef(false);

  useEffect(() => {
    if (!fire || done.current) return;
    done.current = true;

    const label = process.env.NEXT_PUBLIC_GADS_SIGNUP_LABEL;
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "sign_up"); // audience + GA-style signal
      if (label) {
        window.gtag("event", "conversion", { send_to: `${GADS_ID}/${label}` });
      }
    }
    void markSignupTracked();
  }, [fire]);

  return null;
}
