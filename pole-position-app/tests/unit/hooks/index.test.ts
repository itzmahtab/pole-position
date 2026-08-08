import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  useCountdown,
  useTimezone,
  useLocalStorage,
  useNow,
  useSessionState,
} from "@/hooks";

describe("hooks/index", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("useCountdown", () => {
    it("returns zero parts without a target date", () => {
      const { result } = renderHook(() => useCountdown(null));
      expect(result.current).toEqual({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        total: 0,
      });
    });

    it("ticks every second and drift-corrects", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const { result } = renderHook(() => useCountdown("2026-01-01T00:00:05Z"));
      expect(result.current.total).toBe(5);
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(result.current.total).toBe(4);
    });

    it("clamps at zero once the target passes", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const { result } = renderHook(() => useCountdown("2026-01-01T00:00:02Z"));
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(result.current.total).toBe(0);
    });

    it("recomputes when the target changes", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const { result, rerender } = renderHook(
        ({ target }) => useCountdown(target),
        { initialProps: { target: "2026-01-01T00:00:10Z" } }
      );
      expect(result.current.total).toBe(10);
      rerender({ target: "2026-01-01T00:00:03Z" });
      expect(result.current.total).toBe(3);
    });
  });

  describe("useTimezone", () => {
    it("resolves the Intl timezone", () => {
      const { result } = renderHook(() => useTimezone());
      expect(typeof result.current.timezone).toBe("string");
      expect(typeof result.current.setTimezone).toBe("function");
    });

    it("can set a timezone", () => {
      const { result } = renderHook(() => useTimezone());
      act(() => {
        result.current.setTimezone("UTC+6");
      });
      expect(result.current.timezone).toBe("UTC+6");
    });
  });

  describe("useLocalStorage", () => {
    it("returns the initial value when nothing is stored", () => {
      const { result } = renderHook(() => useLocalStorage("k", { a: 1 }));
      expect(result.current[0]).toEqual({ a: 1 });
    });

    it("reads a stored JSON value", () => {
      localStorage.setItem("k", JSON.stringify({ b: 2 }));
      const { result } = renderHook(() => useLocalStorage("k", { a: 1 }));
      expect(result.current[0]).toEqual({ b: 2 });
    });

    it("writes updates to localStorage", () => {
      const { result } = renderHook(() => useLocalStorage("k", 1));
      act(() => {
        result.current[1](2);
      });
      expect(JSON.parse(localStorage.getItem("k") ?? "{}")).toBe(2);
    });

    it("falls back to the initial value on corrupt JSON", () => {
      localStorage.setItem("k", "{not json");
      const { result } = renderHook(() => useLocalStorage("k", "fallback"));
      expect(result.current[0]).toBe("fallback");
    });
  });

  describe("useNow", () => {
    it("returns a Date and updates on interval", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      const { result } = renderHook(() => useNow(1000));
      expect(result.current.getTime()).toBe(
        new Date("2026-01-01T00:00:00Z").getTime()
      );
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(result.current.getTime()).toBe(
        new Date("2026-01-01T00:00:03Z").getTime()
      );
    });
  });

  describe("useSessionState", () => {
    it("maps live state to booleans", () => {
      expect(useSessionState("live")).toEqual({
        isLive: true,
        isUpcoming: false,
        isBetween: false,
        isFinished: false,
      });
      expect(useSessionState("upcoming").isUpcoming).toBe(true);
      expect(useSessionState("between").isBetween).toBe(true);
      expect(useSessionState("finished").isFinished).toBe(true);
      expect(useSessionState(null).isLive).toBe(false);
    });
  });
});
