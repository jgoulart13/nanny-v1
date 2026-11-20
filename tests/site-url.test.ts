import { describe, expect, it } from "vitest";
import { config, resolveSiteUrl } from "@/lib/config";

describe("resolveSiteUrl", () => {
  it("the real domain is www.sillygooseboston.com", () => {
    expect(config.domain).toBe("www.sillygooseboston.com");
  });

  it("production always uses the real domain, even if NEXT_PUBLIC_SITE_URL is set", () => {
    expect(
      resolveSiteUrl({
        VERCEL_ENV: "production",
        VERCEL_URL: "nanny-v1-abc123.vercel.app",
        NEXT_PUBLIC_SITE_URL: "https://nanny-v1.vercel.app",
      }),
    ).toBe("https://www.sillygooseboston.com");
  });

  it("a Vercel preview links to itself", () => {
    expect(resolveSiteUrl({ VERCEL_ENV: "preview", VERCEL_URL: "nanny-v1-git-x.vercel.app" })).toBe(
      "https://nanny-v1-git-x.vercel.app",
    );
  });

  it("local development uses NEXT_PUBLIC_SITE_URL, without a trailing slash", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000/" })).toBe("http://localhost:3000");
  });

  it("falls back to the real domain when nothing is set", () => {
    expect(resolveSiteUrl({})).toBe("https://www.sillygooseboston.com");
  });
});
