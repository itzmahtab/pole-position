import { Suspense } from "react";
import { WeatherClient } from "./weather.client";
import { WeatherSkeleton } from "./weather.skeleton";

export function Weather() {
  return (
    <Suspense fallback={<WeatherSkeleton />}>
      <WeatherClient />
    </Suspense>
  );
}
