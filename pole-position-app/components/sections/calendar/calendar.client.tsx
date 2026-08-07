"use client";

import { useMemo, useState } from "react";
import { useSchedule } from "@/hooks/use-schedule";
import { useNow } from "@/hooks";
import { usePreferences } from "@/store/preferences";
import { formatDate, formatTime } from "@/lib/time";
import { FlagIcon } from "@/components/shared/flag-icon";
import { GlowBadge } from "@/components/shared/glow-badge";
import { GlassCard } from "@/components/shared/glass-card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { RaceRaw } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type StatusFilter = "all" | "upcoming" | "finished";

function raceDate(race: RaceRaw): Date {
  return new Date(`${race.date}T${race.time ?? "00:00:00Z"}`);
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function RaceCard({
  race,
  index,
  timezone,
}: {
  race: RaceRaw;
  index: number;
  timezone: string;
}) {
  const start = raceDate(race);
  const now = useNow();
  const upcoming = start.getTime() > now.getTime();
  const isNext = upcoming && start.getTime() - now.getTime() < 14 * 24 * 3600 * 1000;
  const country = race.Circuit.Location.country;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: (index % 6) * 0.04 }}
      className="relative"
    >
      {isNext && (
        <span className="absolute -inset-px rounded-2xl border border-electric-blue/40 shadow-[var(--glow-green)]" />
      )}
      <GlassCard
        hover
        className={cn("flex h-full flex-col p-5", isNext && "border-electric-blue/40")}
      >
        <div className="flex items-start justify-between gap-3">
          <FlagIcon country={country} size="md" />
          <span className="font-display text-lg font-bold tabular-nums text-foreground/70">
            {race.round.padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-display mt-4 text-base font-semibold leading-snug text-foreground">
          {race.raceName}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {race.Circuit.circuitName}
        </p>

        <div className="mt-auto pt-4">
          <div className="text-sm font-semibold tabular-nums text-foreground">
            {formatDate(start.toISOString(), timezone)}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            <span>{formatTime(start.toISOString(), timezone)}</span>
            {upcoming ? (
              <GlowBadge variant="blue">Upcoming</GlowBadge>
            ) : (
              <GlowBadge>Finished</GlowBadge>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function CalendarClient() {
  const { races, isLoading } = useSchedule();
  const { timezone } = usePreferences();
  const now = useNow();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [month, setMonth] = useState<string>("all");

  const monthOptions = useMemo(() => {
    if (!races) return [];
    const set = new Set(races.map((r) => MONTHS[raceDate(r).getMonth()]));
    return ["all", ...Array.from(set)];
  }, [races]);

  const filtered = useMemo(() => {
    if (!races) return [];
    const ts = now.getTime();
    return races
      .filter((r) => {
        const start = raceDate(r);
        if (month !== "all" && MONTHS[start.getMonth()] !== month) return false;
        if (status === "upcoming" && start.getTime() <= ts) return false;
        if (status === "finished" && start.getTime() > ts) return false;
        return true;
      })
      .sort(
        (a, b) => raceDate(a).getTime() - raceDate(b).getTime()
      );
  }, [races, month, status, now]);

  return (
    <section id="calendar" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Season Calendar
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            The full race calendar — every session converted to your timezone
            ({timezone}).
          </p>
        </div>

        {isLoading && !races ? (
          <CalendarSkeletonGrid />
        ) : !races || races.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">
            Season calendar unavailable right now.
          </p>
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-4">
          <ToggleGroup
            aria-label="Filter by status"
            size="sm"
            variant="outline"
            multiple={false}
            value={[status]}
            onValueChange={(v) =>
              setStatus((Array.isArray(v) ? v[0] : v) as StatusFilter)
            }
          >
            <ToggleGroupItem value="all" aria-label="All races">All</ToggleGroupItem>
            <ToggleGroupItem value="upcoming" aria-label="Upcoming races">Upcoming</ToggleGroupItem>
            <ToggleGroupItem value="finished" aria-label="Finished races">Finished</ToggleGroupItem>
          </ToggleGroup>

          <div className="flex flex-wrap gap-1">
            {monthOptions.map((m) => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors",
                  month === m
                    ? "border-racing-red/50 bg-racing-red/10 text-racing-red"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                )}
              >
                {m === "all" ? "All" : m}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r, i) => (
            <RaceCard key={r.round} race={r} index={i} timezone={timezone} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">
            No races match the current filters.
          </p>
        )}
          </>
        )}
      </div>
    </section>
  );
}

function CalendarSkeletonGrid() {
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-elevated" />
      ))}
    </div>
  );
}
