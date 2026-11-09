import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Straight answers about Boston nanny costs, taxes, agencies vs. independent nannies, and nanny shares.",
};

// Stub — real Q&As arrive in a later step.
export default function FaqPage() {
  return (
    <PageShell>
      <PageIntro
        title="Frequently asked questions"
        description="Straight answers about nanny costs, taxes, agencies vs. independent nannies, and nanny shares. Coming soon."
      />
    </PageShell>
  );
}
