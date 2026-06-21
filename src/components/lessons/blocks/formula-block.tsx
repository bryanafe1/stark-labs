import { Sigma } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Markdown } from "@/components/markdown";
import type { FormulaBlock as FormulaBlockData } from "@/types/lessons";

export function FormulaBlock({ block }: { block: FormulaBlockData }) {
  return (
    <Card className="overflow-hidden border-primary/20">
      <div className="flex items-center gap-2 border-b border-border bg-primary/[0.04] px-5 py-2.5">
        <Sigma className="size-4 text-primary" />
        <span className="text-sm font-semibold">{block.title ?? "Formula"}</span>
      </div>
      <div className="p-5">
        {/* Production: render `display` with KaTeX. For now, a clean mono line. */}
        <div className="overflow-x-auto rounded-md border border-border bg-background">
          <p className="whitespace-nowrap px-4 py-3 text-center font-mono text-lg tracking-tight text-foreground">
            {block.display}
          </p>
        </div>

        <dl className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
          {block.variables.map((v) => (
            <div key={v.symbol} className="flex items-baseline gap-2 text-sm">
              <dt className="min-w-8 font-mono text-base font-medium text-foreground">
                {v.symbol}
              </dt>
              <dd className="text-muted-foreground">
                {v.name}
                {v.unit && (
                  <span className="ml-1 text-xs opacity-70">[{v.unit}]</span>
                )}
              </dd>
            </div>
          ))}
        </dl>

        {block.note && (
          <div className="mt-4 rounded-lg border border-border bg-card/40 p-3">
            <Markdown content={block.note} className="text-sm" />
          </div>
        )}
      </div>
    </Card>
  );
}
