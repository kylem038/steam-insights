import GamesClient from "./components/GamesClient";

interface Game {
  app_id: number;
  name: string;
  release_date: string;
  developer: string[];
  publisher: string[];
}

export default async function Home() {
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3001";

  let games: Game[] = [];
  let fetchError: string | null = null;

  try {
    const res = await fetch(`${backendUrl}/api/games/supported`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      games = await res.json();
    } else {
      fetchError = "Failed to load games.";
    }
  } catch {
    fetchError = "Could not connect to backend.";
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          SteamInsights
        </h1>

        <div className="mt-8">
          <GamesClient games={games} fetchError={fetchError} />
        </div>
      </main>
    </div>
  );
}
