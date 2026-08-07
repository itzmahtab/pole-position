import { Suspense } from "react";
import { CalendarClient } from "./calendar.client";
import { CalendarSkeleton } from "./calendar.skeleton";

export function Calendar() {
  return (
    <Suspense fallback={<CalendarSkeleton />}>
      <CalendarClient />
    </Suspense>
  );
}
