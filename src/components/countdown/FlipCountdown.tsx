'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { useSettingsStore } from '@/stores/settingsStore';
import { motion, AnimatePresence } from 'framer-motion';

interface FlipCountdownProps {
  targetDate: string;
  className?: string;
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const digits = value.toString().padStart(2, '0').split('');

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex gap-1">
        {digits.map((digit, i) => (
          <div
            key={i}
            className="relative w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 bg-card rounded-lg overflow-hidden border border-border"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={digit}
                initial={{ y: -40, opacity: 0, rotateX: -90 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                exit={{ y: 40, opacity: 0, rotateX: 90 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex items-center justify-center text-2xl sm:text-3xl md:text-4xl font-bold font-mono text-foreground"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {digit}
              </motion.span>
            </AnimatePresence>

            <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          </div>
        ))}
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

export function FlipCountdown({ targetDate, className = '' }: FlipCountdownProps) {
  const { timezone } = useSettingsStore();
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate, timezone);

  if (isExpired) {
    return (
      <div className={`text-center ${className}`}>
        <span className="text-2xl font-bold text-success">Race Started!</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center gap-3 sm:gap-4 md:gap-6 ${className}`}>
      <FlipUnit value={days} label="Days" />
      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-muted-foreground -mt-6">:</span>
      <FlipUnit value={hours} label="Hours" />
      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-muted-foreground -mt-6">:</span>
      <FlipUnit value={minutes} label="Minutes" />
      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-muted-foreground -mt-6">:</span>
      <FlipUnit value={seconds} label="Seconds" />
    </div>
  );
}
