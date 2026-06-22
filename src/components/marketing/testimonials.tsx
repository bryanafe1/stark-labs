import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

// NOTE: placeholder testimonials — replace with real, attributable quotes
// before relying on them. Fabricated testimonials on a paid product are a
// legal/trust risk.
const QUOTES = [
  {
    quote:
      "I'd been Googling formulas every few minutes. The lessons finally made the concepts stick, and I derived the cantilever deflection in my onsite without blinking.",
    name: "Maya R.",
    role: "Mechanical Engineering new-grad",
  },
  {
    quote:
      "The AI mock interview pushed back on my assumptions exactly like a real panel. I walked into my loop calm for the first time.",
    name: "Devin K.",
    role: "Aerospace interview candidate",
  },
  {
    quote:
      "Auto-graded problems with full worked solutions beat every PDF problem set I bought. Easily worth more than the price.",
    name: "Priya S.",
    role: "ME, class of 2026",
  },
];

export function Testimonials() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Engineers who stopped cramming
          </h2>
          <p className="mt-4 text-muted-foreground">Real prep that holds up under pressure.</p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {QUOTES.map((t) => (
            <Card key={t.name} className="flex flex-col bg-card/50 p-6">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-4">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
