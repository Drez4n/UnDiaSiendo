// ===== Motor "Un día siendo…" — utilidades comunes de dibujo y composición =====
const W = 1080, H = 1920;
const C = document.getElementById('c');
const X = C.getContext('2d');
const ESCENAS = {};          // id -> {init?, dibujar(ctx, u, dur, t, e)}
const TRANSICION = {};       // id -> 'negro' | 'corte' | segundos de fundido
const RELOJ = {};            // id -> texto del chip de hora
let TL = null;

// ---------- matemáticas ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = k => { k = clamp(k); return k * k * (3 - 2 * k); };
const easeOut = k => 1 - Math.pow(1 - clamp(k), 3);
const easeInOut = k => { k = clamp(k); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
const rango = (t, a, b) => clamp((t - a) / (b - a));
function rnd(seed) { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1e6) / 1e6; }; }
function ruido1(x, seed = 0) { // ruido suave 1D
  const i = Math.floor(x), f = x - i;
  const h = n => { const v = Math.sin((n + seed * 131.7) * 127.1) * 43758.5453; return v - Math.floor(v); };
  return lerp(h(i), h(i + 1), f * f * (3 - 2 * f));
}

// ---------- lienzos auxiliares ----------
function lienzo(w = W, h = H) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const cache = {};
function cacheado(nombre, w, h, fn) {
  if (!cache[nombre]) { const c = lienzo(w, h); fn(c.getContext('2d'), w, h); cache[nombre] = c; }
  return cache[nombre];
}

// ---------- dibujo ----------
function grad(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([o, c]) => g.addColorStop(o, c)); return g;
}
function radial(ctx, x, y, r0, r1, stops) {
  const g = ctx.createRadialGradient(x, y, r0, x, y, r1);
  stops.forEach(([o, c]) => g.addColorStop(o, c)); return g;
}
function brillo(ctx, x, y, r, color, alpha = 1) {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = alpha;
  ctx.fillStyle = radial(ctx, x, y, 0, r, [[0, color], [1, 'rgba(0,0,0,0)']]);
  ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
}
function camara(ctx, zoom, fx = W / 2, fy = H / 2, dx = 0, dy = 0) {
  ctx.translate(fx + dx, fy + dy); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy);
}
function elipse(ctx, x, y, rx, ry, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2); }
function capsula(ctx, x1, y1, x2, y2, r) {
  ctx.save(); ctx.lineCap = 'round'; ctx.lineWidth = r * 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore();
}

// ---------- partículas deterministas ----------
function particulas(ctx, n, seed, t, fn) { const r = rnd(seed); for (let i = 0; i < n; i++) fn(ctx, i, r, t); }

// ---------- capas finales ----------
const GRANO = (() => {
  const c = lienzo(512, 512), g = c.getContext('2d'), d = g.createImageData(512, 512), r = rnd(7);
  for (let i = 0; i < d.data.length; i += 4) { const v = r() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
  g.putImageData(d, 0, 0); return c;
})();
function postproceso(ctx, t) {
  // viñeta
  ctx.save();
  ctx.fillStyle = radial(ctx, W / 2, H * 0.47, H * 0.28, H * 0.78, [[0, 'rgba(0,0,0,0)'], [1, 'rgba(0,0,0,0.62)']]);
  ctx.fillRect(0, 0, W, H);
  // grano de película
  ctx.globalAlpha = 0.055; ctx.globalCompositeOperation = 'overlay';
  const f = Math.floor(t * 24), ox = (f * 197) % 512, oy = (f * 331) % 512;
  ctx.fillStyle = ctx.createPattern(GRANO, 'repeat');
  ctx.translate(-ox, -oy); ctx.fillRect(0, 0, W + 512, H + 512);
  ctx.restore();
}

// ---------- chip de hora ----------
function chip(ctx, texto, a) {
  if (!texto || a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = '800 40px Montserrat'; const w = ctx.measureText(texto).width + 70;
  const x = 60, y = 190 - (1 - a) * 20;
  ctx.fillStyle = 'rgba(12,8,6,0.62)'; ctx.beginPath(); ctx.roundRect(x, y, w, 76, 38); ctx.fill();
  ctx.strokeStyle = 'rgba(233,190,110,0.85)'; ctx.lineWidth = 3; ctx.stroke();
  ctx.fillStyle = '#F3D9A4'; ctx.textBaseline = 'middle'; ctx.fillText(texto, x + 35, y + 40);
  ctx.restore();
}

// ---------- subtítulos estilo shorts ----------
function trozos(palabras) {
  const out = []; let cur = [];
  palabras.forEach((w, i) => {
    cur.push(w);
    const fin = /[.,:;…!?]$/.test(w.p);
    if (cur.length >= 4 || (fin && cur.length >= 2) || i === palabras.length - 1) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
}
function subtitulos(ctx, t) {
  for (const ln of TL.lineas) {
    if (!ln.palabras.length || t < ln.ini - 0.05 || t > ln.fin + 0.25) continue;
    const grupos = trozos(ln.palabras);
    let g = grupos.find(g => t >= g[0].ini - 0.05 && t <= g[g.length - 1].fin + 0.05) ||
            grupos.filter(g => g[0].ini <= t).pop();
    if (!g) return;
    ctx.save();
    ctx.font = '900 80px Montserrat'; ctx.textBaseline = 'alphabetic'; ctx.lineJoin = 'round';
    const esp = 22, palabras = g.map(w => ({ ...w, txt: w.p.toUpperCase() }));
    // reparto en líneas de máx 900 px
    const lineas = [[]]; let ancho = 0;
    palabras.forEach(w => { const m = ctx.measureText(w.txt).width;
      if (ancho + m > 900 && lineas[lineas.length - 1].length) { lineas.push([]); ancho = 0; }
      w.m = m; lineas[lineas.length - 1].push(w); ancho += m + esp; });
    const y0 = 1430 - (lineas.length - 1) * 50;
    const aparicion = easeOut(rango(t, g[0].ini - 0.05, g[0].ini + 0.12));
    lineas.forEach((l, li) => {
      const tot = l.reduce((s, w) => s + w.m, 0) + esp * (l.length - 1);
      let x = W / 2 - tot / 2; const y = y0 + li * 100;
      l.forEach(w => {
        const activa = t >= w.ini && t < w.fin + 0.08;
        const pop = activa ? 1 + 0.08 * Math.sin(Math.PI * clamp((t - w.ini) / 0.18)) : 1;
        ctx.save(); ctx.translate(x + w.m / 2, y - 28); ctx.scale(pop * (0.85 + 0.15 * aparicion), pop * (0.85 + 0.15 * aparicion));
        ctx.globalAlpha = aparicion;
        ctx.lineWidth = 16; ctx.strokeStyle = 'rgba(0,0,0,0.92)'; ctx.strokeText(w.txt, -w.m / 2, 28);
        ctx.fillStyle = activa ? '#FFC93C' : (t >= w.fin ? '#FFFFFF' : 'rgba(255,255,255,0.92)');
        ctx.fillText(w.txt, -w.m / 2, 28);
        ctx.restore();
        x += w.m + esp;
      });
    });
    ctx.restore();
    return;
  }
}

// ---------- composición de un fotograma ----------
const bufA = lienzo(), bufB = lienzo();
function pintarEscena(buf, e, t) {
  const ctx = buf.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  const sc = ESCENAS[e.id];
  ctx.save(); if (sc) sc.dibujar(ctx, t - e.ini, e.fin - e.ini, t, e); ctx.restore();
}
function dibujar(t) {
  const es = TL.escenas;
  let i = es.findIndex(e => t >= e.ini && t < e.fin); if (i < 0) i = es.length - 1;
  const e = es[i];
  X.setTransform(1, 0, 0, 1, 0, 0); X.globalAlpha = 1;
  pintarEscena(bufA, e, t);
  X.drawImage(bufA, 0, 0);
  // fundido con la escena anterior
  const prev = es[i - 1];
  const tr = TRANSICION[e.id] ?? 0.6;
  if (prev && typeof tr === 'number' && t - e.ini < tr) {
    pintarEscena(bufB, prev, t);
    X.globalAlpha = 1 - smooth((t - e.ini) / tr); X.drawImage(bufB, 0, 0); X.globalAlpha = 1;
  }
  if (tr === 'negro') { // sale a negro y entra desde negro
    const k = 1 - smooth((t - e.ini) / 0.5); X.fillStyle = `rgba(0,0,0,${k})`; X.fillRect(0, 0, W, H);
  }
  const next = es[i + 1];
  if (next && TRANSICION[next.id] === 'negro') {
    const k = smooth((t - (e.fin - 0.35)) / 0.35); X.fillStyle = `rgba(0,0,0,${k})`; X.fillRect(0, 0, W, H);
  }
  postproceso(X, t);
  // chip de hora
  const txt = RELOJ[e.id];
  if (txt) chip(X, txt, smooth(rango(t, e.ini + 0.2, e.ini + 0.7)) * (1 - smooth(rango(t, e.fin - 0.4, e.fin))));
  subtitulos(X, t);
}

async function preparar(timeline) {
  TL = timeline;
  await document.fonts.load('900 80px Montserrat'); await document.fonts.load('900 80px Cinzel'); await document.fonts.load('700 80px Cinzel');
  await document.fonts.ready;
  for (const id in ESCENAS) if (ESCENAS[id].init) ESCENAS[id].init();
}
window.renderFrame = (t, q = 0.93) => { dibujar(t); return C.toDataURL('image/jpeg', q); };
window.preparar = preparar;
