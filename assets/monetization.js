// バナー広告と楽天商品リンクを一元管理する
// 忍者AdMaxの正式タグ取得後は renderBanner 内の自社広告を公式タグへ差し替える
const bannerCopy = {
  today: ["スポンサー募集中", "野球を応援する企業・店舗の広告を掲載できます。"],
  schedule: ["BASEBALL COMPASS PARTNER", "野球スクール、用品店、地域企業のスポンサーを募集しています。"],
  ranking: ["ランキングスポンサー募集中", "バナー広告・ページ協賛のお問い合わせを受け付けています。"]
};

const pageName = document.body.dataset.page || "";
const apiView = document.querySelector("[data-api-view]");

function renderBanner() {
  if (!apiView || !bannerCopy[pageName] || apiView.querySelector("[data-banner-ad]")) return;
  const [title, text] = bannerCopy[pageName];
  const banner = document.createElement("aside");
  banner.className = "banner-ad";
  banner.dataset.bannerAd = pageName;
  banner.setAttribute("aria-label", "広告");
  banner.innerHTML = `<span class="ad-label">広告</span>
    <div class="ad-copy"><strong>${window.escapeCompass(title)}</strong><span>${window.escapeCompass(text)}</span></div>
    <a href="/advertising/">広告掲載について <span aria-hidden="true">→</span></a>`;

  if (pageName === "ranking") {
    const metrics = apiView.querySelector(".metric-group");
    if (metrics) metrics.before(banner);
  } else {
    const cards = apiView.querySelectorAll(".league-card");
    if (cards.length > 1) cards[0].after(banner);
  }
}

function enhanceRakutenShop() {
  if (pageName !== "shop" || !apiView) return;
  const notice = document.querySelector(".notice");
  if (notice) notice.innerHTML = `<strong>PR</strong> このページでは楽天市場の商品を紹介します。リンク先で購入された場合、運営者が報酬を受け取ることがあります。`;

  apiView.querySelectorAll(".product-card").forEach((card) => {
    if (card.querySelector(".rakuten-button")) return;
    const name = card.querySelector("h3")?.textContent?.trim();
    if (!name) return;
    const price = card.querySelector(".price");
    if (price) price.insertAdjacentText("afterbegin", "参考価格 ");
    const link = document.createElement("a");
    link.className = "rakuten-button";
    link.href = `https://search.rakuten.co.jp/search/mall/${encodeURIComponent(name)}/`;
    link.target = "_blank";
    link.rel = "sponsored noopener";
    link.innerHTML = `<span>楽天市場で商品を見る</span><b aria-hidden="true">↗</b>`;
    card.append(link);
  });
}

function applyMonetization() {
  renderBanner();
  enhanceRakutenShop();
}

applyMonetization();
if (apiView) {
  new MutationObserver(applyMonetization).observe(apiView, { childList: true, subtree: true });
}
// 収益化に必要な法務・問い合わせページを全ページのフッターへ表示する
const footerContainer = document.querySelector(".site-footer .container");
if (footerContainer && !footerContainer.querySelector(".footer-links")) {
  const legalNav = document.createElement("nav");
  legalNav.className = "footer-links";
  legalNav.setAttribute("aria-label", "フッターナビゲーション");
  legalNav.innerHTML = '<a href="/advertising/">広告掲載</a><a href="/privacy/">プライバシー</a><a href="/contact/">お問い合わせ</a>';
  footerContainer.querySelector("span:last-child")?.before(legalNav);
}
