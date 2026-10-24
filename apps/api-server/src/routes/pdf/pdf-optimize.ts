import { Router } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { compressPdfBuffer, repairPdfBuffer } from "./pdf-optimize-logic.js";
import { handlePdfCompress } from "../convert/pdf-compress-handler.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-compress (High-Fidelity ProcessPool Engine)
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-compress",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  handlePdfCompress
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
