import { getBusinessMetrics, getPayoutRows } from "@/lib/payouts";
import { PayoutsSection, type PayoutsNotice } from "@/components/admin/payouts-section";

export const dynamic = "force-dynamic";

const ERRORS: Record<string, string> = {
  notready: "That creator hasn't finished payout onboarding yet.",
  min: "Balance is below the payout minimum.",
  transfer: "The transfer failed — check the creator's Connect account in Stripe.",
  notfound: "Creator not found.",
  connect:
    "Stripe Connect isn't enabled on your account yet. Turn it on at dashboard.stripe.com/connect, then try again.",
};

export default async function AdminPayoutsPage({
  searchParams,
}: {
  searchParams: { link?: string; for?: string; paid?: string; onboarded?: string; error?: string };
}) {
  const [metrics, rows] = await Promise.all([getBusinessMetrics(), getPayoutRows()]);

  let notice: PayoutsNotice | undefined;
  if (searchParams.link) {
    notice = { kind: "link", msg: `Onboarding link for ${searchParams.for ?? "creator"}`, link: searchParams.link };
  } else if (searchParams.paid) {
    notice = { kind: "ok", msg: `Paid out ${searchParams.paid}.` };
  } else if (searchParams.onboarded) {
    notice = { kind: "ok", msg: "Onboarding step complete. Payout eligibility updates once Stripe confirms." };
  } else if (searchParams.error) {
    notice = { kind: "error", msg: ERRORS[searchParams.error] ?? "Something went wrong." };
  }

  return <PayoutsSection metrics={metrics} rows={rows} notice={notice} />;
}
