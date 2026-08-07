"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { useMotionEnabled } from "@/hooks/use-motion-enabled";

// Rolls a number up from 0 to `value` when the element is ~50% in view.
// Falls back to showing the final value immediately when motion is off.
const DURATION_MS = 900;

export function AnimatedCounter({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const enabled = useMotionEnabled();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const animate = enabled && inView;
  const [display, setDisplay] = useState<number | null>(null);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animate, value]);

  return (
    <span ref={ref} className={className}>
      {display ?? value}
    </span>
  );
}
