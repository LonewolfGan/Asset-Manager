import { PDFDocument } from "pdf-lib";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { BIN, getPythonScriptPath } from "../../lib/binaries.js";
import {
  createColorManagedPipeline,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
} from "../images/image-helpers.js";

const execFileAsync = promisify(execFile);

export interface ConvertHeicOptions {
  outputMime: string;
  originalName?: string;
}

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = join(tmpdir(), "everydaytools", randomUUID());
  await mkdir(dir, { recursive: true });
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function heicViaSharp(inputBuffer: Buffer, outputMime: string): Promise<Buffer> {
  let pipeline = createColorManagedPipeline(inputBuffer);
  if (outputMime === "image/jpeg" || outputMime === "image/jpg") {
    pipeline = pipeline.flatten({ background: { r: 255, g: 255, b: 255 } }).jpeg(getOptimizedJpegOptions(90));
  } else if (outputMime === "image/webp") {
    pipeline = pipeline.webp(getOptimizedWebpOptions(90));
  } else if (outputMime === "image/avif") {
    pipeline = pipeline.avif(getOptimizedAvifOptions(75));
  } else if (outputMime === "image/png") {
    pipeline = pipeline.png({ compressionLevel: 9 });
  } else {
    throw new Error(`Unsupported output format: ${outputMime}`);
  }
  return pipeline.toBuffer();
}

export async function heicViaPython(inputBuffer: Buffer, outputMime: string, workDir: string): Promise<Buffer> {
  const fmtMap: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/jpg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
  };
  const fmt = fmtMap[outputMime];
  if (!fmt) throw new Error(`Unsupported HEIC output format for Python bridge: ${outputMime}`);
  const extMap: Record<string, string> = { JPEG: "jpg", PNG: "png", WEBP: "webp" };
  const inputPath = join(workDir, "input.heic");
  const outputPath = join(workDir, `output.${extMap[fmt]}`);
  await writeFile(inputPath, inputBuffer);
  const heicScript = getPythonScriptPath("heic_convert.py");
  await execFileAsync(BIN.python3, [heicScript, "--input", inputPath, "--output", outputPath, "--format", fmt], {
    timeout: 60_000,
  });
  return readFile(outputPath);
}

export async function convertHeicBuffer(
  inputBuffer: Buffer,
  options: ConvertHeicOptions
): Promise<{ buffer: Buffer; mime: string; ext: string }> {
  const { outputMime } = options;

  if (outputMime === "application/pdf") {
    let jpegBuf: Buffer;
    try {
      jpegBuf = await heicViaSharp(inputBuffer, "image/jpeg");
    } catch {
      jpegBuf = await withTempDir((dir) => heicViaPython(inputBuffer, "image/jpeg", dir));
    }
    const A4W = 595.28, A4H = 841.89, MARGIN = 40;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([A4W, A4H]);
    const img = await pdfDoc.embedJpg(jpegBuf);
    const maxW = A4W - 2 * MARGIN, maxH = A4H - 2 * MARGIN;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const dw = img.width * scale, dh = img.height * scale;
    page.drawImage(img, { x: (A4W - dw) / 2, y: (A4H - dh) / 2, width: dw, height: dh });
    const pdfBytes = await pdfDoc.save();
    return { buffer: Buffer.from(pdfBytes), mime: "application/pdf", ext: "pdf" };
  }

  const ext = EXT_MAP[outputMime];
  if (!ext) {
    throw new Error(`Unsupported HEIC output format: ${outputMime}`);
  }

  let outputBuf: Buffer;
  try {
    outputBuf = await heicViaSharp(inputBuffer, outputMime);
  } catch {
    outputBuf = await withTempDir((dir) => heicViaPython(inputBuffer, outputMime, dir));
  }

  const resolvedMime = outputMime === "image/jpg" ? "image/jpeg" : outputMime;
  return { buffer: outputBuf, mime: resolvedMime, ext };
}
