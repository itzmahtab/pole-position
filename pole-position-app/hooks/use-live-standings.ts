"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchEnvelopeData } from "@/lib/api/envelope";
import type { DriverStandingRaw, ConstructorStandingRaw } from "@/types";

export function useLiveStandings() {
  const drivers = useQuery({
    queryKey: ["driver-standings"],
    queryFn: () => fetchEnvelopeData<DriverStandingRaw[]>("/api/f1/championship/drivers"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const constructors = useQuery({
    queryKey: ["constructor-standings"],
    queryFn: () => fetchEnvelopeData<ConstructorStandingRaw[]>("/api/f1/championship/teams"),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  return {
    drivers: drivers.data ?? null,
    constructors: constructors.data ?? null,
    isLoading: drivers.isLoading || constructors.isLoading,
    isError: drivers.isError || constructors.isError,
    refetch: () => {
      drivers.refetch();
      constructors.refetch();
    },
  };
}
