// ===== Piezas de dibujo reutilizables entre episodios =====
// Se carga después de base.js y antes del escenas.js de cada episodio.
//   mezcla(a, b, k)            mezcla dos colores hex
//   figura(ctx, opciones)      personaje 2D (túnica, brazos/piernas articulados, caminar, objeto en la mano)
//   iluminado(ctx, fn, opts)   dibuja algo como silueta con luz de contorno (escenas nocturnas o a contraluz)
//   cielo(ctx, stops)          degradado vertical de cielo
//   estrellas(ctx, t, n, hmax) estrellas titilantes
//   humo(ctx, x, y, t, n, colorConA, escala, viento) humo/vapor suave ('rgba(r,g,b,A)', A se sustituye)
const PIEL = '#b67c55', PIEL_OSC = '#8a5a3c', PELO = '#24160f';
const TUNICA = '#e6dcc6', TUNICA_OSC = '#b9aa8c', CINTO = '#5a3a22';

function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; }
function mezcla(a, b, k) { const A = hex2rgb(a), B = hex2rgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; }


// ---------- personaje genérico ----------
// o: {x, y (pies), s (escala; la figura mide 600 u.), dir (1 derecha, -1 izquierda), fase (caminar) o null,
//     bD:[hombro, codo] brazo delantero, bT:[..] brazo trasero (radianes; 0 = colgando, + hacia delante),
//     col:{piel, tunica, sombra, pelo, cinto, delantal, manto}, barba, bajo (altura del bajo), mano(ctx,x,y)}
function figura(ctx, o) {
  const c = Object.assign({ piel: PIEL, tunica: TUNICA, sombra: TUNICA_OSC, pelo: PELO, cinto: CINTO, delantal: null, manto: null }, o.col || {});
  const pielT = mezcla(c.piel, '#000000', 0.25);
  ctx.save(); ctx.translate(o.x, o.y); ctx.scale(o.s * o.dir, o.s);
  const sw = o.fase == null ? 0 : Math.sin(o.fase) * 0.38;
  const bob = o.fase == null ? 0 : Math.abs(Math.cos(o.fase)) * -8;
  ctx.translate(0, bob);
  const pierna = (hx, a, col) => {
    const fx = hx + Math.sin(a) * 250, fy = -250 + Math.cos(a) * 250;
    ctx.strokeStyle = col; capsula(ctx, hx, -250, fx, fy - 8, 17);
    ctx.fillStyle = '#3b2616'; elipse(ctx, fx + 12, fy - 5, 26, 9); ctx.fill();
  };
  const brazo = (sx, sy, ang, col, manga, mano) => {
    const [a1, a2] = ang;
    const ex = sx + Math.sin(a1) * 125, ey = sy + Math.cos(a1) * 125;
    const hx = ex + Math.sin(a1 + a2) * 115, hy = ey + Math.cos(a1 + a2) * 115;
    ctx.strokeStyle = col; capsula(ctx, sx, sy, ex, ey, 16); capsula(ctx, ex, ey, hx, hy, 14);
    ctx.fillStyle = col; elipse(ctx, hx, hy, 19, 21); ctx.fill();
    if (manga) { ctx.strokeStyle = manga; capsula(ctx, sx, sy, sx + Math.sin(a1) * 62, sy + Math.cos(a1) * 62, 25); }
    if (mano) mano(ctx, hx, hy);
    return [hx, hy];
  };
  const bT = o.bT || (o.fase == null ? [0.05, 0.1] : [-sw * 0.8, 0.25]);
  const bD = o.bD || (o.fase == null ? [0.1, 0.15] : [sw * 0.8, 0.25]);
  // capa trasera
  brazo(-10, -432, bT, pielT, mezcla(c.tunica, '#000000', 0.3), o.manoT);
  pierna(-8, o.fase == null ? -0.04 : -sw, pielT);
  // cuerpo
  const bajo = o.bajo ?? 120;
  ctx.fillStyle = grad(ctx, -70, 0, 70, 0, [[0, c.sombra], [0.55, c.tunica], [1, c.tunica]]);
  ctx.beginPath(); ctx.moveTo(-50, -452); ctx.quadraticCurveTo(0, -468, 50, -452);
  ctx.lineTo(68, -300); ctx.lineTo(74 + sw * 20, -bajo); ctx.quadraticCurveTo(0, -bajo + 12, -72 + sw * 20, -bajo);
  ctx.lineTo(-62, -300); ctx.closePath(); ctx.fill();
  // pliegues
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 4;
  [[-30, -290], [5, -285], [35, -290]].forEach(([x, y]) => { ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 6, (y - bajo) / 2, x + sw * 15, -bajo - 6); ctx.stroke(); });
  pierna(10, o.fase == null ? 0.04 : sw, c.piel);
  if (c.delantal) {
    ctx.fillStyle = c.delantal;
    ctx.beginPath(); ctx.moveTo(-6, -305); ctx.lineTo(66, -305); ctx.lineTo(76 + sw * 18, -132); ctx.quadraticCurveTo(35, -124, -4 + sw * 18, -132); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; particulas(ctx, 18, 31, 0, (g, i, r) => { g.beginPath(); g.arc(r() * 70, -300 + r() * 160, 2 + r() * 5, 0, 7); g.fill(); });
  }
  ctx.fillStyle = c.cinto; ctx.fillRect(-64, -312, 132, 15);
  // cuello y cabeza
  ctx.fillStyle = c.piel; ctx.fillRect(-12, -485, 32, 45);
  ctx.fillStyle = grad(ctx, -40, 0, 55, 0, [[0, pielT], [0.6, c.piel]]);
  elipse(ctx, 8, -532, 46, 54); ctx.fill();
  ctx.fillStyle = c.piel; ctx.beginPath(); ctx.moveTo(48, -545); ctx.lineTo(64, -518); ctx.lineTo(47, -512); ctx.fill();
  ctx.fillStyle = pielT; elipse(ctx, -14, -530, 9, 15); ctx.fill();
  ctx.fillStyle = c.pelo;
  if (o.barba !== false) {
    ctx.beginPath(); ctx.moveTo(-18, -540); ctx.quadraticCurveTo(-16, -470, 18, -466); ctx.quadraticCurveTo(48, -468, 54, -500);
    ctx.lineTo(40, -506); ctx.quadraticCurveTo(28, -494, 18, -506); ctx.lineTo(4, -536); ctx.closePath(); ctx.fill();
  }
  if (c.manto) {
    ctx.fillStyle = c.manto;
    ctx.beginPath(); ctx.moveTo(52, -560); ctx.quadraticCurveTo(10, -620, -48, -560); ctx.quadraticCurveTo(-80, -420, -66, -250);
    ctx.lineTo(-30, -300); ctx.quadraticCurveTo(-30, -470, -14, -500); ctx.quadraticCurveTo(10, -580, 40, -548); ctx.closePath(); ctx.fill();
  } else {
    [[-12, -566, 30], [-34, -546, 26], [12, -580, 24], [32, -572, 18], [-38, -518, 19], [-22, -588, 18]].forEach(([x, y, r]) => { elipse(ctx, x, y, r, r); ctx.fill(); });
  }
  ctx.fillStyle = '#140b07'; elipse(ctx, 36, -540, 4.5, 5); ctx.fill();
  ctx.strokeStyle = c.pelo; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(26, -553); ctx.lineTo(46, -551); ctx.stroke();
  const mano = brazo(18, -438, bD, c.piel, c.tunica, o.mano);
  ctx.restore();
  return mano;
}

// silueta con luz de contorno: dibuja fn en un lienzo temporal y la compone oscurecida + borde de luz
const TMP1 = lienzo(), TMP2 = lienzo();
function iluminado(ctx, fn, { osc = 0.55, rim = '#ffb35c', dx = 7, dy = 0, alphaRim = 1, tinte = null } = {}) {
  const a = TMP1.getContext('2d'), b = TMP2.getContext('2d');
  a.setTransform(1, 0, 0, 1, 0, 0); a.clearRect(0, 0, W, H); a.setTransform(ctx.getTransform()); fn(a); a.setTransform(1, 0, 0, 1, 0, 0);
  b.setTransform(1, 0, 0, 1, 0, 0); b.globalCompositeOperation = 'source-over'; b.clearRect(0, 0, W, H); b.drawImage(TMP1, 0, 0);
  b.globalCompositeOperation = 'source-in'; b.fillStyle = rim; b.fillRect(0, 0, W, H); b.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = alphaRim; ctx.filter = 'blur(1.5px)'; ctx.drawImage(TMP2, dx, dy); ctx.globalAlpha = 1;
  ctx.filter = `brightness(${1 - osc})` + (tinte ? ` ${tinte}` : ''); ctx.drawImage(TMP1, 0, 0);
  ctx.filter = 'none'; ctx.restore();
}


function cielo(ctx, stops) { ctx.fillStyle = grad(ctx, 0, 0, 0, H, stops); ctx.fillRect(0, 0, W, H); }
function estrellas(ctx, t, n = 160, hmax = 1100) {
  particulas(ctx, n, 11, t, (g, i, r) => {
    const x = r() * W, y = r() * hmax, s = r() * 2.2 + 0.4, tw = 0.55 + 0.45 * Math.sin(t * (1 + r() * 3) + i);
    g.fillStyle = `rgba(255,245,225,${tw * (0.35 + r() * 0.6)})`; g.beginPath(); g.arc(x, y, s, 0, 7); g.fill();
  });
}
function humo(ctx, x, y, t, n, color, escala = 1, viento = 40) {
  particulas(ctx, n, 77, t, (g, i, r) => {
    const v = 0.08 + r() * 0.06, k = ((t * v + r()) % 1);
    const px = x + Math.sin(k * 6 + i) * 20 * escala + k * viento * escala, py = y - k * 420 * escala, rad = (20 + k * 90) * escala;
    const al = (0.16 * Math.sin(Math.PI * k)).toFixed(3);
    g.fillStyle = radial(g, px, py, 0, rad, [[0, color.replace('A', al)], [1, color.replace('A', '0')]]);
    g.fillRect(px - rad, py - rad, rad * 2, rad * 2);
  });
}

