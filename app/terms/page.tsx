import type { Metadata } from "next";
import { PageIntro, PageShell } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Terms",
  description: "The plain-language terms for using this site.",
};

// Stub — plain-language terms arrive in a later step.
export default function TermsPage() {
  return (
    <PageShell>
      <PageIntro
        title="Terms"
        description="The plain-language terms for using this site. Coming soon."
      />
    </PageShell>
  );
}
