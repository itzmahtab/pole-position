'use client';

import { useState, useEffect, useCallback } from 'react';
import { differenceInSeconds } from 'date-fns';
import type { CountdownTime } from '@/types/ui';

export function useCountdown(targetDate: string, timezone: string = 'UTC') {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
    isExpired: false,
  });

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = differenceInSeconds(target, now);

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0, isExpired: true };
    }

    return {
      days: Math.floor(diff / 86400),
      hours: Math.floor((diff % 86400) / 3600),
      minutes: Math.floor((diff % 3600) / 60),
      seconds: diff % 60,
      total: diff,
      isExpired: false,
    };
  }, [targetDate]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [calculateTimeLeft]);

  return timeLeft;
}
