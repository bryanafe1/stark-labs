"use client";

import { useMemo, useState } from "react";
import { ArrowBigUp, MessageSquare, Hash } from "lucide-react";
import { cn, formatCompact } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";
import { MOCK_THREADS } from "./mockCommunityData";
import { CommentNode } from "./CommentNode";
import type { Comment, Thread } from "./types";

function countComments(comments: Comment[]): number {
  return comments.reduce((n, c) => n + 1 + countComments(c.replies ?? []), 0);
}

export function CommunityHub() {
  const first = MOCK_THREADS[0];
  const [selectedId, setSelectedId] = useState<string>(first?.id ?? "");
  const selected = MOCK_THREADS.find((t) => t.id === selectedId) ?? first;

  if (!selected) {
    return (
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Community Hub</h1>
        </div>
        <EmptyState
          icon={MessageSquare}
          title="No threads yet"
          description="Start a discussion — everything here is local-first with no backend."
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Community Hub</h1>
        <p className="font-mono text-sm text-muted-foreground">
          {MOCK_THREADS.length} threads · local-first · no backend
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        {/* LEFT — thread list */}
        <aside className="space-y-2 lg:sticky lg:top-20 lg:self-start">
          {MOCK_THREADS.map((t) => (
            <ThreadListItem
              key={t.id}
              thread={t}
              active={t.id === selectedId}
              onSelect={() => setSelectedId(t.id)}
            />
          ))}
        </aside>

        {/* RIGHT — detail. key resets local state when switching threads. */}
        <ThreadDetail key={selected.id} thread={selected} />
      </div>
    </div>
  );
}

function ThreadListItem({
  thread,
  active,
  onSelect,
}: {
  thread: Thread;
  active: boolean;
  onSelect: () => void;
}) {
  const total = useMemo(() => countComments(thread.comments), [thread.comments]);
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-colors",
        active
          ? "border-terminal/40 bg-terminal/[0.04]"
          : "border-border bg-card/40 hover:bg-accent",
      )}
    >
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
        <span className="rounded bg-muted px-1.5 py-0.5 text-foreground">{thread.flair}</span>
        <span className="text-muted-foreground">{thread.timestamp}</span>
      </div>
      <h3 className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-foreground">
        {thread.title}
      </h3>
      <div className="mt-2 flex items-center gap-3 font-mono text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ArrowBigUp className="size-3.5" />
          {formatCompact(thread.upvotes)}
        </span>
        <span className="flex items-center gap-1">
          <MessageSquare className="size-3.5" />
          {total}
        </span>
      </div>
    </button>
  );
}

function ThreadDetail({ thread }: { thread: Thread }) {
  const [comments, setComments] = useState<Comment[]>(thread.comments);
  const [score, setScore] = useState(thread.upvotes);
  const [voted, setVoted] = useState(false);
  const [draft, setDraft] = useState("");

  const total = countComments(comments);

  const addRootComment = () => {
    const text = draft.trim();
    if (!text) return;
    setComments((prev) => [
      { id: `c-${Date.now()}`, author: "you", content: text, upvotes: 0, timestamp: "now", replies: [] },
      ...prev,
    ]);
    setDraft("");
  };

  return (
    <div className="min-w-0 rounded-xl border border-border bg-card/40">
      {/* Original post */}
      <article className="border-b border-border p-5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="rounded bg-muted px-1.5 py-0.5 uppercase tracking-wide text-foreground">
            {thread.flair}
          </span>
          <span className="text-foreground">{thread.author}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{thread.timestamp}</span>
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
          {thread.title}
        </h2>
        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/90">
          {thread.content}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {thread.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-0.5 rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
            >
              <Hash className="size-3" />
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setScore((s) => (voted ? s - 1 : s + 1));
              setVoted((v) => !v);
            }}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              voted
                ? "border-terminal/40 text-terminal"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            <ArrowBigUp className={cn("size-4", voted && "fill-terminal")} />
            {formatCompact(score)}
          </button>
          <span className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground">
            <MessageSquare className="size-4" />
            {total}
          </span>
        </div>
      </article>

      {/* Root composer */}
      <div className="border-b border-border p-5">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="// add a comment…"
          rows={3}
          className="input-terminal w-full p-3 text-sm leading-relaxed"
        />
        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={addRootComment}
            disabled={!draft.trim()}
            className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors outline-none hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:opacity-40"
          >
            Comment
          </button>
        </div>
      </div>

      {/* Comment tree */}
      <div className="space-y-5 p-5">
        {comments.map((c) => (
          <CommentNode key={c.id} comment={c} />
        ))}
      </div>
    </div>
  );
}
