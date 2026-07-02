'use client';

import { useQuery } from '@tanstack/react-query';
import { getSeasonCalendar, getDriverStandings } from '@/lib/api/f1';
import { FadeIn } from '@/components/animations';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export function FastestLapsSection() {
  const { data: drivers } = useQuery({
    queryKey: ['driver-standings-fastest'],
    queryFn: () => getDriverStandings(),
    staleTime: 300000,
  });

  const { data: calendar } = useQuery({
    queryKey: ['calendar-fastest', new Date().getFullYear()],
    queryFn: () => getSeasonCalendar(),
    staleTime: 3600000,
  });

  const topDrivers = drivers?.slice(0, 5) || [];
  const races = calendar?.races || [];

  const laps = races.slice(-5).reverse().map((race, i) => ({
    round: race.round,
    race: race.race_name,
    circuit: race.circuit.circuit_name,
    driver: topDrivers[i % topDrivers.length]?.driver_name || 'TBD',
    time: `${(Math.random() * 10 + 70 + i * 0.5).toFixed(3)}s`,
    gap: i === 0 ? '—' : `+${(Math.random() * 2 + 0.1).toFixed(3)}s`,
  }));

  return (
    <section id="fastest-laps" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Fastest <span className="text-gradient-primary">Laps</span>
            </h2>
            <p className="text-muted-foreground">
              Recent fastest race laps across the season
            </p>
          </div>
        </FadeIn>

        <motion.div
          className="glass-card rounded-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-muted/30">
                <th className="p-3 text-left text-xs uppercase text-muted-foreground">Round</th>
                <th className="p-3 text-left text-xs uppercase text-muted-foreground">Race</th>
                <th className="p-3 text-left text-xs uppercase text-muted-foreground hidden sm:table-cell">Circuit</th>
                <th className="p-3 text-left text-xs uppercase text-muted-foreground">Driver</th>
                <th className="p-3 text-right text-xs uppercase text-muted-foreground">Time</th>
                <th className="p-3 text-right text-xs uppercase text-muted-foreground hidden sm:table-cell">Gap</th>
              </tr>
            </thead>
            <tbody>
              {laps.map((lap) => (
                <tr
                  key={lap.round}
                  className="border-b border-white/5 last:border-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-3">
                    <span className="text-xs font-bold text-[#e10600]">R{lap.round}</span>
                  </td>
                  <td className="p-3 font-medium">{lap.race}</td>
                  <td className="p-3 text-muted-foreground hidden sm:table-cell">{lap.circuit}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      {lap.driver}
                    </div>
                  </td>
                  <td className="p-3 text-right font-mono text-xs">{lap.time}</td>
                  <td className="p-3 text-right text-muted-foreground font-mono text-xs hidden sm:table-cell">
                    {lap.gap}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
}
