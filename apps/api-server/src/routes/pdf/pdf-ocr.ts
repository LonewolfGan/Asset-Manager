import { Router, type Request, type Response } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf } from "./guards.js";
import {
  extractPdfTextWithPython,
  performPdfOcr,
  type OcrResult,
  type OcrOptions,
} from "./pdf-ocr-logic.js";

const router = Router();

export { extractPdfTextWithPython, performPdfOcr, type OcrResult, type OcrOptions };

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-ocr
// Extract text from scanned PDFs using Ghostscript + Tesseract OCR
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-ocr",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req: Request, res: Response) => {
    if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

    try {
      const result = await performPdfOcr(req.file.buffer, {
        lang: req.body.lang !== undefined ? String(req.body.lang) : undefined,
      });
      res.json(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "PDF OCR failed";
      const isClient = /empty|invalid pdf buffer/i.test(msg);
      apiError(res, isClient ? 400 : 500, isClient ? "INVALID_INPUT" : "OCR_FAILED", msg);
    }
  },
);

export default router;
