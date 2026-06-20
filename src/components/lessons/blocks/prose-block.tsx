import { Markdown } from "@/components/markdown";
import type { ProseBlock as ProseBlockData } from "@/types/lessons";

export function ProseBlock({ block }: { block: ProseBlockData }) {
  return (
    <section className="space-y-3">
      {block.title && (
        <h2 className="text-lg font-semibold tracking-tight">{block.title}</h2>
      )}
      <Markdown content={block.markdown} />
    </section>
  );
}
