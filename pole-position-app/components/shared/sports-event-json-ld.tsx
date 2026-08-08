"use client";

import { useEffect, useState } from "react";
import { appBaseUrl } from "@/lib/app-url";
import type { LiveStatus } from "@/types";

interface SportsEvent {
  "@context": "https://schema.org";
  "@type": "SportsEvent";
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    "@type": "Place";
    name: string;
    address: {
      "@type": "PostalAddress";
      addressCountry: string;
    };
  };
  organizer: {
    "@type": "SportsOrganization";
    name: string;
  };
  url: string;
  eventStatus?: string;
}

function buildSportsEvent(status: LiveStatus | null): SportsEvent | null {
  const meeting = status?.meeting;
  const session = status?.session ?? status?.nextSession;
  if (!meeting || !session) return null;

  const eventStatusMap: Record<string, string> = {
    upcoming: "https://schema.org/EventScheduled",
    live: "https://schema.org/EventActive",
    between: "https://schema.org/EventScheduled",
    finished: "https://schema.org/EventCompleted",
  };

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: meeting.meeting_official_name,
    description: `Formula 1 ${meeting.meeting_official_name} at ${meeting.circuit_short_name}`,
    startDate: session.date_start,
    endDate: status?.session?.date_end ?? undefined,
    location: {
      "@type": "Place",
      name: meeting.circuit_short_name,
      address: {
        "@type": "PostalAddress",
        addressCountry: meeting.country_code ?? "",
      },
    },
    organizer: {
      "@type": "SportsOrganization",
      name: "Formula 1",
    },
    url: appBaseUrl(),
    eventStatus: eventStatusMap[status?.state ?? "upcoming"],
  };
}

export function SportsEventJsonLd() {
  const [event, setEvent] = useState<SportsEvent | null>(null);

  useEffect(() => {
    fetch("/api/f1/live-status", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((json) => {
        const data = json?.data as LiveStatus | undefined;
        if (data) setEvent(buildSportsEvent(data));
      })
      .catch(() => {});
  }, []);

  if (!event) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(event) }}
    />
  );
}
