import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { DisclosureNote } from "@/components/disclosure-note";
import { readingList } from "@/lib/readingList";
import { formatAsOf } from "@/lib/costData";
import heroImage from "@/public/hero.webp";

// design.md "Imagery": one hero image, no faces. Alt text is from design.md.
const heroAlt =
  "A sunlit kitchen table with a coffee mug, a toddler's sippy cup and a notebook of handwritten numbers.";

// Guide cards (sage = main section color, design.md 2026-11-17).
const guideCards = [
  {
    title: "What agencies charge",
    teaser: "Placement fees, minimums and what you get for them.",
    href: "/guides/nanny-agency-fees-boston",
  },
  {
    title: "What Boston nannies earn",
    teaser: "Hourly rates by arrangement, and why the numbers disagree.",
    href: "/guides/boston-nanny-wages",
  },
  {
    title: "Nanny taxes in Massachusetts",
    teaser: "What changes the day you become a household employer.",
    href: "/guides/massachusetts-nanny-taxes",
  },
];

export default function HomePage() {
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
                <Link href="/guides" className={buttonClass({ size: "lg" })}>
                  Read the guides
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

      {/* --- Guides (sage cards) --- */}
      <section aria-labelledby="guides" className="mx-auto max-w-5xl px-5 pt-12 sm:pt-16">
        <h2 id="guides" className="text-3xl sm:text-4xl">
          The part no one prepares you for
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {guideCards.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group flex h-full flex-col rounded-xl bg-sage p-6 ring-1 ring-transparent transition-shadow hover:ring-pine"
              >
                <h3 className="font-heading text-2xl font-normal">{g.title}</h3>
                <p className="mt-2 flex-1 text-ink">{g.teaser}</p>
                <span className="mt-5 font-medium text-pine group-hover:underline">
                  Read the guide →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <DisclosureNote />
        </div>
      </section>

      {/* --- Why we're doing this (cream, one small blush accent) --- */}
      {/* TODO(jonathan): approve story copy */}
      <section aria-labelledby="why" className="mx-auto max-w-5xl px-5 pt-16 sm:pt-20">
        <div className="prose-width">
          <span
            aria-hidden
            className="inline-flex size-12 items-center justify-center rounded-full bg-blush font-heading text-4xl leading-none text-ink"
          >
            &ldquo;
          </span>
          <h2 id="why" className="mt-4 text-3xl sm:text-4xl">
            Why we&apos;re doing this
          </h2>
          <p className="mt-4 font-heading text-2xl text-ink">We&apos;re Boston parents too.</p>
          <p className="mt-4">
            In our son&apos;s first year we did almost all of it: a night doula,
            a nanny, then a scramble for daycare when our nanny had a family
            emergency. We searched Facebook groups, asked every parent we knew,
            and talked to agencies, and we still had no idea what was fair to
            pay or what we&apos;d signed up for as employers.
          </p>
          <p className="mt-4">
            We started writing down what we learned so the next family
            doesn&apos;t have to piece it together at 10pm. Everything here is
            sourced, dated, and written for parents, not for agencies.
          </p>
          <p className="mt-4 italic text-muted-ink">Jonathan &amp; Talia, Jamaica Plain</p>
        </div>
      </section>

      {/* --- Around Boston (from data/reading-list.json) --- */}
      <section aria-labelledby="around-boston" className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <h2 id="around-boston" className="text-3xl sm:text-4xl">
          Around Boston
        </h2>
        <p className="mt-2 text-muted-ink">We read these so you don&apos;t have to.</p>
        <ul className="mt-6 divide-y divide-sand-light border-y border-sand-light">
          {readingList.map((item) => (
            <li key={item.url} className="py-5">
              <a
                href={item.url}
                className="text-lg font-semibold text-ink underline decoration-sand underline-offset-4 hover:decoration-pine"
                rel="noopener"
                target="_blank"
              >
                {item.title}
              </a>
              <p className="mt-1 text-sm text-muted-ink">
                {item.source} · {formatAsOf(item.date.slice(0, 7))}
              </p>
              <p className="prose-width mt-2">{item.takeaway}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
