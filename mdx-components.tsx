// Required by @next/mdx in the App Router. Styles every element a guide's
// markdown produces, so guide files stay plain markdown.

import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: ({ children }) => <h2 className="mt-12 text-3xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-8 text-xl">{children}</h3>,
  p: ({ children }) => <p className="mt-4">{children}</p>,
  ul: ({ children }) => <ul className="mt-4 list-disc space-y-2 pl-6">{children}</ul>,
  ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2 pl-6">{children}</ol>,
  a: ({ href, children }) => (
    <a href={href} className="text-link">
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 rounded-xl bg-blush px-5 py-4 text-ink">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-[15px] tabular-nums">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border-b border-sand py-2 pr-4 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-sand-light py-2 pr-4">{children}</td>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
