import { Suspense } from "react";
import { StatisticsClient } from "./statistics.client";
import { StatisticsSkeleton } from "./statistics.skeleton";

export function Statistics() {
  return (
    <Suspense fallback={<StatisticsSkeleton />}>
      <StatisticsClient />
    </Suspense>
  );
}
