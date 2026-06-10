import { Router } from "express";
import {
  fetchAppDetails,
  fetchCurrentPlayers,
  fetchReviewsSummary,
  fetchAchievementPercentages,
} from "../services/steam.js";
import { upsertGame } from "../services/games.js";

const router = Router();

router.get("/:appId", async (req, res, next) => {
  try {
    const appId = Number(req.params.appId);
    if (Number.isNaN(appId)) {
      res.status(400).json({ error: "Invalid appId" });
      return;
    }

    const [appDetails, currentPlayers, reviews, achievements] = await Promise.all([
      fetchAppDetails(appId),
      fetchCurrentPlayers(appId),
      fetchReviewsSummary(appId),
      fetchAchievementPercentages(appId),
    ]);

    if (appDetails) {
      await upsertGame({
        appId,
        name: appDetails.name,
        releaseDate: appDetails.release_date.date,
        developers: appDetails.developers,
        publishers: appDetails.publishers,
      });
    }

    res.json({
      appId,
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
