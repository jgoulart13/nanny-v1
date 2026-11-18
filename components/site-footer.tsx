import Link from "next/link";
import { config } from "@/lib/config";
import { disclosureHref } from "@/lib/routes";

const footerLinks = [
  { href: "/faq", label: "FAQ" },
  { href: "/how-it-works", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-sand-light">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-[15px] text-muted-ink sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            <span className="font-heading lowercase text-ink">{config.brand}</span>{" "}
            · What a Boston nanny really costs. We work for families.
          </p>
          <p>
            We don&apos;t take money from agencies.{" "}
            <Link href={disclosureHref} className="text-link">
              How we&apos;re funded
            </Link>
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {footerLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center hover:text-pine"
                >
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
