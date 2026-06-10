import Link from "next/link";
import SearchBar from "./components/SearchBar";

const SUPPORTED_APP_IDS = [2379780, 730, 570, 413150] as const;

interface Game {
  app_id: number;
  name: string;
  release_date: string;
  developer: string[];
  publisher: string[];
}

export default async function Home() {
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3001";

  const games = await Promise.all(
    SUPPORTED_APP_IDS.map(async (appId) => {
      try {
        const res = await fetch(`${backendUrl}/api/games/${appId}`, {
          next: { revalidate: 3600 },
        });
        if (res.ok) return { appId, game: (await res.json()) as Game, error: null };
        return { appId, game: null, error: "Not available yet." };
      } catch {
        return { appId, game: null, error: "Could not connect to backend." };
      }
    }),
  );

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map(({ appId, game, error }) => (
              <Link
                key={appId}
                href={`/games/${appId}`}
                className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors bg-white dark:bg-zinc-900"
              >
                {game ? (
                  <>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                      {game.name}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {game.developer.join(", ")}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {game.publisher.join(", ")}
                    </p>
                  </>
                ) : (
                  <div className="text-zinc-400 dark:text-zinc-600">
                    <h3 className="text-lg font-semibold">App {appId}</h3>
                    <p className="mt-1 text-sm">{error}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
