"use client";

import { useRaceWeekend } from "@/hooks/use-race-weekend";
import { usePreferences } from "@/store/preferences";
import { formatDate, getSessionTypeLabel } from "@/lib/time";
import { LiveStatusPill } from "@/components/shared/live-status-pill";
import { FlagIcon } from "@/components/shared/flag-icon";
import { FlipClock } from "@/components/shared/flip-clock";
import { TrackSvg, type TrackId } from "@/components/shared/track-svg";
import { ScrollFrameAnimation } from "./scroll-frame-animation";
import { GlowBadge } from "@/components/shared/glow-badge";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

/**
 * Format time in 12-hour format with AM/PM
 */
function formatTime12h(utcDate: string, tz: string): string {
  const date = new Date(utcDate);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

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
        <HeroSkeleton />
      </section>
    );
  }

  if (isError || !meeting) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
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
    <>
      {/* Scroll-based frame animation as the hero backdrop */}
      <ScrollFrameAnimation />

      {/* Hero content overlay — pinned to first viewport */}
      <section
        className="pointer-events-none relative z-10"
        style={{ marginTop: "-600vh" }}
      >
        <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-16">
          <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            {/* Live status badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto"
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

            {/* Race name — animated gradient text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="hero-gradient-text font-display mt-6 text-[10vw] font-bold leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl"
            >
              {meeting.meeting_official_name}
            </motion.h1>

            {/* Session meta — highlighted next session callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-5"
            >
              {session ? (
                <div className="flex flex-col items-center gap-2">
                  <GlowBadge variant="blue" className="px-4 py-1.5 text-xs">
                    {getSessionTypeLabel(session.session_type as never)}
                  </GlowBadge>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    {formatDate(session.date_start, timezone)} at{" "}
                    <span className="font-semibold text-electric-blue">
                      {formatTime12h(session.date_start, timezone)}
                    </span>{" "}
                    {timezone}
                  </p>
                </div>
              ) : nextSession ? (
                <div className="flex flex-col items-center gap-2">
                  <GlowBadge variant="blue" className="animate-pulse-glow px-4 py-1.5 text-xs">
                    Next Session
                  </GlowBadge>
                  <p className="text-sm sm:text-base">
                    <span className="font-bold text-electric-blue">
                      {getSessionTypeLabel(nextSession.session_type as never)}
                    </span>
                    <span className="mx-2 text-muted-foreground">·</span>
                    <span className="text-muted-foreground">
                      {formatDate(nextSession.date_start, timezone)} at{" "}
                      <span className="font-semibold text-foreground">
                        {formatTime12h(nextSession.date_start, timezone)}
                      </span>{" "}
                      {timezone}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground sm:text-base">
                  {formatDate(meeting.date_start, timezone)} at{" "}
                  {formatTime12h(meeting.date_start, timezone)} {timezone}
                </p>
              )}
            </motion.div>

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
        </div>
      </section>
    </>
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
