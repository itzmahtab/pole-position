"use client";

import { useState } from "react";
import { useHistoricalSeason } from "@/hooks/use-historical";
import { GlassCard } from "@/components/shared/glass-card";
import { TEAM_COLORS } from "@/lib/constants";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { HistoricalSeason } from "@/types";

const PALETTE = [
  "#E10600",
  "#2C8CFF",
  "#00D26A",
  "#FFD400",
  "#C724F5",
  "#FF8C00",
  "#FF87BC",
  "#64C4FF",
  "#52E252",
  "#FF5C5C",
];

function teamColorFor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? "#8B93A1";
}

interface FastestLapEntry {
  round: string;
  raceName: string;
  driverId: string;
  name: string;
  constructorId: string;
  time: string;
  lap: string;
}

function collectFastestLaps(season: HistoricalSeason): FastestLapEntry[] {
  const entries: FastestLapEntry[] = [];
  for (const race of season.races) {
    if (!race.Results || race.Results.length === 0) continue;
    const fl = race.Results.filter((r) => r.FastestLap).sort(
      (a, b) => Number(a.FastestLap?.rank) - Number(b.FastestLap?.rank)
    )[0];
    if (!fl?.FastestLap) continue;
    entries.push({
      round: race.round,
      raceName: race.raceName,
      driverId: fl.Driver.driverId,
      name: `${fl.Driver.givenName} ${fl.Driver.familyName}`,
      constructorId: fl.Constructor.constructorId,
      time: fl.FastestLap.Time.time,
      lap: fl.FastestLap.lap,
    });
  }
  return entries;
}

interface ProgressionPoint {
  round: string;
  raceName: string;
  [driverId: string]: string | number;
}

function buildProgression(season: HistoricalSeason, topN: number): {
  points: ProgressionPoint[];
  series: string[];
} {
  const cumulative = new Map<string, number>();
  const points: ProgressionPoint[] = [];
  const driverName = new Map<string, string>();

  for (const race of season.races) {
    if (!race.Results || race.Results.length === 0) continue;
    for (const r of race.Results) {
      cumulative.set(r.Driver.driverId, (cumulative.get(r.Driver.driverId) ?? 0) + Number(r.points));
      if (!driverName.has(r.Driver.driverId)) {
        driverName.set(r.Driver.driverId, `${r.Driver.givenName} ${r.Driver.familyName}`);
      }
    }
    const pt: ProgressionPoint = { round: race.round, raceName: race.raceName };
    for (const [id, pts] of cumulative) pt[id] = pts;
    points.push(pt);
  }

  const series = Array.from(cumulative.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([id]) => id);

  return { points, series };
}

function FastestLapsTable({ season }: { season: HistoricalSeason }) {
  const entries = collectFastestLaps(season);
  if (entries.length === 0) return null;
  return (
    <GlassCard className="p-5">
      <h3 className="font-display text-lg font-semibold text-foreground">
        Fastest Laps
      </h3>
      <div className="mt-4 space-y-0.5">
        {entries.map((e) => (
          <div
            key={e.round}
            className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5"
          >
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              R{e.round}
            </span>
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: teamColorFor(e.constructorId) }}
                aria-hidden
              />
              <span className="truncate text-sm font-medium text-foreground">{e.name}</span>
              <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                {e.raceName}
              </span>
            </div>
            <span className="font-mono text-sm tabular-nums text-foreground">{e.time}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function ProgressionChart({ season }: { season: HistoricalSeason }) {
  const { points, series } = buildProgression(season, 6);
  if (points.length === 0 || series.length === 0) return null;
  return (
    <GlassCard className="p-5">
      <h3 className="font-display text-lg font-semibold text-foreground">
        Championship Battle
      </h3>
      <div className="mt-4 h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
            <XAxis
              dataKey="round"
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,0.1)" }}
            />
            <YAxis
              stroke="var(--text-muted)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-elevated)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelFormatter={(_, payload) =>
                payload?.length ? `${payload[0].payload.raceName}` : ""
              }
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            {series.map((id, i) => {
              const driver = season.races
                .flatMap((r) => r.Results ?? [])
                .find((r) => r.Driver.driverId === id);
              const constructorId = driver?.Constructor.constructorId ?? "";
              return (
                <Line
                  key={id}
                  type="monotone"
                  dataKey={id}
                  name={`${driver?.Driver.code ?? id} (${constructorId})`}
                  stroke={teamColorFor(constructorId) || PALETTE[i % PALETTE.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export function StatisticsClient() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const [year, setYear] = useState<number>(currentYear);

  const { data: season } = useHistoricalSeason(year);

  return (
    <section id="statistics" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Statistics
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Season-long fastest laps and championship points progression.
            </p>
          </div>
          <div className="flex gap-2">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`rounded-full border px-4 py-1.5 font-mono text-sm tabular-nums transition-colors ${
                  year === y
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>

        {!season || season.races.length === 0 ? (
          <GlassCard className="mt-10 flex min-h-40 items-center justify-center p-8 text-sm text-muted-foreground">
            Statistics unavailable for {year}.
          </GlassCard>
        ) : (
          <div className="mt-10 space-y-6">
            <ProgressionChart season={season} />
            <FastestLapsTable season={season} />
          </div>
        )}
      </div>
    </section>
  );
}
