import Link from "next/link";
import { Lock, Check, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PRO_PERKS = [
  "All 162 interview-grade problems",
  "Every lesson across all 10 disciplines",
  "Unlimited AI mock interviews",
  "Hints, full worked solutions & progress tracking",
];

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
          <h1 className="mt-4 text-xl font-bold tracking-tight">Unlock {feature} with Pro</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Go all-in on your interview prep. Plans start at $15.83/month.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <ul className="space-y-2">
            {PRO_PERKS.map((p) => (
              <li key={p} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                {p}
              </li>
            ))}
          </ul>
          <Button asChild size="lg" className="w-full">
            <Link href="/pricing">See plans &amp; upgrade</Link>
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Cancel anytime · Secure checkout by Stripe
          </p>
        </div>
      </Card>
    </div>
  );
}
