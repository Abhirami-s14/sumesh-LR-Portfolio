/* ============================================================================
   Selected Work — two framed panels.
   Left: the active category (title, kicker, stats, feature image).
   Right: an overlapping collage, one frame per category. Hover (or tap) a
   frame to bring it forward and show it on the left; click to open the page.
   Cycles on its own while untouched. Content: window.SITE.categories.
   ========================================================================== */
(function(){
"use strict";

const pad = n => String(n).padStart(2, "0");
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* same stand-in tints as the category pages */
const TINT = {
  exterior:     ["#2C3B4B", "#121A23", "Ex"],
  interior:     ["#4A3B2C", "#1C150F", "In"],
  walkthroughs: ["#33304A", "#141220", "AI"],
  panoramas:    ["#23403C", "#0E1C1A", "360"]
};

/* collage slots, % of the right panel: x, y, w, h, z */
const SLOTS = [
  [26, 8,  31, 33, 1],
  [51, 16, 34, 40, 2],
  [16, 40, 38, 42, 3],
  [44, 56, 30, 37, 2]
];
const AUTO_MS = 5200;

function stats(c){
  if (c.type === "projects"){
    const r = c.projects.reduce((a, p) => a + p.images.length, 0);
    return pad(c.projects.length) + " Collections · " + pad(r) + (c.pano ? " Panoramas" : " Renders");
  }
  if (c.type === "videos") return pad(c.items.length) + " Films";
  return pad(c.items.length) + " Panoramas";
}

function media(c, big){
  const s = c.slide || {};
  if (s.src){
    return '<img src="' + esc(s.src) + '" alt="' + (big ? esc(s.alt || c.title) : "") + '" loading="lazy" decoding="async" draggable="false"' +
      ' style="object-position:' + esc(s.focus || "50% 50%") + '">';
  }
  const t = TINT[c.key] || ["#2A3038", "#11151A", c.title.slice(0, 2)];
  return '<span class="gw__ph" style="--t1:' + t[0] + ';--t2:' + t[1] + '"><b>' + esc(t[2]) + '</b>' +
    (big ? '<i>Add cover image · data.js</i>' : "") + '</span>';
}

window.initWork = function initWork(){
  const mount = document.getElementById("wkMount");
  const CATS = ((window.SITE && window.SITE.categories) || []).slice(0, SLOTS.length);
  if (!mount || !CATS.length) return;

  const left =
    '<div class="gw__panel gw__lead">' +
      '<div class="gw__top">' +
        '<span class="label">Selected Work · <span class="gw__n">01</span> / ' + pad(CATS.length) + '</span>' +
        CATS.map((c, i) =>
          '<div class="gw__head' + (i === 0 ? " is-on" : "") + '" data-i="' + i + '"' + (i ? ' aria-hidden="true"' : "") + '>' +
            '<h2 class="gw__t">' + esc(c.title) + '</h2>' +
            '<div class="gw__k">' + esc(c.kicker) + '</div>' +
            '<div class="gw__meta">' +
              '<span class="label">' + esc(stats(c)) + '</span>' +
              '<a class="gw__go" href="' + esc(c.page) + '"' + (i ? ' tabindex="-1"' : "") + '>Enter ' + esc(c.title) + ' <span class="arr" aria-hidden="true">→</span></a>' +
            '</div>' +
          '</div>').join("") +
      '</div>' +
      '<a class="gw__feat" href="' + esc(CATS[0].page) + '" aria-label="Open ' + esc(CATS[0].title) + '">' +
        CATS.map((c, i) => '<span class="gw__fi' + (i === 0 ? " is-on" : "") + '" data-i="' + i + '">' + media(c, true) + '</span>').join("") +
      '</a>' +
    '</div>';

  const right =
    '<div class="gw__panel gw__col">' +
      CATS.map((c, i) => {
        const s = SLOTS[i];
        return '<a class="gw__tile' + (i === 0 ? " is-on" : "") + '" href="' + esc(c.page) + '" data-i="' + i + '"' +
          ' style="left:' + s[0] + '%;top:' + s[1] + '%;width:' + s[2] + '%;height:' + s[3] + '%;--z:' + s[4] + ';--d:' + (i * -1.6) + 's"' +
          ' aria-label="' + esc(pad(i + 1) + " " + c.title + " — " + stats(c)) + '">' +
          '<span class="gw__float"><span class="gw__img">' + media(c, false) + '</span>' +
          '<span class="gw__cap"><em>' + pad(i + 1) + '</em>' + esc(c.title) + '</span></span></a>';
      }).join("") +
    '</div>';

  mount.innerHTML = '<div class="gw wrap">' + left + right + '</div>';

  const root = mount.querySelector(".gw");
  const heads = Array.from(root.querySelectorAll(".gw__head"));
  const feats = Array.from(root.querySelectorAll(".gw__fi"));
  const tiles = Array.from(root.querySelectorAll(".gw__tile"));
  const featA = root.querySelector(".gw__feat");
  const num = root.querySelector(".gw__n");
  let cur = 0, timer = 0, held = false, visible = false;

  function set(i){
    if (i === cur) return;
    cur = i;
    heads.forEach((h, k) => {
      const on = k === i;
      h.classList.toggle("is-on", on);
      if (on) h.removeAttribute("aria-hidden"); else h.setAttribute("aria-hidden", "true");
      h.querySelector(".gw__go").tabIndex = on ? 0 : -1;
    });
    feats.forEach((f, k) => f.classList.toggle("is-on", k === i));
    tiles.forEach((t, k) => t.classList.toggle("is-on", k === i));
    featA.href = CATS[i].page;
    featA.setAttribute("aria-label", "Open " + CATS[i].title);
    num.textContent = pad(i + 1);
  }

  /* autoplay while nobody is interacting and the section is on screen */
  function schedule(){
    clearTimeout(timer);
    if (reduced || held || !visible) return;
    timer = setTimeout(() => { set((cur + 1) % CATS.length); schedule(); }, AUTO_MS);
  }
  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting;
    if (visible) root.classList.add("is-in");
    schedule();
  }), { threshold: 0.25 }).observe(root);
  root.addEventListener("pointerenter", e => { if (e.pointerType === "mouse"){ held = true; schedule(); } });
  root.addEventListener("pointerleave", () => { held = false; schedule(); });
  root.addEventListener("focusin", () => { held = true; schedule(); });
  root.addEventListener("focusout", () => { held = false; schedule(); });

  tiles.forEach((t, i) => {
    t.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") set(i); });
    t.addEventListener("focus", () => set(i));
    /* touch: first tap selects, second tap opens */
    let touchSel = false;
    t.addEventListener("pointerdown", e => { touchSel = e.pointerType !== "mouse" && cur !== i; });
    t.addEventListener("click", e => {
      if (touchSel){ e.preventDefault(); set(i); touchSel = false; schedule(); }
    });
  });
};
})();
