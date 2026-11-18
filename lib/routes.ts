// lib/routes.ts
// Every public, indexable page, in one list. The sitemap reads from here.
// Hidden on purpose (docs/04-prd-v1.md scope change, 2026-11-15):
//   /brief and /for-agencies: noindex, never linked, code kept for later.
//   /boston/nanny-cost and its /boston/nanny-cost/* stubs: on hold (step 02c),
//     noindex, unlinked. Content moves into /guides.
// Guides are added to the sitemap by app/sitemap.ts once they're not drafts.

export type PublicRoute = {
  path: string;
  /** How often the content is expected to change (sitemap hint). */
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** 0–1, how important this page is relative to the others (sitemap hint). */
  priority: number;
};

export const publicRoutes: PublicRoute[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/guides", changeFrequency: "weekly", priority: 1 },
  { path: "/estimate", changeFrequency: "monthly", priority: 0.9 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

/** Header navigation (step 02c): Guides · Estimate · FAQ · About. */
export const headerNav = [
  { href: "/guides", label: "Guides" },
  { href: "/estimate", label: "Estimate" },
  { href: "/faq", label: "FAQ" },
  { href: "/how-it-works", label: "About" },
];

/** CLAUDE.md rule 5: anything that mentions agencies links here. */
export const disclosureHref = "/how-it-works#how-we-get-paid";
