import Link from "next/link";
import { disclosureHref } from "@/lib/routes";

// design.md: a small blue box, always visible near any mention of agencies.
// CLAUDE.md rule 5: it must link to /how-it-works#how-we-get-paid.
export function DisclosureNote({
  children = "We don’t take money from agencies. If that ever changes, we’ll say so here first.",
}: {
  children?: React.ReactNode;
}) {
  return (
    <aside className="prose-width rounded-lg bg-blue px-4 py-3 text-[15px] text-ink">
      {children}{" "}
      <Link href={disclosureHref} className="text-link whitespace-nowrap">
        How we get paid →
      </Link>
    </aside>
  );
}
