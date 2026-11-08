# Step 05 — Concierge ops (the manual back end)

Keep this minimal. Jonathan routes by hand; we just make that fast and logged.

1. When a brief becomes `new`, email `{{OPERATOR_EMAIL}}` via Resend:
   - Subject: `New brief · {{neighborhood}} · {{arrangement}} · start {{timing}}`
   - Body: a clean, forwardable summary (with no family contact details in the top section, so it can be forwarded to an agency as-is), followed by the contact details and a link to `/ops/brief/[id]`.
2. `/ops` (protected by a single password in an env var; this is not a user-accounts system):
   - A list of briefs with status and source.
   - A brief page with a "Log forward" form (agency, forwarded_at) and a "Log response" form (first response time, quoted hourly rate, placement fee, guarantee, outcome, notes) → `quotes` table.
   - A CSV export of briefs, quotes and events.
3. `/for-agencies` application form → email to the operator + an `agency_apply` event.
4. `/ops/metrics`: a plain table of the weekly readout numbers from `docs/06-measurement.md`.

**Acceptance:** Jonathan can take a brief from email → forward → log the quote in under 2 minutes; `/ops` is unreachable without the password; CSV export works.
