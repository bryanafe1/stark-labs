import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/auth-form";

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
      <SignUpForm />
    </AuthCard>
  );
}
