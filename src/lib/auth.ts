import "server-only";

/**
 * Auth shim. Returns the demo user until Auth.js is wired.
 *
 * Replace with a real session read, e.g.:
 *   import { auth } from "@/auth";
 *   const session = await auth();
 *   return session?.user?.id ?? null;
 */
export async function getCurrentUserId(): Promise<string | null> {
  return "demo-user";
}
