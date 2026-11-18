import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { PageShell } from "@/components/page-intro";
import { JsonLd } from "@/components/json-ld";
import { FaqList } from "@/components/cost/faq-list";
import { SourceTable } from "@/components/cost/source-table";
import { config, siteUrl } from "@/lib/config";
import { costData, formatDate } from "@/lib/costData";
import {
  agencyFeeExamples,
  allInHigh,
  allInLow,
  allInPending,
  answerFirst,
  costFaq,
  daycareInfantMonthly,
  fullTimeExample,
  hourlyAcrossSources,
  lastUpdated,
  nannyMonthly,
  newbornHourly,
  partTimeHourly,
  shortSource,
  typicalAllIn,
  usdApproxRange,
} from "@/lib/costFacts";
import { defaultInputs, isTbd, usd, usdRange } from "@/lib/estimator";

const path = "/boston/nanny-cost";
const title = "How much does a nanny cost in Boston? (2026)";
const description = `Boston nanny asking rates run ${usdRange(hourlyAcrossSources)}/hr. All-in, a full-time nanny costs ${typicalAllIn} in the first year. Every source shown.`;

// ON HOLD (step 02c): out of the nav, sitemap and all links, noindex. Its
// content moves into /guides; this URL will redirect to
// /guides/boston-nanny-cost once that guide is written. Don't delete.
export const metadata: Metadata = {
  title,
  description,
  robots: { index: false, follow: true },
  openGraph: { title, description, type: "article", url: path },
};

function GuideLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <p className="mt-4">
      <Link href={href} className="text-link font-medium">
        {children} →
      </Link>
    </p>
  );
}

export default function NannyCostPage() {
  const updated = formatDate(lastUpdated);
  const pageUrl = `${siteUrl}${path}`;
  const hours = defaultInputs.hoursPerWeek;

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
        "@type": "Dataset",
        "@id": `${pageUrl}#dataset`,
        name: "Boston nanny cost data points",
        description:
          "Published nanny wage, employer tax and agency fee figures for Boston, MA, each with its source, measurement basis, date and a confidence label. Wage figures are mostly asking rates, not transacted agency prices.",
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

  const wageRows = [
    { label: "Full-time, general", value: usdRange(fullTimeExample.hourly), source: fullTimeExample.hourlySources.map(shortSource).join(", ") },
    { label: "Newborn", value: usd(newbornHourly.value), source: shortSource(newbornHourly) },
    { label: "Part-time", value: usd(partTimeHourly.value), source: shortSource(partTimeHourly) },
    { label: "Nanny share (per family)", value: null, source: "Collecting" },
  ];

  return (
    <PageShell>
      <JsonLd data={jsonLd} />

      {/* 1. Answer first */}
      <header className="prose-width">
        <p className="eyebrow mb-3">
          Boston · Updated <time dateTime={lastUpdated}>{updated}</time>
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">{title}</h1>
        <p className="mt-5 text-lg">{answerFirst}</p>
      </header>

      {/* Summary card → /estimate (sage = tools and numbers) */}
      <Link
        href="/estimate"
        className="group mt-10 block rounded-xl bg-sage p-6 sm:p-8"
      >
        <p className="eyebrow text-ink">All-in, full-time, first year</p>
        <p className="mt-2 font-heading text-2xl text-ink sm:text-3xl">
          A typical full-time Boston nanny costs{" "}
          <span className="font-sans font-medium text-pine tabular-nums">
            {typicalAllIn}
          </span>{" "}
          all-in{allInPending.length > 0 && <span className="text-xl">*</span>}.
        </p>
        <p className="mt-3 text-[15px] text-ink">
          Wages at {hours} hours a week + employer taxes + an agency fee.
          {allInPending.length > 0 && ` *Plus ${allInPending.join(", ")}: TBD — collecting.`}
        </p>
        <p className="mt-4 font-medium text-pine group-hover:underline">
          Estimate your own cost →
        </p>
      </Link>

      <div className="prose-width">
        {/* 2. Why it's hard to know (blush = people and feelings) */}
        <section id="why-its-hard" className="mt-16">
          <h2 className="text-3xl">Why it&apos;s so hard to know</h2>
          <p className="mt-4">
            Most numbers you&apos;ll find online are asking rates from job
            listings, not what families actually pay. Agencies rarely publish
            their fees, and almost no one adds up the employer taxes.
          </p>
          <aside className="mt-6 rounded-xl bg-blush p-5 sm:p-6">
            <p className="font-heading text-xl text-ink">If this feels like a lot, you&apos;re not alone.</p>
            <p className="mt-2 text-ink">
              For many new parents this is the biggest check they&apos;ll ever
              write for something they can&apos;t easily judge. The goal of this
              guide is simple: no surprises.
            </p>
          </aside>
        </section>

        {/* 3. Wages */}
        <section id="wages" className="mt-16">
          <h2 className="text-3xl">Wages</h2>
          <p className="mt-4">
            Boston asking rates run {usdRange(hourlyAcrossSources)} an hour. At{" "}
            {hours} hours a week, that&apos;s {usdRange(fullTimeExample.annualWages)}{" "}
            a year. Overtime applies to hours over 40 a week.
          </p>
          <table className="mt-6 w-full text-[15px]">
            <thead>
              <tr className="border-b border-sand text-left">
                <th className="py-2 font-semibold">Arrangement</th>
                <th className="py-2 text-right font-semibold">Hourly</th>
                <th className="py-2 pl-4 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {wageRows.map((r) => (
                <tr key={r.label} className="border-b border-sand-light">
                  <td className="py-2">{r.label}</td>
                  <td className="py-2 text-right tabular-nums">
                    {r.value ?? <span className="italic text-muted-ink">TBD — collecting</span>}
                  </td>
                  <td className="py-2 pl-4 text-muted-ink">{r.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <GuideLink href="/boston/nanny-cost/wages">What Boston nannies earn</GuideLink>
        </section>

        {/* 4. Employer taxes */}
        <section id="employer-taxes" className="mt-16">
          <h2 className="text-3xl">Employer taxes</h2>
          <p className="mt-4">
            A nanny who works in your home is usually your household employee.
            For a full-time nanny at {hours} hours a week, here&apos;s your
            share in 2026:
          </p>
          <table className="mt-6 w-full text-[15px]">
            <tbody>
              {fullTimeExample.employerTaxes.lines.map((l) => (
                <tr key={l.key} className="border-b border-sand-light align-top">
                  <td className="py-2 pr-4">
                    {l.label}
                    {l.note && <span className="block text-sm text-muted-ink">{l.note}</span>}
                  </td>
                  <td className="py-2 text-right tabular-nums">
                    {isTbd(l.value) ? (
                      <span className="italic text-muted-ink">TBD — collecting</span>
                    ) : (
                      usdRange(l.value)
                    )}
                  </td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td className="py-2">Known so far, per year</td>
                <td className="py-2 text-right text-pine tabular-nums">
                  {usdRange(fullTimeExample.employerTaxes.known)}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mt-4 text-[15px] text-muted-ink">
            Not tax advice. Federal rules:{" "}
            <a href="https://www.irs.gov/publications/p926" className="text-link" rel="noopener" target="_blank">
              IRS Publication 926
            </a>
            .
          </p>
          <GuideLink href="/boston/nanny-cost/taxes">Nanny taxes in Massachusetts</GuideLink>
        </section>

        {/* 5. Agency fees */}
        <section id="agency-fees" className="mt-16">
          <h2 className="text-3xl">If you use an agency</h2>
          <p className="mt-4">
            Agencies handle the search, screening and a replacement guarantee,
            and usually charge a one-time fee: a percentage of the nanny&apos;s
            first-year pay with a minimum, plus an upfront fee. Two Boston
            agencies publish theirs. For a full-time nanny at {hours} hours a
            week:
          </p>
          {agencyFeeExamples.length > 0 ? (
            <table className="mt-6 w-full text-[15px]">
              <tbody>
                {agencyFeeExamples.map((a) => (
                  <tr key={a.agency} className="border-b border-sand-light align-top">
                    <td className="py-2 pr-4">
                      <a href={a.sources[0].source_url} className="text-link" rel="noopener" target="_blank">
                        {a.agency}
                      </a>
                      <span className="block text-sm text-muted-ink">{a.formula}</span>
                    </td>
                    <td className="py-2 text-right tabular-nums">about {usdApproxRange(a.fee)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="mt-4 italic text-muted-ink">TBD — collecting.</p>
          )}
          <p className="mt-4 text-[15px] text-muted-ink">
            Fees vary widely, and these are what agencies publish, not what
            every family pays. We&apos;re collecting more.
          </p>
          <GuideLink href="/boston/nanny-cost/agency-fees">What Boston nanny agencies charge</GuideLink>
        </section>

        {/* 6. Ways families lower the cost */}
        <section id="lower-the-cost" className="mt-16">
          <h2 className="text-3xl">Ways families lower the cost</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6">
            <li>
              <strong>Nanny share:</strong> two families split one nanny. How
              much each saves: <span className="italic text-muted-ink">TBD — collecting</span>.{" "}
              <Link href="/boston/nanny-cost/nanny-share" className="text-link">How a share changes the math</Link>
            </li>
            <li>
              <strong>Part-time:</strong> {shortSource(partTimeHourly)} lists{" "}
              {usd(partTimeHourly.value)} an hour for part-time nannies in Boston.
            </li>
            <li>
              <strong>Hiring on your own:</strong> no agency fee, but you do the
              search, screening and payroll yourself.
            </li>
          </ul>
        </section>

        {/* 7. Nanny vs. daycare */}
        <section id="nanny-vs-daycare" className="mt-16">
          <h2 className="text-3xl">Nanny vs. daycare</h2>
          <p className="mt-4">
            {shortSource(daycareInfantMonthly)} models infant daycare in Boston at
            about <strong>{usd(daycareInfantMonthly.value)} a month</strong>,
            versus about <strong>{usd(nannyMonthly.value)} a month</strong> for a
            full-time nanny including employer taxes. Both are modeled estimates
            (low confidence).
          </p>
          <GuideLink href="/boston/nanny-cost/vs-daycare">Nanny vs. daycare in Boston</GuideLink>
        </section>
      </div>

      {/* 8. Sources and method */}
      <section id="sources" className="mt-16 scroll-mt-8">
        <h2 className="text-3xl">Sources</h2>
        <p className="prose-width mt-4 rounded-lg bg-blue px-4 py-3 text-[15px]">
          Most public wage figures are asking rates, not what families actually
          pay through agencies. We&apos;re collecting real quotes.
        </p>
        <div className="mt-6">
          <SourceTable />
        </div>
      </section>

      <section id="method" className="prose-width mt-12">
        <h2 className="text-2xl">How we calculate this</h2>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-[15px] text-muted-ink">
          <li>Hourly range: the lowest, middle and highest average rate across our sources.</li>
          <li>Yearly wages = hourly rate × hours per week × 52 weeks.</li>
          <li>Employer taxes = each 2026 rate × wages, with the IRS thresholds.</li>
          <li>Agency fees = each agency&apos;s published percentage × first-year wages (or its minimum) + its upfront fee.</li>
          <li>
            Anything we can&apos;t source yet shows &ldquo;TBD — collecting.&rdquo;
            One local agency puts the full-time total higher, at{" "}
            {usd(allInLow.value)}–{usd(allInHigh.value)}+ (
            <a href={allInLow.source_url} className="text-link" rel="noopener" target="_blank">
              {shortSource(allInLow)}
            </a>
            , low confidence).
          </li>
          <li>Last updated <time dateTime={lastUpdated}>{updated}</time>. We re-check every figure monthly.</li>
        </ul>
      </section>

      {/* 9. Top questions → /faq */}
      <section id="faq" className="mt-16 scroll-mt-8">
        <h2 className="text-3xl">Common questions</h2>
        <div className="mt-6">
          <FaqList items={costFaq.filter((f) => f.pillar).slice(0, 3)} />
        </div>
        <p className="mt-4">
          <Link href="/faq" className="text-link font-medium">More questions →</Link>
        </p>
      </section>

      {/* CTA */}
      <section className="prose-width mt-16 rounded-xl bg-sage p-6">
        <p className="font-heading text-2xl text-ink">What would it cost your family?</p>
        <p className="mt-2">Put in your hours and your kids&apos; ages to see your own all-in range.</p>
        <Link href="/estimate" className={`${buttonClass({ size: "lg" })} mt-5`}>
          Estimate your all-in cost →
        </Link>
      </section>
    </PageShell>
  );
}
