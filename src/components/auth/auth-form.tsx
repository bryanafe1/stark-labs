"use client";

import { type InputHTMLAttributes } from "react";
import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  signInWithPassword,
  signUpWithPassword,
  type AuthFormState,
} from "@/server/actions/auth-actions";
import {
  requestPasswordReset,
  resetPassword,
  type RequestResetState,
  type ResetState,
} from "@/server/actions/password-reset";

/* ------------------------------------------------------------------ */
/* Primitives                                                          */
/* ------------------------------------------------------------------ */

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

export function Field({ label, id, error, className, ...props }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        className={cn(
          "elevated h-10 w-full rounded-lg border border-input bg-card/60 px-3 text-sm outline-none ring-ring focus:ring-2",
          error && "border-destructive ring-destructive",
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? pendingLabel : label}
    </Button>
  );
}


/* ------------------------------------------------------------------ */
/* Sign in (email + password)                                          */
/* ------------------------------------------------------------------ */

export function SignInForm() {
  const [state, action] = useFormState<AuthFormState, FormData>(signInWithPassword, {});
  return (
    <form action={action} noValidate className="space-y-4">
      <Field
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@company.com"
      />
      <Field
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        required
        placeholder="••••••••"
      />
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton label="Sign in" pendingLabel="Signing in…" />
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Sign up (email + password)                                          */
/* ------------------------------------------------------------------ */

export function SignUpForm() {
  const [state, action] = useFormState<AuthFormState, FormData>(signUpWithPassword, {});
  return (
    <form action={action} noValidate className="space-y-4">
      <Field id="name" name="name" label="Name" autoComplete="name" placeholder="Ada Lovelace" />
      <Field
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        placeholder="you@company.com"
      />
      <Field
        id="password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
        placeholder="At least 8 characters"
      />
      {state.error && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}
      <SubmitButton label="Create account" pendingLabel="Creating…" />
      <p className="text-center text-xs text-muted-foreground">
        By continuing you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Forgot password (placeholder — needs an email service to send)      */
/* ------------------------------------------------------------------ */

export function ForgotPasswordForm() {
  const [state, action] = useFormState<RequestResetState, FormData>(requestPasswordReset, {});

  if (state.sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="size-8 text-success" />
        <p className="text-sm text-foreground">
          If an account exists, a reset link is on its way — check your inbox.
        </p>
        <p className="text-xs text-muted-foreground">The link expires in 1 hour.</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-4">
      <Field
        id="email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        error={state.error}
      />
      <SubmitButton label="Send reset link" pendingLabel="Sending…" />
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, action] = useFormState<ResetState, FormData>(resetPassword, {});

  if (!token) {
    return (
      <p className="py-4 text-center text-sm text-destructive">
        This reset link is missing its token. Request a new one from{" "}
        <Link href="/forgot-password" className="underline">
          forgot password
        </Link>
        .
      </p>
    );
  }

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="size-8 text-success" />
        <p className="text-sm text-foreground">Your password has been reset.</p>
        <Button asChild className="mt-1">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <Field
        id="password"
        name="password"
        label="New password"
        type="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        error={state.error}
      />
      <SubmitButton label="Reset password" pendingLabel="Resetting…" />
    </form>
  );
}
