import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Consistent, friendly empty state: icon + message + optional action. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/40 px-6 py-14 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="mb-3 flex size-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
          <Icon className="size-5" />
        </span>
      )}
      <p className="text-sm font-semibold">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
