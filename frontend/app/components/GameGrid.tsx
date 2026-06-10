import Link from "next/link";

interface Game {
  app_id: number;
  name: string;
  release_date: string;
  developer: string[];
  publisher: string[];
}

interface GameGridProps {
  games: Game[];
}

export default function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400">No games match your search.</p>
    );
  }

  return (
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
  );
}
