"""Borra de GitHub (del árbol actual) los video.mp4 publicados hace más de 7 días.
Metricool guarda su propia copia al programar, así que no afecta a la publicación.
Uso: python3 motor/limpiar_videos.py  (luego git commit + push)"""
import json, glob, os, subprocess, datetime
from zoneinfo import ZoneInfo
ahora = datetime.datetime.now(ZoneInfo("Europe/Madrid"))
for pub in sorted(glob.glob("episodios/*/publicacion.json")):
    d = json.load(open(pub, encoding="utf-8"))
    fecha = datetime.datetime.fromisoformat(d["fecha"]).replace(tzinfo=ZoneInfo(d.get("zona", "Europe/Madrid")))
    video = os.path.join(os.path.dirname(pub), "video.mp4")
    if (ahora - fecha).days >= 7 and os.path.exists(video):
        subprocess.run(["git", "rm", "-q", video], check=True)
        d["video_borrado_de_github"] = True
        json.dump(d, open(pub, "w", encoding="utf-8"), ensure_ascii=False)
        print("borrado", video)
