import { Router } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { compressPdfBuffer, repairPdfBuffer } from "./pdf-optimize-logic.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-compress
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-compress",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    try {
      const level = String(req.body.level ?? req.body.quality ?? "recommended");
      const result = await compressPdfBuffer(req.file.buffer, { level });

      const baseName = pdfBaseName(req.file.originalname);
      const disposition = buildContentDisposition(`${baseName}_compressed.pdf`, "pdf");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "X-Original-Size": String(result.originalSize),
        "X-Compressed-Size": String(result.compressedSize),
        "X-Compression-Gain": String(result.gain),
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Original-Size,X-Compressed-Size,X-Compression-Gain",
      });
      res.send(result.buffer);
    } catch (err) {
      apiError(
        res,
        500,
        "COMPRESSION_FAILED",
        err instanceof Error ? err.message : "Compression failed"
      );
    }
  }
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-repair
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-repair",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    try {
      const repairedBuf = await repairPdfBuffer(req.file.buffer);
      const baseName = pdfBaseName(req.file.originalname);
      const disposition = buildContentDisposition(`${baseName}_repaired.pdf`, "pdf");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "Cache-Control": "no-store",
      });
      res.send(repairedBuf);
    } catch (err) {
      apiError(
        res,
        500,
        "CONVERSION_FAILED",
        err instanceof Error ? err.message : "PDF repair failed"
      );
    }
  }
);

export default router;
