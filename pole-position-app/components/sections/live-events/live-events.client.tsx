"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveSession } from "@/hooks/use-live-session";
import { useRaceControlFeed } from "@/hooks/use-race-control";
import { GlassCard } from "@/components/shared/glass-card";
import { LiveStatusPill } from "@/components/shared/live-status-pill";
import { formatTime } from "@/lib/time";
import { usePreferences } from "@/store/preferences";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { RaceControlMessage } from "@/types";

type FlagVariant = "red" | "yellow" | "green" | "blue" | "purple" | "default";

const FLAG_COLOR: Record<string, FlagVariant> = {
  RED: "red",
  YELLOW: "yellow",
  "DOUBLE YELLOW": "yellow",
  GREEN: "green",
  CHECKERED: "default",
  BLUE: "blue",
  CLEAR: "green",
  DRS_ENABLED: "green",
  DRS_DISABLED: "default",
};

const FLAG_LABEL: Record<string, string> = {
  RED: "Red Flag",
  YELLOW: "Yellow Flag",
  "DOUBLE YELLOW": "Double Yellow",
  GREEN: "Green Flag",
  CHECKERED: "Chequered Flag",
  BLUE: "Blue Flag",
  CLEAR: "Track Clear",
  DRS_ENABLED: "DRS Enabled",
  DRS_DISABLED: "DRS Disabled",
};

const FLAG_CHIP: Record<string, string> = {
  red: "border-racing-red/50 bg-racing-red/15 text-racing-red",
  yellow: "border-safety-yellow/50 bg-safety-yellow/15 text-safety-yellow",
  green: "border-drs-green/50 bg-drs-green/15 text-drs-green",
  blue: "border-electric-blue/50 bg-electric-blue/15 text-electric-blue",
  purple: "border-purple-sector/50 bg-purple-sector/15 text-purple-sector",
  default: "border-white/15 bg-white/5 text-muted-foreground",
};

function flagLabel(msg: RaceControlMessage): string {
  if (msg.flag && FLAG_LABEL[msg.flag]) return FLAG_LABEL[msg.flag];
  if (FLAG_LABEL[msg.category]) return FLAG_LABEL[msg.category];
  return msg.category;
}

function flagVariant(msg: RaceControlMessage): FlagVariant {
  if (msg.flag && FLAG_COLOR[msg.flag]) return FLAG_COLOR[msg.flag];
  return FLAG_COLOR[msg.category] ?? "default";
}

function EventRow({
  msg,
  index,
  timezone,
}: {
  msg: RaceControlMessage;
  index: number;
  timezone: string;
}) {
  const variant = flagVariant(msg);
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.4) }}
      className="relative flex items-start gap-3 px-4 py-2.5"
    >
      <span
        className={cn(
          "mt-0.5 flex h-5 shrink-0 items-center rounded px-1.5 text-[9px] font-bold uppercase tracking-[0.15em]",
          FLAG_CHIP[variant]
        )}
      >
        {flagLabel(msg).split(" ")[0]}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug text-foreground">{msg.message}</p>
        <p className="mt-0.5 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
          {formatTime(msg.date, timezone)}
          {msg.lap_number != null ? ` · Lap ${msg.lap_number}` : ""}
        </p>
      </div>
    </motion.li>
  );
}

export function LiveEventsClient() {
  const { sessionKey, sessionType, isLive, meeting, state, isLoading } =
    useLiveSession();
  const { messages } = useRaceControlFeed(sessionKey);
  const { timezone } = usePreferences();
  const listRef = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  // Auto-scroll to latest message unless paused on hover.
  useEffect(() => {
    if (paused) return;
    const list = listRef.current;
    if (!list) return;
    const id = requestAnimationFrame(() => {
      list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [messages, paused]);

  if (isLoading && !isLive) return null;

  const liveMsgs = messages ?? [];

  return (
    <section id="live-events" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Race Control
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Flags, safety-car calls and timing messages as they happen.
            </p>
          </div>
          {isLive ? (
            <LiveStatusPill status="live" label={sessionType ?? "LIVE"} />
          ) : (
            <LiveStatusPill status="between" label="NO LIVE SESSION" />
          )}
        </div>

        {!isLive || !sessionKey ? (
          <GlassCard className="mt-10 flex min-h-56 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-2xl">
              🏁
            </span>
            <p className="text-sm text-muted-foreground">
              No live session right now. The race-control feed appears when a
              session goes live.
            </p>
            {state && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
                Current weekend state: {state}
              </p>
            )}
          </GlassCard>
        ) : (
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <GlassCard className="mt-10 overflow-hidden p-0">
              {liveMsgs.length === 0 ? (
                <div className="flex min-h-56 items-center justify-center p-8 text-sm text-muted-foreground">
                  {meeting?.circuit_short_name
                    ? `Live at ${meeting.circuit_short_name} — waiting for messages.`
                    : "Waiting for the first message…"}
                </div>
              ) : (
                <ul
                  ref={listRef}
                  aria-live="polite"
                  className="no-scrollbar h-[24rem] overflow-y-auto py-2"
              >
                {liveMsgs.map((m, i) => (
                  <EventRow key={m.date + i} msg={m} index={i} timezone={timezone} />
                ))}
              </ul>
            )}
            <div className="border-t border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {paused ? "Auto-scroll paused" : "Auto-scroll to latest"}
            </div>
            </GlassCard>
          </div>
        )}
      </div>
    </section>
  );
}
