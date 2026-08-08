import { afterEach, describe, expect, it, vi } from "vitest";
import { openf1 } from "@/lib/api/openf1";

const meetingRow = {
  meeting_key: 1,
  meeting_official_name: "Test GP",
  country_code: "GB",
  country_name: "United Kingdom",
  circuit_short_name: "silverstone",
  gmt_offset: "+01:00",
  date_start: "2026-07-03T10:00:00Z",
  date_end: "2026-07-05T16:00:00Z",
};

const sessionRow = {
  session_key: 42,
  session_type: "Race",
  date_start: "2026-07-05T14:00:00Z",
  date_end: "2026-07-05T16:00:00Z",
  gmt_offset: "+01:00",
};

const driverRow = {
  driver_number: 44,
  full_name: "Lewis Hamilton",
  name_acronym: "HAM",
  country_code: "GB",
};

const intervalRow = {
  meeting_key: 1,
  session_key: 42,
  driver_number: 44,
  date: "2026-07-05T14:10:00Z",
};

const positionRow = {
  meeting_key: 1,
  session_key: 42,
  driver_number: 44,
  position: 1,
  date: "2026-07-05T14:10:00Z",
};

const raceControlRow = {
  meeting_key: 1,
  session_key: 42,
  date: "2026-07-05T14:11:00Z",
  category: "Flag",
  message: "GREEN FLAG",
  source: "Test",
};

const weatherRow = {
  meeting_key: 1,
  session_key: 42,
  air_temperature: 24,
  humidity: 55,
  rainfall: false,
  track_temperature: 30,
  wind_direction: 200,
  wind_speed: 3.5,
  date: "2026-07-05T14:10:00Z",
};

const stintRow = {
  meeting_key: 1,
  session_key: 42,
  driver_number: 44,
  stint_number: 1,
  compound: "SOFT",
  start_lap: 1,
};

describe("lib/api/openf1", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("meetings falls back to the previous year when the current year is empty", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T00:00:00Z"));
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => [meetingRow] });
    vi.stubGlobal("fetch", fetchMock);

    const meetings = await openf1.meetings();
    expect(meetings).toHaveLength(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.openf1.org/v1/meetings?year=2026"
    );
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://api.openf1.org/v1/meetings?year=2025"
    );
  });

  it("returns current-year meetings directly when present", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T00:00:00Z"));
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [meetingRow] });
    vi.stubGlobal("fetch", fetchMock);

    const meetings = await openf1.meetings();
    expect(meetings).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("sessions builds the session endpoint and parses rows", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => [sessionRow] })
    );
    const sessions = await openf1.sessions(1);
    expect(sessions[0].session_key).toBe(42);
  });

  it("wraps single-object responses into arrays", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => driverRow })
    );
    const drivers = await openf1.drivers(42);
    expect(drivers).toHaveLength(1);
    expect(drivers[0].driver_number).toBe(44);
  });

  it("throws on non-ok responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 404 }));
    await expect(openf1.intervals(42)).rejects.toThrow("OpenF1 404");
  });

  it("throws on schema violations", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => [{ driver_number: "not-a-number" }] })
    );
    await expect(openf1.position(42)).rejects.toThrow();
  });

  it("fetches remaining live endpoints with correct URLs", async () => {
    const fetchMock = vi.fn().mockImplementation((url: string) =>
      Promise.resolve({
        ok: true,
        json: async () => {
          if (url.includes("race_control")) return [raceControlRow];
          if (url.includes("weather")) return [weatherRow];
          return [stintRow];
        },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await openf1.raceControl(42);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.openf1.org/v1/race_control?session_key=42"
    );
    await openf1.weather(42);
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://api.openf1.org/v1/weather?session_key=42"
    );
    await openf1.stints(42);
    expect(fetchMock.mock.calls[2][0]).toBe(
      "https://api.openf1.org/v1/stints?session_key=42"
    );
  });
});
