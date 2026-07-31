// 楽天商品リンクを管理する
const pageName = document.body.dataset.page || "";
const apiView = document.querySelector("[data-api-view]");

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
  legalNav.innerHTML = '<a href="/privacy/">プライバシー</a><a href="/contact/">お問い合わせ</a>';
  footerContainer.querySelector("span:last-child")?.before(legalNav);
}
