-- ニュース本文・要約・画像を保存しない、リンクメタデータ専用テーブル。
CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  url TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  published_at TEXT NOT NULL,
  category TEXT NOT NULL CHECK(category IN ('MLB','NPB','高校野球','大学野球','社会人野球','侍ジャパン','ドラフト','移籍','故障','その他')),
  player_tags TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(player_tags)),
  team_tags TEXT NOT NULL DEFAULT '[]' CHECK(json_valid(team_tags)),
  importance INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_news_published ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_category_published ON news(category,published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_importance ON news(importance DESC,published_at DESC);