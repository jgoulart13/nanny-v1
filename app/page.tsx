import Image from "next/image";
import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { readingList, readingListMonth } from "@/lib/readingList";
import { StoryLetter } from "@/components/story-letter";
import heroImage from "@/public/hero.webp";

// Home page below the hero follows design-explorations/README.md:
// artboard 11 (blush guide band, timeline + letter story) and option F
// (the "Five things worth your 10pm" digest card).

// design.md "Imagery": one hero image, no faces. Alt text is from design.md.
const heroAlt =
  "A sunlit kitchen table with a coffee mug, a toddler's sippy cup and a notebook of handwritten numbers.";

// Guide band (blush, cream cards), copy from step 02e (artboard 11, streamlined).
const guideCards = [
  {
    title: "Trusting someone new",
    teaser: "What agencies do, and what they charge.",
    link: "Agency fees",
    href: "/guides/nanny-agency-fees-boston",
  },
  {
    title: "What's fair to pay?",
    teaser: "Real Boston numbers, side by side.",
    link: "Nanny pay",
    href: "/guides/boston-nanny-wages",
  },
  {
    title: "Surprise, you're an employer",
    teaser: "Taxes and paperwork, made simple.",
    link: "Nanny taxes",
    href: "/guides/massachusetts-nanny-taxes",
  },
  {
    title: "Nanny or daycare?",
    teaser: "What each really costs, and how families decide.",
    link: "Nanny vs. daycare",
    href: "/guides/nanny-vs-daycare-boston",
  },
];

// Story timeline, copy from step 02e (approved).
const timeline = [
  { when: "First", what: "A night nanny", detail: "The newborn nights." },
  { when: "Then", what: "A nanny", detail: "Found her on Facebook." },
  { when: "Suddenly", what: "An emergency", detail: "Our nanny had to step away." },
  { when: "Next", what: "Daycare in a crunch", detail: "Tours and waitlists, fast." },
  { when: "Now", what: "This site", detail: "So you don't start from zero." },
];

/** Small rounded label above a section heading (blush or sage, ink text). */
function SectionTag({ tone, children }: { tone: "blush" | "sage"; children: React.ReactNode }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[13px] font-medium text-ink ${
        tone === "blush" ? "bg-blush" : "bg-sage"
      }`}
    >
      {children}
    </span>
  );
}

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
                Childcare is personal. The price shouldn&apos;t be a mystery.
              </h1>
              <p className="mt-5 text-lg text-ink">
                Straight answers from Boston parents who just went through it.
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

      {/* --- Guide band: full-width blush, cream cards (design.md color roles v3) --- */}
      <section aria-labelledby="journey" className="bg-blush">
        <div className="mx-auto max-w-5xl px-5 py-14 sm:py-18">
          <h2 id="journey" className="text-3xl sm:text-4xl">
            The part no one prepares you for
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {guideCards.map((g) => (
              <li key={g.href} className="flex flex-col rounded-xl bg-cream p-6">
                <h3 className="font-heading text-[22px] leading-snug font-normal">{g.title}</h3>
                <p className="mt-2.5 flex-1 text-base">{g.teaser}</p>
                <Link href={g.href} className="text-link mt-5 font-medium">
                  {g.link} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --- Why we're doing this: timeline + letter card (artboard 11) --- */}
      <section aria-labelledby="story">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <SectionTag tone="sage">Why we&apos;re doing this</SectionTag>
            <h2 id="story" className="mt-4 text-3xl leading-tight sm:text-[40px]">
              We&apos;ve been there.
            </h2>
          </div>

          <div className="relative mt-12">
            <div aria-hidden className="absolute inset-x-0 top-[7px] hidden h-0.5 bg-sand-light sm:block" />
            <ol className="relative grid gap-7 sm:grid-cols-5">
              {timeline.map((t, i) => (
                <li key={t.when} className="relative pt-7">
                  <span
                    aria-hidden
                    className={`absolute top-0 left-0 size-3.5 rounded-full border-2 border-pine ${
                      i === timeline.length - 1 ? "bg-pine" : "bg-blush"
                    }`}
                  />
                  <p className="text-[13px] font-semibold tracking-[0.1em] text-sand-dark uppercase">{t.when}</p>
                  <h3 className="mt-1.5 font-heading text-[22px] font-normal">{t.what}</h3>
                  <p className="mt-1.5 text-[15px]">{t.detail}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mx-auto mt-14 max-w-[680px] rounded-[18px] border border-sand-light bg-white px-6 py-10 sm:px-13 sm:pt-12 sm:pb-11">
            <h3 className="font-heading text-[30px] leading-tight font-normal">We&apos;re Boston parents too.</h3>
            <StoryLetter />
            <div className="mt-7 flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-heading text-[21px] italic">Jonathan &amp; Talia · Jamaica Plain</p>
              <Link href="/how-it-works#our-story" className="text-link font-medium">
                Read our story →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- Around Boston: digest card, option F (from data/reading-list.json) --- */}
      <section aria-labelledby="around-boston" className="border-t border-sand-light">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <SectionTag tone="blush">Around Boston · {readingListMonth}</SectionTag>
            <h2 id="around-boston" className="mt-4 text-3xl leading-tight sm:text-[40px]">
              Five things worth your 10pm
            </h2>
            <p className="mt-3 text-muted-ink">
              Quick reads, in plain English.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[820px] rounded-[18px] border border-sand-light bg-white px-5 pt-6 pb-9 sm:px-12">
            <ol>
              {readingList.slice(0, 5).map((item, i) => (
                <li key={item.url} className="flex gap-4 border-t border-sand-light py-5 first:border-t-0 sm:gap-5">
                  <span aria-hidden className="shrink-0 font-heading text-[34px] leading-none text-pine tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <SectionTag tone="sage">{item.topic}</SectionTag>
                    <a
                      href={item.url}
                      className="mt-2 block font-semibold text-ink underline decoration-sand underline-offset-4 hover:decoration-pine"
                      rel="noopener"
                      target="_blank"
                    >
                      {item.title}
                    </a>
                    <p className="mt-1 text-base">
                      {item.takeaway} <span className="text-muted-ink">· {item.source}</span>
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 font-heading text-[19px] italic">— Jonathan &amp; Talia</p>
          </div>
          <p className="mt-7 text-center">
            <Link href="/guides" className="text-link font-medium">
              See everything we&apos;ve found →
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
