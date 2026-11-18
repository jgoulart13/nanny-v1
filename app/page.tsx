import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { DisclosureNote } from "@/components/disclosure-note";
import {
  agencyFeeExamples,
  agencyFeeRange,
  allInPending,
  fullTimeExample,
  hourlyAcrossSources,
  hourlySourceNames,
  shortSource,
  typicalAllIn,
  usdApprox,
  usdApproxRange,
} from "@/lib/costFacts";
import { defaultInputs, usdRange } from "@/lib/estimator";
import heroImage from "@/public/hero.webp";

// design.md "Imagery": one hero image, no faces. Alt text is from design.md.
const heroAlt =
  "A sunlit kitchen table with a coffee mug, a toddler's sippy cup and a notebook of handwritten numbers.";

const journey = [
  {
    title: "Trusting a stranger with your child",
    body: "Agencies screen candidates, check references and stand behind a placement. Here's what that costs, and what you get for it.",
    href: "/boston/nanny-cost/agency-fees",
    link: "What agencies charge",
  },
  {
    title: "Not knowing what's fair to pay",
    body: "Public numbers disagree, and most are asking rates. We put every source side by side so you can see the real range.",
    href: "/boston/nanny-cost/wages",
    link: "What Boston nannies earn",
  },
  {
    title: "Becoming an employer overnight",
    body: "Hiring a nanny usually makes you a household employer, with taxes and paperwork you've never done before. Here's the short version.",
    href: "/boston/nanny-cost/taxes",
    link: "Nanny taxes in Massachusetts",
  },
];

export default function HomePage() {
  const taxesKnown = fullTimeExample.employerTaxes.known;
  const hours = defaultInputs.hoursPerWeek;

  return (
    <main className="flex-1">
      {/* --- Hero: image right, headline on the empty left (wide screens); image above headline (phones, tablets) --- */}
      <section className="relative overflow-hidden lg:bg-cream">
        <div className="relative h-64 sm:h-96 lg:absolute lg:inset-y-0 lg:right-0 lg:left-[30%] lg:h-auto">
          <Image
            src={heroImage}
            alt={heroAlt}
            priority
            fill
            sizes="100vw"
            placeholder="blur"
            className="object-cover object-right"
          />
          {/* Cream → blush wash on the left edge keeps the ink headline high-contrast */}
          <div
            aria-hidden
            className="absolute inset-0 hidden bg-gradient-to-r from-cream from-5% via-blush/40 via-30% to-transparent to-60% lg:block"
          />
        </div>
        <div className="relative bg-gradient-to-b from-blush/40 to-cream lg:bg-none">
          <div className="mx-auto max-w-5xl px-5 py-10 lg:py-28">
            <div className="max-w-xl">
              <p className="eyebrow mb-3 text-ink">Boston · 2026</p>
              <h1 className="text-4xl leading-tight sm:text-5xl">
                Finding someone to care for your child is personal. Knowing
                what it costs shouldn&apos;t be a mystery.
              </h1>
              <p className="mt-5 text-lg text-ink">
                Honest, sourced numbers for wages, employer taxes and agency
                fees, so you can plan with a clear head.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/boston/nanny-cost" className={buttonClass({ size: "lg" })}>
                  See what it costs
                </Link>
                <Link
                  href="/estimate"
                  className={`${buttonClass({ variant: "outline", size: "lg" })} bg-cream/80`}
                >
                  Estimate your cost
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- The journey (blush = people and feelings) --- */}
      <section aria-labelledby="journey" className="bg-blush">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
          <h2 id="journey" className="text-3xl sm:text-4xl">
            The part no one prepares you for
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {journey.map((j) => (
              <li key={j.title} className="flex flex-col rounded-xl bg-cream p-6">
                <h3 className="text-lg">{j.title}</h3>
                <p className="mt-2 flex-1 text-[16px]">{j.body}</p>
                <Link href={j.href} className="text-link mt-4 font-medium">
                  {j.link} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- What it actually costs (sage = numbers) --- */}
      <section aria-labelledby="costs" className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="rounded-xl bg-sage p-6 sm:p-10">
          <h2 id="costs" className="text-3xl sm:text-4xl">
            What it actually costs
          </h2>
          <p className="mt-4 text-lg text-ink">
            A full-time Boston nanny ({hours} hours a week, through an agency)
            costs{" "}
            <strong className="font-medium text-pine tabular-nums">{typicalAllIn}</strong>{" "}
            in the first year, all-in
            {allInPending.length > 0 &&
              `, plus ${allInPending.join(" and ")} (TBD — collecting)`}
            .
          </p>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-5">
              <dt className="eyebrow">Hourly rate</dt>
              <dd className="mt-1 text-3xl font-medium text-pine tabular-nums">
                {usdRange(hourlyAcrossSources)}
              </dd>
              <dd className="mt-2 text-sm text-muted-ink">
                Asking rates · {hourlySourceNames}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-5">
              <dt className="eyebrow">Employer taxes</dt>
              <dd className="mt-1 text-3xl font-medium text-pine tabular-nums">
                about {usdApprox(taxesKnown.mid)}/yr
              </dd>
              <dd className="mt-2 text-sm text-muted-ink">
                Federal + MA paid leave · IRS Pub 926
                {allInPending.length > 0 && "; MA unemployment TBD"}
              </dd>
            </div>
            <div className="rounded-lg bg-white p-5">
              <dt className="eyebrow">Agency fee, one time</dt>
              <dd className="mt-1 text-3xl font-medium text-pine tabular-nums">
                {agencyFeeRange ? usdApproxRange(agencyFeeRange) : "TBD"}
              </dd>
              <dd className="mt-2 text-sm text-muted-ink">
                Published fees · {agencyFeeExamples.map((a) => a.agency).join(", ") || "Collecting"}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-[15px] text-ink">
            Wages {usdRange(fullTimeExample.annualWages)} a year (
            {fullTimeExample.hourlySources.map(shortSource).join(", ")}). Every
            figure is sourced in the guide.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/boston/nanny-cost" className={buttonClass({ size: "lg" })}>
              Read the full cost guide
            </Link>
            <Link href="/estimate" className={buttonClass({ variant: "outline", size: "lg" })}>
              Estimate your cost
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <DisclosureNote />
        </div>
      </section>
    </main>
  );
}
