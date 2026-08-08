import { Suspense } from "react";
import { HeroSection } from "@/components/sections/hero/hero-section";
import { WeekendTimeline } from "@/components/sections/weekend-timeline";
import { Calendar } from "@/components/sections/calendar";
import { CircuitExplorer } from "@/components/sections/circuit-explorer";
import { Championship } from "@/components/sections/championship";
import { LiveEvents } from "@/components/sections/live-events";
import { Strategy } from "@/components/sections/strategy";
import { Weather } from "@/components/sections/weather";
import { Comparison } from "@/components/sections/comparison";
import { Results } from "@/components/sections/results";
import { Statistics } from "@/components/sections/statistics";
import { SeasonTimeline } from "@/components/sections/season-timeline";
import { History } from "@/components/sections/history";
import { Newsletter } from "@/components/sections/newsletter";
import { CommandMenu } from "@/components/search/command-menu";
import { SettingsDrawer } from "@/components/layout/settings-drawer";
import { FirstVisitBanner } from "@/components/layout/first-visit-banner";
import { StickyNav } from "@/components/layout/sticky-nav";
import { NoiseOverlay } from "@/components/shared";
import { appBaseUrl } from "@/lib/app-url";
import { SportsEventJsonLd } from "@/components/shared/sports-event-json-ld";

export default function Home() {
  const baseUrl = appBaseUrl();

  return (
    <main className="relative min-h-screen bg-base">
      <StickyNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Pole Position",
            url: baseUrl,
            description:
              "Live standings, race weekend timeline, session countdowns and the full F1 calendar — instantly converted to your local timezone.",
            inLanguage: "en",
            potentialAction: {
              "@type": "SearchAction",
              target: `${baseUrl}?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <Suspense fallback={null}>
        <SportsEventJsonLd />
      </Suspense>
      <NoiseOverlay />
      <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
        <CommandMenu />
        <SettingsDrawer />
      </div>
      <FirstVisitBanner />
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
      <div className="relative z-10">
        <WeekendTimeline />
        <Calendar />
        <CircuitExplorer />
        <Championship />
        <LiveEvents />
        <Strategy />
        <Weather />
        <Comparison />
        <Results />
        <Statistics />
        <SeasonTimeline />
        <History />
        <Newsletter />
      </div>
    </main>
  );
}
