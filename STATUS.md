# Silly Goose: status and handoff (2026-11-18)

Read this first in any new session (Claude Projects or Claude Code).

## What it is
A content-first, agent-discoverable site for Boston parents on what childcare really costs. It's the v1 demand test for Jonathan's "distribution moves to agents" thesis. Matching families to agencies (`/brief`, `/for-agencies`) is **built but hidden** until at least 3 agencies agree to receive briefs (gate G0).

## Done (merged to `main`)
- **Brand:** Silly Goose. Lowercase "silly goose" wordmark in Newsreader, plus the goose + gosling mark (`public/brand/`) as header, footer and favicon.
- **Home page** (matches artboard 11 on the design canvas): hero "Childcare is personal. The price shouldn't be a mystery." → blush band with 4 guide cards → "We've been there" timeline + letter card (signed Jonathan & Taliya) → "Five things worth your 10pm" digest card.
- **Guides (published):** main guide `/guides/boston-nanny-cost`, plus wages, Massachusetts nanny taxes, agency fees, and nanny vs. daycare. All sourced and dated.
- **FAQ:** 12 questions mirroring the guides, each linking to its guide.
- **About:** story only. **Privacy and terms:** short and plain. No funding or "how we get paid" sections (CLAUDE.md rule 5).
- **Estimator `/estimate`:** through an agency it uses agency-placed rates ($30–35/hr); hiring on your own uses job-site rates (~$22.6/hr). Mass. unemployment uses the real Mass. DUA rate (2.42% of the first $15,000). Workers' comp is a line (required at 16+ hrs/week; premium **TBD — collecting**, no citable Mass. figure yet). Paid time off is shown (2 weeks typical, Care.com/INA) but never added to the total, since 52 weeks of wages already covers it. The "Email me this estimate" card is a disabled placeholder.
- **Headline answer (step 02f, 2026-11-20):** full-time through an agency costs about **$77,000–92,000** in year one (wages $62,000–73,000, employer taxes ~$5,000–6,000, one-time placement fee $10,000–14,000, plus workers' comp TBD); on your own at job-site rates about **$51,000**; year two through an agency about $68,000–79,000. Computed in `lib/headline.ts`; leads the main guide and `/llms.txt`, with a test that fails if they drift from the estimator. All five guide titles end in "(2026)".
- **AI discoverability:** `/llms.txt`, an explicit AI-crawler allow list in `robots.ts`, Organization/WebSite/Article/FAQPage structured data, a sitemap, and permanent redirects from the old `/boston/nanny-cost*` pages to the guides.
- **Agent surface, estimate only (step 04b):** `GET /api/estimate` (sourced JSON, no key, no personal data), `/openapi.json`, and a remote MCP server at `/mcp` with one tool, `estimate_nanny_cost` (mcp-handler 2.x, Streamable HTTP). API and MCP share `lib/estimateResponse.ts`, so they always agree with `/estimate`. **Brief tools (`submit_family_brief`, `POST /api/brief`) wait for G0.** After deploy: add the Claude custom connector and the Vercel Firewall rate-limit rule (TODOs in `app/api/estimate/route.ts` and `app/mcp/route.ts`).

## Next, in order
1. **Deploy:** buy a domain, connect GitHub to Vercel, and set `domain` and `operatorEmail` in `lib/config.ts` (still placeholders).
2. **Analytics (step 06, trimmed):** Vercel Analytics + AI-referral attribution. There's no brief, so events are page views, estimator use and guide reads.
3. **Launch checklist (step 07, trimmed):** skip the brief/MCP parts, submit the sitemap to Google Search Console and Bing, and run an end-to-end check.
4. **Weekly AEO check:** ask ChatGPT, Claude, Perplexity and Gemini "How much does a nanny cost in Boston?" and log whether Silly Goose is cited (`docs/06-measurement.md`).
5. **Later:** a working "Email me this estimate" (H5/H6 demand signal; needs Neon + Resend); a better estimator interface; a nanny share guide; a social preview image.

## Discovery (gate G0)
- Calls so far: **The Nanny Haven** (Hope Griggs, 11/9): demand-constrained; 15% + $300 fees; a family wrote "Gemini" as their source on her intake form. See `data/agencies.csv`.
- **Owed to Hope:** the AI search summary, and an intro to Brynn at New England Doula Support.
- **Outreach drafted in Gmail:** Boston Nanny Centre, Washburn (contact form), Jovie, Boston Baby Nurse & Nanny, The Nanny Hub (Jillian, a warm contact).
- Scripts: `docs/03-discovery-scripts.md`. Hypotheses and kill criteria: `docs/02-hypotheses-and-kill-criteria.md`.

## Where things live
- **Repo:** github.com/jgoulart13/nanny-v1. Specs in `docs/`, `design.md`, `prompts/`; content in `content/guides/`; data in `data/`.
- **Design canvas** (home page explorations, logo): https://claude.ai/artifact/SPVJkBh5CkvcASqc95Aqy4
- **Hero image source** (Figma): https://www.figma.com/design/Hdyt9ajaYV5vjQrXxZfrSt
- **Verdant project docs:** one-pager, hypotheses and kill criteria, this status file.

## Local commands
```
git pull
npm install
npm test
npm run build
npm run dev   # then open http://localhost:3000
```
