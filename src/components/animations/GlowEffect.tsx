'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlowEffectProps {
  children: ReactNode;
  color?: string;
  intensity?: number;
  pulse?: boolean;
  className?: string;
}

export function GlowEffect({
  children,
  color = '#e10600',
  intensity = 0.4,
  pulse = true,
  className = '',
}: GlowEffectProps) {
  return (
    <motion.div
      className={className}
      animate={
        pulse
          ? {
              boxShadow: [
                `0 0 20px -5px ${color}${Math.round(intensity * 255)
                  .toString(16)
                  .padStart(2, '0')}`,
                `0 0 40px -5px ${color}${Math.round(intensity * 1.5 * 255)
                  .toString(16)
                  .padStart(2, '0')}`,
                `0 0 20px -5px ${color}${Math.round(intensity * 255)
                  .toString(16)
                  .padStart(2, '0')}`,
              ],
            }
          : undefined
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        boxShadow: !pulse
          ? `0 0 30px -5px ${color}${Math.round(intensity * 255)
              .toString(16)
              .padStart(2, '0')}`
          : undefined,
      }}
    >
      {children}
    </motion.div>
  );
}
