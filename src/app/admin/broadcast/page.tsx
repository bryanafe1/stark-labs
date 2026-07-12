import type { Metadata } from "next";
import { audienceCount, type Audience } from "@/server/actions/broadcast";
import { BroadcastComposer } from "@/components/admin/broadcast-composer";

export const metadata: Metadata = { title: "Broadcast", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BroadcastPage() {
  const keys: Audience[] = ["all", "inactive", "free", "paid"];
  const values = await Promise.all(keys.map((k) => audienceCount(k)));
  const counts = Object.fromEntries(keys.map((k, i) => [k, values[i] ?? 0])) as Record<Audience, number>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Broadcast email</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Compose an email to your users. It&apos;s wrapped in the branded template and includes a
          one-click unsubscribe. Always send yourself a test first.
        </p>
      </div>
      <BroadcastComposer counts={counts} />
    </div>
  );
}
