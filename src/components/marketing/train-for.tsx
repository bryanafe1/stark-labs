"use client";

import { useState } from "react";

// "Train for interviews at [companies]" credibility band. Each entry renders a
// real logo from /public/logos/<slug>.svg (grayscale, like a logo wall) and
// gracefully falls back to the styled wordmark if that file isn't there yet —
// so drop the official logos in and they light up automatically.
const COMPANIES: { name: string; slug: string }[] = [
  { name: "SpaceX", slug: "spacex" },
  { name: "Tesla", slug: "tesla" },
  { name: "Blue Origin", slug: "blue-origin" },
  { name: "Anduril", slug: "anduril" },
  { name: "Rivian", slug: "rivian" },
  { name: "Relativity", slug: "relativity" },
  { name: "Firefly", slug: "firefly" },
  { name: "Boeing", slug: "boeing" },
];

function Logo({ name, slug }: { name: string; slug: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-lg font-bold uppercase tracking-wide text-foreground/45 transition-colors hover:text-foreground/80 sm:text-xl">
        {name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/logos/${slug}.svg`}
      alt={name}
      onError={() => setFailed(true)}
      className="h-6 w-auto opacity-50 grayscale transition hover:opacity-90 hover:grayscale-0 sm:h-7"
    />
  );
}

export function TrainFor() {
  return (
    <section className="border-b border-border/60">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Train for interviews at
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {COMPANIES.map((c) => (
            <Logo key={c.slug} name={c.name} slug={c.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
