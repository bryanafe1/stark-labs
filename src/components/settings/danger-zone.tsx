"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "@/server/actions/profile";

export function DeleteAccount() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <Button variant="destructive" onClick={() => setConfirming(true)} className="gap-2">
        <Trash2 className="size-4" /> Delete account
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-foreground">
        This permanently deletes your account and all your progress. This cannot be undone.
      </p>
      <div className="flex items-center gap-2">
        <form action={deleteAccount}>
          <ConfirmDeleteButton />
        </form>
        <Button variant="secondary" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function ConfirmDeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={pending} className="gap-2">
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? "Deleting…" : "Yes, delete everything"}
    </Button>
  );
}
