"use client";

import { useCountdown } from "@/hooks";
import { padZero } from "@/lib/time";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

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

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function FlipDigit({ value, label, glow, reducedMotion }: FlipDigitProps) {
  const display = padZero(value);
  const prev = usePrevious(display);
  const changed = prev !== undefined && prev !== display;
  const [flipping, setFlipping] = useState(false);

  useEffect(() => {
    if (changed) {
      setFlipping(true);
      const t = setTimeout(() => setFlipping(false), 500);
      return () => clearTimeout(t);
    }
  }, [changed]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (flipping && containerRef.current) {
      const card = containerRef.current;
      card.animate(
        [
          { transform: "rotateX(0deg)", filter: "brightness(1)" },
          { transform: "rotateX(-90deg)", filter: "brightness(2.2)" },
          { transform: "rotateX(-180deg)", filter: "brightness(1)" },
        ],
        { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }
  }, [flipping]);

  if (reducedMotion) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className={cn(
            "font-display flex h-[3.5rem] w-[2.5rem] items-center justify-center rounded-xl border border-border bg-elevated text-[2rem] font-bold text-foreground tabular-nums transition-opacity duration-150 sm:h-20 sm:w-14 sm:text-4xl",
            glow && "shadow-[var(--glow-red)] border-racing-red/30"
          )}
        >
          <span key={display}>{display}</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={containerRef}
        style={{ perspective: "400px" }}
        className={cn(
          "font-display relative flex h-[3.5rem] w-[2.5rem] items-center justify-center overflow-hidden rounded-xl border border-border bg-elevated text-[2rem] font-bold text-foreground tabular-nums sm:h-20 sm:w-14 sm:text-4xl",
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
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function FlipClock({ targetDate, className }: FlipClockProps) {
  const { days, hours, minutes, seconds, total } = useCountdown(targetDate);
  const reduced = useReducedMotion();
  const glow = total < 60 && total > 0;

  return (
    <div
      className={cn("flex items-start gap-2 sm:gap-4", className)}
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
        "mt-5 font-display text-[1.5rem] font-bold text-muted-foreground sm:mt-6 sm:text-3xl",
        reducedMotion && "animate-pulse"
      )}
    >
      :
    </span>
  );
}
