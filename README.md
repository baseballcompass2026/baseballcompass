# BASEBALL COMPASS

「野球情報 × ARゲーム × 野球用品販売」をつなぐCloudflare向け野球ポータルです。

## アーキテクチャ

- Cloudflare Pages: フレームワークなしのHTML/CSS/JavaScript
- Pages Functions: `/api/today`、`/api/schedule`、`/api/ranking`、`/api/shop`
- Workers + Cron: JST 6:00 / 12:00 / 18:00にProviderからKVを更新
- KV: `today.json`、`schedule.json`、`ranking.json`、`shop.json`
- D1: users、game_history、purchase_history、settings

## ローカル確認

```bash
npm install
npm run dev
npm run check
```

## Cloudflare設定

```bash
npx wrangler kv namespace create BASEBALL_DATA
npx wrangler d1 create baseball-compass
npx wrangler d1 execute baseball-compass --remote --file=./schema.sql
```

作成時に得られるKV IDとD1 IDを `wrangler.jsonc` のプレースホルダーへ設定してください。Pages側にも `BASEBALL_DATA` と `DB` をBindingsとして登録します。

Workerのデプロイ:

```bash
npm run deploy:worker
```

PagesはGitHub連携でリポジトリルートを配信します。静的サイトのビルドコマンドは不要です。本番ドメイン決定後、`robots.txt` と `sitemap.xml` のURLを置換してください。

## 将来のデータAPI差し替え

`api/providers/BaseballProvider.ts` の契約を実装し、`api/service.ts` のProvider生成箇所を差し替えます。画面・API・Providerを分離しているため、BASEBALL ARと自社ECも独立して追加できます。
## ニュースシステム

- `api/news/providers/`: 差し替え可能なNewsProvider
- `GdeltNewsProvider`: GDELT DOC APIからタイトル・URL・媒体・公開日時のみ取得
- `api/news/classifier.ts`: カテゴリー・選手・球団・注目度を判定
- `migrations/0002_news.sql`: 本文・要約・画像・動画を持たないD1テーブル
- Cron `*/30 * * * *`: 30分ごとに取得・重複排除・分類・保存
- API: `/api/news`, `/api/news/mlb`, `/api/news/npb`, `/api/news/player/ohtani`

本番D1へのマイグレーション:

```bash
npx wrangler d1 execute baseball-compass --remote --config wrangler.worker.jsonc --file migrations/0002_news.sql
```

著作権方針: ニュース本文、要約、画像、動画は取得・保存・表示せず、元記事への入口となるメタデータだけを扱います。