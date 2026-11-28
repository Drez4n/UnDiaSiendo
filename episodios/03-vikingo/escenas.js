// ===== Episodio 03 — Un día siendo vikingo (año 900) =====
RELOJ.casa = '06:00 · La casa larga';
RELOJ.granja = '08:00 · La granja';
RELOJ.comida = '12:00 · La comida';
RELOJ.telar = '15:00 · El telar';
RELOJ.barco = 'Verano · El barco';
RELOJ.noche = '21:00 · Junto al fuego';
RELOJ.partida = 'Al amanecer · La partida';
TRANSICION.final = 0.8;

const VIK = { piel: '#e2b48e', pelo: '#c8954a', tunica: '#4a6a8a', sombra: '#2c4258', piernas: '#6b5a44', cinto: '#3a2716' };
const VIK2 = { piel: '#d9a882', pelo: '#8a4a22', tunica: '#6a7a3a', sombra: '#3e4a20', piernas: '#5a4a3a', cinto: '#3a2716' };
const VIK3 = { piel: '#e8bf9a', pelo: '#e0c070', tunica: '#8a3a2a', sombra: '#561e14', piernas: '#4a3e30', cinto: '#2a1c10' };
const MUJER = { piel: '#ecc4a0', pelo: '#d8b060', tunica: '#9a7a4a', sombra: '#5e4a2a', manto: '#e8dcc0', cinto: '#7a2a1a' };

// ---------- piezas de este episodio ----------
function montes(g, y0, alto, colA, colB, seed, nieve) {
  const R = rnd(seed); g.fillStyle = grad(g, 0, y0 - alto, 0, y0, [[0, colA], [1, colB]]);
  g.beginPath(); g.moveTo(0, y0); let x = 0; const pts = [];
  while (x <= W) { const y = y0 - alto * (0.45 + 0.55 * R()); pts.push([x, y]); g.lineTo(x, y); x += 80 + R() * 120; }
  g.lineTo(W, y0); g.closePath(); g.fill();
  if (nieve) { g.fillStyle = nieve; pts.forEach(([px, py], i) => { if (py < y0 - alto * 0.75) { g.beginPath(); g.moveTo(px - 40, py + 40); g.lineTo(px, py); g.lineTo(px + 40, py + 40); g.closePath(); g.fill(); } }); }
}
function laderas(g, y0, colIzq, colDer) { // paredes del fiordo
  g.fillStyle = colIzq; g.beginPath(); g.moveTo(0, 300); g.quadraticCurveTo(260, 420, 430, y0); g.lineTo(0, y0); g.fill();
  g.fillStyle = colDer; g.beginPath(); g.moveTo(W, 360); g.quadraticCurveTo(820, 460, 650, y0); g.lineTo(W, y0); g.fill();
}
function casaLarga(g, x, y, w, h, humoT) {
  g.fillStyle = '#5a3a22'; g.fillRect(x, y - h * 0.45, w, h * 0.45);
  for (let i = 0; i < w; i += 14) { g.fillStyle = i % 28 ? '#4e321c' : '#644226'; g.fillRect(x + i, y - h * 0.45, 12, h * 0.45); }
  g.fillStyle = grad(g, 0, y - h, 0, y - h * 0.4, [[0, '#6a8a3a'], [1, '#3e5a22']]); // tejado de turba
  g.beginPath(); g.moveTo(x - 20, y - h * 0.42); g.quadraticCurveTo(x + w / 2, y - h * 1.15, x + w + 20, y - h * 0.42); g.closePath(); g.fill();
  g.fillStyle = '#2a1a10'; g.fillRect(x + w * 0.45, y - h * 0.32, w * 0.1, h * 0.32);
}
function vaca(ctx, x, y, s, f, t, color = '#7a4a2a') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
  const p = Math.sin(t * 2) * 4;
  ctx.fillStyle = color; [[-60, 1], [-35, -1], [45, 1], [70, -1]].forEach(([px, d]) => ctx.fillRect(px, -70, 14, 70 + d * p * 0.2));
  elipse(ctx, 0, -95, 95, 45); ctx.fill();
  ctx.fillStyle = '#f0e6d6'; elipse(ctx, -20, -100, 30, 22); ctx.fill();
  ctx.fillStyle = color; elipse(ctx, 105, -110 + p * 0.5, 34, 26, 0.4); ctx.fill();
  ctx.fillStyle = '#e8c0a0'; elipse(ctx, 128, -96 + p * 0.5, 16, 12); ctx.fill();
  ctx.fillStyle = '#e8e0cc'; ctx.beginPath(); ctx.moveTo(92, -132); ctx.lineTo(84, -152); ctx.lineTo(100, -136); ctx.fill();
  ctx.restore();
}
function oveja(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#2a221c'; [-30, -12, 18, 34].forEach(px => ctx.fillRect(px, -40, 8, 40));
  ctx.fillStyle = '#ece6d8'; for (let i = 0; i < 7; i++) { elipse(ctx, -40 + i * 13, -58 + Math.sin(i * 2) * 6, 22, 20); ctx.fill(); }
  ctx.fillStyle = '#2a221c'; elipse(ctx, 58, -66 + Math.sin(t * 3) * 3, 16, 12); ctx.fill();
  ctx.restore();
}
function cascoVikingo(ctx, x, y, s, cuernos = false) { // casco de casquete con «gafas» (tipo Gjermundbu)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (cuernos) { ctx.fillStyle = '#efe4c8'; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(d * 80, -60); ctx.quadraticCurveTo(d * 190, -110, d * 170, -230); ctx.quadraticCurveTo(d * 150, -120, d * 70, -100); ctx.closePath(); ctx.fill(); }); }
  ctx.fillStyle = grad(ctx, -100, -150, 100, 40, [[0, '#d8dcdf'], [0.5, '#8a9196'], [1, '#4a5054']]);
  ctx.beginPath(); ctx.arc(0, 0, 100, Math.PI, 0); ctx.lineTo(100, 20); ctx.lineTo(-100, 20); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3a3e42'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, -100); ctx.lineTo(0, 20); ctx.moveTo(-100, -10); ctx.lineTo(100, -10); ctx.stroke();
  if (!cuernos) { // protector de ojos y nariz
    ctx.fillStyle = '#5a6064'; ctx.beginPath(); ctx.moveTo(-80, 15); ctx.quadraticCurveTo(-40, 0, -8, 15); ctx.lineTo(-8, 90); ctx.lineTo(8, 90); ctx.lineTo(8, 15); ctx.quadraticCurveTo(40, 0, 80, 15); ctx.lineTo(70, 60); ctx.quadraticCurveTo(40, 40, 18, 60); ctx.lineTo(-18, 60); ctx.quadraticCurveTo(-40, 40, -70, 60); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#141414'; elipse(ctx, -42, 34, 20, 14); ctx.fill(); elipse(ctx, 42, 34, 20, 14); ctx.fill();
  }
  ctx.restore();
}
function barcoLargo(ctx, x, y, s, t, o = {}) { // vista lateral, proa a la derecha
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 1.3 + (o.fase || 0)) * 0.02);
  const vela = o.vela !== false;
  if (vela) { // mástil y vela a rayas
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-8, -560, 16, 520);
    ctx.save(); ctx.beginPath(); const inf = 30 + Math.sin(t * 2) * 6;
    ctx.moveTo(-230, -520); ctx.lineTo(230, -520); ctx.quadraticCurveTo(230 + inf, -320, 210, -130); ctx.lineTo(-210, -130); ctx.quadraticCurveTo(-230 + inf, -320, -230, -520); ctx.closePath(); ctx.clip();
    for (let i = -4; i < 4; i++) { ctx.fillStyle = i % 2 ? '#b82a1e' : '#efe4cc'; ctx.fillRect(i * 58, -540, 58, 430); }
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-240, -540, 240, 430); ctx.restore();
    ctx.strokeStyle = '#3a2a1a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -560); ctx.lineTo(-420, -10); ctx.moveTo(0, -560); ctx.lineTo(420, -10); ctx.stroke();
  }
  // remos
  if (o.remos) { const r = Math.sin(t * 3) * 0.35; for (let i = 0; i < 8; i++) { ctx.save(); ctx.translate(-300 + i * 80, -20); ctx.rotate(0.55 + r); ctx.fillStyle = '#7a5a34'; ctx.fillRect(-4, 0, 8, 190); ctx.fillRect(-12, 160, 24, 50); ctx.restore(); } }
  // casco en tingladillo (tablas solapadas)
  const casco = () => { ctx.beginPath(); ctx.moveTo(-470, -150); ctx.quadraticCurveTo(-430, 40, 0, 50); ctx.quadraticCurveTo(430, 40, 470, -150); ctx.lineTo(440, -40); ctx.quadraticCurveTo(0, -10, -440, -40); ctx.closePath(); };
  ctx.fillStyle = grad(ctx, 0, -60, 0, 50, [[0, '#8a5a30'], [1, '#4a2e16']]); casco(); ctx.fill();
  ctx.strokeStyle = 'rgba(30,15,5,0.6)'; ctx.lineWidth = 3;
  for (let k = 1; k < 5; k++) { ctx.beginPath(); ctx.moveTo(-460 + k * 6, -120 + k * 24); ctx.quadraticCurveTo(0, -20 + k * 16, 460 - k * 6, -120 + k * 24); ctx.stroke(); }
  // escudos en la borda
  const cols = ['#b82a1e', '#e0c060', '#2a4a7a', '#efe4cc', '#2a6a3a'];
  for (let i = 0; i < 9; i++) { const sx = -320 + i * 80; ctx.fillStyle = cols[i % 5]; elipse(ctx, sx, -48, 32, 32); ctx.fill(); ctx.fillStyle = '#8a9196'; elipse(ctx, sx, -48, 9, 9); ctx.fill(); }
  // proa con cabeza de dragón y popa en espiral
  ctx.strokeStyle = '#6a4424'; ctx.lineWidth = 26; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(440, -90); ctx.quadraticCurveTo(520, -200, 500, -300); ctx.stroke();
  ctx.fillStyle = '#6a4424'; elipse(ctx, 520, -320, 42, 26, -0.4); ctx.fill(); ctx.beginPath(); ctx.moveTo(500, -340); ctx.lineTo(470, -380); ctx.lineTo(515, -350); ctx.fill();
  ctx.fillStyle = '#f0c040'; elipse(ctx, 528, -330, 6, 5); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-440, -90); ctx.quadraticCurveTo(-520, -200, -480, -280); ctx.stroke();
  ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(-450, -280, 30, Math.PI, Math.PI * 2.6); ctx.stroke();
  if (o.tripulacion) for (let i = 0; i < 6; i++) { ctx.fillStyle = '#2a2420'; elipse(ctx, -280 + i * 100, -95, 18, 20); ctx.fill(); }
  ctx.restore();
}
function agua(ctx, y0, t, col1, col2, brilloCol) {
  ctx.fillStyle = grad(ctx, 0, y0, 0, H, [[0, col1], [1, col2]]); ctx.fillRect(0, y0, W, H - y0);
  ctx.strokeStyle = brilloCol; ctx.lineWidth = 3;
  for (let i = 0; i < 26; i++) { const y = y0 + 10 + i * i * 1.6, a = 6 + i * 0.6; ctx.globalAlpha = 0.5 - i * 0.012;
    ctx.beginPath(); for (let x = -20; x <= W + 20; x += 30) ctx.lineTo(x, y + Math.sin(x / (60 + i * 4) + t * 1.5 + i) * a); ctx.stroke(); }
  ctx.globalAlpha = 1;
}

// ===================================================================
// 1. TÍTULO — fiordo al amanecer
// ===================================================================
ESCENAS.titulo = {
  init() {
    this.fondo = cacheado('v_titulo', W, H, (g) => {
      cielo(g, [[0, '#13244a'], [0.35, '#4a5a8a'], [0.52, '#e8a07a'], [0.6, '#f6cf98'], [1, '#f6cf98']]);
      montes(g, 1080, 380, '#5a6a8a', '#3a4a66', 5, '#e8eef6');
      laderas(g, 1150, '#1e2a26', '#24302a');
      casaLarga(g, 90, 1150, 300, 160);
    });
  },
  dibujar(ctx, u, dur, t) {
    ctx.save(); camara(ctx, 1 + u * 0.02, W / 2, 1100);
    ctx.drawImage(this.fondo, 0, 0);
    humo(ctx, 240, 1010, t, 8, 'rgba(230,220,220,A)', 0.7, 50);
    agua(ctx, 1150, t, '#3a4a6a', '#141c2a', 'rgba(255,210,170,0.6)');
    barcoLargo(ctx, 700, 1250, 0.55, t, { vela: true });
    ctx.restore();
    ctx.fillStyle = grad(ctx, 0, 1320, 0, H, [[0, 'rgba(10,14,22,0)'], [0.35, '#0a0e16'], [1, '#05070b']]); ctx.fillRect(0, 1300, W, H);
    const a = smooth(rango(u, 0.3, 1.3)) * (1 - smooth(rango(u, dur - 0.9, dur - 0.2)));
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 30;
    ctx.font = '700 52px Cinzel'; ctx.fillStyle = '#eef2f6'; ctx.letterSpacing = '14px'; ctx.fillText('UN DÍA SIENDO', W / 2 + 7, 400 - (1 - a) * 20);
    ctx.font = '900 140px Cinzel'; ctx.letterSpacing = '6px'; ctx.fillStyle = grad(ctx, 0, 430, 0, 570, [[0, '#ffffff'], [0.5, '#c8d8ea'], [1, '#7a92ae']]); ctx.fillText('VIKINGO', W / 2 + 3, 555);
    ctx.font = '700 60px Cinzel'; ctx.letterSpacing = '10px'; ctx.fillStyle = '#f2e4c8'; ctx.fillText('EN NORUEGA', W / 2 + 5, 650);
    ctx.font = '700 40px Cinzel'; ctx.letterSpacing = '8px'; ctx.fillStyle = '#ffd59a'; ctx.fillText('— AÑO 900 —', W / 2 + 4, 735);
    ctx.restore();
  }
};

// ===================================================================
// 2. CASA LARGA — una sola sala con el fuego en el centro
// ===================================================================
ESCENAS.casa = {
  init() {
    this.fondo = cacheado('v_casa', W, H, (g) => {
      g.fillStyle = '#1a120c'; g.fillRect(0, 0, W, H);
      const vx = 540, vy = 820;
      // paredes de madera en perspectiva
      g.fillStyle = '#3a2616'; g.beginPath(); g.moveTo(0, 200); g.lineTo(vx - 120, vy - 60); g.lineTo(vx - 120, vy + 80); g.lineTo(0, 1650); g.fill();
      g.fillStyle = '#34220f'; g.beginPath(); g.moveTo(W, 200); g.lineTo(vx + 120, vy - 60); g.lineTo(vx + 120, vy + 80); g.lineTo(W, 1650); g.fill();
      g.fillStyle = '#2a1a0e'; g.fillRect(vx - 120, vy - 60, 240, 140);
      // vigas del tejado y postes
      for (let i = 0; i < 7; i++) { const k = i / 7, z = 1 / (0.15 + k); const xo = 470 * (1 - k * 0.85);
        g.strokeStyle = '#1e140a'; g.lineWidth = 30 * (1 - k * 0.8);
        g.beginPath(); g.moveTo(vx - xo, vy - 60 - 560 * (1 - k * 0.9)); g.lineTo(vx, vy - 140 - 500 * (1 - k * 0.9)); g.lineTo(vx + xo, vy - 60 - 560 * (1 - k * 0.9)); g.stroke();
        [-1, 1].forEach(d => { g.fillStyle = '#24170c'; g.fillRect(vx + d * xo * 0.72 - 12 * (1 - k * 0.8), vy - 400 * (1 - k * 0.9), 24 * (1 - k * 0.8), 900 * (1 - k * 0.85)); }); }
      // bancos a los lados
      g.fillStyle = '#4a3220'; g.beginPath(); g.moveTo(0, 1350); g.lineTo(vx - 160, vy + 90); g.lineTo(vx - 150, vy + 110); g.lineTo(0, 1480); g.fill();
      g.beginPath(); g.moveTo(W, 1350); g.lineTo(vx + 160, vy + 90); g.lineTo(vx + 150, vy + 110); g.lineTo(W, 1480); g.fill();
      // suelo de tierra
      g.fillStyle = grad(g, 0, vy + 80, 0, H, [[0, '#2e2014'], [1, '#140c06']]); g.beginPath(); g.moveTo(vx - 120, vy + 80); g.lineTo(vx + 120, vy + 80); g.lineTo(W, 1650); g.lineTo(W, H); g.lineTo(0, H); g.lineTo(0, 1650); g.fill();
      // hogar alargado de piedras
      g.fillStyle = '#5a5048'; g.beginPath(); g.moveTo(vx - 40, vy + 120); g.lineTo(vx + 40, vy + 120); g.lineTo(vx + 210, 1560); g.lineTo(vx - 210, 1560); g.fill();
      g.fillStyle = '#1a120a'; g.beginPath(); g.moveTo(vx - 25, vy + 130); g.lineTo(vx + 25, vy + 130); g.lineTo(vx + 170, 1530); g.lineTo(vx - 170, 1530); g.fill();
    });
  },
  dibujar(ctx, u, dur, t) {
    ctx.save(); camara(ctx, 1.1 - smooth(rango(u, 0, dur)) * 0.08, 540, 1100);
    ctx.drawImage(this.fondo, 0, 0);
    // fuego a lo largo del hogar
    for (let i = 8; i >= 0; i--) { const k = i / 9, x = 540 + (ruido1(i * 3) - 0.5) * 60 * (1 - k), y = 1500 - k * 600, s = Math.pow(1 - k, 1.6) * 1.3 + 0.12;
      const h = (60 + ruido1(t * 4 + i * 2) * 70) * s;
      ctx.fillStyle = grad(ctx, 0, y - h, 0, y, [[0, 'rgba(255,120,30,0)'], [0.4, 'rgba(255,150,40,0.9)'], [1, 'rgba(255,240,170,0.95)']]);
      ctx.beginPath(); ctx.moveTo(x - 90 * s, y); ctx.quadraticCurveTo(x - 50 * s + Math.sin(t * 6 + i) * 10 * s, y - h * 0.6, x + Math.sin(t * 5 + i) * 18 * s, y - h); ctx.quadraticCurveTo(x + 50 * s, y - h * 0.6, x + 90 * s, y); ctx.fill();
      brillo(ctx, x, y - h * 0.4, 300 * s, 'rgba(255,130,40,0.35)', 0.8); }
    // rayo de luz por el agujero del humo
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = grad(ctx, 0, 250, 0, 1300, [[0, 'rgba(200,220,255,0.25)'], [1, 'rgba(200,220,255,0)']]);
    ctx.beginPath(); ctx.moveTo(500, 250); ctx.lineTo(580, 250); ctx.lineTo(700, 1300); ctx.lineTo(420, 1300); ctx.fill(); ctx.restore();
    humo(ctx, 540, 1100, t, 12, 'rgba(160,150,150,A)', 1.4, 10);
    // familias en los bancos y nuestro vikingo que se levanta
    [[150, 1460, 0.75, VIK2, 1], [900, 1450, 0.72, MUJER, -1], [1000, 1500, 0.6, VIK3, -1]].forEach(([x, y, s, c, d], i) =>
      iluminado(ctx, (g) => figura(g, { x, y, s, dir: d, fase: null, col: c, bajo: c === MUJER ? 18 : 120, barba: c !== MUJER, bD: [0.9 + Math.sin(t + i) * 0.1, -0.8], bT: [0.4, 0.5] }), { osc: 0.35, rim: '#ffaa55', dx: d * 6, alphaRim: 0.8 }));
    const k = easeInOut(rango(u, 1.0, 3.5));
    iluminado(ctx, (g) => figura(g, { x: lerp(260, 330, k), y: lerp(1720, 1800, k), s: 1.25, dir: 1, fase: null, col: VIK,
      bD: [lerp(1.3, 2.6, k * (1 - rango(u, 4, 5))), lerp(0.5, 0.6, k)], bT: [lerp(0.9, 2.4, k * (1 - rango(u, 4, 5))), 0.6] }), { osc: 0.3, rim: '#ffb35c', dx: 7, alphaRim: 0.9 });
    ctx.restore();
  }
};

// ===================================================================
// 3. GRANJA — ordeñar, cuidar ovejas, sembrar cebada
// ===================================================================
ESCENAS.granja = {
  init() {
    this.fondo = cacheado('v_granja', W, H, (g) => {
      cielo(g, [[0, '#7aa8d8'], [0.45, '#cfe0ee'], [1, '#cfe0ee']]);
      for (let i = 0; i < 4; i++) { g.fillStyle = 'rgba(255,255,255,0.75)'; elipse(g, 200 + i * 260, 230 + (i % 2) * 70, 120, 34); g.fill(); elipse(g, 250 + i * 260, 210 + (i % 2) * 70, 80, 30); g.fill(); }
      montes(g, 900, 420, '#6a7e96', '#4a5e6e', 9, '#f0f4f8');
      g.fillStyle = '#5a7a8a'; g.fillRect(0, 880, W, 50); // fiordo al fondo
      montes(g, 1000, 160, '#3e5a2e', '#2e4a22', 3);
      g.fillStyle = grad(g, 0, 980, 0, H, [[0, '#6e9a3e'], [1, '#3e6222']]); g.fillRect(0, 980, W, H);
      casaLarga(g, 600, 1080, 380, 200);
      // campo de cebada a la izquierda
      g.fillStyle = '#4a3420'; g.beginPath(); g.moveTo(0, 1250); g.lineTo(520, 1180); g.lineTo(560, 1500); g.lineTo(0, 1620); g.fill();
      for (let i = 0; i < 9; i++) { g.strokeStyle = '#2e2012'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 1270 + i * 40); g.lineTo(530 + i * 3, 1195 + i * 34); g.stroke(); g.strokeStyle = 'rgba(120,170,70,0.7)'; g.lineWidth = 3; g.setLineDash([6, 10]); g.beginPath(); g.moveTo(0, 1262 + i * 40); g.lineTo(530 + i * 3, 1188 + i * 34); g.stroke(); g.setLineDash([]); }
      // cerca
      g.strokeStyle = '#6a4a2a'; g.lineWidth = 8; g.beginPath(); g.moveTo(560, 1190); g.lineTo(1080, 1230); g.moveTo(560, 1230); g.lineTo(1080, 1270); g.stroke();
      for (let i = 0; i < 7; i++) g.fillRect ? (g.fillStyle = '#5a3a1e', g.fillRect(560 + i * 85, 1170 + i * 6, 12, 90)) : 0;
    });
  },
  dibujar(ctx, u, dur, t) {
    ctx.save(); camara(ctx, 1.0 + u * 0.012, 540, 1200);
    ctx.drawImage(this.fondo, 0, 0);
    vaca(ctx, 760, 1400, 0.95, -1, t); vaca(ctx, 960, 1360, 0.7, 1, t + 1, '#3a2a20');
    oveja(ctx, 640, 1500, 1.0, t); oveja(ctx, 820, 1530, 0.85, t + 2); oveja(ctx, 1000, 1500, 0.9, t + 1);
    // el vikingo siembra a voleo mientras camina por el campo
    const x = 120 + u * 32, fase = u * 4.2, lanz = Math.max(0, Math.sin(fase));
    figura(ctx, { x, y: 1560, s: 1.15, dir: 1, fase, col: VIK, bD: [0.6 + lanz * 1.4, -0.3 - lanz * 0.4], bT: [0.9, 1.4] });
    particulas(ctx, 26, 4, t, (g, i, r) => { const k = (t * 1.6 + r()) % 1; g.fillStyle = `rgba(230,200,120,${1 - k})`; g.beginPath(); g.arc(x + 80 + k * 160 + r() * 40, 1250 + k * k * 280 + r() * 30, 4, 0, 7); g.fill(); });
    particulas(ctx, 4, 8, t, (g, i, r) => { const bx = ((r() * W + t * 40) % (W + 100)) - 50, by = 300 + r() * 250, a = Math.sin(t * 9 + i) * 9;
      g.strokeStyle = 'rgba(40,40,50,0.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(bx - 12, by - a); g.quadraticCurveTo(bx - 5, by - 4, bx, by); g.quadraticCurveTo(bx + 5, by - 4, bx + 12, by - a); g.stroke(); });
    ctx.restore();
  }
};

// ===================================================================
// 4. COMIDA — gachas, queso, arenque y bacalao seco
// ===================================================================
ESCENAS.comida = {
  init() {
    this.mesa = cacheado('v_mesa', W, H, (g) => {
      g.fillStyle = '#5a3e26'; g.fillRect(0, 0, W, H);
      const R = rnd(41);
      for (let i = 0; i < 12; i++) { const x = i * 95; g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(x, 0, 4, H);
        for (let j = 0; j < 20; j++) { g.strokeStyle = `rgba(${R() < .5 ? '35,20,10' : '130,95,60'},${0.15 + R() * 0.2})`; g.lineWidth = 1 + R() * 2; const xx = x + R() * 95; g.beginPath(); g.moveTo(xx, 0); for (let y = 0; y <= H; y += 80) g.lineTo(xx + Math.sin(y / 170 + j) * 4, y); g.stroke(); } }
      // cuenco de gachas de cebada
      g.fillStyle = 'rgba(0,0,0,0.35)'; elipse(g, 400, 760, 230, 230); g.fill();
      g.fillStyle = radial(g, 360, 700, 20, 250, [[0, '#8a6a46'], [1, '#4a3420']]); elipse(g, 385, 740, 225, 225); g.fill();
      g.fillStyle = radial(g, 360, 710, 10, 190, [[0, '#ecdcb0'], [1, '#c8aa72']]); elipse(g, 385, 740, 180, 180); g.fill();
      for (let i = 0; i < 300; i++) { const a = R() * 6.28, d = Math.sqrt(R()) * 170; g.fillStyle = `rgba(${200 + R() * 40},${175 + R() * 40},${110 + R() * 40},0.9)`; elipse(g, 385 + Math.cos(a) * d, 740 + Math.sin(a) * d, 6, 4, R() * 3); g.fill(); }
      // cuña de queso
      g.fillStyle = '#e8c86a'; g.beginPath(); g.moveTo(760, 620); g.lineTo(980, 700); g.lineTo(760, 860); g.closePath(); g.fill();
      g.fillStyle = '#c8a040'; g.beginPath(); g.moveTo(760, 620); g.lineTo(760, 860); g.lineTo(735, 840); g.lineTo(735, 610); g.fill();
      for (let i = 0; i < 6; i++) { g.fillStyle = '#c8a64a'; elipse(g, 800 + R() * 100, 690 + R() * 100, 8, 8); g.fill(); }
      // plato con arenques salados
      g.fillStyle = '#7a5a3a'; elipse(g, 330, 1270, 230, 140); g.fill(); g.fillStyle = '#9a7a52'; elipse(g, 330, 1260, 205, 120); g.fill();
      for (let k = 0; k < 3; k++) { g.save(); g.translate(330, 1200 + k * 60); g.fillStyle = grad(g, 0, -20, 0, 20, [[0, '#4a5a6a'], [0.5, '#c8d0d8'], [1, '#e8ecef']]);
        g.beginPath(); g.ellipse(0, 0, 130, 26, 0, 0, 7); g.fill(); g.beginPath(); g.moveTo(-125, 0); g.lineTo(-175, -26); g.lineTo(-175, 26); g.fill(); g.fillStyle = '#1a1a1a'; elipse(g, 105, -6, 5, 5); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 12; i++) g.fillRect(-100 + R() * 200, -20 + R() * 40, 3, 3); g.restore(); }
      // bacalao seco (estampado y plano)
      g.save(); g.translate(820, 1250); g.rotate(-0.35);
      g.fillStyle = grad(g, -60, 0, 60, 0, [[0, '#a89070'], [0.5, '#e0cfae'], [1, '#a08868']]);
      g.beginPath(); g.moveTo(0, -260); g.quadraticCurveTo(90, -120, 70, 120); g.lineTo(110, 230); g.lineTo(0, 170); g.lineTo(-110, 230); g.lineTo(-70, 120); g.quadraticCurveTo(-90, -120, 0, -260); g.fill();
      g.strokeStyle = 'rgba(90,70,50,0.5)'; g.lineWidth = 3; for (let i = 0; i < 8; i++) { g.beginPath(); g.moveTo(-50, -150 + i * 34); g.lineTo(50, -140 + i * 34); g.stroke(); }
      g.restore();
    });
  },
  dibujar(ctx, u, dur, t, e) {
    const l = TL.lineas.find(x => x.escena === 'comida');
    ctx.save(); camara(ctx, 1.0 + u * 0.012, 540, 960);
    ctx.drawImage(this.mesa, 0, 0);
    ctx.fillStyle = radial(ctx, 500, 700, 100, 1300, [[0, 'rgba(255,190,110,0.12)'], [1, 'rgba(0,0,0,0.55)']]); ctx.fillRect(0, 0, W, H);
    humo(ctx, 385, 640, t, 10, 'rgba(255,245,230,A)', 0.8, 10);
    const w = p => (l.palabras.find(x => x.p.toLowerCase().startsWith(p)) || l.palabras[0]).ini;
    const etiq = (txt, x, y, ini) => { const k = smooth(rango(t, ini - 0.1, ini + 0.25)) * (1 - smooth(rango(t, e.fin - 0.5, e.fin))); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha = k; ctx.font = '800 42px Montserrat'; ctx.textAlign = 'center'; const m = ctx.measureText(txt).width + 50;
      ctx.fillStyle = 'rgba(14,18,26,0.82)'; ctx.beginPath(); ctx.roundRect(x - m / 2, y - 40 - (1 - k) * 20, m, 62, 31); ctx.fill(); ctx.fillStyle = '#d8e8ff'; ctx.fillText(txt, x, y + 5 - (1 - k) * 20); ctx.restore(); };
    etiq('GACHAS DE CEBADA', 400, 480, w('gachas')); etiq('QUESO', 860, 560, w('queso'));
    etiq('ARENQUE SALADO', 330, 1090, w('arenque')); etiq('BACALAO SECO', 840, 960, w('bacalao'));
    ctx.restore();
  }
};

// ===================================================================
// 5. TELAR — hilar y tejer lana (también las velas)
// ===================================================================
ESCENAS.telar = {
  dibujar(ctx, u, dur, t, e) {
    const l = TL.lineas.find(x => x.escena === 'telar');
    ctx.fillStyle = '#20160e'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = radial(ctx, 760, 500, 50, 1100, [[0, '#6a4a30'], [1, '#1a120a']]); ctx.fillRect(0, 0, W, H);
    // luz de una ventana
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = 'rgba(200,220,255,0.12)'; ctx.beginPath(); ctx.moveTo(900, 200); ctx.lineTo(1080, 200); ctx.lineTo(700, 1700); ctx.lineTo(300, 1700); ctx.fill(); ctx.restore();
    ctx.save(); camara(ctx, 1.0 + u * 0.015, 600, 1000);
    // telar de pesas, inclinado contra la pared
    ctx.fillStyle = '#5a3a1e'; ctx.save(); ctx.translate(380, 1500); ctx.rotate(-0.12); ctx.fillRect(-15, -1050, 30, 1060); ctx.restore();
    ctx.save(); ctx.translate(880, 1500); ctx.rotate(-0.12); ctx.fillRect(-15, -1050, 30, 1060); ctx.restore();
    ctx.fillStyle = '#6a4424'; ctx.fillRect(250, 430, 700, 34);
    const tejido = 140 + smooth(rango(u, 0, dur)) * 360;
    // tela tejida (rayas) y urdimbre
    ctx.save(); ctx.translate(0, 0);
    for (let y = 0; y < tejido; y += 12) { ctx.fillStyle = Math.floor(y / 72) % 2 ? '#b82a1e' : '#e8dcc0'; ctx.fillRect(290 - y * 0.12, 464 + y, 620, 12); }
    ctx.fillStyle = 'rgba(0,0,0,0.1)'; for (let x = 0; x < 620; x += 8) ctx.fillRect(290 + x - tejido * 0.12, 464, 2, tejido);
    ctx.strokeStyle = 'rgba(230,220,200,0.55)'; ctx.lineWidth = 2;
    for (let i = 0; i < 40; i++) { const x0 = 300 + i * 15 - tejido * 0.12; ctx.beginPath(); ctx.moveTo(x0, 464 + tejido); ctx.lineTo(x0 - 90 + Math.sin(i) * 3, 1320); ctx.stroke(); }
    // pesas de telar
    for (let i = 0; i < 10; i++) { ctx.fillStyle = '#8a7a66'; elipse(ctx, 230 + i * 60 + Math.sin(t + i) * 2, 1350, 26, 30); ctx.fill(); ctx.fillStyle = '#4a3e30'; elipse(ctx, 230 + i * 60, 1340, 6, 6); ctx.fill(); }
    ctx.restore();
    // tejedora
    const golpe = Math.max(0, Math.sin(u * 3));
    figura(ctx, { x: 760, y: 1700, s: 1.35, dir: -1, fase: null, col: MUJER, bajo: 18, barba: false, bD: [2.0 + golpe * 0.3, -0.6], bT: [1.7, -0.2] });
    ctx.restore();
    // rótulos: ropa, mantas, velas
    const w = p => (l.palabras.find(x => x.p.toLowerCase().startsWith(p)) || l.palabras[0]).ini;
    [['ROPA', 'ropa', 300], ['MANTAS', 'mantas', 540], ['VELAS', 'velas', 780]].forEach(([txt, p, x]) => { const k = smooth(rango(t, w(p) - 0.1, w(p) + 0.25)); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha = k; ctx.font = '800 42px Montserrat'; ctx.textAlign = 'center'; const m = ctx.measureText(txt).width + 46;
      ctx.fillStyle = txt === 'VELAS' ? 'rgba(150,30,20,0.9)' : 'rgba(14,18,26,0.82)'; ctx.beginPath(); ctx.roundRect(x - m / 2, 1150 - (1 - k) * 20, m, 62, 31); ctx.fill();
      ctx.fillStyle = '#fff2dc'; ctx.fillText(txt, x, 1195 - (1 - k) * 20); ctx.restore(); });
  }
};

// ===================================================================
// 6. BARCO — en alta mar, más de 12 nudos
// ===================================================================
ESCENAS.barco = {
  dibujar(ctx, u, dur, t, e) {
    const l2 = TL.lineas.filter(x => x.escena === 'barco')[1];
    cielo(ctx, [[0, '#4a6e98'], [0.4, '#a8c4dc'], [0.55, '#dce8f0'], [1, '#dce8f0']]);
    for (let i = 0; i < 4; i++) { const x = ((i * 330 - t * 25) % (W + 400)) + W; ctx.fillStyle = 'rgba(255,255,255,0.7)'; elipse(ctx, (x % (W + 400)) - 200, 300 + (i % 2) * 90, 140, 36); ctx.fill(); }
    ctx.save(); camara(ctx, 1.0 + u * 0.02, 540, 1150, 0, Math.sin(t * 1.3) * 6);
    ctx.fillStyle = '#5a6e84'; ctx.beginPath(); ctx.moveTo(0, 1000); ctx.lineTo(260, 930); ctx.lineTo(520, 990); ctx.lineTo(W, 960); ctx.lineTo(W, 1010); ctx.lineTo(0, 1010); ctx.fill();
    agua(ctx, 1000, t * 2, '#2e5a7a', '#0e2234', 'rgba(220,240,255,0.55)');
    barcoLargo(ctx, 520, 1290 + Math.sin(t * 1.3) * 10, 0.9, t, { vela: true, tripulacion: true });
    // estela y salpicaduras en la proa
    particulas(ctx, 50, 7, t, (g, i, r) => { const k = (t * 1.2 + r()) % 1; g.fillStyle = `rgba(240,250,255,${0.8 * (1 - k)})`; g.beginPath(); g.arc(960 + r() * 60 - k * 80, 1290 - k * 120 + k * k * 160, 3 + r() * 5, 0, 7); g.fill(); });
    ctx.strokeStyle = 'rgba(240,250,255,0.6)'; ctx.lineWidth = 6; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(110 - i * 70, 1330 + i * 14); ctx.lineTo(-300, 1360 + i * 40); ctx.stroke(); }
    ctx.restore();
    // infografía de velocidad
    const k = smooth(rango(t, l2.ini + 1.2, l2.ini + 1.7)) * (1 - smooth(rango(t, e.fin - 0.4, e.fin)));
    if (k > 0) { const n = Math.round(12 * easeOut(rango(t, l2.ini + 1.2, l2.ini + 2.6)));
      ctx.save(); ctx.globalAlpha = k; ctx.translate(W / 2, 470); ctx.fillStyle = 'rgba(10,18,28,0.82)'; ctx.beginPath(); ctx.roundRect(-300, -140, 600, 270, 40); ctx.fill();
      ctx.strokeStyle = '#a8c8e8'; ctx.lineWidth = 4; ctx.stroke(); ctx.textAlign = 'center';
      ctx.font = '900 140px Cinzel'; ctx.fillStyle = '#e8f2ff'; ctx.fillText('+' + n, 0, 30);
      ctx.font = '800 44px Montserrat'; ctx.fillStyle = '#ffd88a'; ctx.fillText('NUDOS  (≈ 22 km/h)', 0, 100); ctx.restore(); }
  }
};

// ===================================================================
// 7. MITO — nada de cuernos
// ===================================================================
ESCENAS.mito = {
  dibujar(ctx, u, dur, t, e) {
    const ls = TL.lineas.filter(x => x.escena === 'mito');
    ctx.fillStyle = radial(ctx, W / 2, 900, 100, 1300, [[0, '#24324a'], [1, '#080c14']]); ctx.fillRect(0, 0, W, H);
    particulas(ctx, 40, 5, t, (g, i, r) => { g.fillStyle = `rgba(200,220,255,${0.08 + r() * 0.2})`; g.beginPath(); g.arc(r() * W, (r() * H + t * 8) % H, 1.5 + r() * 2, 0, 7); g.fill(); });
    ctx.textAlign = 'center';
    // casco con cuernos tachado
    const a1 = smooth(rango(u, 0.3, 0.9));
    ctx.save(); ctx.globalAlpha = a1;
    cascoVikingo(ctx, 300, 760, 1.1, true);
    const tacha = smooth(rango(t, ls[0].palabras[ls[0].palabras.length - 1].ini, ls[0].fin + 0.2));
    ctx.strokeStyle = '#e03a2a'; ctx.lineWidth = 18; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(140, 560); ctx.lineTo(140 + 320 * tacha, 560 + 320 * tacha); ctx.stroke();
    if (tacha > 0.5) { ctx.beginPath(); ctx.moveTo(460, 560); ctx.lineTo(460 - 320 * (tacha - 0.5) * 2, 560 + 320 * (tacha - 0.5) * 2); ctx.stroke(); }
    ctx.font = '800 40px Montserrat'; ctx.fillStyle = '#ff9a8a'; ctx.fillText('MITO', 300, 980);
    ctx.restore();
    // casco real
    const a2 = smooth(rango(u, 1.4, 2.0));
    ctx.save(); ctx.globalAlpha = a2;
    cascoVikingo(ctx, 780, 760, 1.1, false);
    ctx.font = '800 40px Montserrat'; ctx.fillStyle = '#9ae0a8'; ctx.fillText('REALIDAD', 780, 980);
    ctx.font = '700 30px Montserrat'; ctx.fillStyle = '#c8d4e2'; ctx.fillText('casco de Gjermundbu (s. X)', 780, 1025);
    ctx.restore();
    // 1876 · ópera de Wagner
    const ti = ls[1].palabras.find(p => p.p.startsWith('1876'))?.ini ?? ls[1].ini + 1;
    const a3 = smooth(rango(t, ti - 0.1, ti + 0.4));
    if (a3 > 0) { ctx.save(); ctx.globalAlpha = a3; ctx.translate(0, (1 - a3) * 30);
      ctx.font = '900 150px Cinzel'; ctx.fillStyle = '#ffd88a'; ctx.fillText('1876', W / 2, 1180);
      ctx.font = '800 42px Montserrat'; ctx.fillStyle = '#f3e3c3'; ctx.fillText('VESTUARIO DE UNA ÓPERA DE WAGNER', W / 2, 1250); ctx.restore(); }
  }
};

// ===================================================================
// 8. NOCHE — historias de Odín, Thor y el Valhalla
// ===================================================================
ESCENAS.noche = {
  dibujar(ctx, u, dur, t, e) {
    const l = TL.lineas.find(x => x.escena === 'noche');
    ctx.drawImage(cache['v_casa'], 0, 0);
    ctx.fillStyle = 'rgba(5,3,2,0.55)'; ctx.fillRect(0, 0, W, H);
    ctx.save(); camara(ctx, 1.25 + u * 0.03, 540, 1400);
    // gran fuego
    for (let i = 0; i < 7; i++) { const x = 540 + (i - 3) * 26, h = 220 + ruido1(t * 4 + i * 2) * 160;
      ctx.fillStyle = grad(ctx, 0, 1480 - h, 0, 1480, [[0, 'rgba(255,120,30,0)'], [0.4, 'rgba(255,150,40,0.9)'], [1, 'rgba(255,240,170,0.95)']]);
      ctx.beginPath(); ctx.moveTo(x - 50, 1480); ctx.quadraticCurveTo(x - 40 + Math.sin(t * 6 + i) * 14, 1480 - h * 0.5, x + Math.sin(t * 5 + i) * 18, 1480 - h); ctx.quadraticCurveTo(x + 40, 1480 - h * 0.5, x + 50, 1480); ctx.fill(); }
    brillo(ctx, 540, 1380, 700, 'rgba(255,130,40,0.45)', 0.9 + 0.1 * ruido1(t * 5));
    particulas(ctx, 40, 6, t, (g, i, r) => { const k = (t * (0.2 + r() * 0.3) + r()) % 1; g.fillStyle = `rgba(255,${160 + r() * 60},70,${1 - k})`; g.beginPath(); g.arc(540 + (r() - 0.5) * 200 + Math.sin(k * 8 + i) * 30, 1450 - k * 800, 2 + r() * 2, 0, 7); g.fill(); });
    // narrador y oyentes
    iluminado(ctx, (g) => figura(g, { x: 270, y: 1700, s: 1.0, dir: 1, fase: null, col: { ...VIK3, pelo: '#c8c8c0' }, bD: [1.8 + Math.sin(t * 2) * 0.4, -0.8], bT: [1.2, -0.5] }), { osc: 0.45, rim: '#ffa04a', dx: 7 });
    [[790, 0.85, VIK], [930, 0.75, MUJER], [1040, 0.7, VIK2]].forEach(([x, s, c]) => iluminado(ctx, (g) => figura(g, { x, y: 1700, s, dir: -1, fase: null, col: c, bajo: c === MUJER ? 18 : 120, barba: c !== MUJER, bD: [0.7, -0.6], bT: [0.4, 0.4] }), { osc: 0.5, rim: '#ffa04a', dx: -6 }));
    ctx.restore();
    // símbolos en el humo: Odín (cuervo), Thor (martillo), Valhalla (sala dorada)
    const w = p => (l.palabras.find(x => x.p.toLowerCase().startsWith(p)) || l.palabras[0]).ini;
    const sim = (ini, x, fn) => { const k = smooth(rango(t, ini - 0.1, ini + 0.5)); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k * 0.85; ctx.translate(x, 650 - k * 30); ctx.shadowColor = '#ffb050'; ctx.shadowBlur = 30; ctx.fillStyle = '#ffd88a'; ctx.strokeStyle = '#ffd88a'; fn(); ctx.restore(); };
    sim(w('odín'), 260, () => { ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(-30, -60, 40, -20); ctx.lineTo(90, -40); ctx.lineTo(60, 0); ctx.quadraticCurveTo(0, 40, -90, 0); ctx.fill(); ctx.beginPath(); ctx.moveTo(-20, -20); ctx.lineTo(-70, -110); ctx.lineTo(20, -30); ctx.fill(); ctx.font = '800 34px Montserrat'; ctx.textAlign = 'center'; ctx.fillText('ODÍN', 0, 90); });
    sim(w('thor'), 540, () => { ctx.fillRect(-70, -80, 140, 60); ctx.fillRect(-14, -20, 28, 110); ctx.font = '800 34px Montserrat'; ctx.textAlign = 'center'; ctx.fillText('THOR', 0, 140); });
    sim(w('valhalla'), 820, () => { ctx.beginPath(); ctx.moveTo(-100, -20); ctx.lineTo(0, -100); ctx.lineTo(100, -20); ctx.fill(); ctx.fillRect(-85, -20, 170, 80); ctx.fillStyle = '#3a2410'; ctx.fillRect(-20, 10, 40, 50); ctx.fillStyle = '#ffd88a'; ctx.font = '800 34px Montserrat'; ctx.textAlign = 'center'; ctx.fillText('VALHALLA', 0, 110); });
  }
};

// ===================================================================
// 9. PARTIDA — la flota zarpa al amanecer
// ===================================================================
ESCENAS.partida = {
  dibujar(ctx, u, dur, t) {
    const k = rango(u, 0, dur);
    ctx.save(); camara(ctx, 1.15 - easeInOut(k) * 0.15, 540, 1100);
    ctx.drawImage(cache['v_titulo'], 0, 0);
    ctx.fillStyle = 'rgba(255,170,110,0.12)'; ctx.fillRect(0, 0, W, H);
    agua(ctx, 1150, t, '#3a4a6a', '#141c2a', 'rgba(255,210,170,0.6)');
    [[520, 1210, 0.32, 0], [720, 1260, 0.45, 1], [380, 1330, 0.62, 2]].forEach(([x, y, s, f], i) => barcoLargo(ctx, x + u * (14 + i * 6), y, s, t, { vela: i !== 2, remos: i === 2, fase: f, tripulacion: true }));
    ctx.restore();
    ctx.fillStyle = grad(ctx, 0, 1320, 0, H, [[0, 'rgba(10,14,22,0)'], [0.4, 'rgba(10,14,22,0.75)'], [1, '#05070b']]); ctx.fillRect(0, 1300, W, H);
  }
};

// ===================================================================
// 10. FINAL — tarjeta de cierre
// ===================================================================
ESCENAS.final = {
  dibujar(ctx, u, dur, t) {
    ctx.fillStyle = radial(ctx, W / 2, 900, 50, 1200, [[0, '#1a2438'], [1, '#05070b']]); ctx.fillRect(0, 0, W, H);
    particulas(ctx, 50, 15, t, (g, i, r) => { const k = (t * (0.05 + r() * 0.08) + r()) % 1;
      g.fillStyle = `rgba(${180 + r() * 60},${210 + r() * 40},255,${(1 - k) * 0.6})`; g.beginPath(); g.arc(r() * W + Math.sin(k * 8 + i) * 30, k * H, 1.5 + r() * 2.5, 0, 7); g.fill(); });
    const a = smooth(rango(u, 0.2, 1.0));
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    cascoVikingo(ctx, W / 2, 600, 1.0, false);
    ctx.font = '700 50px Cinzel'; ctx.letterSpacing = '14px'; ctx.fillStyle = '#e6ecf4'; ctx.fillText('UN DÍA SIENDO', W / 2 + 7, 800);
    ctx.font = '900 104px Cinzel'; ctx.letterSpacing = '4px'; ctx.fillStyle = grad(ctx, 0, 820, 0, 920, [[0, '#ffffff'], [1, '#8aa4c2']]); ctx.fillText('VIKINGO', W / 2, 915);
    ctx.font = '700 44px Cinzel'; ctx.letterSpacing = '6px'; ctx.fillStyle = '#c9d4e2'; ctx.fillText('NORUEGA · AÑO 900', W / 2, 990);
    const b = smooth(rango(u, 1.4, 2.2));
    ctx.globalAlpha = b; ctx.letterSpacing = '0px';
    ctx.font = '800 40px Montserrat'; ctx.fillStyle = '#f3e3c3'; ctx.fillText('PRÓXIMO EPISODIO', W / 2, 1180);
    ctx.font = '900 76px Cinzel'; ctx.fillStyle = '#ffcc66'; ctx.fillText('FARAÓN', W / 2, 1275);
    ctx.restore();
  }
};
