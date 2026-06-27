// QA harness for the subscription/billing system.
// Run: node --env-file=.env --env-file=.env.local scripts/qa-billing.mjs
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();
const WEBHOOK_URL = "http://localhost:3000/api/payments/webhook";
const RELAY_URL = "http://localhost:3000/api/simulation/relay-event";
const WH_SECRET = process.env.STRIPE_PAYMENTS_WEBHOOK_SECRET;
const RELAY_SECRET = process.env.RELAY_SECRET;

const PRICE = {
  std_m: process.env.STRIPE_STANDARD_MONTHLY_PRICE_ID,
  std_a: process.env.STRIPE_STANDARD_ANNUAL_PRICE_ID,
  pro_m: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  pro_a: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  voice: process.env.STRIPE_VOICE_SESSION_PRICE_ID,
};
const PRO_LIMIT = Number(process.env.PRO_MONTHLY_SESSION_LIMIT ?? 5);

const results = [];
function record(flow, ok, detail = "") {
  results.push({ flow, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${flow}${detail ? "  — " + detail : ""}`);
}
function assert(flow, cond, detail) {
  record(flow, !!cond, detail);
  return !!cond;
}

const rnd = () => Math.random().toString(36).slice(2, 10);
const createdUserIds = [];
const createdCustomerIds = [];
const createdSubIds = [];
const createdCreatorIds = [];

async function mkUser(extra = {}) {
  const id = `qa_${rnd()}`;
  const u = await prisma.user.create({
    data: {
      id,
      email: `qa+${rnd()}@test.local`,
      username: `qa_${rnd()}`,
      ...extra,
    },
  });
  createdUserIds.push(u.id);
  return u;
}

async function mkCustomer(userId, email) {
  const c = await stripe.customers.create({ email, metadata: { userId } });
  createdCustomerIds.push(c.id);
  const pm = await stripe.paymentMethods.attach("pm_card_visa", { customer: c.id });
  await stripe.customers.update(c.id, { invoice_settings: { default_payment_method: pm.id } });
  return c.id;
}

async function mkSubscription(customerId, priceId, userId, planTier, interval) {
  const sub = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    metadata: { userId, planTier, interval },
  });
  createdSubIds.push(sub.id);
  return sub;
}

async function post(url, payload, headers) {
  const res = await fetch(url, { method: "POST", headers, body: payload });
  return { status: res.status, text: await res.text() };
}

async function sendEvent(type, dataObject, idOverride) {
  const event = {
    id: idOverride ?? `evt_${rnd()}`,
    object: "event",
    api_version: "2024-06-20",
    created: Math.floor(Date.now() / 1000),
    type,
    data: { object: dataObject },
  };
  const payload = JSON.stringify(event);
  const sig = stripe.webhooks.generateTestHeaderString({ payload, secret: WH_SECRET });
  const r = await post(WEBHOOK_URL, payload, { "stripe-signature": sig, "content-type": "application/json" });
  return { ...r, eventId: event.id };
}

// ---- access-logic replicas (server-only modules can't be imported here) ----
const PAST_DUE_GRACE_MS = 3 * 86_400_000;
function startOfMonth() { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); }
function startOfNextMonth() { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 1); }

async function getAccess(uid) {
  const u = await prisma.user.findUnique({
    where: { id: uid },
    select: { role: true, comped: true, subscriptionStatus: true, planTier: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
  });
  if (!u) return { tier: "free", paid: false, pro: false, status: "none" };
  if (u.role === "ADMIN") return { tier: "pro", paid: true, pro: true, status: "admin" };
  const now = Date.now();
  const pe = u.currentPeriodEnd ?? null;
  const active = u.subscriptionStatus === "active" && !!pe && pe.getTime() > now;
  const pastDueOk = u.subscriptionStatus === "past_due" && !!pe && pe.getTime() > now - PAST_DUE_GRACE_MS;
  let tier = "free";
  if (active || pastDueOk) tier = u.planTier === "pro" ? "pro" : "standard";
  else if (u.comped) tier = "standard";
  const pro = (active || pastDueOk) && u.planTier === "pro";
  const paid = active || pastDueOk || u.comped;
  return { tier, paid, pro, comped: u.comped, status: u.subscriptionStatus };
}

async function canStartVoice(uid) {
  const access = await getAccess(uid);
  if (access.tier === "free") return { ok: false, reason: "free" };
  if (access.status === "admin") return { ok: true, via: "pro", remaining: 999 };
  if (access.pro) {
    const used = await prisma.interviewSession.count({ where: { userId: uid, createdAt: { gte: startOfMonth() }, refunded: false } });
    const remaining = Math.max(0, PRO_LIMIT - used);
    return remaining > 0 ? { ok: true, via: "pro", remaining } : { ok: false, reason: "pro_exhausted" };
  }
  const now = new Date();
  const credit = await prisma.sessionCredit.findFirst({ where: { userId: uid, status: "available", expiresAt: { gt: now } }, orderBy: { expiresAt: "asc" }, select: { id: true } });
  if (!credit) return { ok: false, reason: "need_credits" };
  const remaining = await prisma.sessionCredit.count({ where: { userId: uid, status: "available", expiresAt: { gt: now } } });
  return { ok: true, via: "credit", creditId: credit.id, remaining };
}

function checkoutCompletedSub(customerId, subId) {
  return { id: `cs_${rnd()}`, object: "checkout.session", mode: "subscription", customer: customerId, subscription: subId };
}

// =====================================================================
async function run() {
  console.log("=== Billing QA harness ===\n");

  // Flow 1 & 2: standard monthly / annual via checkout.session.completed
  for (const [label, priceKey, interval] of [["1 std-monthly", "std_m", "monthly"], ["2 std-annual", "std_a", "annual"]]) {
    const u = await mkUser();
    const cust = await mkCustomer(u.id, u.email);
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust } });
    const sub = await mkSubscription(cust, PRICE[priceKey], u.id, "standard", interval);
    const r = await sendEvent("checkout.session.completed", checkoutCompletedSub(cust, sub.id));
    const du = await prisma.user.findUnique({ where: { id: u.id } });
    const acc = await getAccess(u.id);
    assert(`Flow ${label}`,
      r.status === 200 && du.subscriptionStatus === "active" && du.planTier === "standard" &&
      du.billingInterval === interval && du.currentPeriodEnd > new Date() && acc.paid === true && acc.pro === false,
      `status=${du.subscriptionStatus} tier=${du.planTier} interval=${du.billingInterval} paid=${acc.paid} pro=${acc.pro}`);
  }

  // Flow 3: pro monthly / annual
  for (const [label, priceKey, interval] of [["3 pro-monthly", "pro_m", "monthly"], ["3 pro-annual", "pro_a", "annual"]]) {
    const u = await mkUser();
    const cust = await mkCustomer(u.id, u.email);
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust } });
    const sub = await mkSubscription(cust, PRICE[priceKey], u.id, "pro", interval);
    const r = await sendEvent("checkout.session.completed", checkoutCompletedSub(cust, sub.id));
    const du = await prisma.user.findUnique({ where: { id: u.id } });
    const acc = await getAccess(u.id);
    assert(`Flow ${label}`,
      r.status === 200 && du.planTier === "pro" && du.billingInterval === interval && acc.pro === true,
      `tier=${du.planTier} interval=${du.billingInterval} pro=${acc.pro}`);
  }

  // Flow 4: standard -> pro -> standard via customer.subscription.updated
  {
    const u = await mkUser();
    const cust = await mkCustomer(u.id, u.email);
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust } });
    const sub = await mkSubscription(cust, PRICE.std_m, u.id, "standard", "monthly");
    await sendEvent("checkout.session.completed", checkoutCompletedSub(cust, sub.id));
    // switch to pro
    const updated = await stripe.subscriptions.update(sub.id, {
      items: [{ id: sub.items.data[0].id, price: PRICE.pro_m }],
      proration_behavior: "none",
      metadata: { userId: u.id, planTier: "pro", interval: "monthly" },
    });
    await sendEvent("customer.subscription.updated", updated);
    let du = await prisma.user.findUnique({ where: { id: u.id } });
    const fwd = du.planTier === "pro";
    // switch back to standard
    const reverted = await stripe.subscriptions.update(sub.id, {
      items: [{ id: updated.items.data[0].id, price: PRICE.std_m }],
      proration_behavior: "none",
      metadata: { userId: u.id, planTier: "standard", interval: "monthly" },
    });
    await sendEvent("customer.subscription.updated", reverted);
    du = await prisma.user.findUnique({ where: { id: u.id } });
    assert("Flow 4 switch std<->pro", fwd && du.planTier === "standard", `fwd-to-pro=${fwd} back-to-standard=${du.planTier === "standard"}`);
  }

  // Flow 5: cancel
  {
    const u = await mkUser();
    const cust = await mkCustomer(u.id, u.email);
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust } });
    const sub = await mkSubscription(cust, PRICE.std_m, u.id, "standard", "monthly");
    await sendEvent("checkout.session.completed", checkoutCompletedSub(cust, sub.id));
    const before = await prisma.user.findUnique({ where: { id: u.id } });
    const deleted = await stripe.subscriptions.cancel(sub.id);
    await sendEvent("customer.subscription.deleted", deleted);
    const du = await prisma.user.findUnique({ where: { id: u.id } });
    const acc = await getAccess(u.id);
    assert("Flow 5 cancel",
      du.subscriptionStatus === "canceled" && du.currentPeriodEnd != null && acc.paid === false,
      `status=${du.subscriptionStatus} periodEndRetained=${du.currentPeriodEnd != null} paid=${acc.paid}`);
  }

  // Flow 6: payment_failed -> past_due, access continues in grace
  {
    const u = await mkUser();
    const cust = await mkCustomer(u.id, u.email);
    // set period end in the near future (within grace)
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust, subscriptionStatus: "active", planTier: "pro", billingInterval: "monthly", currentPeriodEnd: new Date(Date.now() + 2 * 86400000) } });
    await sendEvent("invoice.payment_failed", { id: `in_${rnd()}`, object: "invoice", customer: cust });
    const du = await prisma.user.findUnique({ where: { id: u.id } });
    const acc = await getAccess(u.id);
    assert("Flow 6 payment_failed grace",
      du.subscriptionStatus === "past_due" && acc.pro === true && acc.paid === true,
      `status=${du.subscriptionStatus} pro=${acc.pro} paid=${acc.paid}`);
  }

  // Flow 7: invoice.payment_succeeded renewal refreshes currentPeriodEnd
  {
    const u = await mkUser();
    const cust = await mkCustomer(u.id, u.email);
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust } });
    const sub = await mkSubscription(cust, PRICE.std_m, u.id, "standard", "monthly");
    await sendEvent("checkout.session.completed", checkoutCompletedSub(cust, sub.id));
    // stale the period end
    await prisma.user.update({ where: { id: u.id }, data: { currentPeriodEnd: new Date(Date.now() - 86400000) } });
    await sendEvent("invoice.payment_succeeded", { id: `in_${rnd()}`, object: "invoice", customer: cust, subscription: sub.id, billing_reason: "subscription_cycle", amount_paid: 2000 });
    const du = await prisma.user.findUnique({ where: { id: u.id } });
    assert("Flow 7 renewal refresh", du.currentPeriodEnd > new Date(), `periodEnd=${du.currentPeriodEnd?.toISOString()}`);
  }

  // Flow 8: voice session purchase + idempotency
  {
    const u = await mkUser({ comped: true });
    const pi = `pi_${rnd()}`;
    await sendEvent("checkout.session.completed", {
      id: `cs_${rnd()}`, object: "checkout.session", mode: "payment",
      payment_intent: pi, metadata: { type: "voice_session", userId: u.id },
    });
    let credits = await prisma.sessionCredit.findMany({ where: { userId: u.id } });
    const minted = credits.length === 1 && credits[0].status === "available" && credits[0].stripeRef === pi;
    const expDays = credits[0] ? Math.round((credits[0].expiresAt - Date.now()) / 86400000) : 0;
    // idempotency: same pi via payment_intent.succeeded
    await sendEvent("payment_intent.succeeded", { id: pi, object: "payment_intent", metadata: { type: "voice_session", userId: u.id } });
    credits = await prisma.sessionCredit.findMany({ where: { userId: u.id } });
    assert("Flow 8 voice purchase + idempotency",
      minted && expDays >= 88 && expDays <= 92 && credits.length === 1,
      `minted=${minted} expDays=${expDays} afterDup=${credits.length}`);
  }

  // Flow 9: credit consumption
  {
    const u = await mkUser({ comped: true });
    await prisma.sessionCredit.create({ data: { userId: u.id, stripeRef: `pi_${rnd()}`, status: "available", expiresAt: new Date(Date.now() + 90 * 86400000) } });
    const c1 = await canStartVoice(u.id);
    const okCredit = c1.ok && c1.via === "credit";
    if (okCredit) await prisma.sessionCredit.update({ where: { id: c1.creditId }, data: { status: "used", usedAt: new Date() } });
    const c2 = await canStartVoice(u.id);
    assert("Flow 9 credit consume",
      okCredit && !c2.ok && c2.reason === "need_credits",
      `first=${JSON.stringify(c1)} afterUse=${JSON.stringify(c2)}`);
  }

  // Flow 10: pro monthly limit
  {
    const u = await mkUser();
    const cust = await mkCustomer(u.id, u.email);
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust, subscriptionStatus: "active", planTier: "pro", billingInterval: "monthly", currentPeriodEnd: new Date(Date.now() + 20 * 86400000) } });
    const cBefore = await canStartVoice(u.id);
    const okBefore = cBefore.ok && cBefore.via === "pro" && cBefore.remaining === PRO_LIMIT;
    // create PRO_LIMIT sessions this month
    for (let i = 0; i < PRO_LIMIT; i++) {
      await prisma.interviewSession.create({ data: { userId: u.id, discipline: "MECHANICAL", topic: "t", relayToken: `rt_${rnd()}`, refunded: false } });
    }
    const cAfter = await canStartVoice(u.id);
    assert("Flow 10 pro limit",
      okBefore && !cAfter.ok && cAfter.reason === "pro_exhausted",
      `before=${JSON.stringify(cBefore)} after=${JSON.stringify(cAfter)}`);
  }

  // Flow 11: early-fail refund via relay-event
  {
    const u = await mkUser({ comped: true });
    const credit = await prisma.sessionCredit.create({ data: { userId: u.id, stripeRef: `pi_${rnd()}`, status: "used", usedAt: new Date(), expiresAt: new Date(Date.now() + 90 * 86400000) } });
    const sess = await prisma.interviewSession.create({ data: { userId: u.id, discipline: "MECHANICAL", topic: "t", relayToken: `rt_${rnd()}`, creditId: credit.id, status: "active" } });
    const r = await post(RELAY_URL, JSON.stringify({ event: "session_ended", sessionId: sess.id, duration_seconds: 5 }),
      { "x-relay-secret": RELAY_SECRET, "content-type": "application/json" });
    const dc = await prisma.sessionCredit.findUnique({ where: { id: credit.id } });
    const ds = await prisma.interviewSession.findUnique({ where: { id: sess.id } });
    assert("Flow 11 early-fail refund",
      r.status === 200 && dc.status === "available" && dc.usedSessionId === null && ds.refunded === true,
      `creditStatus=${dc.status} sessionRefunded=${ds.refunded}`);
  }

  // Flow 12: creator commission
  {
    const creator = await prisma.creator.create({ data: { name: `QA ${rnd()}`, code: `QA${rnd().toUpperCase()}`, commissionPercent: 20 } });
    createdCreatorIds.push(creator.id);
    const u = await mkUser({ referredByCreatorId: creator.id });
    const cust = await mkCustomer(u.id, u.email);
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust } });
    const inv1 = `in_${rnd()}`, inv2 = `in_${rnd()}`, inv3 = `in_${rnd()}`;
    await sendEvent("invoice.payment_succeeded", { id: inv1, object: "invoice", customer: cust, billing_reason: "subscription_create", amount_paid: 2000 });
    await sendEvent("invoice.payment_succeeded", { id: inv2, object: "invoice", customer: cust, billing_reason: "subscription_cycle", amount_paid: 2000 });
    await sendEvent("invoice.payment_succeeded", { id: inv3, object: "invoice", customer: cust, billing_reason: "subscription_update", amount_paid: 500 });
    // duplicate event id (reuse create event's id)
    const dupEvt = `evt_dup_${rnd()}`;
    await sendEvent("invoice.payment_succeeded", { id: `in_${rnd()}`, object: "invoice", customer: cust, billing_reason: "subscription_cycle", amount_paid: 2000 }, dupEvt);
    await sendEvent("invoice.payment_succeeded", { id: `in_${rnd()}`, object: "invoice", customer: cust, billing_reason: "subscription_cycle", amount_paid: 2000 }, dupEvt);
    const earnings = await prisma.creatorEarning.findMany({ where: { creatorId: creator.id }, orderBy: { createdAt: "asc" } });
    const created = earnings.find((e) => e.description === "First subscription payment");
    const commissionOk = created && created.commissionCents === 400;
    const noProration = !earnings.some((e) => e.grossCents === 500);
    // expected: create(1) + cycle(1) + the dup pair counts once = 3 total
    assert("Flow 12 creator commission",
      earnings.length === 3 && commissionOk && noProration,
      `count=${earnings.length} (expect 3) commission=${created?.commissionCents} noProration=${noProration}`);
  }

  // Flow 13: refund reversal
  {
    // 13a: commission reversal via invoice
    const creator = await prisma.creator.create({ data: { name: `QA ${rnd()}`, code: `QA${rnd().toUpperCase()}`, commissionPercent: 15 } });
    createdCreatorIds.push(creator.id);
    const u = await mkUser({ referredByCreatorId: creator.id });
    const cust = await mkCustomer(u.id, u.email);
    await prisma.user.update({ where: { id: u.id }, data: { stripeCustomerId: cust } });
    const inv = `in_${rnd()}`;
    await sendEvent("invoice.payment_succeeded", { id: inv, object: "invoice", customer: cust, billing_reason: "subscription_create", amount_paid: 4000 });
    await sendEvent("charge.refunded", { id: `ch_${rnd()}`, object: "charge", invoice: inv, payment_intent: `pi_${rnd()}` });
    const earning = await prisma.creatorEarning.findFirst({ where: { invoiceId: inv } });
    const reversedOk = earning && earning.reversed === true;
    // 13b: voice credit refund via payment_intent
    const u2 = await mkUser({ comped: true });
    const pi = `pi_${rnd()}`;
    const credit = await prisma.sessionCredit.create({ data: { userId: u2.id, stripeRef: pi, status: "available", expiresAt: new Date(Date.now() + 90 * 86400000) } });
    await sendEvent("charge.refunded", { id: `ch_${rnd()}`, object: "charge", payment_intent: pi });
    const dc = await prisma.sessionCredit.findUnique({ where: { id: credit.id } });
    assert("Flow 13 refund reversal",
      reversedOk && dc.status === "refunded",
      `commissionReversed=${reversedOk} creditRefunded=${dc.status === "refunded"}`);
  }

  // Flow 14: payouts math
  {
    const creator = await prisma.creator.create({ data: { name: `QA ${rnd()}`, code: `QA${rnd().toUpperCase()}`, commissionPercent: 20 } });
    createdCreatorIds.push(creator.id);
    const u = await mkUser({ referredByCreatorId: creator.id });
    await prisma.creatorEarning.create({ data: { creatorId: creator.id, userId: u.id, stripeEventId: `evt_${rnd()}`, grossCents: 10000, commissionCents: 2000, reversed: false } });
    await prisma.creatorEarning.create({ data: { creatorId: creator.id, userId: u.id, stripeEventId: `evt_${rnd()}`, grossCents: 5000, commissionCents: 1000, reversed: true } });
    await prisma.creatorPayout.create({ data: { creatorId: creator.id, amountCents: 500, status: "paid" } });
    // replicate getCreatorOwedCents math
    const [earned, paid] = await Promise.all([
      prisma.creatorEarning.aggregate({ where: { creatorId: creator.id, reversed: false }, _sum: { commissionCents: true } }),
      prisma.creatorPayout.aggregate({ where: { creatorId: creator.id, status: { in: ["pending", "paid"] } }, _sum: { amountCents: true } }),
    ]);
    const owed = (earned._sum.commissionCents ?? 0) - (paid._sum.amountCents ?? 0);
    assert("Flow 14 payouts math", owed === 1500, `owed=${owed} (expect 1500: 2000 unreversed - 500 paid)`);
  }

  // Flow 15: admin unlimited voice
  {
    const u = await mkUser({ role: "ADMIN" });
    const c = await canStartVoice(u.id);
    assert("Flow 15 admin unlimited", c.ok && c.via === "pro" && c.remaining === 999, JSON.stringify(c));
  }

  // Switch-plan / portal proof
  {
    const u = await mkUser();
    const cust = await mkCustomer(u.id, u.email);
    let ok = false, detail = "";
    try {
      const cfgs = await stripe.billingPortal.configurations.list({ limit: 10 });
      const good = cfgs.data.find((c) => c.active && (c.features.subscription_update?.products || []).length >= 2);
      const params = { customer: cust, return_url: "http://localhost:3000/settings" };
      if (good) params.configuration = good.id;
      const s = await stripe.billingPortal.sessions.create(params);
      ok = !!s.url;
      detail = `url=${ok} usedConfigWithProducts=${!!good}`;
    } catch (e) { detail = `ERR ${e.message}`; }
    assert("Switch-plan portal session", ok, detail);
  }

  // ---- cleanup ----
  console.log("\n=== cleanup ===");
  await prisma.creatorEarning.deleteMany({ where: { creatorId: { in: createdCreatorIds } } });
  await prisma.creatorPayout.deleteMany({ where: { creatorId: { in: createdCreatorIds } } });
  await prisma.sessionCredit.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.interviewSession.deleteMany({ where: { userId: { in: createdUserIds } } });
  await prisma.user.updateMany({ where: { id: { in: createdUserIds } }, data: { referredByCreatorId: null } });
  await prisma.creator.deleteMany({ where: { id: { in: createdCreatorIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  for (const sid of createdSubIds) { try { await stripe.subscriptions.cancel(sid); } catch {} }
  for (const cid of createdCustomerIds) { try { await stripe.customers.del(cid); } catch {} }

  const passed = results.filter((r) => r.ok).length;
  console.log(`\n=== ${passed}/${results.length} passed ===`);
  await prisma.$disconnect();
  process.exit(results.every((r) => r.ok) ? 0 : 1);
}

run().catch(async (e) => { console.error("HARNESS CRASH", e); await prisma.$disconnect(); process.exit(2); });
