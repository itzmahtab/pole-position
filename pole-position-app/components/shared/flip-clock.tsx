"use client";

import { useCountdown } from "@/hooks";
import { useMotionEnabled } from "@/hooks/use-motion-enabled";
import { padZero } from "@/lib/time";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";

interface FlipClockProps {
  targetDate: string | null;
  className?: string;
}

interface FlipDigitProps {
  value: number;
  label: string;
  glow: boolean;
  reducedMotion: boolean;
}

function FlipDigit({ value, label, glow, reducedMotion }: FlipDigitProps) {
  const display = padZero(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef(display);

  useEffect(() => {
    const card = containerRef.current;
    if (reducedMotion || !card || prevRef.current === display) return;
    prevRef.current = display;
    card.animate(
      [
        { transform: "rotateX(0deg)", filter: "brightness(1)" },
        { transform: "rotateX(-90deg)", filter: "brightness(2.2)" },
        { transform: "rotateX(-180deg)", filter: "brightness(1)" },
      ],
      { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  }, [display, reducedMotion]);

  if (reducedMotion) {
    return (
      <div className="flex flex-col items-center gap-1.5 sm:gap-2">
        <div
          className={cn(
            "font-display flex h-[2.8rem] w-[2rem] items-center justify-center rounded-lg border border-border bg-elevated text-[1.5rem] font-bold text-foreground tabular-nums transition-opacity duration-150 sm:h-20 sm:w-14 sm:rounded-xl sm:text-4xl",
            glow && "shadow-[var(--glow-red)] border-racing-red/30"
          )}
        >
          <span key={display}>{display}</span>
        </div>
        <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px] sm:tracking-[0.25em]">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1.5 sm:gap-2">
      <div
        ref={containerRef}
        style={{ perspective: "400px" }}
        className={cn(
          "font-display relative flex h-[2.8rem] w-[2rem] items-center justify-center overflow-hidden rounded-lg border border-border bg-elevated text-[1.5rem] font-bold text-foreground tabular-nums sm:h-20 sm:w-14 sm:rounded-xl sm:text-4xl",
          glow && "border-racing-red/30 shadow-[var(--glow-red)]"
        )}
      >
        <span
          key={display}
          className="absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
        >
          {display}
        </span>
        {/* hairline split for flip illusion */}
        <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-border/50" />
      </div>
      <span className="text-[8px] uppercase tracking-[0.2em] text-muted-foreground sm:text-[10px] sm:tracking-[0.25em]">
        {label}
      </span>
    </div>
  );
}

export function FlipClock({ targetDate, className }: FlipClockProps) {
  const { days, hours, minutes, seconds, total } = useCountdown(targetDate);
  const enabled = useMotionEnabled();
  const reduced = !enabled;
  const glow = total < 60 && total > 0;

  return (
    <div
      className={cn("flex items-start gap-1.5 sm:gap-4", className)}
      role="timer"
      aria-label={`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds until session`}
    >
      <FlipDigit
        value={days}
        label="Days"
        glow={glow}
        reducedMotion={!!reduced}
      />
      <DigitSeparator reducedMotion={!!reduced} />
      <FlipDigit
        value={hours}
        label="Hours"
        glow={glow}
        reducedMotion={!!reduced}
      />
      <DigitSeparator reducedMotion={!!reduced} />
      <FlipDigit
        value={minutes}
        label="Min"
        glow={glow}
        reducedMotion={!!reduced}
      />
      <DigitSeparator reducedMotion={!!reduced} />
      <FlipDigit
        value={seconds}
        label="Sec"
        glow={glow}
        reducedMotion={!!reduced}
      />
    </div>
  );
}

function DigitSeparator({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "mt-3 font-display text-[1.2rem] font-bold text-muted-foreground sm:mt-6 sm:text-3xl",
        reducedMotion && "animate-pulse"
      )}
    >
      :
    </span>
  );
}
