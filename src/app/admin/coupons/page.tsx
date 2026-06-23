import { getCoupons } from "@/features/admin/get-admin-extras";
import { CouponsSection } from "@/components/admin/admin-sections";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await getCoupons();
  return <CouponsSection coupons={coupons} />;
}
