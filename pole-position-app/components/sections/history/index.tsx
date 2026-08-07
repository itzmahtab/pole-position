import { Suspense } from "react";
import { HistoricalClient } from "./historical.client";
import { HistoricalSkeleton } from "./historical.skeleton";

export function History() {
  return (
    <Suspense fallback={<HistoricalSkeleton />}>
      <HistoricalClient />
    </Suspense>
  );
}
