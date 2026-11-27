"""Comprueba si quedan caracteres de ElevenLabs para un guion.
Uso: python3 motor/cuota.py episodios/<carpeta>   -> sale con código 0 si hay saldo, 3 si no.
La clave la inyecta el proxy del entorno (no hace falta variable de entorno)."""
import json, sys, os, urllib.request
g = json.load(open(os.path.join(sys.argv[1], "guion.json"), encoding="utf-8"))
necesarios = sum(len(l["texto"]) for l in g["lineas"])
req = urllib.request.Request("https://api.elevenlabs.io/v1/user/subscription",
                             headers={"xi-api-key": os.environ.get("ELEVENLABS_API_KEY", "proxy-injected")})
d = json.load(urllib.request.urlopen(req, timeout=30))
quedan = d["character_limit"] - d["character_count"]
print(f"ElevenLabs: necesita {necesarios} caracteres, quedan {quedan} de {d['character_limit']} (plan {d.get('tier')})")
sys.exit(0 if quedan >= necesarios * 1.1 else 3)
