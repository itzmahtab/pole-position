'use client';

import { useQuery } from '@tanstack/react-query';
import { getSeasonCalendar } from '@/lib/api/f1';
import { FadeIn, StaggerContainer } from '@/components/animations';
import { StaggerItem } from '@/components/animations/StaggerContainer';
import { motion } from 'framer-motion';
import { formatInTimezone } from '@/lib/utils/date';
import { useSettingsStore } from '@/stores/settingsStore';
import { CalendarDays, Clock, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function CalendarSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['calendar', new Date().getFullYear()],
    queryFn: () => getSeasonCalendar(),
    staleTime: 3600000,
  });

  const timezone = useSettingsStore((s) => s.timezone);
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  if (isLoading) {
    return (
      <section id="calendar" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Season <span className="text-gradient-primary">Calendar</span>
              </h2>
              <p className="text-muted-foreground">Loading calendar data...</p>
            </div>
          </FadeIn>
          <div className="grid gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const races = data?.races || [];

  return (
    <section id="calendar" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {new Date().getFullYear()} <span className="text-gradient-primary">Calendar</span>
            </h2>
            <p className="text-muted-foreground">
              {races.length} races across the Formula 1 season
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-3">
          {races.map((race) => {
            const isExpanded = expandedRound === race.round;
            const raceDate = new Date(race.date);
            const isPast = raceDate < new Date();
            const isThisWeek =
              Math.abs(raceDate.getTime() - Date.now()) < 7 * 24 * 60 * 60 * 1000;

            return (
              <StaggerItem key={race.round}>
                <motion.div
                  className={`glass-card rounded-xl overflow-hidden transition-colors ${isPast ? 'opacity-60' : ''} ${isThisWeek ? 'ring-1 ring-[#e10600]/50' : ''}`}
                >
                  <button
                    onClick={() => setExpandedRound(isExpanded ? null : race.round)}
                    className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#e10600]/10 flex items-center justify-center font-bold text-sm text-[#e10600]">
                      {race.round}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base truncate">{race.race_name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {race.circuit.location ? `${race.circuit.location}, ` : ''}{race.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {formatInTimezone(race.date, timezone, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-muted-foreground">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-white/5"
                    >
                      <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs uppercase mb-1">Circuit</p>
                          <p className="font-medium">{race.circuit.circuit_name}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase mb-1">Country</p>
                          <p className="font-medium">{race.country}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase mb-1">Race Date</p>
                          <p className="font-medium">
                            {formatInTimezone(race.date, timezone, 'EEEE, MMM d, yyyy')}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs uppercase mb-1">Round</p>
                          <p className="font-medium">{race.round} of {races.length}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
