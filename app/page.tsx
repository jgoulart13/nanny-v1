import Link from "next/link";
import { buttonClass } from "@/components/ui/button";
import { PageShell } from "@/components/page-intro";
import { DisclosureNote } from "@/components/disclosure-note";

export default function HomePage() {
  return (
    <PageShell>
      <div className="prose-width">
        <p className="eyebrow mb-3">Boston · Nannies</p>
        <h1 className="text-4xl leading-tight sm:text-6xl">
          Know what a Boston nanny really costs.
        </h1>
        <p className="mt-5 text-lg text-muted-ink">
          Honest, sourced numbers for what a Boston nanny really costs:
          wages, employer taxes and agency fees.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/boston/nanny-cost" className={buttonClass({ size: "lg" })}>
            See what it costs
          </Link>
          <Link
            href="/estimate"
            className={buttonClass({ variant: "outline", size: "lg" })}
          >
            Estimate your cost
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <DisclosureNote />
      </div>
    </PageShell>
  );
}
