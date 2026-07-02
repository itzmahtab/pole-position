'use client';

import { useQuery } from '@tanstack/react-query';
import { getSeasonCalendar } from '@/lib/api/f1';
import { FadeIn } from '@/components/animations';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';

export function CircuitExplorer() {
  const { data, isLoading } = useQuery({
    queryKey: ['calendar-circuits', new Date().getFullYear()],
    queryFn: () => getSeasonCalendar(),
    staleTime: 3600000,
  });

  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  const races = data?.races || [];
  const selected = races.find((r) => r.round === selectedRound);

  if (isLoading) {
    return (
      <section id="circuits" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Circuit <span className="text-gradient-primary">Explorer</span>
              </h2>
              <p className="text-muted-foreground">Loading circuits...</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-muted rounded w-2/3 mb-3" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="circuits" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Circuit <span className="text-gradient-primary">Explorer</span>
            </h2>
            <p className="text-muted-foreground">
              {selected
                ? `${selected.circuit.circuit_name} — Round ${selected.round}`
                : 'Select a race to explore the circuit'}
            </p>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-2">
            {races.map((race) => (
              <button
                key={race.round}
                onClick={() => setSelectedRound(race.round)}
                className={`w-full text-left glass-card rounded-xl p-3 sm:p-4 transition-all ${selectedRound === race.round ? 'ring-1 ring-[#e10600]/50' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#e10600]/10 flex items-center justify-center text-xs font-bold text-[#e10600]">
                    {race.round}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{race.race_name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {race.circuit.circuit_name}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedRound === race.round ? 'rotate-90' : ''}`} />
                </div>
              </button>
            ))}
          </div>

          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {selected ? (
                <motion.div
                  key={selected.round}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-4 h-4 text-[#e10600]" />
                    <h3 className="font-bold text-lg">{selected.circuit.circuit_name}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                    <div>
                      <p className="text-muted-foreground text-xs uppercase">Location</p>
                      <p className="font-medium">
                        {selected.circuit.location}, {selected.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs uppercase">Race Date</p>
                      <p className="font-medium">{selected.date}</p>
                    </div>
                  </div>

                  <div className="h-48 rounded-lg bg-gradient-to-br from-[#e10600]/5 to-transparent flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#e10600]/10 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-[#e10600]" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Track map will appear here
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-xl p-6 flex items-center justify-center h-48"
                >
                  <p className="text-muted-foreground text-sm">
                    Select a circuit from the list to explore
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
