import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass } from "@/components/ui/button";
import { DisclosureNote } from "@/components/disclosure-note";
import { JsonLd } from "@/components/json-ld";
import { PageShell } from "@/components/page-intro";
import { config, siteUrl } from "@/lib/config";
import { formatUpdated, getGuide, guideSlugs, isGuideSlug } from "@/lib/guides";

export function generateStaticParams() {
  return guideSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (!isGuideSlug(slug)) return {};
  const guide = await getGuide(slug);
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: guide.path },
    // Drafts stay out of search until they're written.
    robots: guide.draft ? { index: false, follow: true } : undefined,
    openGraph: { title: guide.title, description: guide.description, type: "article", url: guide.path },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  if (!isGuideSlug(slug)) notFound();
  const guide = await getGuide(slug);
  const { Content } = guide;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    dateModified: guide.updated,
    datePublished: guide.updated,
    mainEntityOfPage: `${siteUrl}${guide.path}`,
    author: { "@type": "Organization", name: config.brand, url: siteUrl },
    publisher: { "@type": "Organization", name: config.brand, url: siteUrl },
    citation: guide.sources.map((s) => ({ "@type": "CreativeWork", name: s.name, url: s.url })),
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />
      <nav aria-label="Breadcrumb" className="mb-6 text-[15px]">
        <Link href="/guides" className="text-link">
          ← All guides
        </Link>
      </nav>

      <article className="prose-width">
        <p className="eyebrow mb-3">
          Guide · Updated <time dateTime={guide.updated}>{formatUpdated(guide.updated)}</time>
          {guide.readingTime !== "TBD" && ` · ${guide.readingTime}`}
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">{guide.title}</h1>

        <section aria-label="The short answer" className="mt-8 rounded-xl bg-sage p-5 sm:p-6">
          <p className="eyebrow text-ink">The short answer</p>
          <p className="mt-2 text-lg text-ink">{guide.shortAnswer}</p>
        </section>

        <div className="mt-4">
          <Content />
        </div>

        {guide.sources.length > 0 && (
          <section aria-labelledby="sources" className="mt-14 border-t border-sand-light pt-8">
            <h2 id="sources" className="text-2xl">
              Sources
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-[15px]">
              {guide.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} className="text-link" rel="noopener" target="_blank">
                    {s.name}
                  </a>{" "}
                  <span className="text-muted-ink">· as of {s.asOf}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {guide.notAdvice && (
          <p className="mt-6 text-[15px] text-muted-ink">
            Not tax or legal advice. For your situation, check with a payroll
            provider or tax professional.
          </p>
        )}

        <div className="mt-8">
          <DisclosureNote />
        </div>

        <div className="mt-10 rounded-xl bg-sage p-6">
          <p className="font-heading text-2xl text-ink">What would it cost your family?</p>
          <p className="mt-2 text-ink">See your own all-in range, with every figure sourced.</p>
          <Link href="/estimate" className={`${buttonClass({ size: "lg" })} mt-5`}>
            Estimate your cost →
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
