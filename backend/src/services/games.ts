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
