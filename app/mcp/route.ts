// /mcp: a remote MCP server (Streamable HTTP, via Vercel's mcp-handler 2.x).
// One tool: estimate_nanny_cost. No resources, no prompts, no sessions, no SSE.
// Paste https://<domain>/mcp into an MCP client (e.g. a Claude custom connector).
//
// Privacy: read-only; nothing stored or logged.
// TODO(jonathan): after deploy, add a Vercel Firewall rate-limit rule for /mcp
// (see the step 04b summary).

import { createMcpHandler } from "mcp-handler";
import { config } from "@/lib/config";
import { ESTIMATE_TOOL_NAME, estimateToolConfig, runEstimateTool } from "@/lib/mcpTool";

const handler = createMcpHandler(
  (server) => {
    server.registerTool(ESTIMATE_TOOL_NAME, estimateToolConfig, runEstimateTool);
  },
  { serverInfo: { name: config.brand, version: "1.0.0" } },
);

export { handler as GET, handler as POST, handler as DELETE };
