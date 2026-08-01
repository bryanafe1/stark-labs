"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type GateState = { error?: string };

/** Validate the Case Coach password; on success, set an access cookie and enter. */
export async function unlockCaseCoach(_prev: GateState, formData: FormData): Promise<GateState> {
  const password = String(formData.get("password") ?? "").trim();
  const key = process.env.CASE_COACH_KEY ?? "";
  if (!key) return { error: "Access isn't configured yet." };
  if (password !== key) return { error: "Incorrect password." };

  cookies().set("case_coach", key, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  redirect("/case-coach");
}
