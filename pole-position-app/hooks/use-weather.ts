"use client";

import { useLiveSession } from "@/hooks/use-live-session";
import { useLiveWeather } from "@/hooks/use-live-weather";
import { useSchedule } from "@/hooks/use-schedule";
import { useQuery } from "@tanstack/react-query";
import { fetchEnvelopeData } from "@/lib/api/envelope";
import type { ForecastPoint } from "@/app/api/f1/forecast/route";
import { useMemo } from "react";

function circuitCoords(
  circuitName: string | undefined,
  races: { Circuit: { circuitName: string; Location: { lat: string; long: string } } }[] | null
): { lat: number; lon: number } | null {
  if (!circuitName || !races) return null;
  const name = circuitName.toLowerCase();
  const race = races.find(
    (r) =>
      r.Circuit.circuitName.toLowerCase().includes(name) ||
      name.includes(r.Circuit.circuitName.toLowerCase())
  );
  if (!race) return null;
  const lat = Number(race.Circuit.Location.lat);
  const lon = Number(race.Circuit.Location.long);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
  return { lat, lon };
}

export function useWeather() {
  const { sessionKey, isLive, meeting } = useLiveSession();
  const live = useLiveWeather(sessionKey);
  const { races } = useSchedule();

  const coords = useMemo(
    () => circuitCoords(meeting?.circuit_short_name, races),
    [meeting?.circuit_short_name, races]
  );

  const forecast = useQuery({
    queryKey: ["forecast", coords?.lat, coords?.lon],
    enabled: !!coords && !isLive,
    queryFn: () =>
      fetchEnvelopeData<ForecastPoint[]>(
        `/api/f1/forecast?lat=${coords?.lat}&lon=${coords?.lon}`
      ),
    staleTime: 15 * 60_000,
  });

  return {
    latest: live.latest,
    liveLoading: live.isLoading,
    isLive,
    meeting,
    forecast: forecast.data ?? null,
    coords,
  };
}
