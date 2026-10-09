import { Router } from "express";
import { PDFDocument, degrees } from "pdf-lib";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";
import { guardSinglePdf, guardMultiPdf, pdfBaseName, parsePageRanges } from "./guards.js";
import { zipSync } from "fflate";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-reorder
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
    const finalBuffer = await linearizePdf(Buffer.from(pdfBytes));

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
    const finalBuffer = await linearizePdf(Buffer.from(pdfBytes));
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="merged_document.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(finalBuffer);
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
    const finalBuffer = await linearizePdf(Buffer.from(pdfBytes));

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

export default router;
