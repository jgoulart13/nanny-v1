// lib/costFacts.ts
// Headline numbers, FAQ answers and guide summaries used across the site.
// Every figure is read from data/boston-cost-seed.json (through costData) or
// computed from it by the estimator, so updating the data file updates every
// page, the FAQ and the JSON-LD together. No numbers are typed in by hand.

import { costData, pointsFor, requirePoint, type DataPoint } from "@/lib/costData";
import {
  agencyFees,
  defaultInputs,
  estimate,
  isTbd,
  usd,
  usdRange,
  type AgencyFee,
  type Range,
} from "@/lib/estimator";

const point = (metric: DataPoint["metric"], segment?: string) =>
  requirePoint(costData, metric, segment);

const hourlyPoints = pointsFor(costData, "hourly_rate_avg");
const hourlyValues = hourlyPoints.map((p) => p.value);

/** "Nanny Lane, Care.com": every source behind the hourly range. */
export const hourlySourceNames = [
  ...new Set(hourlyPoints.map((p) => p.source_name.split(" — ")[0])),
].join(", ");

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

/** Agency fees for the full-time example, one entry per agency. */
const ftFees = agencyFees(fullTimeExample.annualWages);
export const agencyFeeExamples: AgencyFee[] = isTbd(ftFees) ? [] : ftFees.byAgency;
export const agencyFeeRange: Range | null = isTbd(ftFees) ? null : ftFees.range;

/** What the full-time all-in total still leaves out, e.g. "Mass. unemployment insurance". */
export const allInPending = fullTimeExample.annualAllIn.pending;

export const allInLow = point("annual_all_in_low", "full_time");
export const allInHigh = point("annual_all_in_high", "full_time");
export const nannyMonthly = point("monthly_cost", "full_time");
export const daycareInfantMonthly = point("daycare_infant_monthly", "infant_center");
export const newbornHourly = point("hourly_rate_avg", "newborn");
export const partTimeHourly = point("hourly_rate_avg", "part_time");

export const ficaRate = point("fica_employer_rate");
export const ficaThreshold = point("fica_wage_threshold");
export const futaRate = point("futa_net_rate");
export const futaBase = point("futa_wage_base");
export const futaQuarter = point("futa_quarterly_threshold");
export const pfmlRate = point("ma_pfml_rate");

export const lastUpdated = costData.updated;

/** Short source credit, e.g. "Nanny Lane". */
export const shortSource = (p: DataPoint) => p.source_name.split(" — ")[0];

/** Round to the nearest $100 for headline figures: "$58,000". Always say "about". */
export const usdApprox = (n: number) => usd(Math.round(n / 100) * 100);
export const usdApproxRange = (r: Range) =>
  `${usdApprox(r.low)}–${usdApprox(r.high)}`;

const hoursPerWeek = defaultInputs.hoursPerWeek;
const pendingText = allInPending.length
  ? `, plus ${allInPending.join(" and ")}, which we're still confirming`
  : "";

/** "about $58,000–$59,800" */
export const typicalAllIn = `about ${usdApproxRange(fullTimeExample.annualAllIn.known)}`;

// --- Answer-first summary (must fit in the first 100 words) -----------------

export const answerFirst = [
  `Boston nannies typically ask ${usdRange(hourlyAcrossSources)} an hour in current listings and marketplace data.`,
  `Full-time at ${hoursPerWeek} hours a week, that's about ${usdRange(fullTimeExample.annualWages)} a year in wages.`,
  `All-in, meaning wages plus your employer taxes plus an agency's placement fee, the first year comes to ${typicalAllIn}${pendingText}.`,
].join(" ");

// --- FAQ (plain text, so it can go straight into FAQPage JSON-LD) -----------

export type FaqItem = { q: string; a: string; /** Show on the pillar page (max 3). */ pillar?: boolean };

const feeSentence = agencyFeeExamples
  .map((a) => `${a.agency} charges ${a.formula}`)
  .join("; ");

export const costFaq: FaqItem[] = [
  {
    pillar: true,
    q: "How much does a nanny cost per hour in Boston?",
    a: `Average asking rates in Boston run ${usdRange(hourlyAcrossSources)} an hour, depending on the source and the type of care (${hourlyPoints
      .map((p) => `${shortSource(p)}: ${usd(p.value)}`)
      .join("; ")}). These are asking or starting rates, not what families end up paying through an agency.`,
  },
  {
    pillar: true,
    q: "How much does a full-time nanny cost per year in Boston?",
    a: `At ${hoursPerWeek} hours a week, wages come to about ${usdRange(fullTimeExample.annualWages)} a year at Boston asking rates. Add employer taxes (about ${usdApproxRange(fullTimeExample.employerTaxes.known)}) and, through an agency, a one-time placement fee, and the first year comes to ${typicalAllIn}${pendingText}. ${shortSource(allInLow)} puts the total higher, at ${usd(allInLow.value)}–${usd(allInHigh.value)}+.`,
  },
  {
    q: "What does the all-in cost of a nanny include?",
    a: "Three main pieces: the nanny's gross wages, the employer taxes you owe as a household employer, and a one-time placement fee if you hire through an agency. Overtime for hours over 40 a week, paid time off and raises add to it.",
  },
  {
    pillar: true,
    q: "Do I have to pay taxes on a nanny in Massachusetts?",
    a: `Usually, yes. In 2026, once you pay a household employee ${usd(ficaThreshold.value)} or more, you owe ${ficaRate.value}% of wages for Social Security and Medicare as the employer (and withhold the same from their pay). Federal unemployment (FUTA) applies once you pay ${usd(futaQuarter.value)}+ in a quarter: ${futaRate.value}% of the first ${usd(futaBase.value)}. Massachusetts paid family and medical leave is ${pfmlRate.value}% of wages, which small household employers can withhold from the nanny's pay. Massachusetts unemployment insurance also applies; we're confirming the 2026 rate. IRS Publication 926 explains the federal rules.`,
  },
  {
    q: "How much do Boston nanny agencies charge?",
    a: feeSentence
      ? `Fees vary. Two Boston agencies publish theirs: ${feeSentence}. For a full-time nanny at ${hoursPerWeek} hours a week, that's about ${agencyFeeRange ? usdApproxRange(agencyFeeRange) : "TBD"} one time. We're collecting more.`
      : "TBD — we're collecting this.",
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
    a: "From public sources: the IRS, the Massachusetts paid leave office, nanny job listings, care marketplaces, a cost-modeling site and agencies' own published fees. Each is linked with its date and how it was measured. Most pay figures are asking rates, not what families actually pay through agencies, so we're collecting real quotes to close that gap.",
  },
];

// --- Cluster guides (empty-state stubs until full guides land) --------------

export type ClusterGuide = {
  slug: string;
  path: string;
  title: string;
  /** One paragraph that answers the question now. */
  answer: string;
};

export const clusterGuides: ClusterGuide[] = [
  {
    slug: "wages",
    path: "/boston/nanny-cost/wages",
    title: "What Boston nannies earn",
    answer: `Boston nanny asking rates run ${usdRange(hourlyAcrossSources)} an hour: about ${usdRange(fullTimeExample.hourly)} for nannies in general, ${usd(newbornHourly.value)} for newborn care (${shortSource(newbornHourly)}) and ${usd(partTimeHourly.value)} for part-time (${shortSource(partTimeHourly)}). These are listing and marketplace rates, not what families actually pay; we're collecting real numbers.`,
  },
  {
    slug: "taxes",
    path: "/boston/nanny-cost/taxes",
    title: "Nanny taxes in Massachusetts",
    answer: `When you hire a nanny, you usually become a household employer. In 2026 you owe ${ficaRate.value}% of wages for Social Security and Medicare once you pay ${usd(ficaThreshold.value)}+ in a year, plus federal unemployment (${futaRate.value}% of the first ${usd(futaBase.value)}). Massachusetts paid leave (${pfmlRate.value}%) can be withheld from your nanny's pay, and Massachusetts unemployment insurance also applies; we're confirming that rate. For a full-time nanny, the taxes we can calculate come to about ${usdApproxRange(fullTimeExample.employerTaxes.known)} a year.`,
  },
  {
    slug: "agency-fees",
    path: "/boston/nanny-cost/agency-fees",
    title: "What Boston nanny agencies charge",
    answer: feeSentence
      ? `Agencies usually charge a one-time placement fee, often a percentage of the nanny's first-year pay with a minimum, plus an upfront fee. ${feeSentence}. For a full-time nanny at ${hoursPerWeek} hours a week, that's about ${agencyFeeRange ? usdApproxRange(agencyFeeRange) : "TBD"}. We're collecting more agencies' fees.`
      : "Agencies usually charge a one-time placement fee. TBD — we're collecting Boston agencies' fees.",
  },
  {
    slug: "nanny-share",
    path: "/boston/nanny-cost/nanny-share",
    title: "How a nanny share changes the math",
    answer: "In a nanny share, two families hire one nanny together and split the cost, while the nanny often earns more per hour than for one family. How much each family saves in Boston: TBD — we're collecting real splits from families and agencies.",
  },
  {
    slug: "vs-daycare",
    path: "/boston/nanny-cost/vs-daycare",
    title: "Nanny vs. daycare in Boston",
    answer: `${shortSource(daycareInfantMonthly)} models infant daycare in Boston at about ${usd(daycareInfantMonthly.value)} a month, versus about ${usd(nannyMonthly.value)} a month for a full-time nanny including employer taxes. Both are modeled estimates (low confidence). We'll add county-level daycare prices from the U.S. Department of Labor.`,
  },
];

export const clusterByPath = (path: string) =>
  clusterGuides.find((g) => g.path === path);
