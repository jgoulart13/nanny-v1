# design.md — {{BRAND}} v1

Read this before building or styling any UI. It overrides any shadcn preset defaults.

## Feel
**Calm, warm, trustworthy.** Think of a well-informed friend who has done this before, not a store and not a startup.
- **Borrow from Mushie and Little Dutch:** cream and sage neutrals, lots of white space, light sans-serif headlines, quiet navigation, outline buttons, nothing shouting.
- **Borrow from Lalo:** only its deep teal-green as a strong ink color, so the soft palette still has contrast.
- **Don't borrow:** promo bars, sale stickers, starbursts, neon accents, pop-ups, chat bubbles. Those are retail tactics, and we're an advisor.
- **Clarity model:** Wirecutter. The numbers are the hero. These reference brands lead with product photography; we have no product, so the **cost figure plays the role their photo plays.**

## Color tokens
Soft colors are for **surfaces only**. Text and buttons always use ink or pine (contrast checked against WCAG AA).

| Token | Hex | Use | Contrast note |
|---|---|---|---|
| `cream` | #F7F3EC | Page background | — |
| `ink` | #1F2D2A | Body text, headings | 12.9:1 on cream |
| `pine` | #3F5E52 | Primary buttons, links, key numbers | 6.5:1 on cream; white text on pine 7.2:1 |
| `muted-ink` | #5F6B66 | Secondary text, captions, sources | 5.0:1 on cream |
| `sage` | #D7E2D3 | Cards, estimator panel, selected states | Ink text only (10.7:1). **Never as a text color** (1.2:1) |
| `blush` | #E9CBC5 | Rare warm highlight (e.g., the "Keep my profile" opt-in) | Ink text only |
| `blue` | #D1DFE9 | Info and confidence labels, source notes | Ink text only |
| `sand` | #BDA58B | Borders, dividers, decorative only | Not for text (2.1:1) |
| `sand-dark` | #7A6650 | Small labels and eyebrow text, if needed | 4.9:1 on cream |

**Color roles (updated 2026-11-17, v2):** **Full-width color blocks are good.** The section below the hero is a **full-width sage band with cream cards inside**, the same layout as the original blush band with only the color swapped. Sage is the main block color for sections. **Blush is an accent only:** the hero wash, small tags, and an occasional quote. Never a full-width band. Blush is still a surface only, with ink text on top.

**shadcn variable mapping** (convert to the format shadcn's `globals.css` uses):
`--background` cream · `--foreground` ink · `--primary` pine · `--primary-foreground` #FFFFFF · `--secondary` sage · `--secondary-foreground` ink · `--muted` #EFEAE1 · `--muted-foreground` muted-ink · `--accent` blue · `--accent-foreground` ink · `--card` #FFFFFF · `--card-foreground` ink · `--border` #E3DACB (light sand) · `--input` #E3DACB · `--ring` pine · `--destructive` #B4432F
No dark mode in v1.

## Typography
- **Headings:** a soft serif for H1 and H2, warm like the Little Dutch wordmark and credible like Wirecutter. **Use *Newsreader* (Google Fonts), regular weight, never bold-heavy.** (Changed 2026-11-17: Fraunces' large hooked 'f' and ball terminals were distracting at headline sizes. Newsreader is calmer and more editorial.)
- **Body and UI:** a clean, light geometric sans like Mushie's. Suggestion: *Figtree* (Google Fonts).
- **Numbers:** sans with **tabular figures** (`font-variant-numeric: tabular-nums`) so cost columns line up. Hero figures are large (40–56px), in pine.
- Eyebrow labels (e.g., "BOSTON · 2026"): small uppercase with letter-spacing, in muted-ink. This is borrowed from Mushie.
- Body text is at least 17px on mobile; line-height 1.6.

## Shape and spacing
- Corner radius: **medium** (~0.625rem on cards, fully rounded pill buttons as on Little Dutch). Soft, but not toy-like.
- Generous spacing: sections ≥ 64px apart on desktop, ≥ 40px on mobile. Max text width ~68 characters.
- Shadows: almost none. Use soft borders in sand-light instead.
- Tap targets ≥ 44px. Design for a phone first: most parents will look at this at 10pm on a phone.

## Buttons
- **Primary:** a pine pill with white text. One per screen (e.g., "Get matched").
- **Secondary:** an outline pill with a pine border and pine text. This is the Mushie and Little Dutch ghost style, but on cream, never laid over a photo.
- Use the `--pointer` cursor on all clickable elements.

## Key components
| Component | Look |
|---|---|
| **Cost hero** | Eyebrow label → H1 → giant all-in range in pine → one-line "what's included" → "Sources ↓" link |
| **Source table** | Plain rows, sand dividers, tabular numbers, a confidence badge (blue = medium, sage = high, blush = low) |
| **Estimator** | A sage card on cream with inputs on the left and a live result on the right (stacked on mobile). Shows "TBD — collecting" in muted-ink italics when data is missing |
| **Brief form** | One step per screen, a thin progress bar in pine, large radio cards instead of dropdowns where possible |
| **Disclosure note** | A small blue box: "How we get paid →". Only on `/how-it-works` and the agency-fees guide |
| **Opt-in** | A blush card at the end of the brief: "Keep my profile for next time" |

## Imagery
- **One hero image on the home page.** Everything else stays typographic.
- **Style:** a quiet still life in the Mushie / Little Dutch mood. **No faces, no people, no stock nannies.** Soft daylight, cream/sage/blush palette, shallow depth of field, lots of empty space on one side for the headline.
- **Concept options (pick one):**
  1. *The front door:* a Boston brownstone entryway with small rain boots, a folded sage blanket and a canvas tote by the door. The handoff moment.
  2. *The kitchen table:* morning light, a coffee mug, a sippy cup and a notebook with handwritten numbers and a pencil. The "figuring it out" moment.
  3. *The nursery corner:* a cream armchair, a blush knit throw, a sage plush toy on the floor. The "who will care for them" moment.
- **Source:** AI-generated (cheapest, exact palette) or licensed (Unsplash / Stocksy). If generated: no text, no logos, no hands or faces, and check for artifacts. Export a WebP under 200 KB, give it real alt text, and use `next/image` with priority.
- **CHOSEN (2026-11-17): option 2, the kitchen table.** AI-generated in Figma: https://www.figma.com/design/Hdyt9ajaYV5vjQrXxZfrSt. The objects sit in the right third; the left two-thirds is empty space for the headline. Alt text: "A sunlit kitchen table with a coffee mug, a toddler's sippy cup and a notebook of handwritten numbers."
- On narrow phones, crop to the right side (`object-position: right`) so the cup and notebook stay visible; put the headline below the image rather than on top.
## Voice
- Plainspoken, warm, specific. Write like a parent talking to another parent.
- **Use:** "what you'll actually pay," "all-in," "we work for you," "here's where this number comes from."
- **Avoid:** "revolutionize," "seamless," "perfect match," "premier," exclamation points, urgency ("Only 3 spots left!").
- Always show the source of a number, and admit gaps ("We're still collecting this").

## Logo (placeholder)
A lowercase wordmark in the heading serif, in ink. Mushie and Little Dutch prove a simple lowercase wordmark is enough. Replace it once the brand name is chosen.
