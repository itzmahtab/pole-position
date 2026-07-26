# phases.md — Implementation Roadmap: Zero to Deployed

11 phases, each with tasks, deliverables, and exit criteria. Branch per phase: `phase-N/description`.

---

## Phase 0 — Environment & Scaffold

**Tasks**
- Init Next.js 16 (App Router, TypeScript, Tailwind v4) via `create-next-app`.
- Install core deps: `motion`, `gsap`, `lenis`, `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `next-themes`, `recharts`, `lucide-react`.
- Install shadcn/ui, init with dark-mode-first config; install Radix primitives it depends on.
- Set up ESLint (strict + a11y plugin), Prettier, Husky + lint-staged.
- Set up Vitest + Playwright skeleton configs.
- Create `.env.example` with all required keys (Supabase, Upstash, Resend, OpenWeather).
- Create folder structure per `architecture.md` §9.

**Exit criteria:** `npm run dev` serves a blank themed shell; CI pipeline (lint, typecheck, test) runs green on an empty repo.

---

## Phase 1 — Design System Foundation

**Tasks**
- Implement CSS variable theme tokens (dark/light) from `design.md` §2 in `styles/globals.css`.
- Configure `next/font` for display + body + mono-data fonts.
- Generate core shadcn components: Button, Card, Sheet, Dialog, Tabs, Command, Badge, Skeleton, Toggle Group.
- Build shared primitives: `GlowBadge`, `LiveStatusPill`, `GlassCard`, `FlagIcon`, `MarqueeRow`.
- Build the noise-texture overlay component.
- Storybook-less visual QA page at `/dev/design-system` (excluded from prod build) showing all tokens/components.

**Exit criteria:** design-system preview page renders all tokens/components correctly in both themes; Lighthouse Accessibility ≥ 95 on that page.

---

## Phase 2 — Data Layer & API Integration

**Tasks**
- Define Zod schemas in `types/` for: meetings, sessions, drivers, championship_drivers, championship_teams, intervals, position, race_control, weather, stints, session_result, starting_grid.
- Implement `lib/api/openf1.ts`, `lib/api/jolpica.ts`, `lib/api/openweather.ts` typed clients.
- Implement `fetchWithFallback()` in `lib/api/fetchWithFallback.ts` with retry/timeout/fallback/stale-cache logic.
- Set up Upstash Redis client (`lib/cache/redis.ts`), edge-compatible.
- Build all `/app/api/f1/*` route handlers per `architecture.md` §4, each returning the `ApiEnvelope<T>` shape.
- Unit tests for every schema parse + `fetchWithFallback` retry/fallback paths (mocked fetch).

**Exit criteria:** hitting every `/api/f1/*` route locally returns valid, schema-conformant JSON with correct `source`/`stale` flags; unit test coverage on `lib/api` ≥ 90%.

---

## Phase 3 — Timezone & Preferences Engine

**Tasks**
- Build `lib/time/` utilities: UTC↔local conversion, relative-time formatter (`Today`, `Tomorrow`, `In 3 hours`, `Live`, `Finished`).
- Build `useTimezone()`, `useLocalStorage()` hooks.
- Build Zustand `preferences` store (timezone, country, language, theme, favorites, reminder windows, motion toggle) with `persist` middleware.
- Build first-visit detection banner ("We detected you're in Bangladesh") using `Intl` API + best-effort IP-country header from the edge request.
- Build Settings Drawer UI (shadcn `Sheet`) wired to the preferences store.

**Exit criteria:** changing timezone/theme/language in the drawer persists across reload; banner appears once per device and is dismissible; all rendered times reflect the selected timezone.

---

## Phase 4 — Hero, Countdown & Live Status

**Tasks**
- Build `useRaceWeekend()` and `useTrackStatus()` hooks deriving state (Upcoming/Live/Between Sessions/Results) from `/api/f1/live-status`.
- Build `useCountdown()` hook (second-accurate, drift-corrected via `Date.now()` diffing, not naive `setInterval` counting).
- Build the Flip Clock component (per `design.md` §7) with reduced-motion fallback.
- Build Hero section: animated background (CSS/SVG gradient motion, GSAP-driven, respects reduced motion), current/next race summary, country/flag/circuit/track image, live status badge.
- Wire hero to real OpenF1/Jolpica data via RSC + streaming Suspense boundary with skeleton.

**Exit criteria:** hero correctly shows "next race" during off-weekends and "LIVE" state during an active session (tested against a mocked live session fixture); countdown never drifts more than 1s/hour; works with JS-disabled animations (reduced motion) without layout break.

---

## Phase 5 — Schedule, Weekend Timeline & Calendar

**Tasks**
- Build Weekend Timeline section: FP1–FP3/Sprint/Quali/Race cards with per-session local time + relative label.
- Build full-season Calendar section, timezone-converted, filterable by month/status.
- Build Circuit Explorer: animated SVG track (path-draw on scroll-into-view), corner markers, DRS zone overlays, lap record, race distance, first GP year.
- Wire Search (Command palette) across drivers/circuits/constructors/races/countries/seasons using the historical + schedule data already fetched.

**Exit criteria:** full 2026 calendar renders correctly in at least 3 different timezones (manual QA: UTC, UTC+6, UTC-5); circuit explorer SVG animates on scroll and is keyboard-navigable; search returns correct results for at least 20 manual test queries.

---

## Phase 6 — Live Data: Standings, Events, Strategy, Weather

**Tasks**
- Build Championship section (Drivers + Constructors) using `useLiveStandings()` (TanStack Query, polling only meaningful during/after a race weekend).
- Build Live Events Feed: `race_control` timeline with flag-type icons/colors, animated timeline reveal, auto-scroll-to-latest with pause-on-hover.
- Build Pit Stop Strategy / Tyre Compounds visualization from `stints` (Gantt-style horizontal bars per driver).
- Build Weather section combining live `weather` (session) with OpenWeather forecast fallback via `useWeather()`.
- Build Driver Comparison and Constructor Comparison tools (side-by-side stat cards, animated diff highlighting).

**Exit criteria:** all live sections correctly show "no live session" empty state outside race weekends; during a mocked live fixture, event feed updates within one polling interval; strategy chart correctly renders multi-stint drivers.

---

## Phase 7 — Results, Statistics & Season Timeline

**Tasks**
- Build Qualifying/Sprint/Race Results sections (`session_result`, `starting_grid`), including DNF/DNS/DSQ states.
- Build Statistics section: fastest laps table, points progression line chart (Recharts), championship battle chart.
- Build Season Timeline: horizontal-scroll (GSAP ScrollTrigger pinned section) storytelling of the season's races with key results.
- Build Historical Winners / Track Records section using Jolpica historical data.

**Exit criteria:** charts render correctly with real historical data for the last 2 completed seasons; horizontal-scroll section works on touch (swipe) and desktop (scroll-jack) without trapping scroll on mobile.

---

## Phase 8 — Newsletter & Email Reminder System

**Tasks**
- Build Supabase schema (per `architecture.md` §11) via migration files.
- Build newsletter signup form (React Hook Form + Zod validation) with reminder-window multi-select.
- Build `/app/api/newsletter/subscribe` route handler (insert + duplicate-email handling + unsubscribe token generation).
- Build React Email templates (session reminder, welcome, unsubscribe confirmation).
- Build `/app/api/cron/reminders` handler: match upcoming sessions to subscriber windows, dedupe via `email_logs` unique constraint, send via Resend, log to `cron_logs`.
- Configure `vercel.json` cron entry (every 5 minutes).

**Exit criteria:** end-to-end test: subscribe → mock an imminent session → cron run sends exactly one email per subscriber per window → verified in `email_logs`; unsubscribe link works and stops future sends.

---

## Phase 9 — Motion Polish, Micro-interactions & Cross-Section Animation Pass

**Tasks**
- Full pass applying Motion/GSAP/Lenis per `design.md` §6 and `rules.md` §5 across every section: reveals, staggers, magnetic buttons, 3D tilt cards, animated counters, marquees.
- Cursor effects (desktop only): magnetic buttons, custom cursor glow following pointer over interactive zones.
- Verify `prefers-reduced-motion` and the in-app motion toggle disable all non-essential animation app-wide.
- Performance pass: audit every animated component in Chrome DevTools for dropped frames; convert any layout-thrashing animation to transform/opacity-only.

**Exit criteria:** 60fps maintained during scroll on a mid-tier mobile device (throttled CPU test); zero animation runs when reduced-motion is set; no CLS introduced by any animation.

---

## Phase 10 — Testing, Accessibility, SEO & Performance Hardening

**Tasks**
- Full Vitest coverage pass on `lib/`, `hooks/`, `store/`.
- Playwright e2e suite: full page load, hero/countdown, settings persistence, search, newsletter subscribe flow, keyboard-only navigation pass.
- Axe-core automated accessibility scan integrated into Playwright CI job — zero critical/serious violations.
- SEO: dynamic per-section metadata, OpenGraph/Twitter card image generation (`opengraph-image.tsx`), JSON-LD `SportsEvent` structured data for next race, `sitemap.ts`, `robots.ts`.
- Lighthouse CI integrated into GitHub Actions, gating merges below 100/100/100/100 (Perf/A11y/BP/SEO) with documented exceptions if truly unreachable.
- Bundle analysis (`@next/bundle-analyzer`) — trim anything unjustified.

**Exit criteria:** Lighthouse CI passes at 100 across all four categories on the deployed preview; Playwright + axe-core CI job green; unit coverage ≥ 85% on `lib/`+`hooks/`.

---

## Phase 11 — Deployment & Launch

**Tasks**
- Provision production Vercel project, connect GitHub repo, configure environment variables (Supabase, Upstash, Resend, OpenWeather keys) in Vercel dashboard.
- Provision production Supabase project, run migrations, verify RLS policies (public insert-only on `newsletter_subscribers`, service-role-only on `email_logs`/`cron_logs`).
- Provision production Upstash Redis instance, wire REST credentials.
- Verify `vercel.json` cron is active in production.
- Domain setup + SSL (Vercel automatic).
- Final production smoke test: real live-session fixture during an actual F1 session if timing allows, otherwise a scripted mock.
- Write `README.md` with setup, env vars, architecture summary, and contribution guide.
- Tag `v1.0.0` release.

**Exit criteria:** production URL live, all sections functional with real data, cron confirmed firing in Vercel logs, Lighthouse 100 confirmed on production (not just preview), README complete.

---

## Post-Launch (Future Premium Features — not in v1 scope)

- Push notifications (Web Push) as an alternative to email reminders.
- Multi-language UI translation (beyond timezone/locale detection).
- Fantasy-style prediction game (no real-money, purely for engagement).
- PWA/offline shell for the schedule/calendar sections.
- Historical season "rewind" mode with animated replay of standings evolution.
