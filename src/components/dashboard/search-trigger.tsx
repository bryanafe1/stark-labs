"use client";

import { Search } from "lucide-react";

/** Opens the global command palette (mounted in the dashboard layout). */
function openSearch() {
  window.dispatchEvent(new Event("stark:open-search"));
}

export function SearchTrigger() {
  return (
    <button
      type="button"
      onClick={openSearch}
      className="relative hidden h-10 max-w-md flex-1 items-center gap-2 rounded-lg border border-input bg-card/60 px-3 text-left text-sm text-muted-foreground outline-none ring-ring transition hover:border-foreground/30 focus-visible:ring-2 md:flex"
    >
      <Search className="size-4 shrink-0" />
      <span className="flex-1 truncate">Search problems, lessons, engineers…</span>
      <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
        ⌘K
      </kbd>
    </button>
  );
}
