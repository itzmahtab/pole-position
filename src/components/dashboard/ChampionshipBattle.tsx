'use client';

import { useQuery } from '@tanstack/react-query';
import { getDriverStandings } from '@/lib/api/f1';
import { FadeIn } from '@/components/animations';
import { motion } from 'framer-motion';
import { TEAM_COLORS } from '@/lib/utils/constants';
import { hexToRgba } from '@/lib/utils/formatters';
import { Swords } from 'lucide-react';

export function ChampionshipBattle() {
  const { data: standings, isLoading } = useQuery({
    queryKey: ['driver-standings-battle'],
    queryFn: () => getDriverStandings(),
    staleTime: 300000,
  });

  const topTwo = standings?.slice(0, 2) || [];
  const maxPoints = topTwo[0]?.points || 1;
  const gap = topTwo.length === 2 ? topTwo[0].points - topTwo[1].points : 0;

  return (
    <section id="battle" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Championship <span className="text-gradient-primary">Battle</span>
            </h2>
            <p className="text-muted-foreground">Top contenders head-to-head</p>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="glass-card rounded-xl p-8 animate-pulse">
            <div className="h-8 bg-muted rounded w-1/2 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-1/3 mx-auto" />
          </div>
        ) : topTwo.length < 2 ? (
          <div className="glass-card rounded-xl p-8 text-center">
            <Swords className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Not enough data yet for a championship battle comparison.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topTwo.map((driver, index) => {
              const isLeader = index === 0;
              const barWidth = (driver.points / maxPoints) * 100;
              const teamColor = TEAM_COLORS[driver.constructor_name] || '#666';

              return (
                <motion.div
                  key={driver.driver_name}
                  className={`glass-card rounded-xl p-6 ${isLeader ? 'md:-translate-y-2' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-3xl font-black">{driver.positionText}</span>
                        {isLeader && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-yellow-500/20 text-yellow-400 rounded-full">
                            LEADER
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold">{driver.driver_name}</h3>
                      <p className="text-sm text-muted-foreground">{driver.constructor_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black">{driver.points}</p>
                      <p className="text-xs text-muted-foreground uppercase">Points</p>
                    </div>
                  </div>

                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: teamColor }}
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>{maxPoints}</span>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Wins</p>
                      <p className="font-bold">{driver.wins}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Podiums</p>
                      <p className="font-bold">{driver.podiums}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground">Gap</p>
                      <p className="font-bold">{isLeader ? `+${gap}` : `-${gap}`}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
