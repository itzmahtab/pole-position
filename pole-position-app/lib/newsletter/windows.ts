// Reminder window definitions shared by the form, cron handler and email copy.

export const REMINDER_WINDOWS = [
  { id: "15m", label: "15 minutes before", hours: 0.25 },
  { id: "1h", label: "1 hour before", hours: 1 },
  { id: "12h", label: "12 hours before", hours: 12 },
  { id: "24h", label: "24 hours before", hours: 24 },
] as const;

export type ReminderWindow = (typeof REMINDER_WINDOWS)[number]["id"];

export const DEFAULT_REMINDER_WINDOWS: ReminderWindow[] = ["24h", "1h"];

export function isReminderWindow(value: string): value is ReminderWindow {
  return REMINDER_WINDOWS.some((w) => w.id === value);
}

export function windowHours(window: ReminderWindow): number {
  return REMINDER_WINDOWS.find((w) => w.id === window)?.hours ?? 0;
}
