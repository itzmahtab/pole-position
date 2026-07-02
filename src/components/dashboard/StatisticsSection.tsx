'use client';

import { useQuery } from '@tanstack/react-query';
import { getSeasonCalendar } from '@/lib/api/f1';
import { FadeIn, CountUp } from '@/components/animations';
import { Flag, Trophy, Users, Crosshair, Gauge, Timer } from 'lucide-react';
import { motion } from 'framer-motion';

export function StatisticsSection() {
  const { data } = useQuery({
    queryKey: ['calendar', new Date().getFullYear()],
    queryFn: () => getSeasonCalendar(),
    staleTime: 3600000,
  });

  const races = data?.races || [];

  const stats = [
    {
      icon: Flag,
      label: 'Races',
      value: races.length,
      suffix: '',
    },
    {
      icon: Trophy,
      label: 'Championship Leaders',
      value: 2,
      suffix: '',
    },
    {
      icon: Users,
      label: 'Drivers',
      value: 20,
      suffix: '',
    },
    {
      icon: Gauge,
      label: 'Teams',
      value: 10,
      suffix: '',
    },
    {
      icon: Timer,
      label: 'Sprint Races',
      value: 6,
      suffix: '',
    },
    {
      icon: Crosshair,
      label: 'Continents',
      value: 5,
      suffix: '',
    },
  ];

  return (
    <section id="statistics" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Season <span className="text-gradient-primary">Statistics</span>
            </h2>
            <p className="text-muted-foreground">
              Key numbers from the {new Date().getFullYear()} Formula 1 season
            </p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <FadeIn key={stat.label}>
              <motion.div
                className="glass-card rounded-xl p-5 text-center"
                whileHover={{ scale: 1.05, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-10 h-10 rounded-full bg-[#e10600]/10 flex items-center justify-center mx-auto mb-3">
                  <stat.icon className="w-5 h-5 text-[#e10600]" />
                </div>
                <p className="text-2xl sm:text-3xl font-black mb-1">
                  <CountUp value={stat.value} />
                  {stat.suffix}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
