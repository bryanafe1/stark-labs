import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";
import { GitHubButton } from "@/components/auth/github-button";

export const metadata: Metadata = {
  title: "Sign in · Stark",
};

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your workspace."
      footer={{
        prompt: "Don't have an account?",
        linkLabel: "Sign up",
        href: "/sign-up",
      }}
    >
      <div className="space-y-4">
        <GoogleButton />
        {process.env.AUTH_GITHUB_ID && <GitHubButton />}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>
        <SignInForm />
      </div>
    </AuthCard>
  );
}
