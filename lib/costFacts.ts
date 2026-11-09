// lib/costFacts.ts
// The headline numbers and FAQ answers for /boston/nanny-cost.
// Every figure is read from data/boston-cost-seed.json (through costData) or
// computed from it by the estimator, so updating the data file updates the
// page, the FAQ and the JSON-LD together. No numbers are typed in by hand.

import { costData, pointsFor, type DataPoint } from "@/lib/costData";
import {
  defaultInputs,
  estimate,
  usd,
  usdRange,
  type Range,
} from "@/lib/estimator";

/** Exactly one data point, or the build fails (better than a blank number). */
function onePoint(metric: DataPoint["metric"], segment?: string): DataPoint {
  const matches = pointsFor(costData, metric, segment ? [segment] : undefined);
  if (matches.length === 0) {
    throw new Error(`Missing data point: ${metric} (${segment ?? "any"})`);
  }
  return matches[0];
}

const hourlyPoints = pointsFor(costData, "hourly_rate_avg");
const hourlyValues = hourlyPoints.map((p) => p.value);

/** Lowest to highest average hourly rate across every source and segment. */
export const hourlyAcrossSources: Range = {
  low: Math.min(...hourlyValues),
  mid: Math.min(...hourlyValues), // not displayed
  high: Math.max(...hourlyValues),
};

/** The estimator's default case: full-time, 40 hours/week, through an agency. */
export const fullTimeExample = estimate({
  ...defaultInputs,
  arrangement: "full_time",
});

export const allInLow = onePoint("annual_all_in_low", "full_time");
export const allInHigh = onePoint("annual_all_in_high", "full_time");
export const nannyMonthly = onePoint("monthly_cost", "full_time");
export const daycareInfantMonthly = onePoint(
  "daycare_infant_monthly",
  "infant_center",
);
export const newbornHourly = onePoint("hourly_rate_avg", "newborn");
export const partTimeHourly = onePoint("hourly_rate_avg", "part_time");

export const lastUpdated = costData.updated;

/** Short source credit, e.g. "Nanny Lane". */
export const shortSource = (p: DataPoint) => p.source_name.split(" — ")[0];

const hoursPerWeek = defaultInputs.hoursPerWeek;

// --- Answer-first summary (must fit in the first 100 words) -----------------

export const answerFirst = [
  `Boston nannies typically ask ${usdRange(hourlyAcrossSources)} an hour in current listings and marketplace data.`,
  `Full-time at ${hoursPerWeek} hours a week, that's about ${usdRange(fullTimeExample.annualWages)} a year in wages alone.`,
  `The all-in cost is higher: as the employer you also pay payroll taxes, and agencies charge a placement fee.`,
  `One local agency puts the total at ${usd(allInLow.value)}–${usd(allInHigh.value)}+ a year.`,
].join(" ");

// --- FAQ (plain text, so it can go straight into FAQPage JSON-LD) -----------

export type FaqItem = { q: string; a: string };

export const costFaq: FaqItem[] = [
  {
    q: "How much does a nanny cost per hour in Boston?",
    a: `Average asking rates in Boston run ${usdRange(hourlyAcrossSources)} an hour, depending on the source and the type of care (${hourlyPoints
      .map((p) => `${shortSource(p)}: ${usd(p.value)}`)
      .join("; ")}). These are asking or starting rates, not what families end up paying through an agency.`,
  },
  {
    q: "How much does a full-time nanny cost per year in Boston?",
    a: `At ${hoursPerWeek} hours a week, wages alone come to about ${usdRange(fullTimeExample.annualWages)} a year using Boston asking rates. Add employer payroll taxes and, if you use an agency, a placement fee. ${shortSource(allInLow)} estimates the total employer cost at ${usd(allInLow.value)}–${usd(allInHigh.value)}+ a year.`,
  },
  {
    q: "What does the all-in cost of a nanny include?",
    a: "Three main pieces: the nanny's gross wages, the employer payroll taxes you owe as a household employer, and a one-time placement fee if you hire through an agency. Overtime for hours over 40 a week, paid time off and raises add to it.",
  },
  {
    q: "Do I have to pay taxes on a nanny in Massachusetts?",
    a: "Usually, yes. A nanny who works in your home is generally your household employee, which can mean Social Security and Medicare (FICA), federal unemployment tax (FUTA) and Massachusetts unemployment insurance; Massachusetts Paid Family and Medical Leave may also apply. We're verifying the 2026 rates with a payroll provider before we publish a number. IRS Publication 926 explains the federal rules.",
  },
  {
    q: "How much do Boston nanny agencies charge?",
    a: "TBD — we're collecting this. Agencies usually charge a one-time placement fee, but few publish it. We'll show a range once at least three Boston agencies share their fees with us.",
  },
  {
    q: "Is a newborn nanny more expensive in Boston?",
    a: `Somewhat. ${shortSource(newbornHourly)} lists an average starting rate of ${usd(newbornHourly.value)} an hour for newborn nannies in Boston, compared with ${usdRange(fullTimeExample.hourly)} for nannies in general.`,
  },
  {
    q: "How much does a part-time nanny cost in Boston?",
    a: `${shortSource(partTimeHourly)} lists an average of ${usd(partTimeHourly.value)} an hour for part-time nannies in Boston.`,
  },
  {
    q: "Is a nanny cheaper than daycare in Boston?",
    a: `Usually not for one child. ${shortSource(daycareInfantMonthly)} models infant daycare in Boston at about ${usd(daycareInfantMonthly.value)} a month, versus about ${usd(nannyMonthly.value)} a month for a full-time nanny including employer taxes. A nanny share or more than one child can narrow the gap.`,
  },
  {
    q: "What is a nanny share, and how much does it save?",
    a: "In a nanny share, two families hire one nanny together and split the cost; the nanny often earns more per hour than for one family. How much each family saves: TBD — we're collecting real splits from Boston families and agencies.",
  },
  {
    q: "Where do these numbers come from?",
    a: "From public sources: nanny job listings, care marketplaces, a cost-modeling site and a local agency's published estimate. Each is linked in the source table with its date and how it was measured. Most are asking rates, not what families actually pay through agencies, so we're collecting real quotes to close that gap.",
  },
];
