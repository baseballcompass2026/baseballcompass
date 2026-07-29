import { readFile, access } from "node:fs/promises";
const required=["index.html","today/index.html","schedule/index.html","ranking/index.html","game/index.html","shop/index.html","search/index.html","news/index.html","assets/news.js","workers/index.ts","api/news/providers/GdeltNewsProvider.ts","migrations/0002_news.sql","schema.sql","robots.txt","sitemap.xml"];
await Promise.all(required.map(path=>access(path)));
const home=await readFile("index.html","utf8");
if(!home.includes("BASEBALL COMPASS")||!home.includes('meta name="description"')||!home.includes("data-news-home"))throw new Error("トップページのSEOまたはニュース欄が不足しています。");
const news=await readFile("news/index.html","utf8");
if(!news.includes('rel="canonical"')||!news.includes("data-news-root"))throw new Error("ニュースページのSEOまたは一覧領域が不足しています。");
const workerConfig=await readFile("wrangler.worker.jsonc","utf8");
if(!workerConfig.includes("*/30 * * * *"))throw new Error("ニュースCron設定が不正です。");
const migration=await readFile("migrations/0002_news.sql","utf8");
for(const forbidden of ["body","summary","image","video"]){if(new RegExp(`\\b${forbidden}\\b`,"i").test(migration))throw new Error(`ニューステーブルに保存禁止列 ${forbidden} が含まれています。`);}
console.log(`Validated ${required.length} required files and copyright-safe news schema.`);