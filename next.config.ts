import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
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
