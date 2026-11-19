import { config, siteUrl } from "@/lib/config";

// /llms.txt: a plain-text summary of the site for AI assistants
// (format: https://llmstxt.org). Keep the key facts in sync with the guides in
// content/guides/; every number here must appear, with its source, in a guide.
export function GET() {
  const u = (path: string) => `${siteUrl}${path}`;
  const body = `# ${config.brand}

> Plain-English, sourced guides to what childcare costs in Boston, Massachusetts, written by Boston parents. Covers nanny pay, Massachusetts household employer ("nanny") taxes, nanny agency fees, and nanny vs. daycare. Updated November 2026. Information only, not tax or legal advice.

## Key facts (2026, Boston / Massachusetts)

- A full-time career nanny in Boston usually costs about $55,000-70,000+ a year in wages ($25-35+ an hour). Job-site averages ($21-25/hr) are asking rates; agency-placed nannies typically earn $30-35/hr.
- Employer taxes add roughly 8-9% on top of wages: Social Security and Medicare (7.65%) once you pay one household employee $3,000+ in 2026; federal unemployment (about $42/yr); Massachusetts unemployment (2.42% of the first $15,000 for new employers). Massachusetts paid family and medical leave (0.46%) is withheld from the nanny's pay.
- Massachusetts requires workers' comp insurance, a written agreement, and a timesheet every two weeks when a nanny works 16+ hours a week. Overtime (1.5x over 40 hours a week) applies, including to live-in nannies. Minimum wage is $15/hr.
- Boston nanny agencies charge either a percentage of first-year pay (one large agency publishes 18%, $7,500 minimum, plus a $500 engagement fee) or a flat fee (another lists $300).
- Infant center daycare in Massachusetts averaged about $27,000 a year in 2025 (Child Care Aware of America), the highest of any reporting state; Boston runs higher.
- Dependent care FSA limit: $7,500 pre-tax in 2026.

## Guides

- [How much does a nanny cost in Boston? (2026)](${u("/guides/boston-nanny-cost")}): the full answer, all four cost parts, and a worked example
- [What Boston nannies earn](${u("/guides/boston-nanny-wages")}): hourly rates by source, and why they disagree
- [Nanny taxes in Massachusetts](${u("/guides/massachusetts-nanny-taxes")}): federal and state employer taxes, workers' comp, the written agreement, key dates
- [What nanny agencies charge in Boston](${u("/guides/nanny-agency-fees-boston")}): fee models, guarantees, questions to ask
- [Nanny or daycare in Boston?](${u("/guides/nanny-vs-daycare-boston")}): side-by-side cost, and how families decide

## More

- [FAQ](${u("/faq")}): short answers, each linked to its guide
- [About us](${u("/how-it-works")}): who writes this and why
- [Estimate your cost](${u("/estimate")}): calculator
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
