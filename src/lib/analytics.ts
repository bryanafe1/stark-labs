// First-party attribution helpers. Turn a landing request (query params +
// referrer) into a normalized traffic source/medium so the admin can see where
// visitors — and signups — actually come from. Paid ad clicks are the key
// signal: Google Ads stamps `gclid`, Meta stamps `fbclid`.

export interface Attribution {
  source: string; // google | direct | reddit | linkedin | bing | ...
  medium: string; // cpc | organic | social | referral | direct
  campaign?: string;
}

const SEARCH = [/(^|\.)google\./, /(^|\.)bing\./, /duckduckgo\./, /(^|\.)yahoo\./, /ecosia\./, /(^|\.)brave\./];
const SOCIAL: [RegExp, string][] = [
  [/reddit\./, "reddit"],
  [/(twitter\.|t\.co|(^|\.)x\.com)/, "x"],
  [/linkedin\.|lnkd\./, "linkedin"],
  [/facebook\.|fb\.|fb\.me/, "facebook"],
  [/instagram\./, "instagram"],
  [/youtube\.|youtu\.be/, "youtube"],
  [/tiktok\./, "tiktok"],
  [/discord\./, "discord"],
  [/news\.ycombinator|hn\./, "hackernews"],
  [/t\.me|telegram\./, "telegram"],
];

/** Normalize (query, referrer) → traffic source. Referrer should already be
 *  cleared when it's same-origin (internal navigation). */
export function deriveAttribution(params: URLSearchParams, referrer?: string | null): Attribution {
  const utmSource = params.get("utm_source");
  const utmMedium = params.get("utm_medium");
  const campaign = params.get("utm_campaign") ?? undefined;

  // Paid ad clicks — the single most important signal for judging ad spend.
  if (params.get("gclid") || params.get("gbraid") || params.get("wbraid")) {
    return { source: "google", medium: "cpc", campaign: campaign ?? utmSource ?? "google-ads" };
  }
  if (params.get("fbclid") || params.get("msclkid")) {
    return {
      source: params.get("msclkid") ? "bing" : "facebook",
      medium: "cpc",
      campaign: campaign ?? "paid",
    };
  }

  // Explicit UTM tags win next.
  if (utmSource) {
    return { source: utmSource.toLowerCase().slice(0, 40), medium: (utmMedium ?? "referral").toLowerCase().slice(0, 20), campaign };
  }

  // Fall back to the referrer.
  if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      if (SEARCH.some((re) => re.test(host))) {
        return { source: host.split(".")[0] ?? host, medium: "organic", campaign };
      }
      for (const [re, name] of SOCIAL) if (re.test(host)) return { source: name, medium: "social", campaign };
      return { source: host.slice(0, 60), medium: "referral", campaign };
    } catch {
      /* malformed referrer → direct */
    }
  }
  return { source: "direct", medium: "direct", campaign };
}

export function deviceFromUA(ua?: string | null): string {
  if (!ua) return "unknown";
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
}

export function isBot(ua?: string | null): boolean {
  if (!ua) return true; // no UA → almost always a bot/health check; don't count it
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|monitor|curl|wget|python-requests|axios/i.test(
    ua,
  );
}
