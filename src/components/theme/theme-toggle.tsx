"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "dark" | "light";

// Keep `data-theme` (drives our CSS vars) and the `dark` class (drives any
// Tailwind `dark:` variants) in sync.
function applyTheme(t: Theme) {
  const el = document.documentElement;
  el.dataset.theme = t;
  el.classList.toggle("dark", t === "dark");
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  // Sync from whatever the no-flash script already set on <html>.
  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "dark";
    setTheme(current);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem("stark.theme", next);
    } catch {
      /* ignore (private mode etc.) */
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title="Toggle theme"
      onClick={toggle}
    >
      {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}
