import { Router, type IRouter } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { tmpdir } from "os";
import { writeFile, readFile, unlink } from "fs/promises";
import { upload, guardBackground } from "../middlewares/upload.js";

const router: IRouter = Router();
const execFileAsync = promisify(execFile);

// Path to the rembg Python script (runs on Render/VPS — not in Replit sandbox)
const BG_REMOVE_PY = join(import.meta.dirname, "../python/bg_remove.py");

// ── @imgly route (current — works everywhere including Replit) ────────────────

// Cache the removeBackground function after first import to avoid
// reloading the ONNX model and WASM runtime on every request.
type RemoveBgFn = typeof import("@imgly/background-removal-node").removeBackground;
let removeBgFn: RemoveBgFn | null = null;

async function getRemoveBackground(): Promise<RemoveBgFn> {
  if (!removeBgFn) {
    const mod = await import("@imgly/background-removal-node");
    removeBgFn = mod.removeBackground;
  }
  return removeBgFn;
}

router.post(
  "/remove-background",
  upload.single("file"),
  guardBackground,
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    try {
      const removeBackground = await getRemoveBackground();

      const inputBlob = new Blob([req.file.buffer], { type: req.file.mimetype });

      const resultBlob = await removeBackground(inputBlob, {
        model: "medium",
        output: { format: "image/png" },
      });

      const arrayBuffer = await resultBlob.arrayBuffer();
      const outBuffer = Buffer.from(arrayBuffer);

      res.set("Content-Type", "image/png");
      res.set("Content-Disposition", `attachment; filename="no-bg.png"`);
      res.set("Cache-Control", "no-store");
      res.send(outBuffer);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Background removal failed";
      res.status(500).json({ error: message });
    }
  },
);

// ── rembg route (Render/VPS only — requires numba/JIT, not Replit sandbox) ───
//
// POST /api/remove-background-rembg
//   Body: multipart/form-data with field "file" (image)
//
// Uses bg_remove.py via Python subprocess. rembg produces higher-quality
// results than @imgly for complex subjects. Deploy on Render — the Dockerfile
// installs rembg + all dependencies. Test this endpoint after first deploy.

router.post(
  "/remove-background-rembg",
  upload.single("file"),
  guardBackground,
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const id = `rembg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const inputPath  = join(tmpdir(), `${id}-in.${req.file.mimetype === "image/png" ? "png" : "jpg"}`);
    const outputPath = join(tmpdir(), `${id}-out.png`);

    try {
      // Write uploaded buffer to temp file
      await writeFile(inputPath, req.file.buffer);

      // Call rembg Python script
      await execFileAsync("python3", [BG_REMOVE_PY, "--input", inputPath, "--output", outputPath], {
        timeout: 120_000, // 2 min max — first run downloads u2net model
      });

      const outBuffer = await readFile(outputPath);

      res.set("Content-Type", "image/png");
      res.set("Content-Disposition", `attachment; filename="no-bg.png"`);
      res.set("Cache-Control", "no-store");
      res.send(outBuffer);
    } catch (err) {
      const stderr = (err as { stderr?: string }).stderr ?? "";
      const message = err instanceof Error ? err.message : "rembg processing failed";

      if (stderr.includes("numba") || stderr.includes("llvmlite") || stderr.includes("JIT")) {
        res.status(503).json({
          error: "rembg requires numba/JIT — not available in this environment. Use /remove-background instead.",
          detail: stderr.slice(0, 400),
        });
      } else {
        res.status(500).json({ error: message, detail: stderr.slice(0, 400) });
      }
    } finally {
      // Clean up temp files regardless of success/failure
      await unlink(inputPath).catch(() => {});
      await unlink(outputPath).catch(() => {});
    }
  },
);

export default router;
