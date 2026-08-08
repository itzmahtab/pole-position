import { describe, expect, it } from "vitest";
import {
  REMINDER_WINDOWS,
  DEFAULT_REMINDER_WINDOWS,
  isReminderWindow,
  windowHours,
} from "@/lib/newsletter/windows";

describe("lib/newsletter/windows", () => {
  it("defines the four reminder windows", () => {
    expect(REMINDER_WINDOWS.map((w) => w.id)).toEqual(["15m", "1h", "12h", "24h"]);
    for (const w of REMINDER_WINDOWS) {
      expect(w.hours).toBeGreaterThan(0);
      expect(w.label).toBeTruthy();
    }
  });

  it("has sane defaults", () => {
    expect(DEFAULT_REMINDER_WINDOWS).toEqual(["24h", "1h"]);
  });

  it("validates window ids", () => {
    expect(isReminderWindow("1h")).toBe(true);
    expect(isReminderWindow("24h")).toBe(true);
    expect(isReminderWindow("3d")).toBe(false);
    expect(isReminderWindow("")).toBe(false);
  });

  it("maps windows to hours and falls back to zero", () => {
    expect(windowHours("15m")).toBe(0.25);
    expect(windowHours("1h")).toBe(1);
    expect(windowHours("24h")).toBe(24);
    expect(windowHours("12h")).toBe(12);
  });
});
