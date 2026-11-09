/* Súhlas s cookies a Google Analytics (Consent Mode v2, základný režim).
   Google tag sa načíta až po kliknutí na „Prijať“. Bez súhlasu sa nič neposiela. */
(function () {
  "use strict";
  var TAG = "GTM-55SXMRX3";          // Google tag s vlastníctvom GA4 G-XSFMBY86GQ
  var KEY = "cookie-suhlas";
  var VER = 1;
  var MAX_AGE = 365 * 24 * 3600 * 1000; // voľba platí 12 mesiacov
  var doc = document, root = doc.documentElement;
  var en = (root.lang || "").slice(0, 2) === "en";

  var T = en ? {
    title: "Cookies",
    text: "Analytics cookies (Google Analytics) help us see how many people view this listing and what interests them. They only run if you agree.",
    more: "Cookie policy", href: "/en/cookies/",
    yes: "Accept", no: "Decline", set: "Settings", save: "Save choice",
    nec: "Necessary", necd: "remembers your cookie choice, always on",
    an: "Analytics", and: "Google Analytics: visits and what people view"
  } : {
    title: "Cookies",
    text: "Analytické cookies (Google Analytics) nám pomáhajú zistiť, koľko ľudí si ponuku pozerá a čo ich zaujíma. Spustia sa len s vaším súhlasom.",
    more: "Viac o cookies", href: "/cookies/",
    yes: "Prijať", no: "Odmietnuť", set: "Nastaviť", save: "Uložiť výber",
    nec: "Nevyhnutné", necd: "zapamätajú si vašu voľbu cookies, vždy zapnuté",
    an: "Analytické", and: "Google Analytics: návštevnosť a čo ľudí zaujíma"
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", functionality_storage: "granted", security_storage: "granted"
  });
  gtag("set", "ads_data_redaction", true);

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || "null");
      if (c && c.v === VER && Date.now() - c.t < MAX_AGE) return c;
    } catch (e) {}
    return null;
  }
  function write(a) {
    var old = read() || {};
    var c = { v: VER, a: !!a, t: Date.now(), id: old.id || Math.random().toString(36).slice(2, 12) };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    return c;
  }

  var loaded = false, granted = false;
  function grant() {
    granted = true;
    gtag("consent", "update", { analytics_storage: "granted" });
    if (!loaded) {
      loaded = true;
      gtag("js", new Date());
      var s = doc.createElement("script");
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtm.js?id=" + TAG;
      doc.head.appendChild(s);
    }
    watchSections();
  }
  function deny() {
    if (granted) gtag("consent", "update", { analytics_storage: "denied" });
    granted = false;
    // zmazať už uložené cookies Google Analytics
    var host = location.hostname, doms = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    doc.cookie.split(";").forEach(function (p) {
      var n = p.split("=")[0].trim();
      if (/^_ga($|_)|^_gid$|^_gat/.test(n)) doms.forEach(function (d) {
        doc.cookie = n + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
      });
    });
  }

  /* ---------- udalosti na analýzu (len so súhlasom) ---------- */
  function ev(name, p) { if (granted) gtag("event", name, p || {}); }
  function where(el) {
    if (el.closest("#dock")) return "spodna_lista";
    var s = el.closest("section[id]"); if (s) return s.id;
    if (el.closest(".hero")) return "uvod";
    return "ina";
  }
  doc.addEventListener("click", function (e) {
    var t = e.target; if (!t.closest) return;
    var a = t.closest("a[href]");
    if (a) {
      var h = a.getAttribute("href");
      if (h.indexOf("tel:") === 0) ev("klik_telefon", { cislo: h.slice(4), miesto: where(a) });
      else if (h.indexOf("sms:") === 0) ev("klik_sms", { cislo: h.slice(4).split("?")[0], miesto: where(a) });
      else if (h.indexOf("mailto:") === 0) ev("klik_email", { miesto: where(a) });
      return;
    }
    var c = t.closest(".copy");
    if (c) { ev("kopirovanie_cisla", { co: c.getAttribute("data-for") || "" }); return; }
    var f = t.closest(".shots button, button.solo");
    if (f) { var im = f.querySelector("img"); ev("otvorenie_fotky", { fotka: im ? (im.getAttribute("alt") || "").slice(0, 90) : "", miesto: where(f) }); }
  }, true);

  var watching = false;
  function watchSections() {
    if (watching || !("IntersectionObserver" in window)) return;
    watching = true;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (x.isIntersecting) { io.unobserve(x.target); ev("zobrazenie_sekcie", { sekcia: x.target.id }); }
      });
    }, { threshold: 0.3 });
    [].forEach.call(doc.querySelectorAll("main section[id]"), function (s) { io.observe(s); });
  }

  /* ---------- lišta ---------- */
  var css = ".ck{position:fixed;z-index:60;left:max(16px,env(safe-area-inset-left,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));width:min(430px,calc(100vw - 32px));box-sizing:border-box;padding:18px 18px 16px;border:1px solid var(--line,#D6D9D5);border-radius:8px;background:var(--bg,#F3F4F2);color:var(--ink,#23272B);font:400 .9rem/1.5 var(--body,Arial,sans-serif);box-shadow:0 18px 50px rgba(0,0,0,.22),0 2px 8px rgba(0,0,0,.08)}" +
    ".ck[hidden]{display:none}.ck h2{margin:0 0 6px;font:650 1rem/1.3 var(--display,Arial,sans-serif);font-stretch:112%;letter-spacing:-.005em}.ck p{margin:0}" +
    ".ck a{color:inherit;text-decoration:underline;text-decoration-color:var(--oak,#A4713F);text-decoration-thickness:1.5px;text-underline-offset:.2em}" +
    ".ck-set{margin:12px 0 0;padding:0;border:0;display:grid;gap:8px}.ck-set[hidden]{display:none}" +
    ".ck-row{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;padding:10px 12px;border:1px solid var(--line,#D6D9D5);border-radius:6px;cursor:pointer}" +
    ".ck-row input{margin:3px 0 0;width:18px;height:18px;accent-color:var(--oak,#A4713F)}.ck-row b{display:block;font-weight:650}.ck-row small{display:block;color:var(--muted,#5A5F5C);font-size:.82rem;line-height:1.4}" +
    ".ck-b{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:14px}" +
    ".ck-b button{min-height:42px;padding:0 8px;border:1.5px solid var(--ink,#23272B);border-radius:3px;background:transparent;color:var(--ink,#23272B);font:600 .88rem var(--body,Arial,sans-serif);cursor:pointer;transition:background-color .2s ease,color .2s ease}" +
    ".ck-b button:hover{background:var(--ink,#23272B);color:var(--bg,#F3F4F2)}.ck-b button:focus-visible,.ck-row:focus-within{outline:2px solid var(--oak,#A4713F);outline-offset:2px}" +
    ".ck.sett [data-ck=set]{display:none}.ck:not(.sett) [data-ck=save]{display:none}" +
    ".ck-link{padding:0;border:0;background:none;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:.2em;cursor:pointer}" +
    "@media (max-width:640px){.ck{left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));width:auto;padding:16px 14px 14px}}" +
    "@media print{.ck{display:none}}";

  var box = null;
  function build() {
    var st = doc.createElement("style"); st.textContent = css; doc.head.appendChild(st);
    box = doc.createElement("div");
    box.className = "ck"; box.hidden = true;
    box.setAttribute("role", "region"); box.setAttribute("aria-label", T.title);
    box.innerHTML =
      '<h2>' + T.title + '</h2><p>' + T.text + ' <a href="' + T.href + '">' + T.more + '</a></p>' +
      '<div class="ck-set" hidden>' +
        '<label class="ck-row"><input type="checkbox" checked disabled><span><b>' + T.nec + '</b><small>' + T.necd + '</small></span></label>' +
        '<label class="ck-row"><input type="checkbox" id="ck-an"><span><b>' + T.an + '</b><small>' + T.and + '</small></span></label>' +
      '</div>' +
      '<div class="ck-b"><button type="button" data-ck="yes">' + T.yes + '</button><button type="button" data-ck="no">' + T.no +
      '</button><button type="button" data-ck="set">' + T.set + '</button><button type="button" data-ck="save">' + T.save + '</button></div>';
    doc.body.appendChild(box);
    box.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-ck]"); if (!b) return;
      var k = b.getAttribute("data-ck");
      if (k === "set") { box.classList.add("sett"); box.querySelector(".ck-set").hidden = false; box.querySelector("#ck-an").focus(); return; }
      var a = k === "yes" ? true : k === "no" ? false : box.querySelector("#ck-an").checked;
      write(a); if (a) grant(); else deny();
      hide();
    });
  }
  function show(settings) {
    if (!box) build();
    var c = read();
    box.querySelector("#ck-an").checked = !!(c && c.a);
    box.classList.toggle("sett", !!settings);
    box.querySelector(".ck-set").hidden = !settings;
    box.hidden = false;
  }
  function hide() { if (box) box.hidden = true; }

  doc.addEventListener("click", function (e) {
    var o = e.target.closest && e.target.closest("[data-ck-open]");
    if (o) { e.preventDefault(); show(true); }
  });

  function init() {
    var c = read();
    if (c && c.a) grant();
    if (!c) show(false);
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();
})();
