# Step 01 — Scaffold & deploy a skeleton

Goal: a live Vercel URL with every route stubbed out, so all later steps are additions.

1. Scaffold Next.js (App Router, TypeScript, Tailwind, ESLint) in the repo root, keeping the existing `docs/`, `specs/`, `data/`, `prompts/` and `.claude/` folders.
2. Create stub pages for every route in `docs/04-prd-v1.md`, each with an H1 and a one-line description. Add a shared layout with a header (brand, Cost, How it works, For agencies) and a footer (privacy, terms, "How we get paid").
3. Set up shadcn/ui using Jonathan's preset command (ask him for it if it isn't in `design.md`; last known: `pnpm dlx shadcn@latest init --preset b1You7AFk --template next --pointer`). Then override the theme's CSS variables and fonts with the tokens in `design.md`. Add only: button, card, badge, table, accordion, form, input, select, radio-group, checkbox, navigation-menu. If the shadcn MCP server is available, use it to look up the components.
4. Build a hidden `/styleguide` page showing the colors, type scale, buttons, card, table and badges, so Jonathan can review the look in one place. Add it to `robots` as noindex.
5. Add `app/sitemap.ts` and `app/robots.ts` (allow-all for now; refined in step 04).
6. Walk Jonathan through connecting the GitHub repo to Vercel and deploying.

**Acceptance:** `/styleguide` matches `design.md` (colors, fonts, pill buttons); the Vercel preview URL loads every route; `view-source` shows real HTML content; `npm run build` passes.
