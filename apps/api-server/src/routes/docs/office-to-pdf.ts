import { Router, type Request, type Response } from "express";
import mammoth from "mammoth";
import { zipSync } from "fflate";
import { upload, guardDocument } from "../../middlewares/upload.js";
import { htmlToPdfBuffer } from "../../lib/html-to-pdf.js";
import { convertWithLibreOffice, convertPptxToImages } from "../../lib/libreoffice.js";
import { mediumRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { sendPdf } from "./send-pdf.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/word-to-pdf
// LibreOffice headless — full fidelity (fonts, images, colours, tables).
// Falls back to mammoth→pdfkit if LibreOffice fails.
// ─────────────────────────────────────────────────────────
router.post("/tools/word-to-pdf", mediumRateLimit, upload.single("file"), guardDocument, async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const mime = req.file.mimetype;
  const isDocx = mime.includes("wordprocessingml") || mime.includes("msword") ||
    /\.docx?$/i.test(req.file.originalname ?? "");
  if (!isDocx) { apiError(res, 415, "UNSUPPORTED_TYPE", "Please upload a .docx or .doc file"); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.(docx?|doc)$/i, "");

  try {
    const ext = /\.docx$/i.test(req.file.originalname ?? "") ? "docx" : "doc";
    const pdfBuf = await convertWithLibreOffice(req.file.buffer, ext, "pdf");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (_loErr) {
    // Fallback: mammoth → pdfkit (layout-lossy but always works)
    try {
      const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
      const pdfBuf = await htmlToPdfBuffer(result.value);
      sendPdf(res, pdfBuf, `${baseName}.pdf`);
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
    }
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/excel-to-pdf
// LibreOffice headless — preserves grid, merged cells, colours, charts.
// Falls back to xlsx→pdfkit if LibreOffice fails.
// ─────────────────────────────────────────────────────────
router.post("/tools/excel-to-pdf", mediumRateLimit, upload.single("file"), guardDocument, async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const rawName = req.file.originalname ?? "spreadsheet";
  const baseName = rawName.replace(/\.(xlsx?|xls|ods|csv)$/i, "");
  const ext = rawName.split(".").pop()?.toLowerCase() ?? "xlsx";

  try {
    const pdfBuf = await convertWithLibreOffice(req.file.buffer, ext, "pdf");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (_loErr) {
    // Fallback: xlsx → pdfkit (text-only grid)
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = (req.body?.sheet as string | undefined) ?? wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: "" }) as string[][];

      const PDFDocument = (await import("pdfkit")).default;
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
      doc.on("data", (c: Buffer) => chunks.push(c));

      const pdfBuf = await new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
        rows.forEach((row, ri) => {
          const text = (Array.isArray(row) ? row : []).slice(0, 20)
            .map((c) => String(c ?? "").trim().slice(0, 40)).join("  |  ");
          if (!text.trim()) return;
          if (ri === 0) doc.fontSize(9).font("Helvetica-Bold").text(text, { lineGap: 2 });
          else doc.fontSize(8).font("Helvetica").text(text, { lineGap: 1 });
        });
        doc.end();
      });

      sendPdf(res, pdfBuf, `${baseName}.pdf`);
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
    }
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pptx-to-pdf
// LibreOffice headless — full visual fidelity (images, transitions, fonts).
// Falls back to pdfkit text-extraction if LibreOffice fails.
// ─────────────────────────────────────────────────────────
router.post("/tools/pptx-to-pdf", mediumRateLimit, upload.single("file"), guardDocument, async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const baseName = (req.file.originalname ?? "presentation").replace(/\.pptx?$/i, "");

  try {
    const ext = /\.ppt$/i.test(req.file.originalname ?? "") ? "ppt" : "pptx";
    const pdfBuf = await convertWithLibreOffice(req.file.buffer, ext, "pdf");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (_loErr) {
    // Fallback: XML text extraction → pdfkit
    try {
      const { unzipSync } = await import("fflate");
      const zipEntries = unzipSync(new Uint8Array(req.file.buffer));
      const slideKeys = Object.keys(zipEntries)
        .filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))
        .sort((a, b) => {
          const n = (s: string) => parseInt(s.match(/\d+/)?.[0] ?? "0");
          return n(a) - n(b);
        });

      const slides: Array<{ title: string; body: string[] }> = [];
      for (const key of slideKeys) {
        const xml = Buffer.from(zipEntries[key]).toString("utf-8");
        const texts = [...xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/gi)]
          .map((m) => m[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim())
          .filter(Boolean);
        slides.push({ title: texts[0] ?? `Slide ${slides.length + 1}`, body: texts.slice(1) });
      }

      if (slides.length === 0) {
        apiError(res, 422, "CONVERSION_FAILED", "No slides found. Make sure this is a valid .pptx file.");
        return;
      }

      const PDFDocument = (await import("pdfkit")).default;
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 60, size: "A4" });
      doc.on("data", (c: Buffer) => chunks.push(c));

      const pdfBuf = await new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
        slides.forEach((slide, i) => {
          if (i > 0) doc.addPage();
          doc.fontSize(9).font("Helvetica").fillColor("#888888")
            .text(`Slide ${i + 1} of ${slides.length}`, { align: "right" });
          doc.fillColor("#000000").moveDown(0.3);
          doc.fontSize(20).font("Helvetica-Bold").text(slide.title, { lineGap: 4 });
          doc.moveDown(0.4);
          const y = doc.y;
          doc.lineWidth(1).moveTo(60, y).lineTo(doc.page.width - 60, y).stroke("#cccccc");
          doc.y = y + 10;
          doc.fontSize(12).font("Helvetica");
          for (const line of slide.body) {
            if (line.trim()) doc.text(`\u2022  ${line}`, { indent: 10, lineGap: 4 });
          }
        });
        doc.end();
      });

      sendPdf(res, pdfBuf, `${baseName}.pdf`);
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
    }
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pptx-to-images
// LibreOffice headless → per-slide PNG → ZIP.
// Returns real pixel-accurate slide images, not text previews.
// ─────────────────────────────────────────────────────────
router.post("/tools/pptx-to-images", mediumRateLimit, upload.single("file"), guardDocument, async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  try {
    const slides = await convertPptxToImages(req.file.buffer);
    if (slides.length === 0) {
      apiError(res, 422, "CONVERSION_FAILED", "No slides generated. Make sure this is a valid .pptx file.");
      return;
    }

    const zipEntries: Record<string, Uint8Array> = {};
    for (const slide of slides) {
      zipEntries[slide.name] = new Uint8Array(slide.data);
    }
    const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
    const baseName = (req.file.originalname ?? "presentation").replace(/\.pptx?$/i, "");

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${baseName}_slides.zip"`,
      "X-Slide-Count": String(slides.length),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Slide-Count",
    });
    res.send(zipBuf);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

export default router;
