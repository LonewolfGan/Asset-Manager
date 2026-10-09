import { Router, type IRouter } from "express";
import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { tmpdir } from "os";
import { apiError } from "../lib/errors.js";
import { writeFile, readFile, unlink } from "fs/promises";
import { upload, guardBackground } from "../middlewares/upload.js";
import { BIN, getPythonScriptPath } from "../lib/binaries.js";
import { heavyRateLimit } from "../middlewares/rateLimit.js";

import { getRembgDaemonUrl } from "../warmup.js";

const router: IRouter = Router();
const execFileAsync = promisify(execFile);

// ── rembg (primary — full RGBA alpha, isnet-general-use) ────────────────────

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

    // 1. Try persistent in-memory daemon first (fastest, keeps model resident in RAM)
    try {
      const daemonUrl = `${getRembgDaemonUrl()}/remove`;
      const daemonRes = await fetch(daemonUrl, {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: req.file.buffer,
        signal: AbortSignal.timeout(30_000),
      });

      if (daemonRes.ok) {
        const outArray = await daemonRes.arrayBuffer();
        const outBuffer = Buffer.from(outArray);
        res.set("Content-Type", "image/png");
        res.set("Content-Disposition", `attachment; filename="no-bg.png"`);
        res.set("Cache-Control", "no-store");
        res.send(outBuffer);
        return;
      }
    } catch {
      // Daemon not reachable or timed out — fallback to CLI process
    }

    // 2. Fallback: CLI process execution
    const id = `rembg-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const ext = req.file.mimetype === "image/png" ? "png" : "jpg";
    const inputPath  = join(tmpdir(), `${id}-in.${ext}`);
    const outputPath = join(tmpdir(), `${id}-out.png`);

    try {
      await writeFile(inputPath, req.file.buffer);

      const bgRemoveScript = getPythonScriptPath("bg_remove.py");
      await execFileAsync(
        BIN.python3,
        [bgRemoveScript, "--input", inputPath, "--output", outputPath, "--model", "isnet-general-use"],
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
          const bgRemoveScript = getPythonScriptPath("bg_remove.py");
          await execFileAsync(
            BIN.python3,
            [bgRemoveScript, "--input", inputPath, "--output", outputPath],
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
