"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Hexagon } from "lucide-react";
import { PRIMARY_NAV } from "@/config/nav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Portal target only exists in the browser.
  useEffect(() => setMounted(true), []);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      {/* Portal to <body> so the drawer escapes the sticky topbar's stacking
          context and sits above all page content. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div className="lg:hidden">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setOpen(false)}
                  className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 320, damping: 34 }}
                  className="fixed inset-y-0 left-0 z-[101] flex w-72 max-w-[85vw] flex-col border-r border-border bg-card"
                >
                  <div className="flex h-16 shrink-0 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <Hexagon className="size-7 fill-primary/20 text-primary" />
                      <span className="text-lg font-bold tracking-tight">OC // LABS</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Close menu"
                      onClick={() => setOpen(false)}
                    >
                      <X className="size-5" />
                    </Button>
                  </div>

                  <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
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
                          {active && <span className="ml-auto h-5 w-1 rounded-full bg-primary" />}
                        </Link>
                      );
                    })}
                  </nav>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
