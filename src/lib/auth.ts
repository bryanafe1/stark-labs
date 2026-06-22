import "server-only";
import { auth } from "@/auth";

/**
 * Current signed-in user id from the Auth.js session, or null if signed out.
 * No fallback — callers (gating, entitlements) must treat null as "no access".
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
