import katex from "katex";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
//  KaTeX renderer (Iteration 2, Phase 0).
//
//  KaTeX renders to deterministic static HTML, so we render on the server with
//  `renderToString` — identical output on client and server means no hydration
//  mismatch and zero client JS for the math itself. The KaTeX stylesheet is
//  imported once in the root layout.
//
//  Content is author-trusted (lessons/problems written by Bryan), so injecting
//  KaTeX's HTML is safe. `throwOnError: false` renders malformed TeX in red
//  rather than crashing the page.
// ---------------------------------------------------------------------------

export function Latex({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  let html: string;
  try {
    html = katex.renderToString(tex, {
      displayMode: display,
      throwOnError: false,
      output: "html",
    });
  } catch {
    // Last-resort fallback: show the raw TeX so nothing disappears silently.
    return <code className={cn("font-mono text-sm", className)}>{tex}</code>;
  }

  if (display) {
    return (
      <div
        className={cn("my-3 overflow-x-auto", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
