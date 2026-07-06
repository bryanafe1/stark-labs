import Link from "next/link";
import { Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
] as const;

export function LandingNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Hexagon className="size-6 text-foreground" strokeWidth={1.75} />
          <span className="font-mono text-lg font-semibold tracking-tight">
            OVERCLOCK_
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="mr-1 hidden items-center gap-1 sm:flex">
            {NAV_LINKS.map((link) => (
              <Button key={link.href} asChild variant="ghost" size="sm">
                <Link href={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>
          <ThemeToggle />
          <Button asChild variant="ghost">
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Get started</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
