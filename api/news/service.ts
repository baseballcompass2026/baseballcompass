import type { Env } from "../types";
import { enrichNews } from "./classifier";
import { GdeltNewsProvider, ManualNewsProvider, RssNewsProvider } from "./providers";
import { pruneOldNews, saveNews } from "./repository";
import type { NewsInput, NewsProvider } from "./types";

function createProvider(env: Env): NewsProvider {
  if (env.NEWS_PROVIDER === "manual") return new ManualNewsProvider();
  if (env.NEWS_PROVIDER === "rss") return new RssNewsProvider(env.NEWS_RSS_URL, Number(env.NEWS_FETCH_LIMIT || 75));
  return new FallbackNewsProvider([
    new GdeltNewsProvider(env.NEWS_QUERY || "野球 sourcelang:japanese", Number(env.NEWS_FETCH_LIMIT || 75)),
    new RssNewsProvider(env.NEWS_RSS_URL, Number(env.NEWS_FETCH_LIMIT || 75))
  ]);
}

// 無料APIがレート制限された場合は次のProviderへ自動的に切り替える。
class FallbackNewsProvider implements NewsProvider {
  constructor(private readonly providers: NewsProvider[]) {}
  async fetchNews(): Promise<NewsInput[]> {
    const failures: string[] = [];
    for (const provider of this.providers) {
      try {
        const news = await provider.fetchNews();
        if (news.length) return news;
        failures.push(`${provider.constructor.name}: empty`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${provider.constructor.name}: ${message}`);
        console.warn("news.provider.fallback", { provider: provider.constructor.name, error: message });
      }
    }
    throw new Error(`All news providers failed: ${failures.join(", ")}`);
  }
}

export async function refreshNews(env: Env): Promise<{ fetched:number; saved:number }> {
  const provider = createProvider(env);
  try {
    const fetched = await provider.fetchNews();
    // Providerの追加フィールドが将来増えても、ここで許可済みメタデータへ再構築して本文等を破棄する。
    const metadataOnly = fetched.map(item => ({ title:item.title, url:item.url, source:item.source, publishedAt:item.publishedAt }));
    const saved = await saveNews(env, enrichNews(metadataOnly));
    await pruneOldNews(env);
    console.log("news.refresh.success", { provider:provider.constructor.name, fetched:fetched.length, saved });
    return { fetched:fetched.length, saved };
  } catch (error) {
    // 既存D1データは変更しないため、取得失敗時も前回ニュースを表示できる。
    console.error("news.refresh.failed", { provider:provider.constructor.name, error:error instanceof Error?error.message:String(error) });
    throw error;
  }
}
