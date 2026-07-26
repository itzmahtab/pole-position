"use client";

import { useState, useEffect, useCallback } from "react";
import { getCountdownParts, type F1SessionType } from "@/lib/time";

export function useCountdown(targetDate: string | null) {
  const [parts, setParts] = useState(() =>
    targetDate ? getCountdownParts(targetDate) : { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  );

  useEffect(() => {
    if (!targetDate) return;

    const tick = () => setParts(getCountdownParts(targetDate));
    tick();

    // Drift-corrected: recalc from Date.now() each second, don't decrement
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return parts;
}

export function useTimezone() {
  const [tz, setTz] = useState<string>("UTC");

  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setTz("UTC");
    }
  }, []);

  return { timezone: tz, setTimezone: setTz };
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage full or unavailable
    }
  }, [key, value]);

  return [value, setValue] as const;
}

export function useSessionState(
  liveState: "upcoming" | "live" | "between" | "finished" | null
) {
  return {
    isLive: liveState === "live",
    isUpcoming: liveState === "upcoming",
    isBetween: liveState === "between",
    isFinished: liveState === "finished",
  };
}
