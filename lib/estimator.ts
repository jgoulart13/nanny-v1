// lib/estimator.ts
// The nanny cost estimator. A pure function: same inputs → same outputs,
// no network, no database. Every number it returns is either
//   (a) taken from data/boston-cost-seed.json, or
//   (b) simple arithmetic on (a) (rate × hours × weeks, tax rate × wages,
//       agency % × wages),
// and anything we don't know yet comes back as TBD, never a guess.

import { z } from "zod";
import {
  costData,
  pointsFor,
  requirePoint,
  type CostModel,
  type DataPoint,
} from "@/lib/costData";

// --- Inputs ------------------------------------------------------------------

/** Age bands match specs/family-brief.schema.json. No birthdates, ever. */
export const ageBands = [
  "expecting",
  "0_12m",
  "1_2y",
  "3_5y",
  "6_12y",
  "13_plus",
] as const;

export const arrangements = ["full_time", "part_time", "nanny_share"] as const;

export const estimateInputsSchema = z.object({
  hoursPerWeek: z.number().int().min(1).max(70),
  /** Number of children in care (0 allowed when expecting). */
  children: z.number().int().min(0).max(6),
  youngestAgeBand: z.enum(ageBands),
  /** 5-digit ZIP, optional. Not used in the math yet (no neighborhood data). */
  zip: z
    .string()
    .regex(/^\d{5}$/)
    .optional(),
  liveIn: z.boolean(),
  arrangement: z.enum(arrangements),
  /** true = hire through an agency (placement fee applies). */
  viaAgency: z.boolean(),
});

export type EstimateInputs = z.infer<typeof estimateInputsSchema>;

export const defaultInputs: EstimateInputs = {
  hoursPerWeek: 40,
  children: 1,
  youngestAgeBand: "1_2y",
  liveIn: false,
  arrangement: "full_time",
  viaAgency: true,
};

// --- Outputs -----------------------------------------------------------------

export type Range = { low: number; mid: number; high: number };

/** A figure we can't calculate honestly yet. Render as "TBD — collecting". */
export type Tbd = { tbd: true; reason: string };

/** One line of a breakdown, e.g. "Social Security & Medicare (your share)". */
export type Line = {
  key: string;
  label: string;
  value: Range | Tbd;
  /** Short plain-English note, e.g. "7.65% of wages". */
  note?: string;
  sources: DataPoint[];
};

/** A total built from lines. `known` adds up only the lines we can calculate. */
export type Breakdown = {
  lines: Line[];
  known: Range;
  /** Labels of lines that are still TBD. Empty = the total is complete. */
  pending: string[];
};

export type AgencyFee = {
  agency: string;
  fee: Range;
  /** e.g. "18% of first-year pay (min $7,500) + $500 engagement fee" */
  formula: string;
  sources: DataPoint[];
};

export type Estimate = {
  /** Which group of data points the hourly range came from. */
  segment: "agency_placed" | "newborn" | "part_time" | "general";
  /** Which kind of hourly rate was used, and a one-line explanation to show. */
  rateBasis: { kind: "agency_placed" | "job_site"; explanation: string };
  hourly: Range;
  weekly: Range;
  /** Gross wages for a year (52 weeks). */
  annualWages: Range;
  /** Employer taxes in the first year, line by line. */
  employerTaxes: Breakdown;
  /** One-time agency fees, across the agencies that publish them. */
  placementFee: { range: Range; byAgency: AgencyFee[] } | Tbd | "not_applicable";
  /** Nanny share only: what one family pays per hour. */
  familyShareHourly: Range | Tbd | "not_applicable";
  /** First-year total: wages + employer taxes + agency fee. */
  annualAllIn: { known: Range; pending: string[] };
  /** Data points behind the hourly rate. */
  hourlySources: DataPoint[];
  /** Every data point used anywhere in this estimate. */
  sources: DataPoint[];
  /** Plain-English notes about what's not included. */
  caveats: string[];
};

export const WEEKS_PER_YEAR = 52;

/** Data points that describe Boston nanny pay in general (job-site rates). */
const GENERAL_SEGMENTS = ["all", "child_care_provider"];

/** What Boston agencies say the nannies they place typically earn. */
export const AGENCY_PLACED_SEGMENT = "agency_placed";

/** "Nanny Lane, Care.com" from a list of data points. */
function sourceNames(points: DataPoint[]): string {
  return [...new Set(points.map((p) => p.agency ?? p.source_name.split(/ — |: |, /)[0]))].join(", ");
}

export function isTbd(x: unknown): x is Tbd {
  return typeof x === "object" && x !== null && "tbd" in x;
}

const ZERO: Range = { low: 0, mid: 0, high: 0 };

// --- The estimator -----------------------------------------------------------

export function estimate(
  rawInputs: EstimateInputs,
  model: CostModel = costData,
): Estimate {
  const inputs = estimateInputsSchema.parse(rawInputs);
  const caveats: string[] = [];

  // 1. Pick the hourly rates.
  //    Through an agency: what Boston agencies say their placed nannies earn.
  //    On your own: job-site asking/starting rates, most specific segment first.
  const agencyPoints = inputs.viaAgency
    ? pointsFor(model, "hourly_rate_avg", [AGENCY_PLACED_SEGMENT])
    : [];
  if (inputs.viaAgency && agencyPoints.length === 0) {
    caveats.push("We don't have agency-placed rates yet, so this uses job-site rates.");
  }

  const wanted: Estimate["segment"] =
    inputs.youngestAgeBand === "expecting" || inputs.youngestAgeBand === "0_12m"
      ? "newborn"
      : inputs.arrangement === "part_time"
        ? "part_time"
        : "general";

  let segment: Estimate["segment"] = agencyPoints.length ? AGENCY_PLACED_SEGMENT : wanted;
  let hourlySources = agencyPoints.length
    ? agencyPoints
    : wanted === "general"
      ? pointsFor(model, "hourly_rate_avg", GENERAL_SEGMENTS)
      : pointsFor(model, "hourly_rate_avg", [wanted]);

  if (hourlySources.length === 0) {
    segment = "general";
    hourlySources = pointsFor(model, "hourly_rate_avg", GENERAL_SEGMENTS);
    caveats.push(
      `We don't have ${wanted.replace("_", "-")} rates yet, so this uses general Boston rates.`,
    );
  }
  if (hourlySources.length === 0) {
    throw new Error("Cost data has no hourly_rate_avg data points.");
  }

  // 2. Hourly range: lowest, median and highest across sources.
  const hourly = rangeOf(hourlySources.map((p) => p.value));
  if (hourlySources.length === 1) {
    caveats.push("This hourly rate comes from a single source.");
  }
  const rateBasis: Estimate["rateBasis"] =
    segment === AGENCY_PLACED_SEGMENT
      ? {
          kind: "agency_placed",
          explanation: `Agency-placed rates: what Boston agencies say the nannies they place typically earn (${sourceNames(hourlySources)}). Job-site averages are lower because they're asking rates.`,
        }
      : {
          kind: "job_site",
          explanation: `Job-site rates: average asking or starting rates on ${sourceNames(hourlySources)}. Experienced, agency-placed nannies typically earn more.`,
        };

  // 3. Wages: simple multiplication.
  const weekly = scale(hourly, inputs.hoursPerWeek);
  const annualWages = scale(weekly, WEEKS_PER_YEAR);

  // 4. Employer taxes, line by line (IRS Pub 926 + Mass. DFML).
  const employerTaxes = employerTaxBreakdown(annualWages, model, caveats);

  // 5. Agency fees: agencies only, from fees agencies publish themselves.
  const placementFee: Estimate["placementFee"] = !inputs.viaAgency
    ? "not_applicable"
    : agencyFees(annualWages, model);

  // 6. Nanny share: what one family pays, if we know the split.
  const shareDiscount = model.assumptions.nanny_share_discount.value;
  const familyShareHourly: Estimate["familyShareHourly"] =
    inputs.arrangement !== "nanny_share"
      ? "not_applicable"
      : shareDiscount === null
        ? {
            tbd: true,
            reason:
              "We're collecting how Boston families split a shared nanny's pay.",
          }
        : scale(hourly, 1 - shareDiscount);

  if (inputs.arrangement === "nanny_share") {
    caveats.push(
      "For a nanny share, these figures are for the whole nanny, before the families split the cost.",
    );
  }

  // 7. All-in (first year): add up what we know, list what we don't.
  const pending = [...employerTaxes.pending];
  if (isTbd(placementFee)) pending.push("Agency placement fee");
  if (isTbd(familyShareHourly)) pending.push("Your family's share of a nanny share");
  const annualAllIn = {
    known: sumRanges([
      annualWages,
      employerTaxes.known,
      placementFee === "not_applicable" || isTbd(placementFee)
        ? ZERO
        : placementFee.range,
    ]),
    pending,
  };

  // 8. Things the data doesn't cover yet.
  if (inputs.hoursPerWeek > 40) {
    caveats.push(
      "Hours over 40 a week usually must be paid as overtime. That isn't included here.",
    );
  }
  if (inputs.children > 1) {
    caveats.push(
      "Our sources don't break rates down by number of children yet. Expect a higher rate for more children.",
    );
  }
  if (inputs.liveIn) {
    caveats.push(
      "Our sources are for live-out nannies. We don't have live-in rates yet.",
    );
  }
  if (inputs.zip) {
    caveats.push("We don't have neighborhood-level rates yet.");
  }

  const used = [
    ...hourlySources,
    ...employerTaxes.lines.flatMap((l) => l.sources),
    ...(placementFee !== "not_applicable" && !isTbd(placementFee)
      ? placementFee.byAgency.flatMap((a) => a.sources)
      : []),
  ];

  return {
    segment,
    rateBasis,
    hourly,
    weekly,
    annualWages,
    employerTaxes,
    placementFee,
    familyShareHourly,
    annualAllIn,
    hourlySources,
    sources: [...new Set(used)],
    caveats,
  };
}

// --- Employer taxes ------------------------------------------------------------

export function employerTaxBreakdown(
  annualWages: Range,
  model: CostModel = costData,
  caveats: string[] = [],
): Breakdown {
  const pct = (p: DataPoint) => p.value / 100;

  const ficaThreshold = requirePoint(model, "fica_wage_threshold");
  const ficaRate = requirePoint(model, "fica_employer_rate");
  const ssBase = requirePoint(model, "ss_wage_base");
  const futaQuarter = requirePoint(model, "futa_quarterly_threshold");
  const futaRate = requirePoint(model, "futa_net_rate");
  const futaBase = requirePoint(model, "futa_wage_base");
  const pfmlRate = requirePoint(model, "ma_pfml_rate");
  const pfmlEmployer = requirePoint(model, "ma_pfml_employer_rate");

  if (annualWages.high > ssBase.value) {
    caveats.push(
      `Social Security stops at ${usd(ssBase.value)} in wages; this estimate doesn't apply that cap.`,
    );
  }

  const fica = perEnd(annualWages, (w) =>
    w >= ficaThreshold.value ? w * pct(ficaRate) : 0,
  );
  const futa = perEnd(annualWages, (w) =>
    w / 4 >= futaQuarter.value ? Math.min(w, futaBase.value) * pct(futaRate) : 0,
  );
  const pfml = perEnd(annualWages, (w) => w * pct(pfmlEmployer));

  const uiRate = requirePoint(model, "ma_ui_rate");
  const uiBase = requirePoint(model, "ma_ui_wage_base");
  const uiQuarter = requirePoint(model, "ma_ui_quarterly_threshold");
  const ui = perEnd(annualWages, (w) =>
    w / 4 >= uiQuarter.value ? Math.min(w, uiBase.value) * pct(uiRate) : 0,
  );

  const lines: Line[] = [
    {
      key: "fica",
      label: "Social Security & Medicare (your share)",
      value: fica,
      note: `${ficaRate.value}% of wages, once you pay ${usd(ficaThreshold.value)}+ a year`,
      sources: [ficaRate, ficaThreshold, ssBase],
    },
    {
      key: "futa",
      label: "Federal unemployment (FUTA)",
      value: futa,
      note: `${futaRate.value}% of the first ${usd(futaBase.value)}`,
      sources: [futaRate, futaBase, futaQuarter],
    },
    {
      key: "pfml",
      label: "Mass. paid family & medical leave (your share)",
      value: pfml,
      note: `${pfmlRate.value}% total, withheld from your nanny's pay when you have fewer than 25 employees`,
      sources: [pfmlRate, pfmlEmployer],
    },
    {
      key: "ma_ui",
      label: "Mass. unemployment insurance",
      value: ui,
      note: `${uiRate.value}% of the first ${usd(uiBase.value)} (new employers), plus a small state assessment`,
      sources: [uiRate, uiBase, uiQuarter],
    },
  ];

  return {
    lines,
    known: sumRanges(lines.map((l) => l.value).filter((v): v is Range => !isTbd(v))),
    pending: lines.filter((l) => isTbd(l.value)).map((l) => l.label),
  };
}

// --- Agency fees -----------------------------------------------------------------

export function agencyFees(
  annualWages: Range,
  model: CostModel = costData,
): { range: Range; byAgency: AgencyFee[] } | Tbd {
  const pctPoints = pointsFor(model, "placement_fee").filter(
    (p) => p.unit === "pct_of_annual_wage",
  );
  if (pctPoints.length === 0) {
    return {
      tbd: true,
      reason: "We're collecting placement fees from Boston agencies.",
    };
  }

  const byAgency: AgencyFee[] = pctPoints.map((pctPoint) => {
    const seg = pctPoint.segment ?? "all";
    const min = pointsFor(model, "placement_fee_min", [seg])[0];
    const upfront = pointsFor(model, "upfront_fee", [seg])[0];
    const fee = perEnd(
      annualWages,
      (w) =>
        Math.max((w * pctPoint.value) / 100, min?.value ?? 0) +
        (upfront?.value ?? 0),
    );
    const formula = [
      `${pctPoint.value}% of first-year pay${min ? ` (min ${usd(min.value)})` : ""}`,
      upfront ? `${usd(upfront.value)} upfront fee` : null,
    ]
      .filter(Boolean)
      .join(" + ");
    return {
      agency: pctPoint.agency ?? pctPoint.source_name,
      fee,
      formula,
      sources: [pctPoint, min, upfront].filter((p): p is DataPoint => !!p),
    };
  });

  return {
    range: {
      low: Math.min(...byAgency.map((a) => a.fee.low)),
      mid: median(byAgency.map((a) => a.fee.mid)),
      high: Math.max(...byAgency.map((a) => a.fee.high)),
    },
    byAgency,
  };
}

// --- Math helpers ------------------------------------------------------------

export function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function rangeOf(values: number[]): Range {
  return {
    low: Math.min(...values),
    mid: median(values),
    high: Math.max(...values),
  };
}

function perEnd(r: Range, f: (n: number) => number): Range {
  return { low: f(r.low), mid: f(r.mid), high: f(r.high) };
}

function scale(r: Range, by: number): Range {
  return { low: r.low * by, mid: r.mid * by, high: r.high * by };
}

function sumRanges(rs: Range[]): Range {
  return rs.reduce(
    (acc, r) => ({
      low: acc.low + r.low,
      mid: acc.mid + r.mid,
      high: acc.high + r.high,
    }),
    { low: 0, mid: 0, high: 0 },
  );
}

// --- Formatting (shared by the page and the estimator UI) ---------------------

/** 22.61 → "$22.61"; 300 → "$300"; 47028.8 → "$47,029" (whole dollars above $1,000). */
export function usd(n: number): string {
  const whole = Math.abs(n) >= 1000 || Number.isInteger(n);
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2,
  });
}

/** "$22.61–$24.20", or a single value when low === high. */
export function usdRange(r: Range): string {
  return r.low === r.high ? usd(r.low) : `${usd(r.low)}–${usd(r.high)}`;
}
