# Producción diaria automática — guía para la sesión de Claude

Esta guía la sigue la **tarea programada diaria (~9:00, Europe/Madrid)**. Cada ejecución produce **un episodio** del canal
«Un día siendo…» y lo deja **programado en Metricool para el día siguiente a las 10:00**. Empiezas sin contexto: todo lo
necesario está aquí y en el episodio 1 (`episodios/01-panadero-pompeya/`), que es la **referencia de calidad y estilo**.

## 0. Preparación (cada ejecución)
1. Rama: trabaja y haz push en la rama por defecto del repo, **`claude/dazzling-cray-fh0gdy`** (autorizado por el
   usuario: el vídeo debe quedar en esa rama porque la URL pública que lee Metricool apunta a ella).
   `git fetch origin claude/dazzling-cray-fh0gdy && git checkout claude/dazzling-cray-fh0gdy && git pull`.
2. Dependencias (si faltan): `pip install -q piper-tts pyworld pyloudnorm soundfile scipy numpy`. Chromium + Playwright y
   ffmpeg ya están instalados (`require('playwright')` funciona; no reinstales Playwright).
3. **Limpieza:** `python3 motor/limpiar_videos.py` (borra del árbol los vídeos publicados hace ≥7 días).
4. Comprueba en Metricool (`getScheduledPosts`, marca `8392255`, zona `Europe/Madrid`) que **mañana a las 10:00 no hay ya
   un vídeo programado**. Si lo hay, no produzcas otro: termina avisando de que ya estaba cubierto.

## 1. Elegir el episodio
Primer episodio `pendiente` de `episodios/cola.md`. Si quedan menos de 3 pendientes, añade ideas nuevas al final de la cola.

## 2. Investigar (obligatorio, con fuentes)
Busca en la web (modo standard; extended solo si hace falta) datos **concretos y verificables** de la vida cotidiana de ese
personaje: horario, herramientas, comida, ropa, lugares, objetos, cifras. Evita mitos. Apunta las fuentes en el `README.md`
del episodio (como en el episodio 1). No inventes cifras: si un dato no está confirmado, no lo uses.

## 3. Guion — `episodios/NN-nombre/guion.json`
Copia la estructura del episodio 1. Reglas de estilo:
- **Segunda persona** («Imagina que…», «Tu jornada empieza…»). Gancho en la 1.ª frase: época + quién eres.
- **8–10 escenas** con un hilo horario (madrugada → noche). Cada escena 1–3 frases cortas. ~150–180 palabras en total
  (≈ 75–90 s). Máx. ~950 caracteres de texto hablado (cuota de ElevenLabs).
- Números **escritos con letras** en `texto` («setenta y nueve») y con cifras en `sub` (subtítulo) cuando ayude.
- Un **dato sorprendente** en mitad del vídeo (con infografía) y un **final con giro o ironía** que haga pensar.
- Escena `final` con texto vacío (tarjeta de cierre) que anuncia el **siguiente episodio de la cola**.
- Bloque `sonido`: para cada escena, `musica` (intro, calma, pulso, alegre, tension, misterio, cierre) y `ambiente`
  (viento, grillos, lampara, fuego, molino, cascos, amasar, gente, gente_lejos, pajaros, monedas, temblor). Si necesitas un
  efecto nuevo, añádelo en `motor/audio.py` (sintetizado, nunca grabaciones ni música existente).
- Voz: copia del episodio 1 los campos `voz` (`elevenlabs:nPczCjzI2devNBz1zQrb`, «Brian»), `modelo`, `ajustes`,
  `grave`, `formantes`, `eq`.

## 4. Cuota de voz
`python3 motor/cuota.py episodios/NN-nombre`. Si sale con código 3 (no hay caracteres suficientes): **para**, no uses la voz
local (al usuario no le gusta), deja el episodio como `pendiente`, haz commit del guion y termina avisando de que se ha
acabado el saldo de ElevenLabs (cuenta gratuita, 10.000 caracteres/mes).

## 5. Voz, línea temporal y audio
```
python3 motor/tts.py   episodios/NN-nombre   # voz ElevenLabs + timeline.json con tiempos por palabra
python3 motor/audio.py episodios/NN-nombre   # música original + efectos + mezcla
```

## 6. Escenas — `episodios/NN-nombre/escenas.js`
Dibujo 100 % con Canvas 2D. Mira `episodios/01-panadero-pompeya/escenas.js` como plantilla y reutiliza:
- `motor/base.js`: `ESCENAS[id] = {init(), dibujar(ctx, u, dur, t, e)}`, `RELOJ[id]` (chip de hora, p. ej. `'06:00 · El entrenamiento'`),
  `TRANSICION[id]` (`'negro'` o segundos), `camara`, `grad`, `radial`, `brillo`, `particulas`, `cacheado`, `smooth`, `rango`, `ruido1`…
- `motor/dibujo.js`: `figura()` (personaje con ropa, brazos, caminar, objeto en mano), `iluminado()` (silueta con luz de contorno),
  `cielo`, `estrellas`, `humo`, `mezcla`.
Pautas visuales (las del episodio 1): 1080×1920 vertical; ilustración plana con degradados, luz cálida/fría motivada (fuego,
lámpara, amanecer), partículas (polvo, chispas, humo), cámara lenta (zoom/desplazamiento suave) en cada escena;
**título en Cinzel** en la escena 1 («UN DÍA SIENDO» / NOMBRE GRANDE dorado / lugar / año); deja libre la franja
1330–1560 px para los subtítulos y la zona superior 170–270 px para el chip de hora; nada de texto anacrónico; personajes
coherentes entre escenas (misma ropa y colores). La escena final reutiliza el estilo de tarjeta del episodio 1
(«PRÓXIMO EPISODIO: …»). Rigor histórico en ropa, objetos y arquitectura.

## 7. Revisión visual (obligatoria)
`node motor/render.js episodios/NN-nombre --fotos <un segundo en mitad de cada escena, separados por comas>` y monta una
hoja de contactos (PIL) para **mirarla**. Corrige: elementos flotando o cortados, personajes deformes, texto tapado,
escenas vacías o demasiado oscuras, solapes con subtítulos. Repite hasta que esté al nivel del episodio 1.

## 8. Render final
`node motor/render.js episodios/NN-nombre --hilos 4 --grano 0.03 --crf 20 --preset slow` → `video.mp4` (~30–40 MB).
**No lo recomprimas.** Comprueba duración y audio con `ffprobe`.

## 9. Publicar
1. Commit (guion, escenas, timeline, README, video.mp4, cola.md actualizada) y push a `claude/dazzling-cray-fh0gdy`.
2. Comprueba que la URL pública responde 200 con el tamaño correcto:
   `https://raw.githubusercontent.com/Drez4n/UnDiaSiendo/claude/dazzling-cray-fh0gdy/episodios/NN-nombre/video.mp4`
3. `createScheduledPost` en Metricool, marca **`8392255`**, fecha **mañana 10:00** (`publicationDate` con zona `Europe/Madrid`):
   - `providers`: instagram, tiktok, youtube. `autoPublish: true`, `draft: false`, `videoCoverMilliseconds: 2500`.
   - `instagramData`: `{"type":"REEL","showReelOnFeed":true,"isAiGenerated":true}`
   - `tiktokData`: `{"title":"<título>","privacyOption":"PUBLIC_TO_EVERYONE","isAigc":true, ...flags a false}` (el título es obligatorio)
   - `youtubeData`: `{"title":"<título>","type":"short","privacy":"public","category":"EDUCATION","madeForKids":false,"isAiGeneratedContent":true,"tags":[...]}`
   - Título: `Un día siendo <NOMBRE EN MAYÚSCULAS> en <lugar> (<año>) <2 emojis>`.
   - Texto (mismo formato que el episodio 1): pregunta gancho + emojis; 2–3 frases con los datos más llamativos;
     `👉 Sígueme para el próximo episodio: un día siendo <SIGUIENTE> <emoji>`; 6–9 hashtags en español
     (#historia #undiasiendo + específicos); última línea **`Voz: ElevenLabs`** (obligatorio en el plan gratuito).
4. Guarda `episodios/NN-nombre/publicacion.json` (fecha, zona, redes, `metricool_uuid`, `video_borrado_de_github: false`),
   marca el episodio como `programado AAAA-MM-DD` en `cola.md`, commit y push.

## 10. Informe final
Termina con un resumen corto en español: episodio, fecha/hora de publicación, enlace `plannerUrl` de Metricool, duración,
caracteres de ElevenLabs que quedan y cualquier problema. Si algo falló y no se pudo programar, dilo claramente.
