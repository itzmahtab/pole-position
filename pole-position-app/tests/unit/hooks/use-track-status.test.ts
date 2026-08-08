import { describe, expect, it, vi } from "vitest";
import { useTrackStatus } from "@/hooks/use-track-status";
import type { RaceControlMessage } from "@/types";

vi.mock("@/hooks/use-race-weekend", () => ({
  useRaceWeekend: () => ({
    state: "live",
    session: { session_type: "Race", session_key: 42 },
  }),
}));

const msg = (over: Partial<RaceControlMessage>): RaceControlMessage => ({
  meeting_key: 1,
  session_key: 42,
  date: "2026-07-05T14:11:00Z",
  category: "Other",
  message: "INFO",
  source: "Test",
  ...over,
});

describe("hooks/use-track-status", () => {
  it("reports an active session", () => {
    const status = useTrackStatus();
    expect(status.sessionActive).toBe(true);
    expect(status.sessionType).toBe("Race");
  });

  it("detects a safety car", () => {
    const status = useTrackStatus(null, [
      msg({ category: "SafetyCar", message: "SC DEPLOYED" }),
    ]);
    expect(status.safetyCar).toBe(true);
    expect(status.virtualSafetyCar).toBe(false);
  });

  it("distinguishes a virtual safety car", () => {
    const status = useTrackStatus(null, [
      msg({ category: "SafetyCar", message: "VIRTUAL SAFETY CAR DEPLOYED" }),
    ]);
    expect(status.virtualSafetyCar).toBe(true);
    expect(status.safetyCar).toBe(true);
  });

  it("detects red and yellow flags", () => {
    const status = useTrackStatus(null, [
      msg({ flag: "RED", message: "RED FLAG" }),
      msg({ flag: "YELLOW", message: "YELLOW FLAG" }),
    ]);
    expect(status.redFlag).toBe(true);
    expect(status.yellowFlag).toBe(true);
  });

  it("detects DRS enabled", () => {
    const status = useTrackStatus(null, [
      msg({ message: "DRS ENABLED" }),
    ]);
    expect(status.drsEnabled).toBe(true);
  });

  it("reports the latest weather reading", () => {
    const status = useTrackStatus([
      { meeting_key: 1, session_key: 42, air_temperature: 21, humidity: 50, rainfall: false, track_temperature: 28, wind_direction: 90, wind_speed: 2, date: "2026-07-05T14:09:00Z" },
      { meeting_key: 1, session_key: 42, air_temperature: 22, humidity: 51, rainfall: false, track_temperature: 29, wind_direction: 90, wind_speed: 2, date: "2026-07-05T14:10:00Z" },
    ]);
    expect(status.weather?.air_temperature).toBe(22);
  });

  it("defaults to no flags with empty messages", () => {
    const status = useTrackStatus(null, []);
    expect(status.safetyCar).toBe(false);
    expect(status.redFlag).toBe(false);
    expect(status.yellowFlag).toBe(false);
    expect(status.drsEnabled).toBe(false);
    expect(status.raceControl).toEqual([]);
  });
});
