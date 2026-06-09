import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import pool from "./pool.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const RAW_API_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS raw_api_responses (
    id            SERIAL PRIMARY KEY,
    source        VARCHAR(64)  NOT NULL,
    app_id        INTEGER      NOT NULL,
    retrieved_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    payload_json  JSONB        NOT NULL
  );
`;

export async function initDb(): Promise<void> {
  await pool.query(RAW_API_TABLE_SQL);
  console.log("Database initialized: raw_api_responses table ready");

  const schemaPath = resolve(__dirname, "../../../database/schema/init.sql");
  const schemaSql = readFileSync(schemaPath, "utf-8");
  await pool.query(schemaSql);
  console.log("Database initialized: game schema tables ready");
}
