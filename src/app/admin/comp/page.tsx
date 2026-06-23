import { getCompedUsers } from "@/features/admin/get-admin-extras";
import { CompSection } from "@/components/admin/admin-sections";

export const dynamic = "force-dynamic";

export default async function AdminCompPage() {
  const comped = await getCompedUsers();
  return <CompSection comped={comped} />;
}
