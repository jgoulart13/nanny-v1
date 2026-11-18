import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, PageShell } from "@/components/page-intro";
import { formatUpdated, getAllGuides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Plain-English guides for Boston parents hiring a nanny: what nannies earn, what agencies charge, and nanny taxes in Massachusetts.",
  alternates: { canonical: "/guides" },
};

export default async function GuidesPage() {
  const guides = await getAllGuides();

  return (
    <PageShell>
      <PageIntro
        eyebrow="Boston · Guides"
        title="Guides"
        description="What we wish someone had told us: sourced, dated and written for parents."
      />
      <ul className="mt-10 grid gap-4 md:grid-cols-3">
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              href={g.path}
              className="group flex h-full flex-col rounded-xl bg-sage p-6 ring-1 ring-transparent transition-shadow hover:ring-pine"
            >
              {g.draft && (
                // Small blush tag: blush is an accent only (design.md).
                <span className="mb-3 w-fit rounded-full bg-blush px-2.5 py-0.5 text-xs font-medium text-ink">
                  Coming soon
                </span>
              )}
              <h2 className="text-2xl">{g.title}</h2>
              <p className="mt-2 flex-1 text-ink">{g.description}</p>
              <p className="mt-4 text-sm text-ink">
                Updated {formatUpdated(g.updated)}
                {g.readingTime !== "TBD" && ` · ${g.readingTime}`}
              </p>
              <span className="mt-3 font-medium text-pine group-hover:underline">
                Read the guide →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  );
}
