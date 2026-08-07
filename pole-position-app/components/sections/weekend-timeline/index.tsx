import { Suspense } from "react";
import { WeekendTimelineClient } from "./weekend-timeline.client";
import { WeekendTimelineSkeleton } from "./weekend-timeline.skeleton";

export function WeekendTimeline() {
  return (
    <Suspense fallback={<WeekendTimelineSkeleton />}>
      <WeekendTimelineClient />
    </Suspense>
  );
}
