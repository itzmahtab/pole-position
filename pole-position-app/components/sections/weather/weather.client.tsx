"use client";

import { useWeather } from "@/hooks/use-weather";
import { GlassCard } from "@/components/shared/glass-card";
import { LiveStatusPill } from "@/components/shared/live-status-pill";
import { formatTime } from "@/lib/time";
import { usePreferences } from "@/store/preferences";
import { Droplets, Thermometer, Wind, Umbrella } from "lucide-react";
import type { Weather } from "@/types";

function LiveWeatherPanel({ latest }: { latest: Weather }) {
  const items = [
    {
      icon: <Thermometer className="h-4 w-4" />,
      label: "Air",
      value: `${Math.round(latest.air_temperature)}°C`,
    },
    {
      icon: <Thermometer className="h-4 w-4 text-safety-yellow" />,
      label: "Track",
      value: `${Math.round(latest.track_temperature)}°C`,
    },
    {
      icon: <Droplets className="h-4 w-4 text-electric-blue" />,
      label: "Humidity",
      value: `${Math.round(latest.humidity)}%`,
    },
    {
      icon: <Wind className="h-4 w-4 text-drs-green" />,
      label: "Wind",
      value: `${Math.round(latest.wind_speed)} m/s`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <GlassCard key={it.label} hover className="flex flex-col gap-2 p-4">
          <span className="text-muted-foreground">{it.icon}</span>
          <div>
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {it.label}
            </div>
            <div className="font-display mt-1 text-2xl font-bold tabular-nums text-foreground">
              {it.value}
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

function ForecastPanel({
  points,
  timezone,
}: {
  points: NonNullable<ReturnType<typeof useWeather>["forecast"]>;
  timezone: string;
}) {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {points.map((p) => (
        <div key={p.dt} className="flex flex-col items-center gap-1.5 text-center">
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
            {formatTime(new Date(p.dt * 1000).toISOString(), timezone)}
          </span>
          <span className="font-mono text-xl tabular-nums text-foreground">
            {p.temp}°
          </span>
          <span className="flex items-center gap-1 text-[10px] text-electric-blue">
            <Umbrella className="h-3 w-3" /> {p.pop}%
          </span>
        </div>
      ))}
    </div>
  );
}

export function WeatherClient() {
  const { latest, isLive, meeting, forecast, liveLoading } = useWeather();
  const { timezone } = usePreferences();

  if (liveLoading && !latest) return null;

  const hasData = isLive && latest;

  return (
    <section id="weather" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
              Weather
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              {isLive
                ? `Live on-track conditions at ${meeting?.circuit_short_name ?? "the circuit"}.`
                : `Forecast for ${meeting?.circuit_short_name ?? "the next race"} — 3-hour steps.`}
            </p>
          </div>
          {isLive ? (
            <LiveStatusPill status="live" label="LIVE" />
          ) : (
            <LiveStatusPill status="between" label="FORECAST" />
          )}
        </div>

        <div className="mt-10">
          {hasData ? (
            <LiveWeatherPanel latest={latest} />
          ) : forecast && forecast.length > 0 ? (
            <GlassCard className="p-5">
              <ForecastPanel points={forecast} timezone={timezone} />
            </GlassCard>
          ) : (
            <GlassCard className="flex min-h-40 flex-col items-center justify-center gap-3 p-8 text-center">
              <span className="text-2xl">🌤️</span>
              <p className="text-sm text-muted-foreground">
                Weather data unavailable right now.
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </section>
  );
}
