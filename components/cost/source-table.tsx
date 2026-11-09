import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  basisLabel,
  costData,
  formatAsOf,
  type DataPoint,
} from "@/lib/costData";
import { usd } from "@/lib/estimator";

const metricLabel: Record<DataPoint["metric"], string> = {
  hourly_rate_avg: "Average hourly rate",
  hourly_rate_low: "Low hourly rate",
  hourly_rate_high: "High hourly rate",
  monthly_cost: "Monthly cost",
  annual_all_in_low: "All-in yearly cost, low end",
  annual_all_in_high: "All-in yearly cost, high end",
  placement_fee: "Agency placement fee",
  daycare_infant_monthly: "Infant daycare, monthly",
};

const segmentLabel: Record<string, string> = {
  all: "all nannies",
  newborn: "newborn",
  part_time: "part-time",
  full_time: "full-time",
  child_care_provider: "child care providers",
  infant_center: "daycare center",
};

const unitSuffix: Record<DataPoint["unit"], string> = {
  usd_per_hour: "/hr",
  usd_per_month: "/mo",
  usd_per_year: "/yr",
  usd_flat: "",
  pct_of_annual_wage: "",
};

function formatValue(p: DataPoint): string {
  return p.unit === "pct_of_annual_wage"
    ? `${p.value}% of yearly wages`
    : `${usd(p.value)}${unitSuffix[p.unit]}`;
}

/** Figures we know we need but don't have yet (assumptions with value: null). */
const pending = [
  { label: "Employer payroll taxes", key: "employer_tax_rate_estimate" },
  { label: "Agency placement fee", key: "placement_fee" },
  { label: "Nanny share split", key: "nanny_share_discount" },
] as const;

export function SourceTable() {
  const pendingRows = pending.filter(
    (row) => costData.assumptions[row.key].value === null,
  );
  return (
    <>
      {/* Phones: one card per figure */}
      <ul className="space-y-3 sm:hidden">
        {costData.data_points.map((p) => (
          <li key={`${p.metric}-${p.segment}-${p.source_url}`} className="rounded-lg border border-sand-light bg-white p-4 text-[15px]">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-ink">
                {metricLabel[p.metric]}
                {p.segment && segmentLabel[p.segment] && (
                  <span className="text-muted-ink">, {segmentLabel[p.segment]}</span>
                )}
              </p>
              <p className="shrink-0 font-medium tabular-nums">{formatValue(p)}</p>
            </div>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-muted-ink">
              {basisLabel[p.basis]} · {formatAsOf(p.as_of)}
              <Badge variant={p.confidence}>{p.confidence}</Badge>
            </p>
            <a href={p.source_url} className="text-link mt-2 inline-block" rel="noopener" target="_blank">
              {p.source_name}
            </a>
          </li>
        ))}
        {pendingRows.map((row) => (
          <li key={row.key} className="flex items-baseline justify-between gap-3 rounded-lg border border-sand-light bg-white p-4 text-[15px]">
            <span className="text-ink">{row.label}</span>
            <span className="italic text-muted-ink">TBD — collecting</span>
          </li>
        ))}
      </ul>

      {/* Larger screens: a table */}
      <div className="hidden overflow-x-auto sm:block">
      <Table className="min-w-[640px] text-[15px]">
        <TableHeader>
          <TableRow className="border-sand">
            <TableHead className="text-ink">Figure</TableHead>
            <TableHead className="text-right text-ink">Value</TableHead>
            <TableHead className="text-ink">How it was measured</TableHead>
            <TableHead className="text-ink">As of</TableHead>
            <TableHead className="text-ink">Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {costData.data_points.map((p) => (
            <TableRow key={`${p.metric}-${p.segment}-${p.source_url}`} className="border-sand-light">
              <TableCell className="whitespace-normal">
                {metricLabel[p.metric]}
                {p.segment && segmentLabel[p.segment] && (
                  <span className="text-muted-ink">, {segmentLabel[p.segment]}</span>
                )}
              </TableCell>
              <TableCell className="text-right font-medium tabular-nums">{formatValue(p)}</TableCell>
              <TableCell className="whitespace-normal">
                <span className="flex flex-wrap items-center gap-2">
                  {basisLabel[p.basis]}
                  <Badge variant={p.confidence}>{p.confidence}</Badge>
                </span>
              </TableCell>
              <TableCell className="tabular-nums">{formatAsOf(p.as_of)}</TableCell>
              <TableCell className="whitespace-normal">
                <a href={p.source_url} className="text-link" rel="noopener" target="_blank">
                  {p.source_name}
                </a>
              </TableCell>
            </TableRow>
          ))}
          {pendingRows.map((row) => (
              <TableRow key={row.key} className="border-sand-light">
                <TableCell className="whitespace-normal">{row.label}</TableCell>
                <TableCell className="text-right italic text-muted-ink">TBD — collecting</TableCell>
                <TableCell className="whitespace-normal text-muted-ink" colSpan={3}>
                  Not published yet. We&apos;ll add it once we can source it.
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      </div>
    </>
  );
}
