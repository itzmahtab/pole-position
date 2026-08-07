"use client";

import { useMemo, useState } from "react";
import { useHistoricalSeason } from "@/hooks/use-historical";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowBadge } from "@/components/shared/glow-badge";
import { TEAM_COLORS } from "@/lib/constants";
import { motion } from "motion/react";
import type { HistoricalSeason, RaceResultRaw } from "@/types";

function teamColorFor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? "#8B93A1";
}

function winnerOf(results: RaceResultRaw[] | undefined): RaceResultRaw | null {
  return results?.find((r) => r.position === "1" || r.positionText === "1") ?? null;
}

function fastestLapOf(results: RaceResultRaw[] | undefined): {
  name: string;
  time: string;
} | null {
  const fl = results
    ?.filter((r) => r.FastestLap)
    .sort((a, b) => Number(a.FastestLap?.rank) - Number(b.FastestLap?.rank))[0];
  return fl?.FastestLap ? { name: `${fl.Driver.givenName} ${fl.Driver.familyName}`, time: fl.FastestLap.Time.time } : null;
}

interface TrackRecord {
  circuit: string;
  locality: string;
  bestTime: string;
  driver: string;
  year: string;
}

export function HistoricalClient() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const [year, setYear] = useState<number>(currentYear - 1);

  const a = useHistoricalSeason(year);
  const b = useHistoricalSeason(currentYear);
  const c = useHistoricalSeason(currentYear - 2);

  const seasons = useMemo(() => {
    const list: HistoricalSeason[] = [];
    for (const s of [a.data, b.data, c.data]) {
      if (s && s.races.length > 0) list.push(s);
    }
    return list;
  }, [a.data, b.data, c.data]);

  const winners = useMemo(() => {
    const season = a.data;
    if (!season || season.races.length === 0) return [];
    return season.races
      .filter((r) => (r.Results?.length ?? 0) > 0)
      .map((r) => ({ race: r, winner: winnerOf(r.Results) }));
  }, [a.data]);

  const records = useMemo(() => {
    const map = new Map<string, TrackRecord>();
    for (const season of seasons) {
      for (const race of season.races) {
        const fl = fastestLapOf(race.Results);
        if (!fl) continue;
        const key = `${race.Circuit.circuitId}`;
        const existing = map.get(key);
        if (!existing || parseFloat(fl.time.replace(":", ".")) < parseFloat(existing.bestTime.replace(":", "."))) {
          map.set(key, {
            circuit: race.Circuit.circuitName,
            locality: race.Circuit.Location.locality,
            bestTime: fl.time,
            driver: fl.name,
            year: season.season,
          });
        }
      }
    }
    return Array.from(map.values()).sort((x, y) => x.locality.localeCompare(y.locality));
  }, [seasons]);

  return (
    <section id="history" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              History
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Season winners and fastest-lap track records.
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

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-5">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Race Winners — {year}
            </h3>
            <div className="mt-4 space-y-0.5">
              {winners.length === 0 && (
                <p className="py-6 text-sm text-muted-foreground">
                  No results yet for {year}.
                </p>
              )}
              {winners.map(({ race, winner }, i) => (
                <motion.div
                  key={race.round}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.25) }}
                  className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5"
                >
                  <span className="font-mono text-xs tabular-nums text-muted-foreground">
                    R{race.round}
                  </span>
                  <div className="flex min-w-0 items-center gap-2">
                    {winner && (
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: teamColorFor(winner.Constructor.constructorId) }}
                        aria-hidden
                      />
                    )}
                    <span className="truncate text-sm text-foreground">
                      {winner
                        ? `${winner.Driver.givenName} ${winner.Driver.familyName}`
                        : race.raceName}
                    </span>
                    {winner && (
                      <GlowBadge variant="yellow">{winner.Constructor.name}</GlowBadge>
                    )}
                  </div>
                  <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                    {race.raceName}
                  </span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="font-display text-lg font-semibold text-foreground">
              Track Records
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Fastest race lap per circuit across {currentYear - 2}–{currentYear}.
            </p>
            <div className="mt-4 space-y-0.5">
              {records.length === 0 && (
                <p className="py-6 text-sm text-muted-foreground">
                  Records unavailable right now.
                </p>
              )}
              {records.map((r, i) => (
                <motion.div
                  key={r.circuit}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.3) }}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-sm text-foreground">{r.locality}</span>
                    <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                      {r.driver}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm tabular-nums text-foreground">
                      {r.bestTime}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                      {r.year}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
