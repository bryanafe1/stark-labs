// "Train for interviews at [companies]" — an honest credibility band: it states
// who we help you prepare for (true), not who our users got hired at (would be
// false). Text-based logo wall; no trademarked assets, plus a disclaimer.

const COMPANIES = [
  "SpaceX",
  "Tesla",
  "Blue Origin",
  "Anduril",
  "Rivian",
  "Relativity",
  "Firefly",
  "Boeing",
];

export function TrainFor() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Train for interviews at
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12">
          {COMPANIES.map((c) => (
            <span
              key={c}
              className="text-lg font-bold uppercase tracking-wide text-foreground/45 transition-colors hover:text-foreground/80 sm:text-xl"
            >
              {c}
            </span>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-xl text-center text-[11px] leading-relaxed text-muted-foreground/60">
          Overclocker is independent and not affiliated with or endorsed by these companies. Names are
          shown to describe the kinds of interviews we help you prepare for.
        </p>
      </div>
    </section>
  );
}
