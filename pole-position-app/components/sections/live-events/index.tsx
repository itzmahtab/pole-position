import { Suspense } from "react";
import { LiveEventsClient } from "./live-events.client";
import { LiveEventsSkeleton } from "./live-events.skeleton";

export function LiveEvents() {
  return (
    <Suspense fallback={<LiveEventsSkeleton />}>
      <LiveEventsClient />
    </Suspense>
  );
}
