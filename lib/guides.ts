// lib/guides.ts
// The guides in content/guides/*.mdx, with their frontmatter checked by zod.
// To add a guide: write content/guides/<slug>.mdx and add one line to
// `loaders` below.

import type { ComponentType } from "react";
import { z } from "zod";

const loaders = {
  "nanny-agency-fees-boston": () => import("@/content/guides/nanny-agency-fees-boston.mdx"),
  "boston-nanny-wages": () => import("@/content/guides/boston-nanny-wages.mdx"),
  "massachusetts-nanny-taxes": () => import("@/content/guides/massachusetts-nanny-taxes.mdx"),
  "nanny-vs-daycare-boston": () => import("@/content/guides/nanny-vs-daycare-boston.mdx"),
} as const;

export type GuideSlug = keyof typeof loaders;
export const guideSlugs = Object.keys(loaders) as GuideSlug[];

export const frontmatterSchema = z.object({
  title: z.string().min(1),
  /** One sentence for search results and the guides list. */
  description: z.string().min(1),
  /** "2026-11-17" */
  updated: z.iso.date(),
  /** e.g. "6 min read". "TBD" while drafting. */
  readingTime: z.string().min(1),
  /** true = not written yet: noindex, left out of the sitemap. */
  draft: z.boolean().default(true),
  /** The sage "The short answer" box at the top. */
  shortAnswer: z.string().min(1),
  /** Show the "Not tax or legal advice" line. */
  notAdvice: z.boolean().default(false),
  /** Show "how we're funded" at the end (agency-fees guide only, CLAUDE.md rule 5). */
  showFunding: z.boolean().default(false),
  sources: z
    .array(
      z.object({
        name: z.string().min(1),
        url: z.url(),
        asOf: z.string().min(1),
      }),
    )
    .default([]),
});

export type GuideFrontmatter = z.infer<typeof frontmatterSchema>;
export type Guide = GuideFrontmatter & {
  slug: GuideSlug;
  path: string;
  Content: ComponentType;
};

export function isGuideSlug(slug: string): slug is GuideSlug {
  return slug in loaders;
}

export async function getGuide(slug: GuideSlug): Promise<Guide> {
  const mod = (await loaders[slug]()) as {
    default: ComponentType;
    frontmatter?: unknown;
  };
  const parsed = frontmatterSchema.safeParse(mod.frontmatter);
  if (!parsed.success) {
    throw new Error(
      `content/guides/${slug}.mdx has invalid frontmatter: ${parsed.error.message}`,
    );
  }
  return { ...parsed.data, slug, path: `/guides/${slug}`, Content: mod.default };
}

export async function getAllGuides(): Promise<Guide[]> {
  return Promise.all(guideSlugs.map(getGuide));
}

/** "2026-11-17" → "Nov 2026" */
export function formatUpdated(isoDate: string): string {
  const [y, m] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
