import { Suspense } from "react";
import { getLiveStatus } from "@/lib/api/server-helpers";
import { HeroSectionClient } from "./hero-section-client";
import type { LiveStatus } from "@/types";

async function HeroData() {
  const liveStatus: LiveStatus = await getLiveStatus();
  return <HeroSectionClient liveStatus={liveStatus} />;
}

function HeroFallback() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center text-center">
        <div className="h-6 w-32 animate-pulse rounded-full bg-elevated" />
        <div className="mt-6 flex items-center gap-2 sm:mt-8 sm:gap-3">
          <div className="h-6 w-10 animate-pulse rounded bg-elevated" />
          <div className="h-5 w-44 animate-pulse rounded bg-elevated" />
        </div>
        <div className="mt-4 h-20 w-44 animate-pulse rounded bg-elevated sm:mt-6 sm:h-28 sm:w-64" />
        <div className="mt-4 h-12 w-64 animate-pulse rounded-xl bg-elevated sm:mt-6 sm:h-16 sm:w-72 md:h-20 md:w-96" />
        <div className="mt-4 h-4 w-52 animate-pulse rounded bg-elevated sm:mt-5" />
        <div className="mt-6 flex gap-2 sm:mt-10 sm:gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-14 w-10 animate-pulse rounded-lg bg-elevated sm:h-20 sm:w-14 sm:rounded-xl"
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function HeroSection() {
  return (
    <Suspense fallback={<HeroFallback />}>
      <HeroData />
    </Suspense>
  );
}
