import type { Metadata } from "next";
import { getProfile } from "@/features/profile/get-profile";
import { SettingsForm } from "@/components/settings/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const { user } = await getProfile();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile and notification preferences.
        </p>
      </div>

      <SettingsForm
        initial={{
          displayName: user.displayName,
          username: user.username,
          bio: user.bio,
          image: user.image ?? "",
        }}
      />
    </div>
  );
}
