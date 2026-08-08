import { afterEach, describe, expect, it, vi } from "vitest";
import { jolpica } from "@/lib/api/jolpica";

function raceFixture(round: string, season = "2025") {
  return {
    season,
    round,
    raceName: `Round ${round}`,
    date: "2025-03-01",
    Circuit: {
      circuitId: `circuit-${round}`,
      circuitName: `Circuit ${round}`,
      Location: { locality: "Loc", country: "Country", lat: "1", long: "2" },
    },
    Results: [],
  };
}

const scheduleJson = {
  MRData: { RaceTable: { Races: [raceFixture("1")] } },
};

describe("lib/api/jolpica", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches from the first base and falls back on failure", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500 })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => scheduleJson,
      });
    vi.stubGlobal("fetch", fetchMock);

    const result = await jolpica.currentSchedule();
    expect(result).toEqual(scheduleJson);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "https://api.jolpi.ca/ergast/f1/current.json",
      { headers: { Accept: "application/json" }, next: { revalidate: 300 } }
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "https://ergast.com/api/f1/current.json",
      expect.anything()
    );
  });

  it("throws when every mirror fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 503 })
    );
    await expect(jolpica.currentSchedule()).rejects.toThrow("503");
  });

  it("throws network errors from every mirror", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("boom")));
    await expect(jolpica.yearSchedule(2025)).rejects.toThrow("boom");
  });

  it("builds round- and year-scoped endpoints", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ MRData: { RaceTable: { Races: [] } } }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await jolpica.raceResults(3);
    expect(fetchMock.mock.calls[0][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/current/3/results.json"
    );
    await jolpica.qualifyingResults(3);
    expect(fetchMock.mock.calls[1][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/current/3/qualifying.json"
    );
    await jolpica.sprintResults(3);
    expect(fetchMock.mock.calls[2][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/current/3/sprint.json"
    );
    await jolpica.yearRaceResults(2024, 2);
    expect(fetchMock.mock.calls[3][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/2024/2/results.json"
    );
    await jolpica.yearQualifyingResults(2024, 2);
    expect(fetchMock.mock.calls[4][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/2024/2/qualifying.json"
    );
    await jolpica.yearSprintResults(2024, 2);
    expect(fetchMock.mock.calls[5][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/2024/2/sprint.json"
    );
    await jolpica.driverStandings();
    expect(fetchMock.mock.calls[6][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/current/driverStandings.json"
    );
    await jolpica.constructorStandings();
    expect(fetchMock.mock.calls[7][0]).toBe(
      "https://api.jolpi.ca/ergast/f1/current/constructorStandings.json"
    );
  });

  it("paginates season results and dedupes by round", async () => {
    const page1 = { MRData: { RaceTable: { Races: [raceFixture("1"), raceFixture("2"), raceFixture("3")] } } };
    const page2 = { MRData: { RaceTable: { Races: [raceFixture("2"), raceFixture("4"), raceFixture("5")] } } };
    const empty = { MRData: { RaceTable: { Races: [] } } };

    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => page1 })
      .mockResolvedValueOnce({ ok: true, json: async () => page2 })
      .mockResolvedValue({ ok: true, json: async () => empty });

    vi.stubGlobal("fetch", fetchMock);

    const races = await jolpica.yearSeasonResults(2025);
    expect(races.map((r) => r.round)).toEqual(["1", "2", "3", "4", "5"]);
    expect(fetchMock.mock.calls[0][0]).toContain("limit=100&offset=0");
    expect(fetchMock.mock.calls[1][0]).toContain("offset=120");
  });

  it("stops paginating early when no new races are added", async () => {
    const page = { MRData: { RaceTable: { Races: [raceFixture("1")] } } };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: true, json: async () => page })
    );
    const races = await jolpica.yearSeasonResults(2025);
    expect(races).toHaveLength(1);
  });
});
