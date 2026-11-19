import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // The old cost page and its stubs were on hold; their content now lives in
  // /guides. Permanent redirects keep any old links and search results working.
  async redirects() {
    return [
      { source: "/boston/nanny-cost", destination: "/guides/boston-nanny-cost", permanent: true },
      { source: "/boston/nanny-cost/wages", destination: "/guides/boston-nanny-wages", permanent: true },
      { source: "/boston/nanny-cost/taxes", destination: "/guides/massachusetts-nanny-taxes", permanent: true },
      { source: "/boston/nanny-cost/agency-fees", destination: "/guides/nanny-agency-fees-boston", permanent: true },
      { source: "/boston/nanny-cost/vs-daycare", destination: "/guides/nanny-vs-daycare-boston", permanent: true },
      { source: "/boston/nanny-cost/nanny-share", destination: "/guides/nanny-vs-daycare-boston", permanent: true },
    ];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Guides are MDX files in content/guides/ (see node_modules/next/dist/docs/
// 01-app/02-guides/mdx.md). Turbopack needs plugins named as strings.
//   remark-frontmatter + remark-mdx-frontmatter: read the YAML block at the
//     top of each guide and export it as `frontmatter`
//   remark-gfm: tables, for the cost tables in guides
const withMDX = createMDX({
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      ["remark-mdx-frontmatter", { name: "frontmatter" }],
      "remark-gfm",
    ],
  },
});

export default withMDX(nextConfig);
