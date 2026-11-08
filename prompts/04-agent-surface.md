# Step 04 — Agent surface (llms.txt, OpenAPI, MCP, robots)

Read `docs/05-agent-discoverability.md` in full.

1. `/llms.txt` (a route that returns text/plain): what {{BRAND}} is, who it serves (Boston families), the key cost facts with links, how agents can submit a brief (OpenAPI + MCP links), and the privacy and consent rule (the family confirms by email).
2. `/openapi.json`: documents `POST /api/brief`, generated from the zod schema if practical.
3. `/mcp`: a remote MCP server using Vercel's MCP handler for Next.js (**look up the current package and docs first**). Tools:
   - `estimate_nanny_cost` — inputs mirror the estimator; returns the range, all-in cost and sources
   - `submit_family_brief` — input is the FamilyBrief schema; channel is forced to `mcp`; returns brief_id + a "the family will receive a confirmation email" message
   Rate limit it, and don't return any other data.
4. Agent-submitted confirmation: email the family a confirm link via Resend → `/brief/confirm/[token]` sets `confirmed_at` and status `new`.
5. `robots.ts`: allow the major AI search and user-agent crawlers explicitly. **Verify the current user-agent names from each provider's docs** and list them with a comment linking each source.
6. JSON-LD Organization + Service (areaServed Boston) in the root layout.
7. Test the MCP server with the MCP Inspector or by adding it as a connector in Claude, and show Jonathan how.

**Acceptance:** `curl` on /llms.txt and /openapi.json works; MCP tools work end to end in a real client; an agent-submitted brief stays pending until it's confirmed.
