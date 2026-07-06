"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageSquare, ClipboardCheck, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SEEN_KEY = "oc.onboarded.v1";

/**
 * First-run activation. Brand-new users (no activity) were landing on a passive
 * dashboard and bouncing. This drops them straight into the one action most
 * likely to show value in 30 seconds: their free AI mock interview. Full-screen
 * and unmissable, but dismissible (shown once).
 */
export function Onboarding({ show, name }: { show: boolean; name: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (show && typeof window !== "undefined" && !localStorage.getItem(SEEN_KEY)) {
      setOpen(true);
    }
  }, [show]);

  const dismiss = () => {
    if (typeof window !== "undefined") localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-sm" onClick={dismiss} />
      <div className="glass relative w-full max-w-lg overflow-hidden rounded-xl border p-5 text-center sm:p-7">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-lg p-1 text-muted-foreground outline-none transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        >
          <X className="size-4" />
        </button>

        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <MessageSquare className="size-6" />
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Welcome, {name} 👋</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          The fastest way to see where you stand: run your <span className="text-foreground">free</span> AI
          mock interview. It talks through problems with you, probes your reasoning, and scores you like a
          hiring manager — in about 5 minutes.
        </p>

        <Button asChild size="lg" className="mt-6 w-full" onClick={dismiss}>
          <Link href="/interview">
            Start my free mock interview
            <ArrowRight className="size-4" />
          </Link>
        </Button>

        <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/practice" onClick={dismiss} className="inline-flex items-center gap-1 hover:text-foreground">
            <ClipboardCheck className="size-3.5" /> Try a practice question
          </Link>
          <span className="text-border">·</span>
          <button type="button" onClick={dismiss} className="hover:text-foreground">
            I&apos;ll explore first
          </button>
        </div>
      </div>
    </div>
  );
}
