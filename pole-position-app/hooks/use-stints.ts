"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEnvelopeData } from "@/lib/api/envelope";
import type { Stint } from "@/types";

export function useStints(sessionKey: number | null) {
  const query = useQuery({
    queryKey: ["stints", sessionKey],
    enabled: !!sessionKey,
    queryFn: () =>
      fetchEnvelopeData<Stint[]>(`/api/f1/live/stints?session_key=${sessionKey}`),
    refetchInterval: 10_000,
    staleTime: 5_000,
  });

  return {
    stints: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
