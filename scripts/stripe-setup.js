// scripts/stripe-setup.js
// Run with:  node scripts/stripe-setup.js            (test key)
//            node scripts/stripe-setup.js --confirm-live   (live key — guarded)
// Requires STRIPE_SECRET_KEY in environment (or .env).
//
// Idempotent: re-running does NOT create duplicate products — it reuses any
// product whose name already exists and fetches its prices.

try {
  require("dotenv").config();
} catch {
  /* dotenv optional — env can be provided inline */
}

const Stripe = require("stripe");
const fs = require("fs");
const path = require("path");

const KEY = process.env.STRIPE_SECRET_KEY || "";
if (!KEY) {
  console.error("✗ STRIPE_SECRET_KEY is not set. Add it to .env or pass it inline.");
  process.exit(1);
}
// Safety: never run against a LIVE key by accident.
if (KEY.startsWith("sk_live_") && !process.argv.includes("--confirm-live")) {
  console.error(
    "✗ Refusing to run against a LIVE Stripe key without --confirm-live.\n" +
      "  Run with a test key first, or re-run with: node scripts/stripe-setup.js --confirm-live",
  );
  process.exit(1);
}

const stripe = new Stripe(KEY);

const CONFIG = {
  baseUrl: process.env.BASE_URL || "https://overclocker.dev",
  prices: {
    standard_monthly: { amount: 2000, interval: "month" }, // $20.00
    standard_annual: { amount: 19000, interval: "year" }, // $190.00
    pro_monthly: { amount: 4000, interval: "month" }, // $40.00
    pro_annual: { amount: 34900, interval: "year" }, // $349.00
    voice_session: { amount: 1200, interval: null }, // $12.00 one-time
  },
  webhook: {
    events: [
      "checkout.session.completed",
      "invoice.payment_succeeded",
      "invoice.payment_failed",
      "customer.subscription.updated",
      "customer.subscription.deleted",
      "payment_intent.succeeded",
      "charge.refunded",
      "account.updated",
      "transfer.created",
      "transfer.failed",
    ],
  },
};

async function main() {
  console.log(`Starting Stripe setup for Overclocker (${KEY.startsWith("sk_live_") ? "LIVE" : "TEST"})...\n`);

  const existingProducts = await stripe.products.list({ limit: 100 });
  const existingNames = existingProducts.data.map((p) => p.name);
  console.log(`Found ${existingProducts.data.length} existing products`);

  const ids = {};

  ids.standard = await createSubscriptionProduct({
    name: "Overclocker Standard",
    description: "Full platform access — all disciplines, Arena, AI tutor, readiness scores",
    existingNames,
    monthly: CONFIG.prices.standard_monthly,
    annual: CONFIG.prices.standard_annual,
    metadata: { tier: "standard" },
  });

  ids.pro = await createSubscriptionProduct({
    name: "Overclocker Pro",
    description: "Everything in Standard plus voice interview simulation (5 sessions/month)",
    existingNames,
    monthly: CONFIG.prices.pro_monthly,
    annual: CONFIG.prices.pro_annual,
    metadata: { tier: "pro" },
  });

  ids.voiceSession = await createOneTimeProduct({
    name: "Overclocker Voice Session",
    description: "One voice interview simulation session. Expires in 90 days.",
    price: CONFIG.prices.voice_session,
    existingNames,
    metadata: { type: "voice_session_credit" },
  });

  ids.webhook = await createWebhookEndpoint();
  await configureCustomerPortal(ids);
  writeEnvFile(ids);

  console.log("\n✓ Stripe setup complete");
  console.log("IDs written to .env.stripe");
  console.log("Merge .env.stripe into your env (and Vercel for production) before starting the app\n");
}

async function createSubscriptionProduct({ name, description, existingNames, monthly, annual, metadata }) {
  const result = {};
  if (existingNames.includes(name)) {
    console.log(`  ↳ Product "${name}" already exists — fetching existing prices`);
    const existing = await stripe.products.list({ limit: 100 });
    const product = existing.data.find((p) => p.name === name);
    result.product_id = product.id;
    const prices = await stripe.prices.list({ product: product.id, limit: 10 });
    for (const price of prices.data) {
      if (price.recurring?.interval === "month") result.monthly_price_id = price.id;
      if (price.recurring?.interval === "year") result.annual_price_id = price.id;
    }
  } else {
    console.log(`  Creating product: ${name}`);
    const product = await stripe.products.create({ name, description, metadata });
    result.product_id = product.id;
    console.log(`  ✓ Product created: ${product.id}`);
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: monthly.amount,
      currency: "usd",
      recurring: { interval: monthly.interval },
      nickname: `${name} Monthly`,
      metadata: { tier: metadata.tier, billing: "monthly" },
    });
    result.monthly_price_id = monthlyPrice.id;
    console.log(`  ✓ Monthly price: ${monthlyPrice.id} ($${monthly.amount / 100}/month)`);
    const annualPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: annual.amount,
      currency: "usd",
      recurring: { interval: annual.interval },
      nickname: `${name} Annual`,
      metadata: { tier: metadata.tier, billing: "annual" },
    });
    result.annual_price_id = annualPrice.id;
    console.log(`  ✓ Annual price: ${annualPrice.id} ($${annual.amount / 100}/year)`);
  }
  return result;
}

async function createOneTimeProduct({ name, description, price, existingNames, metadata }) {
  const result = {};
  if (existingNames.includes(name)) {
    console.log(`  ↳ Product "${name}" already exists — fetching existing price`);
    const existing = await stripe.products.list({ limit: 100 });
    const product = existing.data.find((p) => p.name === name);
    result.product_id = product.id;
    const prices = await stripe.prices.list({ product: product.id, limit: 10 });
    const activePrice = prices.data.find((p) => p.active && !p.recurring);
    if (activePrice) result.price_id = activePrice.id;
  } else {
    console.log(`\n  Creating product: ${name}`);
    const product = await stripe.products.create({ name, description, metadata });
    result.product_id = product.id;
    console.log(`  ✓ Product created: ${product.id}`);
    const oneTimePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: price.amount,
      currency: "usd",
      nickname: name,
      metadata,
    });
    result.price_id = oneTimePrice.id;
    console.log(`  ✓ One-time price: ${oneTimePrice.id} ($${price.amount / 100})`);
  }
  return result;
}

async function createWebhookEndpoint() {
  const webhookUrl = `${CONFIG.baseUrl}/api/payments/webhook`;
  const existingWebhooks = await stripe.webhookEndpoints.list({ limit: 20 });
  const existing = existingWebhooks.data.find((w) => w.url === webhookUrl);
  if (existing) {
    console.log(`\n  ↳ Webhook already exists for ${webhookUrl}`);
    console.log("  Note: existing webhook secret can't be retrieved — use existing STRIPE_WEBHOOK_SECRET");
    return { endpoint_id: existing.id, secret: null };
  }
  console.log(`\n  Creating webhook endpoint: ${webhookUrl}`);
  const webhook = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: CONFIG.webhook.events,
    description: "Overclocker main payment webhook",
  });
  console.log(`  ✓ Webhook created: ${webhook.id}`);
  console.log(`  ✓ Webhook secret: ${webhook.secret}`);
  console.log("  ⚠ Save this secret — it will not be shown again");
  return { endpoint_id: webhook.id, secret: webhook.secret };
}

async function configureCustomerPortal(ids) {
  console.log("\n  Configuring Customer Portal...");
  try {
    await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: "Overclocker — Manage your subscription",
        privacy_policy_url: `${CONFIG.baseUrl}/privacy`,
        terms_of_service_url: `${CONFIG.baseUrl}/terms`,
      },
      features: {
        subscription_cancel: {
          enabled: true,
          mode: "at_period_end",
          cancellation_reason: {
            enabled: true,
            options: ["too_expensive", "missing_features", "switched_service", "unused", "other"],
          },
        },
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price"],
          proration_behavior: "none",
          products: [
            {
              product: ids.standard.product_id,
              prices: [ids.standard.monthly_price_id, ids.standard.annual_price_id],
            },
            {
              product: ids.pro.product_id,
              prices: [ids.pro.monthly_price_id, ids.pro.annual_price_id],
            },
          ],
        },
        payment_method_update: { enabled: true },
        invoice_history: { enabled: true },
      },
    });
    console.log("  ✓ Customer Portal configured");
  } catch (err) {
    if (err.message?.includes("already exists")) {
      console.log("  ↳ Customer Portal configuration already exists");
    } else {
      console.error("  ✗ Customer Portal configuration failed:", err.message);
      console.log("  You may need to configure this manually in the Stripe dashboard");
    }
  }
}

function writeEnvFile(ids) {
  const envPath = path.join(process.cwd(), ".env.stripe");
  const lines = [
    "# Generated by scripts/stripe-setup.js",
    `# Run at: ${new Date().toISOString()}`,
    "# Merge these into your .env file (and Vercel env for production)",
    "",
    "# Standard subscription",
    `STRIPE_STANDARD_MONTHLY_PRICE_ID=${ids.standard.monthly_price_id}`,
    `STRIPE_STANDARD_ANNUAL_PRICE_ID=${ids.standard.annual_price_id}`,
    `STRIPE_STANDARD_PRODUCT_ID=${ids.standard.product_id}`,
    "",
    "# Pro subscription",
    `STRIPE_PRO_MONTHLY_PRICE_ID=${ids.pro.monthly_price_id}`,
    `STRIPE_PRO_ANNUAL_PRICE_ID=${ids.pro.annual_price_id}`,
    `STRIPE_PRO_PRODUCT_ID=${ids.pro.product_id}`,
    "",
    "# Voice session one-time payment",
    `STRIPE_VOICE_SESSION_PRICE_ID=${ids.voiceSession.price_id}`,
    `STRIPE_VOICE_SESSION_PRODUCT_ID=${ids.voiceSession.product_id}`,
    "",
    "# Webhook",
    `STRIPE_WEBHOOK_ENDPOINT_ID=${ids.webhook.endpoint_id}`,
    ids.webhook.secret
      ? `STRIPE_WEBHOOK_SECRET=${ids.webhook.secret}`
      : "# STRIPE_WEBHOOK_SECRET — use existing value, not regenerated",
    "",
    "# App config",
    "VOICE_SESSION_PRICE_CENTS=1200",
    "VOICE_SESSION_EXPIRY_DAYS=90",
    "PRO_MONTHLY_SESSION_LIMIT=5",
    "COMMISSION_RATE=0.20",
    "PAYOUT_MINIMUM_CENTS=2500",
  ];
  fs.writeFileSync(envPath, lines.join("\n"));
  console.log(`\n  ✓ Environment variables written to ${envPath}`);
}

main().catch((err) => {
  console.error("\n✗ Setup failed:", err.message);
  if (err.type === "StripeAuthenticationError") {
    console.error("  Check that STRIPE_SECRET_KEY is set correctly.");
  }
  process.exit(1);
});
