// The site FAQ (/faq). Mirrors the four guides in content/guides/: every
// answer is a short version of a guide, links to it, and uses only numbers
// that appear (with sources) in that guide. Update both together.
import type { FaqItem } from "@/lib/costFacts";

export const siteFaq: FaqItem[] = [
  {
    q: "How much does a nanny cost per hour in Boston?",
    a: "Job-site averages put Boston nannies at about $21–25 an hour, but those are asking rates. Experienced nannies placed through Boston agencies typically earn $30–35 an hour or more.",
    guide: { href: "/guides/boston-nanny-wages", label: "What Boston nannies earn" },
  },
  {
    q: "How much does a full-time nanny cost per year?",
    a: "Roughly $55,000–70,000+ in wages for a career nanny, plus about 8–9% in employer taxes and workers' comp insurance, plus an agency fee if you use one.",
    guide: { href: "/guides/boston-nanny-wages", label: "What Boston nannies earn" },
  },
  {
    q: "Do I have to pay taxes on a nanny in Massachusetts?",
    a: "Almost certainly. If you pay a nanny $3,000 or more in 2026, you're a household employer. Expect to pay roughly 8–9% on top of wages. A nanny payroll service can handle almost all of it.",
    guide: { href: "/guides/massachusetts-nanny-taxes", label: "Nanny taxes in Massachusetts" },
  },
  {
    q: "What do I owe to Massachusetts specifically?",
    a: "Unemployment insurance (2.42% of the first $15,000 for new employers, once you pay $1,000 in a quarter), paid family and medical leave (0.46%, withheld from your nanny's pay), and workers' comp insurance if your nanny works 16+ hours a week.",
    guide: { href: "/guides/massachusetts-nanny-taxes", label: "Nanny taxes in Massachusetts" },
  },
  {
    q: "Do I need a written agreement with my nanny?",
    a: "Yes, if they work 16 or more hours a week. Massachusetts also requires a timesheet every two weeks and a Notice of Rights. The Attorney General offers a free model agreement.",
    guide: { href: "/guides/massachusetts-nanny-taxes", label: "Nanny taxes in Massachusetts" },
  },
  {
    q: "Do I have to pay my nanny overtime?",
    a: "Yes: 1.5× pay for hours over 40 in a week, including for live-in nannies. Minimum wage in Massachusetts is $15 an hour.",
    guide: { href: "/guides/massachusetts-nanny-taxes", label: "Nanny taxes in Massachusetts" },
  },
  {
    q: "How much do Boston nanny agencies charge?",
    a: "Either a percentage of the nanny's first-year pay (one large Boston agency publishes 18%, with a $7,500 minimum) or a smaller flat fee (another lists $300). Ask for the fee in writing, along with what the guarantee covers.",
    guide: { href: "/guides/nanny-agency-fees-boston", label: "What nanny agencies charge" },
  },
  {
    q: "What does an agency fee actually cover?",
    a: "Screening candidates, matching, and a guarantee to find a replacement if it doesn't work out. It doesn't cover your nanny's wages or your employer taxes; you pay those either way.",
    guide: { href: "/guides/nanny-agency-fees-boston", label: "What nanny agencies charge" },
  },
  {
    q: "Is a nanny cheaper than daycare?",
    a: "For one child, usually not. Infant center care in Massachusetts averaged about $27,000 a year in 2025, and Boston runs higher. A full-time nanny is often $55,000–70,000+. With two kids or a nanny share, the gap shrinks fast.",
    guide: { href: "/guides/nanny-vs-daycare-boston", label: "Nanny or daycare?" },
  },
  {
    q: "What's a nanny share?",
    a: "Two families hire one nanny together and split the cost. Each family pays less per hour, and the nanny usually earns more in total.",
    guide: { href: "/guides/nanny-vs-daycare-boston", label: "Nanny or daycare?" },
  },
  {
    q: "Can I pay for childcare with pre-tax money?",
    a: "If your employer offers a dependent care FSA, you can set aside up to $7,500 pre-tax in 2026 for a nanny or daycare. There's also a federal child and dependent care credit, but the same dollars can't count twice.",
    guide: { href: "/guides/massachusetts-nanny-taxes", label: "Nanny taxes in Massachusetts" },
  },
  {
    q: "Where do your numbers come from?",
    a: "Public sources: the IRS, Massachusetts state agencies, the U.S. Bureau of Labor Statistics, Child Care Aware of America, care marketplaces like Care.com and Nanny Lane, and agencies' own published fees. Every guide lists its sources with dates.",
    guide: { href: "/guides", label: "All guides" },
  },
];
