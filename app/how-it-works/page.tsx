import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "Who we are, who we work for, and how we’re funded. We don’t take money from agencies.",
};

// Stub — full content arrives in a later step.
export default function HowItWorksPage() {
  return (
    <PageShell>
      <PageIntro
        title="How it works"
        description="We work for families, not agencies. Here’s who we are and how we’re funded."
      />
      {/* CLAUDE.md rule 5: every agency mention links to this anchor. */}
      <section id="how-we-get-paid" className="prose-width mt-14 scroll-mt-8">
        <h2 className="text-3xl">How we get paid</h2>
        <p className="mt-4">
          Today we don&apos;t take any money from agencies. If that ever
          changes, we&apos;ll list every payment arrangement on this page
          before it starts.
        </p>
      </section>
    </PageShell>
  );
}
