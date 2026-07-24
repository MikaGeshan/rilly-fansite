---
name: testing-error-states
description: Test error-handling / failure-path UI in the rilly-fansite Next.js app (e.g. gallery fetch failures, error banners, retry buttons). Use when verifying that errors are surfaced to the user instead of silently swallowed.
---

# Testing error states in rilly-fansite

Next.js 16 (App Router) fansite. Data sources: Supabase (`src/lib/supabase.ts`, used by `/gallery`) and the JKT48 API proxied through `src/app/api/schedule/route.ts` (used by `/profile`).

## Local setup
- `npm ci` (bun is referenced in README but not installed on the box; npm works).
- The `next build`/`next dev` CSS step needs native binaries that `ignoreScripts` in `package.json` skips. If a build fails with `Cannot find module '../lightningcss.linux-x64-gnu.node'`, install the platform binaries: `npm install lightningcss-linux-x64-gnu @tailwindcss/oxide-linux-x64-gnu --no-save`.
- Create `.env.local` with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. Missing/empty values make `createClient` throw `supabaseUrl is required` at import time, which breaks the build/prerender — so always set *something* well-formed.
- Start with `npm run dev` (http://localhost:3000). Remove `.env.local` when done.

## Triggering failure paths without real credentials
The most reliable way to exercise error-handling UI is to make the upstream request fail while keeping the client constructible:
- **Gallery / Supabase**: point `NEXT_PUBLIC_SUPABASE_URL` at a well-formed but unreachable host, e.g. `https://nonexistent-xyz.supabase.co`. `createClient` succeeds, but `.from().select()` rejects → the `catch` in `loadScrapedMedia` runs. Expected UI (`src/app/gallery/page.tsx`): error card with "Gagal Memuat Galeri" + "Coba Lagi" retry button (rendered when `error && items.length === 0`), distinct from the empty state ("Galeri Kosong"). Verify `console.error("Could not load scraped media from Supabase")` fires via `browser_console`.
- The DNS failure can take ~5-8s; wait and re-screenshot rather than assuming it hung.
- A retry button that just re-calls the loader (`loadScrapedMedia(1, true)`) is verifiable by watching the loading spinner ("Memuat Galeri Rilly...") reappear, then the error card return.

## Adversarial note
A broken/old implementation swallowed the error and showed the generic empty state. So assert on the *error-specific* heading/button text, not just "gallery not populated" — those look different and distinguish working vs. broken.

## Known pre-existing lint issues (unrelated to error handling)
`npm run lint` reports 2 errors in `gallery/page.tsx`: `@typescript-eslint/no-explicit-any` and `react-hooks/set-state-in-effect`. No CI workflow exists in the repo. Don't attribute these to error-handling changes.

## Devin Secrets Needed
- None strictly required for failure-path testing (fake env values suffice). To test the *success*/populated path you would need real `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` pointing at a Supabase project with a populated `media` table.
