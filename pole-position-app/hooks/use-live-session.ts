"use client";

import { useRaceWeekend } from "@/hooks/use-race-weekend";

// Session data (race_control, weather, stints, intervals) is keyed by
// `session_key`. This hook exposes the active session key, or null when there
// is no live session (used to render the "no live session" empty state).
export function useLiveSession() {
  const { session, meeting, state, isLive, isLoading } = useRaceWeekend();

  return {
    sessionKey: isLive ? session?.session_key ?? null : null,
    sessionType: isLive ? session?.session_type ?? null : null,
    isLive,
    state,
    meeting,
    session,
    isLoading,
  };
}
