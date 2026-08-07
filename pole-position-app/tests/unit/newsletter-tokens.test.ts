import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { signSubscriberToken, verifySubscriberToken } from "@/lib/newsletter/tokens";

const SECRET_KEY = "test-secret-for-tokens";

describe("newsletter tokens", () => {
  beforeAll(() => {
    process.env.NEWSLETTER_TOKEN_SECRET = SECRET_KEY;
  });

  afterAll(() => {
    delete process.env.NEWSLETTER_TOKEN_SECRET;
  });

  it("signs and verifies a subscriber id", () => {
    const token = signSubscriberToken("5f1e1000-0000-4000-8000-000000000000");
    expect(token).toContain(".");
    expect(verifySubscriberToken(token)).toBe("5f1e1000-0000-4000-8000-000000000000");
  });

  it("rejects a tampered token", () => {
    const token = signSubscriberToken("5f1e1000-0000-4000-8000-000000000000");
    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
    expect(verifySubscriberToken(tampered)).toBeNull();
  });

  it("rejects tokens signed with a different secret", () => {
    process.env.NEWSLETTER_TOKEN_SECRET = "other-secret";
    const token = signSubscriberToken("5f1e1000-0000-4000-8000-000000000000");
    process.env.NEWSLETTER_TOKEN_SECRET = SECRET_KEY;
    expect(verifySubscriberToken(token)).toBeNull();
  });

  it("returns null for malformed tokens", () => {
    expect(verifySubscriberToken("garbage")).toBeNull();
    expect(verifySubscriberToken("")).toBeNull();
    expect(verifySubscriberToken("a.b.c")).toBeNull();
  });

  it("returns null when no secret is configured", () => {
    delete process.env.NEWSLETTER_TOKEN_SECRET;
    const token = signSubscriberToken("5f1e1000-0000-4000-8000-000000000000");
    expect(token).toBe("");
    expect(verifySubscriberToken("anything")).toBeNull();
  });
});
