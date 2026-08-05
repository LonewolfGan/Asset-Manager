import { Router, type IRouter } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { tmpdir } from "os";
import { apiError } from "../lib/errors.js";
import { writeFile, readFile, unlink } from "fs/promises";
import { upload, guardBackground } from "../middlewares/upload.js";
import { BIN } from "../lib/binaries.js";
import { heavyRateLimit } from "../middlewares/rateLimit.js";

const router: IRouter = Router();
const execFileAsync = promisify(execFile);

const PYTHON_SCRIPTS_DIR = process.env["PYTHON_SCRIPTS_DIR"] ?? "/app/python";
const BG_REMOVE_PY = join(PYTHON_SCRIPTS_DIR, "bg_remove.py");

// ── rembg (primary — full RGBA alpha, best quality) ──────────────────────────
//
// Uses isnet-general-use model (best quality/speed trade-off).
// Falls back to u2net if isnet is unavailable.

router.post(
  "/remove-background",
  heavyRateLimit,
  upload.single("file"),
  guardBackground,
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    const id = `rembg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ext = req.file.mimetype === "image/png" ? "png" : "jpg";
    const inputPath  = join(tmpdir(), `${id}-in.${ext}`);
    const outputPath = join(tmpdir(), `${id}-out.png`);

    try {
      await writeFile(inputPath, req.file.buffer);

      // Try isnet-general-use first (best quality on modern rembg),
      // fall back to u2net if the model name isn't recognised
      await execFileAsync(
        BIN.python3,
        [BG_REMOVE_PY, "--input", inputPath, "--output", outputPath, "--model", "isnet-general-use"],
        { timeout: 120_000 },
      );

      const outBuffer = await readFile(outputPath);

      res.set("Content-Type", "image/png");
      res.set("Content-Disposition", `attachment; filename="no-bg.png"`);
      res.set("Cache-Control", "no-store");
      res.send(outBuffer);
    } catch (err) {
      // Retry with the default u2net model if isnet isn't available
      if ((err as { stderr?: string }).stderr?.includes("isnet") || (err as { message?: string }).message?.includes("isnet")) {
        try {
          await execFileAsync(
            BIN.python3,
            [BG_REMOVE_PY, "--input", inputPath, "--output", outputPath],
            { timeout: 120_000 },
          );
          const outBuffer = await readFile(outputPath);
          res.set("Content-Type", "image/png");
          res.set("Content-Disposition", `attachment; filename="no-bg.png"`);
          res.set("Cache-Control", "no-store");
          res.send(outBuffer);
          return;
        } catch (fallbackErr) {
          const stderr = (fallbackErr as { stderr?: string }).stderr ?? "";
          res.status(500).json({
            error: "Background removal failed (both models)",
            detail: stderr.slice(0, 400),
          });
          return;
        }
      }

      const stderr = (err as { stderr?: string }).stderr ?? "";
      res.status(500).json({
        error: "Background removal failed",
        detail: stderr.slice(0, 400),
      });
    } finally {
      await unlink(inputPath).catch(() => {});
      await unlink(outputPath).catch(() => {});
    }
  },
);

export default router;
