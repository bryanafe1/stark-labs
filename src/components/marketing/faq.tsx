import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "What's included in the free plan?",
    a: "The easy Mechanical fundamentals (lessons plus a set of sample problems) and progress tracking. No credit card required, and it never expires.",
  },
  {
    q: "What do I get with Pro?",
    a: "Every lesson and all 162 interview-grade problems with full worked solutions, unlimited AI mock interviews, and the ranked Arena. $20/month, or $190/year (about $15.83/month).",
  },
  {
    q: "Which disciplines are covered?",
    a: "We're launching deep on Mechanical Engineering. The other nine disciplines are rolling out with the same lessons, instant grading, and mock interviews.",
  },
  {
    q: "How do the AI mock interviews work?",
    a: "A realistic interviewer questions you on your chosen discipline, adapts to your answers, and gives feedback at the end. It's a Pro feature.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. One click in Settings, and you keep access through the end of your billing period.",
  },
  {
    q: "Who is Overclocker for?",
    a: "Students prepping for internships and new-grad roles, and working engineers brushing up before interviews.",
  },
  {
    q: "How do I get help?",
    a: "Email support@overclocker.dev and we'll get back to you.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-b border-border/60">
      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered</h2>
        </div>

        <div className="mt-10 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-xl border border-border bg-card/50 px-5 py-4 transition-colors hover:bg-card"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
