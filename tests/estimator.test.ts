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
      employer_tax_rate_estimate: { value: 0.1 },
      placement_fee: { value: 0.15 },
      nanny_share_discount: { value: 0.4 },
    },
  };
}

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
    expect(e.sources.map((s) => s.value).sort()).toEqual([22.61, 22.66]);
  });

  it("weekly = hourly × hours, annual = weekly × 52", () => {
    expect(e.weekly.low).toBeCloseTo(22.61 * 40);
    expect(e.annualWages.high).toBeCloseTo(22.66 * 40 * WEEKS_PER_YEAR);
  });

  it("shows taxes, fee and all-in as TBD while the data is missing", () => {
    expect(isTbd(e.employerTaxes)).toBe(true);
    expect(isTbd(e.placementFee)).toBe(true);
    expect(isTbd(e.annualAllIn)).toBe(true);
    expect(e.familyShareHourly).toBe("not_applicable");
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
    expect(isTbd(e.annualAllIn)).toBe(true);
    expect(e.caveats.join(" ")).toMatch(/full rate/);
  });

  it("applies the split once it is known", () => {
    const e = estimate(input({ arrangement: "nanny_share" }), withKnownAssumptions());
    expect(asRange(e.familyShareHourly).mid).toBeCloseTo(e.hourly.mid * 0.6);
  });
});

describe("missing data", () => {
  it("never invents a number: TBD carries a reason", () => {
    const e = estimate(input());
    for (const x of [e.employerTaxes, e.placementFee, e.annualAllIn]) {
      expect(isTbd(x) && x.reason.length).toBeGreaterThan(10);
    }
  });

  it("an independent hire has no placement fee", () => {
    const e = estimate(input({ viaAgency: false }));
    expect(e.placementFee).toBe("not_applicable");
    // Taxes are still unknown, so all-in is still TBD.
    expect(isTbd(e.annualAllIn)).toBe(true);
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

  it("computes all-in once every assumption is known", () => {
    const e = estimate(input({ youngestAgeBand: "3_5y" }), withKnownAssumptions());
    const wages = e.annualWages.mid;
    expect(asRange(e.annualAllIn).mid).toBeCloseTo(wages * (1 + 0.1 + 0.15));
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
    expect(usdRange({ low: 21.37, mid: 21.37, high: 21.37 })).toBe("$21.37");
    expect(usdRange({ low: 22.61, mid: 22.635, high: 22.66 })).toBe("$22.61–$22.66");
  });
});
