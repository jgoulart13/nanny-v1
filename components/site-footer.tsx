import Link from "next/link";
import { config } from "@/lib/config";

// No disclosure note here (CLAUDE.md rule 5, updated 2026-11-17).
const footerLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/estimate", label: "Estimate" },
  { href: "/faq", label: "FAQ" },
  { href: "/how-it-works", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-sand-light">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-[15px] text-muted-ink sm:flex-row sm:items-center sm:justify-between">
        <span className="font-heading text-xl lowercase text-ink">{config.brand}</span>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center hover:text-pine">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
