import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/auth-form";
import { GoogleButton } from "@/components/auth/google-button";
import { GitHubButton } from "@/components/auth/github-button";

export const metadata: Metadata = {
  title: "Sign up · Overclocker",
};

export default async function SignUpPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start building with Overclocker in seconds."
      footer={{
        prompt: "Already have an account?",
        linkLabel: "Sign in",
        href: "/sign-in",
      }}
    >
      <div className="space-y-4">
        <GoogleButton label="Sign up with Google" />
        {process.env.AUTH_GITHUB_ID && <GitHubButton label="Sign up with GitHub" />}
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
