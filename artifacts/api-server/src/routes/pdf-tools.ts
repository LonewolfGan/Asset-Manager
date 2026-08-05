import { Router } from "express";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { zipSync } from "fflate";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, readdir, rm, mkdir } from "fs/promises";
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

  const format = String(req.body.format ?? "jpeg").toLowerCase() === "png" ? "png" : "jpeg";
  const dpi = Math.min(300, Math.max(72, parseInt(String(req.body.dpi ?? "150")) || 150));
  const gsDevice = format === "png" ? "png16m" : "jpeg";
  const ext = format === "png" ? "png" : "jpg";
  const baseName = pdfBaseName(req.file.originalname);

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPattern = join(workDir, `page-%d.${ext}`);

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
      .filter((f) => f.startsWith("page-") && f.endsWith(`.${ext}`))
      .sort((a, b) => {
        const n = (s: string) => parseInt(s.replace("page-", "").replace(`.${ext}`, "")) || 0;
        return n(a) - n(b);
      });

    if (imgFiles.length === 0) {
      apiError(res, 422, "CONVERSION_FAILED", "Ghostscript did not produce any image output. Check the PDF is valid.");
      return;
    }

    if (imgFiles.length === 1) {
      const buf = await readFile(join(workDir, imgFiles[0]));
      const mime = format === "png" ? "image/png" : "image/jpeg";
      res.set({ "Content-Type": mime, "Content-Disposition": `attachment; filename="${baseName}_page_1.${ext}"`, "Cache-Control": "no-store" });
      res.send(buf);
    } else {
      const zipEntries: Record<string, Uint8Array> = {};
      for (const f of imgFiles) {
        const pageNum = f.replace("page-", "").replace(`.${ext}`, "");
        zipEntries[`${baseName}_page_${pageNum}.${ext}`] = new Uint8Array(await readFile(join(workDir, f)));
      }
      const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${baseName}_images.zip"`,
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
    const src = await PDFDocument.load(req.file.buffer);
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
    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_reordered.pdf"`,
      "X-Page-Count": String(pageIndices.length),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Page-Count",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Reorder failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-compress
// Ghostscript recompresses images + object streams for real size reduction.
// quality: "screen" (72dpi) | "ebook" (150dpi, default) | "printer" (300dpi) | "prepress" (300dpi+ICC)
// Falls back to pdf-lib metadata strip if gs fails.
// ─────────────────────────────────────────────────────────
const GS_SETTINGS: Record<string, string> = {
  screen:   "/screen",
  ebook:    "/ebook",
  printer:  "/printer",
  prepress: "/prepress",
};

router.post("/tools/pdf-compress", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const level = String(req.body.level ?? req.body.quality ?? "ebook");
  const gsSettings = GS_SETTINGS[level] ?? "/ebook";
  const input = req.file.buffer;
  const baseName = pdfBaseName(req.file.originalname);

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const inPath = join(workDir, "input.pdf");
  const outPath = join(workDir, "output.pdf");

  let finalBuffer: Buffer;
  let gain: number;

  try {
    await writeFile(inPath, input);
    await execFileAsync(BIN.gs, [
      "-dNOPAUSE", "-dBATCH", "-dSAFER",
      "-sDEVICE=pdfwrite",
      `-dPDFSETTINGS=${gsSettings}`,
      "-dCompatibilityLevel=1.6",
      `-sOutputFile=${outPath}`,
      inPath,
    ], { timeout: 90_000 });

    const gsOutput = await readFile(outPath);
    finalBuffer = gsOutput.length < input.length ? gsOutput : input;
    gain = Math.round((1 - finalBuffer.length / input.length) * 100);
  } catch (_gsErr) {
    // Fallback: pdf-lib metadata strip + object streams
    try {
      const pdfDoc = await PDFDocument.load(input, { ignoreEncryption: true });
      pdfDoc.setTitle(""); pdfDoc.setAuthor(""); pdfDoc.setSubject("");
      pdfDoc.setKeywords([]); pdfDoc.setProducer("EverydayTools"); pdfDoc.setCreator("EverydayTools");
      const stripped = Buffer.from(await pdfDoc.save({ useObjectStreams: true }));
      finalBuffer = stripped.length < input.length ? stripped : input;
      gain = Math.round((1 - finalBuffer.length / input.length) * 100);
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Compression failed");
      return;
    }
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }

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

    if (segments.length === 1) {
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, segments[0]);
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

  const password = String(req.body.password ?? "");

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfDoc = await PDFDocument.load(req.file.buffer, {
      password: password || undefined,
      ignoreEncryption: !password,
    } as any);
    const pdfBytes = await pdfDoc.save();
    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_unlocked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    const raw = err instanceof Error ? err.message : "";
    const msg = raw.toLowerCase().includes("password") || raw.toLowerCase().includes("encrypt")
      ? "Incorrect password or file uses unsupported encryption."
      : raw || "Unlock failed";
    apiError(res, 500, "CONVERSION_FAILED", msg);
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-watermark
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-watermark", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const text    = String(req.body.text ?? "WATERMARK").slice(0, 100);
  const opacity = Math.min(1, Math.max(0, parseFloat(String(req.body.opacity ?? "0.3"))));
  const fontSize = Math.min(120, Math.max(10, parseInt(String(req.body.fontSize ?? "60")) || 60));
  const angle   = parseInt(String(req.body.angle ?? "45")) || 45;

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    for (const page of pdfDoc.getPages()) {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: (width - font.widthOfTextAtSize(text, fontSize)) / 2,
        y: height / 2 - fontSize / 2,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(angle),
      });
    }
    const pdfBytes = await pdfDoc.save();
    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_watermarked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Watermark failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-page-numbers
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-page-numbers", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const position  = String(req.body.position  ?? "bottom-center");
  const startFrom = Math.max(1, parseInt(String(req.body.startFrom ?? "1")) || 1);
  const fontSize  = 11;
  const margin    = 22;

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const label = String(i + startFrom);
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
    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_numbered.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Page numbering failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-rotate
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-rotate", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const rotationDeg = parseInt(String(req.body.rotation ?? "90")) || 90;
  const pageList    = String(req.body.pages ?? "all");

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    const pageIndices = pageList === "all"
      ? Array.from({ length: totalPages }, (_, i) => i)
      : pageList.split(",").map((s) => parseInt(s.trim()) - 1).filter((i) => i >= 0 && i < totalPages);

    for (const idx of pageIndices) {
      const current = pages[idx].getRotation().angle;
      pages[idx].setRotation(degrees((current + rotationDeg) % 360));
    }

    const pdfBytes = await pdfDoc.save();
    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_rotated.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Rotation failed");
  }
});

export default router;
