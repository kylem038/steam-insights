import pool from "./pool.js";

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS raw_api_responses (
    id            SERIAL PRIMARY KEY,
    source        VARCHAR(64)  NOT NULL,
    app_id        INTEGER      NOT NULL,
    retrieved_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    payload_json  JSONB        NOT NULL
  );
`;

export async function initDb(): Promise<void> {
  await pool.query(CREATE_TABLE_SQL);
  console.log("Database initialized: raw_api_responses table ready");
}
