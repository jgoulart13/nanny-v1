---
description: Audit the codebase against v1 scope, privacy and AEO rules before deploying
---

Audit the repo against `CLAUDE.md` hard rules and the acceptance criteria in `docs/04-prd-v1.md`. Report as a checklist with ✅ / ❌ and a file reference for each ❌:

1. Anything built that's out of scope (accounts, nanny profiles, payments, bidding, other cities)?
2. Any child-PII fields in schemas, DB tables, forms, logs or analytics?
3. Do all pages server-render their content? Spot-check by fetching the HTML.
4. Does every cost figure shown have a source in `data/boston-cost-seed.json`?
5. Are llms.txt, openapi.json, sitemap.xml, robots.txt and the JSON-LD present and valid?
6. Is the agency-payment disclosure linked wherever agencies are mentioned?
7. Are any `{{BRAND}}`-style placeholders still left in production code paths?
8. Is `.env.example` complete, with no secrets committed?

Don't fix anything. Report only, then ask which items to fix.
