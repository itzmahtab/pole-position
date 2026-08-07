import { Suspense } from "react";
import { CircuitExplorerClient } from "./circuit-explorer.client";
import { CircuitExplorerSkeleton } from "./circuit-explorer.skeleton";

export function CircuitExplorer() {
  return (
    <Suspense fallback={<CircuitExplorerSkeleton />}>
      <CircuitExplorerClient />
    </Suspense>
  );
}
