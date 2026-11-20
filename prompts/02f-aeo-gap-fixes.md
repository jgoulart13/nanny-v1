# Step 02f — AEO gap fixes (from the week-0 baseline)

Read first: `CLAUDE.md`, `data/aeo-log.csv` (week 0), `content/guides/boston-nanny-cost.mdx`, `content/guides/massachusetts-nanny-taxes.mdx`, `lib/estimator.ts`, `lib/estimateResponse.ts`, `app/llms.txt/route.ts`.

## Why
On 11/19 we asked Google AI Mode, Claude and ChatGPT "How much does a nanny cost in Boston?" None cited us (expected, since the site was a day old). What matters is what they said:
- All three already split marketplace rates from agency rates. Saying that alone won't get us cited.
- **None of them included the agency placement fee.** A family hiring through an agency pays $10k–14k more than any of those answers. This is our answer-first claim.
- Claude's answer included **workers' comp** and **paid time off**. Our estimator includes neither, even though our taxes guide says workers' comp is required at 16+ hours a week. An assistant comparing sources would see ours as the incomplete one.
- The pages that got cited are dated "2026 pricing guides."

## Rules for this step
- `CLAUDE.md` rule 4 applies to everything: **every number shows its source; no invented figures; if a number isn't sourced, show "TBD — collecting."**
- Don't make claims about competitors or AI assistants on the site (no "other sites leave this out"). Just state our numbers clearly and first.
- Don't add new pages. No new services or secrets.

## Build

1. **Lead with the agency fee.**
   - `content/guides/boston-nanny-cost.mdx`: rewrite `shortAnswer` so the first sentence gives the **all-in first-year cost through an agency** (wages + employer taxes + placement fee) for a full-time nanny, using the estimator's agency-placed numbers. The second sentence gives the hiring-on-your-own figure. Then one sentence saying the placement fee is one-time, so year two costs less. Keep it under about 70 words. Put the same answer in the first paragraph of the body.
   - `app/llms.txt/route.ts`: make the first bullet under "Key facts" the same all-in-through-an-agency figure, with the placement fee spelled out.
   - The numbers must come from the estimator. Add a test that fails if the guide's `shortAnswer` all-in range drifts from `estimate(defaultInputs)` (rounding to the nearest $1,000 is fine). If parsing MDX in a test is awkward, put the figures in one exported constant that both the guide and the test read.

2. **Add workers' comp to the estimator.**
   - New line under employer costs: "Workers' comp insurance (required at 16+ hrs/week in Massachusetts)."
   - Look for a published, citable annual premium for a single household employee in Massachusetts (for example, a nanny payroll service's or an insurer's published figure, or a Mass. DIA source). If you find one, add it to `data/boston-cost-seed.json` with its URL and date. If you can't find one you'd be comfortable citing, make the line **TBD — collecting** with the reason. Don't guess.
   - Apply it only when `hoursPerWeek >= 16`. Below 16, show the line as "Not required under 16 hrs/week."
   - Update the taxes guide's "Varies; get a quote" cell only if you found a sourced number.

3. **Add paid time off as a line, not a guess.**
   - Massachusetts doesn't require paid vacation; our taxes guide says sick time is up to 40 hours a year and can be unpaid for a one-nanny household. So add a line **"Paid time off (not required by law; most families offer it)"** that is **not included in the all-in total** by default.
   - If you find a sourced typical amount (for example, paid holidays and vacation weeks from an agency's published work agreement or a reputable nanny-industry survey), show it as an *optional* figure with its source. Otherwise show "TBD — collecting."
   - Make the all-in label say what it includes, for example "All-in, first year (wages, employer taxes, workers' comp, agency fee)."

4. **Carry it through to agents.** `toAgentResponse()` returns the new lines (with sources or TBD) and an `excluded_from_total` list (PTO for now). The MCP summary paragraph mentions the placement fee and that PTO isn't included. The API and MCP still match `/estimate` (the existing parity test must pass).

5. **Use "2026" and show freshness on every guide.**
   - Add "(2026)" to the titles of the four guides that don't have it: wages, Mass. nanny taxes, agency fees, nanny vs. daycare. Keep the slugs and URLs the same.
   - Make sure the "Updated" date sits visibly near the top of each guide, above the fold, and matches `updated` in the frontmatter and `dateModified` in the Article JSON-LD.
   - Bump `updated` on any guide you change in this step.

6. **Tests and checks.** `npm test` and `npm run build` pass. Add tests for: workers' comp applied at 16+ hours and not below; PTO excluded from the total; the guide/llms.txt all-in figure matching the estimator.

## Show Jonathan how to test
- `npm run dev`, then open `/guides/boston-nanny-cost`: the first sentence gives the all-in-through-an-agency figure.
- `/estimate`: a workers' comp line (a number with a source, or TBD) and a PTO line marked as not included.
- `/estimate` with 12 hours a week: workers' comp shows "Not required under 16 hrs/week."
- `/llms.txt`: the first key fact matches the guide.
- After deploy: `https://www.sillygooseboston.com/api/estimate` shows the new lines.

## Acceptance
- The agency-fee all-in figure is the first thing a reader or crawler sees on the main guide and in `/llms.txt`, and it matches the estimator.
- Workers' comp and PTO are visible and honest: sourced or TBD, never guessed.
- All five guides have "(2026)" in the title and a visible updated date.
- `docs/` is unchanged. If any number changed, update `STATUS.md`.

Commit message: `Step 02f: AEO gap fixes (agency-fee-first answer, workers' comp, PTO, 2026 titles)`. Finish with what changed, how to test, and what's next.
