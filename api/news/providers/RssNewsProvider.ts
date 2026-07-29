import type { NewsInput, NewsProvider } from "../types";

// RSSから記事のメタデータだけを取得する。descriptionや画像は読み取らない。
export class RssNewsProvider implements NewsProvider {
  constructor(
    private readonly feedUrl = "https://news.google.com/rss/search?q=%E9%87%8E%E7%90%83&hl=ja&gl=JP&ceid=JP%3Aja",
    private readonly limit = 75
  ) {}

  async fetchNews(): Promise<NewsInput[]> {
    const response = await fetch(this.feedUrl, {
      headers: { Accept: "application/rss+xml, application/xml, text/xml", "User-Agent": "BASEBALL-COMPASS/1.0" },
      cf: { cacheTtl: 1800, cacheEverything: true }
    });
    if (!response.ok) throw new Error(`RSS: ${response.status}`);
    const xml = await response.text();
    return [...xml.matchAll(/<item\b[^>]*>([\s\S]*?)<\/item>/gi)]
      .slice(0, Math.min(this.limit, 100))
      .flatMap(match => {
        const item = match[1];
        const title = readElement(item, "title");
        const url = readElement(item, "link");
        const source = readElement(item, "source") || hostname(url);
        const publishedAt = toIsoDate(readElement(item, "pubDate"));
        if (!title || !url || !/^https?:\/\//i.test(url)) return [];
        return [{ title: stripSourceSuffix(title, source), url, source, publishedAt }];
      });
  }
}

function readElement(xml: string, name: string): string {
  const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, "i"));
  return decodeXml((match?.[1] || "").replace(/^<!\[CDATA\[|\]\]>$/g, "").trim());
}

function decodeXml(value: string): string {
  const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'" };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos);/gi, (_, entity: string) => {
    if (entity[0] !== "#") return entities[entity.toLowerCase()] || "";
    const radix = entity[1].toLowerCase() === "x" ? 16 : 10;
    const digits = radix === 16 ? entity.slice(2) : entity.slice(1);
    return String.fromCodePoint(Number.parseInt(digits, radix));
  });
}

function toIsoDate(value: string): string {
  const time = Date.parse(value);
  return Number.isNaN(time) ? new Date().toISOString() : new Date(time).toISOString();
}
function hostname(value: string): string {
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return "ニュース提供元"; }
}
function stripSourceSuffix(title: string, source: string): string {
  const suffix = ` - ${source}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length).trim() : title;
}
