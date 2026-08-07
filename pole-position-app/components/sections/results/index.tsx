import { Suspense } from "react";
import { ResultsClient } from "./results.client";
import { ResultsSkeleton } from "./results.skeleton";

export function Results() {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <ResultsClient />
    </Suspense>
  );
}
