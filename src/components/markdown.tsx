import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Latex } from "@/components/latex";

// ---------------------------------------------------------------------------
//  Minimal, dependency-free Markdown renderer.
//
//  Renders a safe subset (headings, bold/italic, inline + fenced code, lists,
//  blockquotes, links, paragraphs) to real React nodes — no
//  dangerouslySetInnerHTML, so user content can't inject markup. Swap for
//  react-markdown + remark-gfm if you need tables, footnotes, etc.
// ---------------------------------------------------------------------------

function safeHref(href: string): string {
  return /^(https?:\/\/|\/|#|mailto:)/i.test(href.trim()) ? href.trim() : "#";
}

interface InlineRule {
  re: RegExp;
  render: (m: RegExpExecArray, key: string) => ReactNode;
}

const INLINE_RULES: InlineRule[] = [
  // Escaped dollar — render a literal "$" (so prices etc. don't become math).
  {
    re: /\\\$/,
    render: (_m, key) => <Fragment key={key}>$</Fragment>,
  },
  // Inline math: $...$ (no spaces hugging the delimiters, no newlines).
  {
    re: /\$(\S(?:[^$\n]*\S)?)\$/,
    render: (m, key) => <Latex key={key} tex={m[1] ?? ""} />,
  },
  {
    re: /`([^`]+)`/,
    render: (m, key) => (
      <code
        key={key}
        className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
      >
        {m[1]}
      </code>
    ),
  },
  {
    re: /\*\*([^*]+)\*\*/,
    render: (m, key) => (
      <strong key={key} className="font-semibold">
        {parseInline(m[1] ?? "", key + "i")}
      </strong>
    ),
  },
  {
    re: /(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/,
    render: (m, key) => (
      <em key={key} className="italic">
        {parseInline(m[1] ?? "", key + "i")}
      </em>
    ),
  },
  {
    re: /\[([^\]]+)\]\(([^)]+)\)/,
    render: (m, key) => (
      <a
        key={key}
        href={safeHref(m[2] ?? "")}
        className="font-medium text-primary underline-offset-2 hover:underline"
        target={safeHref(m[2] ?? "").startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        {m[1]}
      </a>
    ),
  },
];

function parseInline(text: string, keyPrefix = ""): ReactNode[] {
  let earliest: { rule: InlineRule; match: RegExpExecArray } | null = null;
  for (const rule of INLINE_RULES) {
    const m = rule.re.exec(text);
    if (m && (earliest === null || m.index < earliest.match.index)) {
      earliest = { rule, match: m };
    }
  }
  if (!earliest) return [text];

  const { rule, match } = earliest;
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + match[0].length);
  return [
    ...(before ? parseInline(before, keyPrefix + "b") : []),
    rule.render(match, keyPrefix + "m"),
    ...(after ? parseInline(after, keyPrefix + "a") : []),
  ];
}

/** Split into blocks, isolating fenced code blocks first. */
function splitBlocks(src: string): string[] {
  const out: string[] = [];
  // Isolate fenced code and block math ($$...$$) so they aren't split mid-block.
  const parts = src.split(/(```[\s\S]*?```|\$\$[\s\S]*?\$\$)/g);
  for (const part of parts) {
    if (!part) continue;
    if (part.startsWith("```") || part.startsWith("$$")) {
      out.push(part);
    } else {
      for (const block of part.split(/\n{2,}/)) {
        if (block.trim()) out.push(block);
      }
    }
  }
  return out;
}

export function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const blocks = splitBlocks(content);

  return (
    <div className={cn("space-y-4 text-sm leading-relaxed text-foreground/90", className)}>
      {blocks.map((block, i) => {
        const key = `b${i}`;

        // Fenced code
        if (block.startsWith("```")) {
          const code = block.replace(/^```[^\n]*\n?/, "").replace(/```$/, "");
          return (
            <pre
              key={key}
              className="overflow-x-auto rounded-lg border border-border bg-secondary/50 p-4 font-mono text-xs leading-relaxed"
            >
              <code>{code.replace(/\n$/, "")}</code>
            </pre>
          );
        }

        // Block math: $$ ... $$
        if (block.startsWith("$$") && block.endsWith("$$")) {
          return <Latex key={key} display tex={block.slice(2, -2).trim()} />;
        }

        // Headings
        const heading = /^(#{1,3})\s+(.*)$/.exec(block);
        if (heading) {
          const level = heading[1]!.length;
          const text = parseInline(heading[2] ?? "", key);
          if (level === 1) return <h1 key={key} className="text-xl font-bold tracking-tight">{text}</h1>;
          if (level === 2) return <h2 key={key} className="text-lg font-semibold tracking-tight">{text}</h2>;
          return <h3 key={key} className="text-base font-semibold">{text}</h3>;
        }

        // Blockquote
        if (block.split("\n").every((l) => l.startsWith(">"))) {
          const text = block.replace(/^>\s?/gm, "");
          return (
            <blockquote key={key} className="border-l-2 border-primary/50 pl-4 italic text-muted-foreground">
              {parseInline(text, key)}
            </blockquote>
          );
        }

        // Ordered list
        const lines = block.split("\n");
        if (lines.every((l) => /^\d+\.\s+/.test(l))) {
          return (
            <ol key={key} className="list-decimal space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{parseInline(l.replace(/^\d+\.\s+/, ""), `${key}-${j}`)}</li>
              ))}
            </ol>
          );
        }

        // Unordered list
        if (lines.every((l) => /^[-*]\s+/.test(l))) {
          return (
            <ul key={key} className="list-disc space-y-1 pl-5">
              {lines.map((l, j) => (
                <li key={j}>{parseInline(l.replace(/^[-*]\s+/, ""), `${key}-${j}`)}</li>
              ))}
            </ul>
          );
        }

        // Paragraph (soft line breaks preserved)
        return (
          <p key={key}>
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {parseInline(l, `${key}-${j}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
