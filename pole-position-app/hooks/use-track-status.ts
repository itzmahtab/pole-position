"use client";

import { useRaceWeekend } from "@/hooks/use-race-weekend";
import type { Meeting, RaceControlMessage, Weather } from "@/types";

interface TrackStatus {
  sessionActive: boolean;
  sessionType: string | null;
  weather: Weather | null;
  raceControl: RaceControlMessage[];
  safetyCar: boolean;
  virtualSafetyCar: boolean;
  redFlag: boolean;
  yellowFlag: boolean;
  drsEnabled: boolean;
}

export function useTrackStatus(
  weather?: Weather[] | null,
  raceControl?: RaceControlMessage[] | null
): TrackStatus {
  const { session, state } = useRaceWeekend();
  const sessionActive = state === "live";

  const messages = raceControl ?? [];
  const latest = messages.length > 0 ? messages[messages.length - 1] : null;

  return {
    sessionActive,
    sessionType: session?.session_type ?? null,
    weather: weather?.length ? weather[weather.length - 1] : null,
    raceControl: messages,
    safetyCar: messages.some(
      (m) =>
        m.category === "SafetyCar" ||
        m.message.toLowerCase().includes("safety car") ||
        m.message.toLowerCase().includes("sc deployment")
    ),
    virtualSafetyCar: messages.some(
      (m) =>
        m.category === "SafetyCar" &&
        m.message.toLowerCase().includes("virtual")
    ),
    redFlag: messages.some(
      (m) => m.flag === "RED" || m.message.toLowerCase().includes("red flag")
    ),
    yellowFlag: messages.some(
      (m) => m.flag === "YELLOW" || m.message.toLowerCase().includes("yellow")
    ),
    drsEnabled: messages.some(
      (m) => m.message.toLowerCase().includes("drs enabled")
    ),
  };
}
