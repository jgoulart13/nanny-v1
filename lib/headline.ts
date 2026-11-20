// lib/headline.ts
// The site's headline answer to "How much does a nanny cost in Boston?",
// computed from the estimator so it can't drift from /estimate.
// Used by /llms.txt. The main guide's shortAnswer is plain text (MDX
// frontmatter), so tests/headline.test.ts checks it against these figures.

import { defaultInputs, estimate, isTbd, type Range } from "@/lib/estimator";

/** Round to the nearest $1,000: 77239 → 77000. */
const k = (n: number) => Math.round(n / 1000) * 1000;
const kRange = (r: Range) => ({ low: k(r.low), high: k(r.high) });
const money = (n: number) => `$${n.toLocaleString("en-US")}`;
/** "$77,000–92,000" (or "$51,000" when both ends round the same). */
export const moneyRange = (r: { low: number; high: number }) =>
  r.low === r.high ? money(r.low) : `${money(r.low)}–${r.high.toLocaleString("en-US")}`;

const viaAgency = estimate({ ...defaultInputs, viaAgency: true });
const onYourOwn = estimate({ ...defaultInputs, viaAgency: false });

const fee = viaAgency.placementFee;
if (fee === "not_applicable" || isTbd(fee)) {
  throw new Error("Headline needs agency placement fees in the data.");
}

/** Full-time (40 h/week), one toddler, all figures rounded to the nearest $1,000. */
export const headline = {
  hoursPerWeek: defaultInputs.hoursPerWeek,
  agency: {
    allIn: kRange(viaAgency.annualAllIn.known),
    wages: kRange(viaAgency.annualWages),
    employerTaxes: kRange(viaAgency.employerTaxes.known),
    placementFee: kRange(fee.range),
    /** Year two: same wages and taxes, no placement fee. */
    yearTwo: kRange({
      low: viaAgency.annualAllIn.known.low - fee.range.low,
      mid: 0,
      high: viaAgency.annualAllIn.known.high - fee.range.high,
    }),
    hourly: viaAgency.hourly,
  },
  onYourOwn: {
    allIn: kRange(onYourOwn.annualAllIn.known),
    hourly: onYourOwn.hourly,
  },
  /** e.g. ["Workers' comp insurance"]: costs not yet in the totals. */
  pending: viaAgency.annualAllIn.pending,
} as const;
