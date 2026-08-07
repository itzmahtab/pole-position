import { describe, it, expect } from "vitest";
import {
  computeDueReminders,
  type SessionWithMeeting,
} from "@/lib/newsletter/reminders";

const HOUR = 3600 * 1000;

function makeSession(overrides: Partial<SessionWithMeeting["session"]> = {}): SessionWithMeeting {
  return {
    session: {
      session_key: 1001,
      session_type: "Race",
      date_start: "",
      date_end: "",
      gmt_offset: "+00:00",
      session_name: "Bahrain Grand Prix",
      meeting_key: 901,
      meeting_name: "Bahrain Grand Prix",
      circuit_short_name: "Bahrain",
      ...overrides,
    },
    meeting: null,
  };
}

describe("computeDueReminders", () => {
  const now = Date.UTC(2026, 2, 7, 12, 0, 0);

  it("returns a reminder when the window target falls inside the last cron tick", () => {
    // Session starts in exactly 1 hour → 1h reminder target == now.
    const sessions = [
      makeSession({ session_key: 1, date_start: new Date(now + HOUR).toISOString() }),
    ];
    const due = computeDueReminders(sessions, now);
    expect(due).toHaveLength(1);
    expect(due[0]).toMatchObject({
      sessionKey: 1,
      window: "1h",
      sessionName: "Bahrain Grand Prix",
      circuitName: "Bahrain",
    });
  });

  it("matches each subscriber window only once per session+window", () => {
    // Session starts in 24h → 24h reminder fires, others do not.
    const sessions = [
      makeSession({ session_key: 2, date_start: new Date(now + 24 * HOUR).toISOString() }),
    ];
    const due = computeDueReminders(sessions, now);
    expect(due).toHaveLength(1);
    expect(due[0].window).toBe("24h");
  });

  it("skips windows whose target has not arrived yet", () => {
    // Session starts in 2h: 1h target is 1h in the future → nothing due.
    const sessions = [
      makeSession({ session_key: 3, date_start: new Date(now + 2 * HOUR).toISOString() }),
    ];
    const due = computeDueReminders(sessions, now);
    expect(due).toHaveLength(0);
  });

  it("skips sessions that already started", () => {
    const sessions = [
      makeSession({ session_key: 4, date_start: new Date(now - HOUR).toISOString() }),
    ];
    const due = computeDueReminders(sessions, now);
    expect(due).toHaveLength(0);
  });

  it("does not re-fire a window older than one cron tick", () => {
    // 1h target was 10 minutes ago (> 5 min tick) → skip.
    const sessions = [
      makeSession({ session_key: 5, date_start: new Date(now + HOUR - 10 * 60 * 1000).toISOString() }),
    ];
    const due = computeDueReminders(sessions, now);
    expect(due).toHaveLength(0);
  });

  it("can fire multiple windows for the same session", () => {
    // Session starts in exactly 15m → only 15m fires.
    const sessions = [
      makeSession({ session_key: 6, date_start: new Date(now + 0.25 * HOUR).toISOString() }),
    ];
    const due = computeDueReminders(sessions, now);
    expect(due).toHaveLength(1);
    expect(due[0].window).toBe("15m");
  });
});
