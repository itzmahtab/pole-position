"use client";

import { useEffect, useState } from "react";
import { usePreferences } from "@/store/preferences";

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return reduced;
}

// Single source of truth for app-wide animation gating. Motion is disabled
// when the OS prefers reduced motion OR the user toggles "Animations" off in
// the Settings Drawer. Also flips a `motion-disabled` class on <html> so CSS
// animations can be gated via a global rule.
export function useMotionEnabled(): boolean {
  const motionEnabled = usePreferences((s) => s.motionEnabled);
  const prefersReduced = usePrefersReducedMotion();
  const enabled = motionEnabled && !prefersReduced;

  useEffect(() => {
    document.documentElement.classList.toggle("motion-disabled", !enabled);
  }, [enabled]);

  return enabled;
}

// Returns true only on devices with a fine pointer (mouse/trackpad) so
// pointer-following effects never hijack touch scroll.
export function useFinePointer(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return fine;
}
