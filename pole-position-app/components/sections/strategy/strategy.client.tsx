"use client";

import { useMemo } from "react";
import { useLiveSession } from "@/hooks/use-live-session";
import { useStints } from "@/hooks/use-stints";
import { GlassCard } from "@/components/shared/glass-card";
import { LiveStatusPill } from "@/components/shared/live-status-pill";
import type { Stint } from "@/types";

const COMPOUND_STYLE: Record<string, string> = {
  SOFT: "bg-racing-red/80 border-racing-red",
  MEDIUM: "bg-safety-yellow/80 border-safety-yellow",
  HARD: "bg-foreground/70 border-foreground",
  INTERMEDIATE: "bg-drs-green/70 border-drs-green",
  WET: "bg-electric-blue/70 border-electric-blue",
  UNKNOWN: "bg-muted border-muted-foreground",
};

const COMPOUND_LABEL: Record<string, string> = {
  SOFT: "Soft",
  MEDIUM: "Medium",
  HARD: "Hard",
  INTERMEDIATE: "Inter",
  WET: "Wet",
  UNKNOWN: "?",
};

interface DriverStints {
  driver_number: number;
  stints: Stint[];
}

export function StrategyClient() {
  const { sessionKey, isLive, meeting } = useLiveSession();
  const { stints, isLoading } = useStints(sessionKey);

  const { maxLap, drivers } = useMemo(() => {
    const all = stints ?? [];
    const byDriver = new Map<number, Stint[]>();
    let maxLap = 1;
    for (const s of all) {
      if (!byDriver.has(s.driver_number)) byDriver.set(s.driver_number, []);
      byDriver.get(s.driver_number)!.push(s);
      const end = s.end_lap ?? s.start_lap;
      if (end > maxLap) maxLap = end;
    }
    const list: DriverStints[] = Array.from(byDriver.entries())
      .map(([driver_number, stints]) => ({ driver_number, stints }))
      .sort((a, b) => a.driver_number - b.driver_number);
    return { maxLap, drivers: list };
  }, [stints]);

  if (isLoading && !isLive) return null;

  const legend = ["SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET"] as const;

  return (
    <section id="strategy" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Tyre Strategy
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Live stint-by-stint compound history per driver.
            </p>
          </div>
          {isLive ? (
            <LiveStatusPill status="live" label={sessionKey ? "LIVE" : "WAITING"} />
          ) : (
            <LiveStatusPill status="between" label="NO LIVE SESSION" />
          )}
        </div>

        {!isLive || !sessionKey ? (
          <GlassCard className="mt-10 flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl">
              🛞
            </span>
            <p className="text-sm text-muted-foreground">
              No live session right now. Tyre stints appear when a session is
              live.
            </p>
          </GlassCard>
        ) : drivers.length === 0 ? (
          <GlassCard className="mt-10 flex min-h-56 items-center justify-center p-8 text-sm text-muted-foreground">
            {meeting?.circuit_short_name
              ? `No stint data yet at ${meeting.circuit_short_name}.`
              : "No stint data yet."}
          </GlassCard>
        ) : (
          <GlassCard className="mt-10 p-5">
            <div className="mb-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {legend.map((c) => (
                <span key={c} className="flex items-center gap-1.5">
                  <span className={`h-3 w-6 rounded-sm border ${COMPOUND_STYLE[c]}`} />
                  {COMPOUND_LABEL[c]}
                </span>
              ))}
            </div>
            <div className="space-y-3">
              {drivers.map((d) => (
                <div
                  key={d.driver_number}
                  className="grid grid-cols-[3.5rem_1fr] items-center gap-3"
                >
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">
                    #{d.driver_number}
                  </span>
                  <div className="relative flex h-5 w-full items-center overflow-hidden rounded-sm bg-white/5">
                    {d.stints
                      .sort((a, b) => a.stint_number - b.stint_number)
                      .map((s) => {
                        const start = s.start_lap;
                        const end = s.end_lap ?? maxLap;
                        const left = (start / maxLap) * 100;
                        const width = ((end - start) / maxLap) * 100;
                        return (
                          <div
                            key={s.stint_number}
                            title={`Stint ${s.stint_number}: ${COMPOUND_LABEL[s.compound] ?? s.compound} · laps ${start}–${end}${s.tyre_age_at_start != null ? ` · age ${s.tyre_age_at_start}` : ""}`}
                            className={`flex h-full items-center justify-center rounded-[2px] border-y text-[10px] font-semibold text-black/80 ${COMPOUND_STYLE[s.compound] ?? COMPOUND_STYLE.UNKNOWN}`}
                            style={{ left: `${left}%`, width: `${Math.max(width, 2)}%` }}
                          />
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              Lap scale: 1 → {maxLap}
            </p>
          </GlassCard>
        )}
      </div>
    </section>
  );
}
