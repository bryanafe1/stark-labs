import type { Metadata } from "next";
import { isAdminAuthed } from "@/lib/admin-auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminLogin } from "@/components/admin/admin-login";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Single gate for every /admin/* route. Not signed in → show the login.
  if (!isAdminAuthed()) return <AdminLogin />;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar hugs the left; content fills the remaining width (no centered
          max-width, which was wasting the left margin and squeezing the form). */}
      <div className="flex flex-col md:flex-row">
        <AdminNav />
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-10">
          <div className="w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
