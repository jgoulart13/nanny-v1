# Jonathan's product taste & build playbook

Learned from building Silly Goose (Nov 2026). Apply to every website or product build; update it after each project.

## 1. Visual direction
- **Calm, warm, premium, never retail-loud.** References: Mushie, Little Dutch, Wirecutter. Rejected: Lalo-style sale stickers, starbursts, neon, pop-ups, promo bars.
- **Soft palette with one strong dark.** Cream background, sage and blush as surfaces, and a deep green-ink for text and buttons. Soft colors are never text: check contrast.
- **Full-width color bands are good.** He liked a full-bleed colored section with cream cards inside. Use color blocks to set rhythm (blush band → cream story → card section).
- **Editorial serif, but calm.** Soft serif headings and a clean sans body. Quirky display glyphs are distracting (Fraunces' hooked "f" was rejected; Newsreader accepted).
- **Imagery: still life, no faces.** Objects that tell the story (a kitchen table, a coffee mug, a sippy cup, a notebook of numbers). No stock people.
- **A logo with meaning.** A simple mark that carries the idea (a parent goose with a gosling following) next to a lowercase serif wordmark. Playful name, calm execution.
- **Airy, centered sections:** small pill tag → serif heading → short subline, with generous white space.
- **Don't waste space.** Secondary detail (source lists, methodology) goes in collapsible dropdowns, not on the main view.

## 2. Copy & tone
- **Short and human, not wordy or heady.** Real test: show it to a non-technical person (Taliya). If they say "wordy," cut by half.
- **Feelings first, facts one click away.** The home page speaks to the emotion (hard, unsure, overwhelmed); detail and sources live in guides.
- **Personal story as the trust engine:** a real founder story, signed with first names and neighborhood. The story section *can* be longer and warmer; everything else stays tight.
- **No boilerplate.** Cut "the short version in plain English," "here's how we work / who we are" intros, unneeded "how we get paid" sections, "coming soon," and visible "TBD."
- **Plain-language legal:** a few sentences each for privacy and terms, including "not tax/legal advice" and "no guarantees."
- **Accuracy is non-negotiable,** in names and spellings (Taliya) and in every number.

## 3. Product judgment
- **Lead with what users want, not what needs ops.** Hide features that create manual work before demand is proven (the "Get matched" flow was hidden until agencies commit).
- **Content-first and AI-discoverable:** answer-first guides, a main "pillar" guide, `llms.txt`, structured data, and AI crawlers explicitly allowed.
- **Sources must be current, reputable and neutral.** Prefer government, state and national-nonprofit data from the current year. Reject stale data (2022 federal database) and self-interested sources (an agency's own salary guide). Show date and basis for every number.
- **Never show a gap; fill it or hide it.** Find the real figure (Mass. DUA rate) rather than display "TBD."
- **It's OK to widen scope when it matches real behavior** (adding daycare beside nannies, because families compare both).

## 4. How he likes to work
- **Show, don't describe.** Render options visually (design canvas, built-in browser) before building.
- **Many options at once, then mix and match.** 10 directions, then picks like "note from #1, cards from #2, framing from #3, rhythm from #10." Build a combined version and confirm before coding.
- **Decides by looking; reverses freely.** Expect color and layout reversals after seeing them in place; record each decision in `design.md` so builds don't drift.
- **Design source of truth first, code second.** Feedback updates `design.md` / the canvas, then a build prompt; never patch code alone.
- **Novice programmer:** give exact commands when asked ("just the commands"); one build step per session; the repo is the handoff; keep a `STATUS.md`.
- **Wants honest pushback** ("is this too crazy?"), and owned mistakes rather than glossed ones.
