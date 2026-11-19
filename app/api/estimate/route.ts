// GET /api/estimate: the estimator as JSON, for AI agents and other tools.
// Query parameters mirror estimateInputsSchema; missing ones use defaultInputs.
// Same answer as the MCP tool (both call toAgentResponse).
//
// Privacy: read-only, nothing stored or logged (including ZIP codes).
// TODO(jonathan): after deploy, add a Vercel Firewall rate-limit rule for this
// path (see the step 04b summary for click-by-click steps).

import { ZodError } from "zod";
import { CORS_HEADERS, KNOWN_PARAMS, parseQuery } from "@/lib/agentQuery";
import { readableIssues, toAgentResponse, type AgentInputs } from "@/lib/estimateResponse";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const unknown = [...params.keys()].filter((k) => !KNOWN_PARAMS.has(k));

  try {
    const body = toAgentResponse(parseQuery(params) as AgentInputs);
    return Response.json(
      unknown.length ? { ...body, ignored_parameters: unknown } : body,
      {
        headers: {
          ...CORS_HEADERS,
          // Answers only change when the seed data changes.
          "Cache-Control": "public, s-maxage=86400",
        },
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        {
          error: "Some inputs aren't valid. Fix them and try again; every parameter is optional.",
          issues: readableIssues(error),
          docs: "/openapi.json",
        },
        { status: 400, headers: { ...CORS_HEADERS, "Cache-Control": "no-store" } },
      );
    }
    throw error;
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}
