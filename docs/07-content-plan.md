# Content Plan — "What does a nanny cost in Boston?"

**Decided 2026-11-15:** v1 leads with cost content, not matching. The guides are the asset that AI assistants find and cite. The estimator is a product built on top of them. "Get matched" stays hidden until the agency gate (G0) passes.

## Site structure
```
/                                  Home: the emotional journey + "See what it costs"
/boston/nanny-cost                 PILLAR GUIDE (keep this URL; it's the AEO target)
  /boston/nanny-cost/wages         What Boston nannies earn (FT, PT, newborn, share)
  /boston/nanny-cost/taxes         Being a household employer in MA (federal + state)
  /boston/nanny-cost/agency-fees   What agencies charge and what you get for it
  /boston/nanny-cost/nanny-share   How a share changes the math
  /boston/nanny-cost/vs-daycare    Nanny vs. daycare in Suffolk / Middlesex / Norfolk
/estimate                          Estimator (product): inputs, all-in result, sources panel
/faq                               Standalone FAQ page (FAQPage schema)
/how-it-works                      Who we are, how we're funded (no agency money today)
/brief, /for-agencies              HIDDEN: noindex, not linked anywhere, code kept
```
Every cluster page links up to the pillar and across to `/estimate`. The pillar links down to every cluster page.

## Pillar guide outline: "How much does a nanny cost in Boston? (2026)"
1. **The answer first** (≤100 words): hourly range, all-in annual range, and what "all-in" includes.
2. **Why it's hard to know.** Public numbers are asking rates from listings, not what families actually pay. Short emotional framing: this is the biggest check most new parents will ever write for something they can't easily judge.
3. **Wages:** a table by arrangement (FT, PT, newborn, share) with sources → link to `/wages`.
4. **Employer taxes and obligations:** FICA, FUTA, MA unemployment, PFML, written agreement → link to `/taxes`.
5. **If you use an agency:** fee models (percentage of salary vs. flat fee), guarantees → link to `/agency-fees`.
6. **Ways families lower the cost:** nanny share, part-time, daycare mix → links.
7. **Nanny vs. daycare,** using county data → link.
8. **Sources and method,** plus "last updated." Admit the gaps (e.g., "agency fees vary widely; we're collecting more").
9. **CTA:** "Estimate your all-in cost →" `/estimate`.

## Sources
**Rule:** prefer primary and government sources. Label every figure with its basis (listing / survey / modeled / agency-disclosed / government). Never present an asking rate as a paid rate.

### Tier 1: government and primary (cite these first)
| Source | Use | Notes |
|---|---|---|
| IRS Publication 926 (2026), Household Employer's Tax Guide: irs.gov/pub/irs-pdf/p926.pdf | FICA threshold & rates; FUTA | 2026: FICA applies once one household employee is paid **$3,000+** cash wages; 7.65% employer + 7.65% employee; SS wage base $184,500. FUTA: $1,000+ in any quarter. Verify on the IRS page before publishing. |
| Mass. DFML: PFML contribution rates (mass.gov) | MA paid leave | Employers with <25 covered individuals remit **0.46%** of eligible wages with **no employer share** (the employee portion is withheld). Split changes 1/1/2027. |
| Mass. DUA: unemployment insurance for domestic employers (mass.gov) | MA UI | TODO: confirm the 2026 new-employer rate and wage base before publishing. |
| Mass. AG: Domestic Workers Bill of Rights, notice and **model employment agreement** (mass.gov) | Obligations, not costs | Written agreement required at 16+ hrs/week; notice of rights; days of rest. A trust-building section, and the "emotional" content hook. |
| U.S. DOL Women's Bureau: **National Database of Childcare Prices** (dol.gov) | Daycare comparison by county | Pull Suffolk, Middlesex, Norfolk infant center prices directly from DOL. State the data year, and that prices have risen since. |
| BLS OEWS: Childcare Workers (SOC 39-9011), Boston-Cambridge-Newton MSA | A floor wage anchor | A median for all childcare workers (centers included), so it understates private nanny pay. Label it that way. |

### Tier 2: industry surveys and platform data (label as listing or provider-reported)
| Source | Use | Notes |
|---|---|---|
| Care.com Cost of Care survey + Boston cost pages | Hourly rates by type (newborn, PT) | Provider-reported starting rates; already in `data/boston-cost-seed.json` |
| Nanny Lane Boston / MA cost pages | Listing rates, city comparisons | Asking rates; the pages disagree with each other, so show a range |
| **Washburn Agency 2026 Salary & Benefits Guide** | Boston agency-placed pay + benefits | Free download. The closest public source to *paid* agency rates. Get it and cite it. |
| International Nanny Association (INA) Salary & Benefits Survey | Benefits norms (PTO, raises, guaranteed hours) | Latest is the 2022 survey (published 2023), and it's national. Use for benefit norms, not Boston pay. |
| GTM Payroll / Care.com HomePay / Poppins Payroll MA guides | Cross-checking tax math | Commercial; cross-check only, cite the government source instead |

### Tier 3: agency-disclosed fees (named, dated, linked)
| Source | Figure |
|---|---|
| Boston Nanny Centre (Harvard HR partner flyer) | $500 engagement fee + 18% of first-year gross comp ($7,500 min) |
| The Nanny Haven (site) | $300 consultation fee; FT full-year guarantee |
| Washburn fees page | TODO: fetch |
| Discovery calls | Only with permission to publish; otherwise "an agency we spoke with" |

### Tier 4: our own data (the moat, later)
Estimator inputs (anonymized, aggregated) and family-reported rates, published once the sample size allows. This is the "Zillow gap" from the one-pager.

## Cluster content backlog (in order)
1. Pillar guide (above)
2. `/taxes`: the clearest reason families need help, and evergreen
3. `/agency-fees`: unique content; no one compares fee models side by side
4. `/vs-daycare`
5. `/nanny-share`
6. `/wages`

## Writing rules
- Voice per `design.md`: parent to parent, plain, warm, specific.
- Answer first in each section. Tables over paragraphs for numbers.
- Every number links to its source with an "as of" date. Paraphrase sources; don't copy them.
- "Last updated" visible on every page; review monthly.
- Not legal or tax advice: one plain sentence at the end of the tax pages, plus a link to IRS Pub 926 and the MA AG.
