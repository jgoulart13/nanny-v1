import type { FaqItem } from "@/lib/costFacts";

// Native <details>, so every answer is in the HTML and works without JS.
export function FaqList({ items, open = false }: { items: FaqItem[]; open?: boolean }) {
  return (
    <div className="prose-width divide-y divide-sand-light border-y border-sand-light">
      {items.map((f) => (
        <details key={f.q} className="group py-4" open={open}>
          <summary className="flex min-h-11 list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
            <h3 className="font-semibold">{f.q}</h3>
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
