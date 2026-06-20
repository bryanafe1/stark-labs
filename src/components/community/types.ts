// ---------------------------------------------------------------------------
//  Community Hub — local-first types.
//  `Comment` is recursive: a comment can carry its own `replies`, each of which
//  is itself a `Comment`. This is what powers the Reddit-style nested tree.
// ---------------------------------------------------------------------------

export interface Comment {
  id: string;
  author: string;
  content: string;
  upvotes: number;
  /** Human-readable relative time, e.g. "3h", "2d" (mono metadata). */
  timestamp: string;
  /** Optional nested replies — also Comments. */
  replies?: Comment[];
}

export interface Thread {
  id: string;
  title: string;
  author: string;
  /** Original post body (markdown-free plain text for the local-first demo). */
  content: string;
  upvotes: number;
  timestamp: string;
  /** Topical flair shown as a mono tag (e.g. "HVAC", "FEA"). */
  flair: string;
  tags: string[];
  comments: Comment[];
}
