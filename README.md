# Nanny v1 — Product Handoff Package

Verdant Partners → Claude Code handoff for the **agent-discoverable Boston nanny demand test**.

Thesis: *distribution moves to agents.* Whoever makes offline, agency-delivered services legible to AI agents captures the routing fee. v1 tests whether families (and their AI assistants) will come to a buyer-side, price-transparent front door for Boston nanny agencies.

## What's in here

```
nanny-v1-handoff/
├── README.md                     ← you are here
├── CLAUDE.md                     ← standing instructions Claude Code reads every session
├── .claude/commands/
│   ├── build-step.md             ← /build-step 03  → runs prompts/03-*.md
│   └── scope-check.md            ← /scope-check    → audits work against v1 scope
├── docs/
│   ├── 01-one-pager.md           ← thesis, wedge, v1 scope, model, risks
│   ├── 02-hypotheses-and-kill-criteria.md
│   ├── 03-discovery-scripts.md   ← agency + family interview guides
│   ├── 04-prd-v1.md              ← pages, flows, acceptance criteria
│   ├── 05-agent-discoverability.md
│   └── 06-measurement.md         ← events, metrics, readout template
├── specs/
│   ├── family-brief.schema.json
│   ├── cost-model.schema.json
│   └── agency.schema.json
├── data/
│   ├── boston-cost-seed.json     ← public asking-rate data, sourced
│   └── agencies.csv              ← fill in as you recruit agencies
└── prompts/                      ← run in order, one per Claude Code session
    ├── 00-kickoff.md
    ├── 01-scaffold.md
    ├── 02-cost-page-and-estimator.md
    ├── 03-family-brief.md
    ├── 04-agent-surface.md
    ├── 05-concierge-ops.md
    ├── 06-analytics.md
    └── 07-launch-checklist.md
```

## How to use it

1. Create the repo (or open the existing one) and copy this whole folder's contents into the repo root. `CLAUDE.md` and `.claude/` must sit at the root.
2. Decide two things first. Claude Code will stop and ask if they're missing:
   - **Brand name and domain.** Everything uses `{{BRAND}}` / `{{DOMAIN}}` until then.
   - **Operator email.** Briefs get forwarded here.
3. Open Claude Code in the repo and run:
   ```
   /build-step 00
   ```
   Then `/build-step 01`, `02`, and so on. One step per session keeps the context clean.
4. Run `/scope-check` before every deploy.
5. In parallel, start agency discovery with `docs/03-discovery-scripts.md`. The two pre-launch questions there decide whether the bidding model is worth building at all.

## Decision gates

| Gate | When | Go if | Kill / pivot if |
|---|---|---|---|
| G0: Agency discovery | Before launch | ≥3 of 5 agencies are demand-constrained AND ≥2 would pay per qualified brief | Agencies are mostly waitlisted → pivot to the family-side tool (cost data and payroll), not routing |
| G1: Agent discovery | Launch + 45 days | AI-assistant referrals show up and briefs are submitted | Zero AI referrals → AEO thesis is early; keep the site as an SEO and data asset only |
| G2: Demand quality | Launch + 90 days | Thresholds in `docs/02` met | See per-hypothesis kill criteria |
