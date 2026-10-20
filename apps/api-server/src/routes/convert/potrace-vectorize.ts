import sharp from "sharp";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { BIN } from "../../lib/binaries.js";

const execFileAsync = promisify(execFile);

/**
 * Computes optimal binarization threshold using Otsu's inter-class variance method.
 */
export function computeOtsuThreshold(histogram: number[], totalPixels: number): number {
  if (!totalPixels || totalPixels <= 0) return 128;

  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * (histogram[i] ?? 0);
  }

  let sumB = 0;
  let wB = 0;
  let maximum = 0;
  let threshold = 128;

  for (let i = 0; i < 256; i++) {
    wB += histogram[i] ?? 0;
    if (wB === 0) continue;
    const wF = totalPixels - wB;
    if (wF === 0) break;

    sumB += i * (histogram[i] ?? 0);
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);

    if (between > maximum) {
      maximum = between;
      threshold = i;
    }
  }

  return threshold;
}

/**
 * Constructs a P4 binary PBM buffer from grayscale pixel data using the computed threshold.
 */
export function buildPBM(grayscale: Buffer, width: number, height: number, threshold = 128): Buffer {
  if (width <= 0 || height <= 0 || grayscale.length < width * height) {
    throw new Error("Invalid buffer dimensions for PBM construction");
  }

  const header = Buffer.from(`P4\n${width} ${height}\n`, "ascii");
  const rowBytes = Math.ceil(width / 8);
  const bitmap = Buffer.alloc(height * rowBytes, 0);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    const bitRowOffset = y * rowBytes;
    for (let x = 0; x < width; x++) {
      if (grayscale[rowOffset + x] < threshold) {
        const bi = bitRowOffset + Math.floor(x / 8);
        bitmap[bi] |= 1 << (7 - (x % 8));
      }
    }
  }

  return Buffer.concat([header, bitmap]);
}

/**
 * Converts a bitmap image into a high-fidelity vector SVG using
 * Otsu dynamic thresholding, gentle Gaussian filtering and Potrace curve tracing.
 */
export async function convertToSvgWithPotrace(inputBuffer: Buffer, isGeometric = false): Promise<Buffer> {
  const preprocessed = sharp(inputBuffer)
    .rotate()
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .grayscale()
    .blur(0.8);

  const { data, info } = await preprocessed.raw().toBuffer({ resolveWithObject: true });
  const histogram = new Array<number>(256).fill(0);
  for (let i = 0; i < data.length; i++) {
    const val = data[i];
    if (val !== undefined) histogram[val] = (histogram[val] ?? 0) + 1;
  }
  const totalPixels = data.length || 1;
  const otsuThreshold = computeOtsuThreshold(histogram, totalPixels);
  const pbm = buildPBM(data, info.width, info.height, otsuThreshold);

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const pbmPath = join(workDir, "input.pbm");
  const svgPath = join(workDir, "output.svg");

  try {
    await writeFile(pbmPath, pbm);
    await execFileAsync(
      BIN.potrace,
      [
        "--svg",
        "--turdsize", "6",
        "--alphamax", isGeometric ? "0.4" : "1.0",
        "--opttolerance", "0.2",
        "--turnpolicy", "minority",
        "-o", svgPath,
        pbmPath,
      ],
      { timeout: 30_000 }
    );
    return await readFile(svgPath);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
