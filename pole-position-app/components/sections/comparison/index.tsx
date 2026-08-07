import { Suspense } from "react";
import { ComparisonClient } from "./comparison.client";
import { ComparisonSkeleton } from "./comparison.skeleton";

export function Comparison() {
  return (
    <Suspense fallback={<ComparisonSkeleton />}>
      <ComparisonClient />
    </Suspense>
  );
}
