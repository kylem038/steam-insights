import pool from "./pool.js";

const RAW_API_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS raw_api_responses (
    id            SERIAL PRIMARY KEY,
    source        VARCHAR(64)  NOT NULL,
    app_id        INTEGER      NOT NULL,
    retrieved_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    payload_json  JSONB        NOT NULL
  );
`;

const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS games (
    app_id        INTEGER PRIMARY KEY,
    name          TEXT NOT NULL,
    release_date  TEXT,
    developer     TEXT[],
    publisher     TEXT[],
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS players_snapshot (
    id              SERIAL PRIMARY KEY,
    app_id          INTEGER NOT NULL REFERENCES games(app_id),
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    current_players INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_players_snapshot_app_ts
    ON players_snapshot (app_id, timestamp);

  CREATE TABLE IF NOT EXISTS reviews_snapshot (
    id               SERIAL PRIMARY KEY,
    app_id           INTEGER NOT NULL REFERENCES games(app_id),
    timestamp        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    review_count     INTEGER NOT NULL,
    positive_reviews INTEGER NOT NULL,
    negative_reviews INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_reviews_snapshot_app_ts
    ON reviews_snapshot (app_id, timestamp);

  CREATE TABLE IF NOT EXISTS price_history (
    id              SERIAL PRIMARY KEY,
    app_id          INTEGER NOT NULL REFERENCES games(app_id),
    timestamp       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    price_usd       INTEGER NOT NULL,
    discount_percent INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_price_history_app_ts
    ON price_history (app_id, timestamp);

  CREATE TABLE IF NOT EXISTS tags (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS game_tags (
    app_id INTEGER NOT NULL REFERENCES games(app_id),
    tag_id INTEGER NOT NULL REFERENCES tags(id),
    PRIMARY KEY (app_id, tag_id)
  );

  CREATE TABLE IF NOT EXISTS estimates (
    id                SERIAL PRIMARY KEY,
    app_id            INTEGER NOT NULL REFERENCES games(app_id),
    timestamp         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estimated_owners  BIGINT,
    estimated_revenue BIGINT,
    estimated_wishlists BIGINT,
    confidence_score  NUMERIC(3,2)
  );

  CREATE INDEX IF NOT EXISTS idx_estimates_app_ts
    ON estimates (app_id, timestamp);
`;

export async function initDb(): Promise<void> {
  await pool.query(RAW_API_TABLE_SQL);
  console.log("Database initialized: raw_api_responses table ready");

  await pool.query(SCHEMA_SQL);
  console.log("Database initialized: game schema tables ready");
}
