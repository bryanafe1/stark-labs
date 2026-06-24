"use client";

import { deleteCreator } from "@/server/actions/admin";

/** Delete a creator (removes their Stripe code + stats) after a confirm. */
export function DeleteCreatorButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteCreator}
      onSubmit={(e) => {
        if (
          !confirm(
            `Delete creator "${name}"?\n\nThis removes their code from Stripe and deletes their stats/commission history. This cannot be undone.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md border border-destructive/40 px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
      >
        Delete
      </button>
    </form>
  );
}
