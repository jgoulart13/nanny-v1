# Step 02 — True-cost page + estimator (the hero)

Read `docs/05-agent-discoverability.md` §1–2, `data/boston-cost-seed.json` and `specs/cost-model.schema.json`.

1. `lib/costData.ts`: load and validate `data/boston-cost-seed.json` against the schema (zod) at build time.
2. `lib/estimator.ts`: a pure function, `estimate(inputs) → { hourly: {low, mid, high}, weekly, employerTaxes, placementFee, annualAllIn, sources[] }`.
   - The hourly range comes from the data points for the relevant segment (min and max across sources, plus the median).
   - Any assumption with `value: null` shows as "TBD — collecting," never a guessed number.
   - Unit tests cover full-time, part-time, newborn, nanny share and missing-data cases.
3. `/boston/nanny-cost` page, server-rendered:
   - **Answer first:** a 2–3 sentence summary with the range and the all-in framing in the first 100 words.
   - A source table (figure, basis, as-of date, link) with a note: "Most public figures are asking rates, not what families actually pay through agencies. We're collecting real quotes."
   - Sections: wage vs. all-in cost · employer taxes · agency fees · nanny share · nanny vs. daycare · FAQ (8–10 Qs).
   - The estimator as a small client component; the page content stays fully readable without it.
   - CTA: "Get matched with vetted agencies →" `/brief`
   - A "Last updated" date taken from the data file.
4. JSON-LD: Article + FAQPage + Dataset.

**Acceptance:** the page reads well with JS off; tests pass; every number traces to the data file; Lighthouse SEO ≥ 95.
