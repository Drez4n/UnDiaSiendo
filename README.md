# Un día siendo…

Canal de vídeos cortos (Shorts, Reels, TikTok) que cuentan el día a día de personas de distintas épocas.
Cada vídeo se genera **íntegramente con código**: sin imágenes ni vídeo de IA, sin bancos de imágenes y sin música existente.

| Pieza | Cómo se hace |
|---|---|
| Imagen | Escenas ilustradas dibujadas con Canvas 2D (`escenas.js`), renderizadas fotograma a fotograma con Playwright/Chromium |
| Voz en off | ElevenLabs (voz «Brian», grave; clave guardada como secreto del entorno, nunca en el código) con subtítulos sincronizados por letra. Alternativa local sin clave: Piper `es_ES-davefx-medium` + procesado de estudio (`motor/voz.py`) |
| Música | Composición original sintetizada con numpy (lira tipo Karplus-Strong, tambor de marco, bordón) |
| Efectos | Sintetizados (fuego, grillos, molino, cascos, gente, monedas, temblor…) |
| Subtítulos | Palabra a palabra, estilo shorts, sincronizados con la voz |
| Montaje | ffmpeg (H.264 + AAC, `+faststart`) |

## Estructura
```
motor/            # común a todos los episodios
  tts.py          # guion.json -> voz.wav + timeline.json (tiempos de escenas y palabras)
  audio.py        # música + efectos + mezcla con la voz -> mezcla.wav
  base.js         # utilidades de dibujo, subtítulos, transiciones, grano, viñeta, chip de hora
  dibujo.js       # piezas reutilizables: personajes (figura), siluetas iluminadas, cielo, estrellas, humo
  voz.py, cuota.py, limpiar_videos.py
  render.js       # render en paralelo -> video.mp4  (o --fotos 1,5,9 para capturas de revisión)
  plantilla.html, fuentes/ (Cinzel, Montserrat)
episodios/NN-nombre/
  guion.json      # texto de la voz, escenas y sonido de cada escena
  escenas.js      # el dibujo/animación de cada escena
  README.md       # investigación histórica y fuentes
  video.mp4       # resultado final
```

## Generar un episodio
```bash
pip install piper-tts pyworld pyloudnorm kokoro-onnx soundfile scipy numpy
# modelos de voz (una vez):
mkdir -p /home/user/models && cd /home/user/models
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
curl -L https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-es_ES-davefx-medium.tar.bz2 | tar xj
cd -
EP=episodios/01-panadero-pompeya
python3 motor/tts.py   $EP        # voz + línea temporal
python3 motor/audio.py $EP        # música, efectos y mezcla
node motor/render.js   $EP --fotos 5,20,40   # capturas para revisar
node motor/render.js   $EP --hilos 4         # vídeo final
```

## Automatización
Una tarea programada diaria (~9:00, hora de Madrid) produce el siguiente episodio de `episodios/cola.md` y lo programa en Metricool
para el día siguiente a las 10:00 (Instagram Reel, TikTok y YouTube Short). El proceso completo está en `docs/AUTOMATIZACION.md`.
Los vídeos se borran de GitHub 7 días después de publicarse (`motor/limpiar_videos.py`).

## Episodios
1. ✅ Panadero en Pompeya (79 d. C.)
2. ⏳ Gladiador en la antigua Roma
3. Vikingo (año 900) · 4. Faraón · 5. Campesino medieval · 6. Pirata del Caribe (1715) · 7. Caballero medieval ·
8. Samurái (1600) · 9. Constructor de pirámides · 10. Vaquero (1880) · 11. Aprendiz de Leonardo (1500) ·
12. Legionario romano (100 d. C.) · 13. Médico de la peste negra (1348) · 14. Ciudadano de Pompeya antes de la erupción
