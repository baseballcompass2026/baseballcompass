import type { NewsInput, NewsProvider } from "../types";

interface GdeltArticle {
  title?: string;
  url?: string;
  domain?: string;
  seendate?: string;
}
interface GdeltResponse { articles?: GdeltArticle[] }

// GDELT DOC APIから記事メタデータだけを取得する。本文・要約・画像は読み込まない。
export class GdeltNewsProvider implements NewsProvider {
  constructor(private readonly query = "野球 sourcelang:japanese", private readonly limit = 75) {}

  async fetchNews(): Promise<NewsInput[]> {
    const params = new URLSearchParams({
      query: this.query,
      mode: "ArtList",
      maxrecords: String(Math.min(this.limit, 100)),
      format: "json",
      sort: "DateDesc",
      timespan: "1d"
    });
    const response = await fetch(`https://api.gdeltproject.org/api/v2/doc/doc?${params}`, {
      headers: { Accept: "application/json", "User-Agent": "BASEBALL-COMPASS/1.0" },
      cf: { cacheTtl: 1800, cacheEverything: true }
    });
    if (!response.ok) throw new Error(`GDELT DOC API: ${response.status}`);
    const payload = await response.json<GdeltResponse>();
    return (payload.articles ?? []).flatMap(article => {
      const title = article.title?.trim();
      const url = article.url ? normalizeUrl(article.url) : undefined;
      if (!title || !url || !/^https?:\/\//i.test(url)) return [];
      return [{ title, url, source: normalizeSource(article.domain?.trim() || new URL(url).hostname), publishedAt: parseGdeltDate(article.seendate) }];
    });
  }
}

function parseGdeltDate(value?: string): string {
  if (!value) return new Date().toISOString();
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (!match) return new Date(value).toISOString();
  const [, year, month, day, hour, minute, second] = match;
  return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}
function normalizeUrl(value: string): string {
  let url: URL;
  try { url = new URL(value.trim()); } catch { return ""; }
  url.hash = "";
  for (const key of [...url.searchParams.keys()]) if (/^(utm_|ref$|referrer$|fbclid$|gclid$)/i.test(key)) url.searchParams.delete(key);
  return url.toString();
}

function normalizeSource(domain: string): string {
  const host = domain.toLowerCase().replace(/^www\./, "");
  const names: Record<string,string> = {
    "nikkansports.com":"日刊スポーツ","hochi.news":"スポーツ報知","sponichi.co.jp":"スポニチ",
    "sanspo.com":"サンスポ","full-count.jp":"Full-Count","baseballking.jp":"BASEBALL KING",
    "daily.co.jp":"デイリースポーツ","chunichi.co.jp":"中日スポーツ","nhk.or.jp":"NHK",
    "jiji.com":"時事通信","kyodonews.jp":"共同通信","sports.yahoo.co.jp":"Yahoo!スポーツ"
  };
  return names[host] || host;
}