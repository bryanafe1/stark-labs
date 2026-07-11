import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Analytics", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const DAYS = 30;
const num = (x: unknown) => Number((x ?? 0) as number | bigint);

interface UserRow {
  name: string | null;
  email: string;
  source: string | null;
  medium: string | null;
  signedUp: Date;
  attempts: bigint;
  interviews: bigint;
  lessons: bigint;
}

export default async function AnalyticsPage() {
  const since = new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000);

  const [kpi, visitSources, signupSources, landing, users, bounce, activation] = await Promise.all([
    prisma.$queryRaw<{ visitors: bigint; pageviews: bigint }[]>(Prisma.sql`
      SELECT COUNT(DISTINCT "visitorId") AS visitors, COUNT(*) AS pageviews
      FROM "PageView" WHERE "createdAt" >= ${since}`),
    prisma.$queryRaw<{ source: string; visitors: bigint; pageviews: bigint }[]>(Prisma.sql`
      SELECT COALESCE("source", 'unknown') AS source,
             COUNT(DISTINCT "visitorId") AS visitors, COUNT(*) AS pageviews
      FROM "PageView" WHERE "createdAt" >= ${since}
      GROUP BY 1 ORDER BY visitors DESC`),
    prisma.$queryRaw<{ source: string; medium: string | null; signups: bigint }[]>(Prisma.sql`
      SELECT COALESCE("signupSource", 'unknown') AS source, MAX("signupMedium") AS medium, COUNT(*) AS signups
      FROM "User" WHERE role = 'USER' GROUP BY 1`),
    prisma.$queryRaw<{ path: string; visitors: bigint; pageviews: bigint }[]>(Prisma.sql`
      SELECT "path", COUNT(DISTINCT "visitorId") AS visitors, COUNT(*) AS pageviews
      FROM "PageView" WHERE "createdAt" >= ${since}
      GROUP BY 1 ORDER BY visitors DESC LIMIT 12`),
    prisma.$queryRaw<UserRow[]>(Prisma.sql`
      SELECT u.name, u.email, u."signupSource" AS source, u."signupMedium" AS medium,
             u."createdAt" AS "signedUp",
             (SELECT COUNT(*) FROM "Submission" s WHERE s."userId" = u.id) AS attempts,
             (SELECT COUNT(*) FROM "InterviewSession" i WHERE i."userId" = u.id) AS interviews,
             (SELECT COUNT(*) FROM "LessonProgress" l WHERE l."userId" = u.id) AS lessons
      FROM "User" u WHERE u.role = 'USER'
      ORDER BY u."createdAt" DESC LIMIT 25`),
    prisma.$queryRaw<{ bounced: bigint; total: bigint }[]>(Prisma.sql`
      WITH v AS (SELECT "visitorId", COUNT(*) AS c FROM "PageView" WHERE "createdAt" >= ${since} GROUP BY 1)
      SELECT COUNT(*) FILTER (WHERE c = 1) AS bounced, COUNT(*) AS total FROM v`),
    prisma.$queryRaw<{ total: bigint; activated: bigint }[]>(Prisma.sql`
      SELECT COUNT(*) AS total,
             COUNT(*) FILTER (WHERE
               "freeInterviewTurns" > 0 OR "freeConceptGrades" > 0
               OR EXISTS (SELECT 1 FROM "Submission" s WHERE s."userId" = "User".id)
               OR EXISTS (SELECT 1 FROM "InterviewSession" i WHERE i."userId" = "User".id)
               OR EXISTS (SELECT 1 FROM "LessonProgress" l WHERE l."userId" = "User".id)
             ) AS activated
      FROM "User" WHERE role = 'USER'`),
  ]);

  const visitors = num(kpi[0]?.visitors);
  const pageviews = num(kpi[0]?.pageviews);
  const bounced = num(bounce[0]?.bounced);
  const bounceTotal = num(bounce[0]?.total);
  const bounceRate = bounceTotal ? Math.round((bounced / bounceTotal) * 100) : 0;
  const totalUsers = num(activation[0]?.total);
  const activatedUsers = num(activation[0]?.activated);
  const activationRate = totalUsers ? Math.round((activatedUsers / totalUsers) * 100) : 0;
  const signupsInRange = await prisma.user.count({
    where: { role: "USER", createdAt: { gte: since } },
  });

  // Merge visit-sources + signup-sources into one table.
  const bySource = new Map<string, { visitors: number; pageviews: number; signups: number; medium?: string | null }>();
  for (const r of visitSources)
    bySource.set(r.source, { visitors: num(r.visitors), pageviews: num(r.pageviews), signups: 0 });
  for (const r of signupSources) {
    const row = bySource.get(r.source) ?? { visitors: 0, pageviews: 0, signups: 0 };
    row.signups = num(r.signups);
    row.medium = r.medium;
    bySource.set(r.source, row);
  }
  const sources = [...bySource.entries()]
    .map(([source, v]) => ({ source, ...v }))
    .sort((a, b) => b.visitors - a.visitors || b.signups - a.signups);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          First-party visitor + signup data · last {DAYS} days (per-user table is all-time).
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <Kpi label="Unique visitors" value={visitors} />
        <Kpi label="Pageviews" value={pageviews} />
        <Kpi label="Signups" value={signupsInRange} sub={`${DAYS}d`} />
        <Kpi label="Activation" value={`${activationRate}%`} sub={`${activatedUsers}/${totalUsers} users did something`} />
        <Kpi label="Bounce rate" value={`${bounceRate}%`} sub="1-page visits" tone={bounceRate >= 70 ? "warn" : undefined} />
      </div>

      {/* Traffic sources — the diagnostic */}
      <section>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Where visitors come from
        </h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Source</th>
                <th className="px-4 py-2 text-right font-medium">Visitors</th>
                <th className="px-4 py-2 text-right font-medium">Pageviews</th>
                <th className="px-4 py-2 text-right font-medium">Signups</th>
                <th className="px-4 py-2 text-right font-medium">Signup rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sources.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    No visits recorded yet — data starts flowing as soon as this deploys.
                  </td>
                </tr>
              )}
              {sources.map((s) => {
                const rate = s.visitors ? Math.round((s.signups / s.visitors) * 100) : null;
                return (
                  <tr key={s.source}>
                    <td className="px-4 py-2.5">
                      <span className="font-medium">{s.source}</span>
                      {s.medium && s.medium !== "direct" && (
                        <span className="ml-2 rounded-full bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                          {s.medium}
                        </span>
                      )}
                      {s.medium === "cpc" && (
                        <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                          paid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">{s.visitors}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{s.pageviews}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{s.signups}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">
                      {rate == null ? "—" : `${rate}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent signups with source + what they did */}
      <section>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          Recent signups — source &amp; activity
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-secondary/50 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">User</th>
                <th className="px-4 py-2 font-medium">Source</th>
                <th className="px-4 py-2 text-right font-medium">Practice</th>
                <th className="px-4 py-2 text-right font-medium">Interviews</th>
                <th className="px-4 py-2 text-right font-medium">Lessons</th>
                <th className="px-4 py-2 text-right font-medium">Signed up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => {
                const did = num(u.attempts) + num(u.interviews) + num(u.lessons);
                return (
                  <tr key={u.email} className={did === 0 ? "text-muted-foreground" : ""}>
                    <td className="px-4 py-2.5">
                      <div className="font-medium text-foreground">{u.name ?? u.email.split("@")[0]}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      {u.source ?? <span className="text-muted-foreground">—</span>}
                      {u.medium === "cpc" && (
                        <span className="ml-1 rounded-full bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                          paid
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono">{num(u.attempts)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{num(u.interviews)}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{num(u.lessons)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs text-muted-foreground">
                      {new Date(u.signedUp).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Users who signed up before analytics shipped show source “—”. Rows dimmed = zero activity.
        </p>
      </section>

      {/* Top landing pages */}
      <section>
        <h2 className="mb-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">Top pages</h2>
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left font-mono text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-2 font-medium">Path</th>
                <th className="px-4 py-2 text-right font-medium">Visitors</th>
                <th className="px-4 py-2 text-right font-medium">Pageviews</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {landing.map((p) => (
                <tr key={p.path}>
                  <td className="px-4 py-2.5 font-mono text-xs">{p.path}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{num(p.visitors)}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-muted-foreground">{num(p.pageviews)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Kpi({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: number | string;
  sub?: string;
  tone?: "warn";
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone === "warn" ? "text-destructive" : "text-foreground"}`}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
