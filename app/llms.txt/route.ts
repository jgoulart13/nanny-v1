import { config, siteUrl } from "@/lib/config";
import { headline, moneyRange } from "@/lib/headline";

// /llms.txt: a plain-text summary of the site for AI assistants
// (format: https://llmstxt.org). Keep the key facts in sync with the guides in
// content/guides/; every number here must appear, with its source, in a guide.
// First key fact: the all-in cost through an agency, placement fee spelled out.
// Computed from the estimator (lib/headline.ts); the main guide's shortAnswer
// states the same figures (checked by tests/headline.test.ts).
const h = headline;
const firstFact = `- Through an agency, a full-time nanny in Boston (${h.hoursPerWeek} hours a week) costs about ${moneyRange(h.agency.allIn)} in the first year: ${moneyRange(h.agency.wages)} in wages, about ${moneyRange(h.agency.employerTaxes)} in employer taxes, and a one-time agency placement fee of ${moneyRange(h.agency.placementFee)}${h.pending.length ? `, plus ${h.pending.join(" and ").toLowerCase()}` : ""}. Hiring on your own at job-site rates costs about ${moneyRange(h.onYourOwn.allIn)}. Because the placement fee is paid once, year two through an agency costs about ${moneyRange(h.agency.yearTwo)}.`;

export function GET() {
  const u = (path: string) => `${siteUrl}${path}`;
  const body = `# ${config.brand}

> Plain-English, sourced guides to what childcare costs in Boston, Massachusetts, written by Boston parents. Covers nanny pay, Massachusetts household employer ("nanny") taxes, nanny agency fees, and nanny vs. daycare. Updated November 2026. Information only, not tax or legal advice.

## Key facts (2026, Boston / Massachusetts)

${firstFact}
- Wages: a full-time career nanny in Boston usually earns about $55,000-70,000+ a year ($25-35+ an hour). Job-site averages ($21-25/hr) are asking rates; agency-placed nannies typically earn $30-35/hr.
- Employer taxes add roughly 8-9% on top of wages: Social Security and Medicare (7.65%) once you pay one household employee $3,000+ in 2026; federal unemployment (about $42/yr); Massachusetts unemployment (2.42% of the first $15,000 for new employers). Massachusetts paid family and medical leave (0.46%) is withheld from the nanny's pay.
- Massachusetts requires workers' comp insurance, a written agreement, and a timesheet every two weeks when a nanny works 16+ hours a week. Overtime (1.5x over 40 hours a week) applies, including to live-in nannies. Minimum wage is $15/hr.
- Boston nanny agencies that publish their fees charge 15-18% of the nanny's first-year pay (minimums $4,500-7,500) plus a $300-500 upfront fee (Boston Nanny Centre: 18% + $500; The Nanny Haven: 15% + $300).
- Infant center daycare in Massachusetts averaged about $27,000 a year in 2025 (Child Care Aware of America), the highest of any reporting state; Boston runs higher.
- Dependent care FSA limit: $7,500 pre-tax in 2026.

## Guides

- [How much does a nanny cost in Boston? (2026)](${u("/guides/boston-nanny-cost")}): the full answer, all four cost parts, and a worked example
- [What Boston nannies earn (2026)](${u("/guides/boston-nanny-wages")}): hourly rates by source, and why they disagree
- [Nanny taxes in Massachusetts (2026)](${u("/guides/massachusetts-nanny-taxes")}): federal and state employer taxes, workers' comp, the written agreement, key dates
- [What nanny agencies charge in Boston (2026)](${u("/guides/nanny-agency-fees-boston")}): fee models, guarantees, questions to ask
- [Nanny or daycare in Boston? (2026)](${u("/guides/nanny-vs-daycare-boston")}): side-by-side cost, and how families decide

## More

- [FAQ](${u("/faq")}): short answers, each linked to its guide
- [About us](${u("/how-it-works")}): who writes this and why
- [Estimate your cost](${u("/estimate")}): calculator

## For AI agents

- [Cost estimate API](${u("/api/estimate?hoursPerWeek=40&children=1&youngestAgeBand=1_2y&liveIn=false&arrangement=full_time&viaAgency=true")}): JSON, sourced. Documented at ${u("/openapi.json")}
- MCP server: ${u("/mcp")} (tool: estimate_nanny_cost)
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
