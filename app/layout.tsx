import type { Metadata } from "next";
import { Figtree, Newsreader } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { config, siteUrl } from "@/lib/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// design.md: soft serif for H1/H2, clean light sans for body and UI.
// Headings: Newsreader, regular weight (design.md "Typography", 2026-11-17).
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${config.brand} · What a Boston nanny really costs`,
    template: `%s · ${config.brand}`,
  },
  description:
    "What a Boston nanny really costs: wages, employer taxes and agency fees, with every source shown.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", newsreader.variable, figtree.variable)}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
