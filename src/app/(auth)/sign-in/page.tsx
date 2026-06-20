import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/auth-form";

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
      <SignInForm />
    </AuthCard>
  );
}
