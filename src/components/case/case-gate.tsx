"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Lock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { unlockCaseCoach, type GateState } from "@/server/actions/case-access";

export function CaseGate() {
  const [state, action] = useFormState<GateState, FormData>(unlockCaseCoach, {});

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-6 text-center">
      <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
        <Lock className="size-5" />
      </span>
      <p className="mt-3 text-sm font-semibold text-foreground">Private preview</p>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
        Enter the access password to start a case. No account needed.
      </p>
      <form action={action} className="mx-auto mt-4 max-w-xs space-y-2">
        <input
          type="password"
          name="password"
          autoComplete="off"
          autoFocus
          placeholder="Access password"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-center text-sm outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50"
        />
        {state.error && <p className="text-xs font-medium text-destructive">{state.error}</p>}
        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
      Unlock
    </Button>
  );
}
