import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
import { getAllGuides } from "@/lib/guides";
import { publicRoutes } from "@/lib/routes";

// Every public, indexable page. Left out on purpose: /styleguide, hidden
// pages (see lib/routes.ts) and guides still marked `draft: true`.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path === "/" ? "" : route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const guides = (await getAllGuides())
    .filter((g) => !g.draft)
    .map((g) => ({
      url: `${siteUrl}${g.path}`,
      lastModified: g.updated,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    }));

  return [...pages, ...guides];
}
