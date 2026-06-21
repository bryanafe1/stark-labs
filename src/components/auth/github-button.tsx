import { Github } from "lucide-react";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

/** "Continue with GitHub" — kicks off the OAuth flow via a server action. */
export function GitHubButton({
  next = "/dashboard",
  label = "Continue with GitHub",
}: {
  next?: string;
  label?: string;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", { redirectTo: next });
      }}
    >
      <Button type="submit" variant="secondary" className="w-full gap-2">
        <Github className="size-4" />
        {label}
      </Button>
    </form>
  );
}
