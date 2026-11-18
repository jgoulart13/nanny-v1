# Step 02b — Content-first pass (design + information architecture)

Read first: the **scope change box** at the top of `docs/04-prd-v1.md`, all of `docs/07-content-plan.md`, and `design.md` (especially "Color roles" and "Imagery").

Do these in order and commit after each group.

## A. Hide matching (do this first)
1. Remove every link to `/brief` and `/for-agencies` from the nav, footer, home page and cost page. Remove all "Get matched" / "vetted agencies" CTAs.
2. Add `robots: { index: false }` metadata to `/brief` and `/for-agencies`; exclude both from `sitemap.ts`. Don't delete the code.
3. Run a site-wide search for "Get matched", "vetted", "match" in user-facing copy and replace each with a cost-first CTA. List what you changed.

## B. Information architecture
1. Move the estimator into its own page, `/estimate`: a two-column layout (inputs | result) with a **Sources panel** under the result listing every figure used (source, basis, as-of date, link). It stacks on mobile.
2. On `/boston/nanny-cost`, replace the embedded estimator with a short summary card ("A typical full-time Boston nanny costs $X–$Y all-in →") linking to `/estimate`.
3. Make `/faq` the only full FAQ. On the cost page, keep at most 3 questions with a "More questions →" link. FAQPage JSON-LD lives on `/faq`.
4. Create **empty-state stubs** for the cluster pages in `docs/07-content-plan.md` (`/boston/nanny-cost/taxes`, `/agency-fees`, `/vs-daycare`, `/nanny-share`, `/wages`): an H1, a one-paragraph answer, "Full guide coming soon," and links back to the pillar and `/estimate`. Mark them `noindex` until real content lands.
5. Update the nav: **Costs** (pillar) · **Estimate** · **FAQ** · **About** (`/how-it-works`).

## C. Home page
1. Hero: eyebrow "BOSTON · 2026" → H1 about the emotional reality (draft: *"Finding someone to care for your child is personal. Knowing what it costs shouldn't be a mystery."*) → one line of support → primary pill **"See what it costs"** → secondary outline **"Estimate your cost."**
2. Hero image (see `design.md` Imagery):
   - Download it: `curl -fL -o /tmp/hero.png "https://www.figma.com/api/mcp/asset/4142e2cf-742a-47b1-8bd2-f85d634723bb.png"` (**this link expires 2026-11-24**). If it has expired, ask Jonathan to export the image from the Figma file in `design.md` as PNG and drop it in `public/`.
   - Convert it to `public/hero.webp` (under 200 KB, about 1600px wide) with `sharp` or `npx @squoosh/cli`. Commit only the WebP.
   - Render it with `next/image` (`priority`, alt text from `design.md`). The headline sits over the empty left side on desktop and below the image on mobile. Add a subtle cream→blush wash on the left edge so the ink headline keeps strong contrast.
3. Below the hero, a blush section, **"The part no one prepares you for"**: three short cards on the real journey (trusting a stranger with your child; not knowing what's fair to pay; becoming an employer overnight). Each card links to the relevant guide.
4. Then a sage section, **"What it actually costs"**: the headline range plus three numbers (hourly, employer taxes, agency fee range) with sources, linking to the pillar.
5. Footer note: "We don't take money from agencies." (true today). Link to `/how-it-works`.

## D. More blush (per `design.md` color roles)
Apply blush to: the home hero wash, the journey section, any parent-quote or "you're not alone" callout, and the "Email me this estimate" card on `/estimate` (UI only for now: a disabled button with "Coming soon" until step 03 is rewritten). Sage stays on data and tools.

## E. Data updates
Add these to `data/boston-cost-seed.json` (they're also in `docs/07-content-plan.md`) and use them in the estimator's tax line:
- IRS 2026: FICA threshold $3,000 per household employee; employer share 7.65%; SS wage base $184,500; FUTA applies at $1,000+ in a quarter (0.6% effective on the first $7,000).
- MA PFML 2026, fewer than 25 employees: 0.46% remitted, $0 employer share (withheld from the employee).
- Agency fees: Boston Nanny Centre 18% of first-year gross ($7,500 min) + $500 engagement; The Nanny Haven $300 consultation fee. Basis: `agency_disclosed`.
- MA UI: leave `TODO(jonathan)`. Show "TBD — collecting" in the UI.

## Acceptance
- [ ] Nothing public links to `/brief` or `/for-agencies`; both are noindex and absent from the sitemap.
- [ ] `/estimate` works with JS off (shows the default estimate and sources) and is enhanced with JS.
- [ ] Every number on the home page, pillar and estimate pages traces to the data file.
- [ ] Blush appears on the home hero, the journey section and the estimate card; never as text or button color.
- [ ] `npm run build` and tests pass. Show Jonathan: `/`, `/boston/nanny-cost`, `/estimate`, `/faq`, `/styleguide`.
