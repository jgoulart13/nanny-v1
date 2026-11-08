# Agent Discoverability (AEO) Plan

Goal: when someone asks an AI assistant "how much does a nanny cost in Boston" or "help me find a nanny agency in Boston," the assistant **cites** our cost page and **can act** (submit a brief).

## 1. Be the best answer (content)
- One canonical page: `/boston/nanny-cost`. Answer first, in the first 100 words, with a range and an all-in number.
- Answer the question everyone else skips: **all-in cost through an agency** (wage + employer taxes + placement fee), not just the hourly asking rate.
- Show sources and method, and update it monthly (with a visible date). Assistants prefer pages with clear, fresh facts and citations.
- Add neighborhood sub-sections (Back Bay, JP, Cambridge, Brookline, Newton, Somerville) only when we have data to back them. No thin pages.
- FAQ blocks phrased the way people actually ask.

## 2. Be readable (structure)
- Server-rendered HTML. No content hidden behind client-side JavaScript.
- JSON-LD: `Organization`, `Service` (areaServed: Boston), `FAQPage`, `Dataset` (for the cost table).
- `/llms.txt`: a plain-language summary of what we do, the key cost facts, and how an agent can submit a brief (link to `/openapi.json` and the MCP endpoint).
- `robots.txt`: explicitly allow the AI search and user-agent crawlers (OpenAI, Anthropic, Perplexity, Google). **Verify the current user-agent names at build time**; they change.
- `sitemap.xml` with lastmod dates.

## 3. Be actionable (agent handoff)
- `POST /api/brief`: a JSON API validated against `family-brief.schema.json`, documented in `/openapi.json`.
- A minimal **remote MCP server** at `/mcp` with two tools:
  - `estimate_nanny_cost(inputs) → range + sources`
  - `submit_family_brief(brief) → brief_id + confirmation_url`
- Use Vercel's MCP handler package for Next.js. **Check the current package name and docs at build time.**
- Safety: rate limit; every agent submission needs email confirmation from the family; no data comes back except the brief ID.

## 4. Get indexed and tested
- Submit to Google Search Console and Bing Webmaster Tools (Bing feeds several AI search products).
- Each week, run a fixed prompt set in ChatGPT, Claude, Perplexity and Gemini and log whether we're cited (`06-measurement.md`).
- Get 3–5 real links (local parent groups, a partner agency's site, a Boston parenting newsletter).
