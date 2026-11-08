# Measurement

## Events (track server-side where possible)
| Event | Properties | Hypothesis |
|---|---|---|
| `page_view` | path, referrer, utm_*, ai_source (derived) | H4 |
| `estimator_used` | inputs (no PII), output range | H5 |
| `brief_started` | channel (web/api/mcp), ai_source | H5 |
| `brief_submitted` | brief_id, channel, ai_source, self_reported_source | H4, H5 |
| `brief_confirmed` | brief_id (agent-submitted briefs only) | H4 |
| `profile_opt_in` | brief_id | H6 |
| `concierge_plus_click` | brief_id | H8 |
| `agency_apply` | agency_name | H7 |

**Deriving `ai_source`:** match the referrer host or `utm_source` against: chatgpt.com, chat.openai.com, claude.ai, perplexity.ai, gemini.google.com, copilot.microsoft.com. Many assistant links strip referrers, so also rely on the self-reported field and the API/MCP channel.

## Ops log (quotes table in the database, or `data/agencies.csv` to start)
Per forwarded brief: brief_id, agency, forwarded_at, first_response_at, quoted_hourly, placement_fee, guarantee_period, outcome (no response / call booked / placed / lost), notes.

## Weekly AEO check
A fixed prompt set, run in 4 assistants: "How much does a nanny cost in Boston?", "Best nanny agency in Boston", "Find me a nanny in Jamaica Plain", "Nanny vs. daycare cost Boston", "All-in cost of a nanny through an agency in Boston." Log: cited Y/N, position, competitor cited.

## Weekly readout (paste into the Verdant project)
```
Week of ____
Traffic: __ visits (__ AI-referred)   Estimator: __   Briefs: __ (web __ / api __ / mcp __)
Opt-in rate: __%   Concierge+ clicks: __
Agencies: __ active · median response __h · quotes logged __ · fees disclosed __
AEO check: cited in __/20 prompts
Hypotheses moved: H_ (pass/fail/inconclusive) — why
Next week's one experiment:
```
