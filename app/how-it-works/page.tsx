import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";
import { StoryLetter } from "@/components/story-letter";

export const metadata: Metadata = {
  title: "About",
  description: "Silly Goose is written by Jonathan and Taliya, Boston parents who went through the childcare search themselves.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageIntro title="About" />
      {/* Story copy approved for v1; the home page's "Read our story" links here.
          The letter itself is shared with the home page card (components/story-letter.tsx). */}
      <section id="our-story" className="prose-width mt-10 scroll-mt-8">
        <p className="font-heading text-2xl text-ink">We&apos;re Boston parents too.</p>
        <StoryLetter className="" />
        <p className="mt-6 font-heading text-xl italic text-ink">Jonathan &amp; Taliya, Jamaica Plain</p>
      </section>
    </PageShell>
  );
}
