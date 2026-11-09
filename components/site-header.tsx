import Link from "next/link";
import { config } from "@/lib/config";
import { headerNav } from "@/lib/routes";

// Plain links (no client JS) so the header works with JavaScript off.
export function SiteHeader() {
  return (
    <header className="border-b border-sand-light">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-4">
        {/* Placeholder wordmark: lowercase, heading serif, ink (design.md) */}
        <Link
          href="/"
          className="font-heading text-2xl lowercase text-ink"
          aria-label={`${config.brand} home`}
        >
          {config.brand}
        </Link>
        <nav aria-label="Main">
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[15px]">
            {headerNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-ink hover:text-pine"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
