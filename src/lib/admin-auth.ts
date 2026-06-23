import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

// Standalone password gate for /admin, independent of the account (Google) auth.
// The cookie value is an HMAC signed with AUTH_SECRET and bound to the current
// password, so it can't be forged and changing the password invalidates old
// sessions. Credentials live in env, never in source.

export const ADMIN_COOKIE = "oc_admin";

const ADMIN_USER = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD ?? "";

// Returns "" when AUTH_SECRET is missing so the gate fails closed rather than
// signing tokens with a guessable default secret.
function expectedToken(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return "";
  return crypto.createHmac("sha256", secret).update(`admin-ok:${ADMIN_PASS}`).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

/** True if the submitted username + password match the configured admin creds. */
export function checkAdminCredentials(username: string, password: string): boolean {
  if (!ADMIN_PASS) return false; // gate disabled until a password is configured
  return safeEqual(username, ADMIN_USER) && safeEqual(password, ADMIN_PASS);
}

/** The signed cookie value to set after a successful login. */
export function adminSessionToken(): string {
  return expectedToken();
}

/** True if the current request carries a valid admin session cookie. */
export function isAdminAuthed(): boolean {
  if (!ADMIN_PASS) return false;
  const expected = expectedToken();
  if (!expected) return false; // no AUTH_SECRET → fail closed
  const c = cookies().get(ADMIN_COOKIE)?.value;
  return !!c && safeEqual(c, expected);
}
