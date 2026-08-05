---
name: Python script path fix
description: Why __dirname/__import.meta.dirname breaks in esbuild ESM bundles and how Python paths are resolved.
---

## Rule
Never use `__dirname`, `import.meta.dirname`, or any relative `../python/` path to locate Python scripts in the API server. These resolve incorrectly inside the esbuild ESM bundle on Oracle VM.

**Why:** esbuild bundles all source into `dist/index.mjs`. At runtime, `import.meta.dirname` resolves to the WORKDIR (`/app`), so `join(import.meta.dirname, "../python/...")` becomes `/python/...` (filesystem root) — file not found.

## Correct pattern
```ts
const PYTHON_SCRIPTS_DIR = process.env["PYTHON_SCRIPTS_DIR"] ?? "/app/python";
const MY_SCRIPT_PY = join(PYTHON_SCRIPTS_DIR, "my_script.py");
```

Default `/app/python` matches the Docker container layout (`WORKDIR /app`, scripts at `/app/python/`).

**How to apply:** Any new file that spawns a Python script must use this pattern. Search for `import.meta.dirname` or `__dirname` + `python` before merging new route files.

## Hidden location
`src/warmup.ts` is NOT under `src/routes/` or `src/lib/` — the standard grep misses it. Always include `src/warmup.ts` in audits.

## Verification
After build, run:
```
grep "python" dist/index.mjs | head -10
```
Must show only `PYTHON_SCRIPTS_DIR` references — no `import.meta.dirname` or `../python/`.
