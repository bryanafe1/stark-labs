"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Swords,
  GraduationCap,
  ClipboardCheck,
  Trophy,
  Users,
  Network,
  ListChecks,
  User,
  Settings,
  FlaskConical,
  BookOpen,
  MessagesSquare,
  CornerDownLeft,
  ArrowUp,
  ArrowDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SEARCH_INDEX, type SearchItem } from "@/features/search/search-index";

/** Custom window event the topbar dispatches to open the palette. */
const OPEN_EVENT = "stark:open-search";

/** Human labels for each group, in display order. */
const TYPE_ORDER: SearchItem["type"][] = ["page", "lesson", "problem", "thread"];
const TYPE_LABEL: Record<SearchItem["type"], string> = {
  page: "Pages",
  lesson: "Lessons",
  problem: "Problems",
  thread: "Threads",
};
const TYPE_TAG: Record<SearchItem["type"], string> = {
  page: "page",
  lesson: "lesson",
  problem: "problem",
  thread: "thread",
};

/** Fallback icon per type (problems/lessons/threads share one each). */
const TYPE_ICON: Record<SearchItem["type"], LucideIcon> = {
  page: LayoutDashboard,
  problem: FlaskConical,
  lesson: BookOpen,
  thread: MessagesSquare,
};

/** Per-page icons so pages feel native to the nav. */
const PAGE_ICON: Record<string, LucideIcon> = {
  "/dashboard": LayoutDashboard,
  "/arena": Swords,
  "/learn": GraduationCap,
  "/practice": ClipboardCheck,
  "/leaderboard": Trophy,
  "/community": Users,
  "/skills": Network,
  "/quizzes": ListChecks,
  "/profile": User,
  "/settings": Settings,
};

function iconFor(item: SearchItem): LucideIcon {
  if (item.type === "page") return PAGE_ICON[item.href] ?? TYPE_ICON.page;
  return TYPE_ICON[item.type];
}

/** Page suggestions for the empty (no-query) state. */
const JUMP_TO_HREFS = ["/dashboard", "/practice", "/learn", "/arena"];

function matches(item: SearchItem, q: string): boolean {
  const haystack = [item.title, item.subtitle ?? "", ...(item.keywords ?? [])]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Flat, ordered list of currently-visible results (grouped on render).
  const results = useMemo<SearchItem[]>(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? SEARCH_INDEX.filter((item) => matches(item, q))
      : SEARCH_INDEX.filter((item) => JUMP_TO_HREFS.includes(item.href));
    return TYPE_ORDER.flatMap((type) => pool.filter((item) => item.type === type));
  }, [query]);

  // Group visible results, preserving the flat-index order for keyboard nav.
  const groups = useMemo(() => {
    let cursor = 0;
    return TYPE_ORDER.map((type) => {
      const items = results
        .filter((item) => item.type === type)
        .map((item) => ({ item, index: cursor++ }));
      return { type, items };
    }).filter((g) => g.items.length > 0);
  }, [results]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const select = useCallback(
    (item: SearchItem | undefined) => {
      if (!item) return;
      close();
      router.push(item.href);
    },
    [close, router],
  );

  // Open via ⌘K / Ctrl+K and the topbar's custom event.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  // Lock body scroll + autofocus while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Reset highlight when the result set changes.
  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the highlighted row in view.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      select(results[active]);
    }
  };

  if (!open) return null;

  const hasQuery = query.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onMouseDown={(e) => {
        // Backdrop click (not clicks bubbling up from the panel) closes.
        if (e.target === e.currentTarget) close();
      }}
      role="presentation"
    >
      <div className="flex min-h-full items-start justify-center px-4 pt-[12vh]">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="glass w-full max-w-xl overflow-hidden rounded-xl shadow-2xl"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Search input */}
          <div className="input-terminal flex items-center gap-2 rounded-none border-x-0 border-t-0 px-3">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Search problems, lessons, threads…"
              className="h-12 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground"
              autoComplete="off"
              spellCheck={false}
              aria-label="Search"
            />
            <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
              ⌘K
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
            {results.length === 0 ? (
              <p className="px-3 py-8 text-center font-mono text-sm text-muted-foreground">
                No results for &ldquo;{query.trim()}&rdquo;
              </p>
            ) : (
              <>
                {!hasQuery && (
                  <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    Jump to…
                  </p>
                )}
                {groups.map((group) => (
                  <div key={group.type} className="mb-1 last:mb-0">
                    {hasQuery && (
                      <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {TYPE_LABEL[group.type]}
                      </p>
                    )}
                    {group.items.map(({ item, index }) => {
                      const Icon = iconFor(item);
                      const isActive = index === active;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          data-index={index}
                          onMouseMove={() => setActive(index)}
                          onClick={() => select(item)}
                          className={cn(
                            "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left outline-none transition-colors",
                            isActive ? "bg-accent" : "hover:bg-accent/50",
                          )}
                        >
                          <Icon className="size-4 shrink-0 text-muted-foreground" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm text-foreground">
                              {item.title}
                            </span>
                            {item.subtitle && (
                              <span className="block truncate text-xs text-muted-foreground">
                                {item.subtitle}
                              </span>
                            )}
                          </span>
                          <span className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                            {TYPE_TAG[item.type]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Footer hints */}
          <div className="flex items-center gap-4 border-t border-border px-3 py-2 font-mono text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <ArrowUp className="size-3" />
              <ArrowDown className="size-3" />
              navigate
            </span>
            <span className="flex items-center gap-1">
              <CornerDownLeft className="size-3" />
              open
            </span>
            <span className="ml-auto">esc to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
