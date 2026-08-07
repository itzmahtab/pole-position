import type { HistoricalRace } from "@/types";

const BASES = [
  "https://api.jolpi.ca/ergast/f1",
  "https://ergast.com/api/f1",
];

async function jolpicaFetch<T>(path: string): Promise<T> {
  let lastErr: unknown;
  for (const base of BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        headers: { Accept: "application/json" },
        next: { revalidate: 300 },
      });
      if (!res.ok) throw new Error(`${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("All Jolpica mirrors failed");
}

export const jolpica = {
  currentSchedule: () => jolpicaFetch("/current.json"),
  driverStandings: () => jolpicaFetch("/current/driverStandings.json"),
  constructorStandings: () =>
    jolpicaFetch("/current/constructorStandings.json"),
  raceResults: (round: number) =>
    jolpicaFetch(`/current/${round}/results.json`),
  qualifyingResults: (round: number) =>
    jolpicaFetch(`/current/${round}/qualifying.json`),
  sprintResults: (round: number) =>
    jolpicaFetch(`/current/${round}/sprint.json`),
  yearSchedule: (year: number) => jolpicaFetch(`/${year}.json`),
  yearRaceResults: (year: number, round: number) =>
    jolpicaFetch(`/${year}/${round}/results.json`),
  yearQualifyingResults: (year: number, round: number) =>
    jolpicaFetch(`/${year}/${round}/qualifying.json`),
  yearSprintResults: (year: number, round: number) =>
    jolpicaFetch(`/${year}/${round}/sprint.json`),
  // Full season results, fetched in ~6-race pages (offset in result rows).
  yearSeasonResults: async (year: number): Promise<HistoricalRace[]> => {
    const seen = new Map<string, HistoricalRace>();
    let offset = 0;
    for (let page = 0; page < 8; page++) {
      const json = (await jolpicaFetch(
        `/${year}/results.json?limit=100&offset=${offset}`
      )) as {
        MRData: { RaceTable: { Races: HistoricalRace[] } };
      };
      const races = json.MRData?.RaceTable?.Races ?? [];
      if (races.length === 0) break;
      let added = 0;
      for (const race of races) {
        if (!seen.has(race.round)) {
          seen.set(race.round, race);
          added++;
        }
      }
      offset += 120;
      if (added === 0) break;
    }
    return Array.from(seen.values()).sort((a, b) => Number(a.round) - Number(b.round));
  },
};
