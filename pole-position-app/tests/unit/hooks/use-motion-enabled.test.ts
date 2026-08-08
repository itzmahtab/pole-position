import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useMotionEnabled, useFinePointer } from "@/hooks/use-motion-enabled";
import { usePreferences } from "@/store/preferences";

function stubMatchMedia(matches: boolean) {
  return vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

describe("hooks/use-motion-enabled", () => {
  beforeEach(() => {
    usePreferences.setState({ motionEnabled: true });
    document.documentElement.classList.remove("motion-disabled");
  });

  it("enables motion by default", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useMotionEnabled());
    expect(result.current).toBe(true);
  });

  it("disables motion when the OS prefers reduced motion", () => {
    stubMatchMedia(true);
    const { result } = renderHook(() => useMotionEnabled());
    expect(result.current).toBe(false);
  });

  it("disables motion when the in-app toggle is off", () => {
    stubMatchMedia(false);
    act(() => {
      usePreferences.getState().setMotionEnabled(false);
    });
    const { result } = renderHook(() => useMotionEnabled());
    expect(result.current).toBe(false);
  });

  it("toggles the motion-disabled class on <html>", () => {
    stubMatchMedia(true);
    renderHook(() => useMotionEnabled());
    expect(document.documentElement.classList.contains("motion-disabled")).toBe(
      true
    );
  });

  it("useFinePointer respects the pointer media query", () => {
    stubMatchMedia(false);
    const { result } = renderHook(() => useFinePointer());
    expect(result.current).toBe(false);

    stubMatchMedia(true);
    const { result: fineResult } = renderHook(() => useFinePointer());
    expect(fineResult.current).toBe(true);
  });
});
