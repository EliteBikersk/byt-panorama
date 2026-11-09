/* Súhlas s cookies (Consent Mode v2, základný režim) pre prenajombytupb.sk.
   - Google Analytics sa načíta až po kliknutí na „Prijať“. Bez súhlasu sa nič neposiela.
   - Mapa Google Maps sa načíta až po kliknutí na „Zobraziť mapu“ (alebo po povolení v nastaveniach).
   - Voľba platí 12 mesiacov a dá sa kedykoľvek zmeniť cez „Nastavenia cookies“ v päte stránky. */
(function () {
  "use strict";
  var TAG = "GTM-55SXMRX3";
  var KEY = "cookie-suhlas";
  var VER = 1;
  var MAX_AGE = 365 * 24 * 3600 * 1000; // voľba platí 12 mesiacov
  var doc = document, root = doc.documentElement;
  var en = (root.lang || "").slice(0, 2) === "en";

  var T = en ? {
    title: "Cookie settings",
    text: "This site uses Google Analytics cookies only for visitor statistics, not for ads.",
    more: "Cookie policy", href: "/en/cookies/", set: "Settings",
    yes: "Accept", no: "Decline", yesAll: "Accept all", noAll: "Decline all", save: "Save choice",
    nec: "Necessary", necd: "remembers your choice, always on",
    an: "Analytics", and: "Google Analytics: visits and what people view",
    mp: "Map", mpd: "Google Maps in the Location section, Google may set its own cookies",
    mapText: "The map loads from Google Maps, which may set its own cookies.",
    mapBtn: "Show map", mapNote: "Your choice is remembered, change it in Cookie settings."
  } : {
    title: "Nastavenia cookies",
    text: "Tento web používa cookies Google Analytics len na štatistiku návštevnosti, nie na reklamu.",
    more: "Viac o cookies", href: "/cookies/", set: "Nastavenia",
    yes: "Prijať", no: "Odmietnuť", yesAll: "Prijať všetko", noAll: "Odmietnuť všetko", save: "Uložiť výber",
    nec: "Nevyhnutné", necd: "zapamätajú si vašu voľbu, vždy zapnuté",
    an: "Analytické", and: "Google Analytics: návštevnosť a čo ľudí zaujíma",
    mp: "Mapa", mpd: "Google Maps v časti Lokalita, Google môže uložiť vlastné cookies",
    mapText: "Mapa sa načíta zo služby Google Maps, ktorá môže uložiť vlastné cookies.",
    mapBtn: "Zobraziť mapu", mapNote: "Voľbu si zapamätáme, zmeniť ju môžete v Nastaveniach cookies."
  };

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("consent", "default", {
    ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
    analytics_storage: "denied", functionality_storage: "granted", security_storage: "granted"
  });
  gtag("set", "ads_data_redaction", true);

  /* Záznam o voľbe v prehliadači: v = verzia lišty, a = analytické (true/false, null = zatiaľ bez voľby),
     m = mapa, t = čas voľby, id = náhodný identifikátor záznamu (dôkaz súhlasu). */
  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || "null");
      if (c && c.v === VER && Date.now() - c.t < MAX_AGE) return c;
    } catch (e) {}
    return null;
  }
  function write(patch) {
    var c = read() || { v: VER, a: null, m: false, id: Math.random().toString(36).slice(2, 12) };
    for (var k in patch) c[k] = patch[k];
    c.t = Date.now();
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

  /* ---------- mapa Google Maps až po súhlase ---------- */
  var mapsOn = false;
  function maps() { return [].slice.call(doc.querySelectorAll("figure[data-map-src]")); }
  function prepMaps() {
    maps().forEach(function (f) {
      if (f.querySelector(".map-ph")) return;
      var ph = doc.createElement("div");
      ph.className = "map-ph";
      ph.innerHTML = '<div class="map-ph-in"><svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>' +
        '<p>' + T.mapText + '</p><button type="button" class="map-btn" data-map-load>' + T.mapBtn + '</button><small>' + T.mapNote + '</small></div>';
      f.appendChild(ph);
    });
  }
  function loadMaps() {
    if (mapsOn) return; mapsOn = true;
    maps().forEach(function (f) {
      var i = doc.createElement("iframe");
      i.src = f.getAttribute("data-map-src");
      i.title = f.getAttribute("data-map-title") || "";
      i.setAttribute("loading", "lazy");
      i.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
      i.setAttribute("allowfullscreen", "");
      var ph = f.querySelector(".map-ph"); if (ph) ph.hidden = true;
      f.appendChild(i);
    });
  }
  function unloadMaps() {
    if (!mapsOn) return; mapsOn = false;
    maps().forEach(function (f) {
      [].forEach.call(f.querySelectorAll("iframe"), function (i) { i.remove(); });
      var ph = f.querySelector(".map-ph"); if (ph) ph.hidden = false;
    });
  }
  doc.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("[data-map-load]");
    if (b) { write({ m: true }); loadMaps(); ev("zobrazenie_mapy", { miesto: where(b) }); }
  });

  /* ---------- udalosti na analýzu (len so súhlasom) ---------- */
  function ev(name, p) { if (granted) gtag("event", name, p || {}); }
  function where(el) {
    if (el.closest("#dock")) return "spodna_lista";
    if (el.closest(".ck")) return "lista_cookies";
    var s = el.closest("section[id]"); if (s) return s.id;
    if (el.closest(".hero")) return "uvod";
    if (el.closest("header")) return "menu";
    if (el.closest("footer")) return "pata";
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
      else if (h.charAt(0) === "#" || a.hostname === location.hostname || a.classList.contains("btn")) {
        // tlačidlá a odkazy na webe (Dohodnúť obhliadku, Fotky, menu, SK/EN, …)
        var txt = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60);
        ev("klik_tlacidlo", { tlacidlo: txt || h, ciel: h.slice(0, 80), miesto: where(a) });
      }
      return;
    }
    var c = t.closest(".copy");
    if (c) { ev("kopirovanie_cisla", { co: c.getAttribute("data-for") || "" }); return; }
    var f = t.closest(".shots button, button.solo");
    if (f) { var im = f.querySelector("img"); ev("otvorenie_fotky", { fotka: im ? (im.getAttribute("alt") || "").slice(0, 90) : "", miesto: where(f) }); }
  }, true);

  var watching = false;
  function watchSections() {
    if (watching) return;
    watching = true;
    var secs = [].slice.call(doc.querySelectorAll("main section[id]"));
    if ("IntersectionObserver" in window) {
      // sekcia sa počíta ako videná, až keď je na obrazovke aspoň 1 s (nie pri rýchlom prejdení)
      var tm = {};
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (x) {
          var el = x.target, id = el.id;
          if (!x.isIntersecting) { clearTimeout(tm[id]); return; }
          tm[id] = setTimeout(function () {
            io.unobserve(el);
            ev("zobrazenie_sekcie", { sekcia: id });
            if (id === "kontakt") ev("dosiel_na_kontakt", { sekcia: "kontakt" });
          }, 1000);
        });
      }, { threshold: 0.3 });
      secs.forEach(function (s) { io.observe(s); });
    }
    timeInSections(secs);
  }

  /* Čas v jednotlivých sekciách: počíta sa sekcia v strede obrazovky, len keď je stránka
     viditeľná a človek je aktívny (po 60 s bez pohybu sa čas nepočíta). Odošle sa pri odchode. */
  function timeInSections(secs) {
    var acc = {}, cur = null, since = 0, last = Date.now(), IDLE = 60000;
    function current() {
      var mid = window.innerHeight / 2;
      for (var i = 0; i < secs.length; i++) {
        var r = secs[i].getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) return secs[i].id;
      }
      if (secs.length && secs[0].getBoundingClientRect().top > mid) return "uvod";
      return "pata";
    }
    function stop() {
      if (cur && since) {
        var end = Math.min(Date.now(), last + IDLE);
        if (end > since) acc[cur] = (acc[cur] || 0) + (end - since);
      }
      since = 0;
    }
    function start() {
      if (doc.visibilityState !== "visible") return;
      cur = current(); since = Date.now();
    }
    function check() {
      if (doc.visibilityState !== "visible") return;
      var now = Date.now();
      if (now - last > IDLE) { stop(); last = now; start(); return; }
      last = now;
      var c = current();
      if (c !== cur || !since) { stop(); cur = c; since = now; }
    }
    function flush() {
      stop();
      if (granted) Object.keys(acc).forEach(function (k) {
        var s = Math.round(acc[k] / 1000);
        if (s >= 1) gtag("event", "cas_v_sekcii", { sekcia: k, sekundy: s });
      });
      acc = {};
    }
    var tick = false;
    function onAct() { if (!tick) { tick = true; requestAnimationFrame(function () { tick = false; check(); }); } }
    ["scroll", "resize"].forEach(function (n) { window.addEventListener(n, onAct, { passive: true }); });
    ["pointerdown", "keydown", "touchstart", "mousemove", "wheel"].forEach(function (n) { doc.addEventListener(n, onAct, { passive: true }); });
    doc.addEventListener("visibilitychange", function () {
      if (doc.visibilityState === "hidden") flush(); else { last = Date.now(); start(); }
    });
    window.addEventListener("pagehide", flush);
    start();
  }

  /* ---------- lišta ---------- */
  var css = ".ck{position:fixed;z-index:60;right:max(16px,env(safe-area-inset-right,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));width:min(370px,calc(100vw - 32px));box-sizing:border-box;padding:14px 16px;border:1px solid var(--line,#D6D9D5);border-radius:8px;background:var(--bg,#F3F4F2);color:var(--ink,#23272B);font:400 .86rem/1.5 var(--body,Arial,sans-serif);box-shadow:0 14px 40px rgba(0,0,0,.2),0 2px 6px rgba(0,0,0,.08)}" +
    ".ck[hidden],.ck-x[hidden]{display:none}.ck .ck-h{display:none;margin:0 0 6px;font:650 1rem/1.3 var(--display,Arial,sans-serif);font-stretch:112%;letter-spacing:-.005em}.ck p{margin:0}" +
    ".ck a{color:inherit;text-decoration:underline;text-decoration-color:var(--oak,#A4713F);text-decoration-thickness:1.5px;text-underline-offset:.2em}" +
    ".ck-set{margin:12px 0 0;padding:0;border:0;display:grid;gap:8px}.ck-set[hidden]{display:none}" +
    ".ck-row{display:grid;grid-template-columns:auto 1fr;gap:10px;align-items:start;padding:10px 12px;border:1px solid var(--line,#D6D9D5);border-radius:6px;cursor:pointer}" +
    ".ck-row input{margin:3px 0 0;width:18px;height:18px;accent-color:var(--oak,#A4713F)}.ck-row b{display:block;font-weight:650}.ck-row small{display:block;color:var(--muted,#5A5F5C);font-size:.82rem;line-height:1.4}" +
    ".ck-b{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.ck.sett [data-ck=save]{grid-column:1/-1}.ck.sett .ck-h{display:block}" +
    ".ck-b button{min-height:38px;padding:0 8px;border:1.5px solid var(--ink,#23272B);border-radius:3px;background:transparent;color:var(--ink,#23272B);font:600 .86rem var(--body,Arial,sans-serif);cursor:pointer;transition:background-color .2s ease,color .2s ease}" +
    ".ck-b button:hover{background:var(--ink,#23272B);color:var(--bg,#F3F4F2)}.ck-b button:focus-visible,.ck-row:focus-within{outline:2px solid var(--oak,#A4713F);outline-offset:2px}" +
    ".ck:not(.sett) [data-ck=save]{display:none}" +
    ".ck-link{padding:0;border:0;background:none;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:.2em;cursor:pointer}" +
    "@media (max-width:640px){.ck{left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom,0px));width:auto;padding:14px}}" +
    ".ck-x{margin-left:4px}.ck p a,.ck-x{white-space:nowrap}" +
    ".map-ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px;background-color:var(--bg,#F3F4F2);background-image:linear-gradient(var(--line,#D6D9D5) 1px,transparent 1px),linear-gradient(90deg,var(--line,#D6D9D5) 1px,transparent 1px);background-size:44px 44px;background-position:center}" +
    ".map-ph[hidden]{display:none}.map-ph-in{max-width:34ch;padding:18px 20px;border:1px solid var(--line,#D6D9D5);border-radius:6px;background:var(--bg,#F3F4F2);text-align:center;font-weight:400}" +
    ".map-ph-in svg{display:block;margin:0 auto 8px;color:var(--oak,#A4713F)}.map-ph-in p{margin:0 0 12px;font-size:.9rem;line-height:1.45;color:var(--ink,#23272B)}" +
    ".map-ph-in small{display:block;margin-top:10px;font-size:.76rem;line-height:1.4;color:var(--muted,#5A5F5C)}" +
    ".map-btn{min-height:40px;padding:0 18px;border:1.5px solid var(--ink,#23272B);border-radius:3px;background:transparent;color:var(--ink,#23272B);font:600 .9rem var(--body,Arial,sans-serif);cursor:pointer}" +
    ".map-btn:hover{background:var(--ink,#23272B);color:var(--bg,#F3F4F2)}" +
    "@media print{.ck{display:none}}";

  var box = null, cssOn = false;
  function addCss() {
    if (cssOn) return; cssOn = true;
    var st = doc.createElement("style"); st.textContent = css; doc.head.appendChild(st);
  }
  function build() {
    addCss();
    box = doc.createElement("div");
    box.className = "ck"; box.hidden = true;
    box.setAttribute("role", "region"); box.setAttribute("aria-label", "Cookies");
    box.innerHTML =
      '<p class="ck-h">' + T.title + '</p><p>' + T.text + ' <a href="' + T.href + '">' + T.more + '</a>' +
      '<span class="ck-x">· <button type="button" class="ck-link" data-ck="set">' + T.set + '</button></span></p>' +
      '<div class="ck-set" hidden>' +
        '<label class="ck-row"><input type="checkbox" checked disabled><span><b>' + T.nec + '</b><small>' + T.necd + '</small></span></label>' +
        '<label class="ck-row"><input type="checkbox" id="ck-an"><span><b>' + T.an + '</b><small>' + T.and + '</small></span></label>' +
        '<label class="ck-row"><input type="checkbox" id="ck-mp"><span><b>' + T.mp + '</b><small>' + T.mpd + '</small></span></label>' +
      '</div>' +
      '<div class="ck-b"><button type="button" data-ck="yes">' + T.yes + '</button><button type="button" data-ck="no">' + T.no +
      '</button><button type="button" data-ck="save">' + T.save + '</button></div>';
    doc.body.appendChild(box);
    box.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("[data-ck]"); if (!b) return;
      var k = b.getAttribute("data-ck");
      if (k === "set") { show(true); box.querySelector("#ck-an").focus(); return; }
      var sett = box.classList.contains("sett"), c;
      if (k === "save") c = { a: box.querySelector("#ck-an").checked, m: box.querySelector("#ck-mp").checked };
      else if (sett) c = { a: k === "yes", m: k === "yes" };          // Prijať všetko / Odmietnuť všetko
      else c = { a: k === "yes" };                                      // lišta: týka sa len Google Analytics
      var was = granted, r = write(c);
      if (r.a) grant(); else deny();
      if (r.m) loadMaps(); else unloadMaps();
      if (r.a && !was) ev("suhlas_cookies", { verzia: VER, suhlas_id: r.id });
      hide();
    });
  }
  function show(settings) {
    if (!box) build();
    var c = read();
    box.querySelector("#ck-an").checked = !!(c && c.a);
    box.querySelector("#ck-mp").checked = !!(c && c.m);
    box.classList.toggle("sett", !!settings);
    box.querySelector(".ck-set").hidden = !settings;
    box.querySelector(".ck-x").hidden = !!settings;
    box.querySelector("[data-ck=yes]").textContent = settings ? T.yesAll : T.yes;
    box.querySelector("[data-ck=no]").textContent = settings ? T.noAll : T.no;
    box.hidden = false;
  }
  function hide() { if (box) box.hidden = true; }

  doc.addEventListener("click", function (e) {
    var o = e.target.closest && e.target.closest("[data-ck-open]");
    if (o) { e.preventDefault(); show(true); }
  });

  function init() {
    var c = read();
    addCss();
    prepMaps();
    if (c && c.a === true) grant();
    if (c && c.m) loadMaps();
    if (!c || typeof c.a !== "boolean") show(false);
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init); else init();
})();
