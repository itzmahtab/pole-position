"use client";

import { useRaceWeekend } from "@/hooks/use-race-weekend";
import { useNow } from "@/hooks";
import { usePreferences } from "@/store/preferences";
import { formatTime, formatRelative, getSessionTypeLabel } from "@/lib/time";
import { LiveStatusPill } from "@/components/shared/live-status-pill";
import { GlowBadge } from "@/components/shared/glow-badge";
import { GlassCard } from "@/components/shared/glass-card";
import type { SessionSummary } from "@/types";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { differenceInMinutes, isPast } from "date-fns";

type SessionState = "live" | "upcoming" | "finished";

function sessionState(s: SessionSummary, now: Date): SessionState {
  const start = new Date(s.date_start);
  const end = new Date(s.date_end);
  if (start <= now && end >= now) return "live";
  if (start > now) return "upcoming";
  return "finished";
}

const TYPE_BADGE_VARIANT: Record<string, "red" | "blue" | "purple" | "default"> = {
  Race: "red",
  Qualifying: "purple",
  "Sprint Qualifying": "purple",
  Sprint: "blue",
  "Practice 1": "default",
  "Practice 2": "default",
  "Practice 3": "default",
};

function sessionRelativeLabel(s: SessionSummary, now: Date): string {
  const start = new Date(s.date_start);
  if (isPast(start)) {
    const mins = Math.round(differenceInMinutes(now, start));
    return mins <= 0 ? "starting now" : `${mins}m ago`;
  }
  return formatRelative(s.date_start);
}

function SessionCard({
  session,
  now,
  active,
  index,
}: {
  session: SessionSummary;
  now: Date;
  active: boolean;
  index: number;
}) {
  const { timezone } = usePreferences();
  const state = sessionState(session, now);
  const short = getSessionTypeLabel(session.session_type as never);
  const variant = TYPE_BADGE_VARIANT[session.session_type] ?? "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "200px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="relative flex-1 min-w-40"
    >
      {active && (
        <span className="absolute -inset-px rounded-2xl border border-racing-red/40 shadow-[var(--glow-red)]" />
      )}
      <GlassCard
        hover={!active}
        className={cn(
          "flex h-full flex-col p-4",
          active && "border-racing-red/40"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <GlowBadge variant={variant}>{short}</GlowBadge>
          {state === "live" ? (
            <LiveStatusPill status="live" />
          ) : state === "finished" ? (
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Done
            </span>
          ) : null}
        </div>

        <div className="mt-4">
          <div className="font-display text-2xl font-bold tabular-nums text-foreground">
            {formatTime(session.date_start, timezone)}
          </div>
          <div className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            {timezone}
          </div>
        </div>

        <div className="mt-auto pt-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-xs font-medium",
              state === "live"
                ? "text-racing-red"
                : state === "upcoming"
                  ? "text-electric-blue"
                  : "text-muted-foreground"
            )}
          >
            {state === "live" && (
              <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-racing-red" />
            )}
            {sessionRelativeLabel(session, now)}
          </span>
        </div>
      </GlassCard>
    </motion.div>
  );
}

export function WeekendTimelineClient() {
  const { meeting, session, isLoading } = useRaceWeekend();
  const now = useNow(15_000);
  const sessions = meeting?.sessions ?? [];

  if (isLoading && !meeting) return null;

  if (!meeting || sessions.length === 0) {
    return (
      <section className="relative py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Weekend schedule unavailable right now.
          </p>
        </div>
      </section>
    );
  }

  const activeKey = session?.session_key ?? null;

  return (
    <section id="weekend-timeline" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Weekend Timeline
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            All sessions at {meeting.meeting_official_name} — shown in your
            local time ({meeting.circuit_short_name}).
          </p>
        </div>

        <div className="mt-10 flex gap-3 overflow-x-auto pb-4 md:flex-wrap md:overflow-visible">
          {sessions.map((s, i) => (
            <SessionCard
              key={s.session_key ?? i}
              session={s}
              now={now}
              active={s.session_key === activeKey}
              index={i}
            />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-electric-blue" /> Upcoming
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-racing-red" />{" "}
            Live
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" /> Finished
          </span>
        </div>
      </div>
    </section>
  );
}
