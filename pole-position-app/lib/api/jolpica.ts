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
};
