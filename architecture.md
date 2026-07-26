# architecture.md — Pole Position

## 1. High-Level Diagram (described)

```
Browser (Client)
  │
  ├─ Next.js 16 App Router (RSC by default, "use client" only where needed)
  │     ├─ Server Components: fetch schedule/standings/historical data (ISR)
  │     └─ Client Components: countdown, live ticking, settings drawer, animations
  │
  ├─ TanStack Query (client cache for polling live endpoints: intervals, position, race_control)
  ├─ Zustand (ephemeral UI + persisted user prefs, hydrated from localStorage)
  │
  ▼
Next.js Route Handlers (Edge Runtime) — /app/api/*
  │  Acts as a proxy/aggregator + cache layer, never call OpenF1/Jolpica directly from client
  │
  ├─ Upstash Redis (edge cache: 5–15s TTL for live data, 1h+ TTL for schedule/standings)
  ├─ Retry/fallback orchestrator (see §6)
  │
  ▼
External APIs: OpenF1, Jolpica (Ergast), OpenWeather, FlagCDN, REST Countries, MultiViewer

Supabase (Postgres, free tier)
  ├─ newsletter_subscribers
  ├─ preferences (optional, anonymous device id)
  └─ email_logs / cron_logs

Vercel Cron → Route Handler → queries upcoming sessions → matches subscriber reminder windows
  → React Email template → Resend → send → log to email_logs
```

## 2. Frontend Architecture

- **Next.js 16, App Router, TypeScript strict mode.**
- Default to **React Server Components**. Client components are opt-in and kept as small/leaf as possible (`"use client"` only on interactive leaves: countdown digits, drawers, charts, comparison widgets).
- **Streaming + Suspense**: every scroll-section that depends on network data wraps in `<Suspense fallback={<SectionSkeleton/>}>` so the page shell paints instantly and sections progressively hydrate.
- **ISR** for schedule/standings/historical routes (`revalidate: 300` typical; `revalidate: 15` for anything session-adjacent).
- **Edge Runtime** for API route handlers that proxy live data (`export const runtime = 'edge'`).
- **Lenis** drives smooth scrolling globally; **GSAP ScrollTrigger** drives scroll-linked reveals/horizontal sections/pinning; **Motion (Framer Motion)** drives component-level enter/exit and micro-interactions. Keep these responsibilities separate to avoid animation engines fighting each other (see rules.md §5).

## 3. State Management

| Concern | Tool | Notes |
|---|---|---|
| Server data (schedule, standings, historical) | RSC fetch + `fetch(..., { next: { revalidate } })` | No client fetch needed |
| Live/polling data (intervals, positions, race_control, weather) | TanStack Query | `refetchInterval` tuned per endpoint (weather 60s, intervals 4s only while a session is live) |
| User preferences (timezone, country, theme, language, favorites, reminder settings, motion toggle) | Zustand + `persist` middleware → localStorage | Single store, namespaced key `pole-position:prefs` |
| Transient UI (drawer open, active search, modal) | Zustand (non-persisted slice) or local `useState` | Keep out of persisted store |

## 4. API Layer (internal route handlers)

All external calls go through `/app/api/f1/*` route handlers — the client never calls OpenF1/Jolpica directly. Benefits: hides rate-limit exposure, enables Redis caching, centralizes fallback logic, allows response shaping.

```
/app/api/f1/meetings/route.ts        → OpenF1 meetings (+ Jolpica fallback for schedule)
/app/api/f1/sessions/route.ts        → OpenF1 sessions
/app/api/f1/live-status/route.ts     → derives Upcoming/Live/Between-sessions/Results state
/app/api/f1/standings/route.ts       → championship_drivers + championship_teams (+ Jolpica fallback)
/app/api/f1/drivers/route.ts         → OpenF1 drivers
/app/api/f1/intervals/route.ts       → OpenF1 intervals (live only)
/app/api/f1/position/route.ts        → OpenF1 position
/app/api/f1/race-control/route.ts    → OpenF1 race_control (live event feed)
/app/api/f1/weather/route.ts         → OpenF1 weather (session) → OpenWeather (non-session fallback)
/app/api/f1/stints/route.ts          → OpenF1 stints (tyre strategy)
/app/api/f1/results/route.ts         → session_result, starting_grid
/app/api/f1/historical/route.ts      → Jolpica historical winners/records
/app/api/newsletter/subscribe/route.ts → Supabase insert
/app/api/cron/reminders/route.ts     → Vercel Cron target, sends via Resend
```

## 5. Caching Strategy

| Data type | Cache | TTL |
|---|---|---|
| Season schedule / meetings | Redis + Next `revalidate` | 1h |
| Standings | Redis | 5 min (10 min if between race weekends) |
| Live intervals/position/race_control | Redis | 5–10s (only populated when a session is live) |
| Weather (session) | Redis | 60s |
| Weather (forecast fallback) | Redis | 15 min |
| Static assets (flags, circuit images) | `next/image` + CDN cache-control `immutable` | 1 year |
| Driver headshots/team colors | Redis | 24h |

## 6. Error Handling & Retry Logic

Central utility `fetchWithFallback<T>()`:

1. Attempt primary source with a 3s timeout.
2. On failure/timeout/non-2xx: retry once with exponential backoff (250ms).
3. On second failure: attempt fallback source (if one exists for this data type).
4. On total failure: return last cached value from Redis (even if stale) tagged `stale: true`.
5. If no cache exists at all: return a typed `DataUnavailable` result — UI renders a calm empty state, never a raw error or blank crash.

Every API route handler returns a consistent envelope:

```ts
type ApiEnvelope<T> = {
  data: T | null;
  source: "openf1" | "jolpica" | "cache" | "static";
  stale: boolean;
  fetchedAt: string; // ISO
};
```

## 7. Cron Jobs & Email Pipeline

- `vercel.json` defines a cron hitting `/app/api/cron/reminders` every 5 minutes.
- Handler: fetch next N sessions (Redis-cached schedule) → for each, compute reminder windows (24h/12h/1h/15m) → query `newsletter_subscribers` matching that window and not yet notified for this session+window (checked against `email_logs`) → render React Email template → send via Resend → insert `email_logs` row → insert `cron_logs` summary row.
- Idempotency guaranteed by a unique constraint on `(subscriber_id, session_key, reminder_window)` in `email_logs`.

## 8. Design System Layer

- **shadcn/ui** as the component primitive layer (Button, Card, Sheet/Drawer, Dialog, Tabs, Command palette for search) generated into `/components/ui`, then themed via Tailwind v4 CSS variables (see design.md).
- **Radix UI** underlies shadcn primitives — used directly only for anything shadcn doesn't cover (e.g., custom Toggle Group for reminder windows).
- **Recharts** for standings/points-progression/statistics charts, restyled with design tokens.
- **Lucide Icons** for all iconography.

## 9. Folder Structure

```
pole-position/
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx                     # the single infinite-scroll page, composes sections
│  ├─ opengraph-image.tsx
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ api/
│     ├─ f1/
│     │  ├─ meetings/route.ts
│     │  ├─ sessions/route.ts
│     │  ├─ live-status/route.ts
│     │  ├─ standings/route.ts
│     │  ├─ drivers/route.ts
│     │  ├─ intervals/route.ts
│     │  ├─ position/route.ts
│     │  ├─ race-control/route.ts
│     │  ├─ weather/route.ts
│     │  ├─ stints/route.ts
│     │  ├─ results/route.ts
│     │  └─ historical/route.ts
│     ├─ newsletter/subscribe/route.ts
│     └─ cron/reminders/route.ts
├─ components/
│  ├─ ui/                          # shadcn generated primitives
│  ├─ sections/                    # one folder per scroll section
│  │  ├─ hero/
│  │  ├─ upcoming-race/
│  │  ├─ weekend-timeline/
│  │  ├─ championship/
│  │  ├─ circuit-explorer/
│  │  ├─ live-events/
│  │  ├─ strategy/
│  │  ├─ comparison/
│  │  ├─ calendar/
│  │  ├─ statistics/
│  │  └─ newsletter/
│  ├─ shared/                      # countdown, flip-clock, flag, glow-badge, marquee...
│  └─ settings-drawer/
├─ hooks/
│  ├─ useCountdown.ts
│  ├─ useTimezone.ts
│  ├─ useRaceWeekend.ts
│  ├─ useLiveStandings.ts
│  ├─ useWeather.ts
│  ├─ useReminder.ts
│  ├─ useLocalStorage.ts
│  └─ useTrackStatus.ts
├─ lib/
│  ├─ api/                         # fetchWithFallback + typed clients per source
│  ├─ cache/redis.ts
│  ├─ email/                       # React Email templates + Resend client
│  ├─ supabase/client.ts
│  ├─ time/                        # timezone + relative-time utils
│  └─ constants/                   # team colors, flag maps, circuit metadata
├─ store/                          # Zustand slices
├─ types/                          # OpenF1 + Jolpica typed schemas (Zod)
├─ styles/globals.css
├─ tests/
│  ├─ unit/                        # Vitest
│  └─ e2e/                         # Playwright
├─ public/
├─ vercel.json
└─ package.json
```

## 10. Component Structure Conventions

- One folder per section under `components/sections/<name>/`, containing `index.tsx` (RSC shell), `*.client.tsx` (interactive leaf), and `*.skeleton.tsx`.
- Shared primitives (flip clock, animated flag, glow badge, live-pulse dot, marquee) live in `components/shared/` and are reused across sections.
- No section imports another section's internals — cross-section shared logic goes through `hooks/` or `lib/`.

## 11. Backend Architecture (Supabase)

```sql
create table newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  reminder_windows text[] not null default '{24h,1h}',
  favorite_driver text,
  timezone text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create table preferences (
  device_id uuid primary key,
  timezone text,
  country text,
  language text,
  theme text,
  favorite_driver text,
  favorite_constructor text,
  favorite_circuit text,
  updated_at timestamptz not null default now()
);

create table email_logs (
  id uuid primary key default gen_random_uuid(),
  subscriber_id uuid references newsletter_subscribers(id),
  session_key bigint not null,
  reminder_window text not null,
  sent_at timestamptz not null default now(),
  status text not null,
  unique (subscriber_id, session_key, reminder_window)
);

create table cron_logs (
  id uuid primary key default gen_random_uuid(),
  run_at timestamptz not null default now(),
  emails_sent int not null default 0,
  errors int not null default 0,
  notes text
);
```

## 12. Deployment Architecture

- **Vercel** hosts the app (Hobby tier, free). Edge Functions for `/api/f1/*`, Node runtime for `/api/cron/*` (Resend SDK + Supabase server client).
- **Vercel Analytics** + **Speed Insights** enabled via `@vercel/analytics` and `@vercel/speed-insights`.
- **Vercel Cron** triggers reminders every 5 minutes (`vercel.json`).
- **Upstash Redis** free tier, REST client (edge-compatible).
- **Supabase** free tier Postgres, accessed via server-only client (service role key never exposed to client).
- **Resend** free tier for transactional email; React Email for templates.
- Preview deployments per PR; production auto-deploys from `main` after CI passes (lint, typecheck, unit tests, Playwright smoke, Lighthouse CI).
