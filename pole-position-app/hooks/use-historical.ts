"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEnvelopeData } from "@/lib/api/envelope";
import type { HistoricalSeason } from "@/types";

export function useHistoricalSeason(year: number) {
  return useQuery({
    queryKey: ["historical-season", year],
    queryFn: () =>
      fetchEnvelopeData<HistoricalSeason>(`/api/f1/historical?year=${year}`),
    staleTime: 60 * 60_000,
  });
}
