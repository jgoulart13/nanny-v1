# Step 02d — Make the home page match artboard 11

Step 02c ran from an **older version** of its prompt (its branch started before the later design decisions were pushed). The home page doesn't match what Jonathan approved yet. This step closes the gap.

**Source of truth:** `design-explorations/README.md` (artboard 11 spec, digest card F, brand, approved copy) and `design.md` (color roles v3). The approved canvas: https://claude.ai/artifact/SPVJkBh5CkvcASqc95Aqy4 → "11 · Combined (your picks)".

Commit after each group. Don't change anything not listed here.

## A. Remove the agency disclosure from home + footer
- Remove `<DisclosureNote />` from `app/page.tsx`.
- Remove the "We don't take money from agencies…" line from `components/site-footer.tsx`.
- Keep it only on `/how-it-works#how-we-get-paid` (and at the end of the agency-fees guide later). See CLAUDE.md rule 5.

## B. Guide section → full-width blush band
Currently: sage cards in a contained section. Change to:
- A **full-width `bg-blush` band** (edge to edge), heading "The part no one prepares you for" on blush.
- Three **cream cards** inside (`bg-cream`), each: title, one-line body, "{guide name} →" link to its `/guides/...` page.

## C. "Why we're doing this" → timeline + letter card
- Centered header: a small **sage** pill tag "Why we're doing this", then H2 "Our first year, in five kinds of help."
- A **5-step horizontal timeline** (wraps on mobile): a thin sand-light line with dots (blush dots with a pine border; the last dot solid pine). Each step: small uppercase label in sand-dark, a serif title, one line of text:
  1. First · A night doula · Help through the newborn nights.
  2. Then · A nanny · Found through a Facebook group, after a lot of interviews.
  3. Suddenly · A family emergency · Our nanny had to step away, and we had no care.
  4. Next · The daycare scramble · Tours, waitlists and a whole new set of prices.
  5. Now · Writing it down · So the next family has it all in one place.
- Below it, a centered **white letter card** (max ~680px, 18px radius, sand-light border): H3 "We're Boston parents too." + two paragraphs (approved copy, as on artboard 11) + italic serif signature "Jonathan & Talia · Jamaica Plain" on the left and **"Read our story →"** on the right, linking to `/how-it-works#our-story`.
- Make sure `/how-it-works` has an `id="our-story"` section with the full story (including the "In our son's first year…" line).
- Replace the old `TODO(jonathan): approve story copy` with `TODO(jonathan): revisit story copy`.

## D. Around Boston → digest card (option F)
- Separate it from the story with a thin sand-light top border.
- Centered header: a small blush pill tag "Around Boston · November" → H2 **"Five things worth your 10pm"** → subline "Useful things we've found, with the takeaway in our own words."
- **One white card** (max ~820px, centered, 18px radius, sand-light border) holding a numbered list of the first 5 items from `data/reading-list.json`. Each row: a large pine serif number "01"–"05", a sage topic tag (add a `topic` field to the JSON if missing: Taxes / Paperwork / Daycare / Wages), a bold title link, then the takeaway plus " · Source" in muted ink. Thin dividers between rows.
- An italic serif "— Jonathan & Talia" at the bottom of the card.
- Centered "See everything we've found →" link below the card (point it to `/guides` for now).

## E. Brand
- Confirm the header and footer show the wordmark **"silly goose"** (lowercase, Newsreader, ink) and page titles use "Silly Goose" (from `config.brand`).

## Acceptance
- [ ] `/` matches artboard 11 top to bottom: hero → blush band with cream cards → timeline + letter card → digest card → footer.
- [ ] No "take money from agencies" or "How we get paid" anywhere on `/` or in the footer.
- [ ] "Read our story →" lands on the story section of `/how-it-works`.
- [ ] Works at phone width (timeline wraps, cards stack), and the content is readable with JS off.
- [ ] `npm run build` and tests pass.
