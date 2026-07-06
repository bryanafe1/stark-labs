import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Latex } from "@/components/latex";

// A real excerpt from a lesson, with properly typeset math, so visitors can see
// the depth before signing up.
export function SampleLesson() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1 font-mono text-xs text-muted-foreground">
            <BookOpen className="size-3.5" /> inside a lesson
          </span>
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            See the depth before you pay
          </h2>
          <p className="mt-4 text-muted-foreground">
            Not flashcards. Real derivations, taught the way an interviewer expects you to reason.
          </p>
        </div>

        <Card className="elevated mx-auto mt-10 max-w-3xl space-y-5 border-border bg-background p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-wide text-primary">
            Beam Bending &amp; Deflection
          </p>
          <h3 className="text-xl font-bold tracking-tight">
            Why a beam can be perfectly safe and still feel like a trampoline
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90">
            Two beams can be equally far from breaking, yet one barely moves while the other bounces
            like a diving board. Strength and stiffness are different questions, and that gap is
            where engineering interviews are won.
          </p>
          <div className="rounded-md border border-border bg-card/40 px-4 py-4 text-center">
            <Latex display tex={"EI\\,\\dfrac{d^{2}y}{dx^{2}} = M(x)"} className="my-0 text-lg" />
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">
            Integrate the elastic-curve equation twice, apply the boundary conditions, and you have
            derived the cantilever tip deflection every interviewer asks for:
          </p>
          <div className="rounded-md border border-primary/20 bg-primary/[0.04] px-4 py-4 text-center">
            <Latex display tex={"\\delta = \\dfrac{P L^{3}}{3 E I}"} className="my-0 text-lg" />
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            You will not memorize that formula. You will derive it, then prove it in the live
            sandbox and a graded problem.
          </p>
          <div className="pt-1">
            <Button asChild variant="secondary">
              <Link href="/sign-up">
                Start with the free lessons <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
}
