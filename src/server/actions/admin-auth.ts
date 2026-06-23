"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkAdminCredentials, adminSessionToken, ADMIN_COOKIE } from "@/lib/admin-auth";

/** Admin login: verify creds, set the signed admin cookie, go to /admin. */
export async function adminLogin(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!checkAdminCredentials(username, password)) {
    redirect("/admin?error=1");
  }
  cookies().set(ADMIN_COOKIE, adminSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  redirect("/admin");
}

/** Clear the admin session. */
export async function adminLogout() {
  cookies().delete(ADMIN_COOKIE);
  redirect("/admin");
}
