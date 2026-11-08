# Step 01 — Scaffold & deploy a skeleton

Goal: a live Vercel URL with every route stubbed out, so all later steps are additions.

1. Scaffold Next.js (App Router, TypeScript, Tailwind, ESLint) in the repo root, keeping the existing `docs/`, `specs/`, `data/`, `prompts/` and `.claude/` folders.
2. Create stub pages for every route in `docs/04-prd-v1.md`, each with an H1 and a one-line description. Add a shared layout with a header (brand, Cost, How it works, For agencies) and a footer (privacy, terms, "How we get paid").
3. Typography and look: clean, warm and trustworthy, readable on a phone. No stock-photo hero. Keep it simple; content is the product.
4. Add `app/sitemap.ts` and `app/robots.ts` (allow-all for now; refined in step 04).
5. Walk Jonathan through connecting the GitHub repo to Vercel and deploying.

**Acceptance:** the Vercel preview URL loads every route; `view-source` shows real HTML content; `npm run build` passes.
