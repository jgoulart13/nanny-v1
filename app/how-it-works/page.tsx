import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "We work for the family. How we vet partner agencies, and exactly how we get paid.",
};

// Stub — full content arrives in a later step.
export default function HowItWorksPage() {
  return (
    <PageShell>
      <PageIntro
        title="How it works"
        description="We work for your family, not the agencies. Here's how we vet partners and how we get paid."
      />
      {/* CLAUDE.md rule 5: every agency mention links to this anchor. */}
      <section id="how-we-get-paid" className="prose-width mt-14 scroll-mt-8">
        <h2 className="text-3xl">How we get paid</h2>
        <p className="mt-4">
          Partner agencies may pay us when they work with a family we
          introduce. We will list every payment arrangement on this page before
          we forward any brief. Full details are coming soon.
        </p>
      </section>
    </PageShell>
  );
}
