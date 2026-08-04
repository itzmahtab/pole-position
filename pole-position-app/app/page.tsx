import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { NoiseOverlay } from "@/components/shared";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-base">
      <NoiseOverlay />
      <Suspense
        fallback={
          <section className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(44,140,255,0.10),transparent_55%)]" />
            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
              <div className="h-6 w-32 animate-pulse rounded-full bg-elevated" />
              <div className="mt-8 flex items-center gap-3">
                <div className="h-6 w-10 animate-pulse rounded bg-elevated" />
                <div className="h-5 w-44 animate-pulse rounded bg-elevated" />
              </div>
              <div className="mt-6 h-24 w-56 animate-pulse rounded bg-elevated sm:h-28 sm:w-64" />
              <div className="mt-6 h-16 w-72 animate-pulse rounded-xl bg-elevated sm:h-20 sm:w-96" />
              <div className="mt-10 flex gap-3">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 w-14 animate-pulse rounded-xl bg-elevated"
                  />
                ))}
              </div>
            </div>
          </section>
        }
      >
        <HeroSection />
      </Suspense>
    </main>
  );
}
