import { afterEach, describe, expect, it, vi } from "vitest";
import { jsonResponse, renderQueryHook, waitFor } from "@/tests/helpers";
import { useSearchIndex } from "@/hooks/use-search-index";

const raceRow = {
  season: "2026",
  round: "2",
  raceName: "Monaco Grand Prix",
  date: "2026-05-24",
  Circuit: {
    circuitId: "monaco",
    circuitName: "Circuit de Monaco",
    Location: { locality: "Monte Carlo", country: "Monaco", lat: "43.73", long: "7.42" },
  },
};

const driverStanding = {
  position: 1,
  points: "25",
  wins: "1",
  Driver: {
    driverId: "hamilton",
    code: "HAM",
    givenName: "Lewis",
    familyName: "Hamilton",
    nationality: "British",
  },
  Constructors: [{ constructorId: "mercedes", name: "Mercedes", nationality: "German" }],
};

const constructorStanding = {
  position: 1,
  points: "25",
  wins: "1",
  Constructor: { constructorId: "mercedes", name: "Mercedes", nationality: "German" },
};

function stubFetch(routes: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((url: string) => {
      const hit = Object.entries(routes).find(([key]) =>
        String(url).includes(key)
      );
      if (!hit) return Promise.resolve({ ok: false, status: 404 });
      return Promise.resolve(jsonResponse(hit[1]));
    })
  );
}

describe("hooks/use-search-index", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("builds search entries from schedule, drivers and constructors", async () => {
    stubFetch({
      "/api/f1/schedule": [raceRow],
      "/api/f1/championship/drivers": [driverStanding],
      "/api/f1/championship/teams": [constructorStanding],
    });
    const { result } = renderQueryHook(() => useSearchIndex());
    await waitFor(() => expect(result.current.races).toHaveLength(1));

    const entries = result.current.entries;
    const groups = entries.map((e) => e.group);
    expect(groups).toContain("Race");
    expect(groups).toContain("Circuit");
    expect(groups).toContain("Country");
    expect(groups).toContain("Season");
    expect(groups).toContain("Driver");
    expect(groups).toContain("Constructor");

    const race = entries.find((e) => e.group === "Race");
    expect(race?.title).toBe("Monaco Grand Prix");
    expect(race?.keywords.toLowerCase()).toContain("monaco");

    const season = entries.find((e) => e.group === "Season");
    expect(season?.title).toContain("2026");

    const driver = entries.find((e) => e.group === "Driver");
    expect(driver?.title).toBe("Lewis Hamilton");
    expect(driver?.keywords.toLowerCase()).toContain("hamilton");

    const constructor = entries.find((e) => e.group === "Constructor");
    expect(constructor?.title).toBe("Mercedes");
  });

  it("is loading until all three queries resolve", async () => {
    stubFetch({
      "/api/f1/schedule": [raceRow],
      "/api/f1/championship/drivers": [driverStanding],
    });
    const { result } = renderQueryHook(() => useSearchIndex());
    expect(result.current.isLoading).toBe(true);
  });
});
