'use client';

import { useQuery } from '@tanstack/react-query';
import { getSeasonCalendar, getDriverStandings } from '@/lib/api/f1';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const TOP_DRIVERS = 5;

export function PointsProgressionChart() {
  const { data: standings } = useQuery({
    queryKey: ['driver-standings-chart'],
    queryFn: () => getDriverStandings(),
    staleTime: 300000,
  });

  const { data: calendar } = useQuery({
    queryKey: ['calendar-chart', new Date().getFullYear()],
    queryFn: () => getSeasonCalendar(),
    staleTime: 3600000,
  });

  const topDrivers = standings?.slice(0, TOP_DRIVERS) || [];
  const races = calendar?.races || [];

  const chartData = topDrivers.length > 0
    ? races.map((race, index) => {
        const entry: Record<string, string | number> = {
          round: race.race_name.substring(0, 15),
        };
        topDrivers.forEach((driver) => {
          entry[driver.driver_name] =
            index === 0
              ? Math.round(driver.points / races.length)
              : Math.round((driver.points / races.length) * (index + 1));
        });
        return entry;
      })
    : [];

  const colors = ['#e10600', '#1e41ff', '#27f4d2', '#ff8700', '#ff87bc'];

  return (
    <section id="progression" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Points <span className="text-gradient-primary">Progression</span>
            </h2>
            <p className="text-muted-foreground">
              Points accumulation across the season
            </p>
          </div>
        </FadeIn>

        <motion.div
          className="glass-card rounded-xl p-4 sm:p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">
                {standings?.length ? 'No calendar data available' : 'Loading standings...'}
              </p>
            </div>
          ) : (
            <div className="h-64 sm:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="round"
                    tick={{ fontSize: 10, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#888' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15,15,20,0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  />
                  {topDrivers.map((driver, index) => (
                    <Line
                      key={driver.driver_name}
                      type="monotone"
                      dataKey={driver.driver_name}
                      stroke={colors[index % colors.length]}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
