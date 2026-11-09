import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";
import { DisclosureNote } from "@/components/disclosure-note";

export const metadata: Metadata = {
  title: "Tell us what you need",
  description:
    "A short brief about your family's nanny needs, shared with up to three partner agencies only with your consent.",
};

// Stub — the multi-step brief form arrives in step 03.
export default function BriefPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Get matched"
        title="Tell us what you need"
        description="A short brief about your nanny needs. With your consent, we share it with up to three partner agencies. Coming soon."
      />
      <div className="mt-10">
        <DisclosureNote />
      </div>
    </PageShell>
  );
}
