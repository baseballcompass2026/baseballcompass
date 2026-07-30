// 共通ナビゲーションとAPI補助関数
const page=document.body.dataset.page||"";const nav=[["today","/today/","TODAY"],["news","/news/","NEWS"],["game","/game/","AR GAME"],["shop","/shop/","SHOP"],["search","/search/","検索"]];
const header=document.querySelector("[data-header]");if(header)header.innerHTML=`<header class="site-header"><nav class="nav" aria-label="メインナビゲーション"><a class="brand" href="/"><img src="/assets/favicon.svg" alt=""><span>BASEBALL COMPASS</span></a><div class="nav-links">${nav.map(([k,h,l])=>`<a href="${h}"${page===k?' aria-current="page"':""}>${l}</a>`).join("")}</div></nav></header>`;
const footer=document.querySelector("[data-footer]");if(footer)footer.innerHTML=`<footer class="site-footer"><div class="container"><div><strong>BASEBALL COMPASS</strong><br><span>野球をもっと楽しもう。</span></div><span>© ${new Date().getFullYear()}</span></div></footer>`;
window.fetchCompass=async endpoint=>{const r=await fetch(`/api/${endpoint}`,{headers:{Accept:"application/json"}});if(!r.ok)throw new Error("データを取得できませんでした");return r.json()};window.escapeCompass=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[c]);// 収益化機能は独立ファイルに分離し、広告会社の変更を容易にする
document.head.insertAdjacentHTML("beforeend",'<link rel="stylesheet" href="/assets/monetization.css?v=20260729-ads1">');
const monetizationScript=document.createElement("script");monetizationScript.src="/assets/monetization.js?v=20260729-ads1";monetizationScript.defer=true;document.body.append(monetizationScript);

// GA4とCookie同意は共通スクリプトから全ページへ適用する。
const analyticsScript=document.createElement("script");analyticsScript.src="/assets/analytics.js?v=20260730-ga1";analyticsScript.defer=true;document.body.append(analyticsScript);

// 忍者AdMaxは共通ファイルから一度だけ読み込む。
document.head.insertAdjacentHTML("beforeend",'<link rel="stylesheet" href="/assets/ninja-admax.css?v=20260730-admax1">');
const admaxScript=document.createElement("script");admaxScript.src="/assets/ninja-admax.js?v=20260730-admax1";admaxScript.defer=true;document.body.append(admaxScript);
