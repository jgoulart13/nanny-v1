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
          Find a great Boston nanny through trusted agencies, and know what you
          should pay.
        </h1>
        <p className="mt-5 text-lg text-muted-ink">
          We work for your family: honest all-in costs, then a short brief we
          send to a few vetted agencies on your behalf.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/brief" className={buttonClass({ size: "lg" })}>
            Get matched
          </Link>
          <Link
            href="/boston/nanny-cost"
            className={buttonClass({ variant: "outline", size: "lg" })}
          >
            See what it costs
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <DisclosureNote />
      </div>
    </PageShell>
  );
}
