import { SUPPORTED_APP_IDS } from "../config.js";
import pool from "../db/pool.js";

export interface GameRecord {
  app_id: number;
  name: string;
  release_date: string | null;
  developer: string[];
  publisher: string[];
  created_at: Date;
  updated_at: Date;
}

export interface GameSearchResult {
  app_id: number;
  name: string;
}

export async function getGame(appId: number): Promise<GameRecord | null> {
  const result = await pool.query<GameRecord>(
    "SELECT * FROM games WHERE app_id = $1",
    [appId],
  );
  return result.rows[0] ?? null;
}

export async function searchGames(query: string): Promise<GameSearchResult[]> {
  const result = await pool.query<GameSearchResult>(
    "SELECT app_id, name FROM games WHERE name ILIKE $1 ORDER BY name LIMIT 10",
    [`${query}%`],
  );
  return result.rows;
}

export async function getSupportedGames(): Promise<GameRecord[]> {
  const result = await pool.query<GameRecord>(
    "SELECT * FROM games WHERE app_id = ANY($1) ORDER BY name",
    [SUPPORTED_APP_IDS],
  );
  return result.rows;
}

export interface PlayerSnapshot {
  current_players: number;
  timestamp: Date;
}

export interface ReviewSnapshot {
  review_count: number;
  positive_reviews: number;
  negative_reviews: number;
  timestamp: Date;
}

export interface PriceSnapshot {
  price_usd: number;
  discount_percent: number;
  timestamp: Date;
}

export interface GameDetail {
  app_id: number;
  name: string;
  release_date: string | null;
  developer: string[];
  publisher: string[];
  current_players: number | null;
  reviews: {
    total: number;
    positive: number;
    negative: number;
  } | null;
  price: {
    usd: number;
    discount_percent: number;
  } | null;
  snapshots_updated_at: Date | null;
}

export async function storePlayerSnapshot(appId: number, currentPlayers: number): Promise<void> {
  await pool.query(
    `INSERT INTO players_snapshot (app_id, current_players) VALUES ($1, $2)`,
    [appId, currentPlayers],
  );
}

export async function storeReviewSnapshot(
  appId: number,
  reviewCount: number,
  positive: number,
  negative: number,
): Promise<void> {
  await pool.query(
    `INSERT INTO reviews_snapshot (app_id, review_count, positive_reviews, negative_reviews) VALUES ($1, $2, $3, $4)`,
    [appId, reviewCount, positive, negative],
  );
}

export async function storePriceSnapshot(appId: number, priceUsd: number, discountPercent: number): Promise<void> {
  await pool.query(
    `INSERT INTO price_history (app_id, price_usd, discount_percent) VALUES ($1, $2, $3)`,
    [appId, priceUsd, discountPercent],
  );
}

export async function getGameDetails(appId: number): Promise<GameDetail | null> {
  const game = await getGame(appId);
  if (!game) return null;

  const players = await pool.query<PlayerSnapshot>(
    "SELECT current_players, timestamp FROM players_snapshot WHERE app_id = $1 ORDER BY timestamp DESC LIMIT 1",
    [appId],
  );
  const reviews = await pool.query<ReviewSnapshot>(
    "SELECT review_count, positive_reviews, negative_reviews, timestamp FROM reviews_snapshot WHERE app_id = $1 ORDER BY timestamp DESC LIMIT 1",
    [appId],
  );
  const price = await pool.query<PriceSnapshot>(
    "SELECT price_usd, discount_percent, timestamp FROM price_history WHERE app_id = $1 ORDER BY timestamp DESC LIMIT 1",
    [appId],
  );

  const snapTimestamps = [
    players.rows[0]?.timestamp,
    reviews.rows[0]?.timestamp,
    price.rows[0]?.timestamp,
  ].filter((t): t is Date => t != null);
  const snapshots_updated_at = snapTimestamps.length > 0
    ? new Date(Math.max(...snapTimestamps.map((t) => t.getTime())))
    : null;

  return {
    app_id: game.app_id,
    name: game.name,
    release_date: game.release_date,
    developer: game.developer,
    publisher: game.publisher,
    current_players: players.rows[0]?.current_players ?? null,
    reviews: reviews.rows[0]
      ? {
          total: reviews.rows[0].review_count,
          positive: reviews.rows[0].positive_reviews,
          negative: reviews.rows[0].negative_reviews,
        }
      : null,
    price: price.rows[0]
      ? {
          usd: price.rows[0].price_usd,
          discount_percent: price.rows[0].discount_percent,
        }
      : null,
    snapshots_updated_at,
  };
}

export async function upsertGame(data: {
  appId: number;
  name: string;
  releaseDate: string | null;
  developers: string[];
  publishers: string[];
}): Promise<void> {
  await pool.query(
    `INSERT INTO games (app_id, name, release_date, developer, publisher)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (app_id) DO UPDATE SET
       name = EXCLUDED.name,
       release_date = EXCLUDED.release_date,
       developer = EXCLUDED.developer,
       publisher = EXCLUDED.publisher,
       updated_at = NOW()`,
    [data.appId, data.name, data.releaseDate, data.developers, data.publishers],
  );
}
