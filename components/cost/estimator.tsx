"use client";

// The estimator: a sage card with inputs on the left and a live result on the
// right (stacked on phones). All math lives in lib/estimator.ts.
// With JavaScript off, the server-rendered HTML still shows the default
// full-time example, so the page never depends on this component.

import { useId, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { formatAsOf } from "@/lib/costData";
import {
  defaultInputs,
  estimateInputsSchema,
  estimate,
  isTbd,
  usdRange,
  type EstimateInputs,
  type Range,
  type Tbd,
} from "@/lib/estimator";

const arrangementOptions = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "nanny_share", label: "Nanny share" },
] as const;

const ageBandOptions = [
  { value: "expecting", label: "Expecting" },
  { value: "0_12m", label: "Under 1 year" },
  { value: "1_2y", label: "1–2 years" },
  { value: "3_5y", label: "3–5 years" },
  { value: "6_12y", label: "6–12 years" },
  { value: "13_plus", label: "13 or older" },
] as const;

const fieldClass =
  "h-11 w-full rounded-md border border-sand-light bg-white px-3 text-base text-ink focus-visible:outline-2 focus-visible:outline-pine";

export function Estimator() {
  const id = useId();
  const [inputs, setInputs] = useState<EstimateInputs>(defaultInputs);
  const [hoursText, setHoursText] = useState(String(defaultInputs.hoursPerWeek));
  const [zipText, setZipText] = useState("");

  const set = <K extends keyof EstimateInputs>(key: K, value: EstimateInputs[K]) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const candidate: EstimateInputs = {
    ...inputs,
    hoursPerWeek: Number(hoursText),
    zip: zipText.trim() === "" ? undefined : zipText.trim(),
  };
  const parsed = estimateInputsSchema.safeParse(candidate);
  const result = parsed.success ? estimate(parsed.data) : null;

  return (
    <div className="grid gap-8 rounded-xl bg-sage p-5 sm:p-8 md:grid-cols-2">
      {/* Inputs */}
      <form className="space-y-5" onSubmit={(e) => e.preventDefault()} aria-label="Estimator inputs">
        <fieldset>
          <legend className="mb-2 font-semibold text-ink">Arrangement</legend>
          <div className="grid grid-cols-3 gap-2">
            {arrangementOptions.map((o) => (
              <label
                key={o.value}
                className="flex min-h-11 items-center justify-center rounded-md border border-sand-light bg-white px-2 text-center text-[15px] has-checked:border-pine has-checked:bg-pine has-checked:text-white"
              >
                <input
                  type="radio"
                  name={`${id}-arrangement`}
                  value={o.value}
                  checked={inputs.arrangement === o.value}
                  onChange={() => set("arrangement", o.value)}
                  className="sr-only"
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${id}-hours`} className="mb-2 block font-semibold text-ink">
              Hours per week
            </label>
            <input
              id={`${id}-hours`}
              type="number"
              inputMode="numeric"
              min={1}
              max={70}
              value={hoursText}
              onChange={(e) => setHoursText(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor={`${id}-children`} className="mb-2 block font-semibold text-ink">
              Children
            </label>
            <select
              id={`${id}-children`}
              value={inputs.children}
              onChange={(e) => set("children", Number(e.target.value))}
              className={fieldClass}
            >
              {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "None yet" : n}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor={`${id}-age`} className="mb-2 block font-semibold text-ink">
              Youngest child
            </label>
            <select
              id={`${id}-age`}
              value={inputs.youngestAgeBand}
              onChange={(e) =>
                set("youngestAgeBand", e.target.value as EstimateInputs["youngestAgeBand"])
              }
              className={fieldClass}
            >
              {ageBandOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-zip`} className="mb-2 block font-semibold text-ink">
              ZIP <span className="font-normal">(optional)</span>
            </label>
            <input
              id={`${id}-zip`}
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={5}
              placeholder="02130"
              value={zipText}
              onChange={(e) => setZipText(e.target.value)}
              className={fieldClass}
            />
          </div>
        </div>

        <fieldset>
          <legend className="mb-2 font-semibold text-ink">Hiring through</legend>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: true, label: "An agency" },
              { value: false, label: "On my own" },
            ].map((o) => (
              <label
                key={o.label}
                className="flex min-h-11 items-center justify-center rounded-md border border-sand-light bg-white px-2 text-[15px] has-checked:border-pine has-checked:bg-pine has-checked:text-white"
              >
                <input
                  type="radio"
                  name={`${id}-agency`}
                  checked={inputs.viaAgency === o.value}
                  onChange={() => set("viaAgency", o.value)}
                  className="sr-only"
                />
                {o.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex min-h-11 items-center gap-3 text-ink">
          <input
            type="checkbox"
            checked={inputs.liveIn}
            onChange={(e) => set("liveIn", e.target.checked)}
            className="size-5 accent-pine"
          />
          Live-in nanny
        </label>
      </form>

      {/* Result */}
      <div aria-live="polite">
        {!result ? (
          <p className="rounded-lg bg-white p-5 text-ink">
            Check the inputs: hours must be 1–70 and the ZIP must be 5 digits.
          </p>
        ) : (
          <div className="rounded-lg bg-white p-5 sm:p-6">
            <p className="eyebrow">Hourly rate</p>
            <p className="mt-1 text-4xl font-medium text-pine tabular-nums sm:text-5xl">
              {usdRange(result.hourly)}
            </p>

            <dl className="mt-6 divide-y divide-sand-light text-[15px]">
              <Row label="Weekly wages" value={result.weekly} />
              <Row label="Yearly wages" value={result.annualWages} />
              <Row label="Employer taxes" value={result.employerTaxes} />
              <Row label="Agency placement fee" value={result.placementFee} />
              {result.familyShareHourly !== "not_applicable" && (
                <Row label="Your share, per hour" value={result.familyShareHourly} />
              )}
              <Row label="All-in, per year" value={result.annualAllIn} strong />
            </dl>

            {isTbd(result.annualAllIn) && (
              <p className="mt-3 text-[15px] text-muted-ink">
                So far: at least {usdRange(result.annualWages)} a year in wages,
                plus taxes{result.placementFee !== "not_applicable" && " and the agency fee"}.
              </p>
            )}

            {result.caveats.length > 0 && (
              <ul className="mt-4 list-disc space-y-1 pl-5 text-[15px] text-muted-ink">
                {result.caveats.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}

            <div className="mt-5 border-t border-sand-light pt-4">
              <p className="mb-2 text-sm font-semibold text-ink">Hourly rate sources</p>
              <ul className="space-y-2 text-sm">
                {result.sources.map((s) => (
                  <li key={s.source_url} className="flex flex-wrap items-center gap-2">
                    <a href={s.source_url} className="text-link" rel="noopener" target="_blank">
                      {s.source_name}
                    </a>
                    <span className="text-muted-ink">{formatAsOf(s.as_of)}</span>
                    <Badge variant={s.confidence}>{s.confidence} confidence</Badge>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: Range | Tbd | "not_applicable";
  strong?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2">
      <dt className={strong ? "font-semibold text-ink" : "text-ink"}>{label}</dt>
      <dd className="text-right tabular-nums">
        {value === "not_applicable" ? (
          <span className="text-muted-ink">Not applicable</span>
        ) : isTbd(value) ? (
          <span className="italic text-muted-ink" title={value.reason}>
            TBD — collecting
          </span>
        ) : (
          <span className={strong ? "font-semibold text-pine" : "text-ink"}>
            {usdRange(value)}
          </span>
        )}
      </dd>
    </div>
  );
}
