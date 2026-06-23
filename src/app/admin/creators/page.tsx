import { getCreatorsWithStats } from "@/features/admin/get-admin-extras";
import { CreatorsSection } from "@/components/admin/admin-sections";

export const dynamic = "force-dynamic";

export default async function AdminCreatorsPage() {
  const creators = await getCreatorsWithStats();
  const baseUrl = process.env.AUTH_URL ?? "https://overclocker.dev";
  return <CreatorsSection creators={creators} baseUrl={baseUrl} />;
}
