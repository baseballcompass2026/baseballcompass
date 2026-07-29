import { readFile, access } from "node:fs/promises";
const required=["index.html","today/index.html","schedule/index.html","ranking/index.html","game/index.html","shop/index.html","search/index.html","profile/index.html","workers/index.ts","schema.sql","robots.txt","sitemap.xml"];
await Promise.all(required.map(path => access(path)));
const html=await readFile("index.html","utf8");
if(!html.includes("BASEBALL COMPASS")||!html.includes("meta name=\"description\"")) throw new Error("トップページのSEO要素が不足しています");
const config=await readFile("wrangler.jsonc","utf8");
if(!config.includes("0 21,3,9 * * *")) throw new Error("Cron設定が不正です");
console.log(`Validated ${required.length} required files.`);