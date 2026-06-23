import { getPricingInfo } from "@/features/admin/get-admin-extras";
import { PricingSection } from "@/components/admin/admin-sections";

export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const pricing = await getPricingInfo();
  return <PricingSection pricing={pricing} />;
}
