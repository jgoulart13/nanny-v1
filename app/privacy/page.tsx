import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";
import { DisclosureNote } from "@/components/disclosure-note";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What we collect, why, and who we share it with.",
};

// Stub — plain-language policy arrives in a later step.
export default function PrivacyPage() {
  return (
    <PageShell>
      <PageIntro
        title="Privacy"
        description="What we collect, why, and the named partner agencies we share it with, only with your consent. Full policy coming soon."
      />
      <div className="mt-10">
        <DisclosureNote />
      </div>
    </PageShell>
  );
}
