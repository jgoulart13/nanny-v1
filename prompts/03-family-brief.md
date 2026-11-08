# Step 03 — Family brief (web + API)

Read `specs/family-brief.schema.json` and the brief section of `docs/04-prd-v1.md`.

1. Database (Neon via the Vercel Marketplace + Drizzle). Walk Jonathan through setup. Tables:
   - `briefs` (id, created_at, status [pending_confirmation | new | forwarded | closed], channel, payload jsonb, confirmed_at)
   - `events` (id, ts, name, brief_id nullable, props jsonb)
   - `quotes` (id, brief_id, agency_name, forwarded_at, first_response_at, quoted_hourly, placement_fee, guarantee_period, outcome, notes)
2. `lib/briefSchema.ts`: a zod mirror of the JSON schema. Test that it rejects extra fields (no child PII can sneak in).
3. `POST /api/brief`: validate → insert → fire `brief_submitted` → return `{ brief_id, confirmation_required }`. Web submissions are confirmed immediately; API/MCP submissions go to `pending_confirmation`. Add basic rate limiting.
4. `/brief`: a 4-step form (Location & timing → Kids & arrangement → Must-haves & budget → Contact & consent). Capture referrer and UTM in hidden fields. Ask "How did you find us?" with an AI-assistant option and a follow-up asking which one.
5. Confirmation page: their personal estimate (reuse the estimator) + checkbox "Keep my profile and alert me for future care needs (travel, temporary, new baby)" → `profile_opt_in` + a fake-door button "Concierge+ — we negotiate for you ($TBD)" → `concierge_plus_click` → "Thanks! We're testing this. You'll be first to know."

**Acceptance:** a web brief lands in the DB with its source fields; the API rejects invalid payloads with clear errors; the opt-in and fake-door events are recorded.
