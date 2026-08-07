import { openf1 } from "@/lib/api/openf1";
import type { Meeting, SessionSummary } from "@/types";
import { windowHours, type ReminderWindow } from "./windows";

export interface SessionWithMeeting {
  session: SessionSummary;
  meeting: Meeting | null;
}

export interface DueReminder {
  sessionKey: number;
  window: ReminderWindow;
  sessionName: string;
  sessionType: string;
  circuitName: string;
  dateStart: string;
  timezone: string;
}

const CRON_TICK_MS = 5 * 60 * 1000;

/**
 * Collects every (session, window) pair whose reminder target time falls
 * within the last cron tick. The cron runs every 5 minutes, so a reminder
 * fires when `date_start - window` is in the past but less than one tick old.
 */
export function computeDueReminders(
  sessions: SessionWithMeeting[],
  now: number = Date.now()
): DueReminder[] {
  const due: DueReminder[] = [];
  for (const { session, meeting } of sessions) {
    const start = Date.parse(session.date_start);
    if (Number.isNaN(start) || start <= now) continue;
    for (const window of ["24h", "12h", "1h", "15m"] as const) {
      const target = start - windowHours(window) * 3600 * 1000;
      if (target <= now && target > now - CRON_TICK_MS) {
        due.push({
          sessionKey: session.session_key,
          window,
          sessionName: session.session_name ?? meeting?.meeting_official_name ?? "Session",
          sessionType: session.session_type,
          circuitName:
            session.circuit_short_name ?? meeting?.circuit_short_name ?? "",
          dateStart: session.date_start,
          timezone: session.gmt_offset ?? meeting?.gmt_offset ?? "+00:00",
        });
      }
    }
  }
  return due;
}

/**
 * Fetches upcoming meetings and their sessions, flat-mapped into a list
 * that pairs each session with its parent meeting.
 */
export async function fetchUpcomingSessions(): Promise<SessionWithMeeting[]> {
  const meetings = await openf1.meetings();
  const result: SessionWithMeeting[] = [];
  for (const meeting of meetings) {
    try {
      const sessions = await openf1.sessions(meeting.meeting_key);
      for (const session of sessions) {
        result.push({ session, meeting });
      }
    } catch {
      // Skip meetings whose sessions fail to load.
    }
  }
  return result;
}
