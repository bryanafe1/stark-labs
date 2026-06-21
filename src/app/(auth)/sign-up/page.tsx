import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";

export const metadata: Metadata = {
  title: "Sign up · Stark",
};

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start building with Stark in seconds."
      footer={{
        prompt: "Already have an account?",
        linkLabel: "Sign in",
        href: "/sign-in",
      }}
    >
      <div className="space-y-4">
        <GoogleButton label="Sign up with Google" />
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>
        <SignUpForm />
      </div>
    </AuthCard>
  );
}
