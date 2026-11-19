import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Silly Goose collects (very little) and what we never do.",
};

export default function PrivacyPage() {
  return (
    <PageShell>
      <PageIntro title="Privacy" description="The short version, in plain English." />
      <div className="prose-width mt-10 space-y-4">
        <p>You don&apos;t need an account or to tell us who you are to use this site.</p>
        <p>
          We use basic, privacy-friendly analytics to see which pages are
          useful. No ads, and no tracking you across other websites.
        </p>
        <p>
          If you email us or give us your email address, we use it only to
          reply to you. We&apos;ll delete it whenever you ask.
        </p>
        <p>We never sell or share your information.</p>
        <p className="text-[15px] text-muted-ink">Last updated November 2026.</p>
      </div>
    </PageShell>
  );
}
