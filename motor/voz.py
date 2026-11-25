"""Síntesis de voz + procesado de estudio («voz de documental»).

sintetizar(texto, motor) -> (audio float32, sr)
    motor: "piper:es_ES-davefx-medium", "piper:es_ES-sharvard-medium#0", "kokoro:em_alex"…
procesar(audio, sr, grave, formantes) -> (audio float32, 44100)
    1. WORLD: baja el tono (grave) y desplaza los formantes (formantes) -> voz más profunda
    2. EQ de estudio: paso alto 70 Hz, proximidad +4 dB a 110 Hz, -3 dB a 320 Hz (caja),
       presencia +2,5 dB a 3,2 kHz, -2 dB a 7 kHz (sibilantes), brillo suave
    3. Compresor RMS 3:1 + normalización a -16 LUFS + limitador de picos
"""
import glob, os
import numpy as np
from scipy.signal import lfilter, resample_poly, butter, sosfilt

MODELOS = os.environ.get("MODELOS_DIR", "/home/user/models")
SR_OUT = 44100
_cache = {}

def elevenlabs(texto, voz_id, anterior="", siguiente="", modelo="eleven_multilingual_v2", ajustes=None):
    """Devuelve (audio float32, sr, [(palabra, ini, fin)]) usando /with-timestamps.
    La clave la inyecta el proxy del entorno (cabecera xi-api-key)."""
    import json, base64, subprocess, io, urllib.request
    import soundfile as sf
    cuerpo = {"text": texto, "model_id": modelo, "language_code": "es",
              "voice_settings": ajustes or {"stability": 0.5, "similarity_boost": 0.8, "style": 0.2, "use_speaker_boost": True}}
    if anterior: cuerpo["previous_text"] = anterior
    if siguiente: cuerpo["next_text"] = siguiente
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voz_id}/with-timestamps?output_format=mp3_44100_128",
        data=json.dumps(cuerpo).encode(), method="POST",
        headers={"Content-Type": "application/json", "xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")})
    d = json.load(urllib.request.urlopen(req, timeout=120))
    mp3 = base64.b64decode(d["audio_base64"])
    wav = subprocess.run(["ffmpeg", "-v", "error", "-i", "-", "-f", "wav", "-ac", "1", "-"], input=mp3, capture_output=True).stdout
    a, sr = sf.read(io.BytesIO(wav))
    al = d.get("alignment") or d.get("normalized_alignment")
    palabras, cur, ini = [], "", None
    for ch, t0, t1 in zip(al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]):
        if ch.isspace():
            if cur: palabras.append((cur, ini, fin)); cur = ""
            continue
        if not cur: ini = t0
        cur += ch; fin = t1
    if cur: palabras.append((cur, ini, fin))
    return a.astype(np.float32), sr, palabras

def sintetizar(texto, motor, velocidad=1.0):
    tipo, nombre = motor.split(":", 1)
    if tipo == "kokoro":
        from kokoro_onnx import Kokoro
        if "kokoro" not in _cache:
            _cache["kokoro"] = Kokoro(f"{MODELOS}/kokoro-v1.0.onnx", f"{MODELOS}/voices-v1.0.bin")
        s, sr = _cache["kokoro"].create(texto, voice=nombre, speed=velocidad, lang="es")
        return s.astype(np.float32), sr
    from piper import PiperVoice
    from piper.config import SynthesisConfig
    nombre, _, sid = nombre.partition("#")
    if nombre not in _cache:
        d = f"{MODELOS}/vits-piper-{nombre}"
        _cache[nombre] = PiperVoice.load(f"{d}/{nombre}.onnx", config_path=f"{d}/{nombre}.onnx.json")
    v = _cache[nombre]
    cfg = SynthesisConfig(speaker_id=int(sid) if sid else None, length_scale=1.0 / velocidad,
                          noise_scale=0.6, noise_w_scale=0.7)
    a = np.concatenate([c.audio_float_array for c in v.synthesize(texto, syn_config=cfg)])
    return a.astype(np.float32), v.config.sample_rate

# ---------- filtros (RBJ cookbook) ----------
def _biquad(x, sr, tipo, f, gain_db=0.0, q=0.707):
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f / sr; cw, sw = np.cos(w), np.sin(w); al = sw / (2 * q)
    if tipo == "peak":
        b = [1 + al * A, -2 * cw, 1 - al * A]; a = [1 + al / A, -2 * cw, 1 - al / A]
    elif tipo == "lowshelf":
        r = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) - (A - 1) * cw + r), 2 * A * ((A - 1) - (A + 1) * cw), A * ((A + 1) - (A - 1) * cw - r)]
        a = [(A + 1) + (A - 1) * cw + r, -2 * ((A - 1) + (A + 1) * cw), (A + 1) + (A - 1) * cw - r]
    elif tipo == "highshelf":
        r = 2 * np.sqrt(A) * al
        b = [A * ((A + 1) + (A - 1) * cw + r), -2 * A * ((A - 1) + (A + 1) * cw), A * ((A + 1) + (A - 1) * cw - r)]
        a = [(A + 1) - (A - 1) * cw + r, 2 * ((A - 1) - (A + 1) * cw), (A + 1) - (A - 1) * cw - r]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x)

def _compresor(x, sr, umbral_db=-22, ratio=3.0, ataque=0.005, rel=0.09):
    pot = x ** 2
    a1, r1 = np.exp(-1 / (ataque * sr)), np.exp(-1 / (rel * sr))
    # seguidor de envolvente RMS (ataque/relajación aproximados con dos filtros)
    env_a = lfilter([1 - a1], [1, -a1], pot); env_r = lfilter([1 - r1], [1, -r1], pot)
    env = np.sqrt(np.maximum(env_a, env_r)) + 1e-9
    db = 20 * np.log10(env)
    red = np.where(db > umbral_db, (db - umbral_db) * (1 - 1 / ratio), 0.0)
    return x * 10 ** (-red / 20)

def _limitador(x, techo=0.95):
    # limitador suave sólo por encima del 80 % del techo (sin distorsión en el resto)
    k = 0.8 * techo; y = x.copy(); m = np.abs(x) > k
    y[m] = np.sign(x[m]) * (k + (techo - k) * np.tanh((np.abs(x[m]) - k) / (techo - k)))
    return y

def procesar(audio, sr, grave=0.76, formantes=0.95, eq="fuerte"):
    x = audio.astype(np.float64)
    if grave != 1.0 or formantes != 1.0:
        import pyworld as pw
        f0, t = pw.harvest(x, sr, f0_floor=55, f0_ceil=350, frame_period=5.0)
        f0 = pw.stonemask(x, f0, t, sr)
        sp = pw.cheaptrick(x, f0, t, sr)
        ap = pw.d4c(x, f0, t, sr)
        n = sp.shape[1]; idx = np.arange(n) / formantes
        sp2 = np.empty_like(sp); ap2 = np.empty_like(ap)
        for i in range(sp.shape[0]):
            sp2[i] = np.interp(idx, np.arange(n), sp[i], right=sp[i, -1] * 1e-3)
            ap2[i] = np.interp(idx, np.arange(n), ap[i], right=1.0)
        x = pw.synthesize(f0 * grave, sp2, ap2, sr, frame_period=5.0)
    x = resample_poly(x, SR_OUT, sr)
    sr = SR_OUT
    x = sosfilt(butter(2, 60, "highpass", fs=sr, output="sos"), x)
    if eq == "fuerte":
        x = _biquad(x, sr, "lowshelf", 110, +4.0, 0.8)
        x = _biquad(x, sr, "peak", 320, -3.0, 1.0)
        x = _biquad(x, sr, "peak", 3200, +2.5, 0.9)
        x = _biquad(x, sr, "peak", 7000, -2.0, 2.0)
        # brillo: armónicos suaves por encima de 5 kHz (la voz sintética de 22 kHz no tiene «aire»)
        alto = sosfilt(butter(2, 3500, "highpass", fs=sr, output="sos"), x)
        aire = sosfilt(butter(2, 9000, "highpass", fs=sr, output="sos"), np.tanh(alto * 4) / 4)
        x = x + aire * 0.35
    elif eq == "suave":  # voz ya de estudio: sólo un toque de cuerpo y presencia
        x = _biquad(x, sr, "lowshelf", 100, +1.5, 0.8)
        x = _biquad(x, sr, "peak", 300, -1.5, 1.0)
        x = _biquad(x, sr, "peak", 3500, +1.0, 0.9)
    x = x / (np.abs(x).max() + 1e-9) * 0.5
    x = _compresor(x, sr, ratio=3.0 if eq == 'fuerte' else 2.0)
    try:
        import pyloudnorm as pyln
        loud = pyln.Meter(sr).integrated_loudness(x)
        x = x * 10 ** ((-16 - loud) / 20)
    except Exception:
        x = x / (np.abs(x).max() + 1e-9) * 0.8
    return _limitador(x).astype(np.float32), sr
