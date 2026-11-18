import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";
import { DisclosureNote } from "@/components/disclosure-note";

// HIDDEN (scope change 2026-11-15): not linked, noindex, not in the sitemap.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "For agencies",
  description:
    "Boston nanny agencies: apply to receive qualified family briefs.",
};

// Stub — the pitch and application form arrive in a later step.
export default function ForAgenciesPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="For agencies"
        title="Receive qualified family briefs"
        description="Boston nanny agencies can apply to receive structured briefs from families who are ready to hire. Coming soon."
      />
      <div className="mt-10">
        <DisclosureNote>
          Families see how we’re paid. Agency payments are always disclosed.
        </DisclosureNote>
      </div>
    </PageShell>
  );
}
