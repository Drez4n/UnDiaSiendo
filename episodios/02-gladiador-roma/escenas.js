// ===== Episodio 02 — Un día siendo gladiador en Roma (90 d. C.) =====
RELOJ.celda = '06:00 · Amanecer en el ludus';
RELOJ.entreno = '07:00 · Entrenamiento';
RELOJ.comida = '11:00 · La comida';
RELOJ.cena = 'La noche anterior';
RELOJ.juegos = 'Día de juegos';
RELOJ.tunel = '16:00 · El túnel';
RELOJ.arena = '16:30 · La arena';
TRANSICION.tunel = 'negro';
TRANSICION.final = 0.8;

const BRONCE = ['#f2c66d', '#b07a2a', '#5e3c12'];
const ESCUDO = '#9a2a1e';

// ---------- gladiadores ----------
function casco(ctx) { // casco de mirmillón (vista lateral, mirando a la derecha)
  ctx.fillStyle = grad(ctx, -50, 0, 70, 0, [[0, BRONCE[2]], [0.45, BRONCE[0]], [1, BRONCE[1]]]);
  elipse(ctx, 6, -545, 60, 62); ctx.fill();
  ctx.beginPath(); ctx.ellipse(10, -500, 82, 14, 0, 0, Math.PI * 2); ctx.fill();          // ala ancha
  ctx.fillStyle = '#3a2610'; ctx.beginPath(); ctx.roundRect(22, -568, 40, 58, 8); ctx.fill(); // visera
  ctx.strokeStyle = BRONCE[0]; ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(26 + i * 11, -566); ctx.lineTo(26 + i * 11, -512); ctx.stroke(); }
  for (let j = 0; j < 4; j++) { ctx.beginPath(); ctx.moveTo(24, -556 + j * 13); ctx.lineTo(60, -556 + j * 13); ctx.stroke(); }
  // cresta en forma de aleta
  ctx.fillStyle = grad(ctx, 0, -650, 0, -590, [[0, '#d23a24'], [1, '#7a160c']]);
  ctx.beginPath(); ctx.moveTo(-52, -590); ctx.quadraticCurveTo(-30, -665, 40, -640); ctx.quadraticCurveTo(60, -630, 50, -598); ctx.closePath(); ctx.fill();
  ctx.fillStyle = BRONCE[1]; ctx.fillRect(-50, -600, 100, 10);
}
function cuerpoGladiador(o) { // opciones comunes de figura para torso desnudo
  return Object.assign({ bajo: 250, col: { tunica: PIEL, sombra: PIEL_OSC, cinto: '#6b4a2a', pelo: PELO } }, o);
}
function sobreCuerpo(ctx, o, extra) { // dibuja encima de una figura con la misma transformación
  const bob = o.fase == null ? 0 : Math.abs(Math.cos(o.fase)) * -8;
  ctx.save(); ctx.translate(o.x, o.y + bob * o.s); ctx.scale(o.s * o.dir, o.s); extra(ctx); ctx.restore();
}
function musculos(ctx) {
  ctx.strokeStyle = 'rgba(80,40,20,0.35)'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(0, -415); ctx.quadraticCurveTo(35, -400, 58, -415); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20, -380); ctx.lineTo(22, -320); ctx.stroke();
  [-365, -345].forEach(y => { ctx.beginPath(); ctx.moveTo(5, y); ctx.lineTo(45, y); ctx.stroke(); });
}
function taparrabos(ctx) {
  ctx.fillStyle = '#efe6d2'; ctx.beginPath(); ctx.moveTo(-64, -300); ctx.lineTo(68, -300); ctx.lineTo(54, -238); ctx.quadraticCurveTo(10, -222, -58, -240); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-20, -298, 6, 58);
  ctx.fillStyle = grad(ctx, 0, -320, 0, -286, [[0, BRONCE[0]], [1, BRONCE[2]]]); ctx.fillRect(-68, -322, 140, 34); // balteus
  ctx.fillStyle = '#5e3c12'; for (let i = 0; i < 6; i++) { elipse(ctx, -50 + i * 23, -305, 4, 4); ctx.fill(); }
}
function mirmillon(ctx, o) {
  const op = cuerpoGladiador(o);
  op.mano = (g, hx, hy) => { // gladius
    g.save(); g.translate(hx, hy); g.rotate((o.espada ?? -1.2));
    g.fillStyle = '#4a2c18'; g.fillRect(-8, -10, 16, 30); g.fillStyle = BRONCE[1]; g.fillRect(-18, -16, 36, 9);
    g.fillStyle = grad(g, -9, 0, 9, 0, [[0, '#8f979b'], [0.5, '#eef2f3'], [1, '#7c8488']]);
    g.beginPath(); g.moveTo(-9, -16); g.lineTo(-7, -125); g.lineTo(0, -140); g.lineTo(7, -125); g.lineTo(9, -16); g.fill(); g.restore();
  };
  figura(ctx, op);
  sobreCuerpo(ctx, op, (g) => {
    musculos(g); taparrabos(g);
    g.fillStyle = '#6e4a22'; g.fillRect(4, -215, 34, 140); // greba / protección pierna
    casco(g);
    // escudo (scutum) delante del cuerpo
    const sy = o.escudoY ?? 0;
    g.fillStyle = grad(g, 40, 0, 140, 0, [[0, '#5e140c'], [0.5, ESCUDO], [1, '#6e1a10']]);
    g.beginPath(); g.roundRect(48, -480 + sy, 84, 320, 18); g.fill();
    g.strokeStyle = BRONCE[0]; g.lineWidth = 7; g.stroke();
    g.fillStyle = grad(g, 70, -350 + sy, 110, -310 + sy, [[0, BRONCE[0]], [1, BRONCE[2]]]); elipse(g, 90, -320 + sy, 22, 30); g.fill();
  });
}
function reciario(ctx, o) {
  const op = cuerpoGladiador(Object.assign({ barba: true }, o));
  op.mano = (g, hx, hy) => { // tridente
    g.save(); g.translate(hx, hy); g.rotate(o.tridente ?? -1.25);
    g.fillStyle = '#6b4a2a'; g.fillRect(-6, -40, 12, 380);
    g.strokeStyle = '#c9cfd2'; g.lineWidth = 9; g.lineCap = 'round';
    g.beginPath(); g.moveTo(-26, -40); g.lineTo(26, -40); g.moveTo(0, -40); g.lineTo(0, -170); g.moveTo(-26, -40); g.lineTo(-26, -150); g.moveTo(26, -40); g.lineTo(26, -150); g.stroke();
    g.restore();
  };
  op.manoT = (g, hx, hy) => { // red
    g.strokeStyle = 'rgba(220,210,180,0.85)'; g.lineWidth = 2.5;
    for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(hx - 10 + i * 6, hy); g.quadraticCurveTo(hx - 40 + i * 10, hy + 120, hx - 30 + i * 14, hy + 230); g.stroke(); }
    for (let j = 1; j < 6; j++) { g.beginPath(); g.moveTo(hx - 15 - j * 3, hy + j * 40); g.lineTo(hx + 30 + j * 8, hy + j * 40); g.stroke(); }
  };
  figura(ctx, op);
  sobreCuerpo(ctx, op, (g) => {
    musculos(g); taparrabos(g);
    // galerus: placa de metal sobre el hombro izquierdo (lado trasero)
    g.fillStyle = grad(g, -40, -520, 10, -430, [[0, BRONCE[0]], [1, BRONCE[2]]]);
    g.beginPath(); g.moveTo(-40, -455); g.lineTo(-30, -530); g.lineTo(5, -520); g.lineTo(12, -445); g.closePath(); g.fill();
  });
}
function aprendiz(ctx, o) { // gladiador entrenando, con túnica y espada de madera
  const op = Object.assign({ col: { tunica: '#8d6b47', sombra: '#5e452c', cinto: '#3a2716' } }, o);
  op.mano = (g, hx, hy) => { g.save(); g.translate(hx, hy); g.rotate(o.espada ?? -1.2);
    g.fillStyle = '#b48a55'; g.fillRect(-10, -150, 20, 150); g.fillStyle = '#7a5530'; g.fillRect(-18, -12, 36, 10); g.fillRect(-8, -2, 16, 30); g.restore(); };
  return figura(ctx, op);
}

// ---------- Coliseo ----------
function coliseoFachada(g, cx, base, ancho, alto, luzA, luzB) {
  const niveles = [0.27, 0.27, 0.27, 0.19];
  // cuerpo curvo
  g.fillStyle = grad(g, cx - ancho / 2, 0, cx + ancho / 2, 0, [[0, luzB], [0.45, luzA], [1, luzB]]);
  g.beginPath(); g.moveTo(cx - ancho / 2, base); g.lineTo(cx - ancho / 2, base - alto * 0.94);
  g.quadraticCurveTo(cx, base - alto * 1.06, cx + ancho / 2, base - alto * 0.94); g.lineTo(cx + ancho / 2, base); g.closePath(); g.fill();
  let y0 = base;
  const n = 15;
  niveles.forEach((h, li) => {
    const hh = alto * h, top = y0 - hh;
    for (let i = 0; i < n; i++) {
      const a0 = -Math.PI / 2 + (i + 0.15) / n * Math.PI, a1 = -Math.PI / 2 + (i + 0.85) / n * Math.PI;
      const x0 = cx + Math.sin(a0) * ancho / 2, x1 = cx + Math.sin(a1) * ancho / 2;
      const curva = (alto * 0.06) * Math.cos((a0 + a1) / 2);
      if (li < 3) { // arco
        g.fillStyle = `rgba(30,20,25,${0.75 - 0.25 * Math.cos((a0 + a1) / 2)})`;
        g.beginPath(); g.moveTo(x0, y0 - hh * 0.12 - curva); g.lineTo(x0, top + hh * 0.42 - curva);
        g.quadraticCurveTo((x0 + x1) / 2, top + hh * 0.05 - curva, x1, top + hh * 0.42 - curva); g.lineTo(x1, y0 - hh * 0.12 - curva); g.closePath(); g.fill();
      } else { // ático con ventanas
        if (i % 2 === 0) { g.fillStyle = 'rgba(30,20,25,0.6)'; g.fillRect((x0 + x1) / 2 - 6, top + hh * 0.4 - curva, 12, hh * 0.25); }
      }
    }
    g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(cx - ancho / 2, top - 6 - alto * 0.05, ancho, 8); // cornisa
    y0 = top;
  });
}
function gradas(g, w, h, seed, densidad = 1) { // textura de público
  const R = rnd(seed), cols = ['#d8cbb0', '#a8452f', '#e6dcc6', '#6f8a8a', '#c98b3a', '#f0eadc', '#7a5a3a', '#4f6b8a'];
  for (let i = 0; i < w * h / 70 * densidad; i++) { g.fillStyle = cols[Math.floor(R() * cols.length)]; const x = R() * w, y = R() * h; g.fillRect(x, y, 5, 6); g.fillStyle = 'rgba(60,40,30,0.8)'; g.fillRect(x + 1, y - 3, 3, 3); }
}

// ===================================================================
// 1. TÍTULO — el Coliseo al amanecer
// ===================================================================
ESCENAS.titulo = {
  init() {
    this.fondo = cacheado('g_titulo', W, H, (g) => {
      cielo(g, [[0, '#1b2147'], [0.35, '#5a3a5e'], [0.55, '#c86a4a'], [0.66, '#f2a860'], [1, '#2a1a14']]);
      brillo(g, 760, 1080, 520, 'rgba(255,200,120,0.55)');
      g.fillStyle = '#3a2a30'; for (let i = 0; i < 7; i++) { const x = i * 170 - 40; g.fillRect(x, 1170 - (i % 3) * 30, 150, 400); }
      coliseoFachada(g, 540, 1330, 1000, 480, '#e6b888', '#7a4a3a');
      g.fillStyle = '#1a1210'; g.fillRect(0, 1320, W, H);
    });
  },
  dibujar(ctx, u, dur, t) {
    ctx.save(); camara(ctx, 1 + u * 0.02, W / 2, 1100); ctx.drawImage(this.fondo, 0, 0);
    particulas(ctx, 4, 3, t, (g, i, r) => { const x = ((r() * W + t * 30) % (W + 100)) - 50, y = 300 + r() * 300, a = Math.sin(t * 8 + i) * 9;
      g.strokeStyle = 'rgba(30,20,30,0.7)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x - 12, y - a); g.quadraticCurveTo(x - 5, y - 4, x, y); g.quadraticCurveTo(x + 5, y - 4, x + 12, y - a); g.stroke(); });
    ctx.restore();
    ctx.fillStyle = grad(ctx, 0, 1300, 0, H, [[0, 'rgba(20,14,12,0)'], [0.3, '#140e0c'], [1, '#0a0706']]); ctx.fillRect(0, 1290, W, H);
    const a = smooth(rango(u, 0.3, 1.3)) * (1 - smooth(rango(u, dur - 0.9, dur - 0.2)));
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,0.85)'; ctx.shadowBlur = 30;
    ctx.font = '700 52px Cinzel'; ctx.fillStyle = '#f3e1bf'; ctx.letterSpacing = '14px'; ctx.fillText('UN DÍA SIENDO', W / 2 + 7, 420 - (1 - a) * 20);
    ctx.font = '900 128px Cinzel'; ctx.letterSpacing = '4px'; ctx.fillStyle = grad(ctx, 0, 450, 0, 580, [[0, '#ffe6a6'], [0.5, '#e7b45a'], [1, '#a8702a']]); ctx.fillText('GLADIADOR', W / 2 + 2, 565);
    ctx.font = '700 62px Cinzel'; ctx.letterSpacing = '10px'; ctx.fillStyle = '#f6e6c8'; ctx.fillText('EN ROMA', W / 2 + 5, 660);
    ctx.font = '700 40px Cinzel'; ctx.letterSpacing = '8px'; ctx.fillStyle = '#ffd59a'; ctx.fillText('— AÑO 90 d. C. —', W / 2 + 4, 745);
    ctx.restore();
  }
};

// ===================================================================
// 2. CELDA — despertar en el Ludus Magnus
// ===================================================================
ESCENAS.celda = {
  init() {
    this.fondo = cacheado('g_celda', W, H, (g) => {
      g.fillStyle = '#3a3029'; g.fillRect(0, 0, W, H);
      const R = rnd(21);
      for (let y = 0; y < 1500; y += 70) for (let x = -((y / 70) % 2) * 80; x < W; x += 160) { const c = 50 + R() * 25; g.fillStyle = `rgb(${c + 12},${c + 4},${c - 4})`; g.fillRect(x + 4, y + 4, 152, 62); }
      // ventana alta con barrotes
      g.fillStyle = '#f6c88a'; g.fillRect(620, 330, 220, 170);
      g.fillStyle = '#2a211b'; for (let i = 0; i < 4; i++) g.fillRect(640 + i * 55, 330, 14, 170);
      g.fillStyle = grad(g, 0, 1450, 0, H, [[0, '#4a3b2e'], [1, '#1e1712']]); g.fillRect(0, 1450, W, H);
      // camastro de paja
      g.fillStyle = '#5a3e26'; g.fillRect(80, 1330, 620, 60); g.fillStyle = '#c9a65a'; g.beginPath(); g.roundRect(70, 1290, 640, 60, 26); g.fill();
      for (let i = 0; i < 300; i++) { g.strokeStyle = `rgba(${150 + R() * 80},${120 + R() * 60},60,0.7)`; g.lineWidth = 2; const x = 80 + R() * 620, y = 1295 + R() * 50; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (R() - .5) * 40, y + (R() - .5) * 10); g.stroke(); }
      // cuenco y jarra
      g.fillStyle = '#8a4b2c'; elipse(g, 880, 1480, 60, 120); g.fill(); g.fillRect(860, 1340, 40, 40);
    });
  },
  dibujar(ctx, u, dur, t) {
    ctx.save(); camara(ctx, 1.12 - smooth(rango(u, 0, dur)) * 0.1, 540, 1150);
    ctx.drawImage(this.fondo, 0, 0);
    ctx.fillStyle = 'rgba(10,6,4,0.45)'; ctx.fillRect(0, 0, W, H);
    // rayo de luz del amanecer
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = grad(ctx, 700, 400, 400, 1500, [[0, 'rgba(255,190,110,0.32)'], [1, 'rgba(255,150,80,0)']]);
    ctx.beginPath(); ctx.moveTo(620, 330); ctx.lineTo(840, 330); ctx.lineTo(620, 1600); ctx.lineTo(120, 1600); ctx.closePath(); ctx.fill(); ctx.restore();
    particulas(ctx, 50, 4, t, (g, i, r) => { const x = 300 + r() * 450 + Math.sin(t * 0.4 + i) * 20, y = 500 + ((r() * 1000 + t * 12) % 1000);
      g.fillStyle = `rgba(255,220,170,${0.2 + r() * 0.35})`; g.beginPath(); g.arc(x, y, 1.5 + r() * 2, 0, 7); g.fill(); });
    // el gladiador se incorpora y se pone en pie
    const k = easeInOut(rango(u, 0.8, 3.6));
    iluminado(ctx, (g) => aprendiz(g, { x: lerp(330, 420, k), y: lerp(1560, 1650, k) - (1 - k) * 0, s: 1.55, dir: 1, fase: null,
      bD: [lerp(1.4, 0.2, k), lerp(0.6, 0.2, k)], bT: [lerp(1.0, -0.1, k), 0.3], bajo: 120 }),
      { osc: 0.35, rim: '#ffc27a', dx: 7, alphaRim: 0.9 });
    ctx.restore();
  }
};

// ===================================================================
// 3. ENTRENAMIENTO — el palus y los doctores
// ===================================================================
ESCENAS.entreno = {
  init() {
    this.fondo = cacheado('g_entreno', W, H, (g) => {
      cielo(g, [[0, '#7fb0d8'], [0.5, '#cfe2ee'], [1, '#e8d6b0']]);
      // gradas del pequeño anfiteatro del ludus
      g.fillStyle = '#b89a78'; g.fillRect(0, 620, W, 520);
      for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#a88a68' : '#c4a684'; g.fillRect(0, 640 + i * 70, W, 34); }
      g.fillStyle = '#d8c2a0'; g.fillRect(0, 560, W, 80);
      for (let i = 0; i < 9; i++) { g.fillStyle = '#e9dcc4'; g.fillRect(30 + i * 125, 420, 40, 160); }
      g.fillStyle = '#c9b090'; g.fillRect(0, 400, W, 30);
      g.fillStyle = '#7a3a2a'; g.fillRect(0, 1060, W, 90); // muro del podio
      // arena del patio
      g.fillStyle = grad(g, 0, 1150, 0, H, [[0, '#e3c48c'], [1, '#b8955c']]); g.fillRect(0, 1150, W, H);
      const R = rnd(8); for (let i = 0; i < 1500; i++) { g.fillStyle = `rgba(${R() < .5 ? '120,90,50' : '255,240,210'},${R() * 0.25})`; g.fillRect(R() * W, 1150 + R() * 770, 3, 2); }
      // otros palus al fondo
      for (let i = 0; i < 3; i++) { g.fillStyle = '#6e4a28'; g.fillRect(120 + i * 360, 980, 26, 190); }
    });
  },
  dibujar(ctx, u, dur, t, e) {
    const l2 = TL.lineas.filter(l => l.escena === 'entreno')[1].ini - e.ini;
    ctx.save(); camara(ctx, 1 + smooth(rango(u, 0, dur)) * 0.1, 560, 1250);
    ctx.drawImage(this.fondo, 0, 0);
    // compañeros entrenando al fondo
    [[200, 1180, 0.55, 0.7], [880, 1190, 0.55, 1.9]].forEach(([x, y, s, ph], i) => {
      const golpe = Math.max(0, Math.sin(t * 5 + ph));
      aprendiz(ctx, { x, y, s, dir: i ? -1 : 1, fase: null, bD: [1.2 + golpe * 1.4, -0.6], bT: [0.4, 0.4], espada: -1.0 - golpe });
    });
    // poste (palus)
    ctx.fillStyle = grad(ctx, 690, 0, 760, 0, [[0, '#4e3219'], [0.5, '#8a5f36'], [1, '#4e3219']]); ctx.fillRect(690, 860, 70, 600);
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; elipse(ctx, 725, 1462, 70, 16); ctx.fill();
    for (let i = 0; i < 12; i++) { ctx.strokeStyle = 'rgba(30,15,5,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); const y = 950 + i * 37; ctx.moveTo(694, y); ctx.lineTo(720 + (i % 3) * 10, y + 6); ctx.stroke(); }
    // golpes al palus
    const ciclo = (u * 1.6) % 1, golpe = ciclo < 0.25 ? ciclo / 0.25 : Math.max(0, 1 - (ciclo - 0.25) / 0.5);
    aprendiz(ctx, { x: 420, y: 1470, s: 1.45, dir: 1, fase: null, bD: [0.9 + golpe * 1.5, -0.4 - golpe * 0.4], bT: [0.7, 0.9], espada: -1.0 - golpe * 0.9, bajo: 120 });
    if (golpe > 0.95) particulas(ctx, 12, Math.floor(u * 1.6), t, (g, i, r) => { g.fillStyle = 'rgba(200,160,110,0.8)'; g.fillRect(700 + r() * 40, 1050 + r() * 80, 4, 4); });
    // el maestro (doctor) observa con su vara
    const habla = u > l2 - 0.2;
    figura(ctx, { x: 1000, y: 1440, s: 1.05, dir: -1, fase: null, bD: [habla ? 1.6 + Math.sin(t * 3) * 0.15 : 0.6, habla ? -0.4 : 0.4], bT: [0.2, 0.3],
      col: { tunica: '#7a2a20', sombra: '#4a160f', pelo: '#9a9088' },
      mano: (g, hx, hy) => { g.strokeStyle = '#5a3a1a'; g.lineWidth = 12; g.beginPath(); g.moveTo(hx, hy + 80); g.lineTo(hx + 10, hy - 200); g.stroke(); } });
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,190,110,0.25)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
};

// ===================================================================
// 4. COMIDA — cebada, habas y bebida de ceniza
// ===================================================================
ESCENAS.comida = {
  init() {
    this.mesa = cacheado('g_mesa', W, H, (g) => {
      g.fillStyle = '#6b4a2c'; g.fillRect(0, 0, W, H);
      const R = rnd(31);
      for (let i = 0; i < 18; i++) { const y = i * 110; g.fillStyle = 'rgba(0,0,0,0.15)'; g.fillRect(0, y, W, 4);
        for (let j = 0; j < 30; j++) { g.strokeStyle = `rgba(${R() < .5 ? '40,22,10' : '150,105,65'},${0.15 + R() * 0.2})`; g.lineWidth = 1 + R() * 2; const yy = y + R() * 110; g.beginPath(); g.moveTo(0, yy); for (let x = 0; x <= W; x += 60) g.lineTo(x, yy + Math.sin(x / 150 + j) * 4); g.stroke(); } }
      // cuenco grande de gachas de cebada
      g.fillStyle = 'rgba(0,0,0,0.35)'; elipse(g, 560, 880, 290, 290); g.fill();
      g.fillStyle = radial(g, 500, 800, 20, 300, [[0, '#b77a48'], [1, '#5e3418']]); elipse(g, 540, 860, 280, 280); g.fill();
      g.fillStyle = radial(g, 500, 820, 10, 240, [[0, '#ead9a8'], [1, '#c4a46a']]); elipse(g, 540, 860, 225, 225); g.fill();
      for (let i = 0; i < 420; i++) { const a = R() * 6.28, d = Math.sqrt(R()) * 210; g.fillStyle = `rgba(${200 + R() * 40},${170 + R() * 40},${100 + R() * 40},0.9)`; elipse(g, 540 + Math.cos(a) * d, 860 + Math.sin(a) * d, 7, 4.5, R() * 3); g.fill(); }
      // habas encima
      for (let i = 0; i < 26; i++) { const a = R() * 6.28, d = Math.sqrt(R()) * 160; g.fillStyle = '#7f8a3e'; elipse(g, 540 + Math.cos(a) * d, 860 + Math.sin(a) * d, 16, 11, R() * 3); g.fill(); g.fillStyle = 'rgba(255,255,255,0.25)'; elipse(g, 535 + Math.cos(a) * d, 856 + Math.sin(a) * d, 6, 3); g.fill(); }
      // taza con bebida de ceniza
      g.fillStyle = 'rgba(0,0,0,0.35)'; elipse(g, 860, 1340, 135, 135); g.fill();
      g.fillStyle = radial(g, 830, 1310, 10, 140, [[0, '#b77a48'], [1, '#5e3418']]); elipse(g, 850, 1330, 130, 130); g.fill();
      g.fillStyle = radial(g, 840, 1320, 5, 100, [[0, '#9a958c'], [1, '#55524c']]); elipse(g, 850, 1330, 100, 100); g.fill();
      // saco de habas y espigas de cebada
      g.fillStyle = '#8a7350'; elipse(g, 180, 1380, 140, 120); g.fill();
      for (let i = 0; i < 40; i++) { g.fillStyle = '#7f8a3e'; elipse(g, 120 + R() * 120, 1330 + R() * 80, 14, 10, R() * 3); g.fill(); }
      for (let k = 0; k < 4; k++) { g.save(); g.translate(150 + k * 50, 400 + k * 20); g.rotate(0.7 + k * 0.1); g.strokeStyle = '#d7b46a'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 260); g.stroke();
        for (let j = 0; j < 9; j++) { g.fillStyle = '#e2c47c'; elipse(g, -10, j * 16, 9, 5, -0.6); g.fill(); elipse(g, 10, j * 16, 9, 5, 0.6); g.fill(); } g.restore(); }
    });
  },
  dibujar(ctx, u, dur, t, e) {
    const ls = TL.lineas.filter(l => l.escena === 'comida');
    ctx.save(); camara(ctx, 1.0 + u * 0.012, 540, 960);
    ctx.drawImage(this.mesa, 0, 0);
    ctx.fillStyle = radial(ctx, 420, 600, 100, 1300, [[0, 'rgba(255,200,120,0.15)'], [1, 'rgba(0,0,0,0.5)']]); ctx.fillRect(0, 0, W, H);
    // cuchara removiendo
    const a = u * 1.2;
    ctx.save(); ctx.translate(540 + Math.cos(a) * 90, 860 + Math.sin(a) * 70); ctx.rotate(0.6);
    ctx.fillStyle = '#5a3a1e'; ctx.fillRect(-8, 0, 16, 300); ctx.fillStyle = '#7a5230'; elipse(ctx, 0, -10, 30, 42); ctx.fill(); ctx.restore();
    // vapor
    humo(ctx, 540, 760, t, 10, 'rgba(255,245,230,A)', 0.8, 10);
    // la superficie de la bebida de ceniza ondula
    ctx.strokeStyle = 'rgba(200,195,185,0.35)'; ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { const r = ((t * 30 + i * 30) % 90); elipse(ctx, 850, 1330, r, r * 0.95); ctx.stroke(); }
    // etiquetas
    const etiq = (txt, x, y, ini, fin) => { const k = smooth(rango(t, ini - 0.1, ini + 0.25)) * (1 - smooth(rango(t, fin, fin + 0.4))); if (k <= 0) return;
      ctx.save(); ctx.globalAlpha = k; ctx.font = '800 44px Montserrat'; ctx.textAlign = 'center'; const m = ctx.measureText(txt).width + 50;
      ctx.fillStyle = 'rgba(20,12,6,0.8)'; ctx.beginPath(); ctx.roundRect(x - m / 2, y - 40 - (1 - k) * 20, m, 64, 32); ctx.fill(); ctx.fillStyle = '#ffd88a'; ctx.fillText(txt, x, y + 6 - (1 - k) * 20); ctx.restore(); };
    const w = (l, p) => (l.palabras.find(x => x.p.toLowerCase().startsWith(p)) || l.palabras[0]).ini;
    etiq('CEBADA', 300, 640, w(ls[0], 'cebada'), e.fin - 0.5);
    etiq('HABAS', 790, 660, w(ls[0], 'habas'), e.fin - 0.5);
    etiq('CENIZA VEGETAL', 760, 1530, w(ls[1], 'ceniza'), e.fin - 0.3);
    // gran rótulo HORDEARII
    const hk = smooth(rango(t, w(ls[0], 'hordearii') - 0.1, w(ls[0], 'hordearii') + 0.3)) * (1 - smooth(rango(t, ls[1].ini - 0.2, ls[1].ini + 0.3)));
    if (hk > 0) { ctx.save(); ctx.globalAlpha = hk; ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 25;
      ctx.font = '900 110px Cinzel'; ctx.fillStyle = grad(ctx, 0, 300, 0, 420, [[0, '#ffe6a6'], [1, '#c4883a']]); ctx.fillText('HORDEARII', W / 2, 440 + (1 - hk) * 30);
      ctx.font = '800 40px Montserrat'; ctx.fillStyle = '#f3e3c3'; ctx.fillText('«los comedores de cebada»', W / 2, 505 + (1 - hk) * 30); ctx.restore(); }
    ctx.restore();
  }
};

// ===================================================================
// 5. DATO — cuántas veces luchaban y cuántos morían
// ===================================================================
ESCENAS.dato = {
  dibujar(ctx, u, dur, t, e) {
    const ls = TL.lineas.filter(l => l.escena === 'dato');
    ctx.fillStyle = radial(ctx, W / 2, 900, 100, 1300, [[0, '#4a2a1c'], [1, '#120a07']]); ctx.fillRect(0, 0, W, H);
    // arena de fondo difusa
    ctx.fillStyle = 'rgba(220,180,120,0.12)'; elipse(ctx, W / 2, 1500, 700, 220); ctx.fill();
    particulas(ctx, 40, 9, t, (g, i, r) => { g.fillStyle = `rgba(255,210,150,${0.1 + r() * 0.2})`; g.beginPath(); g.arc(r() * W, (r() * H - t * 10) % H + (r() * H - t * 10 < 0 ? H : 0), 1.5 + r() * 2, 0, 7); g.fill(); });
    ctx.textAlign = 'center';
    // bloque 1: 3-4 combates al año (calendario con 12 meses, 4 marcados)
    const a1 = smooth(rango(t, ls[0].palabras[6]?.ini ?? ls[0].ini + 1, (ls[0].palabras[6]?.ini ?? ls[0].ini + 1) + 0.4));
    if (a1 > 0) {
      ctx.save(); ctx.globalAlpha = a1; ctx.translate(0, (1 - a1) * 30);
      ctx.font = '900 150px Cinzel'; ctx.fillStyle = '#ffd88a'; ctx.fillText('3 – 4', W / 2, 470);
      ctx.font = '800 46px Montserrat'; ctx.fillStyle = '#f3e3c3'; ctx.fillText('COMBATES AL AÑO', W / 2, 545);
      const marcados = [2, 5, 8, 11];
      for (let m = 0; m < 12; m++) { const x = 170 + (m % 6) * 150, y = 620 + Math.floor(m / 6) * 120; const on = marcados.includes(m) && t > ls[0].ini + 3 + marcados.indexOf(m) * 0.25;
        ctx.fillStyle = on ? '#c4402a' : 'rgba(255,240,210,0.12)'; ctx.beginPath(); ctx.roundRect(x - 55, y, 110, 90, 14); ctx.fill();
        if (on) { [[-1, 1], [1, -1]].forEach(([d]) => { ctx.save(); ctx.translate(x, y + 45); ctx.rotate(d * 0.75);
          ctx.fillStyle = '#eef2f3'; ctx.beginPath(); ctx.moveTo(-4, 14); ctx.lineTo(0, -32); ctx.lineTo(4, 14); ctx.fill();
          ctx.fillStyle = '#ffd88a'; ctx.fillRect(-11, 14, 22, 5); ctx.fillStyle = '#6b4a2a'; ctx.fillRect(-3, 19, 6, 14); ctx.restore(); }); } }
      ctx.restore();
    }
    // bloque 2: 1 de cada 5 combates acababa en muerte (5 cascos, uno apagado)
    const a2 = smooth(rango(t, ls[1].ini + 0.6, ls[1].ini + 1.1));
    if (a2 > 0) {
      ctx.save(); ctx.globalAlpha = a2; ctx.translate(0, (1 - a2) * 30);
      for (let i = 0; i < 5; i++) { const x = 180 + i * 180, y = 1020, muerto = i === 2 && t > ls[1].ini + 2.2;
        ctx.save(); ctx.translate(x, y + 330); ctx.scale(0.62, 0.62); ctx.translate(-6, 0);
        if (muerto) ctx.filter = 'grayscale(1) brightness(0.45)';
        casco(ctx); ctx.restore(); ctx.filter = 'none';
        if (muerto) { ctx.strokeStyle = '#d23a24'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x - 60, y - 40); ctx.lineTo(x + 60, y + 50); ctx.stroke(); } }
      ctx.font = '800 46px Montserrat'; ctx.fillStyle = '#f3e3c3'; ctx.fillText('1 DE CADA 5 COMBATES', W / 2, 1180);
      ctx.font = '700 36px Montserrat'; ctx.fillStyle = '#d8c2a0'; ctx.fillText('acababa con la muerte del perdedor (siglo I)', W / 2, 1235);
      ctx.restore();
    }
  }
};

// ===================================================================
// 6. CENA LIBERA — banquete público la víspera
// ===================================================================
ESCENAS.cena = {
  init() {
    this.fondo = cacheado('g_cena', W, H, (g) => {
      g.fillStyle = '#2a1812'; g.fillRect(0, 0, W, H);
      g.fillStyle = '#5a1d15'; g.fillRect(0, 700, W, 400);
      for (let i = 0; i < 5; i++) { g.fillStyle = '#3a221a'; g.fillRect(60 + i * 230, 300, 50, 900); }
      g.fillStyle = '#1a0f0b'; g.fillRect(0, 1100, W, H);
    });
  },
  dibujar(ctx, u, dur, t) {
    ctx.save(); camara(ctx, 1.08 - u * 0.008, 540, 1100);
    ctx.drawImage(this.fondo, 0, 0);
    // lámparas colgantes
    [200, 540, 880].forEach((x, i) => { ctx.strokeStyle = '#1a0f0b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 520); ctx.stroke();
      lucernaSimple(ctx, x, 540, t + i); brillo(ctx, x + 40, 520, 520, 'rgba(255,150,60,0.35)', 0.8 + 0.2 * ruido1(t * 5 + i)); });
    // gladiadores sentados tras la mesa (siluetas cálidas)
    [[150, 0.2], [330, 1.1], [520, 2.3], [710, 0.7], [900, 1.8]].forEach(([x, ph], i) => {
      const come = Math.max(0, Math.sin(t * 1.6 + ph));
      iluminado(ctx, (g) => figura(g, { x, y: 1360, s: 0.95, dir: i % 2 ? -1 : 1, fase: null, bD: [1.2 + come * 0.9, -1.4 * come], bT: [0.6, 0.6],
        col: { tunica: ['#8d6b47', '#6f5a40', '#7a4a30', '#5e5a4a', '#8a6a3a'][i], sombra: '#3a2a1a' } }), { osc: 0.25, rim: '#ffb35c', dx: 5, alphaRim: 0.7 });
    });
    // mesa larga con comida
    ctx.fillStyle = grad(ctx, 0, 1150, 0, 1260, [[0, '#7a5230'], [1, '#4a2e18']]); ctx.fillRect(40, 1150, 1000, 110);
    ctx.fillStyle = '#3a2412'; ctx.fillRect(40, 1260, 1000, 40);
    const R = rnd(5);
    for (let i = 0; i < 9; i++) { const x = 90 + i * 110; ctx.fillStyle = '#9a6a3a'; elipse(ctx, x, 1150, 46, 14); ctx.fill();
      ctx.fillStyle = ['#c98b3a', '#7f8a3e', '#a8452f', '#e2c47c'][i % 4]; for (let k = 0; k < 4; k++) { elipse(ctx, x - 20 + k * 13, 1140 - R() * 8, 10, 8); ctx.fill(); } }
    for (let i = 0; i < 3; i++) { ctx.fillStyle = '#8a4b2c'; elipse(ctx, 230 + i * 330, 1110, 26, 50); ctx.fill(); }
    // público curioso en primer plano (cabezas a contraluz)
    for (let i = 0; i < 7; i++) { const x = 60 + i * 160 + Math.sin(t * 0.7 + i) * 6; ctx.fillStyle = '#0c0705'; elipse(ctx, x, 1520, 60, 72); ctx.fill(); ctx.fillRect(x - 95, 1560, 190, 400); }
    ctx.restore();
  }
};
function lucernaSimple(ctx, x, y, t) {
  ctx.fillStyle = '#9a5a34'; elipse(ctx, x, y, 46, 20); ctx.fill(); ctx.fillRect(x + 30, y - 8, 30, 14);
  const h = 40 + ruido1(t * 9) * 20; ctx.fillStyle = grad(ctx, 0, y - h, 0, y, [[0, 'rgba(255,140,40,0)'], [0.4, '#ffa040'], [1, '#fff2c8']]);
  ctx.beginPath(); ctx.moveTo(x + 62, y); ctx.quadraticCurveTo(x + 50, y - h * 0.4, x + 62, y - h); ctx.quadraticCurveTo(x + 74, y - h * 0.4, x + 62, y); ctx.fill();
}

// ===================================================================
// 7. JUEGOS — el Coliseo por dentro, el sol cruza el cielo
// ===================================================================
ESCENAS.juegos = {
  init() {
    this.interior = cacheado('g_interior', W, H, (g) => {
      cielo(g, [[0, '#6aa0d0'], [0.3, '#bcd8ec'], [1, '#bcd8ec']]);
      // anillos de gradas (vista desde lo alto)
      const cx = 540, cy = 1200;
      for (let i = 11; i >= 0; i--) {
        const rx = 360 + i * 70, ry = 190 + i * 52;
        g.fillStyle = i % 4 === 3 ? '#d9cbb2' : '#b9a68a'; elipse(g, cx, cy, rx, ry); g.fill();
        const c = lienzo(rx * 2, ry * 2), cc = c.getContext('2d'); gradas(cc, rx * 2, ry * 2, 40 + i, 1.4);
        g.save(); elipse(g, cx, cy, rx, ry); g.clip(); g.globalAlpha = i % 4 === 3 ? 0.15 : 0.9; g.drawImage(c, cx - rx, cy - ry); g.restore();
      }
      g.fillStyle = '#7a3a2a'; elipse(g, cx, cy, 372, 200); g.fill(); // muro del podio
      g.fillStyle = grad(g, 0, cy - 190, 0, cy + 190, [[0, '#d9b47a'], [1, '#e8c890']]); elipse(g, cx, cy + 6, 350, 186); g.fill();
      // sombra del velarium sobre las gradas superiores
      g.fillStyle = 'rgba(40,20,10,0.25)'; g.beginPath(); g.ellipse(cx, cy, 1130, 820, 0, Math.PI, 0); g.ellipse(cx, cy, 760, 560, 0, 0, Math.PI, true); g.fill();
    });
  },
  dibujar(ctx, u, dur, t, e) {
    const ls = TL.lineas.filter(l => l.escena === 'juegos');
    const k = rango(u, 0, dur);
    ctx.save(); camara(ctx, 1.0 + k * 0.15, 540, 1200);
    ctx.drawImage(this.interior, 0, 0);
    // el sol cruza el cielo (mañana -> tarde)
    const sx = lerp(150, 950, k), sy = 230 - Math.sin(Math.PI * k) * 120;
    brillo(ctx, sx, sy, 260, 'rgba(255,240,200,0.8)'); ctx.fillStyle = '#fff8e0'; elipse(ctx, sx, sy, 40, 40); ctx.fill();
    // figuras en la arena según el momento del día
    const fase = t < (ls[0].palabras.find(p => p.p.startsWith('mediod'))?.ini ?? 1e9) ? 0 : (t < ls[1].ini ? 1 : 2);
    if (fase === 0) particulas(ctx, 5, 12, t, (g, i, r) => { const a = t * (0.6 + r() * 0.5) + r() * 6; g.fillStyle = '#7a5a2a'; elipse(g, 540 + Math.cos(a) * 250, 1206 + Math.sin(a) * 120, 18, 10); g.fill(); });
    if (fase === 2) [[-1, 0], [1, 1]].forEach(([d, j]) => { [0, 1].forEach(m => { const x = 440 + j * 200 + m * 40 + Math.sin(t * 3 + j + m) * 12; ctx.fillStyle = m ? '#9a2a1e' : '#e6dcc6'; elipse(ctx, x, 1200 + j * 30, 9, 14); ctx.fill(); }); });
    // ondas de la multitud
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 0.08 + 0.05 * Math.sin(t * 4);
    ctx.fillStyle = '#fff'; elipse(ctx, 540, 1200, 900 + Math.sin(t * 2) * 30, 640); ctx.fill(); ctx.restore();
    ctx.restore();
    // rótulos del programa del día
    const items = [['MAÑANA', 'FIERAS', ls[0].palabras.find(p => p.p.startsWith('mañana'))?.ini], ['MEDIODÍA', 'EJECUCIONES', ls[0].palabras.find(p => p.p.startsWith('mediod'))?.ini], ['TARDE', 'GLADIADORES', ls[1].palabras.find(p => p.p.startsWith('tarde'))?.ini]];
    items.forEach(([a, b, ti], i) => { if (ti == null) return; const kk = smooth(rango(t, ti - 0.1, ti + 0.3)); if (kk <= 0) return;
      const y = 380 + i * 120, activo = (i === 2 && t > ti) || (t > ti && t < (items[i + 1]?.[2] ?? 1e9));
      ctx.save(); ctx.globalAlpha = kk * (activo ? 1 : 0.55); ctx.textAlign = 'left';
      ctx.fillStyle = activo ? 'rgba(150,30,20,0.85)' : 'rgba(20,12,6,0.75)'; ctx.beginPath(); ctx.roundRect(140, y - 50, 800, 90, 45); ctx.fill();
      ctx.font = '900 46px Montserrat'; ctx.fillStyle = '#ffd88a'; ctx.fillText(a, 190, y + 12); ctx.fillStyle = '#fff4dc'; ctx.fillText(b, 520, y + 12); ctx.restore(); });
  }
};

// ===================================================================
// 8. TÚNEL — del ludus al Coliseo
// ===================================================================
function gladiadorEspalda(ctx, x, y, s, fase) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const sw = Math.sin(fase) * 30;
  ctx.fillStyle = '#000';
  ctx.beginPath(); ctx.roundRect(-55 + sw * 0.2, -250, 40, 250 - Math.max(0, sw), 18); ctx.fill();
  ctx.beginPath(); ctx.roundRect(15 - sw * 0.2, -250, 40, 250 - Math.max(0, -sw), 18); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-80, -300); ctx.lineTo(80, -300); ctx.lineTo(70, -230); ctx.lineTo(-70, -230); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-95, -460); ctx.lineTo(95, -460); ctx.lineTo(70, -300); ctx.lineTo(-70, -300); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-120, -470, 34, 200, 16); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-150, -480, 70, 300, 14); ctx.fill(); // escudo
  ctx.beginPath(); ctx.roundRect(88, -470, 32, 190, 16); ctx.fill();
  ctx.fillRect(98, -300, 12, 120); // espada
  elipse(ctx, 0, -520, 62, 64); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, -478, 90, 14, 0, 0, 7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-14, -575); ctx.quadraticCurveTo(0, -660, 14, -575); ctx.fill(); // cresta (de espaldas)
  ctx.restore();
}
ESCENAS.tunel = {
  dibujar(ctx, u, dur, t) {
    const vx = 540, vy = 900;
    ctx.fillStyle = '#120c09'; ctx.fillRect(0, 0, W, H);
    // luz al final del túnel
    const ap = 1 + u * 0.08;
    ctx.fillStyle = radial(ctx, vx, vy, 10, 260 * ap, [[0, '#fff6dc'], [0.5, '#ffd28a'], [1, 'rgba(255,190,110,0)']]); ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff3d6'; ctx.beginPath(); ctx.ellipse(vx, vy, 70 * ap, 90 * ap, 0, Math.PI, 0); ctx.lineTo(vx + 70 * ap, vy + 90 * ap); ctx.lineTo(vx - 70 * ap, vy + 90 * ap); ctx.fill();
    // anillos de ladrillo (bóveda) acercándose
    for (let i = 14; i >= 0; i--) {
      const z = ((i + (u * 1.6) % 1) / 14); const sc = 1 / (0.12 + z * 0.9);
      const rx = 90 * sc, ry = 110 * sc;
      ctx.strokeStyle = `rgba(${90 - z * 40},${55 - z * 25},${40 - z * 20},${0.9})`; ctx.lineWidth = 26 * sc * 0.3;
      ctx.beginPath(); ctx.ellipse(vx, vy, rx, ry, 0, Math.PI, 0); ctx.lineTo(vx + rx, vy + ry); ctx.moveTo(vx - rx, vy); ctx.lineTo(vx - rx, vy + ry); ctx.stroke();
      // antorchas
      if (i % 4 === 1) { const h = 30 * sc * 0.25; [-1, 1].forEach(d => { const x = vx + d * rx * 0.97, y = vy + ry * 0.1; brillo(ctx, x, y, 160 * sc * 0.3, 'rgba(255,140,50,0.5)');
        ctx.fillStyle = '#ffb04a'; ctx.beginPath(); ctx.moveTo(x - h * 0.4, y); ctx.quadraticCurveTo(x, y - h * (2 + ruido1(t * 8 + i)), x + h * 0.4, y); ctx.fill(); }); }
    }
    // suelo
    ctx.fillStyle = grad(ctx, 0, vy + 90, 0, H, [[0, '#3a2a1e'], [1, '#0e0906']]); ctx.beginPath(); ctx.moveTo(vx - 70, vy + 90); ctx.lineTo(vx + 70, vy + 90); ctx.lineTo(W + 400, H); ctx.lineTo(-400, H); ctx.fill();
    // gladiador de espaldas caminando hacia la luz
    const k = rango(u, 0, dur);
    iluminado(ctx, (g) => gladiadorEspalda(g, 540, lerp(1780, 1500, k), lerp(1.55, 1.05, k), u * 6), { osc: 0, rim: '#ffe6b0', dx: 0, dy: -5, alphaRim: 0.9 });
    // polvo en la luz
    particulas(ctx, 40, 2, t, (g, i, r) => { g.fillStyle = `rgba(255,230,180,${0.15 + r() * 0.3})`; g.beginPath(); g.arc(vx + (r() - 0.5) * 500, vy + (r() - 0.3) * 600 + Math.sin(t + i) * 10, 1.5 + r() * 2, 0, 7); g.fill(); });
  }
};

// ===================================================================
// 9. ARENA — frente al reciario; el destino en manos de un solo hombre
// ===================================================================
ESCENAS.arena = {
  init() {
    this.fondo = cacheado('g_arena', W, H, (g) => {
      cielo(g, [[0, '#5d8fc4'], [0.4, '#a9c9e2'], [1, '#e9d8b4']]);
      // velarium
      g.fillStyle = 'rgba(214,190,150,0.95)'; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(i * 135 - 20, 0); g.lineTo(i * 135 + 120, 0); g.lineTo(i * 135 + 70, 150); g.closePath(); g.fill(); }
      g.strokeStyle = 'rgba(90,70,50,0.6)'; g.lineWidth = 3; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(i * 135 + 70, 150); g.lineTo(i * 135 + 70, 0); g.stroke(); }
      // gradas con público
      for (let r = 0; r < 5; r++) { const y = 260 + r * 150; g.fillStyle = r % 2 ? '#c8b696' : '#b8a382'; g.fillRect(0, y, W, 150); const c = lienzo(W, 130); gradas(c.getContext('2d'), W, 130, 70 + r, 1.6); g.drawImage(c, 0, y + 10); g.fillStyle = 'rgba(0,0,0,0.15)'; g.fillRect(0, y, W, 8); }
      // palco imperial
      g.fillStyle = '#e9dcc4'; g.fillRect(380, 470, 320, 230); g.fillStyle = '#5a1a4a'; g.fillRect(400, 560, 280, 140);
      g.fillStyle = '#d4af5a'; g.fillRect(380, 470, 320, 18); for (let i = 0; i < 5; i++) g.fillRect(390 + i * 72, 488, 14, 212);
      // muro del podio y arena
      g.fillStyle = '#e8e0d0'; g.fillRect(0, 1010, W, 30); g.fillStyle = '#7a3a2a'; g.fillRect(0, 1040, W, 110);
      g.fillStyle = grad(g, 0, 1150, 0, H, [[0, '#e6c88e'], [1, '#c09a5e']]); g.fillRect(0, 1150, W, H);
      const R = rnd(17); for (let i = 0; i < 1800; i++) { g.fillStyle = `rgba(${R() < .5 ? '130,95,55' : '255,245,220'},${R() * 0.25})`; g.fillRect(R() * W, 1150 + R() * 770, 3, 2); }
    });
  },
  dibujar(ctx, u, dur, t, e) {
    const l2 = TL.lineas.filter(l => l.escena === 'arena')[1].ini - e.ini;
    const sube = easeInOut(rango(u, l2 - 0.3, l2 + 1.6));
    const z = lerp(1.0 + u * 0.03, 2.1, sube);
    ctx.save(); camara(ctx, z, lerp(540, 540, sube), lerp(1250, 600, sube));
    ctx.drawImage(this.fondo, 0, 0);
    // emperador en el palco
    figura(ctx, { x: 540, y: 700, s: 0.33, dir: 1, fase: null, bD: [sube > 0.8 ? 2.2 : 0.4, -0.2], bT: [0.3, 0.6], col: { tunica: '#f0e8d8', sombra: '#b8a888', manto: '#6a1f5a', pelo: '#3a2a1e' }, barba: false });
    // público que se agita
    particulas(ctx, 40, 31, t, (g, i, r) => { const x = r() * W, y = 300 + r() * 650, j = Math.abs(Math.sin(t * 6 + i)) * 10; g.fillStyle = 'rgba(255,240,215,0.55)'; g.fillRect(x, y - j, 4, 10); });
    // los dos gladiadores frente a frente
    const guard = Math.sin(t * 2.2) * 0.12;
    const avance = smooth(rango(u, 0.2, 3.5));
    mirmillon(ctx, { x: lerp(170, 300, avance), y: 1560, s: 1.05, dir: 1, fase: u < 3.5 ? u * 5 : null, bD: [1.0 + guard, -0.5], bT: [0.9, 0.6], espada: -1.35 + guard });
    reciario(ctx, { x: lerp(980, 820, avance), y: 1560, s: 1.0, dir: -1, fase: u < 3.5 ? u * 5 + 1 : null, bD: [1.0 - guard, -0.3], bT: [0.5, 0.4], tridente: -1.15 - guard });
    // polvo levantado
    particulas(ctx, 30, 6, t, (g, i, r) => { const k = (t * 0.3 + r()) % 1; g.fillStyle = `rgba(240,215,170,${0.3 * (1 - k)})`; elipse(g, 200 + r() * 700, 1560 - k * 160, 20 + k * 40, 12 + k * 20); g.fill(); });
    ctx.restore();
    ctx.save(); ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = 'rgba(255,190,100,0.3)'; ctx.fillRect(0, 0, W, H); ctx.restore();
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
    ctx.save(); ctx.translate(W / 2 - 6, 1110); ctx.scale(1.05, 1.05); casco(ctx); ctx.restore();
    ctx.font = '700 50px Cinzel'; ctx.letterSpacing = '14px'; ctx.fillStyle = '#e9d6b0'; ctx.fillText('UN DÍA SIENDO', W / 2 + 7, 800);
    ctx.font = '900 96px Cinzel'; ctx.letterSpacing = '3px'; ctx.fillStyle = grad(ctx, 0, 820, 0, 920, [[0, '#ffe6a6'], [1, '#b47a30']]); ctx.fillText('GLADIADOR', W / 2, 910);
    ctx.font = '700 44px Cinzel'; ctx.letterSpacing = '6px'; ctx.fillStyle = '#c9a66b'; ctx.fillText('ROMA · 90 d. C.', W / 2, 985);
    const b = smooth(rango(u, 1.4, 2.2));
    ctx.globalAlpha = b; ctx.letterSpacing = '0px';
    ctx.font = '800 40px Montserrat'; ctx.fillStyle = '#f3e3c3'; ctx.fillText('PRÓXIMO EPISODIO', W / 2, 1180);
    ctx.font = '900 76px Cinzel'; ctx.fillStyle = '#7fb8e8'; ctx.fillText('VIKINGO', W / 2, 1275);
    ctx.restore();
  }
};
