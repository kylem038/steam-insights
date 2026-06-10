import Link from "next/link";
import SearchBar from "./components/SearchBar";

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

        <div className="mb-12 mt-8">
          <SearchBar />
        </div>

        <section>
          <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6">
            Supported games
          </h2>

          {fetchError && (
            <p className="text-zinc-500 dark:text-zinc-400">{fetchError}</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((game) => (
              <Link
                key={game.app_id}
                href={`/games/${game.app_id}`}
                className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors bg-white dark:bg-zinc-900"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {game.name}
                </h3>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="text-zinc-400 dark:text-zinc-500">Developer: </span>
                  {game.developer.join(", ")}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  <span className="text-zinc-400 dark:text-zinc-500">Publisher: </span>
                  {game.publisher.join(", ")}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
