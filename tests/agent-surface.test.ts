// Tests for the agent surface: GET /api/estimate, /openapi.json and the MCP tool.
import { describe, expect, it } from "vitest";
import { GET as estimateRoute } from "@/app/api/estimate/route";
import { GET as openApiRoute } from "@/app/openapi.json/route";
import { defaultInputs } from "@/lib/estimator";
import { toAgentResponse, type AgentLine } from "@/lib/estimateResponse";
import { runEstimateTool } from "@/lib/mcpTool";

const call = (query = "") => estimateRoute(new Request(`http://localhost/api/estimate${query}`));

/** Every line has sources, unless it's TBD or not applicable. */
function expectSourcedOrTbd(line: AgentLine) {
  const v = line.value;
  if (v === "not_applicable" || (typeof v === "object" && "tbd" in v)) return;
  expect(line.sources.length, `${line.label} has no sources`).toBeGreaterThan(0);
  for (const s of line.sources) {
    expect(s.url).toMatch(/^https:\/\//);
    expect(s.title.length).toBeGreaterThan(0);
    expect(s.date.length).toBeGreaterThan(0);
  }
}

describe("toAgentResponse", () => {
  it("every line has sources, or is marked TBD", () => {
    const r = toAgentResponse(defaultInputs);
    const a = r.annual;
    for (const line of [a.wages, a.agency_fees, a.all_in, a.employer_taxes.total_known, ...a.employer_taxes.lines, r.hourly]) {
      expectSourcedOrTbd(line);
    }
    expect(r.inputs).toEqual(defaultInputs);
    expect(r.disclaimer).toBe("Information only, not tax or legal advice.");
    expect(r.guide_url).toMatch(/\/guides\/boston-nanny-cost$/);
  });

  it("fills missing fields with defaults", () => {
    expect(toAgentResponse({ hoursPerWeek: 20 }).inputs).toEqual({ ...defaultInputs, hoursPerWeek: 20 });
  });
});

describe("GET /api/estimate", () => {
  it("returns sourced JSON with defaults and open CORS", async () => {
    const res = await call();
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("*");
    expect(res.headers.get("cache-control")).toContain("s-maxage=86400");
    const body = await res.json();
    expect(body.inputs).toEqual(defaultInputs);
  });

  it("converts query-string numbers and booleans", async () => {
    const body = await (await call("?hoursPerWeek=25&viaAgency=false&arrangement=part_time")).json();
    expect(body.inputs).toMatchObject({ hoursPerWeek: 25, viaAgency: false, arrangement: "part_time" });
    expect(body.annual.agency_fees.value).toBe("not_applicable");
  });

  it("returns 400 for hoursPerWeek=0", async () => {
    const res = await call("?hoursPerWeek=0");
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.issues[0].field).toBe("hoursPerWeek");
    expect(body.issues[0].message.length).toBeGreaterThan(5);
  });

  it("returns 400 for an unknown youngestAgeBand", async () => {
    const res = await call("?youngestAgeBand=7_months");
    expect(res.status).toBe(400);
    expect((await res.json()).issues[0].field).toBe("youngestAgeBand");
  });
});

describe("API and MCP agree", () => {
  it("return the same annual numbers for the same inputs", async () => {
    const query = "?hoursPerWeek=45&children=2&youngestAgeBand=0_12m&viaAgency=true";
    const api = await (await call(query)).json();
    const tool = await runEstimateTool({ hoursPerWeek: 45, children: 2, youngestAgeBand: "0_12m", viaAgency: true });
    const json = JSON.parse(tool.content[1].text);
    expect(json.annual).toEqual(api.annual);
    expect(tool.content[0].text).toMatch(/costs about \$[\d,]+/);
    expect(tool.content[0].text).toContain(json.guide_url);
  });
});

describe("/openapi.json", () => {
  it("parses as JSON and lists exactly one path", async () => {
    const res = openApiRoute();
    const doc = JSON.parse(await res.text());
    expect(doc.openapi).toBe("3.1.0");
    expect(Object.keys(doc.paths)).toEqual(["/api/estimate"]);
    const names = doc.paths["/api/estimate"].get.parameters.map((p: { name: string }) => p.name).sort();
    expect(names).toEqual(["arrangement", "children", "hoursPerWeek", "liveIn", "viaAgency", "youngestAgeBand", "zip"]);
  });
});
