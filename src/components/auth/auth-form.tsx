"use client";

import {
  useState,
  type FormEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { Github, Chrome, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="relative my-5 flex items-center">
      <span className="h-px flex-1 bg-border" />
      <span className="px-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {children}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function OAuthButtons() {
  const router = useRouter();
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push("/dashboard")}
      >
        <Github />
        GitHub
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.push("/dashboard")}
      >
        <Chrome />
        Google
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Validation helpers                                                  */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value: string): string | undefined {
  if (!value.trim()) return "Email is required.";
  if (!EMAIL_RE.test(value)) return "Enter a valid email address.";
  return undefined;
}

function validatePassword(value: string): string | undefined {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  return undefined;
}

/* ------------------------------------------------------------------ */
/* Sign in                                                            */
/* ------------------------------------------------------------------ */

export function SignInForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    if (next.email || next.password) return;
    router.push("/dashboard");
  }

  return (
    <div className="space-y-5">
      <OAuthButtons />
      <Divider>or</Divider>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </a>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={errors.password ? true : undefined}
            className={cn(
              "h-10 w-full rounded-md border border-input bg-card/60 px-3 text-sm outline-none ring-ring focus:ring-2",
              errors.password && "border-destructive ring-destructive",
            )}
          />
          {errors.password ? (
            <p className="text-xs text-destructive" role="alert">
              {errors.password}
            </p>
          ) : null}
        </div>
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sign up                                                            */
/* ------------------------------------------------------------------ */

export function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(next);
    if (next.email || next.password) return;
    router.push("/onboarding");
  }

  return (
    <div className="space-y-5">
      <OAuthButtons />
      <Divider>or</Divider>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Field
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>
      <p className="text-center text-xs text-muted-foreground">
        By continuing you agree to our Terms and Privacy Policy.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Forgot password                                                    */
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
        <p className="font-mono text-xs text-muted-foreground">{email}</p>
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
