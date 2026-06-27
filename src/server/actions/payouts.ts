"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { isAdminAuthed } from "@/lib/admin-auth";
import { getCreatorOwedCents, PAYOUT_MINIMUM_CENTS } from "@/lib/payouts";

async function requireAdmin() {
  if (!isAdminAuthed()) throw new Error("Not authorized");
}

function baseUrl(): string {
  if (process.env.AUTH_URL) return process.env.AUTH_URL;
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : "http://localhost:3000";
}

/**
 * Create (if needed) a Connect Express account for the creator and generate a
 * one-time onboarding link. The admin copies the link and sends it to the
 * creator to complete bank/identity. `account.updated` flips payoutsEnabled.
 */
export async function createConnectLink(formData: FormData) {
  await requireAdmin();
  const creatorId = String(formData.get("creatorId") ?? "");
  const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
  if (!creator) redirect("/admin/payouts?error=notfound");

  let accountId = creator.stripeConnectId;
  if (!accountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email: creator.email ?? undefined,
      metadata: { creatorId },
      capabilities: { transfers: { requested: true } },
    });
    accountId = account.id;
    await prisma.creator.update({ where: { id: creatorId }, data: { stripeConnectId: accountId } });
  }

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${baseUrl()}/admin/payouts`,
    return_url: `${baseUrl()}/admin/payouts?onboarded=1`,
    type: "account_onboarding",
  });
  redirect(`/admin/payouts?link=${encodeURIComponent(link.url)}&for=${encodeURIComponent(creator.name)}`);
}

/** Transfer the full owed balance to a creator's connected account. */
export async function payCreator(formData: FormData) {
  await requireAdmin();
  const creatorId = String(formData.get("creatorId") ?? "");
  const creator = await prisma.creator.findUnique({ where: { id: creatorId } });
  if (!creator?.stripeConnectId || !creator.payoutsEnabled) redirect("/admin/payouts?error=notready");

  const owed = await getCreatorOwedCents(creatorId);
  if (owed < PAYOUT_MINIMUM_CENTS) redirect("/admin/payouts?error=min");

  // Record the payout as pending FIRST so it counts against the owed balance
  // (guards against double-click double-pay), then attempt the transfer.
  const payout = await prisma.creatorPayout.create({
    data: { creatorId, amountCents: owed, status: "pending", note: "Manual payout" },
  });

  let ok = false;
  try {
    const transfer = await stripe.transfers.create({
      amount: owed,
      currency: "usd",
      destination: creator.stripeConnectId,
      metadata: { creatorId, payoutId: payout.id },
    });
    await prisma.creatorPayout.update({
      where: { id: payout.id },
      data: { status: "paid", stripeTransferId: transfer.id },
    });
    ok = true;
  } catch {
    await prisma.creatorPayout.update({ where: { id: payout.id }, data: { status: "failed" } });
  }

  revalidatePath("/admin/payouts");
  redirect(ok ? `/admin/payouts?paid=${encodeURIComponent(creator.name)}` : "/admin/payouts?error=transfer");
}
