import { fetchAppDetails } from "./steam.js";
import { upsertGame } from "./games.js";

export async function seedGame(appId: number): Promise<void> {
  const details = await fetchAppDetails(appId);
  if (!details) {
    console.warn(`Seed: could not fetch app details for app ID ${appId}`);
    return;
  }
  await upsertGame({
    appId,
    name: details.name,
    releaseDate: details.release_date.date,
    developers: details.developers,
    publishers: details.publishers,
  });
  console.log(`Seed: upserted game "${details.name}" (${appId})`);
}
