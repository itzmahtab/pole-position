"use client";

import { useQuery } from "@tanstack/react-query";
import type { LiveStatus } from "@/types";

async function fetchLiveStatus(): Promise<LiveStatus> {
  const res = await fetch("/api/f1/live-status", { cache: "no-store" });
  if (!res.ok) throw new Error(`live-status ${res.status}`);
  const json = await res.json();
  return json.data as LiveStatus;
}

export function useRaceWeekend() {
  const query = useQuery({
    queryKey: ["live-status"],
    queryFn: fetchLiveStatus,
    refetchInterval: 10_000,
    staleTime: 5_000,
  });

  const status = query.data ?? null;

  return {
    status,
    state: status?.state ?? null,
    meeting: status?.meeting ?? null,
    session: status?.session ?? null,
    nextSession: status?.nextSession ?? null,
    isLive: status?.state === "live",
    isUpcoming: status?.state === "upcoming",
    isBetween: status?.state === "between",
    isFinished: status?.state === "finished",
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
