import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
//  Supabase client for the "Overclocker" project.
//  Data access goes through Prisma (see lib/prisma.ts); this client is for
//  Supabase-native features — Storage (avatars/images), Realtime, and (later)
//  Auth helpers. Uses the public anon/publishable key, safe for the browser.
// ---------------------------------------------------------------------------

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/** Browser-safe Supabase client (storage, realtime, auth). */
export function createSupabaseClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL / anon key in env.");
  }
  return createClient(url, anonKey);
}
