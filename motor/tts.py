"""Genera la voz en off de un episodio y la línea temporal (timeline.json).

Uso: python3 motor/tts.py episodios/<carpeta>
Cada línea del guion se sintetiza por separado con Kokoro; se calculan los
tiempos de cada palabra (proporcionales a su longitud) para los subtítulos.
"""
import json, sys, os, re
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np, soundfile as sf
import voz as V

PAUSA = 0.35          # silencio entre frases de la misma escena
PAUSA_ESCENA = 0.75   # silencio extra al cambiar de escena
COLA_FINAL = 4.0      # segundos de la escena final (sin voz)

def main(ep):
    g = json.load(open(os.path.join(ep, "guion.json"), encoding="utf-8"))
    motor = g.get("voz", "piper:es_ES-davefx-medium")
    t, pistas, lineas = 0.6, [], []
    prev = None
    for ln in g["lineas"]:
        if prev is not None and ln["escena"] != prev:
            t += PAUSA_ESCENA
        prev = ln["escena"]
        if not ln["texto"]:
            lineas.append({**ln, "ini": t, "fin": t + COLA_FINAL, "palabras": []})
            t += COLA_FINAL
            continue
        s, sr = V.sintetizar(ln["texto"], motor, g.get("velocidad", 1.0))
        s, sr = V.procesar(s, sr, g.get("grave", 0.76), g.get("formantes", 0.95))
        SR = sr
        # recorta silencios de los extremos
        idx = np.where(np.abs(s) > 0.02)[0]
        s = s[max(idx[0] - int(0.01 * sr), 0): idx[-1] + int(0.03 * sr)]
        dur = len(s) / sr
        pistas.append((t, s))
        sub = ln.get("sub", ln["texto"]).replace("...", "…")
        sub = sub.replace("d. C.", "d.\u00a0C.")
        pal = sub.split(" ")
        pesos = [len(re.sub(r"\W", "", p)) + 2 for p in pal]
        tot, acc, palabras = sum(pesos), 0, []
        for p, w in zip(pal, pesos):
            palabras.append({"p": p, "ini": round(t + dur * acc / tot, 3),
                             "fin": round(t + dur * (acc + w) / tot, 3)})
            acc += w
        lineas.append({**ln, "ini": round(t, 3), "fin": round(t + dur, 3), "palabras": palabras})
        t += dur + PAUSA
    total = t + 0.2
    voz = np.zeros(int(total * SR) + SR, dtype=np.float32)
    for ini, s in pistas:
        a = int(ini * SR); voz[a:a + len(s)] += s
    sf.write(os.path.join(ep, "voz.wav"), voz, SR)
    # escenas: intervalo continuo de cada escena
    escenas = []
    for ln in lineas:
        if escenas and escenas[-1]["id"] == ln["escena"]:
            escenas[-1]["fin"] = ln["fin"]
        else:
            escenas.append({"id": ln["escena"], "ini": ln["ini"], "fin": ln["fin"]})
    for a, b in zip(escenas, escenas[1:]):
        a["fin"] = b["ini"] = round((a["fin"] + b["ini"]) / 2, 3)
    escenas[0]["ini"] = 0
    escenas[-1]["fin"] = round(total, 3)
    out = {"duracion": round(total, 3), "titulo": g["titulo"], "subtitulo": g["subtitulo"],
           "escenas": escenas, "lineas": lineas}
    json.dump(out, open(os.path.join(ep, "timeline.json"), "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"Duración: {total:.1f}s")
    for e in escenas: print(f"  {e['id']:10s} {e['ini']:6.2f} → {e['fin']:6.2f}")

if __name__ == "__main__":
    main(sys.argv[1])
