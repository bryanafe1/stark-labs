import type { Metadata } from "next";
import { LegalShell, H2, P, Bullets } from "@/components/legal/legal-shell";

export const metadata: Metadata = { title: "Terms of Service · Starklab" };

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="June 21, 2026">
      <P>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of Starklab
        (the &ldquo;Service&rdquo;), operated by Mark-1 Performance LLC (&ldquo;Starklab&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or using the Service, you agree
        to these Terms. If you do not agree, do not use the Service.
      </P>

      <H2>1. The Service</H2>
      <P>
        Starklab is an educational platform that provides engineering interview-preparation
        lessons, practice problems, progress tracking, and AI-assisted mock interviews. The Service
        is provided for personal, educational use. It is not professional engineering advice and
        does not provide certification, licensure, or any guarantee of employment or exam results.
      </P>

      <H2>2. Accounts</H2>
      <Bullets
        items={[
          "You must provide accurate information and keep your account credentials secure.",
          "You are responsible for all activity under your account.",
          "Accounts are for a single individual. You may not share, sell, or transfer your account.",
          "You must be at least 16 years old (or the age of digital consent in your jurisdiction) to use the Service.",
        ]}
      />

      <H2>3. Subscriptions, Billing &amp; Cancellation</H2>
      <Bullets
        items={[
          "A free tier provides limited content. Full access (“Pro”) requires a paid subscription, currently $20 per month.",
          "Payments are processed by Stripe. By subscribing, you authorize us to charge your payment method on a recurring monthly basis until you cancel.",
          "Your subscription renews automatically each month. You can cancel anytime from Settings → Billing (the Stripe customer portal); access continues until the end of the current billing period.",
          "Except where required by law, payments are non-refundable, including for partial billing periods.",
          "We may change pricing with reasonable advance notice; changes apply to subsequent billing periods.",
        ]}
      />

      <H2>4. Acceptable Use</H2>
      <P>You agree not to:</P>
      <Bullets
        items={[
          "Copy, scrape, redistribute, resell, or create derivative products from our lessons, problems, or solutions.",
          "Share your account or circumvent the paywall or access controls.",
          "Disrupt, attack, or attempt to gain unauthorized access to the Service or other users' data.",
          "Use the Service for any unlawful purpose or in violation of these Terms.",
        ]}
      />

      <H2>5. Intellectual Property</H2>
      <P>
        All lessons, problems, solutions, and other content provided through the Service are owned by
        Mark-1 Performance LLC or its licensors and are protected by intellectual-property laws. We
        grant you a limited, non-exclusive, non-transferable license to access and use the content
        for your personal study while your account is in good standing. You retain ownership of
        content you submit (such as your answers and mock-interview messages).
      </P>

      <H2>6. AI Features</H2>
      <P>
        The mock-interview feature uses third-party AI services (Anthropic) to generate responses.
        AI output may be inaccurate, incomplete, or inappropriate, and should be treated as practice
        material only — not as authoritative engineering, career, or professional advice. Do not
        submit confidential or sensitive personal information to the AI interviewer.
      </P>

      <H2>7. Disclaimers</H2>
      <P>
        The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties
        of any kind, express or implied, including merchantability, fitness for a particular purpose,
        and non-infringement. We do not warrant that the Service will be uninterrupted, error-free,
        or that content (including answer keys) is free of errors.
      </P>

      <H2>8. Limitation of Liability</H2>
      <P>
        To the maximum extent permitted by law, Mark-1 Performance LLC will not be liable for any
        indirect, incidental, special, consequential, or punitive damages, or any loss of profits,
        data, or goodwill, arising from your use of the Service. Our total liability for any claim
        relating to the Service will not exceed the amount you paid us in the twelve (12) months
        before the claim.
      </P>

      <H2>9. Termination</H2>
      <P>
        You may stop using the Service and delete your account at any time from Settings. We may
        suspend or terminate your access if you violate these Terms. You can permanently delete your
        account and associated data from Settings → Danger zone.
      </P>

      <H2>10. Changes to These Terms</H2>
      <P>
        We may update these Terms from time to time. Material changes will be reflected by updating
        the &ldquo;Last updated&rdquo; date above and, where appropriate, by notice within the
        Service. Your continued use after changes take effect constitutes acceptance.
      </P>

      <H2>11. Governing Law</H2>
      <P>
        These Terms are governed by the laws of the United States and the state in which Mark-1
        Performance LLC is organized, without regard to conflict-of-laws principles.
      </P>

      <H2>12. Contact</H2>
      <P>
        Questions about these Terms? Contact us at{" "}
        <a className="text-primary hover:underline" href="mailto:support@starklab.dev">
          support@starklab.dev
        </a>
        .
      </P>
    </LegalShell>
  );
}
