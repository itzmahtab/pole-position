# design.md — Design System for Pole Position

## 1. Design Philosophy

Apple's restraint + Linear's precision + F1 TV's drama + Vercel's polish. Dark-mode first, high contrast, generous negative space, motion as a communication tool (not decoration). Every animation should tell the user something changed — never move for its own sake.

## 2. Theme Tokens (Tailwind v4 CSS variables)

```css
:root[data-theme="dark"] {
  /* Surfaces */
  --bg-base: #05070A;
  --bg-elevated: #0B0F14;
  --bg-glass: rgba(255, 255, 255, 0.04);
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);

  /* Text */
  --text-primary: #F5F7FA;
  --text-secondary: #9AA4B2;
  --text-muted: #5C6673;

  /* F1 Signal Colors */
  --racing-red: #E10600;       /* primary accent, live/urgent */
  --checkered-white: #FFFFFF;
  --safety-yellow: #FFD400;    /* caution / yellow flag */
  --sc-orange: #FF8C00;        /* safety car */
  --drs-green: #00D26A;        /* DRS active / positive delta */
  --purple-sector: #C724F5;    /* fastest sector/lap */
  --electric-blue: #2C8CFF;    /* links, info, secondary accent */

  /* Elevation / Glass */
  --glass-blur: 20px;
  --glow-red: 0 0 24px rgba(225, 6, 0, 0.45);
  --glow-green: 0 0 24px rgba(0, 210, 106, 0.4);

  /* Radii */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 24px;
  --radius-pill: 999px;
}

:root[data-theme="light"] {
  --bg-base: #F7F8FA;
  --bg-elevated: #FFFFFF;
  --bg-glass: rgba(10, 12, 16, 0.04);
  --border-subtle: rgba(10, 12, 16, 0.08);
  --text-primary: #0B0F14;
  --text-secondary: #4A5361;
  --text-muted: #8B93A1;
  /* signal colors unchanged for brand consistency */
}
```

Team colors are pulled live from OpenF1 `team_colour` (hex, no `#`) — normalize to `#RRGGBB` and use only for accents (driver chips, chart series, glow), never for body text/background to preserve contrast ratios.

## 3. Typography

- Display/headline font: a geometric grotesk (e.g., **"General Sans"** or **"Cabinet Grotesk"**, both free/open) — huge, tight tracking, used for hero countdown and section titles.
- Body/UI font: **"Inter"** (variable, via `next/font/google`), used for all data tables, labels, secondary text.
- Numeric/telemetry font: tabular-nums enabled everywhere numbers change live (lap times, gaps, countdown) to prevent layout shift — `font-variant-numeric: tabular-nums`.

| Token | Size (desktop) | Size (mobile) | Weight | Use |
|---|---|---|---|---|
| `display-xl` | 96px | 48px | 700 | Hero countdown digits |
| `display-lg` | 64px | 36px | 700 | Section headlines |
| `heading` | 32px | 24px | 600 | Card titles |
| `body-lg` | 18px | 16px | 400 | Lead paragraphs |
| `body` | 15px | 14px | 400 | Standard UI text |
| `caption` | 13px | 12px | 500 | Labels, timestamps, badges |
| `mono-data` | 15px | 14px | 500 | Lap times, gaps, telemetry |

## 4. Spacing & Grid

- 8px base unit, scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
- Max content width 1440px, section vertical rhythm: 128px desktop / 64px mobile between major sections.
- 12-column grid desktop, 4-column mobile, gutters 24px/16px.

## 5. Glassmorphism & Depth

- Cards: `background: var(--bg-glass)`, `backdrop-filter: blur(var(--glass-blur))`, `border: 1px solid var(--border-subtle)`, subtle inner highlight via `box-shadow: inset 0 1px 0 rgba(255,255,255,0.06)`.
- Layered depth via 3 elevation tiers (base → elevated → floating) each adding blur + shadow, never more than 3 to avoid mud.
- Noise texture: a fixed, fullscreen `<svg>` fractal-noise overlay at ~3% opacity, mix-blend `overlay`, to kill flat-gradient banding — respects `prefers-reduced-motion: no-preference` only for any animated variant (static noise otherwise).

## 6. Motion Principles

- **Easing:** primary ease `cubic-bezier(0.16, 1, 0.3, 1)` ("expo-out") for reveals; `cubic-bezier(0.4, 0, 0.2, 1)` for state toggles.
- **Durations:** micro-interactions 120–180ms, card reveals 400–600ms, page/section transitions 600–900ms, ambient/looping background motion 8–20s.
- **Stagger:** list/grid children stagger 40–60ms apart, capped at 8 items before switching to a single group fade.
- **Scroll-linked:** hero background parallax (mouse + scroll), track SVG path draws in as circuit section enters viewport, stat counters roll up when 50% in view, horizontal-scroll section for "Season Timeline".
- **Live indicators:** a pulsing dot (`--drs-green` when live, `--racing-red` when session imminent) using a 2s ease-in-out opacity/scale loop — always paired with the word "LIVE" for accessibility, never color alone.
- **Reduced motion:** all of the above collapse to opacity-only 150ms fades; parallax and SVG path-draw are disabled entirely.

## 7. Component Style Notes (shadcn/ui + Radix base)

- **Buttons:** pill radius, primary = racing-red gradient with subtle glow on hover, secondary = glass outline, magnetic hover effect (cursor-attraction, ±6px max offset) on desktop pointer devices only.
- **Cards:** glass surface, 3D tilt on mouse move (max 6° rotateX/Y, desktop only, disabled on touch), scale 1.02 on hover.
- **Flip clock (countdown):** each digit is an independent card that does a 3D flip (rotateX 180°) on change, tabular-nums, glow pulses red under 60s remaining.
- **Live status badge:** pill with pulsing dot + label (`UPCOMING` / `LIVE` / `BETWEEN SESSIONS` / `FINISHED`), color-coded per token above.
- **Track map (SVG):** stroke-dasharray path-draw animation on scroll-into-view, DRS zones rendered as green dashed overlays, corners numbered with small glass chips.
- **Marquee:** infinite horizontal scroll for constructor logos / sponsor-style ticker of latest results, pause on hover.
- **Command palette (search):** shadcn `Command` component, `⌘K` shortcut, fuzzy match across drivers/circuits/constructors/races/countries/seasons.
- **Settings drawer:** shadcn `Sheet` sliding from the right, grouped sections (Appearance, Region, Favorites, Reminders, Motion).

## 8. Responsive Breakpoints

```
sm: 640px   — single column, stacked cards, drawer becomes full-screen sheet
md: 768px   — 2-column grids begin
lg: 1024px  — full section layouts, horizontal-scroll sections activate
xl: 1280px  — max content width reached
2xl: 1536px — hero typography scales to display-xl
```

## 9. Iconography & Imagery

- **Lucide Icons** exclusively, 1.5px stroke, sized 16/20/24 tokens.
- Flags via FlagCDN (SVG), rendered in a subtle rounded-rect mask with 1px border.
- Circuit/track images via OpenF1 `circuit_image` with a dark gradient overlay for text legibility.
- Driver headshots via OpenF1 `headshot_url`, circular mask, team-color ring border.

## 10. Accessibility & Contrast

- Body text on `--bg-base`/`--bg-elevated` must meet WCAG AA (4.5:1) — verified for both themes.
- Signal colors (yellow/orange/green/purple) always paired with text/icon, never standalone meaning-carriers.
- Focus ring: 2px `--electric-blue` offset 2px, visible in both themes, never removed via `outline: none` without a replacement.
