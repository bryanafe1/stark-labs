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

/** Branded, email-client-safe HTML shell (inline styles, light theme, indigo accent). */
function layout(opts: {
  heading: string;
  body: string;
  cta?: { label: string; href: string };
  footerNote?: string;
}): string {
  const cta = opts.cta
    ? `<tr><td style="padding:24px 32px 4px;">
         <a href="${opts.cta.href}" style="display:inline-block;background:#6366F1;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:10px;">${opts.cta.label}</a>
       </td></tr>`
    : "";
  const footer =
    opts.footerNote ??
    `You're receiving this because you signed up at <a href="${APP_URL}" style="color:#6366F1;text-decoration:none;">overclocker.dev</a>.`;
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width"></head>
  <body style="margin:0;background:#f4f4f5;font-family:-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#18181b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:14px;border:1px solid #e4e4e7;">
          <tr><td style="padding:28px 32px 0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-weight:700;letter-spacing:.03em;color:#6366F1;">OVERCLOCKER</td></tr>
          <tr><td style="padding:14px 32px 6px;"><h1 style="margin:0;font-size:20px;line-height:1.3;color:#18181b;">${opts.heading}</h1></td></tr>
          <tr><td style="padding:0 32px;font-size:15px;line-height:1.6;color:#3f3f46;">${opts.body}</td></tr>
          ${cta}
          <tr><td style="padding:24px 32px 28px;font-size:12px;line-height:1.5;color:#a1a1aa;">${footer}</td></tr>
        </table>
        <div style="max-width:480px;margin-top:14px;font-size:11px;color:#a1a1aa;">Overclocker · engineering interview prep</div>
      </td></tr>
    </table>
  </body></html>`;
}

export async function sendWelcomeEmail(user: { email: string; name?: string | null }): Promise<void> {
  const first = user.name?.trim().split(" ")[0] || "there";
  const html = layout({
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
  const html = layout({
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
