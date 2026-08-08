"use client";

import { useState, useEffect } from "react";
import { useRaceWeekend } from "@/hooks/use-race-weekend";
import { usePreferences } from "@/store/preferences";
import { formatDate, getSessionTypeLabel } from "@/lib/time";
import { FlagIcon } from "@/components/shared/flag-icon";
import { GlowBadge } from "@/components/shared/glow-badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

function formatTime12h(utcDate: string, tz: string): string {
  const date = new Date(utcDate);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function StickyNav() {
  const { state, meeting, session, nextSession, isLoading } = useRaceWeekend();
  const { timezone } = usePreferences();
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsScrolledPastHero(scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isScrolledPastHero && (session || nextSession) && !isLoading) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isScrolledPastHero, session, nextSession, isLoading]);

  const activeSession = session ?? nextSession;
  const isLive = state === "live";

  if (!meeting || !activeSession) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            {/* Left: Logo + Circuit */}
            <div className="flex items-center gap-3">
              <span className="font-display text-sm font-bold uppercase tracking-[0.15em] text-racing-red sm:text-base">
                Pole Position
              </span>
              <span className="hidden text-muted-foreground sm:inline">|</span>
              <div className="hidden items-center gap-2 sm:flex">
                <FlagIcon country={meeting.country_name} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {meeting.circuit_short_name}
                </span>
              </div>
            </div>

            {/* Center: Session info */}
            <div className="flex items-center gap-3">
              {isLive ? (
                <GlowBadge variant="red" className="animate-pulse-glow px-3 py-1 text-[10px]">
                  <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-racing-red animate-pulse-dot" />
                  LIVE — {getSessionTypeLabel(activeSession.session_type as never)}
                </GlowBadge>
              ) : session ? (
                <GlowBadge variant="blue" className="px-3 py-1 text-[10px]">
                  {getSessionTypeLabel(session.session_type as never)}
                </GlowBadge>
              ) : (
                <GlowBadge variant="blue" className="animate-pulse-glow px-3 py-1 text-[10px]">
                  Next
                </GlowBadge>
              )}

              <div className="flex flex-col items-end sm:flex-row sm:items-center sm:gap-2">
                <span className="text-xs font-semibold text-foreground">
                  {getSessionTypeLabel(activeSession.session_type as never)}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  {formatDate(activeSession.date_start, timezone)} at{" "}
                  <span className={cn(isLive ? "text-racing-red" : "text-electric-blue", "font-semibold")}>
                    {formatTime12h(activeSession.date_start, timezone)}
                  </span>
                </span>
              </div>
            </div>

            {/* Right: Timezone */}
            <div className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
              {timezone}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
