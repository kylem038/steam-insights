import {
  fetchAppDetails,
  fetchCurrentPlayers,
  fetchReviewsSummary,
} from "./steam.js";
import {
  upsertGame,
  storePlayerSnapshot,
  storeReviewSnapshot,
  storePriceSnapshot,
} from "./games.js";

export async function seedGame(appId: number): Promise<void> {
  const [details, currentPlayers, reviews] = await Promise.allSettled([
    fetchAppDetails(appId),
    fetchCurrentPlayers(appId),
    fetchReviewsSummary(appId),
  ]);

  if (details.status === "rejected" || !details.value) {
    console.warn(`Seed: could not fetch app details for app ID ${appId}`);
    return;
  }

  await upsertGame({
    appId,
    name: details.value.name,
    releaseDate: details.value.release_date.date,
    developers: details.value.developers,
    publishers: details.value.publishers,
  });

  if (currentPlayers.status === "fulfilled") {
    await storePlayerSnapshot(appId, currentPlayers.value);
  }

  if (reviews.status === "fulfilled") {
    await storeReviewSnapshot(
      appId,
      reviews.value.total_reviews,
      reviews.value.total_positive,
      reviews.value.total_negative,
    );
  }

  if (details.value.price_overview) {
    await storePriceSnapshot(
      appId,
      details.value.price_overview.final,
      details.value.price_overview.discount_percent,
    );
  }

  console.log(`Seed: upserted game "${details.value.name}" (${appId})`);
}
