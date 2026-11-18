import type { FaqItem } from "@/lib/costFacts";

// Native <details>, so every answer is in the HTML and works without JS.
export function FaqList({
  items,
  open = false,
  headingLevel = "h3",
}: {
  items: FaqItem[];
  open?: boolean;
  /** h2 on /faq (directly under the H1), h3 inside a section elsewhere. */
  headingLevel?: "h2" | "h3";
}) {
  const Q = headingLevel;
  return (
    <div className="prose-width divide-y divide-sand-light border-y border-sand-light">
      {items.map((f) => (
        <details key={f.q} className="group py-4" open={open}>
          <summary className="flex min-h-11 list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <Q className="font-sans text-base font-semibold text-ink">{f.q}</Q>
            <span aria-hidden className="text-pine transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-2">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
