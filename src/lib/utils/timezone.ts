import { format, formatDistanceToNow } from 'date-fns';
import { toZonedTime, formatInTimeZone } from 'date-fns-tz';

export function convertToTimezone(date: Date | string, timezone: string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;
  return toZonedTime(d, timezone);
}

export function formatDateInTimezone(
  date: Date | string,
  timezone: string,
  formatStr: string = 'PPp'
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(d, timezone, formatStr);
}

export function getRelativeTime(date: Date | string, timezone: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const zoned = toZonedTime(d, timezone);
  return formatDistanceToNow(zoned, { addSuffix: true });
}

export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getTimezoneOffset(timezone: string): string {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    timeZoneName: 'shortOffset',
  });
  const parts = formatter.formatToParts(now);
  const offset = parts.find((p) => p.type === 'timeZoneName');
  return offset?.value || '';
}
