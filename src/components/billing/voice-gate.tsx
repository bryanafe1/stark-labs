import Link from "next/link";
import { Mic, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buyVoiceSession, startSubscription } from "@/server/actions/payments";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Mic className="size-5 text-terminal" />
        <h1 className="text-2xl font-bold tracking-tight">Voice Simulation</h1>
      </div>
      {children}
    </div>
  );
}

// Scenarios 2 (Standard, no credits) and 3 (Pro, monthly limit reached).
export function VoiceGate({
  reason,
  resetAt,
}: {
  reason: "need_credits" | "pro_exhausted";
  resetAt?: Date;
}) {
  if (reason === "pro_exhausted") {
    const date = resetAt
      ? new Date(resetAt).toLocaleDateString(undefined, { month: "long", day: "numeric" })
      : "the 1st";
    return (
      <Shell>
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold tracking-tight">You&apos;ve used all 5 sessions this month</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            They reset on <span className="text-foreground">{date}</span>. Need another now? Grab a single
            session for $12 — it works the moment you buy it.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <form action={buyVoiceSession}>
              <Button type="submit">Buy a session — $12</Button>
            </form>
            <Button asChild variant="secondary">
              <Link href="/interview">Back to interviews</Link>
            </Button>
          </div>
        </Card>
      </Shell>
    );
  }

  // need_credits — Standard user with no available session.
  return (
    <Shell>
      <Card className="p-6">
        <h2 className="text-xl font-bold tracking-tight">Run a full voice interview</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Talk to a senior engineer in real time. Afterward you get a debrief covering your technical
          accuracy, reasoning quality, and how you communicated.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Card className="flex flex-col p-4">
            <p className="text-sm font-semibold">Single session</p>
            <p className="mt-1 text-2xl font-bold">$12</p>
            <p className="mt-1 flex-1 text-xs text-muted-foreground">One session. Expires in 90 days.</p>
            <form action={buyVoiceSession} className="mt-3">
              <Button type="submit" variant="secondary" className="w-full">
                Buy a session
              </Button>
            </form>
          </Card>
          <Card className="flex flex-col border-primary/40 bg-primary/5 p-4">
            <p className="flex items-center gap-1 text-sm font-semibold text-primary">
              <Sparkles className="size-4" /> Upgrade to Pro
            </p>
            <p className="mt-1 text-2xl font-bold">
              $40<span className="text-sm font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-1 flex-1 text-xs text-muted-foreground">5 sessions every month. Resets monthly.</p>
            <form action={startSubscription} className="mt-3">
              <input type="hidden" name="tier" value="pro" />
              <input type="hidden" name="interval" value="monthly" />
              <Button type="submit" className="w-full">
                Go Pro
              </Button>
            </form>
          </Card>
        </div>
      </Card>
    </Shell>
  );
}
