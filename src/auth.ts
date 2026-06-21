import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { AdapterUser } from "next-auth/adapters";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
//  Auth.js (NextAuth v5) — Google OAuth + email/password (Credentials).
//  Credentials requires JWT sessions; the Prisma adapter still persists users
//  and links OAuth accounts. Our User model requires a unique `username`, so we
//  generate one from the email on first OAuth sign-in.
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
  session: { strategy: "jwt" },
  pages: { signIn: "/sign-in" },
  providers: [
    Google,
    Credentials({
      credentials: { email: {}, password: {} },
      authorize: async (creds) => {
        const email = String(creds?.email ?? "").toLowerCase().trim();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null; // OAuth-only or no such user

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.displayName ?? user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
});
