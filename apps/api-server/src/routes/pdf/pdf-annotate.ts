import { Router } from "express";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";
import { sanitizeWinAnsi } from "../../lib/pdf-text.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-watermark
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-watermark", defaultRateLimit, upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const rawText  = String(req.body.text ?? "WATERMARK").slice(0, 100);
  const text     = sanitizeWinAnsi(rawText) || "WATERMARK";
  const opacity  = Math.min(1, Math.max(0.05, parseFloat(String(req.body.opacity ?? "0.3"))));
  const fontSize = Math.min(120, Math.max(10, parseInt(String(req.body.fontSize ?? "60")) || 60));
  const angle    = parseInt(String(req.body.angle ?? "45")) || 0;
  const colorStr = String(req.body.color ?? "gray").trim();
  const pageScope = String(req.body.pages ?? "all").trim();
  const pattern   = String(req.body.pattern ?? "repeat").trim();

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
    const finalBuffer = await linearizePdf(Buffer.from(pdfBytes));

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
  const rawFormat = String(req.body.format ?? "{n}").trim();
  const format    = sanitizeWinAnsi(rawFormat) || "{n}";
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
    const finalBuffer = await linearizePdf(Buffer.from(pdfBytes));

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
// POST /tools/pdf-metadata
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
