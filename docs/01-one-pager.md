# One-Pager — Agent-Ready Front Door for Boston Nanny Agencies (v1)

**Verdant Partners · Thesis: Distribution moves to agents · Stage: Product handoff (v1 demand test) · Nov 2026**

## Thesis
When families ask an AI assistant to "find us a nanny in Boston," the assistant will route them to whoever has made the offline supply legible: structured, priced and transactable. Nanny agencies are fragmented, high-fee, trust-based and missed the vertical-SaaS moment, so none of them is agent-legible. Whoever sits between the family's agent and the agencies captures the routing fee.

**Thesis map**
- *Service as a Software*: the agency stays. It owns vetting, HR and payroll, backfill, and legal accountability. We don't replace that judgment; we make it findable and comparable.
- *Distribution moves to agents*: v1 is a direct test of whether AI assistants route real families to an agent-legible source.
- *Meta-thesis*: the family's agent becomes the operator of the search. We become the trusted counterparty it talks to.

## The problem (family side)
- **No advocate.** Families end up working with an agency that has its own interests as the priority.
- **Opaque pricing.** There's no Zillow for childcare. Public data is asking-rate listings that disagree with each other: Boston estimates range from about $22.61/hr (Nanny Lane listings) to about $27/hr effective (DaycareCalc) to a $70–105K+ all-in annual cost (local agency guide). None of it shows what agency-placed families actually pay, all-in.
- **Recurring, event-driven need.** Moving, a new baby, travel, temporary care: the same family searches again and again and starts from zero each time.

## The wedge (v1)
A standalone consumer brand (`{{BRAND}}`), Boston only, nannies only:
1. **The true-cost page and estimator.** This is the "free credit score": an honest all-in cost (wage, employer taxes, agency fee, nanny share vs. full-time), built to be cited by AI assistants.
2. **A structured family brief.** One form, or one API/MCP call from an agent, captures the need.
3. **Concierge routing.** The operator forwards each brief by hand to 3–5 vetted partner agencies and logs every quote and fee. Each quote improves the cost data.
4. **An opt-in persistent profile.** "Keep my profile and alert me when I need travel, temporary or new care." This tests the Credit Karma loop.

**Patterns:** Credit Karma (free answer → profile → supply bids on you); Zillow Premier Agent (an ally to incumbents, not a replacement); Kayak (an aggregator that sits on the buyer's side); Capital 49 (profile creation as the onboarding moat).

## Business model (to validate in discovery, not built in v1)
- Primary: a referral fee per agency placement (a % of the agency fee) or a fee per qualified brief.
- Later: an agency subscription to the brief network or bidding access; a family-side premium (payroll via a partner, temporary or travel care).
- **Conflict rule:** we claim to work for the family, so every agency payment is disclosed on the site. This is non-negotiable; if we lose that trust, the whole model fails.

## v1 scope
**In:** cost page and estimator · family brief (web, plus an agent-callable endpoint) · llms.txt, schema.org and a minimal MCP · email routing to the operator · agency quote log · profile opt-in · measurement of AI referrals.
**Out:** nanny profiles and verification · agent-to-agent matching ("agent tinder") · direct-hire payroll · automated bidding · other cities and verticals · general hiring.

## Sequencing beyond v1
v1 builds demand and pricing data → v2 adds a standardized brief that agencies quote against (bidding) → v3 adds portable vetted nanny profiles and two-sided agent matching, **only after** we have demand leverage, because portability goes around the agencies (Zillow first, then maybe Redfin).

## Top risks
1. Good agencies are capacity-constrained (waitlists), so they won't pay for leads. **This is the biggest risk; test it first.**
2. AI assistants don't route to small new sites yet, so the AEO thesis is early.
3. Agencies won't share pricing, so the cost data relies only on what families report.
4. Families won't keep a persistent profile because the need feels episodic.
5. Privacy: family and child data. Collect the minimum.

## Next test
Before launch, ask 5 Boston agencies: *"Would you pay per qualified family brief?"* and *"Would you quote against a standardized brief?"* (see `03-discovery-scripts.md`).
