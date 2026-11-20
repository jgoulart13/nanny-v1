// The agency-fee-first answer must match the estimator everywhere it appears:
// the main guide's shortAnswer, the guide's first paragraph, and /llms.txt.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { GET as llmsTxt } from "@/app/llms.txt/route";
import { defaultInputs, estimate } from "@/lib/estimator";
import { headline, moneyRange } from "@/lib/headline";

const guide = readFileSync("content/guides/boston-nanny-cost.mdx", "utf8");
const shortAnswer = guide.match(/^shortAnswer: "(.*)"$/m)?.[1] ?? "";
const firstParagraph = guide.split(/^---$/m)[2].trim().split(/\n\s*\n/)[0];
const k = (n: number) => Math.round(n / 1000) * 1000;

describe("headline figures", () => {
  it("come from estimate(defaultInputs), rounded to the nearest $1,000", () => {
    const e = estimate({ ...defaultInputs, viaAgency: true });
    expect(headline.agency.allIn).toEqual({ low: k(e.annualAllIn.known.low), high: k(e.annualAllIn.known.high) });
  });
});

describe("main guide (boston-nanny-cost)", () => {
  for (const [name, text] of [["shortAnswer", shortAnswer], ["first paragraph", firstParagraph]] as const) {
    it(`${name}: first sentence is the all-in cost through an agency, from the estimator`, () => {
      const first = text.split(". ")[0];
      expect(first).toMatch(/through an agency/);
      expect(first).toContain(`costs about ${moneyRange(headline.agency.allIn)} in the first year`);
      expect(first).toContain(`placement fee of ${moneyRange(headline.agency.placementFee)}`);
      expect(first).toContain(`${moneyRange(headline.agency.wages)} in wages`);
      if (headline.pending.includes("Workers' comp insurance")) expect(first).toMatch(/workers' comp/);
    });

    it(`${name}: then the on-your-own figure and year two`, () => {
      expect(text).toContain(`Hiring on your own at job-site rates costs about ${moneyRange(headline.onYourOwn.allIn)}`);
      expect(text).toContain(`year two through an agency costs about ${moneyRange(headline.agency.yearTwo)}`);
    });
  }

  it("shortAnswer stays short (about 70 words or fewer)", () => {
    expect(shortAnswer.split(/\s+/).length).toBeLessThanOrEqual(75);
  });
});

describe("/llms.txt", () => {
  it("first key fact is the same all-in-through-an-agency figure, with the placement fee", async () => {
    const text = await llmsTxt().text();
    const facts = text.split("## Key facts")[1].split("\n").filter((l) => l.startsWith("- "));
    const first = facts[0];
    expect(first).toContain(`costs about ${moneyRange(headline.agency.allIn)} in the first year`);
    expect(first).toContain(`one-time agency placement fee of ${moneyRange(headline.agency.placementFee)}`);
    expect(first).toContain(`about ${moneyRange(headline.onYourOwn.allIn)}`);
    if (headline.pending.includes("Workers' comp insurance")) expect(first).toMatch(/workers' comp insurance/);
  });
});

describe("guide freshness", () => {
  it('every guide title says "(2026)" and has an updated date', async () => {
    const { readdirSync } = await import("node:fs");
    const files = readdirSync("content/guides").filter((f) => f.endsWith(".mdx"));
    expect(files.length).toBe(5);
    for (const f of files) {
      const text = readFileSync(`content/guides/${f}`, "utf8");
      expect(text, f).toMatch(/^title: ".*\(2026\)"$/m);
      expect(text, f).toMatch(/^updated: "\d{4}-\d{2}-\d{2}"$/m);
    }
  });
});
