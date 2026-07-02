'use client';

import { useQuery } from '@tanstack/react-query';
import { getDriverStandings } from '@/lib/api/f1';
import { FadeIn } from '@/components/animations';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { TEAM_COLORS } from '@/lib/utils/constants';
import { hexToRgba } from '@/lib/utils/formatters';
import { Users, ArrowLeftRight } from 'lucide-react';

export function DriverComparison() {
  const { data: standings } = useQuery({
    queryKey: ['driver-standings-compare'],
    queryFn: () => getDriverStandings(),
    staleTime: 300000,
  });

  const drivers = standings || [];
  const [driverA, setDriverA] = useState(drivers[0]?.driver_name || '');
  const [driverB, setDriverB] = useState(drivers[1]?.driver_name || '');

  const a = drivers.find((d) => d.driver_name === driverA);
  const b = drivers.find((d) => d.driver_name === driverB);

  const statRows = [
    { label: 'Position', key: 'positionText' as const, format: (v: unknown) => `#${v}` },
    { label: 'Points', key: 'points' as const, format: (v: unknown) => String(v) },
    { label: 'Wins', key: 'wins' as const, format: (v: unknown) => String(v) },
    { label: 'Podiums', key: 'podiums' as const, format: (v: unknown) => String(v) },
  ];

  return (
    <section id="drivers-compare" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Driver <span className="text-gradient-primary">Comparison</span>
            </h2>
            <p className="text-muted-foreground">
              Compare two drivers&apos; season statistics
            </p>
          </div>
        </FadeIn>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <select
            value={driverA}
            onChange={(e) => setDriverA(e.target.value)}
            className="glass-card rounded-lg px-4 py-2.5 text-sm bg-muted border border-white/10 focus:border-[#e10600]/50 focus:outline-none min-w-[180px]"
          >
            <option value="">Select driver A</option>
            {drivers.map((d) => (
              <option key={d.driver_name} value={d.driver_name}>
                {d.driver_name}
              </option>
            ))}
          </select>

          <div className="flex-shrink-0">
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          </div>

          <select
            value={driverB}
            onChange={(e) => setDriverB(e.target.value)}
            className="glass-card rounded-lg px-4 py-2.5 text-sm bg-muted border border-white/10 focus:border-[#e10600]/50 focus:outline-none min-w-[180px]"
          >
            <option value="">Select driver B</option>
            {drivers.map((d) => (
              <option key={d.driver_name} value={d.driver_name}>
                {d.driver_name}
              </option>
            ))}
          </select>
        </div>

        {a && b ? (
          <motion.div
            className="glass-card rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 text-left font-semibold">{a.driver_name}</th>
                  <th className="p-4 text-center text-muted-foreground text-xs uppercase w-24">Stat</th>
                  <th className="p-4 text-right font-semibold">{b.driver_name}</th>
                </tr>
              </thead>
              <tbody>
                {statRows.map((row) => {
                  const valA = row.key === 'positionText' ? Number(a.positionText) : (a[row.key] as number);
                  const valB = row.key === 'positionText' ? Number(b.positionText) : (b[row.key] as number);
                  const higher =
                    !isNaN(valA) && !isNaN(valB)
                      ? valA > valB ? 'a' : valB > valA ? 'b' : 'tie'
                      : 'tie';

                  return (
                    <tr key={row.label} className="border-b border-white/5 last:border-0">
                      <td className={`p-4 text-center sm:text-left ${higher === 'a' ? 'text-[#00d084]' : ''}`}>
                        {row.format(valA)}
                      </td>
                      <td className="p-4 text-center text-muted-foreground text-xs uppercase">
                        {row.label}
                      </td>
                      <td className={`p-4 text-center sm:text-right ${higher === 'b' ? 'text-[#00d084]' : ''}`}>
                        {row.format(valB)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Select two drivers to compare their season statistics
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
