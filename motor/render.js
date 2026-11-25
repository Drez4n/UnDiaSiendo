// Render de un episodio: node motor/render.js episodios/<carpeta> [--fps 30] [--hilos 3]
//   [--fotos 1,5.5,12]  -> sólo guarda capturas PNG de esos segundos (revisión)
//   [--desde a --hasta b] -> render parcial (vista previa)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const args = process.argv.slice(2);
const ep = path.resolve(args[0]);
const opt = k => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : null; };
const FPS = +(opt('fps') || 30), HILOS = +(opt('hilos') || 3);
const motor = __dirname;
const tl = JSON.parse(fs.readFileSync(path.join(ep, 'timeline.json'), 'utf8'));

async function pagina(browser) {
  const p = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('console', m => { if (m.type() === 'error') console.error('[página]', m.text()); });
  p.on('pageerror', e => console.error('[página]', e.message));
  await p.goto('file://' + path.join(motor, 'plantilla.html'));
  await p.addScriptTag({ path: path.join(motor, 'base.js') });
  await p.addScriptTag({ path: path.join(ep, 'escenas.js') });
  await p.evaluate(t => window.preparar(t), tl);
  return p;
}

(async () => {
  const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
  const fotos = opt('fotos');
  if (fotos) {
    const p = await pagina(browser); const dir = path.join(ep, 'capturas'); fs.mkdirSync(dir, { recursive: true });
    for (const s of fotos.split(',').map(Number)) {
      const d = await p.evaluate(t => window.renderFrame(t, 0.9), s);
      fs.writeFileSync(path.join(dir, `t${s.toFixed(2)}.jpg`), Buffer.from(d.split(',')[1], 'base64'));
    }
    console.log('capturas en', dir); await browser.close(); return;
  }
  const desde = +(opt('desde') || 0), hasta = +(opt('hasta') || tl.duracion);
  const f0 = Math.round(desde * FPS), f1 = Math.round(hasta * FPS);
  const tmp = path.join(ep, '.tmp'); fs.mkdirSync(tmp, { recursive: true });
  const tramo = Math.ceil((f1 - f0) / HILOS);
  const t0 = Date.now();
  await Promise.all([...Array(HILOS).keys()].map(async h => {
    const a = f0 + h * tramo, b = Math.min(f1, a + tramo); if (a >= b) return;
    const p = await pagina(browser);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', path.join(tmp, `parte${h}.mp4`)]);
    for (let f = a; f < b; f++) {
      const d = await p.evaluate(t => window.renderFrame(t), f / FPS);
      const buf = Buffer.from(d.split(',')[1], 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (h === 0 && (f - a) % 150 === 0) console.log(`  hilo 0: ${f - a}/${b - a} fotogramas (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }));
  await browser.close();
  const lista = path.join(tmp, 'lista.txt');
  fs.writeFileSync(lista, [...Array(HILOS).keys()].filter(h => fs.existsSync(path.join(tmp, `parte${h}.mp4`))).map(h => `file 'parte${h}.mp4'`).join('\n'));
  const salida = path.join(ep, opt('salida') || (desde || opt('hasta') ? 'vista_previa.mp4' : 'video.mp4'));
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-ss', String(desde), '-t', String(hasta - desde),
    '-i', path.join(ep, 'mezcla.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log(`Listo: ${salida} en ${((Date.now() - t0) / 1000).toFixed(0)}s`);
})();
