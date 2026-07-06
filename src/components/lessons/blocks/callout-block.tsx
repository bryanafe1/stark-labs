import { Lightbulb, AlertTriangle, Sparkles, Target, type LucideIcon } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { cn } from "@/lib/utils";
import type { CalloutBlock as CalloutBlockData, CalloutVariant } from "@/types/lessons";

const VARIANT: Record<
  CalloutVariant,
  { icon: LucideIcon; label: string; border: string; bg: string; text: string }
> = {
  tip: {
    icon: Lightbulb,
    label: "Tip",
    border: "border-success/40",
    bg: "bg-success/10",
    text: "text-success",
  },
  warning: {
    icon: AlertTriangle,
    label: "Common pitfall",
    border: "border-border",
    bg: "bg-muted",
    text: "text-muted-foreground",
  },
  insight: {
    icon: Sparkles,
    label: "Key insight",
    border: "border-sky-500/30",
    bg: "bg-sky-500/[0.06]",
    text: "text-sky-400",
  },
  interview: {
    icon: Target,
    label: "In the interview",
    border: "border-primary/40",
    bg: "bg-primary/[0.06]",
    text: "text-primary",
  },
};

export function CalloutBlock({ block }: { block: CalloutBlockData }) {
  const v = VARIANT[block.variant];
  const Icon = v.icon;
  return (
    <div
      role="note"
      aria-label={block.title ?? v.label}
      className={cn("rounded-xl border p-4", v.border, v.bg)}
    >
      <div className={cn("mb-2 flex items-center gap-2 text-sm font-semibold", v.text)}>
        <Icon className="size-4" aria-hidden="true" />
        {block.title ?? v.label}
      </div>
      <Markdown content={block.markdown} className="text-sm" />
    </div>
  );
}
