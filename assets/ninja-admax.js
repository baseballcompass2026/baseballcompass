// 忍者AdMaxはこのファイルだけから読み込み、広告タグの重複を防ぐ。
(() => {
  const admaxId = "1e9609e339e8abfbfab395f7ecde0a54";
  const adTimeoutMs = 8000;

  function createAdContainer(placement) {
    const section = document.createElement("section");
    section.className = "ad-container";
    section.dataset.adPlacement = placement;
    section.setAttribute("aria-label", "広告");
    section.innerHTML = '<span class="ad-container-label">広告</span><div class="ad-container-slot"></div>';
    return section;
  }

  function placeHomeAds() {
    if (location.pathname !== "/") return;
    const header = document.querySelector(".site-header");
    if (header && !document.querySelector('[data-ad-placement="home-header"]')) {
      header.after(createAdContainer("home-header"));
    }
    const footer = document.querySelector(".site-footer");
    if (footer && !document.querySelector('[data-ad-placement="home-footer"]')) {
      footer.before(createAdContainer("home-footer"));
    }
  }

  function markEmptyContainers() {
    document.querySelectorAll(".ad-container").forEach((container) => {
      const hasCreative = container.querySelector("iframe, ins, img, script");
      if (!hasCreative) container.classList.add("ad-container-empty");
    });
  }

  function loadAdmaxOnce() {
    if (document.querySelector(`script[data-admax-id="${admaxId}"]`)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://adm.shinobi.jp/st/auto.js";
    script.dataset.admaxId = admaxId;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.addEventListener("load", () => document.documentElement.classList.add("admax-loaded"));
    script.addEventListener("error", () => document.documentElement.classList.add("admax-blocked"));
    document.body.append(script);

    // 広告ブロッカーや広告在庫なしの場合は空の余白を残さない。
    window.setTimeout(markEmptyContainers, adTimeoutMs);
  }

  window.createCompassAdContainer = createAdContainer;
  placeHomeAds();
  loadAdmaxOnce();
})();