import assert from "node:assert/strict";
import { classifyCategory, enrichNews, extractSearchPlayer } from "../api/news/classifier";

const now=new Date("2026-07-30T00:00:00Z");
const records=enrichNews([
 {title:"大谷翔平がドジャースで23号ホームラン",url:"https://example.com/1",source:"媒体A",publishedAt:"2026-07-29T23:00:00Z"},
 {title:"大谷翔平がドジャースで23号ホームラン",url:"https://example.com/2",source:"媒体B",publishedAt:"2026-07-29T23:00:00Z"},
 {title:"阪神タイガースが首位を守る",url:"https://example.com/3",source:"媒体C",publishedAt:"2026-07-29T22:00:00Z"}
],now);
assert.equal(records[0].category,"MLB");
assert.deepEqual(records[0].playerTags,["大谷翔平"]);
assert.ok(records[0].teamTags.includes("ロサンゼルス・ドジャース"));
assert.equal(records[0].importance,12); // 大谷5 + MLB2 + 24時間以内2 + 複数媒体3
assert.equal(records[2].category,"NPB");
assert.ok(records[2].teamTags.includes("阪神タイガース"));
assert.ok(!records[2].teamTags.includes("デトロイト・タイガース"));
assert.equal(classifyCategory("佐々木朗希が負傷者リスト入り",[]),"故障");
assert.equal(classifyCategory("夏の甲子園 地方大会",[]),"高校野球");
assert.equal(extractSearchPlayer("ohtani"),"大谷翔平");
console.log("News classifier tests passed.");