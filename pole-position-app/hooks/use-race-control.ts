"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEnvelopeData } from "@/lib/api/envelope";
import type { RaceControlMessage } from "@/types";

export function useRaceControlFeed(sessionKey: number | null) {
  const query = useQuery({
    queryKey: ["race-control", sessionKey],
    enabled: !!sessionKey,
    queryFn: () =>
      fetchEnvelopeData<RaceControlMessage[]>(
        `/api/f1/live/race-control?session_key=${sessionKey}`
      ),
    refetchInterval: 10_000,
    staleTime: 5_000,
  });

  return {
    messages: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
