export interface SteamAppDetailsResponse {
  [appid: string]: {
    success: boolean;
    data?: {
      type: string;
      name: string;
      steam_appid: number;
      is_free: boolean;
      price_overview?: {
        currency: string;
        initial: number;
        final: number;
        discount_percent: number;
        final_formatted: string;
      };
      release_date: {
        coming_soon: boolean;
        date: string;
      };
      developers: string[];
      publishers: string[];
      categories: { id: number; description: string }[];
      genres: { id: string; description: string }[];
      achievements?: { total: number };
      recommendations?: { total: number };
      metacritic?: { score: number; url: string };
    };
  };
}

export interface CurrentPlayersResponse {
  response: {
    player_count: number;
    result: number;
  };
}

export interface ReviewsResponse {
  success: number;
  query_summary: {
    num_reviews: number;
    review_score: number;
    review_score_desc: string;
    total_positive: number;
    total_negative: number;
    total_reviews: number;
  };
}

export interface AchievementPercentagesResponse {
  achievementpercentages: {
    achievements: { name: string; percent: number }[];
  };
}

const STEAM_API_BASE = "https://api.steampowered.com";
const STEAM_STORE_BASE = "https://store.steampowered.com";

export async function fetchAppDetails(appId: number): Promise<SteamAppDetailsResponse[string]["data"] | null> {
  const res = await fetch(`${STEAM_STORE_BASE}/api/appdetails?appids=${appId}`, {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) throw new Error(`Steam appdetails returned ${res.status}`);
  const json: SteamAppDetailsResponse = await res.json();
  const entry = json[String(appId)];
  return entry?.success ? (entry.data ?? null) : null;
}

export async function fetchCurrentPlayers(appId: number): Promise<number> {
  const res = await fetch(
    `${STEAM_API_BASE}/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=${appId}`,
    { headers: { "Accept": "application/json" } },
  );
  if (!res.ok) throw new Error(`Steam current players returned ${res.status}`);
  const json: CurrentPlayersResponse = await res.json();
  return json.response.player_count;
}

export async function fetchReviewsSummary(appId: number): Promise<ReviewsResponse["query_summary"]> {
  const res = await fetch(
    `${STEAM_STORE_BASE}/appreviews/${appId}?json=1&filter=summary&num_per_page=0&language=all`,
    { headers: { "Accept": "application/json" } },
  );
  if (!res.ok) throw new Error(`Steam reviews returned ${res.status}`);
  const json: ReviewsResponse = await res.json();
  if (!json.success) throw new Error("Steam reviews returned unsuccessful response");
  return json.query_summary;
}

export async function fetchAchievementPercentages(appId: number): Promise<AchievementPercentagesResponse["achievementpercentages"]["achievements"]> {
  const res = await fetch(
    `${STEAM_API_BASE}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appId}`,
    { headers: { "Accept": "application/json" } },
  );
  if (!res.ok) throw new Error(`Steam achievements returned ${res.status}`);
  const json: AchievementPercentagesResponse = await res.json();
  return json.achievementpercentages.achievements;
}
