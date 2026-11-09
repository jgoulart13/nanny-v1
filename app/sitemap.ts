import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
import { publicRoutes } from "@/lib/routes";

// Lists every public page. /styleguide is deliberately left out.
// TODO: give each route a real lastmod date once content exists (step 04).
export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route.path === "/" ? "" : route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
