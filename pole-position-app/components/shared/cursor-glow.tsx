"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useFinePointer, useMotionEnabled } from "@/hooks/use-motion-enabled";

// Desktop-only glow that follows the pointer and intensifies over
// interactive zones. Pure transform/opacity — no layout impact.
export function CursorGlow() {
  const enabled = useMotionEnabled();
  const fine = useFinePointer();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 350, damping: 30, mass: 0.6 });
  const [overInteractive, setOverInteractive] = useState(false);

  const active = enabled && fine;

  useEffect(() => {
    if (!active) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as Element | null;
      setOverInteractive(
        !!target?.closest("a, button, [role='button'], [data-cursor], input, textarea")
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [active, x, y]);

  if (!active) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[60]"
    >
      <motion.div
        animate={{
          opacity: overInteractive ? 0.55 : 0.18,
          scale: overInteractive ? 2.2 : 1,
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-electric-blue/30 blur-3xl"
      />
    </motion.div>
  );
}
