import { getSalesInfo } from "@/features/admin/get-admin-extras";
import { SalesSection } from "@/components/admin/admin-sections";

export const dynamic = "force-dynamic";

export default async function AdminSalesPage() {
  const sales = await getSalesInfo();
  return <SalesSection sales={sales} />;
}
