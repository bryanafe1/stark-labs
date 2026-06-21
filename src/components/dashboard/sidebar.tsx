"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hexagon } from "lucide-react";
import { PRIMARY_NAV } from "@/config/nav";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r border-border bg-card/40 lg:flex">
      <Link href="/dashboard" className="flex h-16 items-center gap-2 px-6">
        <Hexagon className="size-7 fill-primary/20 text-primary" />
        <span className="text-lg font-bold tracking-tight">Stark</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {PRIMARY_NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
              {active && (
                <span className="ml-auto h-5 w-1 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="m-3 rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-4">
        <p className="text-sm font-semibold">Climb the ladder</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Queue a ranked sprint to defend your tier.
        </p>
        <Link
          href="/arena"
          className="mt-3 inline-flex w-full items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Enter Arena
        </Link>
      </div>
    </aside>
  );
}
