"use client";

import { useState, useEffect } from "react";
import { usePreferences } from "@/store/preferences";
import { formatDate, getSessionTypeLabel } from "@/lib/time";
import { FlagIcon } from "@/components/shared/flag-icon";
import { GlowBadge } from "@/components/shared/glow-badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import type { LiveStatus } from "@/types";

interface StickyNavClientProps {
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

export function StickyNavClient({ liveStatus }: StickyNavClientProps) {
  const { timezone } = usePreferences();
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  const { state, meeting, session, nextSession } = liveStatus;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      setIsScrolledPastHero(scrollY > heroHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isVisible = isScrolledPastHero && !!(session || nextSession);
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
          <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6">
            {/* Left: Logo + Circuit */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-display text-xs font-bold uppercase tracking-[0.12em] text-racing-red sm:text-sm md:text-base md:tracking-[0.15em]">
                Pole Position
              </span>
              <span className="hidden text-muted-foreground sm:inline">|</span>
              <div className="hidden items-center gap-2 lg:flex">
                <FlagIcon country={meeting.country_name} size="sm" />
                <span className="text-xs text-muted-foreground">
                  {meeting.circuit_short_name}
                </span>
              </div>
            </div>

            {/* Center: Session info */}
            <div className="flex items-center gap-2 sm:gap-3">
              {isLive ? (
                <GlowBadge
                  variant="red"
                  className="animate-pulse-glow px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-[10px]"
                >
                  <span className="mr-1 inline-block h-1 w-1 rounded-full bg-racing-red animate-pulse-dot sm:mr-1.5 sm:h-1.5 sm:w-1.5" />
                  <span className="hidden sm:inline">LIVE — </span>
                  <span className="sm:hidden">LIVE</span>
                </GlowBadge>
              ) : session ? (
                <GlowBadge
                  variant="blue"
                  className="px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-[10px]"
                >
                  {getSessionTypeLabel(session.session_type as never)}
                </GlowBadge>
              ) : (
                <GlowBadge
                  variant="blue"
                  className="animate-pulse-glow px-2 py-0.5 text-[9px] sm:px-3 sm:py-1 sm:text-[10px]"
                >
                  Next
                </GlowBadge>
              )}

              <div className="hidden items-center gap-1.5 sm:flex sm:gap-2">
                <span className="text-[10px] font-semibold text-foreground sm:text-xs">
                  {getSessionTypeLabel(activeSession.session_type as never)}
                </span>
                <span className="text-[10px] text-muted-foreground sm:text-xs">
                  {formatDate(activeSession.date_start, timezone)} at{" "}
                  <span
                    className={cn(
                      isLive ? "text-racing-red" : "text-electric-blue",
                      "font-semibold"
                    )}
                  >
                    {formatTime12h(activeSession.date_start, timezone)}
                  </span>
                </span>
              </div>
            </div>

            {/* Right: Timezone */}
            <div className="hidden text-[10px] uppercase tracking-wider text-muted-foreground md:block">
              {timezone}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
