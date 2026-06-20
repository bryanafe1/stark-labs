import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

// Body / narrative type.
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// Data type — numbers, formulas, units, inputs (mimics a code editor).
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Stark — Engineer your edge",
    template: "%s · Stark",
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
    title: "Stark — Engineer your edge",
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
      </body>
    </html>
  );
}
