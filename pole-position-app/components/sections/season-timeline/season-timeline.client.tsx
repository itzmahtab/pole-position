"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "motion/react";
import { useHistoricalSeason } from "@/hooks/use-historical";
import { TEAM_COLORS } from "@/lib/constants";
import type { HistoricalSeason, RaceResultRaw } from "@/types";

gsap.registerPlugin(ScrollTrigger);

interface RaceStory {
  round: string;
  raceName: string;
  date: string;
  circuit: string;
  winner?: RaceResultRaw;
  fastestLap?: { name: string; time: string };
  dnfs: number;
}

function buildStories(season: HistoricalSeason): RaceStory[] {
  return season.races.map((race) => {
    const results = race.Results ?? [];
    const winner = results.find(
      (r) => r.position === "1" || r.positionText === "1"
    );
    const fl = results
      .filter((r) => r.FastestLap)
      .sort((a, b) => Number(a.FastestLap?.rank) - Number(b.FastestLap?.rank))[0];
    const dnfs = results.filter((r) => !r.status.toLowerCase().includes("finished")).length;
    return {
      round: race.round,
      raceName: race.raceName,
      date: race.date,
      circuit: race.Circuit.circuitName,
      winner,
      fastestLap: fl?.FastestLap
        ? { name: `${fl.Driver.givenName} ${fl.Driver.familyName}`, time: fl.FastestLap.Time.time }
        : undefined,
      dnfs,
    };
  });
}

function useIsDesktop() {
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return desktop;
}

function StoryCard({ story, index }: { story: RaceStory; index: number }) {
  const color = story.winner
    ? TEAM_COLORS[story.winner.Constructor.constructorId] ?? "#8B93A1"
    : "#8B93A1";
  return (
    <article
      className="relative w-[85vw] shrink-0 snap-center sm:w-80"
      style={{ zIndex: 10 - index }}
    >
      <div className="glass rounded-2xl p-5 shadow-elevated">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display text-4xl font-bold text-muted-foreground/40">
            {story.round}
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            {new Date(story.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
        <h3 className="mt-2 truncate font-display text-lg font-semibold text-foreground">
          {story.raceName}
        </h3>
        <p className="truncate text-xs text-muted-foreground">{story.circuit}</p>

        <div className="mt-4 rounded-lg bg-white/[0.03] p-3">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Winner
          </div>
          {story.winner ? (
            <div className="mt-1 flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: color }}
                aria-hidden
              />
              <span className="truncate text-sm font-semibold text-foreground">
                {story.winner.Driver.givenName} {story.winner.Driver.familyName}
              </span>
            </div>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">Not held</p>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          {story.fastestLap ? (
            <span className="truncate">
              ⚡ {story.fastestLap.name} · <span className="font-mono">{story.fastestLap.time}</span>
            </span>
          ) : (
            <span>—</span>
          )}
          <span className="shrink-0 tabular-nums">
            {story.dnfs > 0 ? `${story.dnfs} DNF` : "—"}
          </span>
        </div>
      </div>
    </article>
  );
}

export function SeasonTimelineClient() {
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];
  const [year, setYear] = useState<number>(currentYear);
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();

  const { data: season } = useHistoricalSeason(year);
  const stories = useMemo(
    () => (season ? buildStories(season) : []),
    [season]
  );

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    if (!isDesktop) return;
    const track = trackRef.current;
    const pin = pinRef.current;
    if (!track || !pin || stories.length === 0) return;

    const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${getDistance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [reduced, isDesktop, stories.length]);

  if (!season || stories.length === 0) {
    return (
      <section id="season-timeline" className="relative scroll-mt-24 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Season timeline unavailable for {year}.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="season-timeline"
      ref={sectionRef}
      className="relative scroll-mt-24 py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Season Timeline
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              Scroll through each round&apos;s story.
            </p>
          </div>
          <div className="flex gap-2">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setYear(y)}
                className={`rounded-full border px-4 py-1.5 font-mono text-sm tabular-nums transition-colors ${
                  year === y
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div ref={pinRef} className="mt-10">
        {isDesktop && !reduced ? (
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className="flex w-max gap-4 will-change-transform"
              style={{ paddingLeft: "max(0px, calc((100vw - 1152px) / 2))" }}
            >
              {stories.map((s, i) => (
                <StoryCard key={s.round} story={s} index={i} />
              ))}
            </div>
            <div className="pointer-events-none mx-auto -mt-2 h-px w-[72%] bg-white/10" />
          </div>
        ) : (
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 lg:px-[max(1.5rem,calc((100vw-1152px)/2))]">
            {stories.map((s, i) => (
              <StoryCard key={s.round} story={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
