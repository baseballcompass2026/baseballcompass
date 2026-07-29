import type { NewsInput, NewsProvider } from "../types";

// 将来、運営者が権利確認済みの記事リンクを追加するためのProvider。
export class ManualNewsProvider implements NewsProvider {
  constructor(private readonly entries: NewsInput[] = []) {}
  async fetchNews(): Promise<NewsInput[]> { return this.entries; }
}