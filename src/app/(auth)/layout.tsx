import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-grid relative flex min-h-screen items-center justify-center overflow-y-auto bg-background px-4 py-12">
      {/* Soften the grid toward the edges so the card sits center-stage. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
      <main className="relative z-10 w-full max-w-sm">{children}</main>
    </div>
  );
}
