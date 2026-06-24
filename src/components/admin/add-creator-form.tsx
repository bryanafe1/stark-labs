"use client";

import { useEffect, useRef } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { createCreator, type CreatorFormState } from "@/server/actions/admin";

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none ring-ring transition focus-visible:ring-2 placeholder:text-muted-foreground/50";
const labelCls = "mb-1 block text-xs font-medium text-muted-foreground";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
    >
      {pending ? "Creating…" : "Create creator"}
    </button>
  );
}

export function AddCreatorForm() {
  const ref = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(createCreator, {} as CreatorFormState);

  // Clear the form after a successful create so it's ready for the next one.
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className={labelCls}>Name</label>
        <input name="name" required placeholder="Jane Doe" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Email (for free access)</label>
        <input name="email" type="email" placeholder="jane@youtube.com" className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Code</label>
        <input name="code" required placeholder="JANE20" className={inputCls} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Discount %</label>
          <input name="discountPercent" type="number" min={0} max={100} defaultValue={20} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Commission %</label>
          <input name="commissionPercent" type="number" min={0} max={100} defaultValue={10} className={inputCls} />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label className={labelCls}>Notes (optional)</label>
        <input name="notes" placeholder="450k subs, mechanical content" className={inputCls} />
      </div>
      <div className="sm:col-span-2">
        <SubmitButton />
        {state?.error && <p className="mt-2 text-sm font-medium text-destructive">{state.error}</p>}
        {state?.ok && <p className="mt-2 text-sm font-medium text-emerald-500">Creator created.</p>}
        <p className="mt-2 text-xs text-muted-foreground">
          Creates a Stripe coupon + promo code. If the email already has an account, it is comped now;
          otherwise it is comped automatically when they sign up.
        </p>
      </div>
    </form>
  );
}
