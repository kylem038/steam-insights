import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err: Error) => {
  console.error("PostgreSQL pool error:", err.message);
});

export default pool;
