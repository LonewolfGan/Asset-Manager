import { Router } from "express";
import { PDFDocument } from "pdf-lib";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir, stat } from "fs/promises";
import { join } from "path";
import { upload } from "../../middlewares/upload.js";
import { BIN } from "../../lib/binaries.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";

const execFileAsync = promisify(execFile);
const router = Router();

interface CompressPreset {
  pdfSettings: string;
  colorRes: number;
  grayRes: number;
  monoRes: number;
  forceDct: boolean;
}

const COMPRESS_PRESETS: Record<string, CompressPreset> = {
  extreme: { pdfSettings: "/screen", colorRes: 80, grayRes: 80, monoRes: 150, forceDct: true },
  screen: { pdfSettings: "/screen", colorRes: 80, grayRes: 80, monoRes: 150, forceDct: true },
  recommended: { pdfSettings: "/ebook", colorRes: 144, grayRes: 144, monoRes: 200, forceDct: false },
  ebook: { pdfSettings: "/ebook", colorRes: 144, grayRes: 144, monoRes: 200, forceDct: false },
  low: { pdfSettings: "/printer", colorRes: 240, grayRes: 240, monoRes: 300, forceDct: false },
  printer: { pdfSettings: "/printer", colorRes: 240, grayRes: 240, monoRes: 300, forceDct: false },
  prepress: { pdfSettings: "/prepress", colorRes: 300, grayRes: 300, monoRes: 300, forceDct: false },
};

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-compress
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-compress", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const levelParam = String(req.body.level ?? req.body.quality ?? "recommended").toLowerCase();
  const preset = COMPRESS_PRESETS[levelParam] ?? COMPRESS_PRESETS["recommended"];
  const input = req.file.buffer;
  const baseName = pdfBaseName(req.file.originalname);

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const gsOutPath = join(workDir, "gs_out.pdf");
  const qpdfOutPath = join(workDir, "final.pdf");

  let finalBuffer: Buffer = input;

  try {
    await writeFile(inPath, input);

    const gsArgs = [
      "-dNOPAUSE", "-dBATCH", "-dSAFER",
      "-sDEVICE=pdfwrite",
      `-dPDFSETTINGS=${preset.pdfSettings}`,
      "-dCompatibilityLevel=1.6",
      "-dDownsampleColorImages=true",
      "-dColorImageDownsampleType=/Bicubic",
      `-dColorImageResolution=${preset.colorRes}`,
      "-dDownsampleGrayImages=true",
      "-dGrayImageDownsampleType=/Bicubic",
      `-dGrayImageResolution=${preset.grayRes}`,
      "-dDownsampleMonoImages=true",
      "-dMonoImageDownsampleType=/Subsample",
      `-dMonoImageResolution=${preset.monoRes}`,
      "-dPassThroughJPEGImages=false",
      "-dDetectDuplicateImages=true",
      "-dCompressFonts=true",
    ];

    if (preset.forceDct) {
      gsArgs.push(
        "-dAutoFilterColorImages=false",
        "-dColorImageFilter=/DCTEncode",
        "-dAutoFilterGrayImages=false",
        "-dGrayImageFilter=/DCTEncode"
      );
    }

    gsArgs.push(`-sOutputFile=${gsOutPath}`, inPath);

    let gsSuccess = false;
    try {
      await execFileAsync(BIN.gs, gsArgs, { timeout: 90_000 });
      gsSuccess = true;
    } catch {
      // Continue to qpdf
    }

    const stage1File = gsSuccess ? gsOutPath : inPath;

    let qpdfSuccess = false;
    try {
      await execFileAsync(BIN.qpdf, [
        "--linearize",
        "--object-streams=generate",
        "--recompress-flate",
        stage1File,
        qpdfOutPath,
      ], { timeout: 60_000 });
      qpdfSuccess = true;
    } catch {
      // Continue
    }

    const candidates: Buffer[] = [input];
    if (gsSuccess) {
      try { candidates.push(await readFile(gsOutPath)); } catch {}
    }
    if (qpdfSuccess) {
      try { candidates.push(await readFile(qpdfOutPath)); } catch {}
    }

    candidates.sort((a, b) => a.length - b.length);
    finalBuffer = candidates[0];

    if (finalBuffer.length >= input.length) {
      try {
        const pdfDoc = await PDFDocument.load(input, { ignoreEncryption: true });
        pdfDoc.setTitle(""); pdfDoc.setAuthor(""); pdfDoc.setSubject("");
        pdfDoc.setKeywords([]); pdfDoc.setProducer("EverydayTools"); pdfDoc.setCreator("EverydayTools");
        const stripped = Buffer.from(await pdfDoc.save({ useObjectStreams: true }));
        if (stripped.length < finalBuffer.length) {
          finalBuffer = stripped;
        }
      } catch {}
    }
  } catch (err) {
    apiError(res, 500, "COMPRESSION_FAILED", err instanceof Error ? err.message : "Compression failed");
    return;
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }

  const gain = Math.max(0, Math.round((1 - finalBuffer.length / input.length) * 100));

  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${baseName}_compressed.pdf"`,
    "X-Original-Size": String(input.length),
    "X-Compressed-Size": String(finalBuffer.length),
    "X-Compression-Gain": String(gain),
    "Cache-Control": "no-store",
    "Access-Control-Expose-Headers": "X-Original-Size,X-Compressed-Size,X-Compression-Gain",
  });
  res.send(finalBuffer);
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-repair
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-repair", defaultRateLimit, upload.single("file"), async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pdf");
  const outputPath = join(workDir, "repaired.pdf");

  try {
    await writeFile(inputPath, req.file.buffer);

    let success = false;
    try {
      await execFileAsync(
        BIN.qpdf,
        ["--warning-exit-0", "--linearize", inputPath, outputPath],
        { timeout: 60_000 },
      );
      success = true;
    } catch {
      try {
        const s = await stat(outputPath);
        if (s.size > 0) success = true;
      } catch {}

      if (!success) {
        try {
          await execFileAsync(
            BIN.gs,
            [
              "-o", outputPath,
              "-sDEVICE=pdfwrite",
              "-dPDFSETTINGS=/prepress",
              inputPath,
            ],
            { timeout: 120_000 },
          );
          success = true;
        } catch {
          throw new Error("Unable to repair PDF structure with recovery tools.");
        }
      }
    }

    if (!success) {
      throw new Error("PDF repair failed");
    }

    const repairedBuf = await readFile(outputPath);
    const baseName = pdfBaseName(req.file.originalname);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_repaired.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(repairedBuf);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF repair failed");
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

export default router;
