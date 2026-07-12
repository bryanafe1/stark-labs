"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail, APP_EMAIL_URL } from "@/lib/email";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour
const hashToken = (t: string) => crypto.createHash("sha256").update(t).digest("hex");

export type RequestResetState = { sent?: boolean; error?: string };
export type ResetState = { ok?: boolean; error?: string };

/** Step 1: email a reset link. Always reports success (never reveals whether an
 *  account or password exists) — only actually sends for real password accounts. */
export async function requestPasswordReset(
  _prev: RequestResetState,
  formData: FormData,
): Promise<RequestResetState> {
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  if (!email || !email.includes("@")) return { error: "Enter a valid email address." };

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });
  if (user?.passwordHash) {
    const raw = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }); // invalidate old links
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(raw),
        expiresAt: new Date(Date.now() + RESET_TTL_MS),
      },
    });
    const url = `${APP_EMAIL_URL}/reset-password?token=${raw}`;
    await sendPasswordResetEmail({ email }, url).catch(() => {});
  }
  return { sent: true };
}

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

/** Step 2: consume the token and set the new password (one-time use). */
export async function resetPassword(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const { token, password } = parsed.data;

  const row = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { id: true, userId: true, expiresAt: true },
  });
  if (!row || row.expiresAt < new Date()) {
    if (row) await prisma.passwordResetToken.delete({ where: { id: row.id } }).catch(() => {});
    return { error: "This reset link is invalid or has expired. Request a new one." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: row.userId }, data: { passwordHash } });
  await prisma.passwordResetToken.deleteMany({ where: { userId: row.userId } }); // one-time use
  return { ok: true };
}
