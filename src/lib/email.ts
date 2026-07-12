import "server-only";
import { Resend } from "resend";

// Transactional email via Resend. Fully gated on RESEND_API_KEY — with no key
// (or before the domain is verified) every send is a logged no-op, so this is
// safe to ship before email is configured. Sends never throw into the caller.

const FROM = process.env.EMAIL_FROM ?? "Overclocker <hello@overclocker.dev>";
const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://overclocker.dev").replace(/\/$/, "");

let client: Resend | null = null;
function resend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  headers?: Record<string, string>;
  replyTo?: string;
}): Promise<boolean> {
  const r = resend();
  if (!r) {
    console.warn(`[email] RESEND_API_KEY not set — skipping "${opts.subject}" to ${opts.to}`);
    return false;
  }
  try {
    const { error } = await r.emails.send({
      from: FROM,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: opts.replyTo ?? process.env.EMAIL_REPLY_TO,
      headers: opts.headers,
    });
    if (error) {
      console.error("[email] send failed", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send threw", err);
    return false;
  }
}

export const APP_EMAIL_URL = APP_URL;

/** Branded, email-client-safe HTML shell (inline styles, light theme, indigo accent). */
export function emailLayout(opts: {
  heading: string;
  body: string;
  cta?: { label: string; href: string };
  footerNote?: string;
  hideBrand?: boolean; // omit the wordmark for a pure personal-note look (best for Primary inbox)
}): string {
  // Plain, left-aligned, text-forward layout — reads like a personal note, not a
  // marketing campaign, so Gmail is far more likely to file it under Primary.
  const cta = opts.cta
    ? `<p style="margin:16px 0;"><a href="${opts.cta.href}" style="color:#4f46e5;font-weight:600;text-decoration:none;">${opts.cta.label} &rarr;</a></p>`
    : "";
  const footer =
    opts.footerNote ??
    `You're receiving this because you signed up at <a href="${APP_URL}" style="color:#71717a;text-decoration:underline;">overclocker.dev</a>.`;
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;padding:24px;background:#ffffff;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;font-size:15px;line-height:1.6;">
    <div style="max-width:520px;margin:0 auto;">
      ${opts.hideBrand ? "" : `<div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:700;color:#4f46e5;font-size:13px;letter-spacing:.04em;margin-bottom:20px;">OVERCLOCKER</div>`}
      ${opts.heading ? `<div style="font-size:18px;font-weight:600;color:#111111;margin-bottom:10px;">${opts.heading}</div>` : ""}
      <div style="color:#333333;">${opts.body}</div>
      ${cta}
      <div style="margin-top:26px;padding-top:14px;border-top:1px solid #ececec;color:#9ca3af;font-size:12px;line-height:1.5;">${footer}</div>
    </div>
  </body></html>`;
}

export async function sendWelcomeEmail(user: { email: string; name?: string | null }): Promise<void> {
  const first = user.name?.trim().split(" ")[0] || "there";
  // A plain, personal note from the founder — no logo, no button, one inline
  // link, and a reply invite. Reads like a 1:1 email, which lands in Primary.
  const html = emailLayout({
    heading: "",
    hideBrand: true,
    body: `Hey ${first},<br><br>Thanks for signing up — I'm Bryan, I built Overclocker.<br><br>Quickest way to get something out of it: try a mock interview. You talk through a real problem with an AI interviewer and get scored on how you did — your first one's on me.<br><br><a href="${APP_URL}/interview" style="color:#4f46e5;text-decoration:underline;">Start your mock interview</a><br><br>Anything confusing, or feedback? Just hit reply — it comes straight to me.<br><br>— Bryan`,
    footerNote: `You signed up at overclocker.dev.`,
  });
  await sendEmail({
    to: user.email,
    subject: "Thanks for joining Overclocker",
    html,
    text: `Hey ${first}, thanks for signing up — I'm Bryan, I built Overclocker. Try a mock interview (your first is on me): ${APP_URL}/interview. Reply anytime with questions. — Bryan`,
  });
}

export async function sendPasswordResetEmail(user: { email: string }, resetUrl: string): Promise<void> {
  const html = emailLayout({
    heading: "Reset your password",
    body: `We got a request to reset the password for your Overclocker account. Click below to set a new one — the link expires in 1 hour. If you didn't request this, you can safely ignore this email.`,
    cta: { label: "Reset my password", href: resetUrl },
    footerNote: `If the button doesn't work, paste this into your browser:<br><span style="color:#71717a;word-break:break-all;">${resetUrl}</span>`,
  });
  await sendEmail({
    to: user.email,
    subject: "Reset your Overclocker password",
    html,
    text: `Reset your Overclocker password (expires in 1 hour): ${resetUrl}`,
  });
}
