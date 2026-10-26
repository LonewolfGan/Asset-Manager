import { Router, type Request, type Response } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";
import { handlePdfMetadata } from "../convert/pdf-metadata-handler.js";
import { handlePdfWatermark } from "../convert/pdf-watermark-handler.js";
import { handlePdfPageNumbers } from "../convert/pdf-page-numbers-handler.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-watermark (Legacy alias forwarded to handlePdfWatermark)
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-watermark",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  handlePdfWatermark,
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-page-numbers (Forwarded to handlePdfPageNumbers)
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-page-numbers",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  handlePdfPageNumbers,
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
