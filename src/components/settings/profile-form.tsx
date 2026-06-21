"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile, type ProfileState } from "@/server/actions/profile";

const inputCls =
  "h-10 w-full rounded-lg border border-input bg-card/60 px-3 text-sm outline-none ring-ring focus:ring-2";

export function ProfileForm({
  initial,
}: {
  initial: { displayName: string; username: string; bio: string };
}) {
  const [state, formAction] = useFormState<ProfileState, FormData>(updateProfile, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Display name</label>
        <input name="displayName" className={inputCls} defaultValue={initial.displayName} maxLength={60} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Username</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">@</span>
          <input name="username" className={inputCls} defaultValue={initial.username} maxLength={30} />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium">Bio</label>
        <textarea
          name="bio"
          rows={3}
          maxLength={280}
          defaultValue={initial.bio}
          className="w-full rounded-lg border border-input bg-card/60 p-3 text-sm leading-relaxed outline-none ring-ring focus:ring-2"
        />
      </div>

      <div className="flex items-center gap-3">
        <SaveButton />
        {state.ok && (
          <span className="flex items-center gap-1 text-sm text-emerald-500">
            <Check className="size-4" /> Saved
          </span>
        )}
        {state.error && <span className="text-sm text-destructive">{state.error}</span>}
      </div>
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Saving…" : "Save changes"}
    </Button>
  );
}
