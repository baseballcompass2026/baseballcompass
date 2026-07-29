import type { Env } from "../types";
import type { NewsRecord } from "./types";

interface NewsRow {
  id: number; title: string; url: string; source: string; published_at: string; category: string;
  player_tags: string; team_tags: string; importance: number; created_at: string;
}

export async function saveNews(env: Env, records: NewsRecord[]): Promise<number> {
  if (!records.length) return 0;
  const unique = [...new Map(records.map(record => [record.url, record])).values()];
  const statements = unique.map(record => env.DB.prepare(`
    INSERT INTO news (title,url,source,published_at,category,player_tags,team_tags,importance)
    VALUES (?1,?2,?3,?4,?5,?6,?7,?8)
    ON CONFLICT(url) DO UPDATE SET title=excluded.title,source=excluded.source,published_at=excluded.published_at,
      category=excluded.category,player_tags=excluded.player_tags,team_tags=excluded.team_tags,importance=excluded.importance
  `).bind(record.title, record.url, record.source, record.publishedAt, record.category, JSON.stringify(record.playerTags), JSON.stringify(record.teamTags), record.importance));
  for (let index = 0; index < statements.length; index += 50) await env.DB.batch(statements.slice(index, index + 50));
  return unique.length;
}

export async function listNews(env: Env, options: { category?: string; player?: string; query?: string; order?: "featured"|"latest"; limit?: number } = {}): Promise<NewsRecord[]> {
  const where: string[] = [];
  const values: (string|number)[] = [];
  if (options.category) { values.push(options.category); where.push(`category = ?${values.length}`); }
  if (options.player) { values.push(`%${JSON.stringify(options.player).slice(1,-1)}%`); where.push(`player_tags LIKE ?${values.length}`); }
  if (options.query) {
    const term = `%${options.query.slice(0,80)}%`;
    values.push(term, term, term);
    where.push(`(title LIKE ?${values.length-2} OR player_tags LIKE ?${values.length-1} OR team_tags LIKE ?${values.length})`);
  }
  const limit = Math.max(1, Math.min(options.limit ?? 20, 50));
  values.push(limit);
  const order = options.order === "featured" ? "importance DESC, published_at DESC" : "published_at DESC, importance DESC";
  const sql = `SELECT id,title,url,source,published_at,category,player_tags,team_tags,importance,created_at FROM news ${where.length ? `WHERE ${where.join(" AND ")}` : ""} ORDER BY ${order} LIMIT ?${values.length}`;
  const result = await env.DB.prepare(sql).bind(...values).all<NewsRow>();
  return (result.results ?? []).map(toRecord);
}

export async function pruneOldNews(env: Env): Promise<void> {
  // 無料枠を守るため、30日より古いリンクメタデータを削除する。
  await env.DB.prepare("DELETE FROM news WHERE datetime(published_at) < datetime('now','-30 days')").run();
}

function toRecord(row: NewsRow): NewsRecord {
  return { id:row.id,title:row.title,url:row.url,source:row.source,publishedAt:row.published_at,category:row.category as NewsRecord["category"],playerTags:parseTags(row.player_tags),teamTags:parseTags(row.team_tags),importance:row.importance,createdAt:row.created_at };
}
function parseTags(value: string): string[] { try { const parsed=JSON.parse(value); return Array.isArray(parsed)?parsed:[]; } catch { return []; } }