import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";

// Allow-all for now. Step 04 adds explicit rules for the AI crawlers.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Internal design reference page, not for search results.
      disallow: "/styleguide",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
