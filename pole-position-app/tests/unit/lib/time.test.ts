import { afterEach, describe, expect, it, vi } from "vitest";
import {
  formatLocal,
  formatTime,
  formatDate,
  formatRelative,
  getSessionStatusLabel,
  getSessionTypeLabel,
  getCountdownParts,
  padZero,
  detectTimezone,
} from "@/lib/time";

describe("lib/time", () => {
  describe("formatLocal / formatTime / formatDate", () => {
    it("formats a UTC date in a target timezone", () => {
      const iso = "2026-03-15T12:00:00Z";
      const out = formatTime(iso, "Europe/London");
      expect(out).toMatch(/^\d{2}:\d{2}$/);
    });

    it("honours custom format strings", () => {
      const iso = "2026-03-15T12:00:00Z";
      expect(formatLocal(iso, "UTC", "DD MMM YYYY")).toContain("2026");
      expect(formatLocal(iso, "UTC", "HH:mm:ss")).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(formatLocal(iso, "UTC", "DD MMM")).toMatch(/^\d{2} \w+$/);
      expect(formatLocal(iso, "UTC", "dddd, DD MMM")).toContain("Sunday");
    });

    it("falls back to HH:mm for unknown formats", () => {
      const iso = "2026-03-15T12:00:00Z";
      expect(formatLocal(iso, "UTC", "not-a-format")).toMatch(/^\d{2}:\d{2}$/);
    });

    it("formats full dates", () => {
      const iso = "2026-03-15T12:00:00Z";
      expect(formatDate(iso, "UTC")).toMatch(/2026/);
    });
  });

  describe("formatRelative", () => {
    it("labels future dates with 'in'", () => {
      const future = new Date(Date.now() + 3600_000).toISOString();
      expect(formatRelative(future)).toMatch(/^in /);
    });

    it("labels past dates with 'ago'", () => {
      const past = new Date(Date.now() - 3600_000).toISOString();
      expect(formatRelative(past)).toMatch(/ago$/);
    });
  });

  describe("getSessionStatusLabel", () => {
    it("maps all four states", () => {
      expect(getSessionStatusLabel("upcoming")).toBe("UPCOMING");
      expect(getSessionStatusLabel("live")).toBe("LIVE");
      expect(getSessionStatusLabel("between")).toBe("BETWEEN SESSIONS");
      expect(getSessionStatusLabel("finished")).toBe("FINISHED");
    });
  });

  describe("getSessionTypeLabel", () => {
    it("maps session types to short labels", () => {
      expect(getSessionTypeLabel("Practice 1")).toBe("FP1");
      expect(getSessionTypeLabel("Practice 2")).toBe("FP2");
      expect(getSessionTypeLabel("Practice 3")).toBe("FP3");
      expect(getSessionTypeLabel("Qualifying")).toBe("Q");
      expect(getSessionTypeLabel("Sprint Qualifying")).toBe("SQ");
      expect(getSessionTypeLabel("Sprint")).toBe("S");
      expect(getSessionTypeLabel("Race")).toBe("R");
    });
  });

  describe("getCountdownParts", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it("decomposes a future timestamp", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const parts = getCountdownParts("2026-01-02T01:01:01Z");
      expect(parts.days).toBe(1);
      expect(parts.hours).toBe(1);
      expect(parts.minutes).toBe(1);
      expect(parts.seconds).toBe(1);
      expect(parts.total).toBe(90061);
    });

    it("clamps at zero for past timestamps", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-02T00:00:00Z"));
      const parts = getCountdownParts("2026-01-01T23:59:55Z");
      expect(parts.total).toBe(0);
      expect(parts.seconds).toBe(0);
    });
  });

  describe("padZero", () => {
    it("pads single digits", () => {
      expect(padZero(0)).toBe("00");
      expect(padZero(5)).toBe("05");
      expect(padZero(59)).toBe("59");
    });
  });

  describe("detectTimezone", () => {
    it("returns a resolved timezone or UTC fallback", () => {
      expect(typeof detectTimezone()).toBe("string");
    });
  });
});
