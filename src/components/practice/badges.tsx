import type { Difficulty, Discipline } from "@prisma/client";
import { DIFFICULTIES, DISCIPLINES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function DisciplinePill({
  discipline,
  className,
}: {
  discipline: Discipline;
  className?: string;
}) {
  const meta = DISCIPLINES[discipline];
  const Icon = meta.icon;
  const token = `--d-${meta.key.toLowerCase()}`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        className,
      )}
      style={{
        backgroundColor: `hsl(var(${token}) / 0.12)`,
        color: `hsl(var(${token}))`,
      }}
    >
      <Icon className="size-3.5" />
      {meta.label}
    </span>
  );
}

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  const meta = DIFFICULTIES[difficulty];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        meta.badgeClass,
        className,
      )}
    >
      {meta.label}
    </span>
  );
}
