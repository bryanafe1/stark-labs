import Link from "next/link";
import { Lock, Check, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startSubscription } from "@/server/actions/payments";

const PERKS = [
  "Every lesson, problem & worked solution across all disciplines",
  "Spaced repetition + readiness scores",
  "The AI tutor and the full Arena",
  "Conceptual, interview-style questions with AI feedback",
];

// Scenario 1 — a Free user hits any paid feature. Inline, no pressure.
export function Paywall({
  feature = "this content",
  backHref = "/dashboard",
  backLabel = "Go back",
}: {
  feature?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="mx-auto max-w-lg py-4">
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {backLabel}
      </Link>

      <Card className="overflow-hidden border-primary/30">
        <div className="bg-gradient-to-br from-primary/10 to-transparent p-6 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Lock className="size-6" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight">Unlock {feature}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A paid plan opens the full platform. Cancel anytime.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <ul className="space-y-2">
            {PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                {p}
              </li>
            ))}
          </ul>
          <div className="grid gap-2 sm:grid-cols-2">
            <form action={startSubscription}>
              <input type="hidden" name="tier" value="standard" />
              <input type="hidden" name="interval" value="monthly" />
              <Button type="submit" variant="secondary" className="w-full">
                Start Standard · $20/mo
              </Button>
            </form>
            <form action={startSubscription}>
              <input type="hidden" name="tier" value="pro" />
              <input type="hidden" name="interval" value="monthly" />
              <Button type="submit" className="w-full">
                Start Pro · $40/mo
              </Button>
            </form>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            <Link href="/pricing" className="underline-offset-2 hover:underline">
              Compare all plans
            </Link>{" "}
            · Secure checkout by Stripe
          </p>
        </div>
      </Card>
    </div>
  );
}
