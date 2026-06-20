import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Authenticated product surfaces shouldn't be indexed.
      disallow: ["/dashboard", "/arena", "/practice", "/learn", "/skills", "/quizzes", "/community", "/profile", "/settings", "/onboarding"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
