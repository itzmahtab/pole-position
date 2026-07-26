# PRD.md — Pole Position (F1 Live Dashboard)

## 1. Project Identity

**Working name:** Pole Position

**Alternative names (pick one before Phase 1):**
1. Apex Feed
2. Grid Live
3. Chequered
4. Redline HQ
5. Formation Lap
6. Race Trace
7. Slipstream
8. Track Pulse
9. Grand Prix Now
10. Full Throttle Feed
11. Circuit Sense
12. Lights Out (F1 idiom for race start)
13. DRS Zone
14. Podium Watch
15. Sector One
16. Fastest Lap
17. The Paddock
18. Overtake
19. Race Weekend
20. Telemetry

Recommendation: **Apex Feed** or **Grid Live** — short, ownable, works as a domain.

## 2. Vision Statement

A single-page, no-login, no-backend-account F1 companion that tells any fan, anywhere in the world, in their own timezone and language: *what's happening now, what's next, and how it started*. It should feel like Apple's product pages met F1 TV's broadcast graphics — premium motion, dense live data, zero friction.

## 3. Goals

- Non-authenticated, globally accessible, single URL, infinite-scroll storytelling page.
- Real-time (or near-real-time) session state derived from OpenF1 + Jolpica (Ergast successor) with automatic fallback.
- Automatic timezone/locale detection with manual override, persisted client-side.
- Lighthouse 100 across Performance / Accessibility / Best Practices / SEO.
- Entirely free-tier infrastructure (Vercel Hobby, Supabase free, Upstash free, Resend free tier).

## 4. Non-Goals

- No user accounts, no OAuth, no payments.
- No betting/odds features.
- No native mobile app (responsive web only).
- No write access to any official F1 data (read-only aggregation).

## 5. Target Users

| Persona | Need |
|---|---|
| Casual fan | "When's the next race, in my time?" |
| Hardcore fan | Live gaps, tyre strategy, sector colors during a session |
| Traveling fan | Timezone-correct schedule wherever they are |
| Stats fan | Historical winners, records, championship progression |
| Newsletter subscriber | Reminders before sessions start |

## 6. Core Feature Set (mapped to sections)

1. **Hero** — current/next race, huge countdown, animated background, live status badge.
2. **Upcoming Race** — country, circuit, flag, track image, weather.
3. **Weekend Timeline** — FP1–FP3/Sprint/Quali/Race with per-session local time + relative time ("in 3 hours").
4. **Live Countdown** — flip-clock style, second-accurate.
5. **Championship** — Drivers + Constructors standings (`championship_drivers`, `championship_teams`).
6. **Drivers / Constructors pages-in-scroll** — profile cards, team colors, comparison tool.
7. **Calendar** — full season, timezone-converted.
8. **Circuit Explorer** — animated SVG track, corners, DRS zones, lap record.
9. **Track Records / Historical Winners** — static + Ergast/Jolpica historical data.
10. **Live Events Feed** — race_control endpoint: flags, SC/VSC, pit stops, retirements.
11. **Pit Stop Strategy / Tyre Compounds** — stints endpoint visualized as strategy chart.
12. **Weather** — live (`weather` endpoint) + forecast (OpenWeather) fallback.
13. **Driver/Constructor Comparison** — side-by-side stat comparison tool.
14. **Session Results** — Quali/Sprint/Race results tables (`session_result`, `starting_grid`).
15. **Statistics** — fastest laps, points progression, championship battle chart.
16. **Season Timeline** — scroll-driven story of the season so far.
17. **Newsletter** — email capture + reminder preference (24h/12h/1h/15m before sessions).
18. **Settings Drawer** — theme, timezone, country, language, favorite driver, reminders, motion toggle.
19. **Search** — driver, circuit, constructor, race, country, season.

## 7. Data Sources & Fallback Order

| Domain | Primary | Fallback |
|---|---|---|
| Live session/car/timing data | OpenF1 | — (no live alt; degrade to "last known" state) |
| Schedule / historical results / standings | Jolpica API (Ergast-compatible) | Static JSON snapshot bundled at build time |
| Weather | OpenF1 `weather` (session only) | OpenWeather API (forecast, non-session times) |
| Flags/countries | FlagCDN + REST Countries API | Static flag asset bundle |
| Circuit maps/images | OpenF1 `meetings.circuit_image` + MultiViewer `circuit_info_url` | Wikipedia infobox image |

All fallback logic must be centralized (see architecture.md §6).

## 8. Localization & Timezone Requirements

- Detect via `Intl.DateTimeFormat().resolvedOptions().timeZone`, `navigator.language`, and IP-derived country (best-effort, no login).
- Show a dismissible banner: "We detected you're in Bangladesh — is this right?"
- All session times computed from UTC (`date_start`/`date_end`/`gmt_offset` from OpenF1) and rendered via the user's resolved timezone.
- Relative labels: `Today`, `Tomorrow`, `In 3 hours`, `Starting soon`, `Live`, `Finished`.
- Persist timezone/country/language/theme/favorites in `localStorage` under a single namespaced key.

## 9. Non-Functional Requirements

- **Performance:** Lighthouse 100 (Perf/A11y/BP/SEO); route-level streaming with Suspense; images via `next/image`; edge runtime for read-heavy API routes.
- **Accessibility:** full keyboard nav, ARIA landmarks/labels, visible focus rings, `prefers-reduced-motion` respected everywhere motion is used.
- **Resilience:** every external call wrapped in retry + timeout + fallback; UI never blocks on a failed fetch — always shows last-known-good data with a "stale" indicator.
- **SEO:** dynamic metadata per section anchor, OpenGraph/Twitter cards, JSON-LD `SportsEvent` structured data, dynamic sitemap, robots.txt.
- **Privacy:** no login; only PII collected is email (opt-in newsletter), stored in Supabase, deletable via unsubscribe link in every email.

## 10. Success Metrics

- Time-to-next-session-visible < 1s (perceived, via streaming skeleton → real data).
- < 2% fallback-API usage rate under normal operation (OpenF1 primary uptime dependent).
- Lighthouse scores maintained on every PR (CI gate).
- Newsletter reminder delivery success rate > 99% (Resend + Vercel Cron logs).

## 11. Risks

- OpenF1 has no official SLA — build for graceful degradation, not just error states.
- OpenF1 live endpoints only populate during actual sessions — hero/countdown must work perfectly in the 95% of time when nothing is live.
- Free-tier rate limits (Upstash, Supabase, Resend) — must cache aggressively and batch cron sends.
