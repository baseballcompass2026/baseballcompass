const statsRoot = document.querySelector("[data-ohtani-stats]");
const newsRoot = document.querySelector("[data-ohtani-news]");
const updatedRoot = document.querySelector("[data-ohtani-updated]");
const escapeHtml = window.escapeCompass;

const hittingMetrics = [
  ["試合","gamesPlayed"],["打席","plateAppearances"],["打率","avg"],["本塁打","homeRuns"],
  ["打点","rbi"],["得点","runs"],["盗塁","stolenBases"],["出塁率","obp"],["長打率","slg"],["OPS","ops"]
];
const pitchingMetrics = [
  ["登板","gamesPlayed"],["先発","gamesStarted"],["勝敗",["wins","losses"]],["防御率","era"],
  ["投球回","inningsPitched"],["奪三振","strikeOuts"],["WHIP","whip"],["奪三振率","strikeoutsPer9Inn"]
];

function metricValue(stats, key) {
  if (Array.isArray(key)) return `${stats[key[0]] ?? "-"}勝 ${stats[key[1]] ?? "-"}敗`;
  return stats[key] ?? "-";
}
function metricCards(stats, metrics) {
  return metrics.map(([label,key]) => `<div class="ohtani-stat"><span>${label}</span><strong>${escapeHtml(metricValue(stats,key))}</strong></div>`).join("");
}
function relativeTime(value) {
  const hours = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 3600000));
  return hours < 24 ? `${Math.max(1,hours)}時間前` : `${Math.floor(hours/24)}日前`;
}

async function renderStats() {
  try {
    const response = await fetch("/api/ohtani", { headers:{ Accept:"application/json" } });
    if (!response.ok) throw new Error("stats unavailable");
    const payload = await response.json();
    statsRoot.innerHTML = `<section class="ohtani-stat-group"><div class="ohtani-stat-head"><span>BATTER</span><h2>${payload.data.season} シーズン打撃成績</h2></div><div class="ohtani-stat-grid">${metricCards(payload.data.hitting,hittingMetrics)}</div></section>
      <section class="ohtani-stat-group"><div class="ohtani-stat-head"><span>PITCHER</span><h2>${payload.data.season} シーズン投手成績</h2></div><div class="ohtani-stat-grid">${metricCards(payload.data.pitching,pitchingMetrics)}</div></section>`;
    updatedRoot.textContent = `更新 ${new Date(payload.updatedAt).toLocaleString("ja-JP")}｜出典 MLB Stats API`;
  } catch {
    statsRoot.innerHTML = '<p class="empty-state">成績データを取得できませんでした。時間をおいて再度ご確認ください。</p>';
  }
}

async function renderNews() {
  try {
    const response = await fetch("/api/news/player/ohtani?limit=6", { headers:{ Accept:"application/json" } });
    if (!response.ok) throw new Error("news unavailable");
    const items = (await response.json()).data || [];
    newsRoot.innerHTML = items.length ? items.map(item => `<article class="ohtani-news-card"><div><span>${escapeHtml(item.source)}</span><time datetime="${escapeHtml(item.publishedAt)}">${relativeTime(item.publishedAt)}</time></div><h3>${escapeHtml(item.title)}</h3><a href="${escapeHtml(item.url)}" target="_blank" rel="nofollow noopener">元記事を読む <b>↗</b></a></article>`).join("") : '<p class="empty-state">直近のニュースはありません。</p>';
  } catch {
    newsRoot.innerHTML = '<p class="empty-state">ニュースを取得できませんでした。</p>';
  }
}

renderStats();
renderNews();
