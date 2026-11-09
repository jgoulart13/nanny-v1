import type { Metadata } from "next";
import Link from "next/link";
import { Button, buttonClass } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageShell } from "@/components/page-intro";
import { DisclosureNote } from "@/components/disclosure-note";

// Internal design reference: every token and component from design.md
// in one place. Hidden: not linked, not in the sitemap, noindex.
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const swatches = [
  { name: "cream", hex: "#F7F3EC", className: "bg-cream", use: "Page background" },
  { name: "ink", hex: "#1F2D2A", className: "bg-ink", use: "Body text, headings" },
  { name: "pine", hex: "#3F5E52", className: "bg-pine", use: "Primary buttons, links, key numbers" },
  { name: "muted-ink", hex: "#5F6B66", className: "bg-muted-ink", use: "Secondary text, sources" },
  { name: "sage", hex: "#D7E2D3", className: "bg-sage", use: "Cards, estimator, selected" },
  { name: "blush", hex: "#E9CBC5", className: "bg-blush", use: "Rare warm highlight (opt-in)" },
  { name: "blue", hex: "#D1DFE9", className: "bg-blue", use: "Info, confidence, source notes" },
  { name: "sand", hex: "#BDA58B", className: "bg-sand", use: "Borders, decorative only" },
  { name: "sand-dark", hex: "#7A6650", className: "bg-sand-dark", use: "Small labels" },
];

// Real figures from data/boston-cost-seed.json (CLAUDE.md rule 4: no invented numbers).
const sampleRows = [
  { label: "Average hourly, all", value: "$22.61", source: "Nanny Lane", confidence: "medium" as const },
  { label: "Average hourly, newborn", value: "$24.20", source: "Care.com", confidence: "medium" as const },
  { label: "Agency placement fee", value: null, source: "Collecting from agencies", confidence: "low" as const },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-16 first:mt-10">
      <h2 className="mb-6 text-3xl">{title}</h2>
      {children}
    </section>
  );
}

export default function StyleguidePage() {
  return (
    <PageShell>
      <p className="eyebrow mb-3">Internal · noindex</p>
      <h1 className="text-4xl sm:text-5xl">Style guide</h1>
      <p className="prose-width mt-4 text-lg text-muted-ink">
        Everything here comes from <code>design.md</code>. If something looks
        wrong, change design.md first, then the theme in{" "}
        <code>app/globals.css</code>.
      </p>

      <Section title="Colors">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {swatches.map((s) => (
            <li key={s.name} className="overflow-hidden rounded-lg border border-sand-light bg-white">
              <div className={`h-16 ${s.className}`} />
              <div className="p-3 text-sm">
                <p className="font-semibold text-ink">{s.name}</p>
                <p className="tabular-nums text-muted-ink">{s.hex}</p>
                <p className="mt-1 text-muted-ink">{s.use}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Type">
        <div className="space-y-5">
          <p className="eyebrow">Eyebrow · Boston · 2026</p>
          <p className="font-heading text-5xl text-ink">H1 · Fraunces, regular</p>
          <p className="font-heading text-3xl text-ink">H2 · What you’ll actually pay</p>
          <h3 className="text-xl">H3 · Figtree semibold</h3>
          <p className="prose-width">
            Body · Figtree 17px, line-height 1.6. Plainspoken and warm: here’s
            where this number comes from, and what we’re still collecting.{" "}
            <Link href="/styleguide" className="text-link">This is a link.</Link>
          </p>
          <p className="text-[15px] text-muted-ink">Caption · muted-ink, for sources and notes.</p>
          <p className="font-sans text-5xl font-medium text-pine tabular-nums">$22.61/hr</p>
          <p className="text-sm text-muted-ink">
            Hero number · pine, tabular figures. Source: Nanny Lane listings (asking rates).
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Get matched</Button>
          <Button variant="outline">See what it costs</Button>
          <Button size="lg">Large primary</Button>
          <Link href="/styleguide" className={buttonClass({ variant: "outline", size: "lg" })}>
            Link as button
          </Link>
          <Button disabled>Disabled</Button>
        </div>
      </Section>

      <Section title="Badges (confidence)">
        <div className="flex flex-wrap gap-3">
          <Badge variant="high">High confidence</Badge>
          <Badge variant="medium">Medium confidence</Badge>
          <Badge variant="low">Low confidence</Badge>
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>White card</CardTitle>
              <CardDescription>Soft sand ring, almost no shadow.</CardDescription>
            </CardHeader>
            <CardContent>Default card on cream.</CardContent>
          </Card>
          <Card className="bg-sage ring-0">
            <CardHeader>
              <CardTitle>Estimator panel (sage)</CardTitle>
              <CardDescription className="text-ink/80">Ink text only on sage.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="italic text-muted-ink">TBD — collecting</p>
            </CardContent>
          </Card>
          <Card className="bg-blush ring-0 sm:col-span-2">
            <CardHeader>
              <CardTitle>Keep my profile for next time</CardTitle>
              <CardDescription className="text-ink/80">
                Opt-in card (blush), shown at the end of the brief.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Section>

      <Section title="Source table">
        <Table className="text-base">
          <TableHeader>
            <TableRow>
              <TableHead>Figure</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Confidence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleRows.map((r) => (
              <TableRow key={r.label} className="border-sand-light">
                <TableCell>{r.label}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {r.value ?? <span className="italic text-muted-ink">TBD — collecting</span>}
                </TableCell>
                <TableCell className="text-muted-ink">{r.source}</TableCell>
                <TableCell>
                  <Badge variant={r.confidence}>{r.confidence}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Disclosure note">
        <DisclosureNote />
      </Section>
    </PageShell>
  );
}
