import { Router, type IRouter } from "express";
import { apiError } from "../lib/errors.js";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import sharp from "sharp";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { upload, guardDocument, guardImage } from "../middlewares/upload.js";
import { BIN } from "../lib/binaries.js";
import { defaultRateLimit } from "../middlewares/rateLimit.js";

const execFileAsync = promisify(execFile);
const router: IRouter = Router();

const PYTHON_SCRIPTS_DIR = process.env["PYTHON_SCRIPTS_DIR"] ?? "/app/python";
const PDF_EXTRACT_PY = join(PYTHON_SCRIPTS_DIR, "pdf_extract.py");

// ─────────────────────────────────────────────────────────
// Potrace: PNG → real SVG vector via bitmap tracing
// ─────────────────────────────────────────────────────────
function buildPBM(grayscale: Buffer, width: number, height: number): Buffer {
  const header = Buffer.from(`P4\n${width} ${height}\n`, "ascii");
  const rowBytes = Math.ceil(width / 8);
  const bitmap = Buffer.alloc(height * rowBytes, 0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grayscale[y * width + x] < 128) { // dark pixel → 1 in PBM
        const bi = y * rowBytes + Math.floor(x / 8);
        bitmap[bi] |= 1 << (7 - (x % 8));
      }
    }
  }
  return Buffer.concat([header, bitmap]);
}

async function convertToSvgWithPotrace(inputBuffer: Buffer): Promise<Buffer> {
  // Resize to max 2000×2000 before tracing (potrace scales linearly with pixels)
  const { data, info } = await sharp(inputBuffer)
    .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pbm = buildPBM(data, info.width, info.height);

  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const pbmPath = join(workDir, "input.pbm");
  const svgPath = join(workDir, "output.svg");

  try {
    await writeFile(pbmPath, pbm);
    await execFileAsync(BIN.potrace, [
      "--svg",
      "--turdsize", "4",   // ignore speckles smaller than 4 pixels²
      "--alphamax", "1",   // curve smoothness
      "-o", svgPath,
      pbmPath,
    ], { timeout: 30_000 });
    return await readFile(svgPath);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ─────────────────────────────────────────────────────────
// pdfplumber helper: call Python script, parse JSON
// ─────────────────────────────────────────────────────────
async function callPdfExtract(pdfBuffer: Buffer, mode: "word" | "excel" | "text"): Promise<unknown> {
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const pdfPath = join(workDir, "input.pdf");
  await writeFile(pdfPath, pdfBuffer);

  try {
    const { stdout } = await execFileAsync(
      BIN.python3,
      [PDF_EXTRACT_PY, "--pdf", pdfPath, "--mode", mode],
      { timeout: 120_000, maxBuffer: 50 * 1024 * 1024 },
    );
    return JSON.parse(stdout);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ─────────────────────────────────────────────────────────
// SHARP supported formats
// ─────────────────────────────────────────────────────────
const SHARP_SUPPORTED = new Set(["jpeg", "png", "webp", "avif", "gif", "tiff"]);

const mimeToSharpFormat = (mime: string): keyof sharp.FormatEnum | null => {
  const map: Record<string, keyof sharp.FormatEnum> = {
    "image/jpeg": "jpeg", "image/jpg": "jpeg",
    "image/png": "png", "image/webp": "webp",
    "image/avif": "avif", "image/gif": "gif", "image/tiff": "tiff",
  };
  return map[mime] ?? null;
};

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-text
// Uses pdfplumber (same as pdf-to-word and pdf-to-excel) for consistency.
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-text", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const extracted = await callPdfExtract(req.file.buffer, "text") as { text?: string; error?: string };
    if (extracted.error) throw new Error(extracted.error);
    res.json({ text: extracted.text ?? "" });
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF parsing failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/docx-to-html
// ─────────────────────────────────────────────────────────
router.post("/convert/docx-to-html", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
    res.json({ html: result.value });
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "DOCX conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/docx-to-text
// ─────────────────────────────────────────────────────────
router.post("/convert/docx-to-text", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    res.json({ text: result.value });
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "DOCX conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/text-to-pdf
// ─────────────────────────────────────────────────────────
router.post("/convert/text-to-pdf", async (req, res) => {
  const { text } = req.body as { text?: string };
  if (typeof text !== "string" || !text.trim()) {
    apiError(res, 400, "MISSING_PARAM", "text field required"); return;
  }
  if (text.length > 500_000) {
    apiError(res, 413, "FILE_TOO_LARGE", "Text too large. Maximum 1,000,000 characters."); return;
  }
  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12, margin = 50;
    let y = height - margin;
    for (const line of text.split("\n")) {
      if (y < margin) { page = pdfDoc.addPage(); y = height - margin; }
      page.drawText(line || " ", { x: margin, y, size: fontSize });
      y -= fontSize * 1.5;
    }
    const pdfBytes = await pdfDoc.save();
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="converted.pdf"`);
    res.set("Cache-Control", "no-store");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF creation failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/image
// Standard sharp conversion + potrace for SVG output.
// When format=image/svg+xml: real vectorization via potrace (not raster wrapper).
// ─────────────────────────────────────────────────────────
router.post("/convert/image", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  const { format, quality, width, height } = req.body as {
    format?: string; quality?: string; width?: string; height?: string;
  };
  if (!format) { apiError(res, 400, "MISSING_PARAM", "format field required"); return; }

  const originalBase = (req.file.originalname ?? "converted").replace(/\.[^.]+$/, "");

  // ── Potrace path for true SVG vectorization ──────────────
  if (format === "image/svg+xml") {
    try {
      const svgBuf = await convertToSvgWithPotrace(req.file.buffer);
      res.set("Content-Type", "image/svg+xml");
      res.set("Content-Disposition", `attachment; filename="${originalBase}.svg"`);
      res.set("Cache-Control", "no-store");
      res.send(svgBuf);
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "SVG vectorization failed");
    }
    return;
  }

  // ── Sharp path for all other formats ─────────────────────
  const sharpFormat = mimeToSharpFormat(format);
  if (!sharpFormat || !SHARP_SUPPORTED.has(sharpFormat)) {
    apiError(res, 422, "UNSUPPORTED_FORMAT", `Format ${format} is not supported server-side. Use client-side conversion.`, "clientFallback=true");
    return;
  }

  try {
    const qualityNum = quality ? Math.round(parseFloat(quality) * 100) : 80;
    const widthNum = width ? parseInt(width, 10) : undefined;
    const heightNum = height ? parseInt(height, 10) : undefined;
    if ((widthNum && widthNum > 10000) || (heightNum && heightNum > 10000)) {
      apiError(res, 400, "INVALID_PARAM", "Resize dimensions must not exceed 10,000 px."); return;
    }
    let pipeline = sharp(req.file.buffer);
    if (widthNum || heightNum) {
      pipeline = pipeline.resize(widthNum, heightNum, { fit: "inside", withoutEnlargement: true });
    }
    const outputBuffer = await pipeline.toFormat(sharpFormat, { quality: qualityNum }).toBuffer();
    const ext = sharpFormat === "jpeg" ? "jpg" : sharpFormat;
    res.set("Content-Type", format);
    res.set("Content-Disposition", `attachment; filename="${originalBase}.${ext}"`);
    res.set("Cache-Control", "no-store");
    res.send(outputBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Image conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-word
// pdfplumber: proper paragraph detection + heading size heuristics + table rows.
// Falls back to pdfjs-dist coordinate grouping if Python fails.
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-word", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");
  const children: Paragraph[] = [];

  try {
    // ── pdfplumber path ───────────────────────────────────
    const extracted = await callPdfExtract(req.file.buffer, "word") as {
      pages: Array<{
        page: number;
        paragraphs: Array<{ text: string; heading: number; table_row?: boolean }>;
      }>;
    };

    for (let pi = 0; pi < extracted.pages.length; pi++) {
      if (pi > 0) {
        children.push(new Paragraph({ children: [new TextRun("")], spacing: { before: 400 } }));
      }
      for (const para of extracted.pages[pi].paragraphs) {
        if (!para.text.trim()) { children.push(new Paragraph({ children: [new TextRun("")] })); continue; }
        if (para.heading === 1) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: para.text, bold: true })] }));
        } else if (para.heading === 2) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: para.text, bold: true })] }));
        } else if (para.heading === 3) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: para.text })] }));
        } else if (para.table_row) {
          children.push(new Paragraph({ children: [new TextRun({ text: para.text, font: "Courier New", size: 18 })], spacing: { after: 40 } }));
        } else {
          children.push(new Paragraph({ children: [new TextRun(para.text)], spacing: { after: 80 } }));
        }
      }
    }
  } catch (_plumberErr) {
    // ── pdfjs-dist fallback ───────────────────────────────
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
    GlobalWorkerOptions.workerSrc = "";
    const pdf = await getDocument({
      data: new Uint8Array(req.file.buffer),
      useWorkerFetch: false, useSystemFonts: true,
    }).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      if (pageNum > 1) children.push(new Paragraph({ children: [new TextRun("")], spacing: { before: 200 } }));
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items = textContent.items as Array<{ str: string; transform?: number[]; height?: number }>;
      const lineMap = new Map<number, string[]>();
      for (const item of items) {
        const y = Math.round((item.transform?.[5] ?? 0) / 4) * 4;
        if (!lineMap.has(y)) lineMap.set(y, []);
        lineMap.get(y)!.push(item.str);
      }
      for (const y of [...lineMap.keys()].sort((a, b) => b - a)) {
        const lineText = lineMap.get(y)!.join("").trim();
        if (!lineText) continue;
        const lineItems = items.filter((it) => Math.round((it.transform?.[5] ?? 0) / 4) * 4 === y);
        const maxH = Math.max(0, ...lineItems.map((it) => it.height ?? 0));
        if (maxH >= 18) children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: lineText, bold: true })] }));
        else if (maxH >= 14) children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: lineText, bold: true })] }));
        else children.push(new Paragraph({ children: [new TextRun(lineText)], spacing: { after: 80 } }));
      }
    }
  }

  try {
    const doc = new Document({ sections: [{ properties: {}, children }] });
    const buffer = await Packer.toBuffer(doc);
    res.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.set("Content-Disposition", `attachment; filename="${baseName}.docx"`);
    res.set("Cache-Control", "no-store");
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-excel
// pdfplumber: table detection → XLSX. Falls back to coordinate grouping.
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-excel", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");

  try {
    const extracted = await callPdfExtract(req.file.buffer, "excel") as {
      tables: Array<{ page: number; rows: string[][]; is_table: boolean }>;
    };

    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();

    if (extracted.tables.length === 0) {
      // Empty PDF — create blank sheet
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["(no tables found)"]]), "Extracted");
    } else if (extracted.tables.length === 1) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(extracted.tables[0].rows), "Extracted");
    } else {
      // One sheet per table, labelled by page
      for (let i = 0; i < extracted.tables.length; i++) {
        const t = extracted.tables[i];
        const sheetName = `Page ${t.page}${extracted.tables.filter((x) => x.page === t.page).length > 1 ? ` (${i + 1})` : ""}`;
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(t.rows), sheetName.slice(0, 31));
      }
    }

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.set("Content-Disposition", `attachment; filename="${baseName}.xlsx"`);
    res.set("Cache-Control", "no-store");
    res.send(buf);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Extraction failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/heic
// HEIC/HEIF → JPEG | PNG | WEBP | PDF
// Primary: sharp (works if libvips compiled with heif support).
// Fallback: Python bridge with pillow-heif.
// ─────────────────────────────────────────────────────────
const HEIC_PY = join(PYTHON_SCRIPTS_DIR, "heic_convert.py");

async function heicViaSharp(inputBuffer: Buffer, outputMime: string): Promise<Buffer> {
  const fmt = mimeToSharpFormat(outputMime);
  if (!fmt) throw new Error(`Unsupported output format: ${outputMime}`);
  return sharp(inputBuffer).toFormat(fmt, { quality: 90 }).toBuffer();
}

async function heicViaPython(inputBuffer: Buffer, outputMime: string, workDir: string): Promise<Buffer> {
  const fmtMap: Record<string, string> = {
    "image/jpeg": "JPEG", "image/jpg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WEBP",
  };
  const fmt = fmtMap[outputMime];
  if (!fmt) throw new Error(`Unsupported HEIC output format for Python bridge: ${outputMime}`);
  const extMap: Record<string, string> = { JPEG: "jpg", PNG: "png", WEBP: "webp" };
  const inputPath = join(workDir, "input.heic");
  const outputPath = join(workDir, `output.${extMap[fmt]}`);
  await writeFile(inputPath, inputBuffer);
  await execFileAsync(BIN.python3, [HEIC_PY, "--input", inputPath, "--output", outputPath, "--format", fmt], { timeout: 60_000 });
  return readFile(outputPath);
}

router.post("/convert/heic", defaultRateLimit, upload.single("file"), async (req, res) => {
  if (!req.file) { res.status(400).json({ error: true, code: "NO_FILE", message: "No file uploaded" }); return; }
  const mime = req.file.mimetype.toLowerCase();
  if (!mime.includes("heic") && !mime.includes("heif") &&
      !req.file.originalname?.match(/\.(heic|heif)$/i)) {
    res.status(415).json({ error: true, code: "UNSUPPORTED_TYPE", message: "Only HEIC/HEIF files are accepted." });
    return;
  }
  if (req.file.size > 30 * 1024 * 1024) {
    res.status(413).json({ error: true, code: "FILE_TOO_LARGE", message: "File too large. Maximum 30 MB for HEIC conversion." });
    return;
  }

  const outputMime = String(req.body.format ?? "image/jpeg");
  const baseName = (req.file.originalname ?? "image").replace(/\.(heic|heif)$/i, "");
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg", "image/jpg": "jpg",
    "image/png": "png", "image/webp": "webp", "application/pdf": "pdf",
  };

  // ── PDF output: convert to JPEG first, then embed in PDF ──
  if (outputMime === "application/pdf") {
    try {
      let jpegBuf: Buffer;
      try {
        jpegBuf = await heicViaSharp(req.file.buffer, "image/jpeg");
      } catch {
        const id = randomUUID();
        const workDir = join(tmpdir(), "everydaytools", id);
        await mkdir(workDir, { recursive: true });
        try {
          jpegBuf = await heicViaPython(req.file.buffer, "image/jpeg", workDir);
        } finally {
          await rm(workDir, { recursive: true, force: true }).catch(() => {});
        }
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
      res.set({ "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${baseName}.pdf"`, "Cache-Control": "no-store" });
      res.send(Buffer.from(pdfBytes));
    } catch (err) {
      res.status(500).json({ error: true, code: "HEIC_CONVERSION_FAILED", message: err instanceof Error ? err.message : "HEIC to PDF failed" });
    }
    return;
  }

  const ext = extMap[outputMime] ?? "jpg";
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });

  try {
    let outputBuf: Buffer;
    try {
      outputBuf = await heicViaSharp(req.file.buffer, outputMime);
    } catch {
      outputBuf = await heicViaPython(req.file.buffer, outputMime, workDir);
    }
    const normalizedMime = outputMime === "image/jpg" ? "image/jpeg" : outputMime;
    res.set({ "Content-Type": normalizedMime, "Content-Disposition": `attachment; filename="${baseName}.${ext}"`, "Cache-Control": "no-store" });
    res.send(outputBuf);
  } catch (err) {
    res.status(500).json({ error: true, code: "HEIC_CONVERSION_FAILED", message: err instanceof Error ? err.message : "HEIC conversion failed. Ensure libvips is compiled with HEIF support or pillow-heif is installed." });
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/image-to-pdf
// ─────────────────────────────────────────────────────────
router.post("/convert/image-to-pdf", upload.single("file"), guardImage, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const A4W = 595.28, A4H = 841.89, MARGIN = 40;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([A4W, A4H]);

    let imgBuf: Buffer;
    let isPNG = false;
    if (req.file.mimetype === "image/png") {
      imgBuf = req.file.buffer; isPNG = true;
    } else if (req.file.mimetype === "image/svg+xml") {
      imgBuf = await sharp(req.file.buffer).png().toBuffer(); isPNG = true;
    } else {
      imgBuf = await sharp(req.file.buffer).jpeg({ quality: 92 }).toBuffer();
    }

    const img = isPNG ? await pdfDoc.embedPng(imgBuf) : await pdfDoc.embedJpg(imgBuf);
    const maxW = A4W - 2 * MARGIN, maxH = A4H - 2 * MARGIN;
    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const dw = img.width * scale, dh = img.height * scale;
    page.drawImage(img, { x: (A4W - dw) / 2, y: (A4H - dh) / 2, width: dw, height: dh });

    const pdfBytes = await pdfDoc.save();
    const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="${baseName}.pdf"`);
    res.set("Cache-Control", "no-store");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

export default router;
