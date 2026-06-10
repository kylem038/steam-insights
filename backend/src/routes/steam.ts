import { Router } from "express";
import {
  fetchAppDetails,
  fetchCurrentPlayers,
  fetchReviewsSummary,
  fetchAchievementPercentages,
} from "../services/steam.js";
import { upsertGame } from "../services/games.js";

const BALATRO_APP_ID = 2379780;

const router = Router();

router.get("/balatro", async (_req, res, next) => {
  try {
    const [appDetails, currentPlayers, reviews, achievements] = await Promise.all([
      fetchAppDetails(BALATRO_APP_ID),
      fetchCurrentPlayers(BALATRO_APP_ID),
      fetchReviewsSummary(BALATRO_APP_ID),
      fetchAchievementPercentages(BALATRO_APP_ID),
    ]);

    if (appDetails) {
      await upsertGame({
        appId: BALATRO_APP_ID,
        name: appDetails.name,
        releaseDate: appDetails.release_date.date,
        developers: appDetails.developers,
        publishers: appDetails.publishers,
      });
    }

    res.json({
      appId: BALATRO_APP_ID,
      name: appDetails?.name ?? null,
      appDetails,
      currentPlayers,
      reviews,
      achievements,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
