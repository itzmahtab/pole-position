import { format, formatDistanceToNow, isPast, differenceInSeconds } from "date-fns";

export type F1SessionType = "Practice 1" | "Practice 2" | "Practice 3" | "Qualifying" | "Sprint Qualifying" | "Sprint" | "Race";

export function toLocal(utcDate: string, tz: string): Date {
  return new Date(utcDate);
}

export function formatLocal(utcDate: string, tz: string, fmt: string): string {
  const date = new Date(utcDate);
  return new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    ...parseFormatOptions(fmt),
  }).format(date);
}

function parseFormatOptions(fmt: string): Intl.DateTimeFormatOptions {
  const map: Record<string, Intl.DateTimeFormatOptions> = {
    "HH:mm": { hour: "2-digit", minute: "2-digit", hour12: false },
    "DD MMM": { day: "2-digit", month: "short" },
    "DD MMM YYYY": { day: "2-digit", month: "short", year: "numeric" },
    "dddd, DD MMM": { weekday: "long", day: "2-digit", month: "short" },
    "HH:mm:ss": { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false },
  };
  return map[fmt] ?? { hour: "2-digit", minute: "2-digit", hour12: false };
}

export function formatTime(utcDate: string, tz: string): string {
  const date = new Date(utcDate);
  return new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function formatDate(utcDate: string, tz: string): string {
  const date = new Date(utcDate);
  return new Intl.DateTimeFormat(undefined, {
    timeZone: tz,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatRelative(utcDate: string): string {
  const date = new Date(utcDate);
  if (isPast(date)) {
    return `${formatDistanceToNow(date)} ago`;
  }
  return `in ${formatDistanceToNow(date)}`;
}

export function getSessionStatusLabel(
  state: "upcoming" | "live" | "between" | "finished"
): string {
  const labels: Record<typeof state, string> = {
    upcoming: "UPCOMING",
    live: "LIVE",
    between: "BETWEEN SESSIONS",
    finished: "FINISHED",
  };
  return labels[state];
}

export function getSessionTypeLabel(type: F1SessionType): string {
  const labels: Record<F1SessionType, string> = {
    "Practice 1": "FP1",
    "Practice 2": "FP2",
    "Practice 3": "FP3",
    Qualifying: "Q",
    "Sprint Qualifying": "SQ",
    Sprint: "S",
    Race: "R",
  };
  return labels[type] ?? type;
}

export function getCountdownParts(utcDate: string): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
} {
  const target = new Date(utcDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const total = Math.floor(diff / 1000);

  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    total,
  };
}

export function padZero(n: number): string {
  return n.toString().padStart(2, "0");
}

export function detectTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}
