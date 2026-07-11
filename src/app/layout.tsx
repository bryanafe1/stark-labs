import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Suspense } from "react";
import { PageTracker } from "@/components/analytics/page-tracker";
import "katex/dist/katex.min.css";
import "./globals.css";

// Google Ads (gtag.js) tag id for conversion tracking.
const GOOGLE_ADS_ID = "AW-18285186111";

// Body / narrative type.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Data type — numbers, formulas, units, inputs (mimics a code editor).
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Overclocker",
    template: "%s · Overclocker",
  },
  description:
    "Gamified, multidisciplinary engineering interview prep across Mechanical, Aerospace, Electrical, Computer, Civil, Chemical, Mechatronics, Industrial, Biomedical, and Environmental engineering.",
  keywords: [
    "engineering interview prep",
    "mechanical",
    "electrical",
    "civil",
    "aerospace",
    "FEA",
    "CFD",
  ],
  openGraph: {
    title: "Overclocker",
    description:
      "Ranked sprints, interactive lessons, and an auto-graded problem bank for physical-engineering interviews.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        {/* Apply the saved theme before paint to avoid a flash of the wrong one. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('stark.theme')||'dark';var e=document.documentElement;e.dataset.theme=t;e.classList.toggle('dark',t==='dark');}catch(_){}})();",
          }}
        />
        {children}

        {/* First-party visitor analytics (traffic source, landing, bounce). */}
        <Suspense fallback={null}>
          <PageTracker />
        </Suspense>

        {/* Google Ads (gtag.js) — a single site-wide tag loaded via next/script
            (the App Router equivalent of pasting the tag on every page; Google's
            own @next/third-parties library uses this same afterInteractive load). */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_ADS_ID}');`}
        </Script>
      </body>
    </html>
  );
}
