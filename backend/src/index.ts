import express from "express";
import steamRouter from "./routes/steam.js";
import { initDb } from "./db/init.js";

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  next();
});

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/steam", steamRouter);

try {
  await initDb();
} catch (err) {
  console.error("Failed to initialize database:", (err as Error).message);
}

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
