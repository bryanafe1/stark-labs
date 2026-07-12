"use server";

import { Prisma } from "@prisma/client";
import { isAdminAuthed } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { sendEmail, emailLayout, APP_EMAIL_URL } from "@/lib/email";
import { unsubToken } from "@/lib/unsubscribe";

export type Audience = "all" | "free" | "paid" | "inactive";

export interface BroadcastInput {
  subject: string;
  body: string; // plain text; newlines → <br>
  ctaLabel?: string;
  ctaUrl?: string;
  audience: Audience;
  testTo?: string; // if set, send ONE test email here instead of the audience
}

export interface BroadcastResult {
  ok: boolean;
  sent?: number;
  failed?: number;
  error?: string;
}

/** Recipient filter per audience. Always excludes non-users and opt-outs. */
function audienceWhere(a: Audience): Prisma.UserWhereInput {
  const base: Prisma.UserWhereInput = { role: "USER", emailOptOut: false };
  if (a === "free") return { ...base, planTier: null, comped: false };
  if (a === "paid") return { ...base, OR: [{ planTier: { not: null } }, { comped: true }] };
  if (a === "inactive")
    return {
      ...base,
      freeInterviewTurns: 0,
      freeConceptGrades: 0,
      submissions: { none: {} },
      interviewSessions: { none: {} },
      lessonProgress: { none: {} },
    };
  return base;
}

export async function audienceCount(a: Audience): Promise<number> {
  if (!(await isAdminAuthed())) return 0;
  return prisma.user.count({ where: audienceWhere(a) });
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendBroadcast(input: BroadcastInput): Promise<BroadcastResult> {
  if (!(await isAdminAuthed())) return { ok: false, error: "Not authorized." };

  const subject = (input.subject ?? "").trim().slice(0, 200);
  const body = (input.body ?? "").trim();
  if (!subject || !body) return { ok: false, error: "Subject and body are required." };
  if (input.ctaUrl && !/^https?:\/\//i.test(input.ctaUrl))
    return { ok: false, error: "The button link must start with http:// or https://" };

  const bodyHtml = escapeHtml(body).replace(/\n/g, "<br>");
  const cta = input.ctaLabel && input.ctaUrl ? { label: input.ctaLabel, href: input.ctaUrl } : undefined;

  // Test send — a single email to the admin, no unsubscribe footer.
  if (input.testTo) {
    const html = emailLayout({ heading: subject, body: bodyHtml, cta, footerNote: "Test send · Overclocker" });
    const ok = await sendEmail({ to: input.testTo.trim(), subject: `[TEST] ${subject}`, html, text: body });
    return { ok, sent: ok ? 1 : 0, failed: ok ? 0 : 1 };
  }

  const recipients = await prisma.user.findMany({
    where: audienceWhere(input.audience),
    select: { id: true, email: true },
  });
  if (recipients.length === 0) return { ok: true, sent: 0, failed: 0 };

  let sent = 0;
  let failed = 0;
  const CHUNK = 20; // gentle on rate limits
  for (let i = 0; i < recipients.length; i += CHUNK) {
    const batch = recipients.slice(i, i + CHUNK);
    const results = await Promise.all(
      batch.map((u) => {
        const unsub = `${APP_EMAIL_URL}/api/unsubscribe?u=${u.id}&t=${unsubToken(u.id)}`;
        const html = emailLayout({
          heading: subject,
          body: bodyHtml,
          cta,
          footerNote: `You're receiving this because you signed up at overclocker.dev.<br><a href="${unsub}" style="color:#a1a1aa;">Unsubscribe</a>`,
        });
        return sendEmail({
          to: u.email,
          subject,
          html,
          text: body,
          headers: {
            "List-Unsubscribe": `<${unsub}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        });
      }),
    );
    for (const ok of results) {
      if (ok) sent++;
      else failed++;
    }
  }
  return { ok: true, sent, failed };
}
