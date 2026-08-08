"use client";

import { useLiveStandings } from "@/hooks/use-live-standings";
import { GlowBadge } from "@/components/shared/glow-badge";
import { GlassCard } from "@/components/shared/glass-card";
import { TEAM_COLORS } from "@/lib/constants";
import { motion } from "motion/react";
import type { DriverStandingRaw, ConstructorStandingRaw } from "@/types";

function teamColorFor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? "#8B93A1";
}

function DriverRow({ d, index }: { d: DriverStandingRaw; index: number }) {
  const team = d.Constructors[0];
  const color = teamColorFor(team?.constructorId ?? "");
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
      className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5"
    >
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {d.position}
      </span>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <span className="truncate text-sm font-medium text-foreground">
          {d.Driver.givenName} {d.Driver.familyName}
        </span>
        <span className="hidden truncate text-xs text-muted-foreground sm:inline">
          {team?.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {Number(d.wins) > 0 && (
          <GlowBadge variant="yellow">{d.wins}W</GlowBadge>
        )}
        <span className="font-mono w-14 text-right text-sm tabular-nums text-foreground">
          {d.points}
        </span>
      </div>
    </motion.div>
  );
}

function ConstructorRow({ c, index }: { c: ConstructorStandingRaw; index: number }) {
  const color = teamColorFor(c.Constructor.constructorId);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
      className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/5"
    >
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {c.position}
      </span>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="h-2.5 w-2.5 shrink-0 rounded-sm"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <span className="truncate text-sm font-medium text-foreground">
          {c.Constructor.name}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {Number(c.wins) > 0 && <GlowBadge variant="yellow">{c.wins}W</GlowBadge>}
        <span className="font-mono w-14 text-right text-sm tabular-nums text-foreground">
          {c.points}
        </span>
      </div>
    </motion.div>
  );
}

export function ChampionshipClient() {
  const { drivers, constructors, isLoading } = useLiveStandings();

  if (isLoading && !drivers && !constructors) return null;

  if ((!drivers || drivers.length === 0) && (!constructors || constructors.length === 0)) {
    return (
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Championship standings unavailable right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="championship" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Championship
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Current drivers&apos; and constructors&apos; championship standings.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-5">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Drivers
              </h3>
            </div>
            <div className="space-y-0.5">
              {(drivers ?? []).slice(0, 10).map((d, i) => (
                <DriverRow key={d.Driver.driverId} d={d} index={i} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-foreground">
                Constructors
              </h3>
            </div>
            <div className="space-y-0.5">
              {(constructors ?? []).map((c, i) => (
                <ConstructorRow key={c.Constructor.constructorId} c={c} index={i} />
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
