"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEnvelopeData } from "@/lib/api/envelope";
import type { RaceResultRaw, QualifyingResultRaw } from "@/types";

export function useRaceResults(year: number | null, round: number | null) {
  return useQuery({
    queryKey: ["race-results", year, round],
    enabled: round != null,
    queryFn: () =>
      fetchEnvelopeData<RaceResultRaw[]>(
        `/api/f1/results?round=${round}${year ? `&year=${year}` : ""}`
      ),
    staleTime: 10 * 60_000,
  });
}

export function useQualifyingResults(year: number | null, round: number | null) {
  return useQuery({
    queryKey: ["qualifying-results", year, round],
    enabled: round != null,
    queryFn: () =>
      fetchEnvelopeData<QualifyingResultRaw[]>(
        `/api/f1/results/qualifying?round=${round}${year ? `&year=${year}` : ""}`
      ),
    staleTime: 10 * 60_000,
  });
}

export function useSprintResults(year: number | null, round: number | null) {
  return useQuery({
    queryKey: ["sprint-results", year, round],
    enabled: round != null,
    queryFn: () =>
      fetchEnvelopeData<RaceResultRaw[]>(
        `/api/f1/results/sprint?round=${round}${year ? `&year=${year}` : ""}`
      ),
    staleTime: 10 * 60_000,
  });
}
