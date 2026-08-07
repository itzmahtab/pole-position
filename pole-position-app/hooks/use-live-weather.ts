"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEnvelopeData } from "@/lib/api/envelope";
import type { Weather } from "@/types";

export function useLiveWeather(sessionKey: number | null) {
  const query = useQuery({
    queryKey: ["weather", sessionKey],
    enabled: !!sessionKey,
    queryFn: () =>
      fetchEnvelopeData<Weather[]>(`/api/f1/live/weather?session_key=${sessionKey}`),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const data = query.data ?? [];
  const latest = data.length > 0 ? data[data.length - 1] : null;

  return {
    latest,
    weather: data,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
