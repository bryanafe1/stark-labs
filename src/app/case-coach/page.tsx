import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Briefcase, Target, Calculator, LineChart, MessagesSquare } from "lucide-react";
import { auth } from "@/auth";
import { CaseChat } from "@/components/case/case-chat";
import { CaseGate } from "@/components/case/case-gate";

// Hidden, unlisted offering — not linked in nav, not indexed. Shared by URL.
export const metadata: Metadata = {
  title: "Case Coach — Consulting Interview Prep",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function CaseCoachPage({
  searchParams,
}: {
  searchParams: { k?: string };
}) {
  const session = await auth();
  const signedIn = !!session?.user;
  const secret = process.env.CASE_COACH_KEY;
  // Access with no account: the password cookie, or ?k=<password> in the URL.
  const key = typeof searchParams.k === "string" ? searchParams.k : undefined;
  const hasKey = !!secret && key === secret;
  const cookieOk = !!secret && cookies().get("case_coach")?.value === secret;
  const canUse = signedIn || hasKey || cookieOk;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="font-mono text-sm font-bold tracking-wide text-primary">OVERCLOCKER</span>
          <span className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            Case Coach · private preview
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Pitch */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Briefcase className="size-3.5" /> Consulting interview prep
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Crack the McKinsey, BCG &amp; Bain case.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Live AI case interviews that run like the real thing — you structure the problem, ask for data,
            do the math, and give a recommendation. Scored on the four dimensions interviewers actually grade.
            Unlimited reps, any time.
          </p>
        </div>

        <div className="mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          <Feature icon={Target} label="Structure & framework" />
          <Feature icon={Calculator} label="Quant & market sizing" />
          <Feature icon={LineChart} label="Business insight" />
          <Feature icon={MessagesSquare} label="Communication" />
        </div>

        {/* Tool or sign-in */}
        <div className="mt-10">
          {canUse ? <CaseChat accessKey={hasKey ? key : undefined} /> : <CaseGate />}
        </div>
      </main>
    </div>
  );
}

function Feature({ icon: Icon, label }: { icon: typeof Target; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/50 px-3 py-4 text-center">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </div>
  );
}
