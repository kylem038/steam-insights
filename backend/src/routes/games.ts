import { Router } from "express";
import { getGame } from "../services/games.js";

const router = Router();

router.get("/:appId", async (req, res) => {
  const appId = Number(req.params.appId);
  if (Number.isNaN(appId)) {
    res.status(400).json({ error: "Invalid appId" });
    return;
  }
  const game = await getGame(appId);
  if (!game) {
    res.status(404).json({ error: "Game not found" });
    return;
  }
  res.json(game);
});

export default router;
