// ニュース本文・要約・画像は扱わず、元記事への入口に必要なメタデータだけを定義する。
export interface NewsInput {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export interface NewsRecord extends NewsInput {
  id?: number;
  category: NewsCategory;
  playerTags: string[];
  teamTags: string[];
  importance: number;
  createdAt?: string;
}

export type NewsCategory = "MLB" | "NPB" | "高校野球" | "大学野球" | "社会人野球" | "侍ジャパン" | "ドラフト" | "移籍" | "故障" | "その他";

export interface NewsProvider {
  fetchNews(): Promise<NewsInput[]>;
}