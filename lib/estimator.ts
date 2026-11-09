// lib/estimator.ts
// The nanny cost estimator. A pure function: same inputs → same outputs,
// no network, no database. Every number it returns is either
//   (a) taken from data/boston-cost-seed.json, or
//   (b) simple arithmetic on (a) (rate × hours × weeks),
// and anything we don't know yet comes back as TBD, never a guess.

import { z } from "zod";
import {
  costData,
  pointsFor,
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

export type Estimate = {
  /** Which group of data points the hourly range came from. */
  segment: "newborn" | "part_time" | "general";
  hourly: Range;
  weekly: Range;
  /** Gross wages for a year (52 weeks). */
  annualWages: Range;
  employerTaxes: Range | Tbd;
  /** "not_applicable" when hiring independently. */
  placementFee: Range | Tbd | "not_applicable";
  /** Nanny share only: what one family pays per hour. */
  familyShareHourly: Range | Tbd | "not_applicable";
  /** Wages + employer taxes + placement fee. TBD if any piece is unknown. */
  annualAllIn: Range | Tbd;
  /** The data points the hourly range is built from. */
  sources: DataPoint[];
  /** Plain-English notes about what's not included. */
  caveats: string[];
};

export const WEEKS_PER_YEAR = 52;

/** Data points that describe Boston nanny pay in general. */
const GENERAL_SEGMENTS = ["all", "child_care_provider"];

export function isTbd(x: unknown): x is Tbd {
  return typeof x === "object" && x !== null && "tbd" in x;
}

// --- The estimator -----------------------------------------------------------

export function estimate(
  rawInputs: EstimateInputs,
  model: CostModel = costData,
): Estimate {
  const inputs = estimateInputsSchema.parse(rawInputs);
  const caveats: string[] = [];

  // 1. Pick the most specific segment that has data.
  const wanted: Estimate["segment"] =
    inputs.youngestAgeBand === "expecting" || inputs.youngestAgeBand === "0_12m"
      ? "newborn"
      : inputs.arrangement === "part_time"
        ? "part_time"
        : "general";

  let segment = wanted;
  let sources =
    wanted === "general"
      ? pointsFor(model, "hourly_rate_avg", GENERAL_SEGMENTS)
      : pointsFor(model, "hourly_rate_avg", [wanted]);

  if (sources.length === 0) {
    segment = "general";
    sources = pointsFor(model, "hourly_rate_avg", GENERAL_SEGMENTS);
    caveats.push(
      `We don't have ${wanted.replace("_", "-")} rates yet, so this uses general Boston rates.`,
    );
  }
  if (sources.length === 0) {
    throw new Error("Cost data has no hourly_rate_avg data points.");
  }

  // 2. Hourly range: lowest, median and highest across sources.
  const hourly = rangeOf(sources.map((p) => p.value));
  if (sources.length === 1) {
    caveats.push("This hourly rate comes from a single source.");
  }

  // 3. Wages: simple multiplication.
  const weekly = scale(hourly, inputs.hoursPerWeek);
  const annualWages = scale(weekly, WEEKS_PER_YEAR);

  // 4. Employer taxes: only if the rate is known.
  const taxRate = model.assumptions.employer_tax_rate_estimate.value;
  const employerTaxes: Range | Tbd =
    taxRate === null
      ? {
          tbd: true,
          reason:
            "We're verifying 2026 federal and Massachusetts household employer taxes.",
        }
      : scale(annualWages, taxRate);

  // 5. Placement fee: agencies only, and only if known.
  //    Stored as a fraction of first-year wages (e.g. 0.15 = 15%).
  const feeRate = model.assumptions.placement_fee.value;
  const placementFee: Estimate["placementFee"] = !inputs.viaAgency
    ? "not_applicable"
    : feeRate === null
      ? {
          tbd: true,
          reason: "We're collecting placement fees from Boston agencies.",
        }
      : scale(annualWages, feeRate);

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
      "For a nanny share, the hourly rate shown is the nanny's full rate before the families split it.",
    );
  }

  // 7. All-in: only when every piece is known.
  const parts = [annualWages, employerTaxes, placementFee];
  const missing = parts.filter(isTbd);
  const annualAllIn: Range | Tbd =
    missing.length > 0 || isTbd(familyShareHourly)
      ? {
          tbd: true,
          reason:
            "The all-in total needs employer taxes and agency fees, which we're still collecting.",
        }
      : sumRanges(
          parts.filter((p): p is Range => p !== "not_applicable" && !isTbd(p)),
        );

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

  return {
    segment,
    hourly,
    weekly,
    annualWages,
    employerTaxes,
    placementFee,
    familyShareHourly,
    annualAllIn,
    sources,
    caveats,
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

/** 22.61 → "$22.61"; 47028.8 → "$47,029" (whole dollars above $1,000). */
export function usd(n: number): string {
  const whole = Math.abs(n) >= 1000;
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
