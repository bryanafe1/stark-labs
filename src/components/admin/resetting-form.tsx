"use client";

import { useRef } from "react";

/**
 * A <form> bound to a server action that clears its inputs after a successful
 * submit (server-action forms don't auto-reset). On error the action throws and
 * the form keeps its values.
 */
export function ResettingForm({
  action,
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (fd) => {
        await action(fd);
        ref.current?.reset();
      }}
      className={className}
    >
      {children}
    </form>
  );
}
