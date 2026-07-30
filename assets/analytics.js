// Google Analytics 4。利用者が同意するまでGoogleタグは読み込まない。
(() => {
  const measurementId = "G-8NBE8GBC3K";
  const consentKey = "baseball_compass_analytics_consent";
  const choice = localStorage.getItem(consentKey);

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag(){ window.dataLayer.push(arguments); };

  function loadAnalytics() {
    if (document.querySelector(`script[data-ga4="${measurementId}"]`)) return;
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: true
    });
    const script = document.createElement("script");
    script.async = true;
    script.dataset.ga4 = measurementId;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.append(script);
  }

  function track(eventName, parameters = {}) {
    if (localStorage.getItem(consentKey) !== "granted") return;
    window.gtag("event", eventName, parameters);
  }

  function classifyLink(link) {
    const url = new URL(link.href, location.href);
    const label = (link.textContent || "").trim().slice(0, 80);
    if (url.hostname === "hb.afl.rakuten.co.jp") {
      return ["affiliate_click", { affiliate: "rakuten", link_text: label }];
    }
    if (link.closest(".news-card") && url.origin !== location.origin) {
      return ["news_article_click", { source: link.closest(".news-card").querySelector(".news-source")?.textContent?.trim().slice(0, 80) || "", link_text: label }];
    }
    if (link.classList.contains("portal")) {
      return ["portal_click", { destination: url.pathname, link_text: label }];
    }
    if (url.origin !== location.origin) {
      return ["external_link_click", { link_domain: url.hostname, link_text: label }];
    }
    return null;
  }

  document.addEventListener("click", event => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    const classified = classifyLink(link);
    if (classified) track(classified[0], classified[1]);
  });

  function closeBanner(value) {
    localStorage.setItem(consentKey, value);
    document.querySelector("[data-cookie-consent]")?.remove();
    if (value === "granted") loadAnalytics();
  }

  function showBanner() {
    const banner = document.createElement("section");
    banner.className = "cookie-consent";
    banner.dataset.cookieConsent = "";
    banner.setAttribute("aria-label", "アクセス解析Cookieの確認");
    banner.innerHTML = `<div><strong>アクセス解析について</strong><p>サイト改善のためGoogle Analyticsを利用します。許可した場合のみ解析用Cookieを使用します。<a href="/privacy/">詳細</a></p></div><div class="cookie-actions"><button type="button" data-consent-deny>拒否する</button><button type="button" data-consent-accept>許可する</button></div>`;
    banner.querySelector("[data-consent-deny]").addEventListener("click", () => closeBanner("denied"));
    banner.querySelector("[data-consent-accept]").addEventListener("click", () => closeBanner("granted"));
    document.body.append(banner);
  }

  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "/assets/analytics.css?v=20260730-ga1";
  document.head.append(stylesheet);

  if (choice === "granted") loadAnalytics();
  else if (choice !== "denied") showBanner();

  window.trackCompassEvent = track;
})();
