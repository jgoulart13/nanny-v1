import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "How much does a nanny cost in Boston?",
  description:
    "The all-in cost of a Boston nanny: wage, employer taxes and agency fees, with every source shown.",
};

// Stub — the cost explainer, source table and estimator arrive in step 02.
export default function NannyCostPage() {
  return (
    <PageShell>
      <PageIntro
        eyebrow="Boston · Cost guide"
        title="How much does a nanny cost in Boston?"
        description="The all-in cost (wage, employer taxes and agency fees), with every source shown. Coming soon."
      />
    </PageShell>
  );
}
