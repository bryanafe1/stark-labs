import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Set a new password · Overclocker",
};

export const dynamic = "force-dynamic";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a new password for your account."
      footer={{
        prompt: "Remembered it?",
        linkLabel: "Back to sign in",
        href: "/sign-in",
      }}
    >
      <ResetPasswordForm token={searchParams.token ?? ""} />
    </AuthCard>
  );
}
