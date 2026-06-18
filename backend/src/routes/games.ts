import { Router } from "express";
import { getGame, getGameDetails, getSupportedGames, searchGames } from "../services/games.js";
import pool from "../db/pool.js";

const router = Router();

router.get("/supported", async (_req, res, next) => {
  try {
    const games = await getSupportedGames();
    res.json(games);
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res) => {
  const q = String(req.query.q ?? "");
  if (!q) {
    res.json([]);
    return;
  }
  const results = await searchGames(q);
  res.json(results);
});

router.get("/:appId/details", async (req, res, next) => {
  try {
    const appId = Number(req.params.appId);
    if (Number.isNaN(appId)) {
      res.status(400).json({ error: "Invalid appId" });
      return;
    }
    const detail = await getGameDetails(appId);
    if (!detail) {
      res.status(404).json({ error: "Game not found" });
      return;
    }
    res.json(detail);
  } catch (err) {
    next(err);
  }
});

router.get("/:appId/players/history", async (req, res, next) => {
  try {
    const appId = Number(req.params.appId);
    if (Number.isNaN(appId)) {
      res.status(400).json({ error: "Invalid appId" });
      return;
    }
    const limit = Math.min(Number(req.query.limit) || 168, 720);
    const result = await pool.query(
      `SELECT current_players, timestamp FROM (
         SELECT current_players, timestamp
         FROM players_snapshot
         WHERE app_id = $1
         ORDER BY timestamp DESC
         LIMIT $2
       ) sub ORDER BY timestamp ASC`,
      [appId, limit],
    );
    res.json(
      result.rows.map((r) => ({
        players: r.current_players,
        timestamp: r.timestamp,
      })),
    );
  } catch (err) {
    next(err);
  }
});

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
