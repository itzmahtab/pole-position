'use client';

import { motion } from 'framer-motion';

export function LiveIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/30">
      <motion.div
        className="w-2 h-2 rounded-full bg-success"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <span className="text-xs font-semibold text-success uppercase tracking-wider">Live</span>
    </div>
  );
}
