// ===== Episodio 01 — Un día siendo panadero en Pompeya (79 d. C.) =====
// Todas las escenas están dibujadas con Canvas 2D. Unidades: píxeles de 1080x1920.

RELOJ.noche = '03:00 · Antes del alba';
RELOJ.molino = '03:30 · El molino';
RELOJ.masa = '04:30 · La masa';
RELOJ.horno = '05:30 · El horno';
RELOJ.venta = '07:00 · Amanecer';
RELOJ.tarde = '18:00 · La tarde';
RELOJ.hallazgo = 'Pompeya · hoy';
TRANSICION.hallazgo = 'negro';
TRANSICION.final = 0.8;

// ---------- colores ----------
const DELANTAL = '#cdb88f';

// ---------- burro ----------
function burro(ctx, x, y, s, fase, fx) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * fx, s);
  const piel = '#7b7064', panza = '#a99d8d', osc = '#4b4239', crin = '#2f2822';
  const pata = (px, off, col) => {
    const a = Math.sin(fase + off) * 0.4, k = Math.max(0, Math.sin(fase + off + 1.2)) * 0.5;
    const kx = px + Math.sin(a) * 70, ky = -110 + Math.cos(a) * 70;
    const fx2 = kx + Math.sin(a - k) * 62, fy = ky + Math.cos(a - k) * 62;
    ctx.strokeStyle = col; capsula(ctx, px, -125, kx, ky, 15); capsula(ctx, kx, ky, fx2, fy - 4, 10);
    ctx.fillStyle = '#1e1813'; elipse(ctx, fx2 + 3, fy - 4, 12, 7); ctx.fill();
  };
  pata(-75, Math.PI, osc); pata(70, 0, osc);
  // cola
  ctx.strokeStyle = piel; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(-120, -175);
  ctx.quadraticCurveTo(-150 + Math.sin(fase * 0.5) * 8, -130, -140 + Math.sin(fase * 0.5) * 12, -85); ctx.stroke();
  ctx.fillStyle = crin; elipse(ctx, -140 + Math.sin(fase * 0.5) * 12, -80, 9, 18); ctx.fill();
  // cuerpo
  ctx.fillStyle = grad(ctx, 0, -215, 0, -95, [[0, piel], [0.7, piel], [1, panza]]);
  elipse(ctx, 0, -158, 128, 62); ctx.fill();
  // cuello y cabeza
  ctx.beginPath(); ctx.moveTo(70, -205); ctx.quadraticCurveTo(140, -280, 175, -290); ctx.lineTo(205, -235); ctx.quadraticCurveTo(140, -190, 115, -130); ctx.closePath(); ctx.fill();
  ctx.fillStyle = crin; ctx.beginPath(); ctx.moveTo(72, -210); ctx.quadraticCurveTo(135, -290, 172, -300); ctx.lineTo(166, -284); ctx.quadraticCurveTo(130, -270, 84, -200); ctx.fill();
  ctx.fillStyle = piel; elipse(ctx, 205, -255, 62, 30, 0.62); ctx.fill();
  ctx.fillStyle = panza; elipse(ctx, 238, -213, 26, 21, 0.62); ctx.fill();
  ctx.fillStyle = '#2a221c'; elipse(ctx, 250, -207, 5, 4); ctx.fill();
  // orejas
  ctx.fillStyle = piel; elipse(ctx, 160, -320, 13, 44, -0.55 + Math.sin(fase * 0.3) * 0.08); ctx.fill();
  ctx.fillStyle = osc; elipse(ctx, 176, -318, 12, 42, -0.3); ctx.fill();
  // venda en los ojos
  ctx.fillStyle = '#d7c9ad'; ctx.save(); ctx.translate(198, -268); ctx.rotate(0.62); ctx.fillRect(-14, -34, 30, 66); ctx.restore();
  ctx.strokeStyle = '#b8a888'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(183, -290); ctx.lineTo(166, -255); ctx.stroke();
  // arnés
  ctx.strokeStyle = '#3a2516'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(96, -215); ctx.quadraticCurveTo(110, -165, 118, -130); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(100, -180); ctx.lineTo(-20, -205); ctx.stroke();
  pata(-55, 0.2, piel); pata(92, Math.PI + 0.2, piel);
  ctx.restore();
}

// ---------- lucerna (lámpara de aceite) ----------
function lucerna(ctx, x, y, s, t, encendida = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = grad(ctx, 0, -40, 0, 30, [[0, '#c8774a'], [1, '#6b3420']]);
  ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-70, -42, 0, -42); ctx.quadraticCurveTo(60, -42, 70, -14);
  ctx.lineTo(118, -18); ctx.quadraticCurveTo(134, -6, 118, 8); ctx.lineTo(60, 14); ctx.quadraticCurveTo(0, 30, -60, 18); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#7a3c22'; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(-84, -16, 20, Math.PI * 0.4, Math.PI * 1.7); ctx.stroke();
  ctx.fillStyle = '#4a2214'; elipse(ctx, -5, -38, 26, 7); ctx.fill();
  ctx.fillStyle = '#2b130b'; elipse(ctx, 118, -12, 8, 4); ctx.fill();
  if (encendida > 0) {
    const fl = ruido1(t * 9) * 0.25 + ruido1(t * 23, 3) * 0.15;
    const h = (70 + fl * 40) * encendida;
    ctx.save(); ctx.translate(120, -16);
    ctx.rotate((ruido1(t * 5, 9) - 0.5) * 0.25);
    ctx.fillStyle = grad(ctx, 0, -h, 0, 0, [[0, 'rgba(255,140,40,0)'], [0.25, '#ff9a2e'], [0.65, '#ffd27a'], [1, '#fff6d8']]);
    ctx.beginPath(); ctx.moveTo(0, 2); ctx.quadraticCurveTo(-17, -h * 0.35, 0, -h); ctx.quadraticCurveTo(17, -h * 0.35, 0, 2); ctx.fill();
    ctx.fillStyle = 'rgba(90,140,255,0.6)'; elipse(ctx, 0, -3, 6, 7); ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
function luzLucerna(ctx, x, y, r, t, k = 1) {
  const fl = 0.85 + ruido1(t * 8) * 0.25;
  brillo(ctx, x, y, r * fl, 'rgba(255,150,60,0.55)', k);
  brillo(ctx, x, y, r * 0.25, 'rgba(255,220,150,0.9)', k);
}

// ---------- pan (panis quadratus) ----------
function pan(ctx, x, y, r, { cortes = 8, sello = 0, tostado = 0.5, carbon = 0, aplast = 1 } = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, aplast);
  const base = carbon ? mezcla('#3a2a20', '#121010', carbon) : mezcla('#e8c38a', '#a8621f', tostado);
  const claro = carbon ? mezcla('#5a4436', '#262220', carbon) : mezcla('#f6dcae', '#d89a4a', tostado);
  ctx.fillStyle = radial(ctx, -r * 0.3, -r * 0.35, r * 0.1, r * 1.1, [[0, claro], [1, base]]);
  elipse(ctx, 0, 0, r, r); ctx.fill();
  // cuerda alrededor
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = r * 0.06; elipse(ctx, 0, 0, r * 0.9, r * 0.9); ctx.stroke();
  // cortes en 8 porciones
  const n = Math.floor(cortes), parc = cortes - n;
  ctx.strokeStyle = carbon ? 'rgba(0,0,0,0.7)' : 'rgba(110,55,15,0.75)'; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round';
  for (let i = 0; i < Math.ceil(cortes / 2); i++) {
    const a = i * Math.PI / 4 + 0.2, k = i < Math.floor(cortes / 2) ? 1 : (cortes / 2 - i);
    ctx.beginPath(); ctx.moveTo(-Math.cos(a) * r * 0.85, -Math.sin(a) * r * 0.85);
    ctx.lineTo(lerp(-Math.cos(a), Math.cos(a), k) * r * 0.85, lerp(-Math.sin(a), Math.sin(a), k) * r * 0.85); ctx.stroke();
  }
  if (sello > 0) { // sello: espiga de trigo en un círculo
    ctx.globalAlpha = sello; ctx.strokeStyle = 'rgba(90,45,12,0.8)'; ctx.lineWidth = r * 0.035;
    elipse(ctx, 0, 0, r * 0.24, r * 0.24); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, r * 0.17); ctx.lineTo(0, -r * 0.17); ctx.stroke();
    for (let j = 0; j < 3; j++) { const yy = -r * 0.1 + j * r * 0.08; ctx.beginPath(); ctx.moveTo(0, yy); ctx.lineTo(-r * 0.08, yy - r * 0.06); ctx.moveTo(0, yy); ctx.lineTo(r * 0.08, yy - r * 0.06); ctx.stroke(); }
    ctx.globalAlpha = 1;
  }
  if (carbon) { // grietas
    const R = rnd(Math.floor(x + y)); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 2;
    for (let i = 0; i < 26; i++) { const a = R() * 7, d = R() * r * 0.8; ctx.beginPath(); ctx.moveTo(Math.cos(a) * d, Math.sin(a) * d); ctx.lineTo(Math.cos(a) * d + (R() - 0.5) * 30, Math.sin(a) * d + (R() - 0.5) * 30); ctx.stroke(); }
  }
  ctx.restore();
}

// ---------- paisaje de Pompeya ----------
function vesubio(ctx, cx, baseY, ancho, alto, colA, colB, borde) {
  ctx.fillStyle = grad(ctx, 0, baseY - alto, 0, baseY, [[0, colA], [1, colB]]);
  ctx.beginPath(); ctx.moveTo(cx - ancho, baseY);
  ctx.bezierCurveTo(cx - ancho * 0.55, baseY - alto * 0.2, cx - ancho * 0.25, baseY - alto * 0.85, cx - ancho * 0.09, baseY - alto);
  ctx.quadraticCurveTo(cx, baseY - alto * 1.02, cx + ancho * 0.1, baseY - alto * 0.99);
  ctx.bezierCurveTo(cx + ancho * 0.28, baseY - alto * 0.8, cx + ancho * 0.6, baseY - alto * 0.2, cx + ancho, baseY);
  ctx.closePath(); ctx.fill();
  if (borde) { ctx.strokeStyle = borde; ctx.lineWidth = 3; ctx.stroke(); }
  // barrancos
  ctx.strokeStyle = 'rgba(0,0,0,0.18)'; ctx.lineWidth = 6; const R = rnd(5);
  for (let i = 0; i < 9; i++) { const k = (i + 0.5) / 9 - 0.5; ctx.beginPath(); ctx.moveTo(cx + k * ancho * 0.25, baseY - alto * 0.95); ctx.quadraticCurveTo(cx + k * ancho * 0.9, baseY - alto * 0.5, cx + k * ancho * 1.4 + (R() - .5) * 60, baseY - alto * 0.05); ctx.stroke(); }
}
function ciudad(ctx, baseY, seed, colTecho, colMuro, luces, t = 0) {
  const R = rnd(seed);
  // pinos piñoneros y cipreses al fondo
  for (let i = 0; i < 9; i++) {
    const x = R() * W, h = 120 + R() * 90;
    ctx.fillStyle = colMuro; ctx.fillRect(x - 5, baseY - h, 10, h);
    elipse(ctx, x, baseY - h, 70 + R() * 40, 26 + R() * 10); ctx.fill();
  }
  // templo de Júpiter (frontón y columnas)
  const tx = 300, tb = baseY - 40;
  ctx.fillStyle = colMuro; ctx.fillRect(tx - 120, tb - 30, 240, 30);
  for (let i = 0; i < 6; i++) ctx.fillRect(tx - 105 + i * 40, tb - 190, 18, 160);
  ctx.fillRect(tx - 125, tb - 210, 250, 22);
  ctx.beginPath(); ctx.moveTo(tx - 130, tb - 208); ctx.lineTo(tx, tb - 270); ctx.lineTo(tx + 130, tb - 208); ctx.fill();
  // casas
  let x = -40;
  while (x < W + 40) {
    const w = 90 + R() * 130, h = 70 + R() * 150, y = baseY - h;
    if (Math.abs(x + w / 2 - tx) > 150 || R() < 0.3) {
      ctx.fillStyle = colMuro; ctx.fillRect(x, y, w, h + 200);
      ctx.fillStyle = colTecho; ctx.beginPath(); ctx.moveTo(x - 8, y + 2); ctx.lineTo(x + w / 2, y - 22 - R() * 10); ctx.lineTo(x + w + 8, y + 2); ctx.fill();
      if (luces && R() < 0.45) { luces.push([x + 15 + R() * (w - 40), y + 25 + R() * (h - 40), R()]); }
    }
    x += w * (0.75 + R() * 0.2);
  }
}
// ===================================================================
// 1. TÍTULO — Pompeya dormida bajo el Vesubio
// ===================================================================
ESCENAS.titulo = {
  init() {
    this.luces = [];
    this.fondo = cacheado('titulo_fondo', W, H, (g) => {
      cielo(g, [[0, '#070a1c'], [0.45, '#141a3d'], [0.62, '#2d2450'], [0.72, '#4a2c4c'], [1, '#120d18']]);
      g.fillStyle = 'rgba(255,240,210,0.9)'; elipse(g, 820, 330, 38, 38); g.fill();
      brillo(g, 820, 330, 260, 'rgba(180,190,255,0.18)');
      vesubio(g, 560, 1260, 900, 470, '#2a2440', '#151225', 'rgba(170,160,220,0.25)');
    });
    this.city = cacheado('titulo_ciudad', W, H, (g) => {
      ciudad(g, 1330, 3, '#1a1018', '#0f0a10', this.luces);
      g.fillStyle = '#07050a'; g.fillRect(0, 1320, W, H);
    });
  },
  dibujar(ctx, u, dur, t) {
    const z = 1.0 + u * 0.018;
    ctx.save(); camara(ctx, z, W / 2, 1100);
    ctx.drawImage(this.fondo, 0, 0);
    estrellas(ctx, t, 170, 900);
    ctx.drawImage(this.city, 0, 0);
    this.luces.forEach(([x, y, r], i) => {
      const k = 0.65 + 0.35 * ruido1(t * 3 + i * 7);
      ctx.fillStyle = `rgba(255,170,80,${0.85 * k})`; ctx.fillRect(x, y, 14, 20);
      brillo(ctx, x + 7, y + 10, 50, 'rgba(255,140,50,0.35)', k);
    });
    humo(ctx, 760, 1190, t, 10, 'rgba(200,190,210,A)', 0.8, 60);
    ctx.restore();
    // primer plano
    ctx.fillStyle = grad(ctx, 0, 1330, 0, H, [[0, 'rgba(8,6,10,0)'], [0.25, '#08060a'], [1, '#050306']]); ctx.fillRect(0, 1300, W, H - 1300);
    // títulos
    const a = smooth(rango(u, 0.3, 1.3)) * (1 - smooth(rango(u, dur - 0.9, dur - 0.2)));
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 30;
    ctx.font = '700 52px Cinzel'; ctx.fillStyle = '#e9d6b0'; ctx.letterSpacing = '14px';
    ctx.fillText('UN DÍA SIENDO', W / 2 + 7, 470 - (1 - a) * 20);
    ctx.font = '900 132px Cinzel'; ctx.letterSpacing = '4px';
    ctx.fillStyle = grad(ctx, 0, 500, 0, 640, [[0, '#ffe6a6'], [0.5, '#e7b45a'], [1, '#a8702a']]);
    ctx.fillText('PANADERO', W / 2 + 2, 620);
    ctx.font = '700 62px Cinzel'; ctx.letterSpacing = '10px'; ctx.fillStyle = '#f1dfbd';
    ctx.fillText('EN POMPEYA', W / 2 + 5, 715);
    ctx.font = '700 40px Cinzel'; ctx.letterSpacing = '8px'; ctx.fillStyle = '#c9a66b';
    ctx.fillText('— AÑO 79 d. C. —', W / 2 + 4, 800);
    ctx.restore();
  }
};

// ===================================================================
// 2. NOCHE — la lucerna se enciende y el panadero carga el saco
// ===================================================================
ESCENAS.noche = {
  init() {
    this.pared = cacheado('noche_pared', W, H, (g) => {
      g.fillStyle = '#1b1310'; g.fillRect(0, 0, W, H);
      g.fillStyle = '#2a1b16'; g.fillRect(0, 0, W, 1150);
      g.fillStyle = '#5a1d15'; g.fillRect(0, 1150, W, 330); // zócalo rojo pompeyano
      g.fillStyle = '#1a0f0c'; g.fillRect(0, 1140, W, 14); g.fillRect(0, 1480, W, 10);
      const R = rnd(2);
      for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${R() < .5 ? '255,230,200' : '0,0,0'},${R() * 0.05})`; g.fillRect(R() * W, R() * H, 2 + R() * 7, 2 + R() * 7); }
      // ventana alta con barrotes y luna
      g.fillStyle = '#0d1430'; g.fillRect(150, 300, 220, 260);
      g.fillStyle = 'rgba(170,190,255,0.35)'; elipse(g, 300, 360, 26, 26); g.fill();
      g.fillStyle = '#120c0a'; for (let i = 0; i < 4; i++) g.fillRect(170 + i * 55, 300, 12, 260);
      // suelo
      g.fillStyle = grad(g, 0, 1490, 0, H, [[0, '#24170f'], [1, '#0c0705']]); g.fillRect(0, 1490, W, H - 1490);
      // repisa
      g.fillStyle = '#3b2a1e'; g.fillRect(560, 1060, 520, 34); g.fillStyle = '#20150e'; g.fillRect(560, 1094, 520, 16);
      // sacos de grano y ánforas
      for (let i = 0; i < 3; i++) { g.fillStyle = ['#7d6748', '#6f5b3f', '#857052'][i]; elipse(g, 120 + i * 120, 1600 - (i % 2) * 20, 85, 115); g.fill(); }
      g.fillStyle = '#8a4b2c'; elipse(g, 900, 1530, 70, 140); g.fill(); g.fillRect(880, 1370, 40, 60);
    });
  },
  dibujar(ctx, u, dur, t) {
    const encender = smooth(rango(u, 0.4, 1.1));
    const z = 1.18 - smooth(rango(u, 0, dur)) * 0.16;
    ctx.save(); camara(ctx, z, 760, 1000);
    ctx.drawImage(this.pared, 0, 0);
    // oscuridad general y luz de la lámpara
    ctx.fillStyle = `rgba(0,0,0,${0.75 - 0.35 * encender})`; ctx.fillRect(0, 0, W, H);
    luzLucerna(ctx, 880, 1020, 900, t, encender);
    // panadero: recoge el saco y se lo carga al hombro
    const k = easeInOut(rango(u, 3.2, 5.6));
    const px = 560 - smooth(rango(u, 1.0, 3.0)) * 80;
    const saco = (g, hx, hy) => { const sy = hy - 20 * k + 60 * (1 - k);
      g.fillStyle = '#8b7350'; g.beginPath(); g.moveTo(hx - 20, sy - 70); g.quadraticCurveTo(hx - 95, sy - 40, hx - 80, sy + 40); g.quadraticCurveTo(hx + 10, sy + 85, hx + 95, sy + 40);
      g.quadraticCurveTo(hx + 105, sy - 40, hx + 25, sy - 70); g.closePath(); g.fill();
      g.fillStyle = '#6d5939'; g.beginPath(); g.moveTo(hx - 20, sy - 68); g.lineTo(hx - 30, sy - 105); g.lineTo(hx + 35, sy - 105); g.lineTo(hx + 25, sy - 68); g.fill();
      g.strokeStyle = '#3a2a18'; g.lineWidth = 7; g.beginPath(); g.moveTo(hx - 24, sy - 72); g.lineTo(hx + 30, sy - 72); g.stroke();
      g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 4; g.beginPath(); g.moveTo(hx - 40, sy - 20); g.quadraticCurveTo(hx, sy + 10, hx + 50, sy - 15); g.stroke(); };
    iluminado(ctx, (g) => figura(g, {
      x: px, y: 1700, s: 1.55, dir: 1, fase: u < 3 ? u * 5.5 * (1 - smooth(rango(u, 2.4, 3))) : null,
      bD: [lerp(0.6, 2.7, k), lerp(0.9, 0.9, k)], bT: [lerp(0.4, 2.4, k), lerp(0.5, 1.2, k)],
      col: { delantal: DELANTAL }, mano: saco
    }), { osc: 0.5 - 0.15 * encender, rim: '#ffb35c', dx: 6, alphaRim: 0.4 + 0.6 * encender });
    lucerna(ctx, 880, 1050, 1.0, t, encender);
    // chispa al encender
    if (u > 0.35 && u < 0.8) brillo(ctx, 1000, 1030, 120 * (1 - rango(u, 0.35, 0.8)), 'rgba(255,230,160,0.9)');
    ctx.restore();
  }
};

// ===================================================================
// 3. MOLINO — piedra volcánica en forma de reloj de arena y burro vendado
// ===================================================================
ESCENAS.molino = {
  init() {
    this.fondo = cacheado('molino_fondo', W, H, (g) => {
      cielo(g, [[0, '#060a1a'], [0.5, '#101a36'], [1, '#18203a']]);
      g.fillStyle = 'rgba(220,230,255,0.9)'; elipse(g, 230, 260, 30, 30); g.fill(); brillo(g, 230, 260, 240, 'rgba(160,180,255,0.2)');
      // peristilo: muro y columnas
      g.fillStyle = '#2b2a35'; g.fillRect(0, 700, W, 700);
      g.fillStyle = '#4a1c18'; g.fillRect(0, 1080, W, 240);
      g.fillStyle = '#1e1d27'; g.fillRect(0, 640, W, 70);
      for (let i = 0; i < 6; i++) { const x = 40 + i * 200; g.fillStyle = grad(g, x, 0, x + 56, 0, [[0, '#55525e'], [1, '#2a2833']]); g.fillRect(x, 700, 56, 620); }
      g.fillStyle = '#161520'; g.fillRect(0, 1310, W, 20);
      // suelo de tierra batida
      g.fillStyle = grad(g, 0, 1320, 0, H, [[0, '#2c2722'], [1, '#141110']]); g.fillRect(0, 1320, W, H);
      const R = rnd(4); for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(0,0,0,${R() * 0.15})`; elipse(g, R() * W, 1330 + R() * 600, 3 + R() * 10, 2 + R() * 4); g.fill(); }
      // segundo molino al fondo (quieto)
      this.dibMolino(g, 160, 1360, 0.55, 0.2);
    });
  },
  dibMolino(g, cx, gy, s, ang) {
    g.save(); g.translate(cx, gy); g.scale(s, s);
    const basalto = (x0, x1) => grad(g, x0, 0, x1, 0, [[0, '#2d2c2e'], [0.35, '#5c5a5a'], [1, '#1e1d1f']]);
    // base cilíndrica de mampostería
    g.fillStyle = '#5b4e44'; g.fillRect(-190, -110, 380, 110); elipse(g, 0, 0, 190, 40); g.fill();
    g.fillStyle = '#6e6157'; elipse(g, 0, -110, 190, 40); g.fill();
    g.fillStyle = '#d8d2c4'; elipse(g, 0, -112, 160, 30); g.fill(); // anillo de harina
    // meta (cono inferior, oculta) y catillus (reloj de arena)
    g.fillStyle = basalto(-140, 140);
    g.beginPath(); g.moveTo(-140, -125); g.lineTo(-58, -300); g.lineTo(58, -300); g.lineTo(140, -125); g.quadraticCurveTo(0, -95, -140, -125); g.fill();
    g.beginPath(); g.moveTo(-58, -300); g.lineTo(-130, -470); g.quadraticCurveTo(0, -500, 130, -470); g.lineTo(58, -300); g.fill();
    g.fillStyle = '#1a191b'; elipse(g, 0, -472, 128, 24); g.fill();
    g.fillStyle = '#c9a85e'; elipse(g, 0, -468, 100, 16); g.fill(); // grano en la tolva
    // marco de madera en la cintura
    g.fillStyle = '#4a321e'; g.fillRect(-72, -325, 144, 50);
    g.fillStyle = '#2e1f13'; g.fillRect(-72, -282, 144, 8);
    // textura volcánica
    const R = rnd(9); for (let i = 0; i < 160; i++) { const y = -130 - R() * 340, w = y < -300 ? lerp(58, 130, (-300 - y) / 170) : lerp(140, 58, (-125 - y) / -175 * -1);
      g.fillStyle = `rgba(0,0,0,${0.25 * R()})`; elipse(g, (R() - 0.5) * 1.6 * Math.abs(w), y, 2 + R() * 4, 2 + R() * 3); g.fill(); }
    g.restore();
  },
  dibujar(ctx, u, dur, t) {
    const z = 1.0 + smooth(rango(u, 3.5, dur)) * 0.22;
    ctx.save(); camara(ctx, z, 700, 1180);
    ctx.drawImage(this.fondo, 0, 0);
    const cx = 560, gy = 1500, R = 330, ry = 0.3;
    const th = u * 0.75 + 1.2; // rotación del molino
    const bx = cx + Math.cos(th) * R, by = gy + Math.sin(th) * R * ry;
    const delante = Math.sin(th) > 0;
    const cintura = gy - 300 * 1.0;
    const sx = Math.sin(th);
    const fx = (sx > 0 ? -1 : 1) * Math.max(0.3, Math.abs(sx));
    const sb = 0.95 + 0.18 * sx;
    const viga = () => {
      ctx.strokeStyle = '#5a3c22'; ctx.lineWidth = 22; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(cx - Math.cos(th) * 150, cintura - Math.sin(th) * 150 * ry); ctx.lineTo(bx, by - 205 * sb); ctx.stroke();
    };
    const elBurro = () => iluminado(ctx, (g) => burro(g, bx, by, sb, u * 7.5, fx), { osc: 0.35, rim: '#9fb4ff', dx: -5, alphaRim: 0.6 });
    // sombra del círculo pisado
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 50; elipse(ctx, cx, gy + 10, R, R * ry); ctx.stroke();
    if (!delante) { elBurro(); viga(); }
    this.dibMolino(ctx, cx, gy, 1.0, th);
    // harina cayendo
    particulas(ctx, 40, 21, t, (g, i, r) => { const k = (t * (0.6 + r()) + r()) % 1, a = r() * 6.28;
      g.fillStyle = `rgba(240,235,220,${0.7 * (1 - k)})`; g.beginPath(); g.arc(cx + Math.cos(a) * 140, gy - 125 + k * 25, 2.5, 0, 7); g.fill(); });
    if (delante) { viga(); elBurro(); }
    // panadero echando grano (de espaldas al patio, a la derecha)
    const echa = Math.sin(u * 1.4) * 0.5 + 0.5;
    iluminado(ctx, (g) => figura(g, {
      x: 900, y: 1430, s: 1.15, dir: -1, fase: null, bD: [2.1 + echa * 0.4, -0.3], bT: [1.6 + echa * 0.3, 0.2], col: { delantal: DELANTAL },
      mano: (c, hx, hy) => { c.fillStyle = '#8a6a3e'; c.beginPath(); c.ellipse(hx + 20, hy - 10, 55, 30, 0.6 + echa * 0.5, 0, 7); c.fill();
        c.fillStyle = '#d7b46a'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(hx + 60 + i * 6, hy - 40 + ((t * 300 + i * 23) % 60), 4, 0, 7); c.fill(); } }
    }), { osc: 0.45, rim: '#ffb35c', dx: -6, alphaRim: 0.8 });
    // luz de lucerna sobre la pared
    lucerna(ctx, 1000, 1060, 0.6, t);
    luzLucerna(ctx, 1072, 1048, 700, t, 0.8);
    ctx.restore();
    // luz de luna fría
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(80,110,200,0.35)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
};

// ===================================================================
// 4. MASA — vista cenital: amasar, cortar en 8 y sellar
// ===================================================================
ESCENAS.masa = {
  init() {
    this.mesa = cacheado('masa_mesa', W, H, (g) => {
      g.fillStyle = '#6b4526'; g.fillRect(0, 0, W, H);
      const R = rnd(12);
      for (let i = 0; i < 18; i++) { // tablones
        const y = i * 110; g.fillStyle = `rgba(0,0,0,${0.08 + R() * 0.1})`; g.fillRect(0, y, W, 4);
        for (let j = 0; j < 40; j++) { g.strokeStyle = `rgba(${R() < .5 ? '40,20,8' : '150,100,60'},${0.15 + R() * 0.2})`; g.lineWidth = 1 + R() * 2;
          const yy = y + R() * 110; g.beginPath(); g.moveTo(0, yy); for (let x = 0; x <= W; x += 60) g.lineTo(x, yy + Math.sin(x / 140 + j) * 4 + (R() - .5) * 2); g.stroke(); }
      }
      // harina espolvoreada
      for (let i = 0; i < 2600; i++) { const a = R() * 6.28, d = Math.pow(R(), 0.7) * 520; g.fillStyle = `rgba(245,238,222,${R() * 0.35})`;
        g.beginPath(); g.arc(540 + Math.cos(a) * d * 1.1, 960 + Math.sin(a) * d * 0.9, 1 + R() * 4, 0, 7); g.fill(); }
      // cuencos: agua, sal, masa madre
      const cuenco = (x, y, r, dentro) => { g.fillStyle = 'rgba(0,0,0,0.35)'; elipse(g, x + 12, y + 16, r, r); g.fill();
        g.fillStyle = radial(g, x - r * .3, y - r * .3, 0, r, [[0, '#a8683e'], [1, '#5a3018']]); elipse(g, x, y, r, r); g.fill();
        g.fillStyle = dentro; elipse(g, x, y, r * 0.78, r * 0.78); g.fill(); };
      cuenco(190, 520, 120, radial(g, 170, 500, 0, 100, [[0, '#7fa0b8'], [1, '#2c4658']]));
      cuenco(890, 480, 95, '#efeae0');
      for (let i = 0; i < 300; i++) { g.fillStyle = `rgba(255,255,255,${R()})`; g.fillRect(890 + (R() - .5) * 140, 480 + (R() - .5) * 140, 3, 3); }
      cuenco(900, 1420, 115, radial(g, 880, 1400, 0, 100, [[0, '#e8d6b0'], [1, '#b89c6c']]));
      // cuchillo
      g.save(); g.translate(180, 1470); g.rotate(-0.5); g.fillStyle = '#4a2c18'; g.fillRect(-110, -14, 120, 28); g.fillStyle = '#9aa0a3'; g.beginPath(); g.moveTo(10, -16); g.lineTo(190, -4); g.lineTo(10, 16); g.fill(); g.restore();
    });
  },
  mano(ctx, x, y, ang, s, lado) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s * lado, s);
    // antebrazo hacia abajo de la pantalla
    ctx.fillStyle = grad(ctx, -60, 0, 60, 0, [[0, PIEL_OSC], [0.5, PIEL], [1, PIEL_OSC]]);
    ctx.beginPath(); ctx.moveTo(-60, 60); ctx.lineTo(-75, 700); ctx.lineTo(75, 700); ctx.lineTo(60, 60); ctx.fill();
    ctx.fillStyle = PIEL; ctx.beginPath(); ctx.roundRect(-72, -70, 144, 150, 50); ctx.fill();
    [-50, -17, 17, 50].forEach((fx, i) => { ctx.beginPath(); ctx.roundRect(fx - 15, -170 + Math.abs(i - 1.5) * 18, 30, 120, 15); ctx.fill(); });
    ctx.beginPath(); ctx.ellipse(-92, 0, 22, 62, -0.6, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; [-33, 0, 33].forEach(fx => ctx.fillRect(fx - 1, -150, 2, 90));
    ctx.fillStyle = 'rgba(250,245,235,0.45)'; const R = rnd(3); for (let i = 0; i < 70; i++) { ctx.beginPath(); ctx.arc((R() - .5) * 140, -160 + R() * 420, 1 + R() * 4, 0, 7); ctx.fill(); }
    ctx.restore();
  },
  dibujar(ctx, u, dur, t, e) {
    const lineas = TL.lineas.filter(l => l.escena === 'masa');
    const tSello = lineas[2].ini - e.ini, tCorte = lineas[1].ini - e.ini;
    const z = 1.0 + u * 0.012;
    ctx.save(); camara(ctx, z, 540, 960);
    ctx.drawImage(this.mesa, 0, 0);
    // luz cálida de lucerna desde arriba-izquierda
    ctx.fillStyle = radial(ctx, 380, 700, 100, 1300, [[0, 'rgba(255,170,80,0.18)'], [1, 'rgba(0,0,0,0.55)']]); ctx.fillRect(0, 0, W, H);
    const cx = 540, cy = 960;
    // fase 1: amasar (masa deformándose)
    const amasado = u < tCorte - 0.3;
    const k = Math.sin(u * 5.2);
    const redondo = smooth(rango(u, tCorte - 0.6, tCorte + 0.2));
    const rx = lerp(250 + k * 40, 230, redondo), ry = lerp(200 - k * 30, 230, redondo);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; elipse(ctx, cx + 18, cy + 24, rx, ry); ctx.fill();
    if (redondo < 1) {
      ctx.globalAlpha = 1 - redondo;
      ctx.fillStyle = radial(ctx, cx - 60, cy - 70, 20, 300, [[0, '#f6ead2'], [1, '#d9c39a']]);
      ctx.beginPath(); for (let i = 0; i <= 40; i++) { const a = i / 40 * 6.283, rr = 1 + 0.06 * Math.sin(a * 3 + u * 4); ctx.lineTo(cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr); } ctx.fill();
      ctx.strokeStyle = 'rgba(160,130,90,0.4)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx + 30, cy - 10, 90, 0.5 + u, 2.5 + u); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (redondo > 0) {
      const cortes = 8 * smooth(rango(u, tCorte + 0.4, tSello - 0.6));
      const golpe = rango(u, tSello + 0.5, tSello + 0.75);
      ctx.globalAlpha = redondo;
      pan(ctx, cx, cy, 230, { cortes, sello: u > tSello + 0.62 ? 1 : 0, tostado: 0.02, aplast: 1 - 0.04 * Math.sin(Math.PI * golpe) });
      ctx.globalAlpha = 1;
    }
    // manos
    if (amasado || u < tCorte + 0.2) {
      const p = u * 5.2;
      this.mano(ctx, cx - 120 + Math.sin(p) * 30, cy + 40 + Math.cos(p) * 40, -0.25 + Math.sin(p) * 0.1, 1.05, 1);
      this.mano(ctx, cx + 120 - Math.sin(p + 1) * 30, cy + 60 + Math.cos(p + 1) * 40, 0.25 - Math.sin(p) * 0.1, 1.05, -1);
    } else if (u < tSello) {
      // cuchillo marcando las porciones
      const ck = (u - tCorte - 0.4) / (tSello - 0.6 - tCorte - 0.4) * 4, i = Math.min(3, Math.floor(Math.max(0, ck))), f = clamp(ck - i);
      const a = i * Math.PI / 4 + 0.2;
      const hx = cx + lerp(-Math.cos(a), Math.cos(a), f) * 195, hy = cy + lerp(-Math.sin(a), Math.sin(a), f) * 195;
      ctx.save(); ctx.translate(hx, hy); ctx.rotate(a + Math.PI / 2 + 0.2);
      ctx.fillStyle = '#b9bec0'; ctx.beginPath(); ctx.moveTo(-8, 0); ctx.lineTo(0, -10); ctx.lineTo(10, 160); ctx.lineTo(-10, 160); ctx.fill();
      ctx.restore();
      this.mano(ctx, hx + 70, hy + 230, 0.1, 0.95, -1);
    } else {
      // sello de bronce bajando y subiendo
      const bajada = easeInOut(rango(u, tSello, tSello + 0.6)), subida = easeInOut(rango(u, tSello + 0.9, tSello + 1.6));
      const alt = (1 - bajada) * 420 + subida * 520;
      ctx.fillStyle = `rgba(0,0,0,${0.35 * (1 - alt / 600)})`; elipse(ctx, cx + 20 + alt * 0.1, cy + 20 + alt * 0.1, 80, 80); ctx.fill();
      ctx.save(); ctx.translate(cx, cy - alt * 0.15); const sc = 1 + alt / 900; ctx.scale(sc, sc);
      ctx.fillStyle = radial(ctx, -20, -20, 5, 95, [[0, '#e0b46a'], [1, '#7b5320']]); elipse(ctx, 0, 0, 78, 78); ctx.fill();
      ctx.fillStyle = radial(ctx, -10, -10, 5, 50, [[0, '#caa058'], [1, '#6e4a1c']]); elipse(ctx, 0, 0, 42, 42); ctx.fill();
      ctx.restore();
      this.mano(ctx, cx + 30, cy + 60 - alt * 0.15 + 130, 0.05, 0.95 * (1 + alt / 900), -1);
      // nube de harina al golpear
      const g = rango(u, tSello + 0.55, tSello + 1.4);
      if (g > 0 && g < 1) particulas(ctx, 50, 8, t, (c, i, r) => { const a = r() * 6.28, d = 120 + g * (150 + r() * 250);
        c.fillStyle = `rgba(250,244,230,${0.6 * (1 - g)})`; c.beginPath(); c.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3 + r() * 9, 0, 7); c.fill(); });
    }
    // etiquetas de ingredientes
    const l0 = lineas[0];
    [['AGUA', 'agua:', 190, 700], ['SAL', 'sal', 890, 640], ['MASA MADRE', 'masa', 900, 1600]].forEach(([txt, pal, x, y]) => {
      const w = l0.palabras.find(p => p.p.toLowerCase().startsWith(pal.replace(':', '')) && p.ini > l0.ini + 1);
      if (!w) return;
      const a = smooth(rango(t, w.ini - 0.1, w.ini + 0.25)) * (1 - smooth(rango(u, tCorte - 0.2, tCorte + 0.3)));
      if (a <= 0) return;
      ctx.save(); ctx.globalAlpha = a; ctx.font = '800 44px Montserrat'; ctx.textAlign = 'center';
      const m = ctx.measureText(txt).width + 50; ctx.fillStyle = 'rgba(20,12,6,0.78)'; ctx.beginPath(); ctx.roundRect(x - m / 2, y - 40 - (1 - a) * 20, m, 64, 32); ctx.fill();
      ctx.fillStyle = '#ffd88a'; ctx.fillText(txt, x, y + 6 - (1 - a) * 20); ctx.restore();
    });
    ctx.restore();
  }
};

// ===================================================================
// 5. HORNO — horno de leña abovedado, la pala entra y sale
// ===================================================================
ESCENAS.horno = {
  init() {
    this.fachada = cacheado('horno_fachada', W, H, (g) => {
      g.fillStyle = '#1d120d'; g.fillRect(0, 0, W, H);
      // ladrillos
      const R = rnd(6);
      for (let y = 300; y < 1500; y += 46) for (let x = -((y / 46) % 2) * 50; x < W; x += 100) {
        const c = 60 + R() * 40; g.fillStyle = `rgb(${c + 40},${c * 0.55},${c * 0.38})`; g.fillRect(x + 3, y + 3, 94, 40);
      }
      g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 300, W, 1200);
      // bóveda del horno
      g.save(); g.beginPath(); g.ellipse(540, 1040, 500, 420, 0, Math.PI, 0); g.lineTo(1040, 1500); g.lineTo(40, 1500); g.closePath(); g.clip();
      g.fillStyle = '#4a2a1c'; g.fillRect(0, 500, W, 1000);
      for (let i = 0; i < 9; i++) { g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 6; g.beginPath(); g.ellipse(540, 1040, 500 - i * 8, 420 - i * 50, 0, Math.PI, 0); g.stroke(); }
      g.restore();
      // boca del horno (dovelas)
      for (let i = 0; i <= 12; i++) { const a = Math.PI + i * Math.PI / 12;
        g.save(); g.translate(540 + Math.cos(a) * 250, 1180 + Math.sin(a) * 250); g.rotate(a + Math.PI / 2);
        g.fillStyle = i % 2 ? '#8a4f32' : '#7a432a'; g.fillRect(-36, -10, 72, 70); g.restore(); }
      // mostrador de piedra delante
      g.fillStyle = grad(g, 0, 1440, 0, 1560, [[0, '#8f8577'], [1, '#5d554b']]); g.fillRect(0, 1440, W, 120);
      g.fillStyle = '#2a211b'; g.fillRect(0, 1560, W, H);
      // leña apilada
      for (let i = 0; i < 14; i++) { const x = 60 + (i % 5) * 60, y = 1700 - Math.floor(i / 5) * 50; g.fillStyle = '#5a3a20'; elipse(g, x, y, 60, 24); g.fill(); g.fillStyle = '#b98a5a'; elipse(g, x - 52, y, 12, 22); g.fill(); }
    });
  },
  dibujar(ctx, u, dur, t) {
    const z = 1.0 + smooth(rango(u, 0, dur)) * 0.12;
    const sube = smooth(rango(u, dur - 3.5, dur));
    ctx.save(); camara(ctx, z, 540, 1150 - sube * 300, 0, sube * 260);
    ctx.drawImage(this.fachada, 0, 0);
    // interior del horno
    ctx.save(); ctx.beginPath(); ctx.ellipse(540, 1180, 230, 230, 0, Math.PI, 0); ctx.lineTo(770, 1440); ctx.lineTo(310, 1440); ctx.closePath(); ctx.clip();
    ctx.fillStyle = radial(ctx, 540, 1250, 20, 420, [[0, '#ffcf6a'], [0.35, '#f07a22'], [0.8, '#7a2a0c'], [1, '#2a0d05']]); ctx.fillRect(300, 900, 480, 560);
    // panes ya cociéndose al fondo
    for (let i = 0; i < 6; i++) pan(ctx, 400 + i * 58, 1300 + (i % 2) * 8, 30, { tostado: 0.55 + 0.05 * i, aplast: 0.42 });
    // llamas
    for (let i = 0; i < 7; i++) { const fx = 360 + i * 22, h = 160 + ruido1(t * 4 + i * 3) * 120;
      ctx.fillStyle = grad(ctx, 0, 1360 - h, 0, 1360, [[0, 'rgba(255,120,20,0)'], [0.4, 'rgba(255,140,30,0.85)'], [1, 'rgba(255,240,170,0.95)']]);
      ctx.beginPath(); ctx.moveTo(fx - 26, 1370); ctx.quadraticCurveTo(fx - 30 + Math.sin(t * 6 + i) * 14, 1360 - h * 0.5, fx + Math.sin(t * 5 + i) * 18, 1360 - h); ctx.quadraticCurveTo(fx + 30, 1360 - h * 0.4, fx + 26, 1370); ctx.fill(); }
    ctx.restore();
    brillo(ctx, 540, 1250, 650 + ruido1(t * 6) * 80, 'rgba(255,120,30,0.45)');
    // pala: entra con 3 panes y sale vacía (ciclo)
    const ciclo = (u % 3.2) / 3.2;
    const entra = ciclo < 0.5 ? easeInOut(ciclo / 0.5) : 1 - easeInOut((ciclo - 0.5) / 0.5);
    const conPanes = ciclo < 0.5;
    const tip = lerp(1700, 1290, entra);
    ctx.save();
    ctx.fillStyle = '#7a5532'; ctx.fillRect(522, tip + 60, 36, 900);
    ctx.fillStyle = grad(ctx, 400, 0, 680, 0, [[0, '#6a4528'], [0.5, '#9a7046'], [1, '#6a4528']]);
    ctx.beginPath(); ctx.moveTo(430, tip - 40); ctx.lineTo(650, tip - 40); ctx.lineTo(620, tip + 70); ctx.lineTo(460, tip + 70); ctx.closePath(); ctx.fill();
    if (conPanes) for (let i = 0; i < 3; i++) pan(ctx, 470 + i * 70, tip + 5, 33, { tostado: 0.05, aplast: 0.5, sello: 1 });
    ctx.restore();
    // brasas y chispas
    particulas(ctx, 45, 33, t, (g, i, r) => { const k = (t * (0.15 + r() * 0.25) + r()) % 1;
      const x = 380 + r() * 320 + Math.sin(k * 9 + i) * 30, y = 1300 - k * 900;
      g.fillStyle = `rgba(255,${150 + r() * 80},60,${(1 - k) * 0.9})`; g.beginPath(); g.arc(x, y, 2 + r() * 3, 0, 7); g.fill(); });
    // olor a pan: volutas doradas que suben
    if (sube > 0) humo(ctx, 540, 900, t, 14, 'rgba(255,210,140,A)', 1.4, -40);
    // brazos del panadero sujetando la pala (desde abajo)
    ctx.restore();
    // calor: luz cálida en pantalla
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,130,40,0.35)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
};

// ===================================================================
// 6. VENTA — calle de Pompeya al amanecer, mostrador lleno de panes
// ===================================================================
const VP = { x: 470, y: 830, f: 900, camH: 1.6, camX: 1.1 };
function P(X, Y, Z) { return [VP.x + (X - VP.camX) * VP.f / Z, VP.y + (VP.camH - Y) * VP.f / Z, VP.f / Z]; }
function poli(ctx, pts) { ctx.beginPath(); pts.forEach((p, i) => { const [x, y] = P(...p); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); }
ESCENAS.venta = {
  init() {
    this.esc = cacheado('venta_calle', W, H, (g) => {
      cielo(g, [[0, '#3b4a78'], [0.28, '#c07a6a'], [0.42, '#f2b070'], [0.5, '#ffd9a0'], [1, '#ffd9a0']]);
      brillo(g, 470, 720, 500, 'rgba(255,220,150,0.6)');
      vesubio(g, 470, 840, 520, 230, '#6b6a8a', '#8f7f8f');
      g.fillStyle = 'rgba(80,110,70,0.35)'; g.fillRect(0, 780, W, 60);
      // calzada de basalto (polígonos)
      g.fillStyle = '#3b3a3e'; poli(g, [[-1.6, 0, 1.4], [1.6, 0, 1.4], [1.6, 0, 80], [-1.6, 0, 80]]); g.fill();
      const R = rnd(14);
      for (let z = 1.5; z < 40; z += 0.55 * (1 + z / 20)) for (let x = -1.6; x < 1.6; x += 0.6 * (1 + z / 30)) {
        const d = 0.08 * (1 + z / 20), c = 50 + R() * 30;
        g.fillStyle = `rgb(${c},${c},${c + 6})`; g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = Math.max(0.5, 3 / z);
        poli(g, [[x + d * R(), 0, z + d], [x + 0.6 - d * R(), 0, z + d * R()], [x + 0.6 - d, 0, z + 0.55 - d * R()], [x + d * R(), 0, z + 0.55 - d]]); g.fill(); g.stroke();
      }
      // aceras elevadas
      const acera = (x0, x1) => { g.fillStyle = '#8a7e70'; poli(g, [[x0, 0.3, 1.2], [x1, 0.3, 1.2], [x1, 0.3, 80], [x0, 0.3, 80]]); g.fill();
        g.fillStyle = '#5a5048'; const xc = Math.abs(x0) < Math.abs(x1) ? x0 : x1; poli(g, [[xc, 0, 1.2], [xc, 0.3, 1.2], [xc, 0.3, 80], [xc, 0, 80]]); g.fill(); };
      acera(-3.2, -1.6); acera(1.6, 3.2);
      // piedras pasaderas
      [-0.9, 0, 0.9].forEach(x => { g.fillStyle = '#6f6a66'; poli(g, [[x - 0.3, 0.3, 9], [x + 0.3, 0.3, 9], [x + 0.3, 0.3, 9.9], [x - 0.3, 0.3, 9.9]]); g.fill();
        g.fillStyle = '#4a4542'; poli(g, [[x - 0.3, 0, 9], [x + 0.3, 0, 9], [x + 0.3, 0.3, 9], [x - 0.3, 0.3, 9]]); g.fill(); });
      // fachadas izquierda (rojo pompeyano y ocre)
      const cols = ['#a8452f', '#c98b3a', '#b9563a', '#d4a35a', '#9a3a2a'];
      for (let i = 0; i < 9; i++) { const z0 = 4 + i * 4.2, z1 = z0 + 4.2, h = 5 + R() * 3;
        g.fillStyle = cols[i % 5]; poli(g, [[-3.2, 0, z0], [-3.2, h, z0], [-3.2, h, z1], [-3.2, 0, z1]]); g.fill();
        g.fillStyle = 'rgba(60,10,5,0.55)'; poli(g, [[-3.2, 0, z0], [-3.2, 1.2, z0], [-3.2, 1.2, z1], [-3.2, 0, z1]]); g.fill();
        g.fillStyle = '#2a1812'; poli(g, [[-3.2, 0.3, z0 + 1.2], [-3.2, 2.6, z0 + 1.2], [-3.2, 2.6, z0 + 2.4], [-3.2, 0.3, z0 + 2.4]]); g.fill();
        g.fillStyle = '#8a3a22'; poli(g, [[-3.2, h, z0], [-2.6, h + 0.4, z0], [-2.6, h + 0.4, z1], [-3.2, h, z1]]); g.fill(); }
      // fachada derecha lejana
      for (let i = 0; i < 7; i++) { const z0 = 6 + i * 4.6, z1 = z0 + 4.6, h = 5 + R() * 2.5;
        g.fillStyle = cols[(i + 2) % 5]; poli(g, [[3.2, 0, z0], [3.2, h, z0], [3.2, h, z1], [3.2, 0, z1]]); g.fill();
        g.fillStyle = 'rgba(60,10,5,0.5)'; poli(g, [[3.2, 0, z0], [3.2, 1.2, z0], [3.2, 1.2, z1], [3.2, 0, z1]]); g.fill();
        g.fillStyle = '#2a1812'; poli(g, [[3.2, 0.3, z0 + 1.5], [3.2, 2.6, z0 + 1.5], [3.2, 2.6, z0 + 2.8], [3.2, 0.3, z0 + 2.8]]); g.fill(); }
      // tienda en primer plano a la derecha: interior oscuro
      g.fillStyle = '#c98b3a'; poli(g, [[2.3, 0, 1.0], [2.3, 4.5, 1.0], [2.3, 4.5, 6], [2.3, 0, 6]]); g.fill();
      g.fillStyle = '#2b1a12'; poli(g, [[2.3, 0.3, 1.6], [2.3, 3.2, 1.6], [2.3, 3.2, 5.6], [2.3, 0.3, 5.6]]); g.fill();
      // estantes con panes al fondo de la tienda
      g.fillStyle = '#4a2e1a'; poli(g, [[2.3, 2.1, 2], [2.3, 2.16, 2], [2.3, 2.16, 5.4], [2.3, 2.1, 5.4]]); g.fill();
      for (let z = 2.2; z < 5.3; z += 0.35) { const [x, y, s] = P(2.3, 2.27, z); pan(g, x, y, 0.11 * s, { tostado: 0.5 + R() * 0.2, aplast: 0.4 }); }
    });
  },
  dibujar(ctx, u, dur, t, e) {
    const z = 1.0 + smooth(rango(u, 0, dur)) * 0.08;
    ctx.save(); camara(ctx, z, 700, 1100);
    ctx.drawImage(this.esc, 0, 0);
    // transeúntes al fondo
    const gente = [
      { X: -0.8, z0: 26, v: -1.2, col: '#7a5a3a', s: 0 }, { X: 0.6, z0: 14, v: 0.9, col: '#5a6a7a', s: 2 },
      { X: -1.9, z0: 20, v: -0.7, col: '#8a3a2a', s: 4 }, { X: 1.2, z0: 30, v: -1.0, col: '#d8cbb0', s: 1 }];
    gente.map(p => ({ ...p, Z: p.z0 + p.v * u })).sort((a, b) => b.Z - a.Z).forEach(p => {
      const [x, y, s] = P(p.X, p.X < -1.6 || p.X > 1.6 ? 0.3 : 0, p.Z);
      figura(ctx, { x, y, s: s * 1.7 / 600, dir: p.v < 0 ? 1 : -1, fase: u * 7 + p.s, col: { tunica: p.col, sombra: mezcla(p.col, '#000000', 0.35) }, barba: p.s % 2 === 0 });
    });
    // panadero tras el mostrador entregando un pan a una clienta
    const llegada = easeInOut(rango(u, 0, 2.2)), entrega = smooth(rango(u, 2.4, 3.4)), marcha = easeInOut(rango(u, 4.0, 7.5));
    const [bx, by, bs] = P(2.55, 0.3, 3.3);
    const corte = P(2.55, 1.05, 3.3)[1];
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, corte); ctx.clip();
    figura(ctx, { x: bx, y: by, s: bs * 1.75 / 600, dir: -1, fase: null, bD: [lerp(0.3, 1.5, entrega) - (u > 3.6 ? smooth(rango(u, 3.6, 4.2)) * 1.2 : 0), 0.2], bT: [0.4, 0.6],
      col: { delantal: DELANTAL }, mano: (g, hx, hy) => { if (u > 2.4 && u < 3.55) pan(g, hx - 20, hy - 10, 46, { tostado: 0.5, aplast: 0.8, sello: 1 }); } });
    ctx.restore();
    // mostrador de obra con encimera de mármol y pilas de panes
    ctx.fillStyle = '#b8a48a'; poli(ctx, [[2.0, 0.3, 1.8], [2.0, 1.15, 1.8], [2.0, 1.15, 5.2], [2.0, 0.3, 5.2]]); ctx.fill();
    ctx.fillStyle = 'rgba(120,40,25,0.65)'; poli(ctx, [[2.0, 0.35, 1.8], [2.0, 0.8, 1.8], [2.0, 0.8, 5.2], [2.0, 0.35, 5.2]]); ctx.fill();
    ctx.fillStyle = '#e8e2d6'; poli(ctx, [[1.95, 1.15, 1.75], [2.4, 1.15, 1.75], [2.4, 1.15, 5.25], [1.95, 1.15, 5.25]]); ctx.fill();
    for (let zz = 2.0; zz < 5.1; zz += 0.42) { const [x, y, s] = P(2.18, 1.2, zz); for (let k = 0; k < 3; k++) pan(ctx, x + (k - 1) * 0.09 * s, y - k * 0.02 * s, 0.12 * s, { tostado: 0.45 + (k % 2) * 0.1, aplast: 0.5, sello: 1 }); const [x2, y2, s2] = P(2.18, 1.27, zz); pan(ctx, x2, y2, 0.11 * s2, { tostado: 0.5, aplast: 0.5 }); }
    // clienta: llega, recoge el pan y se marcha
    const cz = lerp(9, 2.6, llegada) + marcha * 6, cxX = lerp(0.5, 1.45, llegada) - marcha * 0.8;
    const [cx, cy, cs] = P(cxX, 0, cz);
    figura(ctx, { x: cx, y: cy, s: cs * 1.62 / 600, dir: marcha > 0 ? -1 : 1, fase: (llegada < 1 || marcha > 0) ? u * 7 : null, barba: false, bajo: 18,
      bD: marcha > 0 ? [0.9, 1.2] : [lerp(0.2, 1.3, entrega), 0.2],
      col: { tunica: '#6f8a8a', sombra: '#3f5656', manto: '#b4563a', pelo: '#2a1a12' },
      mano: (g, hx, hy) => { if (u > 3.4) pan(g, hx, hy - 10, 46, { tostado: 0.5, aplast: 0.8, sello: 1 }); } });
    // pájaros
    particulas(ctx, 5, 61, t, (g, i, r) => { const x = ((r() * W + t * (40 + r() * 30)) % (W + 200)) - 100, y = 300 + r() * 300, a = Math.sin(t * 9 + i) * 10;
      g.strokeStyle = 'rgba(40,30,40,0.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 14, y - a); g.quadraticCurveTo(x - 6, y - 4, x, y); g.quadraticCurveTo(x + 6, y - 4, x + 14, y - a); g.stroke(); });
    ctx.restore();
    // rayos de sol
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) { ctx.fillStyle = `rgba(255,200,120,${0.04 + 0.02 * Math.sin(t + i)})`; ctx.beginPath(); ctx.moveTo(470, 760); ctx.lineTo(-200 + i * 120, H); ctx.lineTo(-140 + i * 120 + 60, H); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    // infografía: +30 panaderías
    const l2 = TL.lineas.filter(l => l.escena === 'venta')[1];
    const a = smooth(rango(t, l2.ini, l2.ini + 0.4)) * (1 - smooth(rango(t, e.fin - 0.5, e.fin)));
    if (a > 0) {
      const n = Math.round(30 * easeOut(rango(t, l2.ini, l2.ini + 1.4)));
      ctx.save(); ctx.globalAlpha = a; ctx.translate(W / 2, 470); ctx.scale(0.9 + 0.1 * a, 0.9 + 0.1 * a);
      ctx.fillStyle = 'rgba(25,14,8,0.8)'; ctx.beginPath(); ctx.roundRect(-330, -150, 660, 300, 40); ctx.fill();
      ctx.strokeStyle = '#e7b45a'; ctx.lineWidth = 4; ctx.stroke();
      ctx.textAlign = 'center'; ctx.font = '900 150px Cinzel'; ctx.fillStyle = '#ffd88a'; ctx.fillText('+' + n, -70, 40);
      pan(ctx, 190, -10, 80, { tostado: 0.45, sello: 1 });
      ctx.font = '800 46px Montserrat'; ctx.fillStyle = '#f3e3c3'; ctx.fillText('PANADERÍAS', 0, 115);
      ctx.restore();
    }
  }
};

// ===================================================================
// 7. TARDE — contar las monedas del día; cae la noche
// ===================================================================
ESCENAS.tarde = {
  dibujar(ctx, u, dur, t) {
    const noche = smooth(rango(u, dur * 0.55, dur));
    ctx.drawImage(cache['masa_mesa'], 0, 0);
    ctx.fillStyle = `rgba(0,0,0,${0.25 + 0.35 * noche})`; ctx.fillRect(0, 0, W, H);
    // rayo de sol por la ventana (se apaga)
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - noche;
    ctx.fillStyle = grad(ctx, 0, 0, W, H, [[0, 'rgba(255,170,80,0.35)'], [1, 'rgba(255,120,40,0)']]);
    ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(500, 0); ctx.lineTo(W, 1100); ctx.lineTo(W, 1700); ctx.closePath(); ctx.fill(); ctx.restore();
    // monedas cayendo en pilas
    const R = rnd(42), pilas = [[360, 1050], [540, 1090], [720, 1040], [450, 880], [640, 870]];
    const total = 26, caidas = Math.floor(clamp(u / (dur * 0.6)) * total);
    for (let i = 0; i < total; i++) {
      const p = pilas[i % 5], nivel = Math.floor(i / 5), plata = R() < 0.25;
      const k = clamp((u - i * dur * 0.6 / total) / 0.25);
      if (i > caidas) continue;
      const y = p[1] - nivel * 14 - (1 - easeOut(k)) * 300;
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; elipse(ctx, p[0] + 8, p[1] + 10, 70, 30); ctx.fill();
      ctx.fillStyle = plata ? '#8e8f92' : '#7a4e22'; elipse(ctx, p[0], y + 8, 66, 28); ctx.fill();
      ctx.fillStyle = plata ? radial(ctx, p[0] - 20, y - 8, 4, 70, [[0, '#f2f2f2'], [1, '#9a9b9e']]) : radial(ctx, p[0] - 20, y - 8, 4, 70, [[0, '#f0b86a'], [1, '#9a5f26']]);
      elipse(ctx, p[0], y, 66, 28); ctx.fill();
      if (i === Math.min(caidas, total - 1) || nivel === Math.floor((total - 1) / 5)) { // perfil grabado
        ctx.fillStyle = 'rgba(0,0,0,0.25)'; elipse(ctx, p[0], y, 22, 12); ctx.fill(); }
    }
    // lucerna que se enciende al anochecer
    lucerna(ctx, 860, 1380, 1.0, t, smooth(rango(u, dur * 0.6, dur * 0.75)));
    luzLucerna(ctx, 980, 1365, 800, t, noche);
    // mano empujando monedas
    ESCENAS.masa.mano(ctx, 300 + Math.sin(u * 2) * 40, 1350, -0.4, 0.95, 1);
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = `rgba(60,80,170,${0.45 * noche})`; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
};

// ===================================================================
// 8. VESUBIO — el monte está a punto de despertar
// ===================================================================
ESCENAS.vesubio = {
  init() {
    this.fondo = cacheado('vesubio_fondo', W, H, (g) => {
      cielo(g, [[0, '#0c0a1e'], [0.4, '#2b1838'], [0.62, '#7a2e2a'], [0.72, '#b8502c'], [1, '#2a0f0c']]);
      vesubio(g, 540, 1330, 1000, 760, '#2c1c22', '#140c10', 'rgba(255,120,70,0.25)');
      g.fillStyle = grad(g, 0, 1250, 0, 1500, [[0, '#140c10'], [1, '#0a0608']]); g.fillRect(0, 1300, W, H);
    });
    this.city = cacheado('vesubio_ciudad', W, H, (g) => { ciudad(g, 1450, 8, '#120a0c', '#0a0608', null); g.fillStyle = '#060405'; g.fillRect(0, 1440, W, H); });
  },
  dibujar(ctx, u, dur, t) {
    const k = rango(u, 0, dur);
    const z = 1.0 + easeInOut(k) * 0.35;
    const sh = Math.pow(k, 2.5) * 14;
    ctx.save(); camara(ctx, z, 540, 640, (ruido1(t * 30) - 0.5) * sh, (ruido1(t * 27, 4) - 0.5) * sh);
    ctx.drawImage(this.fondo, 0, 0);
    estrellas(ctx, t, 90, 500);
    // resplandor en la cima y primera columna de humo
    const g = smooth(rango(u, dur * 0.45, dur));
    brillo(ctx, 540, 590, 260, 'rgba(255,90,30,0.55)', g);
    particulas(ctx, 26, 91, t, (c, i, r) => { const kk = (r() * 0.6 + g * 0.8) % 1, rad = 30 + kk * 160 * g;
      const px = 540 + (r() - 0.5) * 120 * kk, py = 580 - kk * 520 * g, al = 0.5 * g * (1 - kk * 0.6);
      c.fillStyle = radial(c, px, py, 0, rad, [[0, `rgba(70,52,56,${al})`], [0.6, `rgba(60,45,50,${al * 0.7})`], [1, 'rgba(60,45,50,0)']]); c.fillRect(px - rad, py - rad, rad * 2, rad * 2); });
    ctx.drawImage(this.city, 0, 0);
    ctx.restore();
    ctx.fillStyle = `rgba(120,20,10,${0.15 * g})`; ctx.fillRect(0, 0, W, H);
  }
};

// ===================================================================
// 9. HALLAZGO — hoy: panes carbonizados dentro del horno
// ===================================================================
ESCENAS.hallazgo = {
  dibujar(ctx, u, dur, t) {
    const atras = easeInOut(rango(u, 2.5, dur - 0.5));
    const z = lerp(2.3, 1.0, atras);
    ctx.save(); camara(ctx, z, 540, 1150);
    ctx.fillStyle = '#121112'; ctx.fillRect(0, 0, W, H);
    // horno en ruinas, gris de ceniza
    const R = rnd(66);
    for (let y = 600; y < 1700; y += 46) for (let x = -((y / 46) % 2) * 50; x < W; x += 100) { if (R() < 0.12) continue; const c = 55 + R() * 30; ctx.fillStyle = `rgb(${c},${c * 0.95},${c * 0.9})`; ctx.fillRect(x + 3, y + 3, 94, 40); }
    ctx.fillStyle = '#0b0a0b'; ctx.beginPath(); ctx.ellipse(540, 1250, 330, 330, 0, Math.PI, 0); ctx.lineTo(870, 1520); ctx.lineTo(210, 1520); ctx.closePath(); ctx.fill();
    for (let i = 0; i <= 12; i++) { const a = Math.PI + i * Math.PI / 12; ctx.save(); ctx.translate(540 + Math.cos(a) * 345, 1250 + Math.sin(a) * 345); ctx.rotate(a + Math.PI / 2); ctx.fillStyle = i % 2 ? '#6e6a66' : '#5f5b58'; ctx.fillRect(-48, -12, 96, 80); ctx.restore(); }
    ctx.fillStyle = '#2c2a29'; ctx.fillRect(210, 1440, 660, 80);
    // panes carbonizados
    [[330, 1400, 52], [450, 1410, 56], [570, 1405, 54], [690, 1400, 50], [400, 1340, 44], [520, 1335, 46], [640, 1338, 44]].forEach(([x, y, r]) => pan(ctx, x, y, r, { carbon: 0.7, aplast: 0.55, cortes: 8 }));
    pan(ctx, 540, 1150, 150, { carbon: 0.55, cortes: 8, aplast: 1 - atras * 0.5 });
    ctx.restore();
    // foco de luz y polvo en suspensión
    ctx.fillStyle = radial(ctx, 540, 1150, 80, 900, [[0, 'rgba(255,240,210,0.12)'], [1, 'rgba(0,0,0,0.7)']]); ctx.fillRect(0, 0, W, H);
    particulas(ctx, 60, 5, t, (g, i, r) => { const x = (r() * W + Math.sin(t * 0.3 + i) * 40), y = (r() * H - t * (8 + r() * 12)) % H;
      g.fillStyle = `rgba(230,225,210,${0.15 + r() * 0.3})`; g.beginPath(); g.arc(x, y < 0 ? y + H : y, 1 + r() * 2.5, 0, 7); g.fill(); });
  }
};

// ===================================================================
// 10. FINAL — tarjeta de cierre
// ===================================================================
ESCENAS.final = {
  dibujar(ctx, u, dur, t) {
    ctx.fillStyle = radial(ctx, W / 2, 900, 50, 1200, [[0, '#2a1410'], [1, '#070404']]); ctx.fillRect(0, 0, W, H);
    particulas(ctx, 50, 15, t, (g, i, r) => { const k = (t * (0.05 + r() * 0.08) + r()) % 1;
      g.fillStyle = `rgba(255,${120 + r() * 80},50,${(1 - k) * 0.7})`; g.beginPath(); g.arc(r() * W + Math.sin(k * 8 + i) * 30, H - k * H, 1.5 + r() * 2.5, 0, 7); g.fill(); });
    const a = smooth(rango(u, 0.2, 1.0));
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    pan(ctx, W / 2, 560, 120, { tostado: 0.5, sello: 1 });
    ctx.font = '700 50px Cinzel'; ctx.letterSpacing = '14px'; ctx.fillStyle = '#e9d6b0'; ctx.fillText('UN DÍA SIENDO', W / 2 + 7, 800);
    ctx.font = '900 96px Cinzel'; ctx.letterSpacing = '3px'; ctx.fillStyle = grad(ctx, 0, 820, 0, 920, [[0, '#ffe6a6'], [1, '#b47a30']]); ctx.fillText('PANADERO', W / 2, 910);
    ctx.font = '700 44px Cinzel'; ctx.letterSpacing = '6px'; ctx.fillStyle = '#c9a66b'; ctx.fillText('POMPEYA · 79 d. C.', W / 2, 985);
    const b = smooth(rango(u, 1.4, 2.2));
    ctx.globalAlpha = b; ctx.letterSpacing = '0px';
    ctx.font = '800 40px Montserrat'; ctx.fillStyle = '#f3e3c3'; ctx.fillText('PRÓXIMO EPISODIO', W / 2, 1180);
    ctx.font = '900 76px Cinzel'; ctx.fillStyle = '#ff9a5a'; ctx.fillText('GLADIADOR', W / 2, 1275);
    ctx.restore();
  }
};
