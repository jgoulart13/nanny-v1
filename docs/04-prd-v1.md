# PRD — v1 Site

## Goal
Measure real demand from families and from AI agents for a buyer-side, price-transparent front door to Boston nanny agencies, while collecting pricing data. **Speed over polish. Ship in under 2 weeks.**

## Users
- **Family:** Boston-area parents needing a nanny (full-time, part-time, newborn, nanny share). Often searching through an AI assistant.
- **Family's AI agent:** reads the site, cites the cost data, and submits a brief through the API or MCP on the family's behalf.
- **Operator (Jonathan):** receives briefs, forwards them to agencies, logs outcomes.
- **Agency (secondary):** applies to receive briefs.

## Pages
| Route | Purpose | Key content |
|---|---|---|
| `/` | Front door | Value prop: "Find a great Boston nanny through trusted agencies, and know what you should pay." CTA → estimator / brief. How we're paid (short). |
| `/boston/nanny-cost` | **Hero content and AEO target** | All-in cost explainer, source table, estimator, FAQ, "last updated" date, method notes |
| `/brief` | Family brief | Multi-step form (see the schema) → confirmation with a personal estimate + profile opt-in + fake-door Concierge+ |
| `/how-it-works` | Trust | We work for the family; how agencies are vetted; **disclosure of agency payments** |
| `/for-agencies` | Supply recruiting | Short pitch + agency application form |
| `/faq` | AEO | 10–15 real Q&As (cost, taxes, agency vs. independent, nanny share) |
| `/privacy`, `/terms` | Required | Plain language; what we collect; who we share it with (named agencies, with consent) |

## Estimator (v1 logic)
Inputs: hours/week, number of children, youngest child's age band, neighborhood or ZIP, live-out/live-in, arrangement (full-time / part-time / share), agency vs. independent.
Outputs: hourly range, weekly gross, an estimate of employer taxes and payroll, an agency placement fee range (**placeholder until discovery**; show as "TBD — we're collecting this"), all-in annual cost.
Logic is in `lib/estimator.ts`, driven by `data/boston-cost-seed.json`. Every number shows its source and a confidence label.

## Family brief
Fields: `specs/family-brief.schema.json`. Rules:
- **No child names or birthdates.** Use age bands only.
- Explicit consent checkbox to share with up to 3 partner agencies.
- Separate opt-in: "Keep my profile for future needs."
- Capture the source: referrer, UTM, a self-reported "How did you find us?" (including "An AI assistant — which one?"), and the channel (web / api / mcp).

## Flows
1. Family → cost page → estimator → "Get matched" → brief → confirmation (estimate + opt-in).
2. Agent → reads llms.txt / cost page → calls `POST /api/brief` or MCP `submit_family_brief` → gets a brief ID back + a confirmation link for the family to verify by email.
3. Brief saved → email to the operator with a formatted brief + a one-click "forwarded to" log link.
4. Operator forwards by hand → logs agency, response time, quote and fee in the quotes table.

## Acceptance criteria
- [ ] All pages render fully without JavaScript (server-rendered) and pass Lighthouse SEO ≥ 95.
- [ ] The cost page has JSON-LD (Article + FAQPage + Dataset), a visible "last updated" date and source links.
- [ ] `/llms.txt`, `/openapi.json`, `/sitemap.xml` and `robots.txt` are live; robots allows the major AI crawlers.
- [ ] A brief submitted via web, API and MCP lands in the database and emails the operator within 1 minute.
- [ ] Agent-submitted briefs need email confirmation by the family before forwarding.
- [ ] Analytics capture referrer and channel for every brief.
- [ ] No child PII fields exist anywhere in the schema.

## Non-goals (v1)
Nanny profiles, logins and accounts, payments, automated agency routing or bidding, other cities, other care types, a mobile app.
