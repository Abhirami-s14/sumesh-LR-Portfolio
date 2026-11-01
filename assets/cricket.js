/* Backyard Cricket — the footer easter egg, carried over from the original template.
   Injects its own overlay and exposes window.openCricket(). */
(function(){
"use strict";
document.body.insertAdjacentHTML("beforeend",
  '<div class="cg" id="cg" hidden role="dialog" aria-modal="true" aria-label="Cricket">' +
    '<div class="cg__bar"><div><div class="label">Off-screen</div>' +
      '<div class="serif" style="font-size:clamp(20px,2.4vw,30px);line-height:1.15">Backyard Cricket</div></div>' +
      '<button class="lb__x" id="cgClose" style="color:var(--ink)" aria-label="Close cricket">Close ✕</button></div>' +
    '<div class="cg__stage"><canvas class="cg__canvas" id="cgCanvas" width="1600" height="720" aria-label="Cricket game"></canvas></div>' +
    '<div class="cg__foot"><div><div class="label">Score</div><div class="cg__score" id="cgScore">0/0</div></div>' +
      '<div style="text-align:center"><div class="label">Overs</div><div class="cg__score" id="cgOvers">0.0</div></div>' +
      '<button class="cg__btn" id="cgAction">Bowl</button></div>' +
  '</div>');
const cg = document.getElementById("cg"),
      cgCanvas = document.getElementById("cgCanvas"),
      cgScore = document.getElementById("cgScore"),
      cgOvers = document.getElementById("cgOvers"),
      cgAction = document.getElementById("cgAction");
const cx2 = cgCanvas.getContext("2d");

const W = 800, H = 360, GROUND = 274, IMPACT = 158, STUMPS = 96;
let cgRaf = 0, cgPrevFocus = null;
const G = {
  mode: "ready",      // ready | bowling | result | over
  score: 0, wkts: 0, balls: 0,
  msg: "Press BOWL to start", sub: "Space, tap or click to play your shot",
  ball: { x: 760, y: 236, vx: 0, vy: 0, live: false, flying: false },
  bat: { t: 0, swinging: false, used: false },
  flash: 0, flashText: "", flashRuns: -1, waitUntil: 0
};

function cgReset(){
  G.mode = "ready"; G.score = 0; G.wkts = 0; G.balls = 0;
  G.msg = "Press BOWL to start"; G.sub = "Space, tap or click to play your shot";
  G.ball.live = false; G.ball.flying = false; G.ball.x = 760; G.ball.y = 236;
  G.bat.swinging = false; G.bat.used = false; G.flash = 0; G.flashRuns = -1;
  cgAction.textContent = "Bowl";
  syncScore();
}
function syncScore(){
  cgScore.textContent = G.score + "/" + G.wkts;
  cgOvers.textContent = Math.floor(G.balls / 6) + "." + (G.balls % 6);
}

function bowl(){
  if (G.mode === "over") { cgReset(); return; }
  if (G.mode === "bowling") return;
  G.mode = "bowling";
  G.ball.live = true; G.ball.flying = false;
  G.ball.x = 752; G.ball.y = 232 + Math.random() * 14;
  G.ball.vx = -(4.4 + Math.random() * 3.2);
  G.ball.vy = 0;
  G.bat.used = false; G.bat.swinging = false; G.bat.t = 0;
  G.msg = ""; G.sub = "";
  G.flash = 0;
  cgAction.textContent = "Bat";
}

function swing(){
  if (G.mode === "ready" || G.mode === "over"){ bowl(); return; }
  if (G.mode !== "bowling" || G.bat.used) return;
  G.bat.used = true; G.bat.swinging = true; G.bat.t = 0;

  const d = Math.abs(G.ball.x - IMPACT);
  let runs = -1, text = "";
  if (d <= 11){ runs = 6; text = "SIX"; }
  else if (d <= 22){ runs = 4; text = "FOUR"; }
  else if (d <= 34){ runs = 2; text = "TWO"; }
  else if (d <= 48){ runs = 1; text = "SINGLE"; }
  else if (d <= 74){ runs = 0; text = "PLAYED AND MISSED"; }
  else { runs = -1; text = "BOWLED"; }

  if (runs >= 1){
    G.score += runs;
    G.ball.flying = true;
    const up = runs === 6 ? 9.5 : runs === 4 ? 5.5 : 3.4;
    G.ball.vx = -(5 + runs * 0.9);
    G.ball.vy = -up;
  } else if (runs === -1){
    G.wkts += 1;
  }
  G.flashText = text; G.flashRuns = runs; G.flash = 1;
  endBall(runs === -1 ? 1100 : 850);
}

function endBall(ms){
  G.balls += 1;
  syncScore();
  G.waitUntil = performance.now() + ms;
  G.mode = "result";
  if (G.wkts >= 3){
    G.mode = "over";
    G.msg = "All out — " + G.score + " runs";
    G.sub = "Press PLAY AGAIN for a new innings";
    cgAction.textContent = "Play again";
  }
}

function cgStep(now){
  const b = G.ball;
  if (G.mode === "bowling" && b.live){
    b.x += b.vx;
    if (b.x <= STUMPS){
      b.live = false;
      G.wkts += 1;
      G.flashText = "BOWLED"; G.flashRuns = -1; G.flash = 1;
      endBall(1100);
    }
  }
  if (b.flying){
    b.x += b.vx; b.y += b.vy; b.vy += 0.34;
    if (b.y > GROUND - 6){ b.y = GROUND - 6; b.vy *= -0.45; b.vx *= 0.8; }
  }
  if (G.bat.swinging){
    G.bat.t += 0.085;
    if (G.bat.t >= 1){ G.bat.t = 1; G.bat.swinging = false; }
  }
  if (G.flash > 0) G.flash = Math.max(0, G.flash - 0.012);

  if (G.mode === "result" && now >= G.waitUntil){
    G.mode = "ready";
    b.live = false; b.flying = false; b.x = 752; b.y = 236;
    G.msg = ""; G.sub = "Press BOWL for the next delivery";
    cgAction.textContent = "Bowl";
  }

  cgDraw();
  cgRaf = requestAnimationFrame(cgStep);
}

function cgDraw(){
  const c = cx2;
  c.setTransform(2, 0, 0, 2, 0, 0);
  c.clearRect(0, 0, W, H);
  c.fillStyle = "#12161C"; c.fillRect(0, 0, W, H);

  /* ground + pitch as hairline elevation */
  c.strokeStyle = "#242A33"; c.lineWidth = 1;
  for (let i = 1; i <= 4; i++){
    c.beginPath(); c.moveTo(0, GROUND + i * 14); c.lineTo(W, GROUND + i * 14 - i * 6); c.stroke();
  }
  c.strokeStyle = "#DCE2E8"; c.lineWidth = 1.2;
  c.beginPath(); c.moveTo(0, GROUND); c.lineTo(W, GROUND); c.stroke();

  /* crease marks */
  c.strokeStyle = "#8A96A1";
  [IMPACT - 34, STUMPS - 26, 620].forEach(x => {
    c.beginPath(); c.moveTo(x, GROUND); c.lineTo(x, GROUND + 9); c.stroke();
  });

  /* stumps */
  c.strokeStyle = "#DCE2E8"; c.lineWidth = 2.4;
  for (let i = 0; i < 3; i++){
    c.beginPath(); c.moveTo(STUMPS + i * 7, GROUND); c.lineTo(STUMPS + i * 7, GROUND - 52); c.stroke();
  }
  c.lineWidth = 1.6;
  c.beginPath(); c.moveTo(STUMPS - 3, GROUND - 54); c.lineTo(STUMPS + 17, GROUND - 54); c.stroke();

  /* batter — an abstract figure, bat swings on its shoulder */
  const bx = IMPACT + 14;
  c.strokeStyle = "#DCE2E8"; c.lineWidth = 2.2; c.lineCap = "round";
  c.beginPath(); c.moveTo(bx, GROUND); c.lineTo(bx, GROUND - 62); c.stroke();
  c.beginPath(); c.arc(bx, GROUND - 74, 11, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.moveTo(bx, GROUND - 18); c.lineTo(bx + 16, GROUND); c.stroke();

  const ease = G.bat.t < 1 ? 1 - Math.pow(1 - G.bat.t, 3) : 1;
  const ang = G.bat.used ? (-2.25 + ease * 2.5) : -2.25;
  const sx = bx - 4, sy = GROUND - 56;
  c.lineWidth = 2.8;
  c.beginPath(); c.moveTo(sx, sy);
  c.lineTo(sx + Math.cos(ang) * 58, sy + Math.sin(ang) * 58);
  c.stroke();

  /* bowler */
  c.lineWidth = 1.8; c.strokeStyle = "#8A96A1";
  c.beginPath(); c.moveTo(752, GROUND); c.lineTo(752, GROUND - 52); c.stroke();
  c.beginPath(); c.arc(752, GROUND - 62, 9, 0, Math.PI * 2); c.stroke();
  c.beginPath(); c.moveTo(752, GROUND - 42); c.lineTo(736, GROUND - 54); c.stroke();

  /* timing window — the zone where the shot connects */
  if (G.mode === "bowling"){
    c.fillStyle = "rgba(200,155,106,.11)";
    c.fillRect(IMPACT - 22, GROUND - 96, 44, 96);
    c.strokeStyle = "rgba(200,155,106,.55)"; c.lineWidth = 1;
    c.beginPath(); c.moveTo(IMPACT, GROUND - 100); c.lineTo(IMPACT, GROUND); c.stroke();
  }

  /* ball */
  const b = G.ball;
  if (b.live || b.flying){
    c.fillStyle = "#DCE2E8";
    c.beginPath(); c.arc(b.x, b.y, 7, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#12161C"; c.lineWidth = 1;
    c.beginPath(); c.arc(b.x, b.y, 4, -0.7, 1.4); c.stroke();
  }

  /* result flash */
  if (G.flash > 0){
    c.globalAlpha = Math.min(1, G.flash * 1.6);
    c.fillStyle = G.flashRuns === -1 ? "#D4705F" : G.flashRuns === 0 ? "#8A96A1"
      : G.flashRuns >= 4 ? "#C89B6A" : "#DCE2E8";
    c.font = '500 ' + (G.flashRuns >= 4 ? 58 : 38) + 'px "Bodoni Moda", Georgia, serif';
    c.textAlign = "center";
    c.fillText(G.flashText, W / 2, 86);
    c.globalAlpha = 1;
  }

  /* captions */
  c.fillStyle = "#8A96A1";
  c.font = '600 11px Archivo, system-ui, sans-serif';
  c.textAlign = "left";
  c.fillText("BACKYARD CRICKET / 3 WICKETS", 22, 30);
  c.textAlign = "right";
  c.fillText("WICKETS " + G.wkts + " OF 3", W - 22, 30);

  if (G.msg){
    c.fillStyle = "#DCE2E8";
    c.font = '500 30px "Bodoni Moda", Georgia, serif';
    c.textAlign = "center";
    c.fillText(G.msg, W / 2, 128);
  }
  if (G.sub){
    c.fillStyle = "#8A96A1";
    c.font = '600 11px Archivo, system-ui, sans-serif';
    c.textAlign = "center";
    c.fillText(G.sub.toUpperCase(), W / 2, 154);
  }
}

function openCricket(){
  cgPrevFocus = document.activeElement;
  cg.hidden = false;
  document.body.style.overflow = "hidden";
  cgReset();
  cancelAnimationFrame(cgRaf);
  cgRaf = requestAnimationFrame(cgStep);
  cgAction.focus();
}
function closeCricket(){
  cancelAnimationFrame(cgRaf); cgRaf = 0;
  cg.hidden = true; document.body.style.overflow = "";
  if (cgPrevFocus && cgPrevFocus.focus) cgPrevFocus.focus();
}
document.getElementById("cgClose").addEventListener("click", closeCricket);
cgAction.addEventListener("click", () => { G.mode === "bowling" ? swing() : bowl(); });
cgCanvas.addEventListener("pointerdown", e => { e.preventDefault(); G.mode === "bowling" ? swing() : bowl(); });
window.openCricket = openCricket;
document.addEventListener("keydown", e => {
  if (cg.hidden) return;
  if (e.key === "Escape") closeCricket();
  else if (e.key === " " || e.key === "Enter"){
    if (e.target === cgAction && e.key === "Enter") return;
    e.preventDefault();
    G.mode === "bowling" ? swing() : bowl();
  }
});
})();
