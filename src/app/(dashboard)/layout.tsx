import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { getDashboard } from "@/features/dashboard/get-dashboard";

/**
 * Shared chrome for every authenticated product surface (dashboard, arena,
 * learn, community…). The view-model is fetched once here for the topbar; child
 * pages fetch their own data.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getDashboard();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          displayName={user.displayName}
          username={user.username}
          image={user.image}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
