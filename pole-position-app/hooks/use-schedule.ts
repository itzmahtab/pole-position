"use client";

import { useQuery } from "@tanstack/react-query";
import type { RaceRaw } from "@/types";

async function fetchSchedule(): Promise<RaceRaw[]> {
  const res = await fetch("/api/f1/schedule", { cache: "no-store" });
  if (!res.ok) throw new Error(`schedule ${res.status}`);
  const json = await res.json();
  return json.data as RaceRaw[];
}

export function useSchedule() {
  const query = useQuery({
    queryKey: ["schedule"],
    queryFn: fetchSchedule,
    staleTime: 5 * 60_000,
  });

  return {
    races: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
