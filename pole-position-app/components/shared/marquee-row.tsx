"use client";

import { motion } from "motion/react";
import { useMotionEnabled } from "@/hooks/use-motion-enabled";
import { cn } from "@/lib/utils";

interface MarqueeRowProps {
  items: string[];
  speed?: number;
  className?: string;
  separator?: React.ReactNode;
}

export function MarqueeRow({
  items,
  speed = 40,
  className,
  separator,
}: MarqueeRowProps) {
  const enabled = useMotionEnabled();
  const sep = separator ?? (
    <span className="h-1 w-1 rounded-full bg-primary" />
  );

  return (
    <div
      className={cn(
        "relative flex overflow-hidden border-y border-white/10 bg-black/40 py-4 backdrop-blur",
        className
      )}
    >
      {enabled ? (
        <motion.div
          className="flex shrink-0 gap-12 pr-12 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        >
          {[...items, ...items, ...items, ...items].map((s, i) => (
            <span key={i} className="flex items-center gap-4">
              {s}
              {sep}
            </span>
          ))}
        </motion.div>
      ) : (
        <div className="flex shrink-0 gap-12 pr-12 text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {items.map((s, i) => (
            <span key={i} className="flex items-center gap-4">
              {s}
              {sep}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
