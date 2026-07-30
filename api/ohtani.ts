interface MlbStatResponse {
  stats?: Array<{ splits?: Array<{ stat?: Record<string, string | number> }> }>;
}

const PLAYER_ID = 660271;

// MLB Stats APIから大谷翔平の当該シーズン成績だけを取得する。
export async function getOhtaniSeasonStats(): Promise<Response> {
  const season = new Date().getUTCFullYear();
  const [hitting, pitching] = await Promise.all([
    fetchSeasonGroup("hitting", season),
    fetchSeasonGroup("pitching", season)
  ]);

  return Response.json({
    data: {
      player: { id: PLAYER_ID, name: "大谷翔平", nameEn: "Shohei Ohtani", team: "ロサンゼルス・ドジャース" },
      season,
      hitting: pick(hitting, ["gamesPlayed","plateAppearances","atBats","hits","doubles","triples","homeRuns","rbi","runs","stolenBases","baseOnBalls","strikeOuts","avg","obp","slg","ops"]),
      pitching: pick(pitching, ["gamesPlayed","gamesStarted","wins","losses","era","inningsPitched","strikeOuts","baseOnBalls","hits","homeRuns","whip","strikeoutsPer9Inn"])
    },
    updatedAt: new Date().toISOString(),
    source: "MLB Stats API"
  });
}

async function fetchSeasonGroup(group: "hitting" | "pitching", season: number): Promise<Record<string, string | number>> {
  const url = `https://statsapi.mlb.com/api/v1/people/${PLAYER_ID}/stats?stats=season&group=${group}&season=${season}`;
  const response = await fetch(url, { headers: { Accept: "application/json" }, cf: { cacheTtl: 600, cacheEverything: true } });
  if (!response.ok) throw new Error(`MLB Stats API ${group}: ${response.status}`);
  const payload = await response.json<MlbStatResponse>();
  return payload.stats?.[0]?.splits?.[0]?.stat ?? {};
}

function pick(source: Record<string, string | number>, keys: string[]): Record<string, string | number | null> {
  return Object.fromEntries(keys.map(key => [key, source[key] ?? null]));
}
