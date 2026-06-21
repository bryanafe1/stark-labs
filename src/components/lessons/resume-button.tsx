"use client";

import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Smooth-scrolls to the first block the learner hasn't completed yet. */
export function ResumeButton({
  targetId,
  label = "Jump back in",
}: {
  targetId: string;
  label?: string;
}) {
  return (
    <Button
      type="button"
      className="shrink-0 gap-1.5"
      onClick={() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
    >
      {label} <ArrowDown className="size-4" />
    </Button>
  );
}
