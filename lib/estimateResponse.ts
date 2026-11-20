// lib/estimateResponse.ts
// The one JSON answer that AI agents get, from GET /api/estimate and from the
// MCP tool estimate_nanny_cost. Both call toAgentResponse(), so they can never
// disagree. All math lives in lib/estimator.ts; this file only reshapes it.
//
// Privacy: inputs are only the estimator's fields (hours, children, age band,
// optional ZIP, live-in, arrangement, via agency). Nothing here is stored or
// logged.

import { z } from "zod";
import { costData, type DataPoint } from "@/lib/costData";
import { siteUrl } from "@/lib/config";
import {
  defaultInputs,
  estimate,
  estimateInputsSchema,
  isTbd,
  usd,
  type EstimateInputs,
  type Range,
  type Tbd,
} from "@/lib/estimator";

/** Plain-English help for each input (used by the MCP tool and /openapi.json). */
export const inputDescriptions = {
  hoursPerWeek: "Hours of care per week (1–70). Default 40.",
  children: "Number of children in care (0–6; 0 if expecting). Default 1.",
  youngestAgeBand:
    "Age band of the youngest child: expecting, 0_12m (under 1), 1_2y, 3_5y, 6_12y or 13_plus. Default 1_2y. Age bands only; never send a name or birthdate.",
  zip: "Optional 5-digit Massachusetts ZIP. Not used in the math yet.",
  liveIn: "true for a live-in nanny. Default false.",
  arrangement: "full_time, part_time or nanny_share. Default full_time.",
  viaAgency: "true if hiring through an agency (adds the one-time placement fee). Default true.",
} as const;

/** What agents may send: every field optional; missing ones use defaultInputs. */
const shape = estimateInputsSchema.shape;
export const agentInputsSchema = z.object({
  hoursPerWeek: shape.hoursPerWeek.optional().describe(inputDescriptions.hoursPerWeek),
  children: shape.children.optional().describe(inputDescriptions.children),
  youngestAgeBand: shape.youngestAgeBand.optional().describe(inputDescriptions.youngestAgeBand),
  zip: shape.zip.describe(inputDescriptions.zip),
  liveIn: shape.liveIn.optional().describe(inputDescriptions.liveIn),
  arrangement: shape.arrangement.optional().describe(inputDescriptions.arrangement),
  viaAgency: shape.viaAgency.optional().describe(inputDescriptions.viaAgency),
});
export type AgentInputs = z.infer<typeof agentInputsSchema>;

export type AgentSource = {
  title: string;
  publisher: string;
  url: string;
  /** "as of" date as the source states it, e.g. "2026" or "2026-06". */
  date: string;
};

export type AgentLine = {
  label: string;
  /** Whole dollars, or TBD (never a guess), or not applicable / not required. */
  value: Range | { tbd: true; reason: string } | "not_applicable" | "not_required";
  note?: string;
  sources: AgentSource[];
};

export type AgentResponse = {
  inputs: EstimateInputs;
  annual: {
    wages: AgentLine;
    employer_taxes: { total_known: AgentLine; lines: AgentLine[] };
    agency_fees: AgentLine;
    workers_comp: AgentLine;
    all_in: AgentLine;
  };
  /** Shown for information; NOT part of annual.all_in (see excluded_from_total). */
  paid_time_off: AgentLine;
  excluded_from_total: string[];
  hourly: AgentLine;
  /** Which hourly rates were used: agency_placed (via an agency) or job_site (on your own). */
  rate_basis: { kind: "agency_placed" | "job_site"; explanation: string };
  tbd_lines: string[];
  caveats: string[];
  as_of: string;
  guide_url: string;
  estimator_url: string;
  disclaimer: string;
};

// --- helpers -------------------------------------------------------------------

function source(p: DataPoint): AgentSource {
  return {
    title: p.source_name,
    publisher: p.agency ?? p.source_name.split(/ — |: /)[0],
    url: p.source_url,
    date: p.as_of,
  };
}

function sources(points: DataPoint[]): AgentSource[] {
  const seen = new Set<string>();
  return points
    .filter((p) => {
      const key = `${p.source_url}|${p.source_name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map(source);
}

const round = (r: Range): Range => ({
  low: Math.round(r.low),
  mid: Math.round(r.mid),
  high: Math.round(r.high),
});

const roundCents = (r: Range): Range => ({
  low: Math.round(r.low * 100) / 100,
  mid: Math.round(r.mid * 100) / 100,
  high: Math.round(r.high * 100) / 100,
});

function value(v: Range | Tbd): AgentLine["value"] {
  return isTbd(v) ? { tbd: true, reason: v.reason } : round(v);
}

// --- the response ------------------------------------------------------------

/**
 * Run the estimator for an agent. Missing fields use defaultInputs.
 * Throws a ZodError if the inputs are invalid (callers turn that into a 400).
 */
export function toAgentResponse(raw: AgentInputs = {}): AgentResponse {
  const inputs = estimateInputsSchema.parse({ ...defaultInputs, ...raw });
  const e = estimate(inputs);

  const taxLines: AgentLine[] = e.employerTaxes.lines.map((l) => ({
    label: l.label,
    value: value(l.value),
    note: l.note,
    sources: sources(l.sources),
  }));

  const fee = e.placementFee;
  const agencyFees: AgentLine =
    fee === "not_applicable"
      ? {
          label: "Agency fees (one-time)",
          value: "not_applicable",
          note: "Hiring on your own: no agency fee.",
          sources: [],
        }
      : isTbd(fee)
        ? { label: "Agency fees (one-time)", value: { tbd: true, reason: fee.reason }, sources: [] }
        : {
            label: "Agency fees (one-time)",
            value: round(fee.range),
            note: fee.byAgency.map((a) => `${a.agency}: ${a.formula}`).join("; "),
            sources: sources(fee.byAgency.flatMap((a) => a.sources)),
          };

  const tbdLines = [...e.annualAllIn.pending];

  return {
    inputs,
    annual: {
      wages: {
        label: "Wages (52 weeks)",
        value: round(e.annualWages),
        note: "Hourly rate × hours per week × 52. Overtime over 40 hours/week not included.",
        sources: sources(e.hourlySources),
      },
      employer_taxes: {
        total_known: {
          label: "Employer taxes (first year)",
          value: round(e.employerTaxes.known),
          note: e.employerTaxes.pending.length
            ? `Known lines only; still TBD: ${e.employerTaxes.pending.join(", ")}.`
            : undefined,
          sources: sources(e.employerTaxes.lines.flatMap((l) => l.sources)),
        },
        lines: taxLines,
      },
      agency_fees: agencyFees,
      workers_comp: {
        label: e.workersComp.label,
        value: e.workersComp.value === "not_required" ? "not_required" : value(e.workersComp.value),
        note: e.workersComp.note,
        sources: sources(e.workersComp.sources),
      },
      all_in: {
        label: `All-in, first year (${e.annualAllIn.includes.join(", ")})`,
        value: round(e.annualAllIn.known),
        note: tbdLines.length
          ? `Not yet included: ${tbdLines.join(", ")}. Paid time off is never added (it's already inside 52 weeks of wages).`
          : "Paid time off is never added (it's already inside 52 weeks of wages).",
        sources: sources(e.sources),
      },
    },
    hourly: {
      label: "Hourly rate",
      value: roundCents(e.hourly),
      note: `${e.rateBasis.explanation} Range = lowest, median and highest across sources.`,
      sources: sources(e.hourlySources),
    },
    rate_basis: e.rateBasis,
    paid_time_off: {
      label: e.paidTimeOff.label,
      value: e.paidTimeOff.value === "not_required" ? "not_required" : value(e.paidTimeOff.value),
      note: e.paidTimeOff.note,
      sources: sources(e.paidTimeOff.sources),
    },
    excluded_from_total: e.excludedFromTotal,
    tbd_lines: tbdLines,
    caveats: e.caveats,
    as_of: costData.updated,
    guide_url: `${siteUrl}/guides/boston-nanny-cost`,
    estimator_url: `${siteUrl}/estimate`,
    disclaimer: "Information only, not tax or legal advice.",
  };
}

// --- plain-English summary (MCP puts this before the JSON) --------------------

const ageText: Record<EstimateInputs["youngestAgeBand"], string> = {
  expecting: "a baby on the way",
  "0_12m": "a baby under 1",
  "1_2y": "a toddler (1–2)",
  "3_5y": "a preschooler (3–5)",
  "6_12y": "a school-age child (6–12)",
  "13_plus": "a teenager",
};

const arrangementText: Record<EstimateInputs["arrangement"], string> = {
  full_time: "full-time",
  part_time: "part-time",
  nanny_share: "nanny-share",
};

const rangeText = (v: AgentLine["value"]) =>
  typeof v === "object" && "low" in v
    ? v.low === v.high
      ? usd(v.low)
      : `${usd(v.low)}–${usd(v.high)}`
    : "TBD";

/** One paragraph, e.g. "A full-time nanny for a toddler (1–2) in Boston…" */
export function summarize(r: AgentResponse): string {
  const i = r.inputs;
  const kids =
    i.children > 1 ? `${i.children} children (youngest: ${ageText[i.youngestAgeBand]})` : ageText[i.youngestAgeBand];
  const how = i.viaAgency ? "hired through an agency" : "hired on your own";
  const parts = [
    `wages ${rangeText(r.annual.wages.value)}`,
    `employer taxes about ${rangeText(r.annual.employer_taxes.total_known.value)}`,
    i.viaAgency ? `a one-time agency placement fee of ${rangeText(r.annual.agency_fees.value)}` : null,
  ].filter(Boolean);
  const tbd = r.tbd_lines.length ? ` Still being collected: ${r.tbd_lines.join(", ")}.` : "";
  const feeNote = i.viaAgency
    ? " The agency placement fee is a one-time cost, so year two costs less."
    : "";
  const ptoNote = " Paid time off isn't added on top (52 weeks of wages already covers paid vacation).";
  return (
    `A ${arrangementText[i.arrangement]} nanny (${i.hoursPerWeek} hours a week) for ${kids} in Boston, ${how}, ` +
    `costs about ${rangeText(r.annual.all_in.value)} in year one, all-in (${parts.join(", ")}). ` +
    `${r.rate_basis.explanation}${feeNote}${ptoNote} Figures are 2026 Boston/Massachusetts numbers, each with a source below.${tbd} ` +
    `Full explanation: ${r.guide_url} · Interactive estimator: ${r.estimator_url}. ${r.disclaimer}`
  );
}

/** Turn a ZodError into short, plain-English messages for a 400 response. */
export function readableIssues(error: z.ZodError): { field: string; message: string }[] {
  return error.issues.map((issue) => ({
    field: issue.path.join(".") || "(input)",
    message: issue.message,
  }));
}
