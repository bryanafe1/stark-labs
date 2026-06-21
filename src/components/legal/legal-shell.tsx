import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function LegalShell({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to Starklab
        </Link>
        <h1 className="mt-6 text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Last updated: {updated}</p>
        <div className="mt-8 space-y-2 pb-16 text-sm leading-relaxed text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-8 text-lg font-semibold text-foreground">{children}</h2>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-3">{children}</p>;
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-muted-foreground" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
