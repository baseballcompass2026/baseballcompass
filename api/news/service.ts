import type { Env } from "../types";
import { enrichNews } from "./classifier";
import { GdeltNewsProvider, ManualNewsProvider } from "./providers";
import { pruneOldNews, saveNews } from "./repository";
import type { NewsProvider } from "./types";

function createProvider(env: Env): NewsProvider {
  if (env.NEWS_PROVIDER === "manual") return new ManualNewsProvider();
  return new GdeltNewsProvider(env.NEWS_QUERY || "野球 sourcelang:japanese", Number(env.NEWS_FETCH_LIMIT || 75));
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