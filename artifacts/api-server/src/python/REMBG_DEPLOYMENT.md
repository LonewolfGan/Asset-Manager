# rembg / numba — Deployment Notes

## Current Status

rembg **works on Replit** as of rembg 2.0.77 + onnxruntime 1.28.0 + Python 3.12.
The earlier note about JIT/numba being blocked is outdated — modern rembg uses
ONNX Runtime only and does not require numba's JIT compilation at runtime.

Dependencies are pinned in `pyproject.toml` and installed via `pip install "rembg[cpu]" Pillow`.

## How background removal works

The API server calls `bg_remove.py` as a subprocess:

1. `POST /api/remove-background` (multipart `file` field) → `background.ts` route
2. Route writes the upload to a temp file, calls `python3 bg_remove.py --input … --output …`
3. Script loads the ONNX model (u2net or isnet-general-use), runs inference, writes transparent PNG
4. Route reads the output PNG and streams it back with `Content-Type: image/png`

The frontend also ships a client-side fallback via `@imgly/background-removal` (WASM)
for cases where the API is unavailable.

## Models

| Model | First-use download | Quality |
|---|---|---|
| `u2net` | ~176 MB | Good general-purpose |
| `isnet-general-use` | ~178 MB | Better detail on complex edges |

Models are cached in `~/.u2net/` after the first download.

## Dependencies

```bash
pip install "rembg[cpu]" Pillow
# or GPU:
pip install "rembg[gpu]" Pillow
```

Listed in `pyproject.toml` — run `pip install -e .` or `uv sync` on the target platform.

## Notes

- First request triggers model download if the model isn't cached — may take a few seconds.
- The isnet-general-use model is tried first; falls back to u2net if unavailable.
- Works on Replit, Render, Railway, Fly.io, and any standard Linux environment.
