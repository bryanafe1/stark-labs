import "server-only";
import { auth } from "@/auth";

/**
 * Current signed-in user id from the Auth.js session.
 * TODO: drop the "demo-user" fallback once all routes are gated behind real
 * auth — for now it keeps the mock-data pages working for signed-out visitors.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}
