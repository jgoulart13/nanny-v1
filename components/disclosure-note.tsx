import Link from "next/link";
import { disclosureHref } from "@/lib/routes";

// design.md: a small blue box, always visible near any mention of agencies.
// CLAUDE.md rule 5: it must link to /how-it-works#how-we-get-paid.
export function DisclosureNote({
  children = "Partner agencies may pay us when they work with a family we introduce. We always disclose it.",
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
