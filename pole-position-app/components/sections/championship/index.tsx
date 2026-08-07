import { Suspense } from "react";
import { ChampionshipClient } from "./championship.client";
import { ChampionshipSkeleton } from "./championship.skeleton";

export function Championship() {
  return (
    <Suspense fallback={<ChampionshipSkeleton />}>
      <ChampionshipClient />
    </Suspense>
  );
}
