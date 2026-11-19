// lib/mcpTool.ts
// The one MCP tool, estimate_nanny_cost. Registered by app/mcp/route.ts;
// kept here so tests can call it directly.

import { agentInputsSchema, summarize, toAgentResponse, type AgentInputs } from "@/lib/estimateResponse";

export const ESTIMATE_TOOL_NAME = "estimate_nanny_cost";

export const estimateToolConfig = {
  title: "Estimate nanny cost (Boston)",
  description:
    "Estimate the full annual cost of hiring a nanny in Boston, Massachusetts in 2026: wages, employer taxes and agency fees, with sources. Use when a family asks what a nanny costs in Boston or the Boston area.",
  // Every field optional; missing ones use the defaults (full-time, 40 h/week,
  // one toddler, through an agency).
  inputSchema: agentInputsSchema,
  annotations: { readOnlyHint: true, openWorldHint: false },
};

/** Summary paragraph first, then the full JSON (same as GET /api/estimate). */
export async function runEstimateTool(args: AgentInputs) {
  const response = toAgentResponse(args);
  return {
    content: [
      { type: "text" as const, text: summarize(response) },
      { type: "text" as const, text: JSON.stringify(response, null, 2) },
    ],
  };
}
