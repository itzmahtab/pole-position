"use client";

import { useState } from "react";
import { useLiveStandings } from "@/hooks/use-live-standings";
import { GlassCard } from "@/components/shared/glass-card";
import { TEAM_COLORS } from "@/lib/constants";
import { motion } from "motion/react";
import type { DriverStandingRaw, ConstructorStandingRaw } from "@/types";

type Standing = DriverStandingRaw | ConstructorStandingRaw;

function teamColorFor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? "#8B93A1";
}

function Pickers({
  options,
  selected,
  onChange,
  render,
}: {
  options: Standing[];
  selected: string;
  onChange: (id: string) => void;
  render: (o: Standing) => string;
}) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {options.slice(0, 6).map((o) => {
        const id = render(o);
        const active = id === selected;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
              active
                ? "border-accent bg-accent/10 text-accent"
                : "border-border bg-white/[0.02] text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
            }`}
          >
            {id}
          </button>
        );
      })}
    </div>
  );
}

function DiffBar({ a, b }: { a: number; b: number }) {
  const total = Math.max(a + b, 1);
  const aPct = (a / total) * 100;
  const bPct = (b / total) * 100;
  return (
    <div className="flex h-1.5 w-full items-center gap-1">
      <motion.div
        className="h-full rounded-l-full bg-accent"
        initial={{ width: 0 }}
        animate={{ width: `${aPct}%` }}
        transition={{ duration: 0.5 }}
      />
      <motion.div
        className="h-full rounded-r-full bg-muted-foreground/60"
        initial={{ width: 0 }}
        animate={{ width: `${bPct}%` }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

function CompareRow({
  label,
  a,
  b,
  unit,
  pct,
}: {
  label: string;
  a: number;
  b: number;
  unit?: string;
  pct?: boolean;
}) {
  const aWins = a > b;
  const bWins = b > a;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-3">
      <span
        className={`text-right font-mono text-lg tabular-nums ${
          aWins ? "font-bold text-accent" : "text-muted-foreground"
        }`}
      >
        {a}
        {unit}
      </span>
      <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </span>
      <span
        className={`font-mono text-lg tabular-nums ${
          bWins ? "font-bold text-accent" : "text-muted-foreground"
        }`}
      >
        {b}
        {unit}
      </span>
      {pct && (
        <div className="col-span-3 mt-1">
          <DiffBar a={a} b={b} />
        </div>
      )}
    </div>
  );
}

export function ComparisonClient() {
  const { drivers, constructors } = useLiveStandings();
  const [mode, setMode] = useState<"driver" | "constructor">("driver");

  const [driverIdA, setDriverIdA] = useState<string>("");
  const [driverIdB, setDriverIdB] = useState<string>("");
  const [ctorIdA, setCtorIdA] = useState<string>("");
  const [ctorIdB, setCtorIdB] = useState<string>("");

  const driverOptions = drivers ?? [];
  const ctorOptions = constructors ?? [];

  const driverA = driverOptions.find((d) => d.Driver.driverId === driverIdA);
  const driverB = driverOptions.find((d) => d.Driver.driverId === driverIdB);
  const ctorA = ctorOptions.find((c) => c.Constructor.constructorId === ctorIdA);
  const ctorB = ctorOptions.find((c) => c.Constructor.constructorId === ctorIdB);

  if ((!drivers || drivers.length === 0) && (!constructors || constructors.length === 0)) {
    return (
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Comparison data unavailable right now.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="comparison" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Comparison
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Head-to-head against championship standings.
          </p>
        </div>

        <div className="mt-6 flex gap-2">
          {(["driver", "constructor"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                mode === m
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {m === "driver" ? "Drivers" : "Constructors"}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <GlassCard className="p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Side A
            </h3>
            <div className="mt-3">
              <Pickers
                options={mode === "driver" ? driverOptions : ctorOptions}
                selected={mode === "driver" ? driverIdA : ctorIdA}
                onChange={(id) =>
                  mode === "driver" ? setDriverIdA(id) : setCtorIdA(id)
                }
                render={(o) =>
                  mode === "driver"
                    ? (o as DriverStandingRaw).Driver.driverId
                    : (o as ConstructorStandingRaw).Constructor.constructorId
                }
              />
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Side B
            </h3>
            <div className="mt-3">
              <Pickers
                options={mode === "driver" ? driverOptions : ctorOptions}
                selected={mode === "driver" ? driverIdB : ctorIdB}
                onChange={(id) =>
                  mode === "driver" ? setDriverIdB(id) : setCtorIdB(id)
                }
                render={(o) =>
                  mode === "driver"
                    ? (o as DriverStandingRaw).Driver.driverId
                    : (o as ConstructorStandingRaw).Constructor.constructorId
                }
              />
            </div>
          </GlassCard>
        </div>

        <GlassCard className="mt-6 p-5">
          {mode === "driver" ? (
            driverA && driverB ? (
              <div className="divide-y divide-white/5">
                <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                  <span className="flex items-center gap-2 text-sm font-medium text-accent">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: teamColorFor(
                          driverA.Constructors[0]?.constructorId ?? ""
                        ),
                      }}
                    />
                    {driverA.Driver.givenName} {driverA.Driver.familyName}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    vs
                  </span>
                  <span className="flex items-center justify-end gap-2 text-right text-sm font-medium text-muted-foreground">
                    {driverB.Driver.givenName} {driverB.Driver.familyName}
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: teamColorFor(
                          driverB.Constructors[0]?.constructorId ?? ""
                        ),
                      }}
                    />
                  </span>
                </div>
                <CompareRow label="Championship" a={driverA.position} b={driverB.position} />
                <CompareRow label="Points" a={Number(driverA.points)} b={Number(driverB.points)} pct />
                <CompareRow label="Wins" a={Number(driverA.wins)} b={Number(driverB.wins)} pct />
              </div>
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Pick one driver on each side to compare.
              </p>
            )
          ) : ctorA && ctorB ? (
            <div className="divide-y divide-white/5">
              <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                <span className="flex items-center gap-2 text-sm font-medium text-accent">
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{ backgroundColor: teamColorFor(ctorA.Constructor.constructorId) }}
                  />
                  {ctorA.Constructor.name}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  vs
                </span>
                <span className="flex items-center justify-end gap-2 text-right text-sm font-medium text-muted-foreground">
                  {ctorB.Constructor.name}
                  <span
                    className="h-2 w-2 rounded-sm"
                    style={{ backgroundColor: teamColorFor(ctorB.Constructor.constructorId) }}
                  />
                </span>
              </div>
              <CompareRow label="Championship" a={ctorA.position} b={ctorB.position} />
              <CompareRow label="Points" a={Number(ctorA.points)} b={Number(ctorB.points)} pct />
              <CompareRow label="Wins" a={Number(ctorA.wins)} b={Number(ctorB.wins)} pct />
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Pick one constructor on each side to compare.
            </p>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
