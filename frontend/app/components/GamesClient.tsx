"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import GameGrid from "./GameGrid";

interface Game {
  app_id: number;
  name: string;
  release_date: string;
  developer: string[];
  publisher: string[];
}

interface GamesClientProps {
  games: Game[];
  fetchError?: string | null;
}

export default function GamesClient({ games, fetchError }: GamesClientProps) {
  const [query, setQuery] = useState("");

  const filtered = query
    ? games.filter((g) => {
        const normalized = g.name.toLowerCase().replace(/[-_]/g, " ");
        const tokens = query.toLowerCase().trim().split(/\s+/);
        return tokens.every((t) => normalized.includes(t));
      })
    : games;

  return (
    <>
      <div className="mb-6">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      <section>
        <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6">
          Supported games{query ? ` (${filtered.length})` : ""}
        </h2>

        {fetchError && (
          <p className="text-zinc-500 dark:text-zinc-400">{fetchError}</p>
        )}

        <GameGrid games={filtered} />
      </section>
    </>
  );
}
