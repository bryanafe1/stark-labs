import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AdapterUser } from "next-auth/adapters";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
//  Auth.js (NextAuth v5) — Google sign-in, database sessions via Prisma.
//  Our User model requires a unique `username` (no default), so we override
//  createUser to generate one from the email on first sign-in.
// ---------------------------------------------------------------------------

const adapter = PrismaAdapter(prisma);

adapter.createUser = async (user) => {
  const base =
    (user.email?.split("@")[0] || "user").toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
  let username = base;
  let i = 1;
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${base}${i++}`;
  }
  const created = await prisma.user.create({
    data: {
      email: user.email!,
      emailVerified: user.emailVerified ?? null,
      name: user.name ?? null,
      image: user.image ?? null,
      username,
      displayName: user.name ?? username,
    },
  });
  return created as unknown as AdapterUser;
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter,
  trustHost: true,
  providers: [Google],
  session: { strategy: "database" },
  pages: { signIn: "/sign-in" },
  callbacks: {
    session({ session, user }) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
});
