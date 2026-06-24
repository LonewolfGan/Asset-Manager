# rembg / numba — Notes de déploiement

## Situation actuelle

Le background remover utilise **@imgly/background-removal** (modèle medium, WASM,
côté client) — fonctionnel dans le sandbox Replit et suffisant pour le développement.

## Pourquoi rembg ne tourne pas sur Replit

`rembg` dépend de `numba`, qui requiert la compilation JIT (LLVM/LLVMLITE) à l'import.
Le sandbox Replit bloque cette étape (absence de permissions de compilation JIT native).
Ce n'est pas un bug du code — c'est une restriction d'environnement connue.

## Ce qui fonctionnera au déploiement

Sur **Render, Vercel (fonctions), ou tout VPS classique** (Ubuntu/Debian avec Python 3.10+),
`numba` compile normalement. Le code rembg ci-dessous tournera sans modification.

## Code prêt à déployer (Python)

```python
# artifacts/api-server/src/python/bg_remove.py
# CE MODULE NÉCESSITE numba/JIT.
# Ne fonctionne pas dans le sandbox Replit (blocage JIT).
# Fonctionnera normalement sur Render / Vercel / VPS classique.
# À tester en priorité après le déploiement initial.

from rembg import remove
from PIL import Image
import io, sys, json, base64

def remove_background(input_bytes: bytes) -> bytes:
    """Supprime l'arrière-plan d'une image via rembg (modèle u2net)."""
    output = remove(input_bytes)
    return output

if __name__ == "__main__":
    # Interface stdin→stdout pour le pont Node.js (voir callPythonScript pattern)
    payload = json.loads(sys.stdin.read())
    img_bytes = base64.b64decode(payload["image"])
    result = remove_background(img_bytes)
    print(json.dumps({"result": base64.b64encode(result).decode()}))
```

## Dépendances à installer sur la plateforme cible

```
rembg[gpu]   # ou rembg (CPU only) selon la machine
onnxruntime  # (ou onnxruntime-gpu)
Pillow
```

```bash
pip install rembg Pillow
# ou GPU :
pip install "rembg[gpu]" Pillow
```

## Checklist déploiement

- [ ] `pip install rembg Pillow` sur la machine cible
- [ ] Vérifier `import numba` ne lève pas d'erreur
- [ ] Tester `bg_remove.py` avec une image de test avant d'exposer la route
- [ ] Câbler la route `/api/bg-remove` dans `artifacts/api-server/src/routes/` en appelant ce script Python via le pattern `callPythonScript` existant (voir `lib/` pour le pattern)
- [ ] Désactiver ou garder @imgly côté client en fallback si la route server-side n'est pas disponible
