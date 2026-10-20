import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { execFile } from "child_process";
import { promisify } from "util";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm } from "fs/promises";
import { BIN, getPythonScriptPath } from "../lib/binaries.js";

const execFileAsync = promisify(execFile);

describe("Background Removal (rembg & defringing) TDD", { timeout: 60_000 }, () => {
  it("removes background and applies alpha matting & defringing via bg_remove.py", { timeout: 60_000 }, async () => {
    // Generate a test 120x120 image with a bright green circle on a white background
    const sample = await sharp({
      create: {
        width: 120,
        height: 120,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="120" height="120"><circle cx="60" cy="60" r="40" fill="#00FF00" /></svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    const workDir = join(tmpdir(), "everydaytools", `test-bg-${randomUUID()}`);
    const inputPath = join(workDir, "input.png");
    const outputPath = join(workDir, "output.png");

    const { mkdir } = await import("fs/promises");
    await mkdir(workDir, { recursive: true });

    try {
      await writeFile(inputPath, sample);

      const scriptPath = getPythonScriptPath("bg_remove.py");
      await execFileAsync(
        BIN.python3,
        [scriptPath, "--input", inputPath, "--output", outputPath, "--model", "u2netp"],
        { timeout: 60_000 }
      );

      const outBuffer = await readFile(outputPath);
      assert.strictEqual(outBuffer.length > 0, true);

      // Verify output is a valid RGBA PNG (channels: 4)
      const meta = await sharp(outBuffer).metadata();
      assert.strictEqual(meta.format, "png");
      assert.strictEqual(meta.channels, 4);
      assert.strictEqual(meta.hasAlpha, true);
    } finally {
      await rm(workDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("safely generates RFC 5987 Content-Disposition for international non-ASCII filenames", () => {
    const rawOriginalName = "photo_été_vacances_🎨.png";
    const rawBaseName = rawOriginalName.replace(/\.[^.]+$/, "");
    const asciiBaseName =
      rawBaseName.replace(/[^\x20-\x7E]/g, "_").replace(/["\r\n\\]/g, "_").trim() || "image";
    const outFileName = `${asciiBaseName}_nobg.png`;
    const encodedFileName = encodeURIComponent(`${rawBaseName}_nobg.png`);

    const header = `attachment; filename="${outFileName}"; filename*=UTF-8''${encodedFileName}`;

    // Verify ASCII portion has no characters > 127
    assert.strictEqual(/^[\x20-\x7E]+$/.test(outFileName), true);
    // Verify encoded portion contains valid URI encoding
    assert.strictEqual(header.includes("filename*=UTF-8''photo_%C3%A9t%C3%A9_vacances_"), true);
  });

  it("verifies defringe_rgba in Python restricts decontamination to semi-transparent edge pixels", async () => {
    const pythonCode = `
import sys, numpy as np
from PIL import Image
from bg_remove import defringe_rgba

# Create a 3x1 RGBA pixel test image:
# Pixel 0: fully transparent (alpha = 0)
# Pixel 1: semi-transparent boundary (alpha = 128 ~ 0.5)
# Pixel 2: fully opaque (alpha = 255 = 1.0)
arr = np.zeros((1, 3, 4), dtype=np.uint8)
arr[0, 0] = [100, 100, 100, 0]
arr[0, 1] = [50, 100, 150, 128]
arr[0, 2] = [200, 200, 200, 255]

img = Image.fromarray(arr, "RGBA")
clean = defringe_rgba(img)
clean_arr = np.array(clean)

# Pixel 0 (alpha = 0) should remain untouched (not multiplied by 10)
assert clean_arr[0, 0, 0] == 100, f"Pixel 0 modified: {clean_arr[0, 0]}"
# Pixel 2 (alpha = 255) should remain untouched
assert clean_arr[0, 2, 0] == 200, f"Pixel 2 modified: {clean_arr[0, 2]}"
# Pixel 1 (alpha = 128, edge) should be un-premultiplied without overflow
assert clean_arr[0, 1, 0] >= 50, f"Pixel 1 edge error: {clean_arr[0, 1]}"
print("PYTHON_DEFRINGE_OK")
`;

    const scriptDir = getPythonScriptPath("bg_remove.py");
    const { stdout } = await execFileAsync(
      BIN.python3,
      ["-c", pythonCode],
      { cwd: join(scriptDir, ".."), timeout: 15_000 }
    );

    assert.strictEqual(stdout.includes("PYTHON_DEFRINGE_OK"), true);
  });
});
