"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { adminLogin } from "@/server/actions/admin-auth";

const input =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition focus-visible:ring-2";

function LoginInner() {
  const error = useSearchParams().get("error");
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm p-7">
        <div className="mb-5 flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="size-5" />
          </span>
          <div>
            <h1 className="text-base font-bold leading-none tracking-tight">OC // LABS Admin</h1>
            <p className="mt-1 text-xs text-muted-foreground">Restricted access</p>
          </div>
        </div>
        <form action={adminLogin} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Username</label>
            <input name="username" autoComplete="username" required className={input} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Password</label>
            <input name="password" type="password" autoComplete="current-password" required className={input} />
          </div>
          {error && <p className="text-sm font-medium text-destructive">Invalid username or password.</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign in
          </button>
        </form>
      </Card>
    </div>
  );
}

export function AdminLogin() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
