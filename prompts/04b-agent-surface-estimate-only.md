# Step 04b — Agent surface, estimate only (API, OpenAPI, MCP)

This is the part of step 04 that does **not** depend on gate G0. Agents get one action: price a Boston nanny search with our sourced numbers. Family briefs stay paused, so no `submit_family_brief`, no `POST /api/brief`, no confirmation email.

Read first: `CLAUDE.md`, `AGENTS.md`, `docs/05-agent-discoverability.md` §3, `prompts/04-agent-surface.md` (the original step; this one replaces items 2, 3 and 7 for now), and `lib/estimator.ts`.

## Rules for this step
- **No personal data in, no personal data out.** The inputs are only what `estimateInputsSchema` already accepts (hours, number of children, age band, optional ZIP, live-in, arrangement, via agency). No names, emails, free text or birthdates. Don't log ZIP codes.
- **No new services and no secrets.** No database, no Resend, no Upstash. If you think something needs one, stop and ask.
- **One source of truth.** Every surface calls the existing `estimate()` in `lib/estimator.ts` and validates input with `estimateInputsSchema`. Don't copy the math or the numbers anywhere else.
- **Every number keeps its source.** Responses include the source list for each line. TBD lines come back as TBD, never filled in.
- Don't link `/brief` or `/for-agencies` from anything you add here; they stay hidden (`docs/04-prd-v1.md`).

## Build

1. **`lib/estimateResponse.ts`**: one function `toAgentResponse(inputs)` that runs `estimate()` and returns plain JSON:
   - `inputs` (as validated, with defaults applied)
   - `annual` (low / mid / high for wages, employer taxes, agency fees, and the all-in total), each line with `label`, `value` (or `{ tbd: true, reason }`), `note`, and `sources` (title, publisher, URL, date)
   - `tbd_lines`: labels still being collected
   - `as_of`: the data date from `data/boston-cost-seed.json`
   - `guide_url`: `${siteUrl}/guides/boston-nanny-cost`, and `estimator_url`: `${siteUrl}/estimate`
   - `disclaimer`: "Information only, not tax or legal advice."
   The API and the MCP tool both use this, so they can never disagree.

2. **`GET /api/estimate`** (`app/api/estimate/route.ts`): query parameters mirror the schema (`hoursPerWeek`, `children`, `youngestAgeBand`, `zip`, `liveIn`, `arrangement`, `viaAgency`). Missing params use `defaultInputs`. Convert numbers and booleans from strings before running zod. Invalid input returns 400 with the zod issues in plain English. Also:
   - `Cache-Control: public, s-maxage=86400` (the answer only changes when the seed data changes)
   - `Access-Control-Allow-Origin: *` and an `OPTIONS` handler, so browser-based agents can call it
   - GET only (it's a read, and GET makes it easier for agents that can only fetch URLs)

3. **`/openapi.json`** (`app/openapi.json/route.ts`): an OpenAPI 3.1 document covering only `GET /api/estimate`. Generate the parameter schema from `estimateInputsSchema` with zod 4's built-in JSON Schema conversion (check the zod 4 docs for the current function name). `servers[0].url` = `siteUrl`. Write the operation's `description` for an AI reader: what it returns, that the numbers are Boston/Massachusetts 2026, sourced, and include employer taxes and agency fees, not just the hourly rate.

4. **`/mcp`**: a remote MCP server using Vercel's MCP handler for Next.js. **Look up the current package name and docs first** (it was published as `@vercel/mcp-adapter` and later renamed `mcp-handler`; confirm which is current and that it supports Next.js 16). Use the Streamable HTTP transport and serve it at exactly `/mcp`. If the package wants a dynamic `[transport]` route, set it up so `/mcp` is the URL Jonathan pastes into Claude, and turn off SSE unless the docs say it's required. One tool:
   - **`estimate_nanny_cost`**. Input schema = `estimateInputsSchema` (every field optional, with defaults from `defaultInputs`). Returns `toAgentResponse()` as JSON text content, plus a one-paragraph plain-English summary first ("A full-time nanny for one toddler in Boston, hired through an agency, costs about $X–Y in year one, all-in…") that cites the guide URL.
   - Tool description, written for the model that picks the tool: "Estimate the full annual cost of hiring a nanny in Boston, Massachusetts in 2026: wages, employer taxes and agency fees, with sources. Use when a family asks what a nanny costs in Boston or the Boston area."
   - Server name: `config.brand`. No other tools, resources or prompts.

5. **Rate limiting**: don't build it in code (in-memory counters don't work across serverless instances, and we're not adding a database). Instead, leave `TODO(jonathan):` notes and give Jonathan click-by-click steps to add a **Vercel Firewall rate-limit rule** for `/api/estimate` and `/mcp` after deploy (check Vercel's current docs for where this lives and what the free plan allows). Suggested starting limit: 60 requests per minute per IP.

6. **`/llms.txt`**: add a section after "More":
   ```
   ## For AI agents
   - [Cost estimate API](…/api/estimate?hoursPerWeek=40&children=1&youngestAgeBand=1_2y&liveIn=false&arrangement=full_time&viaAgency=true): JSON, sourced. Documented at …/openapi.json
   - MCP server: …/mcp (tool: estimate_nanny_cost)
   ```
   Build the URLs from `siteUrl`. Don't mention briefs or matching.

7. **Robots and sitemap**: make sure `robots.ts` doesn't block `/api/estimate`, `/openapi.json` or `/mcp`. Leave all three out of the sitemap (they aren't pages).

8. **Analytics hook (small)**: add one line to `BACKLOG.md`: "Step 06: count `estimate_called` events by channel (web / api / mcp) and ai_source." Don't build the events table here.

9. **Tests** (vitest, next to `tests/estimator.test.ts`):
   - `toAgentResponse(defaultInputs)` has every line with sources, or is marked TBD
   - the API route handler returns 400 for `hoursPerWeek=0` and for an unknown `youngestAgeBand`
   - the API and the MCP tool return the same `annual` numbers for the same inputs
   - the OpenAPI document parses as JSON and lists exactly one path

## Show Jonathan how to test

Local, with `npm run dev` running:
1. `curl "http://localhost:3000/api/estimate"` → JSON with sources.
2. `curl "http://localhost:3000/api/estimate?hoursPerWeek=0"` → 400 with a readable error.
3. `curl http://localhost:3000/openapi.json` → the spec.
4. MCP Inspector: give the exact command (check the current one, e.g. `npx @modelcontextprotocol/inspector`), connect to `http://localhost:3000/mcp` with Streamable HTTP, and run `estimate_nanny_cost` with defaults.

After deploy (needs the public URL from the deploy step):
5. In Claude, add a custom connector with URL `https://{{DOMAIN}}/mcp` (look up the current click path in Claude's settings and write it out). Ask: "What would a full-time nanny for my 18-month-old in Boston cost through an agency?" Claude should call `estimate_nanny_cost` and cite the guide.
6. Add the Vercel Firewall rule from item 5.

## Acceptance
- `/api/estimate`, `/openapi.json` and `/mcp` work locally and in production.
- In a real Claude conversation, `estimate_nanny_cost` is called and its numbers match `/estimate` for the same inputs.
- No personal data accepted, stored or logged. `npm test` and `npm run build` pass.
- `docs/` is unchanged. Update `claude/silly-goose-status.md` in the Verdant project (or tell Jonathan to) so it says step 04b is done and brief tools wait for G0.

Commit message: `Step 04b: estimate-only agent surface (API, OpenAPI, MCP)`. Finish with what changed, how to test, and what's next.
