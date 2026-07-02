'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BlurFadeProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  blur?: number;
}

export function BlurFade({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  blur = 10,
}: BlurFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
