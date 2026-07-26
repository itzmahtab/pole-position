# rules.md — Engineering & AI-Assistant Rules for Pole Position

These rules apply to any human or AI (Cursor, Claude Code, Copilot) contributing to this repo.

## 1. General Principles

- Server Components by default. Add `"use client"` only when the component needs state, effects, refs, or browser APIs.
- Never fetch external APIs (OpenF1, Jolpica, OpenWeather, etc.) directly from client components — always go through an internal `/app/api/f1/*` route handler.
- Every network call must go through `fetchWithFallback()` (see architecture.md §6). No raw `fetch()` to third-party hosts outside `lib/api/`.
- No `any`. TypeScript strict mode is non-negotiable. All external API responses are validated with Zod schemas in `types/`.
- No dead code, no commented-out blocks committed to `main`.
- Every exported function/component has a one-line JSDoc if its purpose isn't obvious from its name.

## 2. File & Naming Conventions

- Components: `PascalCase.tsx`. Hooks: `useCamelCase.ts`. Utilities: `camelCase.ts`.
- One component per file. Co-locate a component's skeleton/loading variant as `Name.skeleton.tsx`.
- Section folders under `components/sections/` are kebab-case (`weekend-timeline/`).
- Route handlers always named `route.ts`, colocated by resource, not by HTTP verb.
- Tests mirror source path: `lib/time/relative.ts` → `tests/unit/lib/time/relative.test.ts`.

## 3. Data & Types

- Every OpenF1 / Jolpica shape gets a Zod schema in `types/` — parse-don't-trust at the API boundary, never trust `any` JSON blindly.
- All timestamps stored/passed as UTC ISO 8601 strings; conversion to local time happens only at the render boundary via `lib/time/`.
- Never persist secrets (API keys, Supabase service role, Resend key) in client bundles. All keys live in server-only env vars (`.env.local`, never `NEXT_PUBLIC_*` unless truly public).

## 4. Component Rules

- Props are explicit interfaces, never inline object types for anything reused twice.
- No prop-drilling more than 2 levels — lift to Zustand or context at that point.
- Every interactive element has a visible focus state and a minimum 44×44px tap target on mobile.
- Every image uses `next/image` with explicit `width`/`height` or `fill` + a sized parent — no CLS.
- Empty/error/loading states are mandatory for every data-driven section — never ship a section that can render blank.

## 5. Animation Rules

- **One engine owns one job**: Lenis = scroll physics only. GSAP ScrollTrigger = scroll-linked timelines/pinning/horizontal sections. Motion (Framer Motion) = component enter/exit and hover/tap micro-interactions. Do not use two engines to animate the same property on the same element.
- All animations must check `prefers-reduced-motion` and degrade to instant/opacity-only transitions when set, or when the user disables "Animations" in the Settings Drawer.
- No animation blocks interactivity — CSS `will-change` used sparingly and removed after animation completes.
- Scroll-triggered animations use `IntersectionObserver`-backed triggers (GSAP ScrollTrigger default) — never scroll-position math done by hand.
- Target 60fps; any animation causing dropped frames in Chrome DevTools Performance panel must be simplified before merge.

## 6. Performance Rules

- Every new dependency must be justified — check bundle impact with `next build` output before merging.
- Dynamic import anything below the fold that isn't needed for LCP (`next/dynamic` with `ssr: false` only for browser-only widgets like the track map).
- No client-side data fetching waterfalls — use TanStack Query with proper `staleTime`/`refetchInterval`, never nested sequential `useEffect` fetches.
- Images: served via `next/image`, AVIF/WebP, responsive `sizes`.
- Fonts: `next/font`, self-hosted, `display: swap`.

## 7. Accessibility Rules

- All interactive components come from shadcn/ui or Radix primitives (accessible by default) — do not hand-roll a dropdown/modal/tooltip from scratch.
- Every icon-only button has an `aria-label`.
- Color is never the only signal (e.g., live status uses icon + text + color).
- Full page must be navigable by keyboard alone, including the settings drawer and search command palette.
- Run `axe-core` in CI via Playwright accessibility checks — zero critical violations to merge.

## 8. Testing Rules

- Unit tests (Vitest) required for: `lib/time/*`, `lib/api/fetchWithFallback`, all custom hooks, Zod schema parsing.
- Playwright e2e smoke suite covers: page loads, hero renders, countdown ticks, settings drawer opens/persists, newsletter form submits, search returns results.
- No PR merges with failing tests or reduced coverage on `lib/` and `hooks/`.
- Visual regression not required for v1, but animation-heavy components should have a documented manual QA checklist in the PR description.

## 9. Git & Commit Rules

- Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`, `perf:`, `style:`.
- One logical change per commit; no `wip` commits on `main`.
- Husky pre-commit: lint-staged (ESLint + Prettier) + typecheck.
- Husky pre-push: unit tests.
- Branch naming: `phase-N/short-description` (matches phases.md numbering).

## 10. Cursor / Claude Code AI Rules

- Always read `architecture.md` and `design.md` before generating new components — do not invent a different folder structure or design token set.
- Never introduce a new animation library beyond Motion/GSAP/Lenis.
- Never call third-party APIs from a client component — flag it if asked to.
- When adding a new OpenF1/Jolpica endpoint, always: (1) add Zod schema, (2) add route handler with `fetchWithFallback`, (3) add a typed hook, (4) add unit test for the hook's derived state.
- Prefer editing/extending existing shared components (`components/shared/`) over creating near-duplicates.
- Any new environment variable must be added to `.env.example` with a comment explaining it.

## 11. Definition of Done (per feature)

A feature is done when: it has server + client states handled, loading/error/empty UI, passes typecheck+lint+tests, respects reduced-motion, is keyboard accessible, and does not regress Lighthouse scores in CI.
