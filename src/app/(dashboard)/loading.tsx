// Shown during navigation between app routes. Generic skeleton that fits any page.
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl animate-pulse space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-lg bg-secondary" />
        <div className="h-4 w-80 max-w-full rounded bg-secondary/60" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-card/40" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-64 rounded-xl border border-border bg-card/40 lg:col-span-2" />
        <div className="h-64 rounded-xl border border-border bg-card/40" />
      </div>
    </div>
  );
}
