// lib/costLabels.ts
// Plain-English labels for data points, shared by the source table,
// the estimator's sources panel and the guides.

import type { DataPoint } from "@/lib/costData";
import { usd } from "@/lib/estimator";

const metricLabel: Record<DataPoint["metric"], string> = {
  hourly_rate_avg: "Average hourly rate",
  hourly_rate_low: "Low hourly rate",
  hourly_rate_high: "High hourly rate",
  monthly_cost: "Monthly cost",
  annual_all_in_low: "All-in yearly cost, low end",
  annual_all_in_high: "All-in yearly cost, high end",
  placement_fee: "Placement fee",
  daycare_infant_monthly: "Infant daycare, monthly",
  fica_wage_threshold: "Social Security & Medicare start at",
  fica_employer_rate: "Social Security & Medicare, employer share",
  ss_wage_base: "Social Security wage cap",
  futa_quarterly_threshold: "Federal unemployment (FUTA) starts at",
  futa_net_rate: "Federal unemployment (FUTA) rate",
  futa_wage_base: "FUTA applies to wages up to",
  ma_pfml_rate: "Mass. paid leave (PFML), total",
  ma_pfml_employer_rate: "Mass. paid leave (PFML), employer share",
  placement_fee_min: "Minimum placement fee",
  upfront_fee: "Upfront fee",
};

const segmentLabel: Record<string, string> = {
  all: "all nannies",
  newborn: "newborn",
  part_time: "part-time",
  full_time: "full-time",
  child_care_provider: "child care providers",
  infant_center: "daycare center",
  under_25_employees: "under 25 employees",
};

const unitSuffix: Record<DataPoint["unit"], string> = {
  usd_per_hour: "/hr",
  usd_per_month: "/mo",
  usd_per_year: "/yr",
  usd_per_quarter: "/quarter",
  usd_flat: "",
  pct_of_annual_wage: "",
  pct_of_wages: "",
};

export function formatValue(p: DataPoint): string {
  if (p.unit === "pct_of_annual_wage") return `${p.value}% of first-year pay`;
  if (p.unit === "pct_of_wages") return `${p.value}% of wages`;
  return `${usd(p.value)}${unitSuffix[p.unit]}`;
}

/** "Average hourly rate, newborn" or "Placement fee, Boston Nanny Centre" */
export function figureLabel(p: DataPoint): string {
  const extra = p.agency ?? (p.segment ? segmentLabel[p.segment] : undefined);
  return extra ? `${metricLabel[p.metric]}, ${extra}` : metricLabel[p.metric];
}

