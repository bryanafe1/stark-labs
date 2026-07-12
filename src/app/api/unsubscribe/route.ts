import { prisma } from "@/lib/prisma";
import { verifyUnsub } from "@/lib/unsubscribe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function page(title: string, message: string): Response {
  return new Response(
    `<!doctype html><html><head><meta name="viewport" content="width=device-width"><title>${title}</title></head>
     <body style="margin:0;background:#0E0E11;color:#E8E8EA;font-family:-apple-system,'Segoe UI',Roboto,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;">
       <div style="max-width:420px;text-align:center;padding:32px;">
         <div style="font-family:ui-monospace,Menlo,monospace;font-weight:700;color:#6366F1;letter-spacing:.03em;">OVERCLOCKER</div>
         <h1 style="font-size:20px;margin:18px 0 8px;">${title}</h1>
         <p style="color:#9898A6;font-size:15px;line-height:1.6;">${message}</p>
         <a href="https://overclocker.dev" style="display:inline-block;margin-top:18px;color:#6366F1;text-decoration:none;">← Back to Overclocker</a>
       </div>
     </body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

async function optOut(req: Request): Promise<boolean> {
  const url = new URL(req.url);
  const userId = url.searchParams.get("u") ?? "";
  const token = url.searchParams.get("t") ?? "";
  if (!userId || !token || !verifyUnsub(userId, token)) return false;
  await prisma.user.update({ where: { id: userId }, data: { emailOptOut: true } }).catch(() => {});
  return true;
}

// One-click unsubscribe from broadcast email. Transactional email (welcome,
// password reset) is unaffected. GET shows a confirmation page (link click);
// POST supports RFC 8058 one-click unsubscribe from the mail client's header.
export async function GET(req: Request) {
  const ok = await optOut(req);
  return ok
    ? page(
        "You're unsubscribed",
        "You won't receive any more marketing emails from Overclocker. Account emails (like password resets) will still be sent.",
      )
    : page("Invalid link", "This unsubscribe link is invalid or has expired.");
}

export async function POST(req: Request) {
  await optOut(req);
  return new Response(null, { status: 204 });
}
