// Renders structured data for search engines and AI assistants.
// "<" is escaped so data can never break out of the <script> tag
// (recommended in node_modules/next/dist/docs/01-app/02-guides/json-ld.md).

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
