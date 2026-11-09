// lib/costData.ts
// Loads data/boston-cost-seed.json and checks it against the shape in
// specs/cost-model.schema.json. This runs when the site is built, so a typo
// in the data file fails the build instead of showing a wrong number.

import { z } from "zod";
import seed from "@/data/boston-cost-seed.json";

// --- Schema (mirrors specs/cost-model.schema.json) -------------------------

export const metricSchema = z.enum([
  "hourly_rate_avg",
  "hourly_rate_low",
  "hourly_rate_high",
  "monthly_cost",
  "annual_all_in_low",
  "annual_all_in_high",
  "placement_fee",
  "daycare_infant_monthly",
]);

export const dataPointSchema = z.object({
  metric: metricSchema,
  segment: z.string().optional(),
  value: z.number(),
  unit: z.enum([
    "usd_per_hour",
    "usd_per_month",
    "usd_per_year",
    "usd_flat",
    "pct_of_annual_wage",
  ]),
  source_name: z.string().min(1),
  source_url: z.url(),
  basis: z.enum([
    "listing_asking_rate",
    "provider_reported",
    "survey",
    "government_wage_data",
    "agency_disclosed",
    "family_reported",
    "modeled",
  ]),
  as_of: z.string().min(1),
  confidence: z.enum(["low", "medium", "high"]),
  notes: z.string().optional(),
});

/**
 * An assumption is either a known number or `null` ("we don't know yet").
 * null always renders as "TBD — collecting", never as a guess.
 */
export const assumptionSchema = z.object({
  value: z.number().nullable(),
  todo: z.string().optional(),
  source_name: z.string().optional(),
  source_url: z.url().optional(),
});

export const costModelSchema = z.object({
  market: z.string(),
  updated: z.iso.date(),
  data_points: z.array(dataPointSchema).min(1),
  assumptions: z.object({
    employer_tax_rate_estimate: assumptionSchema,
    placement_fee: assumptionSchema,
    nanny_share_discount: assumptionSchema,
  }),
});

export type DataPoint = z.infer<typeof dataPointSchema>;
export type CostModel = z.infer<typeof costModelSchema>;
export type Confidence = DataPoint["confidence"];

// --- Load once ---------------------------------------------------------------

export const costData: CostModel = costModelSchema.parse(seed);

// --- Small helpers used by the page and the estimator -------------------------

/** All data points for one metric, optionally limited to some segments. */
export function pointsFor(
  model: CostModel,
  metric: DataPoint["metric"],
  segments?: string[],
): DataPoint[] {
  return model.data_points.filter(
    (p) =>
      p.metric === metric &&
      (!segments || segments.includes(p.segment ?? "all")),
  );
}

/** Plain-English label for where a number comes from. */
export const basisLabel: Record<DataPoint["basis"], string> = {
  listing_asking_rate: "Listing asking rate",
  provider_reported: "Reported by a care marketplace",
  survey: "Survey",
  government_wage_data: "Government wage data",
  agency_disclosed: "Published by an agency",
  family_reported: "Reported by families",
  modeled: "Modeled estimate",
};

/** "2026-11-08" → "November 8, 2026" */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** "2026-06" → "Jun 2026", "2026" → "2026" */
export function formatAsOf(asOf: string): string {
  const [y, m] = asOf.split("-").map(Number);
  if (!m) return String(y);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}
