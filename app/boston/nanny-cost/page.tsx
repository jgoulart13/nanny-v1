import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { PageShell } from "@/components/page-intro";
import { DisclosureNote } from "@/components/disclosure-note";
import { JsonLd } from "@/components/json-ld";
import { Estimator } from "@/components/cost/estimator";
import { SourceTable } from "@/components/cost/source-table";
import { config, siteUrl } from "@/lib/config";
import { costData, formatDate } from "@/lib/costData";
import {
  allInHigh,
  allInLow,
  answerFirst,
  costFaq,
  daycareInfantMonthly,
  fullTimeExample,
  hourlyAcrossSources,
  lastUpdated,
  nannyMonthly,
  shortSource,
} from "@/lib/costFacts";
import { defaultInputs, usd, usdRange } from "@/lib/estimator";
import { disclosureHref } from "@/lib/routes";

const path = "/boston/nanny-cost";
const title = "How much does a nanny cost in Boston?";
const description = `Boston nanny asking rates run ${usdRange(hourlyAcrossSources)}/hr. The all-in cost adds employer taxes and agency fees. Every source shown, updated ${formatDate(lastUpdated)}.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: path },
  openGraph: { title, description, type: "article", url: path },
};

export default function NannyCostPage() {
  const updated = formatDate(lastUpdated);
  const pageUrl = `${siteUrl}${path}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: title,
        description,
        dateModified: lastUpdated,
        datePublished: lastUpdated,
        mainEntityOfPage: pageUrl,
        author: { "@type": "Organization", name: config.brand, url: siteUrl },
        publisher: { "@type": "Organization", name: config.brand, url: siteUrl },
        about: { "@type": "Thing", name: "Cost of hiring a nanny in Boston, MA" },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: costFaq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "Dataset",
        "@id": `${pageUrl}#dataset`,
        name: "Boston nanny cost data points",
        description:
          "Published nanny wage and cost figures for Boston, MA, each with its source, measurement basis, date and a confidence label. Most are asking rates, not transacted agency prices.",
        url: `${pageUrl}#sources`,
        dateModified: lastUpdated,
        spatialCoverage: { "@type": "Place", name: costData.market },
        creator: { "@type": "Organization", name: config.brand, url: siteUrl },
        isAccessibleForFree: true,
        isBasedOn: [...new Set(costData.data_points.map((p) => p.source_url))],
        variableMeasured: costData.data_points.map((p) => ({
          "@type": "PropertyValue",
          name: `${p.metric}${p.segment ? ` (${p.segment})` : ""}`,
          value: p.value,
          unitText: p.unit,
        })),
      },
    ],
  };

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      {/* --- Answer first --- */}
      <header className="prose-width">
        <p className="eyebrow mb-3">
          Boston · Updated <time dateTime={lastUpdated}>{updated}</time>
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg">{answerFirst}</p>
      </header>

      <section aria-label="All-in cost" className="mt-10 rounded-xl border border-sand-light bg-white p-6 sm:p-8">
        <p className="eyebrow">All-in, full-time, per year</p>
        <p className="mt-2 text-5xl font-medium text-pine tabular-nums sm:text-6xl">
          {usd(allInLow.value)}–{usd(allInHigh.value)}+
        </p>
        <p className="mt-3 text-muted-ink">
          Wages + employer taxes + agency fee. Source:{" "}
          <a href={allInLow.source_url} className="text-link" rel="noopener" target="_blank">
            {allInLow.source_name}
          </a>{" "}
          ({allInLow.as_of}, low confidence: agency marketing).{" "}
          <a href="#sources" className="text-link">All sources ↓</a>
        </p>
        <div className="mt-6">
          <Link href="/brief" className={buttonClass({ size: "lg" })}>
            Get matched with vetted agencies →
          </Link>
          <p className="mt-3 text-sm text-muted-ink">
            Free for families. <Link href={disclosureHref} className="text-link">How we get paid</Link>
          </p>
        </div>
      </section>

      {/* --- Estimator --- */}
      <section id="estimate" className="mt-16 scroll-mt-8">
        <h2 className="text-3xl">Estimate your cost</h2>
        <p className="prose-width mt-3 text-muted-ink">
          Change the inputs to see your range. Anything we don&apos;t have good
          data for yet shows as &ldquo;TBD — collecting&rdquo; instead of a guess.
        </p>
        <div className="mt-6">
          <Estimator />
        </div>
      </section>

      <div className="prose-width">
        {/* --- Wage vs. all-in --- */}
        <section id="wage-vs-all-in" className="mt-16">
          <h2 className="text-3xl">Wage vs. all-in cost</h2>
          <p className="mt-4">
            The number most sites quote is the nanny&apos;s hourly wage. In
            Boston that&apos;s about {usdRange(hourlyAcrossSources)} an hour,
            or {usdRange(fullTimeExample.annualWages)} a year for{" "}
            {defaultInputs.hoursPerWeek} hours a week. What you actually pay as the employer is higher:
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li><strong>Gross wages</strong>, plus overtime for hours over 40 a week.</li>
            <li><strong>Employer payroll taxes</strong> you owe as a household employer.</li>
            <li><strong>An agency placement fee</strong>, if you hire through an agency.</li>
          </ul>
          <p className="mt-4">
            {shortSource(nannyMonthly)} models a full-time Boston nanny at about{" "}
            {usd(nannyMonthly.value)} a month including employer taxes (a
            modeled estimate, low confidence).
          </p>
        </section>

        {/* --- Employer taxes --- */}
        <section id="employer-taxes" className="mt-16">
          <h2 className="text-3xl">Employer taxes</h2>
          <p className="mt-4">
            A nanny who works in your home is usually your household employee.
            That can mean Social Security and Medicare (FICA), federal
            unemployment tax (FUTA) and Massachusetts unemployment insurance;
            Massachusetts Paid Family and Medical Leave may also apply.
          </p>
          <p className="mt-4">
            <strong>Our estimate: </strong>
            <span className="italic text-muted-ink">TBD — collecting.</span>{" "}
            We&apos;re verifying the 2026 rates with a payroll provider before we
            publish a number. For the federal rules, see{" "}
            <a href="https://www.irs.gov/publications/p926" className="text-link" rel="noopener" target="_blank">
              IRS Publication 926
            </a>.
          </p>
        </section>

        {/* --- Agency fees --- */}
        <section id="agency-fees" className="mt-16">
          <h2 className="text-3xl">Agency fees</h2>
          <p className="mt-4">
            Agencies handle the search, screening and backup if a placement
            doesn&apos;t work out, and usually charge a one-time placement fee.
            Few Boston agencies publish theirs.
          </p>
          <p className="mt-4">
            <strong>Typical placement fee: </strong>
            <span className="italic text-muted-ink">TBD — we&apos;re collecting this.</span>{" "}
            We&apos;ll publish a range once at least three Boston agencies share
            their fees.
          </p>
          <div className="mt-6">
            <DisclosureNote />
          </div>
        </section>

        {/* --- Nanny share --- */}
        <section id="nanny-share" className="mt-16">
          <h2 className="text-3xl">Nanny share</h2>
          <p className="mt-4">
            In a nanny share, two families hire one nanny together and split the
            cost. Each family pays less than hiring alone, while the nanny often
            earns more per hour than for one family.
          </p>
          <p className="mt-4">
            <strong>How much each family saves: </strong>
            <span className="italic text-muted-ink">TBD — collecting.</span>{" "}
            We&apos;re gathering real splits from Boston families and agencies.
          </p>
        </section>

        {/* --- Nanny vs. daycare --- */}
        <section id="nanny-vs-daycare" className="mt-16">
          <h2 className="text-3xl">Nanny vs. daycare</h2>
          <p className="mt-4">
            {shortSource(daycareInfantMonthly)} models infant daycare in Boston
            at about <strong>{usd(daycareInfantMonthly.value)} a month</strong>,
            versus about <strong>{usd(nannyMonthly.value)} a month</strong> for a
            full-time nanny including employer taxes. Both are modeled
            estimates (low confidence). A nanny costs more for one child but
            gives you one-on-one care at home and a schedule that fits yours; a
            nanny share or more than one child can narrow the gap.
          </p>
        </section>
      </div>

      {/* --- Sources --- */}
      <section id="sources" className="mt-16 scroll-mt-8">
        <h2 className="text-3xl">Sources</h2>
        <p className="prose-width mt-4 rounded-lg bg-blue px-4 py-3 text-[15px]">
          Most public figures are asking rates, not what families actually pay
          through agencies. We&apos;re collecting real quotes.
        </p>
        <div className="mt-6">
          <SourceTable />
        </div>
      </section>

      {/* --- FAQ: native <details>, so answers are in the HTML and work without JS --- */}
      <section id="faq" className="prose-width mt-16 scroll-mt-8">
        <h2 className="text-3xl">Frequently asked questions</h2>
        <div className="mt-6 divide-y divide-sand-light border-y border-sand-light">
          {costFaq.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex min-h-11 list-none items-center justify-between gap-4 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden className="text-pine transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* --- Method + CTA --- */}
      <section id="method" className="prose-width mt-16">
        <h2 className="text-3xl">How we calculate this</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] text-muted-ink">
          <li>
            The hourly range is the lowest, middle and highest average rate
            across our sources for your type of care.
          </li>
          <li>Yearly wages = hourly rate × hours per week × 52 weeks.</li>
          <li>
            Taxes, agency fees and nanny share splits appear only once we can
            source them. Until then they show &ldquo;TBD — collecting&rdquo;.
          </li>
          <li>
            Last updated <time dateTime={lastUpdated}>{updated}</time>. We
            re-check every figure monthly.
          </li>
        </ul>
        <div className="mt-8 rounded-xl bg-sage p-6">
          <p className="font-heading text-2xl text-ink">Want real quotes instead of asking rates?</p>
          <p className="mt-2">
            Tell us what you need and we&apos;ll send it to up to three vetted
            Boston agencies.
          </p>
          <Link href="/brief" className={`${buttonClass({ size: "lg" })} mt-5`}>
            Get matched with vetted agencies →
          </Link>
          <p className="mt-3 text-sm text-ink/80">
            <Link href={disclosureHref} className="text-link">How we get paid</Link>
          </p>
        </div>
      </section>
    </PageShell>
  );
}
