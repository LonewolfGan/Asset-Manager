import { Router, type Request, type Response } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";
import { handlePdfMetadata } from "../convert/pdf-metadata-handler.js";
import {
  applyPdfWatermark,
  addPdfPageNumbers,
} from "./pdf-annotate-logic.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-watermark
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-watermark",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req: Request, res: Response) => {
    if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

    try {
      const finalBuffer = await applyPdfWatermark(req.file.buffer, {
        text: req.body.text !== undefined ? String(req.body.text) : undefined,
        opacity: req.body.opacity !== undefined ? parseFloat(String(req.body.opacity)) : undefined,
        fontSize: req.body.fontSize !== undefined ? parseInt(String(req.body.fontSize)) : undefined,
        angle: req.body.angle !== undefined ? parseInt(String(req.body.angle)) : undefined,
        color: req.body.color !== undefined ? String(req.body.color) : undefined,
        pages: req.body.pages !== undefined ? String(req.body.pages) : undefined,
        pattern: req.body.pattern !== undefined ? String(req.body.pattern) : undefined,
      });

      const baseName = pdfBaseName(req.file.originalname);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": buildContentDisposition(`${baseName}_watermarked.pdf`, "pdf"),
        "Cache-Control": "no-store",
      });
      res.send(finalBuffer);
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Watermark failed");
    }
  },
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-page-numbers
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-page-numbers",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req: Request, res: Response) => {
    if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

    try {
      const finalBuffer = await addPdfPageNumbers(req.file.buffer, {
        position: req.body.position !== undefined ? String(req.body.position) : undefined,
        startFrom: req.body.startFrom !== undefined ? parseInt(String(req.body.startFrom)) : undefined,
        fontSize: req.body.fontSize !== undefined ? parseInt(String(req.body.fontSize)) : undefined,
        skipFirst: String(req.body.skipFirst ?? "false").toLowerCase() === "true",
        format: req.body.format !== undefined ? String(req.body.format) : undefined,
      });

      const baseName = pdfBaseName(req.file.originalname);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": buildContentDisposition(`${baseName}_numbered.pdf`, "pdf"),
        "Cache-Control": "no-store",
      });
      res.send(finalBuffer);
    } catch (err) {
      apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Page numbering failed");
    }
  },
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-metadata (Alias forwarded to handlePdfMetadata)
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-metadata",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  handlePdfMetadata,
);

export default router;
