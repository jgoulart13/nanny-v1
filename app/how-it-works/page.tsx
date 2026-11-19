import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "About",
  description: "Silly Goose is written by Jonathan and Taliya, Boston parents who went through the childcare search themselves.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageIntro title="About" />
      {/* Story copy approved for v1; the home page's "Read our story" links here. */}
      {/* TODO(jonathan): revisit story copy */}
      <section id="our-story" className="prose-width mt-10 scroll-mt-8">
        <p className="font-heading text-2xl text-ink">We&apos;re Boston parents too.</p>
        <p className="mt-4">
          When our son arrived, we were running on very little sleep and trying
          to make some of the biggest decisions of our lives. Who do we trust
          with him? What&apos;s fair to pay? Wait, are we someone&apos;s
          employer now?
        </p>
        <p className="mt-4">
          In one year we tried almost everything: a night nanny, a nanny we
          found on Facebook, and a daycare search in a crunch when our nanny had
          a family emergency. Every step came with late-night searching, a lot
          of second-guessing, and very few straight answers.
        </p>
        <p className="mt-4">
          This site is our way of bringing a little method to the madness. If
          you&apos;re in the middle of it right now: it&apos;s hard, you&apos;re
          doing better than you think, and you don&apos;t have to figure it out
          alone.
        </p>
        <p className="mt-6 font-heading text-xl italic text-ink">Jonathan &amp; Taliya, Jamaica Plain</p>
      </section>
    </PageShell>
  );
}
