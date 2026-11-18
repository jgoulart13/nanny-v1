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
      {/* Full story (approved for v1, 2026-11-17). The home page links here. */}
      {/* TODO(jonathan): revisit story copy */}
      <section id="our-story" className="prose-width mt-14 scroll-mt-8">
        <h2 className="text-3xl">Our story</h2>
        <p className="mt-4 font-heading text-2xl text-ink">We&apos;re Boston parents too.</p>
        <p className="mt-4">
          In our son&apos;s first year we did almost all of it: a night doula, a
          nanny, then a scramble for daycare when our nanny had a family
          emergency. We searched Facebook groups, asked every parent we knew,
          and talked to agencies, and we still had no idea what was fair to pay
          or what we&apos;d signed up for as employers.
        </p>
        <p className="mt-4">
          We started writing down what we learned so the next family
          doesn&apos;t have to piece it together at 10pm. Everything here is
          sourced, dated, and written for parents, not for agencies.
        </p>
        <p className="mt-4 font-heading text-xl italic text-ink">Jonathan &amp; Talia, Jamaica Plain</p>
      </section>

      {/* CLAUDE.md rule 5: the funding explanation lives here (and at the end
          of the agency-fees guide) only. */}
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
