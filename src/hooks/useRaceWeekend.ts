'use client';

import { useQuery } from '@tanstack/react-query';
import { getMeetings, getSessions } from '@/lib/api/f1';
import { useTimezone } from './useTimezone';
import { getSessionStatus, getCurrentSession, getNextSession } from '@/lib/utils/date';
import type { RaceWeekend } from '@/types/f1';

export function useRaceWeekend() {
  const { timezone } = useTimezone();

  return useQuery<RaceWeekend>({
    queryKey: ['race-weekend', timezone],
    queryFn: async () => {
      const year = new Date().getFullYear();
      const meetings = await getMeetings(year);

      const now = new Date();
      const currentMeeting = meetings.find((m) => {
        const start = new Date(m.date_start);
        const end = new Date(m.date_end);
        return now >= start && now <= end;
      });

      const targetMeeting =
        currentMeeting ||
        meetings.find((m) => new Date(m.date_start) > now) ||
        meetings[meetings.length - 1];

      if (!targetMeeting) throw new Error('No race meetings found');

      const sessions = await getSessions(targetMeeting.meeting_key);

      const currentSession = getCurrentSession(sessions);
      const nextSession = currentSession ? null : getNextSession(sessions);

      const totalSessions = sessions.length;
      const completedSessions = sessions.filter((s) => new Date(s.date_end) < now).length;
      const progress = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

      let status: RaceWeekend['status'] = 'upcoming';
      if (currentSession) status = 'live';
      else if (completedSessions > 0 && completedSessions < totalSessions)
        status = 'between_sessions';
      else if (completedSessions === totalSessions) status = 'completed';

      return {
        meeting: targetMeeting,
        sessions,
        current_session: currentSession,
        next_session: nextSession,
        status,
        progress,
      };
    },
    staleTime: 30000,
    refetchInterval: (query) => {
      const raceWeekend = query.state.data;
      return raceWeekend?.status === 'live' ? 10000 : 60000;
    },
  });
}
