import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountdown } from '@/hooks/useCountdown';

describe('useCountdown', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should calculate time remaining correctly', () => {
    const targetDate = new Date(Date.now() + 86400000 + 3600000 + 60000 + 1000).toISOString();
    const { result } = renderHook(() => useCountdown(targetDate, 'UTC'));

    expect(result.current.days).toBe(1);
    expect(result.current.hours).toBe(1);
    expect(result.current.minutes).toBe(1);
    expect(result.current.isExpired).toBe(false);
  });

  it('should update every second', () => {
    const targetDate = new Date(Date.now() + 60000).toISOString();
    const { result } = renderHook(() => useCountdown(targetDate, 'UTC'));

    expect(result.current.seconds).toBe(60);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.seconds).toBe(59);
  });

  it('should report expired when time is up', () => {
    const targetDate = new Date(Date.now() - 1000).toISOString();
    const { result } = renderHook(() => useCountdown(targetDate, 'UTC'));

    expect(result.current.isExpired).toBe(true);
    expect(result.current.total).toBe(0);
  });
});
