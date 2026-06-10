import Link from "next/link";

interface Game {
  name: string;
  release_date: string;
  developer: string[];
  publisher: string[];
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId: appIdStr } = await params;
  const appId = Number(appIdStr);
  if (Number.isNaN(appId)) return <InvalidId />;

  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:3001";

  let game: Game | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${backendUrl}/api/games/${appId}`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      game = await res.json();
    } else if (res.status === 404) {
      error = "Game not found.";
    } else {
      error = "Failed to load game data.";
    }
  } catch {
    error = "Could not connect to backend.";
  }

  if (!game) {
    return (
      <NotFoundPage appId={appId} error={error} />
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          &larr; Back to home
        </Link>

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-6">
          {game.name}
        </h1>

        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-zinc-600 dark:text-zinc-400">
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">App ID</dt>
          <dd>{appId}</dd>
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">Release date</dt>
          <dd>{game.release_date}</dd>
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">Developer</dt>
          <dd>{game.developer.join(", ")}</dd>
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">Publisher</dt>
          <dd>{game.publisher.join(", ")}</dd>
        </dl>
      </main>
    </div>
  );
}

function InvalidId() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <p className="text-zinc-500 dark:text-zinc-400">Invalid game ID.</p>
      <Link href="/" className="mt-4 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
        &larr; Back to home
      </Link>
    </div>
  );
}

function NotFoundPage({ appId, error }: { appId: number; error: string | null }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">Game not found</h1>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        {error ?? `No data for app ID ${appId}.`}
      </p>
      <Link href="/" className="mt-6 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
        &larr; Back to home
      </Link>
    </div>
  );
}
