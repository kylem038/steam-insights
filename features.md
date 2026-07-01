## Unreleased Game Handling

Gracefully handles games that haven't released yet on Steam. When `release_date.coming_soon` is `true` from the Steam API, the backend stores `coming_soon = true` in the `games` table. The frontend detail page hides player count, price, reviews, and the player history chart, but still shows the follower chart — valuable pre-release market intelligence.

**Key files:**
- `frontend/e2e/tests/unreleased-game.spec.ts` — E2E test covering the unreleased game detail page
- `frontend/e2e/mock-api/server.mjs` — Mock fixture for app_id `654321` (unreleased)
- `frontend/app/games/[appId]/page.tsx` — Conditional rendering based on `coming_soon`
- `backend/src/db/init.ts` — Schema migration adding `coming_soon` column
- `backend/src/services/games.ts` — Backend service with `coming_soon` field

## Next.js Image Component

Replaced the `<img>` tag in `GameHeaderImage.tsx` with Next.js's `<Image>` component for automatic image optimization. Configured `remotePatterns` in `next.config.ts` for Steam CDN domains and set `qualities: [75]` (required by Next.js 16).

**Key files:**
- `frontend/app/components/GameHeaderImage.tsx` — Uses `<Image>` with explicit `width={460}`, `height={215}`, responsive sizing, and `onError` fallback
- `frontend/next.config.ts` — `remotePatterns` for 6 Steam CDN domains; `qualities: [75]`
