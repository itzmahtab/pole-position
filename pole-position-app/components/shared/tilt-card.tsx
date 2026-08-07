"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useFinePointer, useMotionEnabled } from "@/hooks/use-motion-enabled";

// 3D tilt card: rotates up to 6° rotateX/rotateY toward the cursor on
// desktop pointer devices only. Disabled on touch and when motion is off.
const MAX_TILT = 6;

export function TiltCard({
  children,
  className,
  maxTilt = MAX_TILT,
}: {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const enabled = useMotionEnabled();
  const fine = useFinePointer();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useTransform(px, [0, 1], [maxTilt, -maxTilt]);
  const ry = useTransform(py, [0, 1], [-maxTilt, maxTilt]);
  const srx = useSpring(rx, { stiffness: 260, damping: 20 });
  const sry = useSpring(ry, { stiffness: 260, damping: 20 });

  const active = enabled && fine;

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const onMouseLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: active ? srx : 0, rotateY: active ? sry : 0 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
