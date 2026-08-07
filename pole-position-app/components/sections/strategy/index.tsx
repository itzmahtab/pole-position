import { Suspense } from "react";
import { StrategyClient } from "./strategy.client";
import { StrategySkeleton } from "./strategy.skeleton";

export function Strategy() {
  return (
    <Suspense fallback={<StrategySkeleton />}>
      <StrategyClient />
    </Suspense>
  );
}
