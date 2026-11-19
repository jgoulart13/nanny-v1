import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";

// Silly Goose wants to be read and cited by search engines AND AI assistants,
// so every crawler is allowed. The AI ones are also listed by name to make that
// explicit (names checked Nov 2026; they change, so re-check now and then):
//   Search/citation indexes: OAI-SearchBot (ChatGPT), Claude-SearchBot,
//     PerplexityBot. Blocking these removes a site from AI answers.
//   Fetch-on-request (a person asked about the page): ChatGPT-User,
//     Claude-User, Perplexity-User.
//   Training: GPTBot, ClaudeBot, Google-Extended (a control token, not a crawler).
// Hidden pages stay out of every index.
const disallow = ["/styleguide", "/brief", "/for-agencies"];
const aiAgents = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Bingbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiAgents, allow: "/", disallow },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
