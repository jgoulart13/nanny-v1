import type { Metadata } from "next";
import Link from "next/link";
import { Estimator } from "@/components/cost/estimator";
import { PageShell } from "@/components/page-intro";
import { formatDate } from "@/lib/costData";
import { lastUpdated } from "@/lib/costFacts";

export const metadata: Metadata = {
  title: "Estimate your Boston nanny cost",
  description:
    "Your all-in nanny cost in Boston: wages, employer taxes and agency fees, with every figure sourced. Change hours, ages and arrangement to see your range.",
  alternates: { canonical: "/estimate" },
};

// The estimator is a client component, but its first render happens on the
// server: with JavaScript off, this page still shows the default full-time
// estimate and its sources.
export default function EstimatePage() {
  return (
    <PageShell>
      <header className="prose-width">
        <p className="eyebrow mb-3">
          Boston · Updated <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
        </p>
        <h1 className="text-4xl leading-tight sm:text-5xl">
          Estimate your nanny cost
        </h1>
        <p className="mt-5 text-lg">
          Wages, employer taxes and agency fees for your situation. Every
          number is sourced.
        </p>
      </header>

      <div className="mt-10">
        <Estimator />
      </div>

      {/* design.md color roles: blush = people. UI only until the leads step. */}
      <section
        aria-labelledby="email-estimate"
        className="prose-width mt-10 rounded-xl bg-blush p-6 sm:p-8"
      >
        <h2 id="email-estimate" className="text-2xl">
          Email me this estimate
        </h2>
        <p className="mt-2">
          Keep your numbers for when you&apos;re ready. We&apos;ll only use your
          email to send this.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="estimate-email" className="sr-only">
            Email
          </label>
          <input
            id="estimate-email"
            type="email"
            disabled
            placeholder="you@example.com"
            className="h-11 flex-1 rounded-md border border-sand-light bg-white px-3 text-base text-ink disabled:opacity-70"
          />
          <button
            type="button"
            disabled
            className="h-11 rounded-full bg-pine px-6 font-medium text-white disabled:opacity-60"
          >
            Coming soon
          </button>
        </div>
      </section>

      <p className="prose-width mt-10 text-[15px] text-muted-ink">
        The background behind these numbers:{" "}
        <Link href="/guides" className="text-link">
          our guides
        </Link>
        . Questions?{" "}
        <Link href="/faq" className="text-link">
          See the FAQ
        </Link>
        .
      </p>
    </PageShell>
  );
}
