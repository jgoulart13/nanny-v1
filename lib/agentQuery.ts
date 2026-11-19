// lib/agentQuery.ts
// Helpers for GET /api/estimate: query-string parsing and CORS headers.
// Kept out of the route file because Next.js route files may only export
// route handlers.

const NUMBER_PARAMS = ["hoursPerWeek", "children"] as const;
const BOOLEAN_PARAMS = ["liveIn", "viaAgency"] as const;
const STRING_PARAMS = ["youngestAgeBand", "zip", "arrangement"] as const;
export const KNOWN_PARAMS = new Set<string>([...NUMBER_PARAMS, ...BOOLEAN_PARAMS, ...STRING_PARAMS]);

export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/** Turn query-string text into the types zod expects. Bad values stay as text so zod reports them. */
export function parseQuery(params: URLSearchParams): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const key of NUMBER_PARAMS) {
    const v = params.get(key);
    if (v !== null && v !== "") out[key] = /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v;
  }
  for (const key of BOOLEAN_PARAMS) {
    const v = params.get(key)?.toLowerCase();
    if (v === undefined || v === "") continue;
    out[key] = v === "true" || v === "1" ? true : v === "false" || v === "0" ? false : v;
  }
  for (const key of STRING_PARAMS) {
    const v = params.get(key);
    if (v !== null && v !== "") out[key] = v;
  }
  return out;
}

