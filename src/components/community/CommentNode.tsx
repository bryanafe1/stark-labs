"use client";

import { useState } from "react";
import { ArrowBigUp, ChevronDown, ChevronRight, Reply, CornerDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Comment } from "./types";

/**
 * The recursive UI engine. Renders one comment, then maps over its `replies`,
 * rendering a <CommentNode /> for each — so the tree nests to any depth.
 * All interactivity (upvote, collapse, reply) is local React state.
 */
export function CommentNode({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  // Upvote — toggles, snapping the icon to terminal green when active.
  const [score, setScore] = useState(comment.upvotes);
  const [voted, setVoted] = useState(false);
  const toggleVote = () => {
    setScore((s) => (voted ? s - 1 : s + 1));
    setVoted((v) => !v);
  };

  // Collapse/expand — hides the child subtree.
  const [collapsed, setCollapsed] = useState(false);

  // Reply — a minimalist local composer that appends to local state.
  const [replies, setReplies] = useState<Comment[]>(comment.replies ?? []);
  const [replyOpen, setReplyOpen] = useState(false);
  const [draft, setDraft] = useState("");

  const submitReply = () => {
    const text = draft.trim();
    if (!text) return;
    setReplies((prev) => [
      ...prev,
      { id: `r-${Date.now()}`, author: "you", content: text, upvotes: 0, timestamp: "now", replies: [] },
    ]);
    setDraft("");
    setReplyOpen(false);
    setCollapsed(false);
  };

  const hasReplies = replies.length > 0;

  return (
    <div className="group/comment min-w-0">
      {/* Header — mono metadata */}
      <div className="flex items-center gap-2 font-mono text-xs">
        {hasReplies ? (
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand replies" : "Collapse replies"}
            className="text-zinc-500 transition-colors hover:text-zinc-200"
          >
            {collapsed ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
          </button>
        ) : (
          <CornerDownRight className="size-4 text-zinc-700" />
        )}
        <span className="font-medium text-zinc-200">{comment.author}</span>
        <span className="text-zinc-600">·</span>
        <span className="text-zinc-500">{comment.timestamp}</span>
        {collapsed && hasReplies && (
          <span className="text-zinc-600">
            · [{replies.length} {replies.length === 1 ? "reply" : "replies"} hidden]
          </span>
        )}
      </div>

      {/* Body (Inter) */}
      <p className="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-zinc-300">
        {comment.content}
      </p>

      {/* Actions */}
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          onClick={toggleVote}
          className={cn(
            "inline-flex items-center gap-1 rounded font-mono text-xs transition-colors",
            voted ? "text-terminal" : "text-zinc-400 hover:text-zinc-100",
          )}
        >
          <ArrowBigUp className={cn("size-4", voted && "fill-terminal")} />
          {score}
        </button>
        <button
          type="button"
          onClick={() => setReplyOpen((o) => !o)}
          className="inline-flex items-center gap-1 font-mono text-xs text-zinc-400 transition-colors hover:text-zinc-100"
        >
          <Reply className="size-3.5" />
          reply
        </button>
      </div>

      {/* Reply composer */}
      {replyOpen && (
        <div className="mt-3">
          <textarea
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={`reply to @${comment.author}…`}
            rows={3}
            className="input-terminal w-full p-3 text-sm leading-relaxed"
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={submitReply}
              disabled={!draft.trim()}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              Comment
            </button>
            <button
              type="button"
              onClick={() => {
                setReplyOpen(false);
                setDraft("");
              }}
              className="px-2 py-1.5 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-200"
            >
              cancel
            </button>
          </div>
        </div>
      )}

      {/* Nested replies — Reddit-style indentation tree */}
      {hasReplies && !collapsed && (
        <div
          className={cn(
            "mt-3 min-w-0 space-y-4 border-l border-zinc-800",
            depth >= 4 ? "pl-2" : "pl-4",
          )}
        >
          {replies.map((reply) => (
            <CommentNode key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
