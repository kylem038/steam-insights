import Link from "next/link";

interface GameDetail {
  app_id: number;
  name: string;
  release_date: string | null;
  developer: string[];
  publisher: string[];
  current_players: number | null;
  reviews: {
    total: number;
    positive: number;
    negative: number;
  } | null;
  price: {
    usd: number;
    discount_percent: number;
  } | null;
  snapshots_updated_at: string | null;
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

  let detail: GameDetail | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${backendUrl}/api/games/${appId}/details`, {
      cache: "no-store",
    });
    if (res.ok) {
      detail = await res.json();
    } else if (res.status === 404) {
      error = "Game not found.";
    } else {
      error = "Failed to load game data.";
    }
  } catch {
    error = "Could not connect to backend.";
  }

  if (!detail) {
    return <NotFoundPage appId={appId} error={error} />;
  }

  const formatPrice = (cents: number) =>
    `$${(cents / 100).toFixed(2)}`;

  return (
    <div className="flex flex-col min-h-screen p-8 bg-zinc-50 dark:bg-black">
      <main className="w-full max-w-2xl mx-auto">
        <Link
          href="/"
          className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          &larr; Back to home
        </Link>

        <img
          src={`https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/${detail.app_id}/header.jpg`}
          alt={`${detail.name} header image`}
          className="mt-6 w-full max-w-lg rounded-xl"
        />

        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mt-6">
          {detail.name}
        </h1>

        <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-zinc-600 dark:text-zinc-400">
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">App ID</dt>
          <dd>{detail.app_id}</dd>
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">Release date</dt>
          <dd>{detail.release_date ?? "\u2014"}</dd>
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">Developer</dt>
          <dd>{detail.developer.join(", ")}</dd>
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">Publisher</dt>
          <dd>{detail.publisher.join(", ")}</dd>
        </dl>

        <hr className="my-6 border-zinc-200 dark:border-zinc-800" />

        <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-zinc-600 dark:text-zinc-400">
          <dt className="font-medium text-zinc-500 dark:text-zinc-300">Current players</dt>
          <dd>{detail.current_players?.toLocaleString() ?? "\u2014"}</dd>

          {detail.reviews && (
            <>
              <dt className="font-medium text-zinc-500 dark:text-zinc-300">Total reviews</dt>
              <dd>{detail.reviews.total.toLocaleString()}</dd>
              <dt className="font-medium text-zinc-500 dark:text-zinc-300">Positive</dt>
              <dd className="text-green-600 dark:text-green-400">
                {detail.reviews.positive.toLocaleString()}
                {" "}
                ({Math.round((detail.reviews.positive / detail.reviews.total) * 100)}%)
              </dd>
              <dt className="font-medium text-zinc-500 dark:text-zinc-300">Negative</dt>
              <dd className="text-red-600 dark:text-red-400">
                {detail.reviews.negative.toLocaleString()}
                {" "}
                ({Math.round((detail.reviews.negative / detail.reviews.total) * 100)}%)
              </dd>
            </>
          )}

          {detail.price && (
            <>
              <dt className="font-medium text-zinc-500 dark:text-zinc-300">Price</dt>
              <dd>
                {detail.price.discount_percent > 0 ? (
                  <>
                    <span className="line-through text-zinc-400 dark:text-zinc-600">
                      {formatPrice(Math.round(detail.price.usd / (1 - detail.price.discount_percent / 100)))}
                    </span>
                    {" "}
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {formatPrice(detail.price.usd)}
                    </span>
                    {" "}
                    <span className="text-xs text-green-600 dark:text-green-400">
                      (-{detail.price.discount_percent}%)
                    </span>
                  </>
                ) : (
                  formatPrice(detail.price.usd)
                )}
              </dd>
            </>
          )}
        </dl>

        {detail.snapshots_updated_at && (
          <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-600">
            Data as of {new Date(detail.snapshots_updated_at).toLocaleString()}
          </p>
        )}
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
