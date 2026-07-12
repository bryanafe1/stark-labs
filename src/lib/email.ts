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
      replyTo: opts.replyTo,
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
      <div style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:700;color:#4f46e5;font-size:13px;letter-spacing:.04em;margin-bottom:20px;">OVERCLOCKER</div>
      <div style="font-size:18px;font-weight:600;color:#111111;margin-bottom:10px;">${opts.heading}</div>
      <div style="color:#333333;">${opts.body}</div>
      ${cta}
      <div style="margin-top:26px;padding-top:14px;border-top:1px solid #ececec;color:#9ca3af;font-size:12px;line-height:1.5;">${footer}</div>
    </div>
  </body></html>`;
}

export async function sendWelcomeEmail(user: { email: string; name?: string | null }): Promise<void> {
  const first = user.name?.trim().split(" ")[0] || "there";
  const html = emailLayout({
    heading: `Welcome, ${first} 👋`,
    body: `You're in. Overclocker is the fastest way to get interview-ready across engineering disciplines — deep, auto-graded practice plus an AI interviewer that talks through problems with you and scores you like a hiring manager.<br><br><strong>Your first mock interview is free</strong> — no card needed. It's the quickest way to see where you stand.`,
    cta: { label: "Start my free mock interview", href: `${APP_URL}/interview` },
    footerNote: `Prefer to warm up first? <a href="${APP_URL}/practice" style="color:#6366F1;text-decoration:none;">Try a practice question</a>.<br>You're receiving this because you signed up at overclocker.dev.`,
  });
  await sendEmail({
    to: user.email,
    subject: "Welcome to Overclocker — your free mock interview is ready",
    html,
    text: `Welcome, ${first}! Your first AI mock interview is free — start it at ${APP_URL}/interview`,
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
