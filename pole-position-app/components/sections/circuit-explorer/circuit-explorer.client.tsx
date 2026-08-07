"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionEnabled } from "@/hooks/use-motion-enabled";
import { TRACK_IDS, TRACK_PATHS, type TrackId } from "@/components/shared/track-svg";
import { CIRCUIT_INFO } from "@/lib/constants/circuits";
import { FlagIcon } from "@/components/shared/flag-icon";
import { GlassCard } from "@/components/shared/glass-card";
import { GlowBadge } from "@/components/shared/glow-badge";
import { TiltCard } from "@/components/shared/tilt-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface Point {
  x: number;
  y: number;
}

// Sample evenly-spaced points along an SVG path in the 200x140 viewBox.
function samplePath(pathD: string, count: number): Point[] {
  if (typeof document === "undefined") return [];
  const ns = "http://www.w3.org/2000/svg";
  const path = document.createElementNS(ns, "path");
  path.setAttribute("d", pathD);
  const length = path.getTotalLength();
  const points: Point[] = [];
  for (let i = 0; i < count; i++) {
    const pt = path.getPointAtLength((i / count) * length);
    points.push({ x: pt.x, y: pt.y });
  }
  return points;
}

function useMedia<T>(query: string, fallback: T, match: T): T {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setValue(mq.matches ? match : fallback);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query, match, fallback]);
  return value;
}

export function CircuitExplorerClient() {
  const [trackId, setTrackId] = useState<TrackId>("monza");
  const enabled = useMotionEnabled();
  const reduced = !enabled;
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = useMedia("(max-width: 767px)", false, true);

  const info = CIRCUIT_INFO[trackId];
  const d = TRACK_PATHS[trackId];

  // Position corner markers + DRS zones from the real path geometry.
  const markers = useMemo(() => {
    if (reduced || typeof document === "undefined") return [];
    const pts = samplePath(d, 160);
    const corners: Array<Point & { n: number }> = [];
    const step = Math.max(1, Math.floor(160 / info.corners));
    for (let i = 0; i < info.corners; i++) {
      corners.push({ ...pts[Math.min(i * step, pts.length - 1)], n: i + 1 });
    }
    return corners;
  }, [d, info.corners, reduced]);

  const drsZones = useMemo(() => {
    if (reduced || typeof document === "undefined") return [];
    const pts = samplePath(d, 100);
    const zones: Array<{ a: Point; b: Point }> = [];
    const span = Math.floor(100 / (info.drsZones || 1));
    for (let i = 0; i < info.drsZones; i++) {
      const start = Math.min(i * span, pts.length - 2);
      zones.push({ a: pts[start], b: pts[Math.min(start + 4, pts.length - 1)] });
    }
    return zones;
  }, [d, info.drsZones, reduced]);

  // GSAP path-draw when section scrolls into view.
  useEffect(() => {
    if (reduced) return;
    const path = pathRef.current;
    const section = sectionRef.current;
    if (!path || !section) return;

    const length = path.getTotalLength();
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "power2.inOut",
      duration: 2,
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        once: true,
        toggleActions: "play none none none",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, trackId]);

  const next = useCallback(
    (dir: 1 | -1) => {
      const i = TRACK_IDS.indexOf(trackId);
      setTrackId(TRACK_IDS[(i + dir + TRACK_IDS.length) % TRACK_IDS.length]);
    },
    [trackId]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      next(1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      next(-1);
    }
  };

  const strokeW = isMobile ? 2.2 : 3;

  return (
    <section
      id="circuit-explorer"
      ref={sectionRef}
      className="relative scroll-mt-24 py-24"
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Circuit explorer. Use arrow keys to change circuit."
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
            Circuit Explorer
          </h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            Track layout draws in as you scroll. Corner markers, DRS zones and
            records — browse with the keyboard.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TRACK_IDS.filter((t) => t !== "generic").map((t) => (
            <button
              key={t}
              onClick={() => setTrackId(t)}
              aria-pressed={trackId === t}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                trackId === t
                  ? "border-electric-blue/50 bg-electric-blue/10 text-electric-blue"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
              )}
            >
              {CIRCUIT_INFO[t].locality || CIRCUIT_INFO[t].name}
            </button>
          ))}
        </div>

        <div className="mt-10 grid items-center gap-8 lg:grid-cols-2">
          {/* Track */}
          <div className="relative">
            <svg
              ref={svgRef}
              viewBox="0 0 200 140"
              role="img"
              aria-label={`${info.name} circuit layout`}
              className="h-auto w-full text-foreground"
            >
              <path
                ref={pathRef}
                d={d}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeW}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-foreground/30"
              />
              {!reduced &&
                drsZones.map((z, i) => (
                  <line
                    key={i}
                    x1={z.a.x}
                    y1={z.a.y}
                    x2={z.b.x}
                    y2={z.b.y}
                    stroke="var(--drs-green)"
                    strokeWidth={strokeW + 1.6}
                    strokeLinecap="round"
                    opacity={0.85}
                  />
                ))}
              {!reduced &&
                markers.map((m) => (
                  <g key={m.n}>
                    <circle cx={m.x} cy={m.y} r={1.1} fill="var(--foreground)" />
                    {m.n % 4 === 1 && (
                      <text
                        x={m.x + 1.6}
                        y={m.y - 1.2}
                        fontSize={2.6}
                        fill="var(--muted-foreground)"
                      >
                        {m.n}
                      </text>
                    )}
                  </g>
                ))}
            </svg>
            {!reduced && (
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--drs-green)]" />{" "}
                  DRS zone
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-foreground" /> Corner
                </span>
                <span className="text-muted-foreground/60">← → to switch</span>
              </div>
            )}
          </div>

          {/* Metadata */}
          <div>
            <div className="flex items-center gap-3">
              <FlagIcon country={info.country} size="lg" />
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {info.name}
                </h3>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {info.locality}
                  {info.country ? ` · ${info.country}` : ""}
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Stat label="Lap record" value={info.lapRecord} sub={info.lapRecordDriver} />
              <Stat label="Race distance" value={`${info.raceLaps} laps`} sub={`${info.lengthKm.toFixed(3)} km`} />
              <Stat label="Corners" value={`${info.corners}`} sub="GP layout" />
              <Stat label="DRS zones" value={`${info.drsZones}`} sub="activate on straights" />
            </div>

            <GlassCard className="mt-4 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                    First Grand Prix
                  </div>
                  <div className="font-display mt-1 text-2xl font-bold text-foreground">
                    <AnimatedCounter value={info.firstGp} />
                  </div>
                </div>
                <GlowBadge variant="blue">F1 Circuit</GlowBadge>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <TiltCard>
      <GlassCard hover className="p-4">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </div>
        <div className="font-display mt-1 text-xl font-bold text-foreground">
          {value}
        </div>
        {sub && (
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{sub}</div>
        )}
      </GlassCard>
    </TiltCard>
  );
}
