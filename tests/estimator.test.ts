import { describe, expect, it } from "vitest";
import {
  defaultInputs,
  estimate,
  isTbd,
  median,
  usd,
  usdRange,
  WEEKS_PER_YEAR,
  type EstimateInputs,
  type Range,
} from "@/lib/estimator";
import { costData, costModelSchema, type CostModel } from "@/lib/costData";

const input = (over: Partial<EstimateInputs> = {}): EstimateInputs => ({
  ...defaultInputs,
  ...over,
});

const asRange = (x: unknown): Range => {
  if (typeof x !== "object" || x === null || isTbd(x)) {
    throw new Error(`expected a Range, got ${JSON.stringify(x)}`);
  }
  return x as Range;
};

/** A copy of the real data with every assumption filled in. */
function withKnownAssumptions(): CostModel {
  return {
    ...costData,
    assumptions: {
      ma_ui_rate: { value: 0.02 },
      nanny_share_discount: { value: 0.4 },
    },
  };
}

const line = (e: ReturnType<typeof estimate>, key: string) =>
  e.employerTaxes.lines.find((l) => l.key === key)!;

describe("seed data", () => {
  it("passes the cost-model schema", () => {
    expect(() => costModelSchema.parse(costData)).not.toThrow();
  });

  it("every data point has a source link", () => {
    for (const p of costData.data_points) {
      expect(p.source_url).toMatch(/^https:\/\//);
    }
  });
});

describe("full-time", () => {
  const e = estimate(input({ arrangement: "full_time", youngestAgeBand: "3_5y" }));

  it("uses general Boston rates (min / median / max)", () => {
    expect(e.segment).toBe("general");
    expect(e.hourly).toEqual({ low: 22.61, mid: (22.61 + 22.66) / 2, high: 22.66 });
    expect(e.hourlySources.map((s) => s.value).sort()).toEqual([22.61, 22.66]);
  });

  it("weekly = hourly × hours, annual = weekly × 52", () => {
    expect(e.weekly.low).toBeCloseTo(22.61 * 40);
    expect(e.annualWages.high).toBeCloseTo(22.66 * 40 * WEEKS_PER_YEAR);
  });

  it("employer taxes: 7.65% FICA, FUTA on the first $7,000, $0 PFML share, MA UI TBD", () => {
    expect(asRange(line(e, "fica").value).low).toBeCloseTo(22.61 * 40 * 52 * 0.0765);
    expect(asRange(line(e, "futa").value)).toEqual({ low: 42, mid: 42, high: 42 });
    expect(asRange(line(e, "pfml").value).mid).toBe(0);
    expect(isTbd(line(e, "ma_ui").value)).toBe(true);
    expect(e.employerTaxes.pending).toEqual(["Mass. unemployment insurance"]);
  });

  it("agency fees: range across the two agencies that publish theirs", () => {
    const fee = e.placementFee;
    if (fee === "not_applicable" || isTbd(fee)) throw new Error("expected fees");
    expect(fee.byAgency.map((a) => a.agency).sort()).toEqual(["Boston Nanny Centre", "The Nanny Haven"]);
    // Low: The Nanny Haven, 15% + $300. High: Boston Nanny Centre, 18% + $500.
    expect(fee.range.low).toBeCloseTo(22.61 * 40 * 52 * 0.15 + 300);
    expect(fee.range.high).toBeCloseTo(22.66 * 40 * 52 * 0.18 + 500);
  });

  it("all-in adds wages, known taxes and the agency fee; lists what's missing", () => {
    const fee = e.placementFee;
    if (fee === "not_applicable" || isTbd(fee)) throw new Error("expected fees");
    expect(e.annualAllIn.known.low).toBeCloseTo(
      e.annualWages.low + e.employerTaxes.known.low + fee.range.low,
    );
    expect(e.annualAllIn.pending).toEqual(["Mass. unemployment insurance"]);
    expect(e.familyShareHourly).toBe("not_applicable");
  });

  it("lists every figure it used as a source", () => {
    const metrics = new Set(e.sources.map((s) => s.metric));
    for (const m of ["hourly_rate_avg", "fica_employer_rate", "futa_net_rate", "ma_pfml_rate", "placement_fee", "upfront_fee"]) {
      expect(metrics.has(m as never)).toBe(true);
    }
  });
});

describe("part-time", () => {
  it("uses the part-time data point", () => {
    const e = estimate(input({ arrangement: "part_time", hoursPerWeek: 20, youngestAgeBand: "3_5y" }));
    expect(e.segment).toBe("part_time");
    expect(e.hourly).toEqual({ low: 21.37, mid: 21.37, high: 21.37 });
    expect(e.weekly.mid).toBeCloseTo(21.37 * 20);
    expect(e.caveats.join(" ")).toMatch(/single source/);
  });
});

describe("newborn", () => {
  it.each(["0_12m", "expecting"] as const)("youngest %s uses newborn rates", (band) => {
    const e = estimate(input({ youngestAgeBand: band, children: band === "expecting" ? 0 : 1 }));
    expect(e.segment).toBe("newborn");
    expect(e.hourly.mid).toBe(24.2);
  });
});

describe("nanny share", () => {
  it("keeps the nanny's full rate and marks the family's share TBD", () => {
    const e = estimate(input({ arrangement: "nanny_share", youngestAgeBand: "1_2y" }));
    expect(e.segment).toBe("general");
    expect(isTbd(e.familyShareHourly)).toBe(true);
    expect(e.annualAllIn.pending).toContain("Your family's share of a nanny share");
    expect(e.caveats.join(" ")).toMatch(/whole nanny/);
  });

  it("applies the split once it is known", () => {
    const e = estimate(input({ arrangement: "nanny_share" }), withKnownAssumptions());
    expect(asRange(e.familyShareHourly).mid).toBeCloseTo(e.hourly.mid * 0.6);
  });
});

describe("missing data", () => {
  it("never invents a number: TBD carries a reason", () => {
    const ui = line(estimate(input()), "ma_ui").value;
    expect(isTbd(ui) && ui.reason.length).toBeGreaterThan(10);
  });

  it("an independent hire has no placement fee", () => {
    const e = estimate(input({ viaAgency: false }));
    expect(e.placementFee).toBe("not_applicable");
    expect(e.annualAllIn.known.mid).toBeCloseTo(e.annualWages.mid + e.employerTaxes.known.mid);
  });

  it("applies agency minimums for small schedules", () => {
    // Part-time, 20 h/week: 15% and 18% both fall below each agency's minimum.
    const fee = estimate(input({ arrangement: "part_time", hoursPerWeek: 20, youngestAgeBand: "3_5y" })).placementFee;
    if (fee === "not_applicable" || isTbd(fee)) throw new Error("expected fees");
    expect(fee.range.low).toBe(4500 + 300);
    expect(fee.range.high).toBe(7500 + 500);
  });

  it("skips FICA and FUTA below the IRS thresholds", () => {
    // 2 h/week × $21.37 × 52 = $2,222: under $3,000/yr and $1,000/quarter.
    const e = estimate(input({ arrangement: "part_time", hoursPerWeek: 2, youngestAgeBand: "3_5y" }));
    expect(asRange(line(e, "fica").value).mid).toBe(0);
    expect(asRange(line(e, "futa").value).mid).toBe(0);
  });

  it("shows agency fees as TBD when no agency has published one", () => {
    const noFees: CostModel = {
      ...costData,
      data_points: costData.data_points.filter((p) => p.metric !== "placement_fee"),
    };
    const e = estimate(input(), noFees);
    expect(isTbd(e.placementFee)).toBe(true);
    expect(e.annualAllIn.pending).toContain("Agency placement fee");
  });

  it("falls back to general rates when a segment has no data", () => {
    const noPartTime: CostModel = {
      ...costData,
      data_points: costData.data_points.filter((p) => p.segment !== "part_time"),
    };
    const e = estimate(input({ arrangement: "part_time", youngestAgeBand: "3_5y" }), noPartTime);
    expect(e.segment).toBe("general");
    expect(e.caveats.join(" ")).toMatch(/don't have part-time rates/);
  });

  it("all-in is complete once MA UI is known", () => {
    const e = estimate(input({ youngestAgeBand: "3_5y" }), withKnownAssumptions());
    expect(e.annualAllIn.pending).toEqual([]);
    expect(asRange(line(e, "ma_ui").value).mid).toBeCloseTo(e.annualWages.mid * 0.02);
  });

  it("flags what the data doesn't cover", () => {
    const e = estimate(input({ hoursPerWeek: 50, children: 2, liveIn: true, zip: "02130" }));
    const text = e.caveats.join(" ");
    expect(text).toMatch(/overtime/);
    expect(text).toMatch(/number of children/);
    expect(text).toMatch(/live-in/);
    expect(text).toMatch(/neighborhood/);
  });

  it("rejects impossible inputs", () => {
    expect(() => estimate(input({ hoursPerWeek: 0 }))).toThrow();
    expect(() => estimate(input({ hoursPerWeek: 71 }))).toThrow();
    expect(() => estimate(input({ zip: "2130" }))).toThrow();
  });
});

describe("helpers", () => {
  it("median handles odd and even lists", () => {
    expect(median([3, 1, 2])).toBe(2);
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it("formats money", () => {
    expect(usd(22.61)).toBe("$22.61");
    expect(usd(47028.8)).toBe("$47,029");
    expect(usd(300)).toBe("$300");
    expect(usd(0)).toBe("$0");
    expect(usdRange({ low: 21.37, mid: 21.37, high: 21.37 })).toBe("$21.37");
    expect(usdRange({ low: 22.61, mid: 22.635, high: 22.66 })).toBe("$22.61–$22.66");
  });
});
