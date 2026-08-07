import { Suspense } from "react";
import { SeasonTimelineClient } from "./season-timeline.client";
import { SeasonTimelineSkeleton } from "./season-timeline.skeleton";

export function SeasonTimeline() {
  return (
    <Suspense fallback={<SeasonTimelineSkeleton />}>
      <SeasonTimelineClient />
    </Suspense>
  );
}
