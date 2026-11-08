---
description: Run a numbered build step from prompts/ (e.g. /build-step 03)
argument-hint: <step number, e.g. 03>
---

Find the file in `prompts/` whose name starts with `$ARGUMENTS` and follow it exactly.

Before starting:
1. Re-read `CLAUDE.md` and any docs/specs the prompt references.
2. Check that the previous step's acceptance checks still pass. If they don't, say so and fix that first.

When finished, reply with:
- **Done:** what was built (bullets)
- **Test it:** exact commands or URLs and what Jonathan should see
- **Needs you:** any accounts, secrets or decisions required
- **Next:** `/build-step <next number>`
