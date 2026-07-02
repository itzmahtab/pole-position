'use client';

import { useQuery } from '@tanstack/react-query';
import { getSeasonCalendar } from '@/lib/api/f1';
import { FadeIn } from '@/components/animations';
import { motion } from 'framer-motion';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatInTimezone } from '@/lib/utils/date';
import { CalendarDays } from 'lucide-react';

export function SeasonTimeline() {
  const { data, isLoading } = useQuery({
    queryKey: ['calendar-timeline', new Date().getFullYear()],
    queryFn: () => getSeasonCalendar(),
    staleTime: 3600000,
  });

  const timezone = useSettingsStore((s) => s.timezone);
  const races = data?.races || [];
  const now = new Date();

  if (isLoading) {
    return (
      <section id="timeline" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16">
              Season <span className="text-gradient-primary">Timeline</span>
            </h2>
          </FadeIn>
          <div className="space-y-4 max-w-2xl mx-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="w-3 h-3 rounded-full bg-muted mt-1.5" />
                <div className="flex-1 glass-card rounded-xl p-4">
                  <div className="h-5 bg-muted rounded w-2/3 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="timeline" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Season <span className="text-gradient-primary">Timeline</span>
            </h2>
            <p className="text-muted-foreground">
              The {new Date().getFullYear()} season at a glance
            </p>
          </div>
        </FadeIn>

        <div className="max-w-2xl mx-auto relative">
          <div className="absolute left-[5px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#e10600] via-[#e10600]/50 to-transparent" />

          <div className="space-y-6">
            {races.map((race, index) => {
              const raceDate = new Date(race.date);
              const isPast = raceDate < now;
              const isNext =
                !isPast &&
                (index === 0 || new Date(races[index - 1]?.date || 0) < now);

              return (
                <motion.div
                  key={race.round}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-2 ring-2 ring-background ${
                        isNext
                          ? 'bg-[#e10600]'
                          : isPast
                          ? 'bg-muted-foreground/30'
                          : 'bg-muted-foreground/50'
                      }`}
                    />
                  </div>

                  <div
                    className={`flex-1 glass-card rounded-xl p-4 transition-all ${
                      isNext ? 'ring-1 ring-[#e10600]/30' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#e10600]">
                            R{race.round}
                          </span>
                          <h3 className="font-semibold text-sm">{race.race_name}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {race.circuit.circuit_name}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {formatInTimezone(race.date, timezone, 'MMM d')}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
