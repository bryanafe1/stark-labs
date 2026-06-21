import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Landing } from "@/components/marketing/landing";

// Public marketing entry. If you're already signed in, skip straight to the app.
export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  return <Landing />;
}
