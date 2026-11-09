// lib/routes.ts
// Every public page from docs/04-prd-v1.md, in one list.
// The sitemap reads from here, so a new page only needs adding once.

export type PublicRoute = {
  path: string;
  /** How often the content is expected to change (sitemap hint). */
  changeFrequency: "weekly" | "monthly" | "yearly";
  /** 0–1, how important this page is relative to the others (sitemap hint). */
  priority: number;
};

export const publicRoutes: PublicRoute[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/boston/nanny-cost", changeFrequency: "monthly", priority: 1 },
  { path: "/brief", changeFrequency: "monthly", priority: 0.9 },
  { path: "/how-it-works", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/for-agencies", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

/** Header navigation (step 01 spec: brand, Cost, How it works, For agencies). */
export const headerNav = [
  { href: "/boston/nanny-cost", label: "Cost" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/for-agencies", label: "For agencies" },
];

/** CLAUDE.md rule 5: anything that mentions agencies links here. */
export const disclosureHref = "/how-it-works#how-we-get-paid";
