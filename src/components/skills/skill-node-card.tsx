"use client";

import Link from "next/link";
import { Check, Circle, Lock, Wrench, BookOpen, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { SkillNode, SkillStatus } from "@/features/skills/get-skill-tree";

const STATUS_META: Record<
  SkillStatus,
  { label: string; cardClass: string; icon: typeof Check; iconClass: string }
> = {
  MASTERED: {
    label: "Mastered",
    cardClass: "border-terminal/40 text-terminal",
    icon: Check,
    iconClass: "text-terminal",
  },
  IN_PROGRESS: {
    label: "In Progress",
    cardClass: "border-foreground/30 text-foreground",
    icon: Circle,
    iconClass: "text-foreground",
  },
  AVAILABLE: {
    label: "Available",
    cardClass: "border-border text-muted-foreground",
    icon: Circle,
    iconClass: "text-muted-foreground",
  },
  LOCKED: {
    label: "Locked",
    cardClass: "border-border opacity-50",
    icon: Lock,
    iconClass: "text-muted-foreground",
  },
};

export function SkillNodeCard({ node }: { node: SkillNode }) {
  const meta = STATUS_META[node.status];
  const StatusIcon = meta.icon;
  const KindIcon = node.kind === "TECHNICAL" ? Wrench : BookOpen;

  // Every node launches into Practice pre-filtered to this discipline + skill.
  const href = `/practice?discipline=${node.discipline}&skill=${node.slug}`;

  return (
    <Link
      href={href}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`Practice ${node.title}`}
    >
      <Card
        className={cn(
          "relative p-3 transition-colors hover:border-primary/50 hover:bg-accent/30",
          meta.cardClass,
        )}
      >
        <div className="flex items-start gap-2">
          <StatusIcon className={cn("mt-0.5 size-4 shrink-0", meta.iconClass)} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-sm font-medium leading-tight text-foreground">
              {node.title}
            </p>
            <p className="mt-0.5 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
              <KindIcon className="size-3 shrink-0 text-muted-foreground" />
              {meta.label}
            </p>
          </div>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {node.masteryPct}%
          </span>
        </div>

        {node.status === "IN_PROGRESS" && (
          <Progress value={node.masteryPct} className="mt-2.5 h-1" />
        )}

        <div className="mt-2 flex items-center justify-between font-mono text-[10px] tabular-nums text-muted-foreground">
          <span className="flex items-center gap-1 font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
            Practice <ArrowRight className="size-3" />
          </span>
          <span>{node.xp} XP</span>
        </div>
      </Card>
    </Link>
  );
}
