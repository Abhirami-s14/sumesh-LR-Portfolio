/* ============================================================================
   Site renderer — builds every page from window.SITE (assets/data.js).
   <body data-page="home"> renders the opening slider; any category key
   (exterior | interior | walkthroughs | panoramas) renders that category page.
   You should not need to edit this file to change content.
   ========================================================================== */
(function(){
"use strict";
const S = window.SITE;
const PAGE = document.body.getAttribute("data-page") || "home";
const CATS = S.categories;
const HOME = "index.html";
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

/* ---------- helpers ---------- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pad = n => String(n).padStart(2, "0");
const arrow = d => '<span class="arr" aria-hidden="true">' + d + '</span>';
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

const TINT = {
  exterior:     ["#2C3B4B", "#121A23", "Ex"],
  interior:     ["#4A3B2C", "#1C150F", "In"],
  walkthroughs: ["#33304A", "#141220", "AI"],
  panoramas:    ["#23403C", "#0E1C1A", "360"]
};

function plate(slot, ratio){
  const r = ratio || "16/9";
  return '<div class="ph" style="aspect-ratio:' + esc(r) + '"><div><div class="ph__k">' + esc(slot) + '</div>' +
    '<div class="ph__s">' + esc(r.replace("/", ":")) + ' &middot; add image in data.js</div></div></div>';
}

/* full-bleed category media: the slide image, or a tinted stand-in */
function catMedia(cat, eager){
  const sl = cat.slide || {};
  if (sl.src){
    return '<img src="' + esc(sl.src) + '" alt="' + esc(sl.alt || cat.title) + '" style="object-position:' + esc(sl.focus || "50% 50%") + '"' +
      (eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }
  const t = TINT[cat.key] || ["#2A3038", "#11151A", cat.title.slice(0, 2)];
  return '<div class="sx__ph" style="--t1:' + t[0] + ';--t2:' + t[1] + '">' +
    '<span class="sx__ph-glyph" aria-hidden="true">' + esc(t[2]) + '</span></div>';
}

function stats(cat){
  if (cat.type === "projects"){
    const r = cat.projects.reduce((a, p) => a + p.images.length, 0);
    return [[pad(cat.projects.length), "Collections"], [pad(r), cat.pano ? "Panoramas" : "Renders"]];
  }
  if (cat.type === "videos"){
    let sec = 0;
    cat.items.forEach(v => { const m = String(v.duration || "").match(/^(\d+):(\d{2})$/); if (m) sec += (+m[1]) * 60 + (+m[2]); });
    const out = [[pad(cat.items.length), "Films"]];
    if (sec) out.push([Math.floor(sec / 60) + ":" + pad(sec % 60), "Runtime"]);
    return out;
  }
  return [[pad(cat.items.length), "Panoramas"], ["360°", "Interactive"]];
}
const statLine = cat => stats(cat).map(s => '<b>' + esc(s[0]) + '</b> ' + esc(s[1])).join(" &nbsp;·&nbsp; ");
const sections = cat => cat.type === "projects" ? cat.projects : cat.items;

/* ============================================================================
   Shared chrome
   ========================================================================== */
function navMarkup(){
  /* same navigation as the home page */
  const L = [["Home", HOME + "#top"], ["About", HOME + "#about"], ["Work", HOME + "#work"], ["Contact", HOME + "#contact"]];
  return '<header class="nav" id="nav"><div class="nav__in" style="justify-content:flex-end">' +
    '<nav class="nav__links nav__links--keep" aria-label="Sections">' +
      L.map(l => '<a href="' + l[1] + '"' + (l[0] === "Work" ? ' class="is-active"' : "") + '>' + l[0] + '</a>').join("") +
    '</nav></div></header>';
}

const BAT_ICON =
  '<svg width="24" height="24" viewBox="0 0 26 26" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<circle class="pi-ring" cx="13" cy="13" r="12" stroke-dasharray="1.6 4.4" stroke-width="1"/>' +
  '<g class="pi-bat"><path d="M16.4 5.2a2.3 2.3 0 0 1 3.3 3.3l-5.6 5.6-3.3-3.3z"/><path d="M10.4 11.4 8.4 13.4"/></g>' +
  '<g class="pi-ball"><circle cx="8.3" cy="18.2" r="3.1" fill="currentColor" stroke="none"/>' +
  '<path d="M6.1 16a3.1 3.1 0 0 0 0 4.4" stroke="var(--ground)" stroke-width="0.9"/><path d="M10.5 16a3.1 3.1 0 0 1 0 4.4" stroke="var(--ground)" stroke-width="0.9"/></g></svg>';

function footerMarkup(){
  return '<footer class="foot wrap"><div class="foot__in">' +
    '<span class="label">' + esc(S.name) + ' © ' + new Date().getFullYear() + '</span>' +
    '<nav class="foot__cats label" aria-label="Categories">' + CATS.map(c => '<a href="' + esc(c.page) + '">' + esc(c.title) + '</a>').join("") + '</nav>' +
    (window.openCricket ? '<button class="play-icon" id="playCricket" aria-label="Play cricket">' + BAT_ICON +
      '<span class="label">Play cricket</span><span class="pi-six" aria-hidden="true">6</span></button>' : "") +
    '<a class="label" href="#top" style="color:var(--ink)">Back to top ↑</a>' +
  '</div></footer>';
}

function overlaysMarkup(){
  return '<div class="lb" id="lb" hidden role="dialog" aria-modal="true" aria-label="Image viewer">' +
    '<div class="lb__bar"><span class="label" id="lbTitle" style="color:#8A96A1"></span>' +
    '<span class="label" id="lbCount" style="color:#E6EAEE"></span>' +
    '<button class="lb__x" id="lbClose" aria-label="Close viewer">Close ✕</button></div>' +
    '<div class="lb__stage" id="lbStage"></div>' +
    '<button class="lb__nav lb__prev" id="lbPrev" aria-label="Previous image">←</button>' +
    '<button class="lb__nav lb__next" id="lbNext" aria-label="Next image">→</button>' +
    '<div class="lb__cap" id="lbCap"></div></div>' +
  '<div class="pv" id="pv" hidden role="dialog" aria-modal="true" aria-label="360 degree panorama viewer">' +
    '<div class="pv__bar"><div><div class="label" style="color:#8A96A1">360° Panorama</div>' +
    '<div id="pvTitle" class="serif" style="font-size:clamp(20px,2.4vw,30px);line-height:1.2;color:#ECEEF1"></div></div>' +
    '<div class="pv__ctrls"><button class="pv__btn" id="pvFs">Fullscreen</button>' +
    '<button class="pv__btn" id="pvClose" aria-label="Close panorama viewer">Close ✕</button></div></div>' +
    '<canvas class="pv__canvas" id="pvCanvas"></canvas>' +
    '<div class="pv__hint" id="pvHint">Drag to look around · scroll to zoom</div>' +
    '<div class="pv__note" id="pvNote" hidden></div></div>';
}

/* ============================================================================
   HOME — opening slider of the four categories
   ========================================================================== */
function renderHome(app){
  const n = CATS.length;
  const bgs = CATS.map((c, i) =>
    '<div class="sx__bg' + (i === 0 ? " is-active" : "") + '" data-i="' + i + '" aria-hidden="' + (i === 0 ? "false" : "true") + '">' +
      '<div class="sx__par"><div class="sx__img">' + catMedia(c, i === 0) + '</div></div>' +
      (!c.slide || !c.slide.src ? '<span class="sx__ph-note">Add slide image · data.js</span>' : "") +
    '</div>').join("");

  const texts = CATS.map((c, i) => {
    const words = c.title.split(" ").map(w =>
      '<span class="sx__w">' + Array.from(w).map((ch, k) =>
        '<span class="sx__c" style="transition-delay:' + (k * 34) + 'ms">' + esc(ch) + '</span>').join("") + '</span>'
    ).join(" ");
    return '<div class="sx__text' + (i === 0 ? " is-active" : "") + '" data-i="' + i + '"' + (i === 0 ? "" : ' aria-hidden="true"') + '>' +
      '<div class="sx__kicker sx__fade"><b>' + pad(i + 1) + '</b><i></i>' + esc(c.kicker) + '</div>' +
      '<a href="' + esc(c.page) + '" tabindex="' + (i === 0 ? "0" : "-1") + '"><h2 class="sx__title" aria-label="' + esc(c.title) + '">' + words + '</h2></a>' +
      '<p class="sx__blurb sx__fade">' + esc(c.blurb) + '</p>' +
      '<div class="sx__row sx__fade">' +
        '<a class="btn" href="' + esc(c.page) + '" tabindex="' + (i === 0 ? "0" : "-1") + '">Enter ' + esc(c.title) + ' ' + arrow("→") + '</a>' +
        '<span class="sx__meta">' + statLine(c) + '</span>' +
      '</div>' +
    '</div>';
  }).join("");

  const list = CATS.map((c, i) =>
    '<li><button class="sx__li' + (i === 0 ? " is-active" : "") + '" data-go="' + i + '" aria-label="Show ' + esc(c.title) + '">' +
      '<em>' + pad(i + 1) + '</em><span>' + esc(c.title) + '</span><em>' + pad(sections(c).length) + '</em>' +
      '<i class="sx__bar"></i></button></li>').join("");

  const digits = CATS.map((_, i) => '<i>' + pad(i + 1) + '</i>').join("");

  const ab = S.about, ct = S.contact;
  const row = (k, val, href) => '<div><span class="label">' + esc(k) + '</span>' +
    (val ? (href ? '<a href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "") + '>' + esc(val) + '</a>'
                 : '<span class="val">' + esc(val) + '</span>')
         : '<span class="empty">Add ' + esc(k.toLowerCase()) + '</span>') + '</div>';

  app.innerHTML =
  '<section class="sx" id="top" aria-roledescription="carousel" aria-label="Work categories">' +
    bgs + '<div class="sx__veil"></div>' +
    '<div class="sx__stage">' +
      '<div class="sx__texts" aria-live="polite">' + texts + '</div>' +
      '<div class="sx__side">' +
        '<div class="sx__count" aria-hidden="true"><span class="sx__num"><span id="sxDigits">' + digits + '</span></span><span class="sx__tot">/ ' + pad(n) + '</span></div>' +
        '<ol class="sx__list">' + list + '</ol>' +
        '<div class="sx__ctrl"><button class="sx__btn" id="sxPrev" aria-label="Previous category">←</button>' +
        '<button class="sx__btn" id="sxNext" aria-label="Next category">→</button>' +
        '<span class="sx__hint">Drag · arrows · keys</span></div>' +
      '</div>' +
    '</div>' +
    '<a class="sx__scroll label" href="#about" style="color:rgba(255,255,255,.6)"><span>Scroll</span><i></i></a>' +
  '</section>' +

  '<section class="sec wrap" id="about">' +
    '<div class="about__grid">' +
      '<div class="about__head"><span class="label">About</span><h2 class="about__h">' + esc(ab.heading) + '</h2></div>' +
      '<div class="about__portrait" data-reveal><div class="pt"><div class="frame"><div class="frame__in">' +
        (ab.portrait.src ? '<img src="' + esc(ab.portrait.src) + '" alt="' + esc(ab.portrait.alt) + '" loading="lazy">' : plate("Portrait", ab.portrait.ratio)) +
      '</div></div></div></div>' +
      '<div class="about__text" data-reveal>' +
        '<div class="body-copy">' + ab.body.map(p => '<p>' + esc(p) + '</p>').join("") + '</div>' +
        '<div class="disc" aria-label="Browse by category">' +
          CATS.map(c => '<a class="chip" href="' + esc(c.page) + '">' + esc(c.title) + ' <em>' + pad(sections(c).length) + '</em></a>').join("") +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>' +

  '<section class="sec wrap rule" id="contact">' +
    '<span class="label">Contact</span>' +
    '<h2 class="contact__h">' + esc(ct.headline) + '</h2>' +
    '<div class="contact__grid">' +
      '<div><p class="body-copy" style="max-width:40ch;margin:0">' + esc(ct.support) + '</p>' +
        (ct.email ? '<div style="margin-top:14px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><span class="label" style="color:var(--ink);text-transform:none;letter-spacing:.06em;font-size:13px">' + esc(ct.email) + '</span><button class="copy-btn" id="copyMail">Copy address</button></div>' : "") +
      '</div>' +
      '<div class="c-rail">' + row("Email", ct.email, ct.email ? "mailto:" + ct.email : null) + row("LinkedIn", ct.linkedin, ct.linkedin) +
        row("Phone", ct.phone, ct.phone ? "tel:" + ct.phone.replace(/\s+/g, "") : null) + '</div>' +
    '</div>' +
  '</section>' + footerMarkup();

  wireSlider();
}

function wireSlider(){
  const root = $(".sx");
  const bgs = $$(".sx__bg", root), texts = $$(".sx__text", root), items = $$(".sx__li", root);
  const digits = $("#sxDigits");
  const n = bgs.length;
  const DUR = 7000;
  let cur = 0, lock = false;
  root.style.setProperty("--dur", DUR + "ms");

  function go(to, dir){
    to = (to + n) % n;
    if (to === cur || lock) return;
    lock = true; setTimeout(() => { lock = false; }, 650);
    if (dir == null) dir = to > cur ? 1 : -1;
    root.classList.toggle("is-back", dir < 0);

    const inB = bgs[to], outB = bgs[cur];
    bgs.forEach(b => { if (b !== outB && b !== inB) b.classList.remove("is-prev", "is-active"); });
    inB.style.transition = "none"; inB.classList.remove("is-active", "is-prev");
    void inB.offsetWidth;
    inB.style.transition = "";
    outB.classList.remove("is-active"); outB.classList.add("is-prev");
    inB.classList.add("is-active");
    bgs.forEach((b, i) => b.setAttribute("aria-hidden", i === to ? "false" : "true"));

    texts.forEach((t, i) => {
      const on = i === to;
      t.classList.toggle("is-active", on);
      t.classList.toggle("is-out", i === cur);
      if (on) t.removeAttribute("aria-hidden"); else t.setAttribute("aria-hidden", "true");
      $$("a", t).forEach(a => a.tabIndex = on ? 0 : -1);
    });
    const was = cur;
    setTimeout(() => texts[was].classList.remove("is-out"), 900);

    items.forEach((b, i) => b.classList.remove("is-active"));
    void items[to].offsetWidth;
    items[to].classList.add("is-active");
    if (digits) digits.style.transform = "translateY(" + (-to * 0.8) + "em)";
    cur = to;
  }

  /* autoplay: the progress bar's own animation drives the timer, so pausing it pauses everything */
  if (!reduced){
    root.addEventListener("animationend", e => { if (e.target.classList.contains("sx__bar")) go(cur + 1, 1); });
  } else {
    root.classList.add("is-paused");
  }
  const holds = new Set();
  const hold = (k, on) => { on ? holds.add(k) : holds.delete(k); if (!reduced) root.classList.toggle("is-paused", holds.size > 0); };
  $(".sx__side", root).addEventListener("pointerenter", () => hold("side", true));
  $(".sx__side", root).addEventListener("pointerleave", () => hold("side", false));
  root.addEventListener("focusin", () => hold("focus", true));
  root.addEventListener("focusout", () => hold("focus", false));
  document.addEventListener("visibilitychange", () => hold("hidden", document.hidden));
  if ("IntersectionObserver" in window){
    new IntersectionObserver(es => es.forEach(e => hold("view", e.intersectionRatio < 0.5)), { threshold: [0, .5, 1] }).observe(root);
  }

  items.forEach(b => b.addEventListener("click", () => go(+b.getAttribute("data-go"))));
  $("#sxPrev").addEventListener("click", () => go(cur - 1, -1));
  $("#sxNext").addEventListener("click", () => go(cur + 1, 1));

  /* drag / swipe */
  let sx = null, sy = 0, moved = false;
  root.addEventListener("pointerdown", e => {
    if (e.button !== 0 || e.target.closest("button")) return;
    sx = e.clientX; sy = e.clientY; moved = false;
  });
  window.addEventListener("pointerup", e => {
    if (sx == null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    sx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.2){ moved = true; go(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); }
  });
  root.addEventListener("click", e => { if (moved){ e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  root.addEventListener("dragstart", e => e.preventDefault());

  document.addEventListener("keydown", e => {
    if (overlayOpen() || /input|textarea/i.test(e.target.tagName)) return;
    const r = root.getBoundingClientRect();
    if (r.bottom < window.innerHeight * 0.5) return;
    if (e.key === "ArrowRight"){ e.preventDefault(); go(cur + 1, 1); }
    else if (e.key === "ArrowLeft"){ e.preventDefault(); go(cur - 1, -1); }
  });

  /* gentle parallax on the active image */
  if (fine && !reduced){
    root.addEventListener("pointermove", e => {
      const r = root.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      const p = $(".sx__bg.is-active .sx__par", root);
      if (p) p.style.transform = "translate3d(" + (-x * 14).toFixed(1) + "px," + (-y * 9).toFixed(1) + "px,0)";
    });
  }

  /* nav turns solid once the slider is behind it */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("is-solid", window.scrollY > root.offsetHeight - 70);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
}

/* ============================================================================
   CATEGORY PAGES
   ========================================================================== */
const galleries = Object.create(null);

/* One render tile. Real renders carry w/h, so the frame takes the image's own
   aspect ratio: nothing is cropped or stretched. The grid loads the light
   thumbnail; the lightbox loads the full-size file. */
function figure(im, alt, key, idx, num, lead, pano){
  const ar = im.w && im.h ? im.w / im.h : 0;
  const inner = im.src
    ? '<img src="' + esc(im.thumb || im.src) + '"' +
        (im.thumb ? ' srcset="' + esc(im.thumb) + ' 1100w, ' + esc(im.src) + ' ' + Math.max(im.w, im.h) + 'w"' +
          ' sizes="' + (lead ? "(max-width:1000px) 100vw, 75vw" : "(max-width:640px) 100vw, (max-width:1000px) 50vw, 34vw") + '"' : "") +
        (im.w ? ' width="' + im.w + '" height="' + im.h + '"' : "") +
        ' alt="' + esc(alt) + '" loading="lazy" decoding="async">'
    : plate(alt, im.ratio);
  return '<figure class="jg__f' + (lead ? " jg__f--lead" : "") + '" data-reveal' + (ar ? ' style="--ar:' + ar.toFixed(4) + '"' : "") + '>' +
    (pano
      ? '<button class="frame frame--click jg__pano" data-pano-key="' + esc(key) + '" data-idx="' + idx + '" aria-label="Explore ' + esc(im.title || alt) + ' in 360 degrees">' +
          '<span class="frame__in">' + inner + '</span>' +
          '<span class="jg__n" aria-hidden="true">' + num + '</span><span class="pf__badge jg__badge">360°</span>' +
          '<span class="frame__zoom">↻ Explore 360°</span></button>'
      : '<button class="frame frame--click" data-gal="' + esc(key) + '" data-idx="' + idx + '" aria-label="Open ' + esc(alt) + ' full screen">' +
          '<span class="frame__in">' + inner + '</span>' +
          '<span class="jg__n" aria-hidden="true">' + num + '</span><span class="frame__zoom">View ↗</span></button>') +
    (im.caption ? '<figcaption class="cap"><b>' + num + '</b>' + esc(im.caption) + '</figcaption>' : "") +
  '</figure>';
}

/* Renders in their numbered order, laid out as justified rows: each row fills the
   width at one shared height, so landscape and portrait sit together uncropped
   and the sequence reads left to right. A landscape first render leads the set. */
const panoSets = Object.create(null);
function projectGallery(p, key, catTitle, pano){
  const imgs = pano ? p.images.map(im => Object.assign({}, im, { src: im.thumb, thumb: "", caption: im.title, pano: im.src })) : p.images;
  const n = imgs.length;
  if (pano) panoSets[key] = p.images;
  const altOf = i => catTitle + " render — " + p.title + ", image " + (i + 1) + " of " + n;
  galleries[key] = imgs.map((im, i) => ({ src: im.src, ratio: im.ratio, caption: im.caption || (catTitle + " · " + p.title),
    alt: altOf(i), title: p.title }));
  const f = (i, lead) => figure(imgs[i], pano ? catTitle + " — " + p.title + ": " + (imgs[i].title || "view " + (i + 1)) : altOf(i), key, i, pad(i + 1), lead, pano);
  const first = imgs[0];
  const lead = first && first.w && first.w / first.h >= 1.25;
  let out = lead ? f(0, true) : "";
  out += '<div class="jg">';
  for (let i = lead ? 1 : 0; i < n; i++) out += f(i, false);
  return '<div class="gal">' + out + '</div></div>';
}

function bayHead(num, title, desc, meta){
  const cells = meta.filter(m => m[1]).map(m => '<div><span class="meta-k">' + esc(m[0]) + '</span><b>' + esc(m[1]) + '</b></div>').join("");
  return '<div class="bay__head" data-reveal>' +
    '<div class="bay__n" aria-hidden="true">' + num + '</div>' +
    '<div style="min-width:0"><h2 class="bay__t">' + esc(title) + '</h2>' +
      '<div class="bay__sub">' + (desc ? '<p class="bay__desc">' + esc(desc) + '</p>' : "<span></span>") +
      (cells ? '<div class="meta-t">' + cells + '</div>' : "") + '</div>' +
    '</div></div>';
}

function bayMarkup(cat, it, i){
  const num = pad(i + 1), id = "s" + num;
  if (cat.type === "projects"){
    return '<section class="bay" id="' + id + '"' + (it.slug ? ' data-sub="' + esc(it.slug) + '"' : "") + '>' +
      bayHead(num, it.title, it.description, [["Category", cat.title], [cat.pano ? "Panoramas" : "Renders", pad(it.images.length)],
        ["Location", it.location], ["Year", it.year], ["Type", it.type], ["View", cat.pano ? "360° × 180°" : ""]]) +
      projectGallery(it, cat.key + num, cat.title, cat.pano) + '</section>';
  }
  if (cat.type === "videos"){
    return '<section class="bay" id="' + id + '">' +
      bayHead(num, it.title, it.caption, [["Location", it.location], ["Year", it.year], ["Duration", it.duration], ["Format", "AI walkthrough"]]) +
      '<div class="vf" data-reveal data-vf="' + i + '">' +
        '<span class="frame__in">' + (it.poster ? '<img src="' + esc(it.poster) + '" alt="' + esc(it.title) + ' walkthrough still" loading="lazy">' : plate("Walkthrough " + num + " / poster still", "16/9")) + '</span>' +
        '<button class="vf__btn" data-play="' + i + '" aria-label="Play ' + esc(it.title) + ' walkthrough">' +
          '<span class="vf__play" aria-hidden="true"><svg width="20" height="22" viewBox="0 0 18 20" fill="currentColor"><path d="M1 1.6a1 1 0 0 1 1.5-.87l14 8.4a1 1 0 0 1 0 1.74l-14 8.4A1 1 0 0 1 1 18.4z"/></svg></span></button>' +
        '<span class="vf__lbl label" style="color:#E6EAEE">Play walkthrough</span>' +
        (it.duration ? '<span class="vf__dur">' + esc(it.duration) + '</span>' : "") +
      '</div></section>';
  }
  /* panoramas */
  const prev = it.preview || it.panorama;
  return '<section class="bay" id="' + id + '">' +
    bayHead(num, it.title, it.caption, [["Location", it.location], ["View", "360° × 180°"]]) +
    '<button class="pf" data-reveal data-pano="' + i + '" aria-label="Explore ' + esc(it.title) + ' in 360 degrees">' +
      (prev ? '<span class="pf__pan" data-src="' + esc(prev) + '" style="background-image:url(\'' + esc(prev) + '\')"></span>'
            : plate("Panorama " + num + " / equirectangular 2:1", "21/9")) +
      '<span class="pf__ov"><span class="pf__badge">360°</span>' +
        '<span class="pf__go"><span class="pf__ring" aria-hidden="true">↻</span><span class="label">Explore 360°</span></span></span>' +
    '</button></section>';
}

function renderCategory(app){
  const idx = CATS.findIndex(c => c.key === PAGE);
  if (idx < 0){ app.innerHTML = '<p class="wrap sec">Unknown page.</p>'; return; }
  const cat = CATS[idx], next = CATS[(idx + 1) % CATS.length];
  const list = sections(cat);
  document.title = cat.title + " — " + S.name;

  /* Exterior / Interior: the section index doubles as a subcategory filter
     (All + one entry per collection). Walkthroughs / 360° keep the scroll index. */
  const filt = cat.type === "projects" && list.every(it => it.slug);
  const total = filt ? list.reduce((a, p) => a + p.images.length, 0) : 0;
  const idxLinks = filt
    ? ['<a class="cp__f" href="#all" data-filter="all"><em>—</em><span>' + (cat.pano ? "All panoramas" : "All renders") + '</span><i>' + pad(total) + '</i></a>'].concat(
        list.map((it, i) => '<a class="cp__f" href="#' + esc(it.slug) + '" data-filter="' + esc(it.slug) + '"><em>' + pad(i + 1) + '</em><span>' +
          esc(it.title) + '</span><i>' + pad(it.images.length) + '</i></a>'))
    : list.map((it, i) => '<a href="#s' + pad(i + 1) + '" data-spy="s' + pad(i + 1) + '"><em>' + pad(i + 1) + '</em><span>' + esc(it.title) + '</span></a>');
  const stripLinks = filt
    ? ['<a class="chip" href="#all" data-filter="all">All <em>' + pad(total) + '</em></a>'].concat(
        list.map(it => '<a class="chip" href="#' + esc(it.slug) + '" data-filter="' + esc(it.slug) + '">' + esc(it.title) + ' <em>' + pad(it.images.length) + '</em></a>'))
    : list.map((it, i) => '<a class="chip" href="#s' + pad(i + 1) + '" data-spy="s' + pad(i + 1) + '"><em>' + pad(i + 1) + '</em>' + esc(it.title) + '</a>');

  app.innerHTML =
  '<section class="ch" id="top">' +
    '<div class="ch__media"><span class="frame__in">' + catMedia(cat, true) + '</span></div><div class="sx__veil"></div>' +
    '<div class="ch__in wrap">' +
      '<div class="ch__crumb label"><a class="back" href="' + HOME + '#work" style="color:rgba(255,255,255,.75)">' + arrow("←") + ' Back to work</a>' +
        '<span style="color:rgba(255,255,255,.5)">Category ' + pad(idx + 1) + ' of ' + pad(CATS.length) + '</span></div>' +
      '<div>' +
        '<div class="sx__kicker"><b>' + pad(idx + 1) + '</b><i></i>' + esc(cat.kicker) + '</div>' +
        '<h1 class="ch__t">' + esc(cat.title) + '</h1>' +
        '<div class="ch__grid" style="margin-top:clamp(18px,2.2vw,30px)">' +
          '<p class="sx__blurb" style="margin:0">' + esc(cat.blurb) + '</p>' +
          '<div class="ch__stats">' + stats(cat).map(s => '<div><b>' + esc(s[0]) + '</b><span class="label" style="color:rgba(255,255,255,.65)">' + esc(s[1]) + '</span></div>').join("") + '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</section>' +
  '<div class="cp__strip"' + (filt ? ' role="navigation" aria-label="Filter ' + esc(cat.title) + ' renders"' : "") + '><div class="cp__strip-in">' +
    stripLinks.join("") + '</div></div>' +
  '<div class="cp wrap" id="gallery">' +
    '<aside class="cp__rail" aria-label="' + (filt ? "Filter " + esc(cat.title) + " renders" : "Sections") + '"><span class="label">' +
      esc(cat.title) + ' · ' + (filt ? "Browse" : pad(list.length)) + '</span><ol' + (filt ? ' class="cp__fl"' : "") + '>' +
      idxLinks.map(l => '<li>' + l + '</li>').join("") + '</ol></aside>' +
    '<div class="cp__main">' + list.map((it, i) => bayMarkup(cat, it, i)).join("") + '</div>' +
  '</div>' +
  '<a class="nx" href="' + esc(next.page) + '">' +
    '<div class="nx__media"><span class="frame__in">' + catMedia(next) + '</span></div><div class="sx__veil"></div>' +
    '<div class="nx__in wrap"><div><span class="label" style="color:rgba(255,255,255,.7)">Next category · ' + pad(((idx + 1) % CATS.length) + 1) + '</span>' +
      '<div class="nx__t">' + esc(next.title) + '</div>' +
      '<div class="sx__meta" style="margin-top:14px">' + statLine(next) + '</div></div>' +
      '<span class="nx__go" aria-hidden="true">→</span></div>' +
  '</a>' + footerMarkup();

  requestAnimationFrame(() => requestAnimationFrame(() => $(".ch").classList.add("is-in")));
  if (filt) wireFilter(list); else setupSpy();
  if (cat.type === "videos") wireVideos(cat);
  if (cat.type === "panos") wirePanos(cat);
  if (cat.pano) document.addEventListener("click", e => {
    const b = e.target.closest("[data-pano-key]"); if (!b) return;
    const im = panoSets[b.getAttribute("data-pano-key")][+b.getAttribute("data-idx")];
    openPano({ title: im.title, panorama: im.src, mobile: im.mobile });
  });
}

function setupSpy(){
  const links = $$("[data-spy]");
  const bays = $$(".bay");
  if (!("IntersectionObserver" in window) || !bays.length) return;
  const strip = $(".cp__strip-in");
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => {
      const on = a.getAttribute("data-spy") === e.target.id;
      a.classList.toggle("is-active", on);
      if (on && strip && a.parentNode === strip && strip.offsetParent){
        strip.scrollTo({ left: a.offsetLeft - 16, behavior: reduced ? "auto" : "smooth" });
      }
    });
  }), { rootMargin: "-38% 0px -58% 0px" });
  bays.forEach(b => io.observe(b));
}

/* Subcategory filter: #all or #<slug> in the address, no page reload.
   Back/forward step through filters; unknown hashes (e.g. #top) are ignored. */
function wireFilter(list){
  const slugs = list.map(it => it.slug);
  const links = $$("[data-filter]");
  const bays = $$(".bay[data-sub]");
  const strip = $(".cp__strip-in");
  const gal = $("#gallery");
  let cur = null;

  function apply(f, scroll){
    if (f !== "all" && slugs.indexOf(f) < 0) f = "all";
    const changed = f !== cur;
    cur = f;
    bays.forEach(b => { b.hidden = f !== "all" && b.getAttribute("data-sub") !== f; });
    /* the first visible bay keeps no top rule, so a filtered view starts clean */
    bays.forEach(b => b.classList.remove("is-first"));
    const firstVis = bays.find(b => !b.hidden); if (firstVis) firstVis.classList.add("is-first");
    links.forEach(a => {
      const on = a.getAttribute("data-filter") === f;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      if (on && strip && a.parentNode === strip && strip.offsetParent){
        strip.scrollTo({ left: a.offsetLeft - 16, behavior: reduced ? "auto" : "smooth" });
      }
    });
    if (scroll && changed && gal){
      const top = gal.getBoundingClientRect().top + window.scrollY - (strip && strip.offsetParent ? 120 : 70);
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduced ? "auto" : "smooth" });
    }
  }
  const fromHash = () => (location.hash || "").slice(1).toLowerCase();

  links.forEach(a => a.addEventListener("click", e => {
    e.preventDefault();
    const f = a.getAttribute("data-filter");
    if (f !== cur) history.pushState(null, "", f === "all" ? location.pathname + location.search : "#" + f);
    apply(f, true);
  }));
  window.addEventListener("popstate", () => {
    const h = fromHash();
    if (!h || h === "all" || slugs.indexOf(h) >= 0) apply(h || "all", true);
  });
  const h = fromHash();
  apply(slugs.indexOf(h) >= 0 ? h : "all", false);
}

function wireVideos(cat){
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-play]");
    if (!b) return;
    const i = +b.getAttribute("data-play"), it = cat.items[i];
    const box = b.closest(".vf");
    if (it.video){
      box.insertAdjacentHTML("beforeend", '<video src="' + esc(it.video) + '" controls autoplay playsinline' + (it.poster ? ' poster="' + esc(it.poster) + '"' : "") + '></video>');
      $$(".vf__btn,.vf__lbl,.vf__dur", box).forEach(el => el.hidden = true);
      const v = $("video", box); try { v.focus(); } catch(_){}
    } else if (!$(".vf__note", box)){
      box.insertAdjacentHTML("beforeend", '<div class="vf__note"><div>No video file for this walkthrough yet.<br>Add an .mp4 path to <b>' +
        esc(cat.key) + ' → items[' + i + '].video</b> in data.js.</div></div>');
      setTimeout(() => { const n = $(".vf__note", box); if (n) n.remove(); }, 3600);
    }
  });
}

function wirePanos(cat){
  /* slow horizontal drift through each panorama preview */
  const pans = $$(".pf__pan");
  const size = el => {
    const im = el._img; if (!im || !im.naturalHeight) return;
    const w = el.offsetHeight * im.naturalWidth / im.naturalHeight;
    el.style.setProperty("--pan-w", w.toFixed(0) + "px");
    el.style.setProperty("--pan-dur", Math.max(40, w / 18).toFixed(0) + "s");
  };
  pans.forEach(el => { const im = new Image(); el._img = im; im.onload = () => size(el); im.src = el.getAttribute("data-src"); });
  window.addEventListener("resize", () => pans.forEach(size));
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-pano]");
    if (b) openPano(cat.items[+b.getAttribute("data-pano")]);
  });
}

/* ============================================================================
   Lightbox
   ========================================================================== */
let lb, lbStage, lbCount, lbCap, lbTitle, lbList = [], lbIdx = 0, lbPrevFocus = null;
function openLightbox(key, idx){
  lbList = galleries[key] || []; if (!lbList.length) return;
  lbIdx = idx; lbPrevFocus = document.activeElement;
  lb.hidden = false; document.body.style.overflow = "hidden";
  paintLightbox(); $("#lbClose").focus();
}
function paintLightbox(){
  const im = lbList[lbIdx];
  lbStage.innerHTML = im.src ? '<img src="' + esc(im.src) + '" alt="' + esc(im.alt) + '">' : plate(im.title + " / render " + pad(lbIdx + 1), im.ratio);
  lbCount.textContent = pad(lbIdx + 1) + " / " + pad(lbList.length);
  lbCap.textContent = im.caption; lbTitle.textContent = im.title;
  /* warm the neighbours so stepping through is instant */
  [1, -1].forEach(d => { const n = lbList[(lbIdx + d + lbList.length) % lbList.length]; if (n && n.src){ const p = new Image(); p.decoding = "async"; p.src = n.src; } });
}
function stepLightbox(d){ lbIdx = (lbIdx + d + lbList.length) % lbList.length; paintLightbox(); }
function closeLightbox(){ lb.hidden = true; document.body.style.overflow = ""; if (lbPrevFocus) lbPrevFocus.focus(); }

/* ============================================================================
   360° viewer — WebGL equirectangular projection
   ========================================================================== */
let pv, pvCanvas, pvHint, pvNote, pvTitle, gl = null, prog = null, tex = null, raf = 0, pvPrevFocus = null;
let yaw = 0, pitch = 0, fov = 1.25, dragging = false, lastX = 0, lastY = 0, vx = 0, vy = 0;
const VS = "attribute vec2 p;varying vec2 v;void main(){v=p;gl_Position=vec4(p,0.0,1.0);}";
const FS = "precision highp float;varying vec2 v;uniform sampler2D t;uniform float a,f,yw,pt;void main(){float s=tan(f*0.5);vec3 d=normalize(vec3(v.x*a*s,v.y*s,-1.0));float cp=cos(pt),sp=sin(pt);d=vec3(d.x,d.y*cp-d.z*sp,d.y*sp+d.z*cp);float cy=cos(yw),sy=sin(yw);d=vec3(d.x*cy+d.z*sy,d.y,-d.x*sy+d.z*cy);float u=atan(d.x,-d.z)/6.2831853+0.5;float w=acos(clamp(d.y,-1.0,1.0))/3.14159265;gl_FragColor=texture2D(t,vec2(u,w));}";

function initGL(){
  if (gl) return true;
  gl = pvCanvas.getContext("webgl", { antialias: true, alpha: false }) || pvCanvas.getContext("experimental-webgl");
  if (!gl) return false;
  const sh = (src, type) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  prog = gl.createProgram();
  gl.attachShader(prog, sh(VS, gl.VERTEX_SHADER)); gl.attachShader(prog, sh(FS, gl.FRAGMENT_SHADER));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)){ gl = null; return false; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  tex = gl.createTexture();
  return true;
}
function uploadTexture(img){
  const pot = n => (n & (n - 1)) === 0;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, (pot(img.width) && pot(img.height)) ? gl.REPEAT : gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}
/* labelled stand-in environment until a real panorama is supplied */
function referenceEnv(){
  const c = document.createElement("canvas"); c.width = 2048; c.height = 1024;
  const x = c.getContext("2d");
  const g = x.createLinearGradient(0, 0, 0, 1024);
  g.addColorStop(0, "#0F161B"); g.addColorStop(.44, "#3B464D"); g.addColorStop(.5, "#5C6A72"); g.addColorStop(.505, "#1E272D"); g.addColorStop(1, "#0B1115");
  x.fillStyle = g; x.fillRect(0, 0, 2048, 1024);
  const sun = x.createRadialGradient(1400, 360, 10, 1400, 360, 420);
  sun.addColorStop(0, "rgba(255,243,214,.5)"); sun.addColorStop(1, "rgba(255,243,214,0)");
  x.fillStyle = sun; x.fillRect(0, 0, 2048, 1024);
  x.strokeStyle = "rgba(230,234,238,.14)"; x.lineWidth = 2; x.fillStyle = "rgba(230,234,238,.55)";
  x.font = "600 24px ui-sans-serif, system-ui, sans-serif"; x.textAlign = "center";
  for (let i = 0; i < 24; i++){ const px = (i / 24) * 2048; x.beginPath(); x.moveTo(px, 0); x.lineTo(px, 1024); x.stroke(); if (i % 3 === 0) x.fillText(Math.round(i * 15) + "°", px, 496); }
  x.fillStyle = "rgba(230,234,238,.42)"; x.font = "600 30px ui-sans-serif, system-ui, sans-serif";
  x.fillText("REFERENCE ENVIRONMENT — ADD PANORAMA IMAGE IN data.js", 1024, 250);
  return c;
}
function resizePV(){
  if (!gl) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  pvCanvas.width = Math.round(pvCanvas.clientWidth * dpr); pvCanvas.height = Math.round(pvCanvas.clientHeight * dpr);
  gl.viewport(0, 0, pvCanvas.width, pvCanvas.height);
}
function drawPV(){
  if (!gl) return;
  if (!dragging){ yaw += vx; pitch += vy; vx *= 0.93; vy *= 0.93; if (Math.abs(vx) < 1e-5) vx = 0; if (Math.abs(vy) < 1e-5) vy = 0; }
  pitch = Math.max(-1.35, Math.min(1.35, pitch));
  gl.uniform1f(gl.getUniformLocation(prog, "a"), pvCanvas.width / Math.max(1, pvCanvas.height));
  gl.uniform1f(gl.getUniformLocation(prog, "f"), fov);
  gl.uniform1f(gl.getUniformLocation(prog, "yw"), yaw);
  gl.uniform1f(gl.getUniformLocation(prog, "pt"), pitch);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  raf = requestAnimationFrame(drawPV);
}
function openPano(item){
  pvTitle.textContent = item.title || "Panorama";
  pvPrevFocus = document.activeElement;
  pv.hidden = false; document.body.style.overflow = "hidden"; pvNote.hidden = true;
  yaw = 0; pitch = 0; fov = 1.25; vx = 0; vy = 0; pvHint.style.opacity = "1";
  if (!initGL()){
    pvNote.hidden = false; pvNote.innerHTML = "This device cannot run the 360° viewer.";
    pvCanvas.hidden = true; pvHint.style.opacity = "0"; $("#pvClose").focus(); return;
  }
  pvCanvas.hidden = false; resizePV();
  uploadTexture(referenceEnv());
  if (item.panorama){
    const max = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
    const url = item.mobile && max < 6144 ? item.mobile : item.panorama;
    pvNote.hidden = false; pvNote.textContent = "Loading panorama…";
    const img = new Image();
    if (/^https?:/.test(url)) img.crossOrigin = "anonymous";
    img.onload = () => { if (pv.hidden) return; uploadTexture(img); pvNote.hidden = true; };
    img.onerror = () => { pvNote.hidden = false; pvNote.textContent = "Panorama image could not be loaded."; };
    img.src = url;
  }
  cancelAnimationFrame(raf); drawPV(); $("#pvClose").focus();
}
function closePano(){
  cancelAnimationFrame(raf); raf = 0; pv.hidden = true; document.body.style.overflow = "";
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  if (pvPrevFocus) pvPrevFocus.focus();
}

function wireOverlays(){
  lb = $("#lb"); lbStage = $("#lbStage"); lbCount = $("#lbCount"); lbCap = $("#lbCap"); lbTitle = $("#lbTitle");
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => stepLightbox(-1));
  $("#lbNext").addEventListener("click", () => stepLightbox(1));
  lb.addEventListener("click", e => { if (e.target === lb || e.target === lbStage) closeLightbox(); });
  let tX = 0, tY = 0;
  lb.addEventListener("touchstart", e => { tX = e.touches[0].clientX; tY = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - tX, dy = e.changedTouches[0].clientY - tY; if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) stepLightbox(dx < 0 ? 1 : -1); }, { passive: true });
  document.addEventListener("click", e => { const f = e.target.closest("[data-gal]"); if (f) openLightbox(f.getAttribute("data-gal"), +f.getAttribute("data-idx")); });

  pv = $("#pv"); pvCanvas = $("#pvCanvas"); pvHint = $("#pvHint"); pvNote = $("#pvNote"); pvTitle = $("#pvTitle");
  $("#pvClose").addEventListener("click", closePano);
  $("#pvFs").addEventListener("click", () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else if (pv.requestFullscreen) pv.requestFullscreen().catch(() => {});
    setTimeout(resizePV, 180);
  });
  window.addEventListener("resize", () => { if (!pv.hidden) resizePV(); });
  pvCanvas.addEventListener("pointerdown", e => { dragging = true; lastX = e.clientX; lastY = e.clientY; vx = 0; vy = 0; try { pvCanvas.setPointerCapture(e.pointerId); } catch(_){} pvHint.style.opacity = "0"; });
  pvCanvas.addEventListener("pointermove", e => {
    if (!dragging) return;
    const k = fov / Math.max(1, pvCanvas.clientHeight) * 1.1;
    const dx = (e.clientX - lastX) * k, dy = (e.clientY - lastY) * k;
    yaw -= dx; pitch -= dy; vx = -dx * 0.55; vy = -dy * 0.55; lastX = e.clientX; lastY = e.clientY;
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(ev => pvCanvas.addEventListener(ev, () => { dragging = false; }));
  pvCanvas.addEventListener("wheel", e => { e.preventDefault(); fov = Math.max(0.55, Math.min(1.9, fov + e.deltaY * 0.0012)); }, { passive: false });

  /* menu */
  document.addEventListener("keydown", e => {
    if (!pv.hidden){
      if (e.key === "Escape") closePano();
      else if (e.key === "ArrowLeft"){ vx = 0; yaw -= 0.09; } else if (e.key === "ArrowRight"){ vx = 0; yaw += 0.09; }
      else if (e.key === "ArrowUp"){ vy = 0; pitch -= 0.06; } else if (e.key === "ArrowDown"){ vy = 0; pitch += 0.06; }
      return;
    }
    if (!lb.hidden){
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") stepLightbox(-1);
      else if (e.key === "ArrowRight") stepLightbox(1);
    }
  });
}
function overlayOpen(){ return $$(".lb,.pv,.mm,.cg").some(el => !el.hidden); }

/* ============================================================================
   Reveals, progress, copy
   ========================================================================== */
function setupReveals(){
  if (reduced || !("IntersectionObserver" in window)) return;
  const vh = window.innerHeight;
  const staged = $$("[data-reveal]").filter(n => n.getBoundingClientRect().top > vh * 0.92);
  staged.forEach(n => n.classList.add("pre"));
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ en.target.classList.remove("pre"); io.unobserve(en.target); } }),
    { rootMargin: "0px 0px -6% 0px", threshold: 0.02 });
  staged.forEach(n => io.observe(n));
}

/* ============================================================================
   Boot
   ========================================================================== */
document.body.insertAdjacentHTML("afterbegin", '<div id="progress"></div>' + navMarkup());
document.body.insertAdjacentHTML("beforeend", overlaysMarkup());
const app = $("#app");
if (PAGE === "home") renderHome(app); else renderCategory(app);
wireOverlays();
setupReveals();

const progress = $("#progress"); let ticking = false;
window.addEventListener("scroll", () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? Math.min(100, window.scrollY / h * 100) : 0) + "%";
    ticking = false;
  });
}, { passive: true });

document.addEventListener("click", async e => {
  if (e.target.closest("#playCricket") && window.openCricket) window.openCricket();
  const b = e.target.closest("#copyMail"); if (!b) return;
  try { await navigator.clipboard.writeText(S.contact.email); b.textContent = "Copied"; }
  catch (_) { b.textContent = "Select the address above"; }
  setTimeout(() => { b.textContent = "Copy address"; }, 2200);
});

/* arriving at index.html#contact from another page */
if (location.hash && PAGE === "home"){
  const t = document.getElementById(location.hash.slice(1));
  if (t) setTimeout(() => t.scrollIntoView({ behavior: "auto" }), 60);
}
})();
