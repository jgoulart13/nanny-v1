import type { Metadata } from "next";
import { Figtree, Fraunces } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { config, siteUrl } from "@/lib/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// design.md: soft serif for H1/H2, clean light sans for body and UI.
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${config.brand} · What a Boston nanny really costs`,
    template: `%s · ${config.brand}`,
  },
  description:
    "Find a great Boston nanny through trusted agencies, and know what you should pay.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased", fraunces.variable, figtree.variable)}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
