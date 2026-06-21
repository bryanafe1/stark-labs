import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Shared chrome for every authenticated product surface. Requires a real
 * session — signed-out visitors are redirected to sign in.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true, displayName: true, name: true, image: true },
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          displayName={user?.displayName ?? user?.name ?? "Engineer"}
          username={user?.username ?? "you"}
          image={user?.image ?? null}
        />
        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
