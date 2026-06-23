import http from "http";

const MOCK_GAMES = [
  {
    app_id: 123456,
    name: "Test Game",
    release_date: "2024-01-15",
    developer: ["Test Dev", "Second Dev"],
    publisher: ["Test Publisher"],
  },
  {
    app_id: 789012,
    name: "Another Game",
    release_date: "2024-06-20",
    developer: ["Another Dev"],
    publisher: ["Another Publisher"],
  },
];

const MOCK_DETAILS = {
  123456: {
    app_id: 123456,
    name: "Test Game",
    release_date: "2024-01-15",
    developer: ["Test Dev", "Second Dev"],
    publisher: ["Test Publisher"],
    tags: ["tag1", "tag2", "tag3"],
    description: "A test game for integration testing",
    header_image: "https://example.com/image.jpg",
    price: { usd: 1999, discount_percent: 0 },
    reviews: { total: 1000, positive: 850, negative: 150 },
    current_players: 5000,
    snapshots_updated_at: null,
  },
};

const MOCK_HISTORY = [];

async function parseBody(req) {
  const buffers = [];
  for await (const chunk of req) buffers.push(chunk);
  return Buffer.concat(buffers).toString();
}

function json(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const path = url.pathname;

  if (req.method === "GET" && path === "/api/games/supported") {
    return json(res, 200, MOCK_GAMES);
  }

  const detailsMatch = path.match(/^\/api\/games\/(\d+)\/details$/);
  if (req.method === "GET" && detailsMatch) {
    const detail = MOCK_DETAILS[Number(detailsMatch[1])];
    if (detail) return json(res, 200, detail);
    return json(res, 404, { error: "Not found" });
  }

  const historyMatch = path.match(/^\/api\/games\/(\d+)\/players\/history$/);
  if (req.method === "GET" && historyMatch) {
    return json(res, 200, MOCK_HISTORY);
  }

  json(res, 404, { error: "Not found" });
});

const PORT = process.env.PORT ?? 3002;
server.listen(PORT, () => {
  console.log(`Mock API listening on http://0.0.0.0:${PORT}`);
});
