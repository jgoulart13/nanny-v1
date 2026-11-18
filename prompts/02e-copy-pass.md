# Step 02e — Home page copy pass (shorter, warmer) + daycare card

Talia's feedback: the home page was wordy and heady. Jonathan approved a streamlined version on **artboard 11** of the canvas (https://claude.ai/artifact/SPVJkBh5CkvcASqc95Aqy4). Change **copy only**, plus one new card and one new guide stub. The layout stays as it is.

## A. Hero
- H1: **Childcare is personal. The price shouldn't be a mystery.**
- Subline: **Straight answers from Boston parents who just went through it.**
- Buttons unchanged: Read the guides · Estimate your cost.

## B. Blush band: four cards (was three)
Heading unchanged: "The part no one prepares you for." The cards wrap 4 across on desktop, 2×2 on tablet, stacked on phone.
| Title | Line | Link text → href |
|---|---|---|
| Trusting someone new | What agencies do, and what they charge. | Agency fees → `/guides/nanny-agency-fees-boston` |
| What's fair to pay? | Real Boston numbers, side by side. | Nanny pay → `/guides/boston-nanny-wages` |
| Surprise, you're an employer | Taxes and paperwork, made simple. | Nanny taxes → `/guides/massachusetts-nanny-taxes` |
| Nanny or daycare? | What each really costs, and how families decide. | Nanny vs. daycare → `/guides/nanny-vs-daycare-boston` |

Create the 4th guide stub `content/guides/nanny-vs-daycare-boston.mdx` the same way as the other three (frontmatter, "The short answer" placeholder, section headings, `TODO: draft`, noindex). Sources to list in its frontmatter: U.S. DOL National Database of Childcare Prices (county infant/toddler center prices), plus the nanny cost sources already in `data/boston-cost-seed.json`.

## C. Story section
- Section heading: **We've been there.** (keep the sage "Why we're doing this" tag above it)
- Timeline (label · title · line):
  1. First · **A night nanny** · The newborn nights.
  2. Then · **A nanny** · Found her on Facebook.
  3. Suddenly · **An emergency** · Our nanny had to step away.
  4. Next · **Daycare in a crunch** · Tours and waitlists, fast.
  5. Now · **This site** · So you don't start from zero.
- Letter card (heading unchanged: "We're Boston parents too."), three paragraphs:
  > When our son arrived, we were running on very little sleep and trying to make some of the biggest decisions of our lives. Who do we trust with him? What's fair to pay? Wait, are we someone's employer now?
  >
  > In one year we tried almost everything: a night nanny, a nanny we found on Facebook, and a daycare search in a crunch when our nanny had a family emergency. Every step came with late-night searching, a lot of second-guessing, and very few straight answers.
  >
  > This site is our way of bringing a little method to the madness. If you're in the middle of it right now: it's hard, you're doing better than you think, and you don't have to figure it out alone.
  
  Signature and "Read our story →" unchanged. Also update the `#our-story` section on `/how-it-works` to use this letter.

## D. Around Boston
- Keep "Five things worth your 10pm." Change the subline to **Quick reads, in plain English.**

## Acceptance
- [ ] `/` matches artboard 11's copy exactly; no other text on the page changed.
- [ ] The 4 cards wrap correctly at desktop, tablet and phone widths.
- [ ] `/guides` lists 4 guides; the new stub is noindex.
- [ ] `npm run build` and tests pass.
