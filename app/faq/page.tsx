import type { Metadata } from "next";
import Link from "next/link";
import { FaqList } from "@/components/cost/faq-list";
import { JsonLd } from "@/components/json-ld";
import { PageIntro, PageShell } from "@/components/page-intro";
import { siteUrl } from "@/lib/config";
import { siteFaq } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Boston nanny cost FAQ",
  description:
    "Straight answers on what a Boston nanny costs: pay, Massachusetts nanny taxes, agency fees, and nanny vs. daycare.",
  alternates: { canonical: "/faq" },
};

// The one full FAQ on the site. FAQPage JSON-LD lives here only.
export default function FaqPage() {
  return (
    <PageShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${siteUrl}/faq#faq`,
          mainEntity: siteFaq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <PageIntro
        eyebrow="Boston · Nanny costs"
        title="Frequently asked questions"
        description="Quick answers. Each one links to a guide with the details and sources."
      />
      <div className="mt-10">
        <FaqList items={siteFaq} open headingLevel="h2" />
      </div>
      <p className="prose-width mt-10 text-[15px] text-muted-ink">
        Every source, with its date:{" "}
        <Link href="/estimate" className="text-link">
          estimate your cost
        </Link>{" "}
        (sources are listed under the result). More detail:{" "}
        <Link href="/guides" className="text-link">
          our guides
        </Link>
        .
      </p>
    </PageShell>
  );
}
