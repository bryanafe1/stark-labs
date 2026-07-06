import { NextResponse } from "next/server";
import { isAdminAuthed } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { getProblems } from "@/features/practice/problems";
import { problemUpsertData } from "@/lib/persist-problem";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Mirror the entire content catalog into the DB Problem table (upsert by slug).
// The catalog is the source of truth; this keeps the DB in sync so progress
// denominators (mastery %) are correct and every problem is FK-writable without
// waiting for someone to attempt it. Idempotent + re-runnable. Admin-only
// (guarded by the /admin cookie, so crawlers/prefetch can't trigger it).
async function sync() {
  const all = await getProblems();
  let upserted = 0;
  const failures: string[] = [];
  for (const p of all) {
    try {
      const data = problemUpsertData(p);
      await prisma.problem.upsert({ where: { slug: p.slug }, update: data, create: data });
      upserted++;
    } catch (err) {
      failures.push(p.slug);
      console.error("[sync-problems]", p.slug, err);
    }
  }
  const dbCount = await prisma.problem.count();
  return { catalog: all.length, upserted, failed: failures.length, failures: failures.slice(0, 20), dbCount };
}

export async function GET() {
  if (!isAdminAuthed()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await sync());
}

export const POST = GET;
