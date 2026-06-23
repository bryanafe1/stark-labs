"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/auth";
import { linkCreatorByEmail } from "@/lib/creator-link";

export type AuthFormState = { error?: string };

const credsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const signUpSchema = z.object({
  name: z.string().trim().max(60).optional(),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

/** Email + password sign-in. */
export async function signInWithPassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = credsSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  try {
    // redirect:false so a bad password returns an error instead of throwing a
    // redirect we'd have to special-case; we redirect manually on success.
    await signIn("credentials", { ...parsed.data, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) return { error: "Invalid email or password." };
    throw err;
  }
  redirect("/dashboard");
}

/** Create an email + password account, then sign in. */
export async function signUpWithPassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };
  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) return { error: "An account with that email already exists. Try signing in." };

  // Unique username from the email local-part.
  const base = (email.split("@")[0] || "user").toLowerCase().replace(/[^a-z0-9]/g, "") || "user";
  let username = base;
  let i = 1;
  while (await prisma.user.findUnique({ where: { username } })) username = `${base}${i++}`;

  const passwordHash = await bcrypt.hash(password, 10);
  const createdUser = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username,
      name: name ?? null,
      displayName: name ?? username,
    },
  });
  await linkCreatorByEmail(createdUser.id, email);

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (err) {
    if (err instanceof AuthError) return { error: "Account created, but sign-in failed. Try signing in." };
    throw err;
  }
  redirect("/dashboard");
}
