import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, PageShell } from "@/components/page-intro";

export const metadata: Metadata = {
  title: "Terms",
  description: "The short, plain-language terms for using Silly Goose.",
};

export default function TermsPage() {
  return (
    <PageShell>
      <PageIntro title="Terms" description="The short version, in plain English." />
      <div className="prose-width mt-10 space-y-4">
        <p>
          Silly Goose shares information to help families plan for childcare.
          It isn&apos;t tax, legal or financial advice.
        </p>
        <p>
          We work hard to keep every number accurate, sourced and dated, but
          there are no guarantees. Rules and prices change, so check with the
          source or a professional before you act on anything here.
        </p>
        <p>
          We link to other websites to help you. We don&apos;t control them and
          aren&apos;t responsible for what they say.
        </p>
        <p>
          By using this site, you agree to these terms. See also our{" "}
          <Link href="/privacy" className="text-link">
            privacy page
          </Link>
          .
        </p>
        <p className="text-[15px] text-muted-ink">Last updated November 2026.</p>
      </div>
    </PageShell>
  );
}
