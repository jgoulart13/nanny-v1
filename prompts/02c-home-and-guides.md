# Step 02c — Home page cleanup + Guides section

Context: Jonathan reviewed the site after 02b. Read the updated **Typography** and **Color roles** in `design.md` and the "Update 2026-11-17" lines in `docs/04-prd-v1.md` and `docs/07-content-plan.md`.

Commit after each group.

## A. Font fix (the distracting "f")
1. Replace Fraunces with **Newsreader** (Google Fonts, via `next/font/google`) everywhere: layout, CSS variables, `/styleguide`. Regular weight for headings.
2. Check the H1 on `/`, `/faq` and `/styleguide`. Headlines should look calm and editorial, with no oversized hooked "f".

## B. Home page
Keep the hero exactly as it is (Jonathan likes it). Below the hero, the page becomes:
1. **Guide cards (sage, not blush).** Restyle the three journey cards in `secondary`/sage. Each card is a link to a guide:
   - "What agencies charge" → `/guides/nanny-agency-fees-boston`
   - "What Boston nannies earn" → `/guides/boston-nanny-wages`
   - "Nanny taxes in Massachusetts" → `/guides/massachusetts-nanny-taxes`
   Each card: a short title, a one-line teaser, and "Read the guide →".
2. **Remove** the "What it actually costs" section (numbers and calculator) from the home page entirely.
3. **"Why we're doing this"**: a short story section on cream with one small blush accent (a quote mark or tag, not a full blush background). Use the draft copy below, marked `TODO(jonathan): approve story copy`.
4. **"Around Boston"**: a curated list of 4–6 useful childcare links, rendered from `data/reading-list.json` (create it). Each item has: title, source name, URL, date, and a one-line takeaway **in our own words** (never copied text). Seed it with the items below. A small "We read these so you don't have to" intro. Server-rendered.
5. Hero buttons: primary **"Read the guides"** → `/guides`; secondary **"Estimate your cost"** → `/estimate`.

## C. Guides section
1. Add `/guides` (index) and `/guides/[slug]`, with guides written as **MDX files** in `content/guides/` (use Next's official MDX support; check the Next 16 docs in `node_modules/next/dist/docs/` first). Frontmatter: `title`, `description`, `updated`, `readingTime`, `sources[]` (name, url, as-of).
2. Guide page layout: eyebrow ("GUIDE · Updated Nov 2026") → H1 → a short "The short answer" box in sage → body (max ~68 characters per line) → a **Sources** list at the bottom, generated from frontmatter → a "Not tax or legal advice" line on the taxes guide → a link to `/estimate`.
3. Create the three guide files with frontmatter, a "The short answer" placeholder and section headings only, marked `TODO: draft`. **Don't write the guide content yourself.** It's drafted separately from the sourced research in `docs/07-content-plan.md`. Mark them `noindex` until drafted.
4. Add Article JSON-LD to guide pages, and add guides to the sitemap only once they're drafted.

## D. Navigation
Nav (upper right): **Guides** · **Estimate** · **FAQ** · **About**.
- Remove the Costs link. Set `/boston/nanny-cost` to `noindex`, out of nav and sitemap (on hold; don't delete).
- `/estimate`: leave it as-is (it gets redesigned later).

## Draft copy: "Why we're doing this"
> **We're Boston parents too.**
> In our son's first year we did almost all of it: a night doula, a nanny, then a scramble for daycare when our nanny had a family emergency. We searched Facebook groups, asked every parent we knew, and talked to agencies, and we still had no idea what was fair to pay or what we'd signed up for as employers.
> We started writing down what we learned so the next family doesn't have to piece it together at 10pm. Everything here is sourced, dated, and written for parents, not for agencies.
> *Jonathan & Talia, Jamaica Plain*

## Seed for `data/reading-list.json`
| Title | Source | URL | Takeaway (our words) |
|---|---|---|---|
| Household Employer's Tax Guide (Pub. 926), 2026 | IRS | https://www.irs.gov/pub/irs-pdf/p926.pdf | If you pay one household employee $3,000+ in 2026, you owe Social Security and Medicare on all of it. |
| Notice of Rights & model employment agreement | Mass. Attorney General | https://www.mass.gov/doc/sample-work-evaluation/download | MA requires a written agreement once a nanny works 16+ hours a week. The AG offers a free template. |
| PFML contribution rates and calculator | Mass. DFML | https://www.mass.gov/info-details/calculate-employer-paid-family-and-medical-leave-contributions | Households with one employee remit 0.46% of wages for paid leave, with no employer share. |
| National Database of Childcare Prices | U.S. DOL Women's Bureau | https://www.dol.gov/agencies/wb/topics/featured-childcare | County-level daycare prices. Suffolk County is among the least affordable in the US. |
| 2026 Salary & Benefits Guide | The Washburn Agency | https://washburnagency.com/2026salaryguide | A Boston agency's view of what household staff are paid, including benefits. |
Verify each URL loads before publishing; replace any that don't.

## Acceptance
- [ ] No Fraunces anywhere; headings render in Newsreader.
- [ ] Home page: hero unchanged → sage guide cards → story → Around Boston. No cost numbers or calculator, and no full-width blush sections.
- [ ] `/guides` lists the 3 guides; each guide page renders the layout with sources and is `noindex` until drafted.
- [ ] Nav shows Guides · Estimate · FAQ · About. `/boston/nanny-cost` is noindex and unlinked.
- [ ] `npm run build` and tests pass. Show Jonathan `/`, `/guides`, one guide page, `/styleguide`.
