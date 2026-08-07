"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled } from "@/hooks/use-motion-enabled";

gsap.registerPlugin(ScrollTrigger);

export function HeroBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled();

  useEffect(() => {
    const container = containerRef.current;
    const orbA = orbARef.current;
    const orbB = orbBRef.current;
    if (!container || !orbA || !orbB) return;

    // Disable ALL motion if reduced-motion or the in-app toggle is off.
    if (!enabled) {
      return;
    }

    const mql = window.matchMedia("(pointer: fine)");
    const finePointer = mql.matches;

    // ─── Ambient orb drift (12s loop) ───
    const driftTl = gsap.timeline({ repeat: -1, yoyo: true });
    driftTl
      .to(orbA, { xPercent: 12, yPercent: -10, duration: 6, ease: "sine.inOut" }, 0)
      .to(orbB, { xPercent: -10, yPercent: 12, duration: 6, ease: "sine.inOut" }, 0)
      .to(orbA, { scale: 1.15, duration: 6, ease: "sine.inOut" }, 0)
      .to(orbB, { scale: 0.9, duration: 6, ease: "sine.inOut" }, 0);

    // ─── Mouse parallax (desktop pointer only) ───
    let mouseCleanup: (() => void) | null = null;
    if (finePointer) {
      const onMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;
        gsap.to(orbA, {
          x: x * 24,
          y: y * 18,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(orbB, {
          x: x * -18,
          y: y * -14,
          duration: 1.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      mouseCleanup = () =>
        window.removeEventListener("mousemove", onMouseMove);
    }

    // ─── Scroll parallax ───
    const scrollTween = gsap.to(container, {
      yPercent: 25,
      opacity: 0.6,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    return () => {
      driftTl.kill();
      scrollTween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      mouseCleanup?.();
    };
  }, [enabled]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Base radial wash */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(44,140,255,0.10),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(225,6,0,0.08),transparent_55%)]" />

      {/* Drift orbs */}
      <div
        ref={orbARef}
        className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-electric-blue/15 blur-[120px]"
      />
      <div
        ref={orbBRef}
        className="absolute -right-40 bottom-1/4 h-[30rem] w-[30rem] rounded-full bg-racing-red/10 blur-[120px]"
      />

      {/* F1 silhouette stripe — racing red glow line */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-racing-red/30 to-transparent" />
    </div>
  );
}
