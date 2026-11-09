# CLAUDE.md — {{BRAND}} v1

## What this is
A demand-test website for Boston families looking for a nanny. It's a buyer-side, price-transparent front door that routes families to trusted partner agencies. **It's an experiment, not a platform.** Read `docs/01-one-pager.md` and `docs/04-prd-v1.md` before writing code.

## Who you're working with
Jonathan is a novice programmer. So:
- Explain what you're about to do in 1–2 sentences before large changes.
- Prefer boring, well-documented tools. No clever abstractions.
- After each step, tell him exactly how to see the result (URL, command) and what to check.
- When a step needs an account or secret (Vercel, Resend, database), stop and give click-by-click setup instructions.

## Stack (don't change without asking)
- Next.js (App Router) + TypeScript + Tailwind CSS
- UI components: shadcn/ui, themed from `design.md` (read it before any UI work). Install only the components a step needs. Content must stay server-rendered: interactive components may enhance the page but never hide facts (FAQ answers and cost figures live in the HTML).
- Hosted on Vercel
- Database: Postgres through the Vercel Marketplace (Neon), with Drizzle ORM
- Email: Resend
- Validation: zod schemas generated from or mirroring `specs/*.schema.json`
- MCP: Vercel's MCP handler for Next.js (check the current package name and docs before installing)
- Analytics: Vercel Analytics + our own events table

## Hard rules
1. **Scope.** Only build what's in `docs/04-prd-v1.md`. If something seems useful but isn't there, write it in `BACKLOG.md` and move on. Specifically out of scope: accounts/login, nanny profiles, payments, automated routing or bidding, other cities.
2. **Privacy.** Never add fields for child names, birthdates or photos. Age bands only. No sensitive data in logs or analytics events.
3. **Server-render all content.** Pages must be fully readable with JavaScript off. This matters for AI crawlers.
4. **Every cost number shows its source.** No invented figures. If data is missing, show "TBD — collecting" rather than a guess.
5. **Disclosure.** Any place that mentions agencies links to `/how-it-works#how-we-get-paid`.
6. **Placeholders.** Use `{{BRAND}}`, `{{DOMAIN}}` and `{{OPERATOR_EMAIL}}` from `lib/config.ts` only. Ask Jonathan for the real values before the first production deploy.
7. **Secrets** live only in `.env.local` and Vercel environment variables. Keep `.env.example` up to date.

## Working style
- One prompt in `prompts/` = one session. Finish with: what changed, how to test, what's next.
- Commit after each working step with a clear message.
- Write small tests for `lib/estimator.ts` and the brief validation.
- If a step can't finish, leave a `TODO(jonathan):` note and say so in your summary.

## Key files
- `docs/` — product context (read-only unless asked)
- `specs/` — data contracts (source of truth for forms, API, MCP)
- `data/boston-cost-seed.json` — cost data with sources
- `prompts/` — the build sequence
