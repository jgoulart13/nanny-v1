// lib/config.ts
// The ONE place for brand-level values. Every page, email and agent file
// reads from here, so renaming the site is a one-file change.
//
// TODO(jonathan): operatorEmail is still a placeholder (CLAUDE.md, rule 6).
// It's only needed once emails are sent (briefs, "Email me this estimate").

export const config = {
  /** Public brand name shown in the header, page titles and emails. */
  brand: "Silly Goose",

  /** The site's main host, no protocol. The bare sillygooseboston.com redirects here (set in Vercel). */
  domain: "www.sillygooseboston.com",

  /** Where new family briefs and agency applications are emailed. */
  operatorEmail: "{{OPERATOR_EMAIL}}",

  /** v1 is Boston only (see docs/04-prd-v1.md). */
  market: "Boston, MA",

  /** Bump this whenever /terms or /privacy change; stored on every brief. */
  termsVersion: "2026-11-08",
} as const;

/**
 * The site's own full URL, used in the sitemap, robots.txt, llms.txt,
 * structured data, canonical links and API answers.
 *
 *   Production (Vercel, VERCEL_ENV=production): always https://<config.domain>,
 *     so search engines and AI assistants only ever see the real domain.
 *   Vercel preview deployments: that preview's own URL (VERCEL_URL).
 *   Local development: NEXT_PUBLIC_SITE_URL from .env.local (e.g.
 *     http://localhost:3000), else the real domain.
 */
export function resolveSiteUrl(
  env: Record<string, string | undefined>,
  domain: string = config.domain,
): string {
  const url =
    env.VERCEL_ENV === "production"
      ? `https://${domain}`
      : env.VERCEL_ENV === "preview" && env.VERCEL_URL
        ? `https://${env.VERCEL_URL}`
        : env.NEXT_PUBLIC_SITE_URL || `https://${domain}`;
  return url.replace(/\/$/, "");
}

export const siteUrl = resolveSiteUrl({
  VERCEL_ENV: process.env.VERCEL_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

/** True while any placeholder is still in use. Later steps can warn on this. */
export const hasPlaceholders = Object.values(config).some(
  (v) => typeof v === "string" && v.startsWith("{{"),
);
