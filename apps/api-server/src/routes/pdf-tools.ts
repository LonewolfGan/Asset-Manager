import { Router } from "express";
import sharp from "sharp";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { zipSync } from "fflate";
import { execFile, execFileSync } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, readdir, rm, mkdir, stat } from "fs/promises";
import { join } from "path";
import { upload } from "../middlewares/upload.js";
import { BIN } from "../lib/binaries.js";
import { defaultRateLimit, mediumRateLimit } from "../middlewares/rateLimit.js";
import { apiError } from "../lib/errors.js";
import type { Request, Response, NextFunction } from "express";

const execFileAsync = promisify(execFile);
const router = Router();

// ─────────────────────────────────────────────────────────
// Guards
// ─────────────────────────────────────────────────────────
function guardSinglePdf(req: Request, res: Response, next: NextFunction): void {
  const file = req.file;
  if (!file) { next(); return; }
  if (file.mimetype !== "application/pdf") {
    apiError(res, 415, "UNSUPPORTED_TYPE", `Unsupported type: ${file.mimetype}. Only PDF accepted.`);
    return;
  }
  if (file.size > 50 * 1024 * 1024) {
    apiError(res, 413, "FILE_TOO_LARGE", "File too large. Maximum 50 MB.");
    return;
  }
  next();
}

function guardMultiPdf(req: Request, res: Response, next: NextFunction): void {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) { next(); return; }
  for (const f of files) {
    if (f.mimetype !== "application/pdf") {
      apiError(res, 415, "UNSUPPORTED_TYPE", `${f.originalname} is not a PDF.`); return;
    }
    if (f.size > 50 * 1024 * 1024) {
      apiError(res, 413, "FILE_TOO_LARGE", `${f.originalname} exceeds 50 MB limit.`); return;
    }
  }
  next();
}

function pdfBaseName(originalname: string | undefined): string {
  return (originalname ?? "document").replace(/\.pdf$/i, "");
}

function parsePageRanges(str: string, maxPages: number): number[][] {
  if (!str.trim()) return [];
  const parsed: number[][] = [];
  for (const part of str.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((s) => parseInt(s.trim()));
      if (isNaN(a) || isNaN(b) || a < 1) continue;
      const lo = Math.min(Math.min(a, maxPages), Math.min(b, maxPages));
      const hi = Math.max(Math.min(a, maxPages), Math.min(b, maxPages));
      const indices: number[] = [];
      for (let i = lo; i <= hi; i++) indices.push(i - 1);
      if (indices.length) parsed.push(indices);
    } else {
      const p = parseInt(part);
      if (!isNaN(p) && p >= 1 && p <= maxPages) parsed.push([p - 1]);
    }
  }
  return parsed;
}

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-images
// Each PDF page → PNG or JPEG, returned as a ZIP.
// Uses Ghostscript for high-quality rasterization.
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-images", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const rawFormat = String(req.body.format ?? "png").toLowerCase();
  const format: "png" | "jpeg" | "webp" | "avif" | "tiff" | "gif" =
    rawFormat === "jpeg" || rawFormat === "jpg"
      ? "jpeg"
      : rawFormat === "webp"
      ? "webp"
      : rawFormat === "avif"
      ? "avif"
      : rawFormat === "tiff" || rawFormat === "tif"
      ? "tiff"
      : rawFormat === "gif"
      ? "gif"
      : "png";

  const dpi = Math.min(300, Math.max(72, parseInt(String(req.body.dpi ?? "150")) || 150));
  const gsDevice = format === "jpeg" ? "jpeg" : "png16m";
  const gsExt = format === "jpeg" ? "jpg" : "png";
  const baseName = pdfBaseName(req.file.originalname);

  const transcodeImage = async (buf: Buffer): Promise<{ data: Buffer; mime: string; ext: string }> => {
    switch (format) {
      case "jpeg":
        return { data: buf, mime: "image/jpeg", ext: "jpg" };
      case "webp":
        return { data: Buffer.from(await sharp(buf).webp({ quality: 90 }).toBuffer()), mime: "image/webp", ext: "webp" };
      case "avif":
        return { data: Buffer.from(await sharp(buf).avif({ quality: 85 }).toBuffer()), mime: "image/avif", ext: "avif" };
      case "tiff":
        return { data: Buffer.from(await sharp(buf).tiff({ compression: "deflate" }).toBuffer()), mime: "image/tiff", ext: "tiff" };
      case "gif":
        return { data: Buffer.from(await sharp(buf).gif().toBuffer()), mime: "image/gif", ext: "gif" };
      case "png":
      default:
        return { data: buf, mime: "image/png", ext: "png" };
    }
  };

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPattern = join(workDir, `page-%d.${gsExt}`);

  try {
    await writeFile(inPath, req.file.buffer);
    await execFileAsync(BIN.gs, [
      "-dNOPAUSE", "-dBATCH", "-dSAFER",
      `-sDEVICE=${gsDevice}`,
      `-r${dpi}`,
      `-sOutputFile=${outPattern}`,
      inPath,
    ], { timeout: 120_000 });

    const allFiles = await readdir(workDir);
    const imgFiles = allFiles
      .filter((f) => f.startsWith("page-") && f.endsWith(`.${gsExt}`))
      .sort((a, b) => {
        const n = (s: string) => parseInt(s.replace("page-", "").replace(`.${gsExt}`, "")) || 0;
        return n(a) - n(b);
      });

    if (imgFiles.length === 0) {
      apiError(res, 422, "CONVERSION_FAILED", "Ghostscript did not produce any image output. Check the PDF is valid.");
      return;
    }

    if (imgFiles.length === 1) {
      const rawBuf: Buffer = await readFile(join(workDir, imgFiles[0]));
      const { data, mime, ext } = await transcodeImage(rawBuf);
      res.set({
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${baseName}_page_1.${ext}"`,
        "Cache-Control": "no-store",
      });
      res.send(data);
    } else {
      const zipEntries: Record<string, Uint8Array> = {};
      let finalExt = "png";
      for (const f of imgFiles) {
        const pageNum = f.replace("page-", "").replace(`.${gsExt}`, "");
        const rawBuf: Buffer = await readFile(join(workDir, f));
        const { data, ext } = await transcodeImage(rawBuf);
        finalExt = ext;
        zipEntries[`${baseName}_page_${pageNum}.${ext}`] = new Uint8Array(data);
      }
      const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${baseName}_images_${finalExt}.zip"`,
        "X-Page-Count": String(imgFiles.length),
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Page-Count",
      });
      res.send(zipBuf);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Conversion failed";
    const isMissing = msg.includes("ENOENT");
    apiError(res, isMissing ? 503 : 500, isMissing ? "BINARY_UNAVAILABLE" : "CONVERSION_FAILED", isMissing ? "Ghostscript is not installed on this server." : msg);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-reorder
// Reorder or remove pages from a PDF.
// Input: file (PDF) + pages (comma-separated 1-based page numbers in desired order)
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-reorder", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const pagesParam = String(req.body.pages ?? "");
  if (!pagesParam.trim()) {
    apiError(res, 400, "MISSING_PARAM", "pages parameter required (comma-separated 1-based page numbers)");
    return;
  }

  try {
    const src = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
    const numPages = src.getPageCount();
    const pageIndices = pagesParam.split(",")
      .map((s) => parseInt(s.trim()) - 1)
      .filter((i) => !isNaN(i) && i >= 0 && i < numPages);

    if (pageIndices.length === 0) {
      apiError(res, 400, "INVALID_PARAM", "No valid page indices. Pages must be 1-based integers within document range.");
      return;
    }

    const dest = await PDFDocument.create();
    const copied = await dest.copyPages(src, pageIndices);
    for (const page of copied) dest.addPage(page);

    const pdfBytes = await dest.save();
    let finalBuffer: Buffer = Buffer.from(pdfBytes);

    try {
      const linearized = execFileSync(BIN.qpdf, ["--linearize", "-", "-"], {
        input: finalBuffer,
        maxBuffer: 100 * 1024 * 1024,
      });
      if (linearized && linearized.length > 0) {
        finalBuffer = linearized;
      }
    } catch {
      // Retain standard pdfBytes if qpdf is unavailable
    }

    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_reordered.pdf"`,
      "X-Page-Count": String(pageIndices.length),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Page-Count",
    });
    res.send(finalBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Reorder failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-compress
// Industrial multi-tier compression:
// 1. Ghostscript with forced JPEG re-encoding & bicubic downsampling (PassThroughJPEGImages=false)
// 2. qpdf object stream deduplication, flate recompression & web linearization
// 3. Fallback to smallest buffer with full error recovery
// ─────────────────────────────────────────────────────────
interface CompressPreset {
  pdfSettings: string;
  colorRes: number;
  grayRes: number;
  monoRes: number;
  forceDct: boolean;
}

const COMPRESS_PRESETS: Record<string, CompressPreset> = {
  extreme: {
    pdfSettings: "/screen",
    colorRes: 80,
    grayRes: 80,
    monoRes: 150,
    forceDct: true,
  },
  screen: {
    pdfSettings: "/screen",
    colorRes: 80,
    grayRes: 80,
    monoRes: 150,
    forceDct: true,
  },
  recommended: {
    pdfSettings: "/ebook",
    colorRes: 144,
    grayRes: 144,
    monoRes: 200,
    forceDct: false,
  },
  ebook: {
    pdfSettings: "/ebook",
    colorRes: 144,
    grayRes: 144,
    monoRes: 200,
    forceDct: false,
  },
  low: {
    pdfSettings: "/printer",
    colorRes: 240,
    grayRes: 240,
    monoRes: 300,
    forceDct: false,
  },
  printer: {
    pdfSettings: "/printer",
    colorRes: 240,
    grayRes: 240,
    monoRes: 300,
    forceDct: false,
  },
  prepress: {
    pdfSettings: "/prepress",
    colorRes: 300,
    grayRes: 300,
    monoRes: 300,
    forceDct: false,
  },
};

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

    // Stage 1: Ghostscript re-rendering & downsampling
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
    } catch (_gsErr) {
      // Continue to qpdf or fallback
    }

    const stage1File = gsSuccess ? gsOutPath : inPath;

    // Stage 2: qpdf stream optimization, duplicate object deduplication & linearization
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
    } catch (_qpdfErr) {
      // Continue with whatever succeeded
    }

    // Pick the most compressed output
    const candidates: Buffer[] = [input];
    if (gsSuccess) {
      try { candidates.push(await readFile(gsOutPath)); } catch {}
    }
    if (qpdfSuccess) {
      try { candidates.push(await readFile(qpdfOutPath)); } catch {}
    }

    // Sort by smallest length
    candidates.sort((a, b) => a.length - b.length);
    finalBuffer = candidates[0];

    // Fallback if nothing reduced and input was returned: try pdf-lib metadata strip
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
// POST /tools/pdf-merge
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-merge", upload.array("files", 20), guardMultiPdf, async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length < 2) {
    apiError(res, 400, "MISSING_FILES", "At least 2 PDF files are required."); return;
  }

  try {
    const merged = await PDFDocument.create();
    for (const file of files) {
      const src = await PDFDocument.load(file.buffer);
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }
    const pdfBytes = await merged.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="merged_document.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Merge failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-split
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-split", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const mode = String(req.body.mode ?? "every");
    const rangesStr = String(req.body.ranges ?? "");
    const mergeOutput = String(req.body.merge ?? "false") === "true";
    const src = await PDFDocument.load(req.file.buffer);
    const numPages = src.getPageCount();
    const baseName = pdfBaseName(req.file.originalname);

    let segments: number[][];
    if (mode === "every") {
      segments = Array.from({ length: numPages }, (_, i) => [i]);
    } else {
      segments = parsePageRanges(rangesStr, numPages);
      if (segments.length === 0) {
        apiError(res, 400, "INVALID_PARAM", "Invalid or empty range. Use format: '1-3, 5, 7-9'"); return;
      }
    }

    if (segments.length === 1 || (mergeOutput && mode !== "every")) {
      const out = await PDFDocument.create();
      const allIndices = segments.flat();
      const pages = await out.copyPages(src, allIndices);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}_extracted.pdf"`,
        "Cache-Control": "no-store",
      });
      res.send(Buffer.from(bytes));
    } else {
      const zipEntries: Record<string, Uint8Array> = {};
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, seg);
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save();
        const fname = seg.length === 1
          ? `${baseName}_page_${seg[0] + 1}.pdf`
          : `${baseName}_pages_${seg[0] + 1}-${seg[seg.length - 1] + 1}.pdf`;
        zipEntries[fname] = new Uint8Array(bytes);
      }
      const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${baseName}_split.zip"`,
        "Cache-Control": "no-store",
      });
      res.send(zipBuf);
    }
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Split failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-protect
// qpdf AES-256 encryption (Revision 6, PDF 2.0 compatible).
// Falls back to pdf-lib RC4-128 if qpdf is unavailable.
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-protect", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const userPassword  = String(req.body.userPassword  ?? req.body.password ?? "").trim();
  const ownerPassword = String(req.body.ownerPassword ?? "").trim();

  if (!userPassword && !ownerPassword) {
    apiError(res, 400, "MISSING_PARAM", "At least one password (user or owner) is required."); return;
  }
  if (userPassword.length > 128 || ownerPassword.length > 128) {
    apiError(res, 400, "INVALID_PARAM", "Password too long (max 128 characters)."); return;
  }

  const allowPrinting  = String(req.body.allowPrinting  ?? "true")  !== "false";
  const allowCopying   = String(req.body.allowCopying   ?? "true")  !== "false";
  const allowModifying = String(req.body.allowModifying ?? "false") === "true";
  const baseName = pdfBaseName(req.file.originalname);

  const ownerPw = ownerPassword || (userPassword + "_o_et");
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath  = join(workDir, "input.pdf");
  const outPath = join(workDir, "output.pdf");

  try {
    await writeFile(inPath, req.file.buffer);

    const args: string[] = [
      "--encrypt", userPassword, ownerPw, "256",
      `--print=${allowPrinting ? "full" : "none"}`,
      `--extract=${allowCopying ? "y" : "n"}`,
    ];
    if (allowModifying) {
      args.push("--modify-other=y", "--annotate=y", "--form=y", "--assemble=y");
    } else {
      args.push("--modify-other=n", "--annotate=n", "--form=n", "--assemble=n");
    }
    args.push("--", inPath, outPath);

    await execFileAsync(BIN.qpdf, args, { timeout: 30_000 });

    const output = await readFile(outPath);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_protected.pdf"`,
      "X-Encryption": "AES-256",
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Encryption",
    });
    res.send(output);
  } catch (_qpdfErr) {
    // Fallback: pdf-lib RC4-128
    try {
      const pdfDoc = await PDFDocument.load(req.file.buffer);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdfBytes = await pdfDoc.save({
        userPassword:  userPassword  || undefined,
        ownerPassword: ownerPw,
        permissions: {
          printing: allowPrinting ? "highResolution" : undefined,
          modifying: allowModifying,
          copying: allowCopying,
          annotating: false,
          fillingForms: allowModifying,
          contentAccessibility: true,
          documentAssembly: false,
        },
      } as any);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}_protected.pdf"`,
        "X-Encryption": "RC4-128",
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Encryption",
      });
      res.send(Buffer.from(pdfBytes));
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Protection failed");
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-unlock
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-unlock", upload.single("file"), async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  if (req.file.mimetype !== "application/pdf") {
    apiError(res, 415, "UNSUPPORTED_TYPE", "Only PDF files are accepted."); return;
  }

  const password = String(req.body.password ?? "").trim();
  const baseName = pdfBaseName(req.file.originalname);

  // 1. Primary: qpdf --decrypt (supports AES-256, AES-128, RC4)
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPath = join(workDir, "output.pdf");

  try {
    await writeFile(inPath, req.file.buffer);
    const args = ["--decrypt"];
    if (password) {
      args.push(`--password=${password}`);
    }
    args.push(inPath, outPath);

    await execFileAsync(BIN.qpdf, args, { timeout: 30_000 });
    const output = await readFile(outPath);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_unlocked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(output);
    return;
  } catch (qpdfErr) {
    const qMsg = qpdfErr instanceof Error ? qpdfErr.message : "";
    if (qMsg.includes("invalid password") || qMsg.includes("password incorrect")) {
      apiError(res, 400, "INVALID_PASSWORD", "Mot de passe incorrect. Veuillez vérifier et réessayer.");
      return;
    }
    // Otherwise fallback to pdf-lib
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }

  // 2. Fallback: pdf-lib
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfDoc = await PDFDocument.load(req.file.buffer, {
      password: password || undefined,
      ignoreEncryption: !password,
    } as any);
    const pdfBytes = await pdfDoc.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_unlocked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    const raw = err instanceof Error ? err.message : "";
    const msg = raw.toLowerCase().includes("password") || raw.toLowerCase().includes("encrypt")
      ? "Mot de passe incorrect ou chiffrement non pris en charge."
      : raw || "Unlock failed";
    apiError(res, 500, "CONVERSION_FAILED", msg);
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-watermark
// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────
// POST /tools/pdf-watermark
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-watermark", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const text     = String(req.body.text ?? "WATERMARK").slice(0, 100);
  const opacity  = Math.min(1, Math.max(0.05, parseFloat(String(req.body.opacity ?? "0.3"))));
  const fontSize = Math.min(120, Math.max(10, parseInt(String(req.body.fontSize ?? "60")) || 60));
  const angle    = parseInt(String(req.body.angle ?? "45")) || 0;
  const colorStr = String(req.body.color ?? "gray").trim();
  const pageScope = String(req.body.pages ?? "all").trim(); // "all" | "first" | "custom" e.g. "1-3, 5"
  const pattern   = String(req.body.pattern ?? "repeat").trim(); // "repeat" (multi-watermark grid) | "single" (center)

  const parseColor = (col: string) => {
    const s = col.toLowerCase();
    if (s === "red") return rgb(0.85, 0.15, 0.15);
    if (s === "blue") return rgb(0.12, 0.45, 0.9);
    if (s === "black") return rgb(0.08, 0.08, 0.08);
    if (s === "green") return rgb(0.1, 0.65, 0.25);
    if (s === "amber") return rgb(0.85, 0.5, 0.05);
    if (s.startsWith("#") && (s.length === 7 || s.length === 4)) {
      let hex = s.slice(1);
      if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return rgb(r, g, b);
    }
    return rgb(0.5, 0.5, 0.5);
  };

  const watermarkColor = parseColor(colorStr);

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    let targetIndices: number[] = [];
    if (pageScope === "first") {
      targetIndices = [0];
    } else if (pageScope === "all") {
      targetIndices = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      // Parse ranges like "1-3, 5"
      targetIndices = pageScope.split(",").flatMap((part) => {
        const trimmed = part.trim();
        if (trimmed.includes("-")) {
          const [startStr, endStr] = trimmed.split("-").map((s) => parseInt(s.trim()));
          if (!isNaN(startStr) && !isNaN(endStr)) {
            const start = Math.max(0, Math.min(startStr - 1, totalPages - 1));
            const end = Math.max(0, Math.min(endStr - 1, totalPages - 1));
            return Array.from({ length: end - start + 1 }, (_, i) => start + i);
          }
        }
        const num = parseInt(trimmed);
        return !isNaN(num) && num >= 1 && num <= totalPages ? [num - 1] : [];
      });
      if (targetIndices.length === 0) {
        targetIndices = Array.from({ length: totalPages }, (_, i) => i);
      }
    }

    const rad = (angle * Math.PI) / 180;
    const textWidth = font.widthOfTextAtSize(text, fontSize);

    for (const idx of targetIndices) {
      const page = pages[idx];
      const { width, height } = page.getSize();

      if (pattern === "single") {
        const cx = width / 2;
        const cy = height / 2;
        const x = cx - (textWidth / 2) * Math.cos(rad) + (fontSize / 2) * Math.sin(rad);
        const y = cy - (textWidth / 2) * Math.sin(rad) - (fontSize / 2) * Math.cos(rad);

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: watermarkColor,
          opacity,
          rotate: degrees(angle),
        });
      } else {
        // Repeated tiled watermark across the entire page (Multi-Watermark)
        const stepX = Math.max(textWidth + 60, 140);
        const stepY = Math.max(fontSize * 3.2, 110);

        let row = 0;
        for (let py = -stepY; py <= height + stepY; py += stepY) {
          const xOffset = row % 2 === 0 ? 0 : stepX / 2;
          for (let px = -stepX + xOffset; px <= width + stepX; px += stepX) {
            page.drawText(text, {
              x: px,
              y: py,
              size: fontSize,
              font,
              color: watermarkColor,
              opacity,
              rotate: degrees(angle),
            });
          }
          row++;
        }
      }
    }

    const pdfBytes = await pdfDoc.save();
    let finalBuffer: Buffer = Buffer.from(pdfBytes);

    try {
      const linearized = execFileSync(BIN.qpdf, ["--linearize", "-", "-"], {
        input: finalBuffer,
        maxBuffer: 100 * 1024 * 1024,
      });
      if (linearized && linearized.length > 0) {
        finalBuffer = linearized;
      }
    } catch {
      // Retain standard buffer if qpdf is unavailable
    }

    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_watermarked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(finalBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Watermark failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-page-numbers
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-page-numbers", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const position  = String(req.body.position ?? "bottom-center");
  const startFrom = Math.max(1, parseInt(String(req.body.startFrom ?? "1")) || 1);
  const fontSize  = Math.min(24, Math.max(8, parseInt(String(req.body.fontSize ?? "11")) || 11));
  const skipFirst = String(req.body.skipFirst ?? "false").toLowerCase() === "true";
  const format    = String(req.body.format ?? "{n}").trim(); // "{n}" | "Page {n}" | "Page {n} of {total}" | "{n}/{total}"
  const margin    = 22;

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    const startIdx = skipFirst ? 1 : 0;

    for (let i = startIdx; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const currentNumber = i + startFrom - (skipFirst ? 1 : 0);

      let label = format;
      if (label.includes("{n}")) {
        label = label.replace(/{n}/g, String(currentNumber));
      } else {
        label = String(currentNumber);
      }
      label = label.replace(/{total}/g, String(totalPages - (skipFirst ? 1 : 0)));

      const textWidth = font.widthOfTextAtSize(label, fontSize);
      let x: number, y: number;
      if      (position === "bottom-right") { x = width - textWidth - margin; y = margin; }
      else if (position === "bottom-left")  { x = margin; y = margin; }
      else if (position === "top-center")   { x = (width - textWidth) / 2; y = height - margin - fontSize; }
      else if (position === "top-right")    { x = width - textWidth - margin; y = height - margin - fontSize; }
      else if (position === "top-left")     { x = margin; y = height - margin - fontSize; }
      else                                  { x = (width - textWidth) / 2; y = margin; }

      page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
    }

    const pdfBytes = await pdfDoc.save();
    let finalBuffer: Buffer = Buffer.from(pdfBytes);

    try {
      const linearized = execFileSync(BIN.qpdf, ["--linearize", "-", "-"], {
        input: finalBuffer,
        maxBuffer: 100 * 1024 * 1024,
      });
      if (linearized && linearized.length > 0) {
        finalBuffer = linearized;
      }
    } catch {
      // Retain standard buffer if qpdf is unavailable
    }

    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_numbered.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(finalBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Page numbering failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-rotate
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-rotate", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const rotationDeg = parseInt(String(req.body.rotation ?? "90")) || 90;
  const pageList    = String(req.body.pages ?? "all");
  const rotationsRaw = req.body.rotations;

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    let perPageRotations: Record<number, number> | null = null;
    if (rotationsRaw) {
      try {
        const parsed = typeof rotationsRaw === "string" ? JSON.parse(rotationsRaw) : rotationsRaw;
        if (Array.isArray(parsed)) {
          perPageRotations = {};
          parsed.forEach((deg, idx) => {
            if (typeof deg === "number" && deg % 360 !== 0) perPageRotations![idx] = deg;
          });
        } else if (typeof parsed === "object" && parsed !== null) {
          perPageRotations = {};
          for (const [k, v] of Object.entries(parsed)) {
            const idx = parseInt(k);
            if (!isNaN(idx) && typeof v === "number") {
              perPageRotations[idx] = v;
            }
          }
        }
      } catch {
        perPageRotations = null;
      }
    }

    if (perPageRotations) {
      for (const [idxStr, deg] of Object.entries(perPageRotations)) {
        const idx = Number(idxStr);
        if (idx >= 0 && idx < totalPages) {
          const current = pages[idx].getRotation().angle;
          pages[idx].setRotation(degrees((current + (deg % 360) + 360) % 360));
        }
      }
    } else {
      const pageIndices = pageList === "all"
        ? Array.from({ length: totalPages }, (_, i) => i)
        : pageList.split(",").map((s) => parseInt(s.trim()) - 1).filter((i) => i >= 0 && i < totalPages);

      for (const idx of pageIndices) {
        const current = pages[idx].getRotation().angle;
        pages[idx].setRotation(degrees((current + rotationDeg) % 360));
      }
    }

    const pdfBytes = await pdfDoc.save();
    let finalBuffer: Buffer = Buffer.from(pdfBytes);

    try {
      const linearized = execFileSync(BIN.qpdf, ["--linearize", "-", "-"], {
        input: finalBuffer,
        maxBuffer: 100 * 1024 * 1024,
      });
      if (linearized && linearized.length > 0) {
        finalBuffer = linearized;
      }
    } catch {
      // Retain standard pdfBytes if qpdf is unavailable or errors
    }

    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_rotated.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(finalBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Rotation failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-pdfa
// Convert PDF to PDF/A-2b standard for long-term archiving via Ghostscript
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-pdfa", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const conformance = String(req.body.conformance ?? "2b").toLowerCase();
  const pdfaLevel = conformance.startsWith("1") ? 1 : conformance.startsWith("3") ? 3 : 2;

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pdf");
  const rawOutputPath = join(workDir, "output_raw.pdf");
  const linearizedPath = join(workDir, "output_pdfa.pdf");

  try {
    await writeFile(inputPath, req.file.buffer);

    await execFileAsync(
      BIN.gs,
      [
        `-dPDFA=${pdfaLevel}`,
        "-dBATCH",
        "-dNOPAUSE",
        "-dNOOUTERSAVE",
        "-sProcessColorModel=DeviceRGB",
        "-sColorConversionStrategy=RGB",
        "-sDEVICE=pdfwrite",
        "-sPDFACompatibilityPolicy=1",
        `-sOutputFile=${rawOutputPath}`,
        inputPath,
      ],
      { timeout: 120_000 },
    );

    let finalPath = rawOutputPath;
    try {
      await execFileAsync(BIN.qpdf, ["--linearize", rawOutputPath, linearizedPath]);
      finalPath = linearizedPath;
    } catch {
      finalPath = rawOutputPath;
    }

    const pdfaBuf = await readFile(finalPath);
    const baseName = pdfBaseName(req.file.originalname);
    const suffix = pdfaLevel === 1 ? "pdfa1b" : pdfaLevel === 3 ? "pdfa3b" : "pdfa2b";

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_${suffix}.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(pdfaBuf);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF/A conversion failed");
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-repair
// Repair corrupted or damaged PDF documents using qpdf / ghostscript
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

    // Primary: qpdf rebuild & linearize with recovery flags
    let success = false;
    try {
      await execFileAsync(
        BIN.qpdf,
        ["--warning-exit-0", "--linearize", inputPath, outputPath],
        { timeout: 60_000 },
      );
      success = true;
    } catch {
      // Check if output was produced despite warnings
      try {
        const s = await stat(outputPath);
        if (s.size > 0) success = true;
      } catch {}

      if (!success) {
        // Fallback: Ghostscript rebuild
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
        } catch (gsErr) {
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

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-ocr
// Extract text from scanned PDFs using Ghostscript + Tesseract OCR
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-ocr", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inputPath = join(workDir, "input.pdf");
  const langParam = String(req.body.lang ?? "eng+fra").toLowerCase();

  try {
    await writeFile(inputPath, req.file.buffer);

    // Step 1: Attempt native text extraction via Python pdfplumber / pypdf first
    let pagesText: { pageNum: number; text: string }[] = [];
    try {
      const { stdout } = await execFileAsync(
        BIN.python3,
        [
          "-c",
          `
import sys, json, pypdf
try:
    reader = pypdf.PdfReader("${inputPath}")
    results = []
    for idx, page in enumerate(reader.pages):
        txt = (page.extract_text() or "").strip()
        results.append({"pageNum": idx + 1, "text": txt})
    print(json.dumps(results))
except Exception as e:
    print(json.dumps([]))
          `,
        ],
        { timeout: 30_000 },
      );
      pagesText = JSON.parse(stdout.trim());
    } catch {
      pagesText = [];
    }

    // Check if pages need OCR (scanned pages or sparse text)
    const needsOcr = pagesText.length === 0 || pagesText.some((p) => p.text.length < 15);

    let fullText = "";
    let ocrUsed = false;

    if (!needsOcr && pagesText.length > 0) {
      // Native text is fully available
      fullText = pagesText
        .map((p) => `--- Page ${p.pageNum} ---\n${p.text}`)
        .join("\n\n");
    } else {
      // OCR required for scanned pages
      ocrUsed = true;

      // Render pages as 200 DPI PNGs via Ghostscript
      const pagePattern = join(workDir, "page-%d.png");
      await execFileAsync(
        BIN.gs,
        [
          "-dNOPAUSE", "-dBATCH", "-dSAFER",
          "-sDEVICE=png16m",
          "-r200",
          `-sOutputFile=${pagePattern}`,
          inputPath,
        ],
        { timeout: 120_000 },
      );

      const files = await readdir(workDir);
      const pngPages = files
        .filter((f) => /^page-\d+\.png$/.test(f))
        .sort((a, b) => {
          const na = parseInt(a.replace("page-", "").replace(".png", "")) || 0;
          const nb = parseInt(b.replace("page-", "").replace(".png", "")) || 0;
          return na - nb;
        });

      if (pngPages.length === 0) {
        throw new Error("No pages could be rendered from PDF for OCR");
      }

      // Initialize Tesseract.js worker
      const { createWorker } = await import("tesseract.js");
      const tessLangs = langParam.includes("fra") && langParam.includes("eng")
        ? ["fra", "eng"]
        : langParam.includes("fra")
        ? ["fra"]
        : langParam.includes("deu")
        ? ["deu"]
        : langParam.includes("spa")
        ? ["spa"]
        : ["eng"];

      let worker: any = null;
      try {
        worker = await createWorker(tessLangs);

        for (let i = 0; i < Math.min(pngPages.length, 30); i++) {
          const pageNum = i + 1;
          const existing = pagesText.find((p) => p.pageNum === pageNum);

          if (existing && existing.text.length >= 50) {
            // High confidence native text
            fullText += `--- Page ${pageNum} ---\n` + existing.text + "\n\n";
          } else {
            // OCR image
            const pageFile = join(workDir, pngPages[i]);
            try {
              const { data } = await worker.recognize(pageFile);
              fullText += `--- Page ${pageNum} ---\n` + data.text.trim() + "\n\n";
            } catch {
              fullText += `--- Page ${pageNum} ---\n${existing?.text ?? "[OCR text not recognized]"}\n\n`;
            }
          }
        }
      } finally {
        if (worker) {
          await worker.terminate().catch(() => {});
        }
      }
    }

    res.json({
      text: fullText.trim(),
      totalPages: pagesText.length > 0 ? pagesText.length : 1,
      lang: langParam,
      method: ocrUsed ? "ocr" : "native",
    });
  } catch (err) {
    apiError(res, 500, "OCR_FAILED", err instanceof Error ? err.message : "PDF OCR failed");
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-metadata
// Read & update PDF Title, Author, Subject, Keywords
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-metadata", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);

    if (req.body.title !== undefined) pdfDoc.setTitle(String(req.body.title));
    if (req.body.author !== undefined) pdfDoc.setAuthor(String(req.body.author));
    if (req.body.subject !== undefined) pdfDoc.setSubject(String(req.body.subject));
    if (req.body.keywords !== undefined) {
      const kw = Array.isArray(req.body.keywords)
        ? req.body.keywords
        : String(req.body.keywords).split(",").map((s) => s.trim());
      pdfDoc.setKeywords(kw);
    }
    if (req.body.creator !== undefined) pdfDoc.setCreator(String(req.body.creator));
    if (req.body.producer !== undefined) pdfDoc.setProducer(String(req.body.producer));

    const pdfBytes = await pdfDoc.save();
    const baseName = pdfBaseName(req.file.originalname);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_metadata.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "METADATA_FAILED", err instanceof Error ? err.message : "Metadata update failed");
  }
});

export default router;

