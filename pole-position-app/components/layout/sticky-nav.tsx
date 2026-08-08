import { Suspense } from "react";
import { getLiveStatus } from "@/lib/api/server-helpers";
import { StickyNavClient } from "./sticky-nav-client";
import type { LiveStatus } from "@/types";

async function StickyNavData() {
  const liveStatus: LiveStatus = await getLiveStatus();
  return <StickyNavClient liveStatus={liveStatus} />;
}

export function StickyNav() {
  return (
    <Suspense fallback={null}>
      <StickyNavData />
    </Suspense>
  );
}
