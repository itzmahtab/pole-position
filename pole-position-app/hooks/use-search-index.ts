"use client";

import { useQuery } from "@tanstack/react-query";
import type { RaceRaw, DriverStandingRaw, ConstructorStandingRaw } from "@/types";

export interface SearchEntry {
  id: string;
  group: "Driver" | "Constructor" | "Race" | "Circuit" | "Country" | "Season";
  title: string;
  subtitle: string;
  keywords: string;
}

async function fetchJson<T>(url: string): Promise<T[]> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`${url} ${res.status}`);
  const json = await res.json();
  return json.data as T[];
}

export function useSearchIndex() {
  const schedule = useQuery({
    queryKey: ["schedule"],
    queryFn: () => fetchJson<RaceRaw>("/api/f1/schedule"),
    staleTime: 5 * 60_000,
  });
  const drivers = useQuery({
    queryKey: ["driver-standings"],
    queryFn: () => fetchJson<DriverStandingRaw>("/api/f1/championship/drivers"),
    staleTime: 5 * 60_000,
  });
  const constructors = useQuery({
    queryKey: ["constructor-standings"],
    queryFn: () => fetchJson<ConstructorStandingRaw>("/api/f1/championship/teams"),
    staleTime: 5 * 60_000,
  });

  const isLoading =
    schedule.isLoading || drivers.isLoading || constructors.isLoading;

  const entries: SearchEntry[] = [];

  const races = schedule.data ?? [];
  for (const race of races) {
    const country = race.Circuit.Location.country;
    const circuitName = race.Circuit.circuitName;
    entries.push({
      id: `race-${race.round}`,
      group: "Race",
      title: race.raceName,
      subtitle: `Round ${race.round} · ${race.date}`,
      keywords: `${race.raceName} ${country} ${circuitName} ${race.round}`,
    });
    entries.push({
      id: `circuit-${race.Circuit.circuitId}`,
      group: "Circuit",
      title: circuitName,
      subtitle: `${race.Circuit.Location.locality}, ${country}`,
      keywords: `${circuitName} ${country} ${race.Circuit.Location.locality}`,
    });
    entries.push({
      id: `country-${country}`,
      group: "Country",
      title: country,
      subtitle: circuitName,
      keywords: country,
    });
  }

  const seasonYear = races[0]?.season ?? "current";
  entries.push({
    id: `season-${seasonYear}`,
    group: "Season",
    title: `${seasonYear} Formula 1 Season`,
    subtitle: `${races.length} rounds`,
    keywords: `${seasonYear} f1 formula season`,
  });

  for (const d of drivers.data ?? []) {
    const name = `${d.Driver.givenName} ${d.Driver.familyName}`;
    entries.push({
      id: `driver-${d.Driver.driverId}`,
      group: "Driver",
      title: name,
      subtitle: `#${d.position} · ${d.Driver.code ?? d.Driver.nationality}`,
      keywords: `${name} ${d.Driver.nationality} ${d.Driver.code ?? ""} driver`,
    });
  }

  for (const c of constructors.data ?? []) {
    entries.push({
      id: `constructor-${c.Constructor.constructorId}`,
      group: "Constructor",
      title: c.Constructor.name,
      subtitle: `#${c.position} · ${c.points} pts`,
      keywords: `${c.Constructor.name} ${c.Constructor.nationality} team constructor`,
    });
  }

  return { entries, isLoading, races };
}
