import { mlbTeamNames, npbTeamNames, players, teams } from "./dictionaries";
import type { NewsCategory, NewsInput, NewsRecord } from "./types";

export function enrichNews(items: NewsInput[], now = new Date()): NewsRecord[] {
  const sourceCounts = countSourcesByHeadline(items);
  return items.map(item => {
    const playerTags = players.filter(player => includesAny(item.title, player.aliases)).map(player => player.name);
    const teamTags = teams.filter(([, aliases]) => includesAny(item.title, aliases)).map(([name]) => name);
    const category = classifyCategory(item.title, teamTags);
    return {
      ...item,
      category,
      playerTags,
      teamTags,
      importance: calculateImportance(item, category, playerTags, sourceCounts.get(normalizeHeadline(item.title)) ?? 1, now)
    };
  });
}

export function classifyCategory(title: string, teamTags: string[]): NewsCategory {
  const lower = title.toLowerCase();
  if (/(故障|負傷|離脱|手術|injur|il入り|負傷者リスト)/i.test(lower)) return "故障";
  if (/(移籍|トレード|契約|fa宣言|入団|退団|獲得|trade|signs|acquire)/i.test(lower)) return "移籍";
  if (/(ドラフト|draft)/i.test(lower)) return "ドラフト";
  if (/(侍ジャパン|日本代表|wbc|プレミア12)/i.test(lower)) return "侍ジャパン";
  if (/(高校野球|甲子園|センバツ|選抜高校|高野連)/i.test(lower)) return "高校野球";
  if (/(大学野球|六大学|東都大学|全日本大学)/i.test(lower)) return "大学野球";
  if (/(社会人野球|都市対抗|日本選手権.*野球)/i.test(lower)) return "社会人野球";
  if (teamTags.some(tag => npbTeamNames.has(tag)) || /(npb|プロ野球|セ・リーグ|パ・リーグ)/i.test(lower)) return "NPB";
  if (teamTags.some(tag => mlbTeamNames.has(tag)) || /(mlb|メジャーリーグ|大リーグ|major league)/i.test(lower) || players.some(player => includesAny(title, player.aliases))) return "MLB";
  return "その他";
}

export function extractSearchPlayer(slug: string): string | undefined {
  return players.find(player => player.slug === slug.toLowerCase())?.name;
}

function calculateImportance(item: NewsInput, category: NewsCategory, playerTags: string[], mediaCount: number, now: Date): number {
  let score = 0;
  if (playerTags.includes("大谷翔平")) score += 5;
  if (playerTags.some(name => name !== "大谷翔平")) score += 3;
  if (category === "MLB" || category === "NPB") score += 2;
  const age = now.getTime() - new Date(item.publishedAt).getTime();
  if (age >= 0 && age <= 86_400_000) score += 2;
  if (mediaCount > 1) score += 3;
  return score;
}

function countSourcesByHeadline(items: NewsInput[]): Map<string, number> {
  const sources = new Map<string, Set<string>>();
  for (const item of items) {
    const key = normalizeHeadline(item.title);
    const set = sources.get(key) ?? new Set<string>();
    set.add(item.source.toLowerCase());
    sources.set(key, set);
  }
  return new Map([...sources].map(([key, value]) => [key, value.size]));
}

function normalizeHeadline(title: string): string {
  return title.toLowerCase().normalize("NFKC").replace(/[\s\p{P}\p{S}\d]+/gu, "");
}

function includesAny(title: string, aliases: readonly string[]): boolean {
  const normalized = title.toLowerCase().normalize("NFKC");
  return aliases.some(alias => normalized.includes(alias.toLowerCase().normalize("NFKC")));
}