import "server-only";
import crypto from "crypto";

// One-click unsubscribe tokens for broadcast/marketing email. HMAC of the user
// id — stateless, no table needed, and can't be forged without the secret.
const SECRET = process.env.AUTH_SECRET ?? process.env.RELAY_SECRET ?? "overclocker-unsub-fallback";

export function unsubToken(userId: string): string {
  return crypto.createHmac("sha256", SECRET).update(`unsub:${userId}`).digest("hex").slice(0, 32);
}

export function verifyUnsub(userId: string, token: string): boolean {
  const expected = unsubToken(userId);
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}
