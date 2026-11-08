# Step 06 — Analytics & AI-source attribution

Read `docs/06-measurement.md`.

1. Turn on Vercel Analytics.
2. `lib/aiSource.ts`: derive `ai_source` from the referrer host or `utm_source` (chatgpt.com, chat.openai.com, claude.ai, perplexity.ai, gemini.google.com, copilot.microsoft.com, plus others as found). Unit-test it.
3. Middleware: on the first page view of a session, store the referrer and UTM in a first-party cookie (no third-party trackers) so `/brief` can attach them.
4. Make sure every event in the measurement doc is fired and stored in `events`.
5. On `/ops/metrics`, break down page views and briefs by ai_source and channel, plus the H-metrics: estimator→brief start, start→submit, opt-in %, Concierge+ clicks, agency median response, quotes logged.

**Acceptance:** a visit with `?utm_source=chatgpt.com` is attributed through to brief submission; the metrics page matches the DB counts.
