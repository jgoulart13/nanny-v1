// lib/config.ts
// The ONE place for brand-level values. Every page, email and agent file
// reads from here, so renaming the site is a one-file change.
//
// TODO(jonathan): replace the placeholders below with real values
// before the first production deploy (see CLAUDE.md, rule 6).

export const config = {
  /** Public brand name shown in the header, page titles and emails. */
  brand: "{{BRAND}}",

  /** Bare domain, no protocol, e.g. "example.com". */
  domain: "{{DOMAIN}}",

  /** Where new family briefs and agency applications are emailed. */
  operatorEmail: "{{OPERATOR_EMAIL}}",

  /** v1 is Boston only (see docs/04-prd-v1.md). */
  market: "Boston, MA",

  /** Bump this whenever /terms or /privacy change; stored on every brief. */
  termsVersion: "2026-11-08",
} as const;

/** Full site URL, e.g. "https://example.com". */
export const siteUrl = `https://${config.domain}`;

/** True while any placeholder is still in use. Later steps can warn on this. */
export const hasPlaceholders = Object.values(config).some(
  (v) => typeof v === "string" && v.startsWith("{{"),
);
