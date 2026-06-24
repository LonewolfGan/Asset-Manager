import { execFile } from "child_process";
import { promisify } from "util";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { logger } from "./lib/logger.js";

const execFileAsync = promisify(execFile);

const BG_REMOVE_PY = join(import.meta.dirname, "python/bg_remove.py");

/**
 * 1x1 red pixel PNG, base64-encoded.
 * Minimal valid PNG used to trigger rembg model download + warm the JIT cache.
 */
const DUMMY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

/** Maximum time (ms) to wait for the Python process. */
const WARMUP_TIMEOUT_MS = 180_000;

/**
 * Warm up the rembg background-removal model at server startup.
 *
 * Runs the Python script on a 1x1 dummy image to force the model to download
 * and cache, and to trigger rembg's (and numba's) one-time initialisation.
 *
 * Intentionally non-blocking: failures are logged but never thrown, so the
 * server starts regardless. If this warmup fails, the model will be loaded
 * lazily on the first real request (as before).
 */
export async function warmupRembg(): Promise<void> {
  const id = `warmup-${Date.now()}`;
  const inputPath = join(tmpdir(), `${id}-in.png`);
  const outputPath = join(tmpdir(), `${id}-out.png`);

  try {
    const pngBuffer = Buffer.from(DUMMY_PNG_BASE64, "base64");
    await writeFile(inputPath, pngBuffer);

    logger.info("Warming up rembg model (isnet-general-use) …");

    await execFileAsync("python3", [BG_REMOVE_PY, "--input", inputPath, "--output", outputPath, "--model", "isnet-general-use"], {
      timeout: WARMUP_TIMEOUT_MS,
    });

    logger.info("rembg model warmup succeeded");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn({ err: msg }, "rembg model warmup failed (will load lazily on first request)");
  } finally {
    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});
  }
}
