import type { Metadata } from "next";
import Link from "next/link";
import { LegalShell, H2, P, Bullets } from "@/components/legal/legal-shell";

export const metadata: Metadata = { title: "Privacy Policy · Overclocker" };

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="June 21, 2026">
      <P>
        This Privacy Policy explains how Overclocker, operated by Mark-1 Performance LLC
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;), collects, uses, and shares information when you use
        starklab.dev (the &ldquo;Service&rdquo;).
      </P>

      <H2>1. Information We Collect</H2>
      <Bullets
        items={[
          "Account information: your name, email address, and (if you sign in with Google) your Google profile name and image.",
          "Authentication data: credentials managed by our auth provider; if you use a password, we store only a salted hash — never the plain password.",
          "Usage data: your lessons viewed, problems attempted, answers submitted, scores, and progress.",
          "AI inputs: the messages you send to the mock-interview feature.",
          "Payment information: handled by Stripe. We receive your subscription status and a customer identifier — we never receive or store your full card number.",
          "Technical data: log data such as IP address, browser type, and timestamps, used for security and operations.",
        ]}
      />

      <H2>2. How We Use Information</H2>
      <Bullets
        items={[
          "To provide and operate the Service, including tracking your progress.",
          "To process subscriptions and payments.",
          "To secure the Service and prevent abuse.",
          "To communicate with you about your account or important changes.",
          "To improve our content and features.",
        ]}
      />

      <H2>3. How We Share Information (Service Providers)</H2>
      <P>
        We do not sell your personal information. We share data with service providers strictly to
        operate the Service:
      </P>
      <Bullets
        items={[
          "Google — sign-in / authentication.",
          "Stripe — payment processing and subscription management.",
          "Supabase — database and storage of your account and progress data.",
          "Vercel — application hosting and delivery.",
          "Anthropic — powers the AI mock interview; the messages you send to the interviewer are transmitted to Anthropic to generate responses.",
        ]}
      />
      <P>
        We may also disclose information if required by law or to protect our rights, users, or the
        public.
      </P>

      <H2>4. AI Feature Notice</H2>
      <P>
        When you use the mock interview, your messages are sent to Anthropic to generate replies.
        Please do not include confidential or sensitive personal information in those messages.
      </P>

      <H2>5. Cookies</H2>
      <P>
        We use essential cookies to keep you signed in and to operate the Service. We do not use
        them for third-party advertising.
      </P>

      <H2>6. Data Retention</H2>
      <P>
        We retain your information while your account is active. When you delete your account (from
        Settings → Danger zone), we delete your account and associated progress data. Some records
        may be retained as required for legal, tax, or accounting purposes (for example, payment
        records held by Stripe).
      </P>

      <H2>7. Your Rights</H2>
      <P>
        You can access and update your profile in Settings, and permanently delete your account and
        data at any time. Depending on where you live (e.g., the EU/UK or California), you may have
        additional rights to access, correct, delete, or port your data, or to object to certain
        processing. To exercise these rights, contact us at{" "}
        <a className="text-primary hover:underline" href="mailto:support@starklab.dev">
          support@starklab.dev
        </a>
        .
      </P>

      <H2>8. Security</H2>
      <P>
        We protect data with measures including encryption in transit and database row-level
        security. No method of transmission or storage is 100% secure, so we cannot guarantee
        absolute security.
      </P>

      <H2>9. Children</H2>
      <P>
        The Service is not directed to children under 16, and we do not knowingly collect personal
        information from them.
      </P>

      <H2>10. Changes to This Policy</H2>
      <P>
        We may update this Policy from time to time. Material changes will be reflected by updating
        the &ldquo;Last updated&rdquo; date above.
      </P>

      <H2>11. Contact</H2>
      <P>
        Questions? Contact us at{" "}
        <a className="text-primary hover:underline" href="mailto:support@starklab.dev">
          support@starklab.dev
        </a>
        . See also our{" "}
        <Link className="text-primary hover:underline" href="/terms">
          Terms of Service
        </Link>
        .
      </P>
    </LegalShell>
  );
}
