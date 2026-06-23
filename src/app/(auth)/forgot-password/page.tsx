import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Reset password · Overclocker",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send a reset link."
      footer={{
        prompt: "Remembered it?",
        linkLabel: "Back to sign in",
        href: "/sign-in",
      }}
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
