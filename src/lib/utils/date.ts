import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import type { Session, SessionStatus } from '@/types';

export function formatDate(date: Date) {
  return date.toISOString();
}

export function formatInTimezone(
  date: string | Date,
  timezone: string,
  formatStr: string
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return formatInTimeZone(d, timezone, formatStr);
}

export function getSessionStatus(
  dateStart: string,
  dateEnd: string,
  timezone: string
): SessionStatus {
  const now = new Date();
  const start = new Date(dateStart);
  const end = new Date(dateEnd);

  if (now >= start && now <= end) {
    return { label: 'Live', color: '#00d084', variant: 'live' };
  }

  if (now < start) {
    const hoursUntil = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntil < 1) {
      const minutes = Math.round(hoursUntil * 60);
      return { label: `In ${minutes}m`, color: '#ff9f43', variant: 'upcoming' };
    }
    if (hoursUntil < 24) {
      return { label: `In ${Math.round(hoursUntil)}h`, color: '#ff9f43', variant: 'upcoming' };
    }
    const daysUntil = Math.round(hoursUntil / 24);
    return { label: `In ${daysUntil}d`, color: '#54a0ff', variant: 'upcoming' };
  }

  return { label: 'Finished', color: '#5f6c80', variant: 'finished' };
}

export function isSessionLive(dateStart: string, dateEnd: string): boolean {
  const now = new Date();
  return now >= new Date(dateStart) && now <= new Date(dateEnd);
}

export function getCurrentSession(sessions: Session[]): Session | null {
  const now = new Date();
  return sessions.find((s) => now >= new Date(s.date_start) && now <= new Date(s.date_end)) || null;
}

export function getNextSession(sessions: Session[]): Session | null {
  const now = new Date();
  return (
    sessions
      .filter((s) => new Date(s.date_start) > now)
      .sort((a, b) => new Date(a.date_start).getTime() - new Date(b.date_start).getTime())[0] ||
    null
  );
}
