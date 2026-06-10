import SearchBar from "./components/SearchBar";

const BALATRO_APP_ID = 2379780;

interface Game {
  name: string;
  release_date: string;
  developer: string[];
  publisher: string[];
}

export default async function Home() {
  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3001";

  let game: Game | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${backendUrl}/api/games/${BALATRO_APP_ID}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      game = await res.json();
    } else {
      error = "Game data not available yet.";
    }
  } catch {
    error = "Could not connect to backend.";
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          SteamInsights
        </h1>

        <div className="mb-8 mt-8">
          <SearchBar />
        </div>

        {error && (
          <p className="mt-8 text-zinc-500 dark:text-zinc-400">{error}</p>
        )}

        {game && (
          <section className="mt-8 space-y-4">
            <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">
              {game.name}
            </h2>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-zinc-600 dark:text-zinc-400">
              <dt className="font-medium text-zinc-500 dark:text-zinc-300">Release date</dt>
              <dd>{game.release_date}</dd>
              <dt className="font-medium text-zinc-500 dark:text-zinc-300">Developer</dt>
              <dd>{game.developer.join(", ")}</dd>
              <dt className="font-medium text-zinc-500 dark:text-zinc-300">Publisher</dt>
              <dd>{game.publisher.join(", ")}</dd>
            </dl>
          </section>
        )}
      </main>
    </div>
  );
}
