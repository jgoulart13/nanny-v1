// lib/openapi.ts
// The OpenAPI 3.1 document for GET /api/estimate, served at /openapi.json.
// Parameters are generated from estimateInputsSchema (zod 4's toJSONSchema),
// so the docs can't drift from what the API actually accepts.

import { z } from "zod";
import { config, siteUrl } from "@/lib/config";
import { defaultInputs, estimateInputsSchema } from "@/lib/estimator";
import { inputDescriptions } from "@/lib/estimateResponse";

const lineSchema = {
  type: "object",
  properties: {
    label: { type: "string" },
    value: {
      description: "Whole US dollars as {low, mid, high}; or {tbd: true, reason} when not yet sourced; or \"not_applicable\".",
    },
    note: { type: "string" },
    sources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          publisher: { type: "string" },
          url: { type: "string", format: "uri" },
          date: { type: "string" },
        },
      },
    },
  },
} as const;

export function buildOpenApi() {
  const json = z.toJSONSchema(estimateInputsSchema, { io: "input" }) as {
    properties: Record<string, Record<string, unknown>>;
  };
  const defaults = defaultInputs as Record<string, unknown>;

  const parameters = Object.entries(json.properties).map(([name, schema]) => ({
    name,
    in: "query",
    required: false,
    description: inputDescriptions[name as keyof typeof inputDescriptions],
    schema: defaults[name] !== undefined ? { ...schema, default: defaults[name] } : schema,
  }));

  return {
    openapi: "3.1.0",
    info: {
      title: `${config.brand} nanny cost API`,
      version: "1.0.0",
      description:
        "Sourced estimates of what a nanny costs in Boston, Massachusetts. Read-only, no key needed, no personal data.",
    },
    servers: [{ url: siteUrl }],
    paths: {
      "/api/estimate": {
        get: {
          operationId: "estimateNannyCost",
          summary: "Estimate the full annual cost of a nanny in Boston, MA",
          description:
            "Returns the first-year, all-in cost of hiring a nanny in Boston, Massachusetts, using 2026 figures: wages (hourly rate × hours × 52 weeks), each employer tax (Social Security and Medicare, federal unemployment, Massachusetts paid leave and unemployment insurance) and, if hiring through an agency, the one-time placement fee. Not just the hourly rate. Every line lists its sources (title, publisher, URL, date); anything not yet sourced comes back as TBD instead of a guess. All parameters are optional; missing ones use a full-time, 40-hour, one-toddler, agency default. Includes links to the full guide and the interactive estimator. Information only, not tax or legal advice.",
          parameters,
          responses: {
            "200": {
              description: "The estimate, with sources for every line.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      inputs: { type: "object", description: "The inputs used, with defaults applied." },
                      annual: {
                        type: "object",
                        properties: {
                          wages: lineSchema,
                          employer_taxes: {
                            type: "object",
                            properties: { total_known: lineSchema, lines: { type: "array", items: lineSchema } },
                          },
                          agency_fees: lineSchema,
                          all_in: lineSchema,
                        },
                      },
                      hourly: lineSchema,
                      tbd_lines: { type: "array", items: { type: "string" } },
                      caveats: { type: "array", items: { type: "string" } },
                      as_of: { type: "string", format: "date" },
                      guide_url: { type: "string", format: "uri" },
                      estimator_url: { type: "string", format: "uri" },
                      disclaimer: { type: "string" },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Invalid input. `issues` lists each field and what's wrong, in plain English.",
            },
          },
        },
      },
    },
  };
}
