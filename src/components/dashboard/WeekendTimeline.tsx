'use client';

import { motion } from 'framer-motion';
import { useRaceWeekend } from '@/hooks/useRaceWeekend';
import { useSettingsStore } from '@/stores/settingsStore';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { formatInTimezone, getSessionStatus, isSessionLive } from '@/lib/utils/date';
import { formatSessionName } from '@/lib/utils/formatters';
import { Clock, CheckCircle2, Radio, Circle } from 'lucide-react';

export function WeekendTimeline() {
  const { data: weekend, isLoading } = useRaceWeekend();
  const { timezone } = useSettingsStore();

  if (isLoading || !weekend) return <TimelineSkeleton />;

  const { sessions } = weekend;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            Race Weekend <span className="text-gradient-primary">Timeline</span>
          </h2>
          <p className="text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
            Every session, automatically converted to your local timezone
          </p>
        </FadeIn>

        <StaggerContainer className="relative">
          <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

          {sessions.map((session, index) => {
            const status = getSessionStatus(session.date_start, session.date_end, timezone);
            const isLive = isSessionLive(session.date_start, session.date_end);
            const isPast = new Date() > new Date(session.date_end);

            return (
              <StaggerItem key={session.session_key}>
                <motion.div
                  className={`relative pl-12 sm:pl-20 pb-12 last:pb-0 ${isLive ? 'opacity-100' : isPast ? 'opacity-50' : 'opacity-100'}`}
                  whileHover={{ x: 4 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className={`absolute left-2 sm:left-6 top-1 w-4 h-4 rounded-full border-2 ${isLive ? 'border-success bg-success animate-pulse' : isPast ? 'border-muted bg-muted' : 'border-primary bg-background'}`}
                  >
                    {isLive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-success"
                        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </div>

                  <div
                    className={`glass-card rounded-xl p-4 sm:p-6 ${isLive ? 'border-success/30 glow-primary-sm' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">
                            {formatSessionName(session.session_name)}
                          </h3>
                          {isLive && (
                            <span className="flex items-center gap-1 text-xs font-medium text-success">
                              <Radio className="w-3 h-3" />
                              LIVE
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {formatInTimezone(session.date_start, timezone, 'EEEE, MMMM d')}
                        </p>
                        <p className="text-lg font-mono font-medium mt-1">
                          {formatInTimezone(session.date_start, timezone, 'h:mm a')}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `${status.color}15`,
                            color: status.color,
                          }}
                        >
                          {status.label}
                        </span>
                        {isPast ? (
                          <CheckCircle2 className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Clock className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}

function TimelineSkeleton() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="h-10 bg-muted rounded w-64 mx-auto" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>
    </section>
  );
}
