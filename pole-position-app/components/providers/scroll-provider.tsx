"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled } from "@/hooks/use-motion-enabled";
import { setLenis } from "@/lib/lenis";

gsap.registerPlugin(ScrollTrigger);

// Lenis owns scroll physics; GSAP ScrollTrigger owns scroll-linked timelines.
// We only mount Lenis when motion is enabled (reduced-motion / the in-app
// "Animations" toggle both disable it).
export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const enabled = useMotionEnabled();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: true,
    });
    lenisRef.current = lenis;
    setLenis(lenis);

    // Keep GSAP ScrollTrigger in sync with Lenis-driven scroll.
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [enabled]);

  return <>{children}</>;
}
