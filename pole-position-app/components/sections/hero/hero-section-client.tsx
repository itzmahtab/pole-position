"use client";

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
import type { LiveStatus } from "@/types";

interface HeroSectionClientProps {
  liveStatus: LiveStatus;
}

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

export function HeroSectionClient({ liveStatus }: HeroSectionClientProps) {
  const { timezone } = usePreferences();
  const { state, meeting, session, nextSession } = liveStatus;

  if (!meeting) {
    return (
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        <p className="text-sm text-muted-foreground">
          Race data unavailable. Check back soon.
        </p>
      </section>
    );
  }

  const targetDate =
    session?.date_start ?? nextSession?.date_start ?? meeting.date_start;
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
        <div className="flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-16 sm:px-6">
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
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1,
              }}
              className="mt-6 flex items-center gap-2 sm:mt-8 sm:gap-3"
            >
              <FlagIcon country={meeting.country_name} size="lg" />
              <h2 className="font-display text-base font-semibold uppercase tracking-[0.2em] text-foreground sm:text-lg sm:tracking-[0.3em] md:text-xl">
                {meeting.circuit_short_name}
              </h2>
            </motion.div>

            {/* Track SVG */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="mt-4 h-20 w-44 text-foreground sm:mt-6 sm:h-28 sm:w-64 md:h-28 md:w-64"
            >
              <TrackSvg
                trackId={trackId}
                animated
                className="drop-shadow-[0_0_18px_rgba(44,140,255,0.25)]"
              />
            </motion.div>

            {/* Race name — animated gradient text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.2,
              }}
              className="hero-gradient-text font-display mt-4 text-[8vw] font-bold leading-[0.9] tracking-tight sm:mt-6 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              {meeting.meeting_official_name}
            </motion.h1>

            {/* Session meta — highlighted next session callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-4 w-full px-2 sm:mt-5 sm:px-0"
            >
              {session ? (
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <GlowBadge
                    variant="blue"
                    className="px-3 py-1 text-[10px] sm:px-4 sm:py-1.5 sm:text-xs"
                  >
                    {getSessionTypeLabel(session.session_type as never)}
                  </GlowBadge>
                  <p className="text-xs text-muted-foreground sm:text-sm md:text-base">
                    {formatDate(session.date_start, timezone)} at{" "}
                    <span className="hero-time-highlight font-bold text-racing-red">
                      {formatTime12h(session.date_start, timezone)}
                    </span>{" "}
                    <span className="hidden sm:inline">{timezone}</span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 sm:hidden">
                    {timezone}
                  </p>
                </div>
              ) : nextSession ? (
                <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                  <GlowBadge
                    variant="red"
                    className="animate-pulse-glow px-3 py-1 text-[10px] sm:px-4 sm:py-1.5 sm:text-xs"
                  >
                    Next Session
                  </GlowBadge>
                  <div className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-2">
                    <span className="text-xs font-bold text-electric-blue sm:text-sm">
                      {getSessionTypeLabel(nextSession.session_type as never)}
                    </span>
                    <span className="hidden text-muted-foreground sm:inline">
                      ·
                    </span>
                    <span className="text-xs text-muted-foreground sm:text-sm">
                      {formatDate(nextSession.date_start, timezone)} at{" "}
                      <span className="hero-time-highlight font-bold text-racing-red">
                        {formatTime12h(nextSession.date_start, timezone)}
                      </span>
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 sm:hidden">
                    {timezone}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 sm:gap-0.5">
                  <p className="text-xs text-muted-foreground sm:text-sm md:text-base">
                    {formatDate(meeting.date_start, timezone)} at{" "}
                    <span className="hero-time-highlight font-bold text-racing-red">
                      {formatTime12h(meeting.date_start, timezone)}
                    </span>
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 sm:hidden">
                    {timezone}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Countdown or LIVE pulse */}
            {showCountdown ? (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4,
                }}
                className="mt-6 sm:mt-10"
              >
                <FlipClock targetDate={targetDate} />
              </motion.div>
            ) : isLive ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className={cn(
                  "mt-8 font-display text-2xl font-bold uppercase tracking-[0.3em] text-racing-red sm:mt-12 sm:text-3xl md:text-5xl"
                )}
              >
                <span className="inline-flex items-center gap-2 sm:gap-3">
                  <span className="h-2 w-2 animate-pulse-dot rounded-full bg-racing-red sm:h-3 sm:w-3" />
                  Race in Progress
                </span>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:mt-12 sm:text-sm md:tracking-[0.3em]"
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
