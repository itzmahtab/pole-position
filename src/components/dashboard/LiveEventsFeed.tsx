'use client';

import { useQuery } from '@tanstack/react-query';
import { getSessions } from '@/lib/api/f1';
import { getMeetings } from '@/lib/api/f1';
import { FadeIn } from '@/components/animations';
import { motion, AnimatePresence } from 'framer-motion';
import { formatInTimezone } from '@/lib/utils/date';
import { useSettingsStore } from '@/stores/settingsStore';
import { Radio, Clock, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function LiveEventsFeed() {
  const [now, setNow] = useState(new Date());
  const timezone = useSettingsStore((s) => s.timezone);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(interval);
  }, []);

  const { data: meetings } = useQuery({
    queryKey: ['meetings', new Date().getFullYear()],
    queryFn: () => getMeetings(),
    staleTime: 60000,
  });

  const currentMeeting = meetings?.find((m) => {
    const start = new Date(m.date_start);
    const end = new Date(m.date_end);
    return now >= start && now <= end;
  });

  const { data: sessions } = useQuery({
    queryKey: ['sessions', currentMeeting?.meeting_key],
    queryFn: () => getSessions(currentMeeting!.meeting_key),
    enabled: !!currentMeeting,
    refetchInterval: 30000,
  });

  const upcomingSessions = (sessions || []).filter(
    (s) => new Date(s.date_start) > now
  ).slice(0, 5);

  const liveSessions = (sessions || []).filter(
    (s) => now >= new Date(s.date_start) && now <= new Date(s.date_end)
  );

  const hasEvents = liveSessions.length > 0 || upcomingSessions.length > 0;

  return (
    <section id="events" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Live <span className="text-gradient-primary">Events</span>
            </h2>
            <p className="text-muted-foreground">
              {currentMeeting
                ? `Current: ${currentMeeting.meeting_name}`
                : 'Upcoming sessions across the season'}
            </p>
          </div>
        </FadeIn>

        <AnimatePresence mode="wait">
          {!hasEvents ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card rounded-xl p-8 text-center"
            >
              <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                No upcoming events right now. Check back during a race weekend!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="events"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-3"
            >
              {liveSessions.map((session) => (
                <motion.div
                  key={session.session_key}
                  className="glass-card rounded-xl p-5 border-l-4 border-l-[#00d084]"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  layout
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00d084] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00d084]" />
                    </span>
                    <span className="text-xs font-bold text-[#00d084] uppercase">Live</span>
                  </div>
                  <h3 className="font-bold text-lg">{session.session_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatInTimezone(session.date_start, timezone, 'MMM d, HH:mm')} -{' '}
                    {formatInTimezone(session.date_end, timezone, 'HH:mm z')}
                  </p>
                </motion.div>
              ))}

              {upcomingSessions.map((session) => {
                const startsIn = new Date(session.date_start).getTime() - now.getTime();
                const hoursUntil = Math.floor(startsIn / (1000 * 60 * 60));
                const minutesUntil = Math.floor((startsIn % (1000 * 60 * 60)) / (1000 * 60));

                return (
                  <motion.div
                    key={session.session_key}
                    className="glass-card rounded-xl p-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    layout
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase">
                        {hoursUntil > 0
                          ? `In ${hoursUntil}h ${minutesUntil}m`
                          : `In ${minutesUntil}m`}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg">{session.session_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatInTimezone(session.date_start, timezone, 'EEEE, MMM d · HH:mm z')}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
