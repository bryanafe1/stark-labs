"use client";

import { useState, type FormEvent, type InputHTMLAttributes } from "react";
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
          "h-10 w-full rounded-md border border-input bg-card/60 px-3 text-sm outline-none ring-ring focus:ring-2",
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_RE.test(value)) return "Enter a valid email address.";
  return undefined;
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
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = validateEmail(email);
    setError(next);
    if (next) return;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="size-8 text-success" />
        <p className="text-sm text-foreground">
          If an account exists, a reset link is on its way.
        </p>
        <p className="break-all font-mono text-xs text-muted-foreground">{email}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
      />
      <Button type="submit" className="w-full">
        Send reset link
      </Button>
    </form>
  );
}
