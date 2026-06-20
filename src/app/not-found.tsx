import Link from "next/link";
import { Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <Hexagon className="size-12 fill-primary/20 text-primary" />
      <div>
        <p className="text-6xl font-black tracking-tight text-primary">404</p>
        <h1 className="mt-2 text-xl font-semibold">Page not found</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This route doesn&apos;t exist — or hasn&apos;t been built yet.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
