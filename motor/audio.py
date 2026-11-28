"""Música original + efectos sintetizados + mezcla con la voz.

Uso: python3 motor/audio.py episodios/<carpeta>
Lee guion.json (bloque "sonido") y timeline.json; escribe mezcla.wav
Todo se sintetiza aquí: no se usa ninguna grabación ni canción existente.
"""
import json, os, sys
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

SR = 44100
rng = np.random.default_rng(79)

def bp(x, lo, hi, o=2):
    return sosfilt(butter(o, [lo, hi], "bandpass", fs=SR, output="sos"), x)
def lp(x, f, o=2):
    return sosfilt(butter(o, f, "lowpass", fs=SR, output="sos"), x)
def hp(x, f, o=2):
    return sosfilt(butter(o, f, "highpass", fs=SR, output="sos"), x)
def env_ad(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d)
def fade(n, fi, fo):
    e = np.ones(n); a, b = int(fi * SR), int(fo * SR)
    if a: e[:a] = np.linspace(0, 1, a) ** 1.5
    if b: e[-b:] = np.linspace(1, 0, b) ** 1.5
    return e
def add(buf, s, t, g=1.0):
    a = int(t * SR)
    if a >= len(buf): return
    s = s[: len(buf) - a]; buf[a:a + len(s)] += s * g

NOTAS = {"C":0,"C#":1,"D":2,"D#":3,"E":4,"F":5,"F#":6,"G":7,"G#":8,"A":9,"A#":10,"B":11}
def hz(semi_from_root, root="D", octv=3):
    return 440 * 2 ** ((NOTAS[root] + 12 * (octv + 1) + semi_from_root - 69) / 12)

def pluck(f, dur=2.5, bright=0.5):
    """Karplus-Strong: cuerda pulsada tipo lira."""
    n = int(dur * SR); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p); buf = lp(buf, 1500 + 5000 * bright, 1)
    out = np.empty(n); d = 0.996
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = d * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out * fade(n, 0.002, 0.3)

def frame_drum(strong=True):
    n = int(0.9 * SR); t = np.arange(n) / SR
    f = 70 + 60 * np.exp(-t * 30)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (5 if strong else 9))
    slap = bp(rng.normal(0, 1, n), 800, 4000) * np.exp(-t * 60) * 0.25
    return (body + slap) * (1 if strong else 0.5)

def drone(dur, root, octv=2, bright=600):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for semi, g in ((0, 1), (7, 0.6), (12, 0.35)):
        f = hz(semi, root, octv)
        for det in (-0.6, 0.6):
            ph = 2 * np.pi * (f + det) * t
            s += g * (2 * ((ph / (2 * np.pi)) % 1) - 1)  # sierra
    s = lp(s, bright, 2) * (0.75 + 0.25 * np.sin(2 * np.pi * 0.07 * t))
    return s / 6

ESCALA = [0, 2, 5, 7, 9, 12, 14, 17]  # pentatónica dórica (sin 3ª): antigua, neutra

def musica(seg_ini, seg_fin, modo, root, buf):
    dur = seg_fin - seg_ini
    if dur <= 0: return
    bpm = 84; beat = 60 / bpm
    base = drone(dur + 2, root, 2 if modo != "tension" else 1,
                 300 if modo in ("tension", "misterio") else 700)
    base = base[: int(dur * SR)] * fade(int(dur * SR), 0.6, 0.6)
    add(buf, base, seg_ini, {"intro":0.9,"calma":0.8,"pulso":0.8,"alegre":0.7,
                             "tension":1.6,"misterio":0.9,"cierre":0.9}[modo])
    t = seg_ini
    i = 0
    while t < seg_fin - 0.4:
        bar = i // 8
        if modo in ("intro", "calma", "pulso", "alegre"):
            dens = {"intro":0.35,"calma":0.45,"pulso":0.6,"alegre":0.8}[modo]
            if i % 2 == 0 or rng.random() < dens * 0.6:
                deg = ESCALA[(i * 3 + bar * 2 + rng.integers(0, 3)) % len(ESCALA)]
                add(buf, pluck(hz(deg, root, 4), 2.2, 0.4 + 0.3 * rng.random()), t,
                    0.22 if i % 4 == 0 else 0.14)
            if i % 8 == 0:
                add(buf, pluck(hz(0, root, 3), 3.0, 0.3), t, 0.2)
            if modo in ("pulso", "alegre"):
                if i % 4 == 0: add(buf, frame_drum(True), t, 0.45)
                elif i % 4 == 3 and rng.random() < 0.7: add(buf, frame_drum(False), t, 0.35)
                if modo == "alegre" and i % 2 == 1:
                    add(buf, hp(rng.normal(0, 1, 2000), 6000) * np.exp(-np.arange(2000) / 300), t, 0.05)
        elif modo == "tension":
            if i % 4 == 0: add(buf, frame_drum(True), t, 0.55 + 0.4 * (t - seg_ini) / dur)
            if i % 4 == 1: add(buf, frame_drum(False), t, 0.4)
        elif modo == "misterio":
            if i % 6 == 0:
                add(buf, pluck(hz(ESCALA[(i // 6) % 5 + 2], root, 5), 3.5, 0.2), t, 0.12)
        elif modo == "cierre":
            if i == 0:
                for k, semi in enumerate((0, 7, 12, 14, 19)):
                    add(buf, pluck(hz(semi, root, 3), 4.0, 0.4), t + k * 0.09, 0.18)
            break
        t += beat / 2; i += 1

# ---------- efectos ----------
def ambiente(nombre, a, b, buf):
    dur = b - a; n = int(dur * SR)
    if n <= 0: return
    f = fade(n, 0.5, 0.5); t = np.arange(n) / SR
    if nombre == "grillos":
        s = np.zeros(n)
        for c in range(3):
            fr = 4200 + 500 * c; per = 0.9 + 0.3 * c; off = rng.random()
            gate = ((t / per + off) % 1 < 0.18) * (np.sin(2 * np.pi * 28 * t) > 0)
            s += np.sin(2 * np.pi * fr * t) * lp(gate.astype(float), 300) * 0.04
        add(buf, s * f, a)
    elif nombre in ("lampara", "fuego"):
        dens, g = (40, 0.08) if nombre == "lampara" else (140, 0.25)
        s = np.zeros(n)
        k = rng.poisson(dens * dur)
        for p in rng.integers(0, n - 800, k):
            l = rng.integers(80, 700)
            s[p:p + l] += rng.normal(0, 1, l) * np.exp(-np.arange(l) / (l / 5)) * rng.uniform(0.2, 1)
        s = bp(s, 900, 7000)
        if nombre == "fuego":
            s += lp(rng.normal(0, 1, n), 400) * 0.6 * (1 + 0.3 * np.sin(2 * np.pi * 0.5 * t))
        add(buf, s * f * g, a)
    elif nombre == "molino":
        s = lp(np.cumsum(rng.normal(0, 1, n)) * 0.002, 250, 2)
        s = s / (np.abs(s).max() + 1e-9)
        s = s * (0.6 + 0.4 * np.sin(2 * np.pi * t / 6.0) ** 2) + bp(rng.normal(0, 1, n), 150, 600) * 0.25
        add(buf, s * f * 0.35, a)
    elif nombre == "cascos":
        p = 0.0
        while p < dur - 0.2:
            l = 1500
            h = bp(rng.normal(0, 1, l), 300, 2500) * np.exp(-np.arange(l) / 120)
            add(buf, h, a + p, 0.25 * (0.6 + 0.4 * rng.random()))
            p += 0.55 + 0.1 * rng.random()
    elif nombre == "amasar":
        p = 0.4
        while p < dur - 0.3:
            l = 6000; tt = np.arange(l) / SR
            th = lp(rng.normal(0, 1, l), 500) * np.exp(-tt * 25) * 2 + np.sin(2 * np.pi * 90 * tt) * np.exp(-tt * 30)
            add(buf, th, a + p, 0.35)
            p += 0.85 + 0.2 * rng.random()
    elif nombre == "gente" or nombre == "gente_lejos":
        s = np.zeros(n)
        for v in range(8):
            m = lp((rng.random(n) < 0.0009).astype(float), 3) ; m = m / (m.max() + 1e-9)
            s += bp(rng.normal(0, 1, n), 250 + 60 * v, 900 + 120 * v) * m
        s = s / (np.abs(s).max() + 1e-9)
        add(buf, s * f * (0.18 if nombre == "gente" else 0.07), a)
        if nombre == "gente":
            p = 0.2
            while p < dur - 0.3:
                l = 2500; st = bp(rng.normal(0, 1, l), 200, 1800) * np.exp(-np.arange(l) / 200)
                add(buf, st, a + p, 0.06); p += 0.45 + 0.3 * rng.random()
    elif nombre == "pajaros":
        p = 0.5
        while p < dur - 1:
            k = rng.integers(2, 5); f0 = rng.uniform(2500, 4000)
            for j in range(k):
                l = int(0.09 * SR); tt = np.arange(l) / SR
                fr = f0 * (1 + 0.4 * tt / tt[-1] * (1 if j % 2 else -1))
                add(buf, np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * tt / tt[-1]), a + p + j * 0.12, 0.05)
            p += rng.uniform(1.2, 2.8)
    elif nombre == "monedas":
        for p in np.cumsum(rng.uniform(0.35, 0.9, 12)) + 0.5:
            if p > dur - 0.5: break
            l = int(0.6 * SR); tt = np.arange(l) / SR
            c = sum(np.sin(2 * np.pi * fr * tt) * np.exp(-tt * d) for fr, d in
                    ((3100, 9), (4870, 12), (6650, 16), (8200, 20)))
            add(buf, c * rng.uniform(0.5, 1), a + p, 0.05)
    elif nombre == "temblor":
        s = lp(rng.normal(0, 1, n), 60, 4); s = s / (np.abs(s).max() + 1e-9)
        sw = np.clip(t / dur, 0, 1) ** 2
        add(buf, s * sw * fade(n, 0.1, 0.25) * 0.9, a)
    elif nombre == "golpes":  # espada de madera contra poste
        p = 0.3
        while p < dur - 0.3:
            l = 5000; tt = np.arange(l) / SR
            k = (bp(rng.normal(0, 1, l), 500, 2500) * np.exp(-tt * 45) + np.sin(2 * np.pi * 210 * tt) * np.exp(-tt * 35) * 0.6)
            add(buf, k, a + p, 0.45 * rng.uniform(0.6, 1))
            p += rng.choice([0.35, 0.5, 0.8])
    elif nombre in ("multitud", "multitud_lejos"):
        s = np.zeros(n)
        for v in range(14):
            m = lp((rng.random(n) < 0.002).astype(float), 2); m = m / (m.max() + 1e-9)
            s += bp(rng.normal(0, 1, n), 200 + 40 * v, 1200 + 150 * v) * (0.5 + m)
        s = s / (np.abs(s).max() + 1e-9)
        ola = 0.7 + 0.3 * np.sin(2 * np.pi * t / 4.5) ** 2
        if nombre == "multitud_lejos":
            s = lp(s, 500, 2) * 2.5
        add(buf, s * ola * f * (0.5 if nombre == "multitud" else 0.3), a)
    elif nombre == "pasos":
        p = 0.3
        while p < dur - 0.3:
            l = 9000; tt = np.arange(l) / SR
            st = bp(rng.normal(0, 1, l), 150, 1500) * np.exp(-tt * 40)
            st = st + np.concatenate([np.zeros(1800), st[:-1800]]) * 0.35  # eco del túnel
            add(buf, st, a + p, 0.22); p += 0.62
    elif nombre == "olas":  # oleaje y salpicaduras contra el casco
        s = lp(rng.normal(0, 1, n), 700, 2)
        env = 0.45 + 0.55 * np.sin(2 * np.pi * t / 3.2) ** 2
        s = s / (np.abs(s).max() + 1e-9) * env + bp(rng.normal(0, 1, n), 2000, 7000) * env ** 3 * 0.15
        add(buf, s * f * 0.4, a)
    elif nombre == "viento":
        s = bp(rng.normal(0, 1, n), 200, 1200) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.11 * t + 1) ** 2)
        add(buf, s * f * 0.05, a)

def main(ep):
    g = json.load(open(os.path.join(ep, "guion.json"), encoding="utf-8"))
    tl = json.load(open(os.path.join(ep, "timeline.json"), encoding="utf-8"))
    total = tl["duracion"]; n = int(total * SR)
    mus = np.zeros(n + SR * 5); amb = np.zeros_like(mus)
    root = g.get("tono", "D")
    for e in tl["escenas"]:
        cfg = g["sonido"].get(e["id"], {})
        musica(e["ini"], e["fin"] + (3 if e["id"] == tl["escenas"][-1]["id"] else 0), cfg.get("musica", "calma"), root, mus)
        for a in cfg.get("ambiente", []):
            ambiente(a, max(0, e["ini"] - 0.3), e["fin"] + 0.3, amb)
    v, vsr = sf.read(os.path.join(ep, "voz.wav"))
    v = resample_poly(v, SR, vsr)
    voz = np.zeros_like(mus); voz[: len(v)] = v[: len(voz)]
    # compresión lateral: la música baja cuando habla la voz
    e = lp(np.abs(voz), 3, 1); e = e / (e.max() + 1e-9)
    duck = 1 - 0.55 * np.clip(e * 4, 0, 1)
    mus = mus / (np.abs(mus).max() + 1e-9) * 0.45
    amb = amb / (np.abs(amb).max() + 1e-9) * 0.35
    mix = voz * 1.0 + mus * duck + amb * (0.6 + 0.4 * duck)
    mix = mix[: int((total) * SR)] * fade(int(total * SR), 0.05, 1.2)
    mix = mix / (np.abs(mix).max() + 1e-9) * 1.05
    k = 0.8; m = np.abs(mix) > k  # limitador suave sólo en los picos
    mix[m] = np.sign(mix[m]) * (k + 0.15 * np.tanh((np.abs(mix[m]) - k) / 0.15))
    sf.write(os.path.join(ep, "mezcla.wav"), mix.astype(np.float32), SR)
    print("mezcla.wav", round(len(mix) / SR, 2), "s")

if __name__ == "__main__":
    main(sys.argv[1])
