import {
  PLAYER_POLL_INTERVAL_MS,
  REVIEW_POLL_INTERVAL_MS,
  PRICE_POLL_INTERVAL_MS,
  FOLLOWER_POLL_INTERVAL_MS,
} from "../config.js";
import {
  fetchCurrentPlayers,
  fetchReviewsSummary,
  fetchAppDetails,
  fetchFollowerCount,
} from "./steam.js";
import {
  storePlayerSnapshot,
  storeReviewSnapshot,
  storePriceSnapshot,
  storeFollowerSnapshot,
} from "./games.js";

function startPoller(
  name: string,
  appIds: number[],
  intervalMs: number,
  run: (appId: number) => Promise<void>,
): void {
  if (appIds.length === 0) return;
  const staggerMs = Math.floor(intervalMs / appIds.length);

  appIds.forEach((appId, i) => {
    const tick = async () => {
      try {
        await run(appId);
      } catch (err) {
        console.error(`[poller:${name}] ${appId}:`, (err as Error).message);
      }
    };

    setTimeout(() => {
      tick();
      setInterval(tick, intervalMs);
    }, i * staggerMs);
  });

  console.log(
    `Poller "${name}" started: ${appIds.length} games every ${intervalMs}ms (${staggerMs}ms stagger)`,
  );
}

export function startPlayerPoller(appIds: number[]): void {
  startPoller("players", appIds, PLAYER_POLL_INTERVAL_MS, async (appId) => {
    const count = await fetchCurrentPlayers(appId);
    await storePlayerSnapshot(appId, count);
    console.log(`[poller:players] ${appId}: ${count} current players`);
  });
}

export function startReviewPoller(appIds: number[]): void {
  startPoller("reviews", appIds, REVIEW_POLL_INTERVAL_MS, async (appId) => {
    const summary = await fetchReviewsSummary(appId);
    await storeReviewSnapshot(
      appId,
      summary.total_reviews,
      summary.total_positive,
      summary.total_negative,
    );
    console.log(`[poller:reviews] ${appId}: ${summary.total_reviews} reviews`);
  });
}

export function startPricePoller(appIds: number[]): void {
  startPoller("price", appIds, PRICE_POLL_INTERVAL_MS, async (appId) => {
    const details = await fetchAppDetails(appId);
    if (details?.price_overview) {
      await storePriceSnapshot(
        appId,
        details.price_overview.final,
        details.price_overview.discount_percent,
      );
      console.log(
        `[poller:price] ${appId}: $${(details.price_overview.final / 100).toFixed(2)}`,
      );
    }
  });
}

export function startFollowerPoller(appIds: number[]): void {
  startPoller("followers", appIds, FOLLOWER_POLL_INTERVAL_MS, async (appId) => {
    const count = await fetchFollowerCount(appId);
    await storeFollowerSnapshot(appId, count);
    console.log(`[poller:followers] ${appId}: ${count} followers`);
  });
}
