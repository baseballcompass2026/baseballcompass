-- BASEBALL COMPASS D1スキーマ
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, level INTEGER NOT NULL DEFAULT 1, experience INTEGER NOT NULL DEFAULT 0, play_count INTEGER NOT NULL DEFAULT 0, purchase_count INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS game_history (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, game_type TEXT NOT NULL, score INTEGER NOT NULL DEFAULT 0, played_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE INDEX IF NOT EXISTS idx_game_history_user ON game_history(user_id, played_at);
CREATE TABLE IF NOT EXISTS purchase_history (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, product_id TEXT NOT NULL, product_name TEXT NOT NULL, amount INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'completed', purchased_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE INDEX IF NOT EXISTS idx_purchase_history_user ON purchase_history(user_id, purchased_at);
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
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
