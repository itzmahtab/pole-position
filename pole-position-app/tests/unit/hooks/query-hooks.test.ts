import { afterEach, describe, expect, it, vi } from "vitest";
import { jsonResponse, renderQueryHook, waitFor } from "@/tests/helpers";
import { useRaceWeekend } from "@/hooks/use-race-weekend";
import { useLiveSession } from "@/hooks/use-live-session";
import { useSchedule } from "@/hooks/use-schedule";
import { useLiveStandings } from "@/hooks/use-live-standings";
import { useLiveWeather } from "@/hooks/use-live-weather";
import { useRaceControlFeed } from "@/hooks/use-race-control";
import { useStints } from "@/hooks/use-stints";
import { useHistoricalSeason } from "@/hooks/use-historical";
import { useRaceResults, useQualifyingResults, useSprintResults } from "@/hooks/use-results";
import { useWeather } from "@/hooks/use-weather";
import type { LiveStatus } from "@/types";

const liveStatus: LiveStatus = {
  state: "live",
  meeting: {
    meeting_key: 1,
    meeting_official_name: "British Grand Prix",
    country_code: "GB",
    country_name: "United Kingdom",
    circuit_short_name: "silverstone",
    gmt_offset: "+01:00",
    date_start: "2026-07-03T10:00:00Z",
    date_end: "2026-07-05T16:00:00Z",
    sessions: [],
  },
  session: {
    session_key: 42,
    session_type: "Race",
    date_start: "2026-07-05T14:00:00Z",
    date_end: "2026-07-05T16:00:00Z",
  },
  nextSession: {
    session_key: 43,
    session_type: "Qualifying",
    date_start: "2026-07-04T14:00:00Z",
  },
};

const raceRow = {
  season: "2026",
  round: "1",
  raceName: "British Grand Prix",
  date: "2026-07-05",
  Circuit: {
    circuitId: "silverstone",
    circuitName: "Silverstone Circuit",
    Location: { locality: "Silverstone", country: "United Kingdom", lat: "52.07", long: "-1.01" },
  },
};

const driverStanding = {
  position: 1,
  points: "25",
  wins: "1",
  Driver: {
    driverId: "verstappen",
    givenName: "Max",
    familyName: "Verstappen",
    nationality: "Dutch",
  },
  Constructors: [{ constructorId: "red_bull", name: "Red Bull", nationality: "Austrian" }],
};

const constructorStanding = {
  position: 1,
  points: "25",
  wins: "1",
  Constructor: { constructorId: "red_bull", name: "Red Bull", nationality: "Austrian" },
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

const raceControlRow = {
  meeting_key: 1,
  session_key: 42,
  date: "2026-07-05T14:11:00Z",
  category: "Flag",
  message: "GREEN FLAG",
  source: "Test",
};

const stintRow = {
  meeting_key: 1,
  session_key: 42,
  driver_number: 44,
  stint_number: 1,
  compound: "SOFT",
  start_lap: 1,
};

function stubFetch(routes: Record<string, unknown>) {
  const fetchMock = vi.fn().mockImplementation((url: string) => {
    const hit = Object.entries(routes).find(([key]) =>
      String(url).includes(key)
    );
    if (!hit) return Promise.resolve({ ok: false, status: 404 });
    return Promise.resolve(jsonResponse(hit[1]));
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("hooks (TanStack Query wrappers)", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("useRaceWeekend exposes derived state", async () => {
    stubFetch({ "/api/f1/live-status": liveStatus });
    const { result } = renderQueryHook(() => useRaceWeekend());
    await waitFor(() => expect(result.current.state).toBe("live"));
    expect(result.current.isLive).toBe(true);
    expect(result.current.isUpcoming).toBe(false);
    expect(result.current.session?.session_key).toBe(42);
    expect(result.current.nextSession?.session_type).toBe("Qualifying");
    expect(result.current.meeting?.meeting_official_name).toBe(
      "British Grand Prix"
    );
  });

  it("useRaceWeekend surfaces errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 500 })
    );
    const { result } = renderQueryHook(() => useRaceWeekend());
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.status).toBeNull();
  });

  it("useLiveSession exposes the session key only while live", async () => {
    stubFetch({ "/api/f1/live-status": liveStatus });
    const { result } = renderQueryHook(() => useLiveSession());
    await waitFor(() => expect(result.current.isLive).toBe(true));
    expect(result.current.sessionKey).toBe(42);
    expect(result.current.sessionType).toBe("Race");
  });

  it("useSchedule returns races", async () => {
    stubFetch({ "/api/f1/schedule": [raceRow] });
    const { result } = renderQueryHook(() => useSchedule());
    await waitFor(() => expect(result.current.races).toHaveLength(1));
    expect(result.current.races?.[0].round).toBe("1");
  });

  it("useLiveStandings returns drivers and constructors", async () => {
    stubFetch({
      "/api/f1/championship/drivers": [driverStanding],
      "/api/f1/championship/teams": [constructorStanding],
    });
    const { result } = renderQueryHook(() => useLiveStandings());
    await waitFor(() =>
      expect(result.current.drivers).toHaveLength(1)
    );
    expect(result.current.constructors).toHaveLength(1);
    expect(result.current.drivers?.[0].Driver.familyName).toBe("Verstappen");
  });

  it("useLiveStandings marks loading while any query is pending", async () => {
    stubFetch({ "/api/f1/championship/drivers": [driverStanding] });
    const { result } = renderQueryHook(() => useLiveStandings());
    expect(result.current.isLoading).toBe(true);
  });

  it("useLiveWeather returns the latest weather reading", async () => {
    stubFetch({ "/api/f1/live/weather": [weatherRow] });
    const { result } = renderQueryHook(() => useLiveWeather(42));
    await waitFor(() => expect(result.current.latest).toBeTruthy());
    expect(result.current.latest?.air_temperature).toBe(24);
    expect(result.current.weather).toHaveLength(1);
  });

  it("useLiveWeather stays idle without a session key", async () => {
    stubFetch({ "/api/f1/live/weather": [weatherRow] });
    const { result } = renderQueryHook(() => useLiveWeather(null));
    expect(result.current.latest).toBeNull();
  });

  it("useRaceControlFeed returns messages", async () => {
    stubFetch({ "/api/f1/live/race-control": [raceControlRow] });
    const { result } = renderQueryHook(() => useRaceControlFeed(42));
    await waitFor(() => expect(result.current.messages).toHaveLength(1));
    expect(result.current.messages?.[0].message).toBe("GREEN FLAG");
  });

  it("useStints returns stints", async () => {
    stubFetch({ "/api/f1/live/stints": [stintRow] });
    const { result } = renderQueryHook(() => useStints(42));
    await waitFor(() => expect(result.current.stints).toHaveLength(1));
    expect(result.current.stints?.[0].compound).toBe("SOFT");
  });

  it("useHistoricalSeason returns a season payload", async () => {
    stubFetch({
      "/api/f1/historical": { season: "2024", races: [raceRow] },
    });
    const { result } = renderQueryHook(() => useHistoricalSeason(2024));
    await waitFor(() => expect(result.current.data?.season).toBe("2024"));
  });

  it("useRaceResults builds round/year query params", async () => {
    const fetchMock = stubFetch({
      "/api/f1/results": [{ position: "1", positionText: "1", points: "25", Driver: driverStanding.Driver, Constructor: driverStanding.Constructors[0], grid: "1", laps: "52", status: "Finished" }],
    });
    const { result } = renderQueryHook(() => useRaceResults(2024, 3));
    await waitFor(() => expect(result.current.data).toHaveLength(1));
    const url = fetchMock.mock.calls[0][0] as string;
    expect(url).toContain("round=3");
    expect(url).toContain("year=2024");
  });

  it("useRaceResults stays disabled without a round", async () => {
    const { result } = renderQueryHook(() => useRaceResults(2024, null));
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("useQualifyingResults and useSprintResults build their endpoints", async () => {
    const fetchMock = stubFetch({
      "/api/f1/results/qualifying": [{ position: "1", Driver: driverStanding.Driver, Constructor: driverStanding.Constructors[0] }],
      "/api/f1/results/sprint": [{ position: "1", positionText: "1", points: "25", Driver: driverStanding.Driver, Constructor: driverStanding.Constructors[0], grid: "1", laps: "40", status: "Finished" }],
    });
    const quali = renderQueryHook(() => useQualifyingResults(2024, 3));
    await waitFor(() => expect(quali.result.current.data).toHaveLength(1));
    const sprint = renderQueryHook(() => useSprintResults(2024, 3));
    await waitFor(() => expect(sprint.result.current.data).toHaveLength(1));
    const urls = fetchMock.mock.calls.map((c) => c[0] as string);
    expect(urls.some((u) => u.includes("results/qualifying") && u.includes("year=2024"))).toBe(true);
    expect(urls.some((u) => u.includes("results/sprint") && u.includes("round=3"))).toBe(true);
  });

  it("useLiveStandings refetches both queries", async () => {
    stubFetch({
      "/api/f1/championship/drivers": [driverStanding],
      "/api/f1/championship/teams": [constructorStanding],
    });
    const { result } = renderQueryHook(() => useLiveStandings());
    await waitFor(() => expect(result.current.drivers).toHaveLength(1));
    expect(() => result.current.refetch()).not.toThrow();
  });

  it("useWeather returns live weather and skips forecast while live", async () => {
    const fetchMock = stubFetch({
      "/api/f1/live-status": liveStatus,
      "/api/f1/live/weather": [weatherRow],
      "/api/f1/schedule": [raceRow],
    });
    const { result } = renderQueryHook(() => useWeather());
    await waitFor(() => expect(result.current.latest).toBeTruthy());
    expect(result.current.latest?.air_temperature).toBe(24);
    expect(result.current.isLive).toBe(true);
    expect(result.current.coords).toEqual({ lat: 52.07, lon: -1.01 });
    expect(
      fetchMock.mock.calls.every((c) => !String(c[0]).includes("/forecast"))
    ).toBe(true);
  });

  it("useWeather enables the forecast when no live session", async () => {
    const fetchMock = stubFetch({
      "/api/f1/live-status": { ...liveStatus, state: "upcoming", session: null },
      "/api/f1/schedule": [raceRow],
      "/api/f1/forecast": [
        { dt: 1000, temp: 18, pop: 0.2, description: "Cloudy", icon: "04d" },
      ],
    });
    const { result } = renderQueryHook(() => useWeather());
    await waitFor(() => expect(result.current.forecast).toBeTruthy());
    expect(result.current.isLive).toBe(false);
    const url = fetchMock.mock.calls.find((c) =>
      String(c[0]).includes("/forecast")
    )?.[0] as string;
    expect(url).toContain("lat=52.07");
    expect(url).toContain("lon=-1.01");
  });
});
