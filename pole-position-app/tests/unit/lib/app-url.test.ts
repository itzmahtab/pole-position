import { afterEach, describe, expect, it } from "vitest";
import { appBaseUrl } from "@/lib/app-url";

describe("lib/app-url", () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
  });

  it("prefers NEXT_PUBLIC_APP_URL", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://example.com";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "ignored.vercel.app";
    expect(appBaseUrl()).toBe("https://example.com");
  });

  it("uses the Vercel production URL with https", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "pole-position.vercel.app";
    expect(appBaseUrl()).toBe("https://pole-position.vercel.app");
  });

  it("falls back to localhost", () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    expect(appBaseUrl()).toBe("http://localhost:3000");
  });
});
