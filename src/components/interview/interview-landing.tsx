"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Mic, ArrowRight, ArrowLeft, Lock, Keyboard } from "lucide-react";
import { InterviewChat } from "./interview-chat";

/**
 * Interview hub. Typed and Voice are co-equal choices — Voice is the premium
 * differentiator and must NOT read as a secondary add-on to the typed flow.
 * Picking Typed reveals the existing setup; Voice routes to the real-time sim.
 */
export function InterviewLanding({
  freeTrial,
  typedExhausted,
}: {
  freeTrial: boolean;
  typedExhausted: boolean;
}) {
  const [picked, setPicked] = useState(false);

  if (picked) {
    return (
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => setPicked(false)}
          className="mb-4 inline-flex items-center gap-1.5 rounded-lg px-1 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="size-4" /> Interview options
        </button>
        <InterviewChat freeTrial={freeTrial} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-2 flex items-center gap-2">
        <MessageSquare className="size-5 text-terminal" />
        <h1 className="text-2xl font-bold tracking-tight">Mock Interview</h1>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Sit a realistic technical screen with an AI interviewer — one question at a time, real
        follow-ups, and a structured readiness debrief. Choose how you want to answer.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* ---- Typed ---- */}
        {typedExhausted ? (
          <Link
            href="/pricing"
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          >
            <ModeHead icon={Keyboard} title="Typed" tag="Upgrade" tagMuted />
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Type your answers at your own pace — great for nailing the fundamentals and your
              reasoning. You&apos;ve used your free typed interview.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Lock className="size-3.5" /> Unlock unlimited
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setPicked(true)}
            className="group flex flex-col rounded-2xl border border-border bg-card p-6 text-left outline-none transition-colors hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
          >
            <ModeHead icon={Keyboard} title="Typed" tag={freeTrial ? "Free to try" : "Included"} />
            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              Type your answers at your own pace. Best for nailing the fundamentals and structuring
              your reasoning — anywhere, no mic needed.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
              Start typed
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        )}

        {/* ---- Voice (the premium differentiator) ---- */}
        <Link
          href="/simulation"
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-primary/50 bg-primary/[0.06] p-6 outline-none transition-colors hover:border-primary hover:bg-primary/10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/20 blur-2xl" />
          <ModeHead icon={Mic} title="Voice" tag="Pro" tagPrimary />
          <p className="mt-2 flex-1 text-sm text-muted-foreground">
            Speak your answers in a real-time spoken interview — the closest thing to the real room.
            Trains what breaks most candidates: thinking out loud under pressure.
          </p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            Start voice interview
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

function ModeHead({
  icon: Icon,
  title,
  tag,
  tagPrimary,
  tagMuted,
}: {
  icon: typeof Mic;
  title: string;
  tag: string;
  tagPrimary?: boolean;
  tagMuted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-2.5">
        <span
          className={
            tagPrimary
              ? "flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary"
              : "flex size-10 items-center justify-center rounded-xl bg-secondary text-foreground"
          }
        >
          <Icon className="size-5" />
        </span>
        <span className="text-lg font-semibold">{title}</span>
      </span>
      <span
        className={
          "rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide " +
          (tagPrimary
            ? "bg-primary/15 text-primary"
            : tagMuted
              ? "bg-muted text-muted-foreground"
              : "bg-secondary text-muted-foreground")
        }
      >
        {tag}
      </span>
    </div>
  );
}
