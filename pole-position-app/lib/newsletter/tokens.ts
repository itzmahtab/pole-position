import { createHmac, timingSafeEqual } from "crypto";

// Signed unsubscribe/confirmation tokens. HMAC over the subscriber id with a
// server secret keeps tokens opaque and verifiable without a DB round-trip.

function secret(): string {
  return process.env.NEWSLETTER_TOKEN_SECRET ?? "";
}

export function signSubscriberToken(subscriberId: string): string {
  const key = secret();
  if (!key) return "";
  const payload = Buffer.from(subscriberId, "utf8").toString("base64url");
  const mac = createHmac("sha256", key)
    .update(payload)
    .digest("base64url");
  return `${payload}.${mac}`;
}

export function verifySubscriberToken(token: string): string | null {
  if (!token || !secret()) return null;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return null;
  const expected = createHmac("sha256", secret())
    .update(payload)
    .digest("base64url");
  const a = Buffer.from(mac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return Buffer.from(payload, "base64url").toString("utf8");
  } catch {
    return null;
  }
}
