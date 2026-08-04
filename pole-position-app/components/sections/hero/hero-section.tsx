"use client";

import { useRaceWeekend } from "@/hooks/use-race-weekend";
import { usePreferences } from "@/store/preferences";
import { formatTime, formatDate, getSessionTypeLabel } from "@/lib/time";
import { LiveStatusPill } from "@/components/shared/live-status-pill";
import { FlagIcon } from "@/components/shared/flag-icon";
import { FlipClock } from "@/components/shared/flip-clock";
import { TrackSvg, type TrackId } from "@/components/shared/track-svg";
import { HeroBackground } from "./hero-background";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

function resolveTrackId(name: string): TrackId {
  const n = name.toLowerCase();
  if (n.includes("monaco")) return "monaco";
  if (n.includes("silverstone") || n.includes("british")) return "silverstone";
  if (n.includes("suzuka") || n.includes("japan")) return "suzuka";
  if (n.includes("spa") || n.includes("belgium")) return "spa";
  if (n.includes("monza") || n.includes("italy")) return "monza";
  if (n.includes("bahrain")) return "bahrain";
  return "generic";
}

export function HeroSection() {
  const {
    state,
    meeting,
    session,
    nextSession,
    isLoading,
    isError,
  } = useRaceWeekend();
  const { timezone } = usePreferences();

  if (isLoading && !meeting) {
    return (
      <section className="relative min-h-screen overflow-hidden">
        <HeroBackground />
        <HeroSkeleton />
      </section>
    );
  }

  if (isError || !meeting) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        <HeroBackground />
        <p className="text-sm text-muted-foreground">
          Race data unavailable. Check back soon.
        </p>
      </section>
    );
  }

  const targetDate = session?.date_start ?? nextSession?.date_start ?? meeting.date_start;
  const showCountdown = state === "upcoming" || state === "between";
  const trackId = resolveTrackId(meeting.circuit_short_name);
  const isLive = state === "live";

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-16">
      <HeroBackground />

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        {/* Live status badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <LiveStatusPill status={state ?? "upcoming"} />
        </motion.div>

        {/* Circuit */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mt-8 flex items-center gap-3"
        >
          <FlagIcon country={meeting.country_name} size="lg" />
          <h2 className="font-display text-lg font-semibold uppercase tracking-[0.3em] text-foreground sm:text-xl">
            {meeting.circuit_short_name}
          </h2>
        </motion.div>

        {/* Track SVG */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-6 h-24 w-56 text-foreground sm:h-28 sm:w-64"
        >
          <TrackSvg trackId={trackId} animated className="drop-shadow-[0_0_18px_rgba(44,140,255,0.25)]" />
        </motion.div>

        {/* Race name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="font-display mt-6 text-[10vw] font-bold leading-[0.9] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          {meeting.meeting_official_name}
        </motion.h1>

        {/* Session meta */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-4 text-sm text-muted-foreground sm:text-base"
        >
          {session ? (
            <>
              <span className="font-semibold text-foreground">
                {getSessionTypeLabel(session.session_type as never)}
              </span>
              {" · "}
              {formatDate(session.date_start, timezone)} at{" "}
              {formatTime(session.date_start, timezone)} {timezone}
            </>
          ) : nextSession ? (
            <>
              Next:{" "}
              <span className="font-semibold text-foreground">
                {getSessionTypeLabel(nextSession.session_type as never)}
              </span>
              {" · "}
              {formatDate(nextSession.date_start, timezone)} at{" "}
              {formatTime(nextSession.date_start, timezone)} {timezone}
            </>
          ) : (
            `${formatDate(meeting.date_start, timezone)} at ${formatTime(meeting.date_start, timezone)} ${timezone}`
          )}
        </motion.p>

        {/* Countdown or LIVE pulse */}
        {showCountdown ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="mt-10"
          >
            <FlipClock targetDate={targetDate} />
          </motion.div>
        ) : isLive ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={cn("mt-12 font-display text-3xl font-bold uppercase tracking-[0.4em] text-racing-red sm:text-5xl")}
          >
            <span className="inline-flex items-center gap-3">
              <span className="h-3 w-3 animate-pulse-dot rounded-full bg-racing-red" />
              Race in Progress
            </span>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-sm uppercase tracking-[0.3em] text-muted-foreground"
          >
            Weekend complete
          </motion.p>
        )}
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        aria-hidden
      >
        <div className="h-10 w-6 rounded-full border border-border">
          <div className="mx-auto mt-2 h-2 w-1 animate-bounce rounded-full bg-muted-foreground" />
        </div>
      </motion.div>
    </section>
  );
}

function HeroSkeleton() {
  return (
    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
      <div className="h-6 w-32 animate-pulse rounded-full bg-elevated" />
      <div className="mt-8 flex items-center gap-3">
        <div className="h-6 w-10 animate-pulse rounded bg-elevated" />
        <div className="h-5 w-44 animate-pulse rounded bg-elevated" />
      </div>
      <div className="mt-6 h-24 w-56 animate-pulse rounded bg-elevated sm:h-28 sm:w-64" />
      <div className="mt-6 h-16 w-72 animate-pulse rounded-xl bg-elevated sm:h-20 sm:w-96" />
      <div className="mt-4 h-4 w-52 animate-pulse rounded bg-elevated" />
      <div className="mt-10 flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 w-14 animate-pulse rounded-xl bg-elevated" />
        ))}
      </div>
    </div>
  );
}
