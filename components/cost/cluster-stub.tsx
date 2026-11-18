// Empty-state stub for a cluster guide (docs/07-content-plan.md).
// One-paragraph answer now, the full guide later. noindex until real content
// lands, and left out of the sitemap.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/ui/button";
import { PageShell } from "@/components/page-intro";
import { clusterByPath, lastUpdated } from "@/lib/costFacts";
import { formatDate } from "@/lib/costData";

export function clusterMetadata(path: string): Metadata {
  const guide = clusterByPath(path);
  return {
    title: guide?.title,
    description: guide?.answer.slice(0, 155),
    robots: { index: false, follow: true },
  };
}

export function ClusterStub({ path }: { path: string }) {
  const guide = clusterByPath(path);
  if (!guide) notFound();

  return (
    <PageShell>
      <nav aria-label="Breadcrumb" className="mb-6 text-[15px]">
        <Link href="/boston/nanny-cost" className="text-link">
          ← Boston nanny costs
        </Link>
      </nav>
      <article className="prose-width">
        <p className="eyebrow mb-3">
          Boston guide · Updated{" "}
          <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">{guide.title}</h1>
        <p className="mt-5 text-lg">{guide.answer}</p>
        <p className="mt-6 rounded-lg bg-muted px-4 py-3 text-[15px] text-muted-ink">
          Full guide coming soon. Every figure here is sourced on the{" "}
          <Link href="/boston/nanny-cost#sources" className="text-link">
            cost guide
          </Link>
          .
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/estimate" className={buttonClass({ size: "lg" })}>
            Estimate your cost
          </Link>
          <Link
            href="/boston/nanny-cost"
            className={buttonClass({ variant: "outline", size: "lg" })}
          >
            Read the full cost guide
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
