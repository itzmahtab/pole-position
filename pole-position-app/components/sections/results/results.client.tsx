"use client";

import { useMemo, useState } from "react";
import { useSchedule } from "@/hooks/use-schedule";
import {
  useRaceResults,
  useQualifyingResults,
  useSprintResults,
} from "@/hooks/use-results";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowBadge } from "@/components/shared/glow-badge";
import { TEAM_COLORS } from "@/lib/constants";
import { useNow } from "@/hooks";
import { motion } from "motion/react";
import type { RaceResultRaw, QualifyingResultRaw } from "@/types";

type SessionTab = "race" | "qualifying" | "sprint";

function teamColorFor(constructorId: string): string {
  return TEAM_COLORS[constructorId] ?? "#8B93A1";
}

type StatusKind = "finished" | "dnf" | "dns" | "dsq" | "lapped";

function statusKind(status: string): StatusKind {
  const s = status.toLowerCase();
  if (s.includes("finished")) return "finished";
  if (s.includes("disqualified")) return "dsq";
  if (s.includes("did not start") || s.includes("did not qualify")) return "dns";
  if (s.includes("lap")) return "lapped";
  return "dnf";
}

const STATUS_BADGE: Record<StatusKind, { label: string; variant: "red" | "yellow" | "default" }> = {
  finished: { label: "FIN", variant: "default" },
  lapped: { label: "LAP", variant: "default" },
  dnf: { label: "DNF", variant: "red" },
  dns: { label: "DNS", variant: "yellow" },
  dsq: { label: "DSQ", variant: "red" },
};

function RaceRow({ r, index }: { r: RaceResultRaw; index: number }) {
  const color = teamColorFor(r.Constructor.constructorId);
  const kind = statusKind(r.status);
  const dnf = kind === "dnf" || kind === "dns" || kind === "dsq";
  const badge = STATUS_BADGE[kind];
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.25) }}
      className={`grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5 ${
        dnf ? "opacity-70" : ""
      }`}
    >
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {dnf ? r.positionText : r.position}
      </span>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <span className="truncate text-sm font-medium text-foreground">
          {r.Driver.givenName} {r.Driver.familyName}
        </span>
        <span className="hidden truncate text-xs text-muted-foreground sm:inline">
          {r.Constructor.name}
        </span>
        <GlowBadge variant={badge.variant}>{badge.label}</GlowBadge>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden font-mono text-xs text-muted-foreground sm:inline">
          G{r.grid}
        </span>
        <span className="font-mono text-sm tabular-nums text-foreground">
          {r.points}
        </span>
      </div>
    </motion.div>
  );
}

function QualifyingRow({ q, index }: { q: QualifyingResultRaw; index: number }) {
  const color = teamColorFor(q.Constructor.constructorId);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.25) }}
      className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-white/5"
    >
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {q.position}
      </span>
      <div className="flex min-w-0 items-center gap-2">
        <span
          className="h-2 w-2 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <span className="truncate text-sm font-medium text-foreground">
          {q.Driver.givenName} {q.Driver.familyName}
        </span>
      </div>
      <span className="font-mono text-sm tabular-nums text-muted-foreground">
        {q.Q3 ?? q.Q2 ?? q.Q1 ?? "—"}
      </span>
    </motion.div>
  );
}

export function ResultsClient() {
  const { races } = useSchedule();
  const now = useNow(60_000);
  const [tab, setTab] = useState<SessionTab>("race");
  const [round, setRound] = useState<number | null>(null);

  const roundOptions = useMemo(
    () => (races ?? []).map((r) => ({ round: Number(r.round), name: r.raceName, date: r.date })),
    [races]
  );

  const defaultRound = useMemo(() => {
    if (round !== null) return round;
    if (roundOptions.length === 0) return null;
    const past = roundOptions
      .filter((r) => new Date(r.date).getTime() <= now.getTime())
      .sort((a, b) => b.round - a.round);
    return past[0]?.round ?? roundOptions[0].round;
  }, [round, roundOptions, now]);

  const activeRound = round ?? defaultRound;
  const activeRace = roundOptions.find((r) => r.round === activeRound);

  const raceQuery = useRaceResults(null, activeRound);
  const qualiQuery = useQualifyingResults(null, activeRound);
  const sprintQuery = useSprintResults(null, activeRound);

  const activeData = tab === "race" ? raceQuery.data : tab === "qualifying" ? qualiQuery.data : sprintQuery.data;
  const loading = tab === "race" ? raceQuery.isLoading : tab === "qualifying" ? qualiQuery.isLoading : sprintQuery.isLoading;

  const tabs: { id: SessionTab; label: string }[] = [
    { id: "race", label: "Race" },
    { id: "qualifying", label: "Qualifying" },
    { id: "sprint", label: "Sprint" },
  ];

  return (
    <section id="results" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Results
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Race, qualifying and sprint classifications for each round of the season.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full border px-4 py-1.5 text-sm capitalize transition-colors ${
                  tab === t.id
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          {activeRace && (
            <span className="text-sm text-muted-foreground">
              R{activeRace.round} · {activeRace.name}
            </span>
          )}
        </div>

        {roundOptions.length > 0 && (
          <div className="no-scrollbar mt-4 flex gap-1.5 overflow-x-auto pb-1">
            {roundOptions.map((r) => (
              <button
                key={r.round}
                type="button"
                onClick={() => setRound(r.round)}
                className={`shrink-0 rounded-md border px-2.5 py-1 font-mono text-xs tabular-nums transition-colors ${
                  activeRound === r.round
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                R{r.round}
              </button>
            ))}
          </div>
        )}

        <GlassCard className="mt-6 p-4">
          {loading && !activeData ? (
            <div className="flex min-h-48 items-center justify-center">
              <span className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
            </div>
          ) : !activeData || activeData.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No {tab} data available for round {activeRound}.
            </p>
          ) : tab === "qualifying" ? (
            <div className="space-y-0.5">
              {(activeData as QualifyingResultRaw[]).map((q, i) => (
                <QualifyingRow key={q.Driver.driverId} q={q} index={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-0.5">
              {(activeData as RaceResultRaw[]).map((r, i) => (
                <RaceRow key={r.Driver.driverId} r={r} index={i} />
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </section>
  );
}
