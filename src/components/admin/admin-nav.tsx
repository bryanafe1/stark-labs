"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Gift,
  Tag,
  Ticket,
  BarChart3,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { adminLogout } from "@/server/actions/admin-auth";

const ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/sales", label: "Sales", icon: DollarSign },
  { href: "/admin/creators", label: "Creators", icon: Users },
  { href: "/admin/comp", label: "Comp access", icon: Gift },
  { href: "/admin/pricing", label: "Pricing", icon: Tag },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/signups", label: "Signups", icon: BarChart3 },
];

export function AdminNav() {
  const path = usePathname();
  return (
    <aside className="border-b border-border md:w-56 md:shrink-0 md:border-b-0 md:border-r">
      <div className="md:sticky md:top-0 md:flex md:h-screen md:flex-col md:px-3 md:py-6">
        <div className="px-4 py-4 md:px-3 md:py-0">
          <p className="text-sm font-bold tracking-tight">OC // LABS</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:mt-6 md:flex-col md:overflow-visible md:px-0 md:pb-0">
          {ITEMS.map((it) => {
            const active = path === it.href;
            const Icon = it.icon;
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {it.label}
              </Link>
            );
          })}
        </nav>
        <form action={adminLogout} className="px-2 pb-3 md:mt-auto md:px-0 md:pb-0">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
