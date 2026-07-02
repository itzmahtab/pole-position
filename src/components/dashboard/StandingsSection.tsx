'use client';

import { motion } from 'framer-motion';
import { useLiveStandings } from '@/hooks/useLiveStandings';
import { FadeIn } from '@/components/animations/FadeIn';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { CountUp } from '@/components/animations/CountUp';
import { formatPosition } from '@/lib/utils/formatters';
import type { DriverStanding, ConstructorStanding } from '@/types';
import { TEAM_COLORS } from '@/lib/utils/constants';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Image from 'next/image';

interface StandingsSectionProps {
  type: 'drivers' | 'constructors';
}

export function StandingsSection({ type }: StandingsSectionProps) {
  const { drivers, constructors } = useLiveStandings();
  const data = type === 'drivers' ? drivers : constructors;
  const isLoading = type === 'drivers' ? drivers.isLoading : constructors.isLoading;

  if (isLoading) return <StandingsSkeleton type={type} />;

  const standings = data.data || [];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              {type === 'drivers' ? 'Driver' : 'Constructor'} {' '}
              <span className="text-gradient-primary">Standings</span>
            </h2>
            <p className="text-muted-foreground">
              {new Date().getFullYear()} FIA Formula One World Championship
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="space-y-3">
          {standings.map((item, index) => {
            const isTop3 = index < 3;
            const driverItem = type === 'drivers' ? (item as DriverStanding) : null;
            const constructorItem = type === 'constructors' ? (item as ConstructorStanding) : null;
            const teamColor =
              type === 'drivers'
                ? driverItem!.team_colour
                : TEAM_COLORS[constructorItem!.constructor_name] || '#666';

            return (
              <StaggerItem key={item.position}>
                <motion.div
                  className={`relative glass-card rounded-xl p-4 sm:p-6 ${isTop3 ? 'border-l-4' : ''}`}
                  style={{ borderLeftColor: isTop3 ? teamColor : 'transparent' }}
                  whileHover={{ scale: 1.02, x: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <div className="w-12 text-center">
                      <span
                        className={`text-2xl font-black ${isTop3 ? 'text-gradient-primary' : 'text-muted-foreground'}`}
                      >
                        {formatPosition(item.position)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        {type === 'drivers' && driverItem && (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
                            <Image
                              src={driverItem.headshot_url || '/default-avatar.png'}
                              alt={driverItem.driver_name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg truncate">
                            {type === 'drivers'
                              ? driverItem!.driver_name
                              : constructorItem!.constructor_name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {type === 'drivers'
                              ? driverItem!.constructor_name
                              : constructorItem!.nationality}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs uppercase">Wins</p>
                        <p className="font-bold">{item.wins}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground text-xs uppercase">Podiums</p>
                        <p className="font-bold">
                          {type === 'drivers' ? driverItem!.podiums || '-' : '-'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <CountUp
                        value={item.points}
                        className="text-2xl sm:text-3xl font-black text-gradient"
                      />
                      <p className="text-xs text-muted-foreground uppercase">PTS</p>
                    </div>
                  </div>

                  <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: teamColor }}
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${(item.points / (standings[0]?.points || 1)) * 100}%`,
                      }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.5,
                        ease: [0.16, 1, 0.3, 1],
                        delay: index * 0.05,
                      }}
                    />
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

function StandingsSkeleton({ type }: { type: 'drivers' | 'constructors' }) {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="h-10 bg-muted rounded w-64 mx-auto mb-16" />
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded" />
        ))}
      </div>
    </section>
  );
}
