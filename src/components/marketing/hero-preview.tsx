import { Bot, User, Send } from "lucide-react";
import { Latex } from "@/components/latex";
import { cn } from "@/lib/utils";

// A framed product shot for the hero — the mock interview mid-conversation,
// with real rendered math. Pure presentational; renders on the server.
export function HeroPreview() {
  return (
    <div className="relative mt-16 w-full max-w-2xl">
      {/* Soft indigo glow behind the frame. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 -top-12 bottom-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(239_84%_67%/0.22),transparent_70%)] blur-2xl"
      />
      <div className="elevated overflow-hidden rounded-xl border border-border bg-card text-left">
        {/* Window chrome */}
        <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            OVERCLOCK_ · Mock Interview — Mechanical
          </span>
        </div>

        {/* Conversation */}
        <div className="space-y-4 p-5">
          <Bubble role="assistant">
            Let&apos;s warm up with thermodynamics. A Carnot engine runs between
            300&nbsp;K and 600&nbsp;K — what&apos;s its maximum efficiency?
          </Bubble>
          <Bubble role="user">
            Carnot efficiency:{" "}
            <Latex tex="\eta = 1 - \tfrac{T_c}{T_h} = 1 - \tfrac{300}{600} = 50\%" />
          </Bubble>
          <Bubble role="assistant">
            Exactly. Now — why can&apos;t a real engine ever reach that limit?
          </Bubble>

          {/* Input mock */}
          <div className="flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2.5">
            <span className="flex-1 text-sm text-muted-foreground/70">Type your answer…</span>
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Send className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Bubble({
  role,
  children,
}: {
  role: "assistant" | "user";
  children: React.ReactNode;
}) {
  const assistant = role === "assistant";
  return (
    <div className={cn("flex gap-2.5", assistant ? "justify-start" : "justify-end")}>
      {assistant && (
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Bot className="size-3.5" />
        </span>
      )}
      <div
        className={cn(
          "max-w-[82%] rounded-2xl px-3.5 py-2 text-sm",
          assistant ? "border border-border bg-secondary/40" : "bg-primary/10 text-foreground",
        )}
      >
        {children}
      </div>
      {!assistant && (
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-secondary text-muted-foreground">
          <User className="size-3.5" />
        </span>
      )}
    </div>
  );
}
