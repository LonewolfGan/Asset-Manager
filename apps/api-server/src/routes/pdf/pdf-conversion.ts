import { Router } from "express";
import { upload } from "../../middlewares/upload.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { guardSinglePdf, pdfBaseName } from "./guards.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { handlePdfToPdfa } from "../convert/pdf-to-pdfa-handler.js";
import {
  rasterizePdfToImages,
  convertImagesToPdf,
} from "./pdf-conversion-logic.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-images
// Each PDF page → requested format (PNG, JPEG, WebP, etc.)
// Returns single image or a ZIP archive for multi-page documents.
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-to-images",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  async (req, res) => {
    if (!req.file) {
      apiError(res, 400, "NO_FILE", "No file uploaded");
      return;
    }

    const rawFormat = String(req.body.format ?? "png").toLowerCase();
    const dpi = Math.min(300, Math.max(72, parseInt(String(req.body.dpi ?? "150"), 10) || 150));
    const baseName = pdfBaseName(req.file.originalname);

    try {
      const result = await rasterizePdfToImages(req.file.buffer, {
        format: rawFormat,
        dpi,
        baseName,
      });

      if (!result.isZip) {
        const disposition = buildContentDisposition(
          `${baseName}_page_1.${result.ext}`,
          result.ext
        );
        res.set({
          "Content-Type": result.mime,
          "Content-Disposition": disposition,
          "X-Page-Count": "1",
          "Cache-Control": "no-store",
          "Access-Control-Expose-Headers": "X-Page-Count",
        });
        res.send(result.buffer);
      } else {
        const disposition = buildContentDisposition(
          `${baseName}_images_${result.ext}.zip`,
          "zip"
        );
        res.set({
          "Content-Type": "application/zip",
          "Content-Disposition": disposition,
          "X-Page-Count": String(result.pageCount),
          "Cache-Control": "no-store",
          "Access-Control-Expose-Headers": "X-Page-Count",
        });
        res.send(result.buffer);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Conversion failed";
      const isMissing = msg.includes("ENOENT");
      const isClient = /invalid|corrupt|empty|unsupported|check that the pdf is valid/i.test(msg);
      const status = isMissing ? 503 : isClient ? 400 : 500;
      const code = isMissing
        ? "BINARY_UNAVAILABLE"
        : isClient
        ? "INVALID_INPUT"
        : "CONVERSION_FAILED";

      apiError(
        res,
        status,
        code,
        isMissing ? "Ghostscript is not installed on this server." : msg
      );
    }
  }
);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-pdfa
// Convert PDF to PDF/A-1b, PDF/A-2b, or PDF/A-3b standard
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/pdf-to-pdfa",
  defaultRateLimit,
  upload.single("file"),
  guardSinglePdf,
  handlePdfToPdfa
);

// ─────────────────────────────────────────────────────────
// POST /tools/images-to-pdf
// Combines up to 20 images into a unified, linearized PDF
// ─────────────────────────────────────────────────────────
router.post(
  "/tools/images-to-pdf",
  defaultRateLimit,
  upload.array("files", 20),
  async (req, res) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      apiError(res, 400, "MISSING_FILES", "At least 1 image file is required.");
      return;
    }

    for (const f of files) {
      if (!f.mimetype.startsWith("image/") && !f.originalname.match(/\.(png|jpe?g|webp|avif|tiff?|gif|bmp|heic|heif|svg)$/i)) {
        apiError(res, 415, "UNSUPPORTED_TYPE", `${f.originalname} is not an accepted image format.`);
        return;
      }
      if (f.size > 25 * 1024 * 1024) {
        apiError(res, 413, "FILE_TOO_LARGE", `${f.originalname} exceeds 25 MB limit.`);
        return;
      }
    }

    try {
      const imageItems = files.map((f) => ({
        buffer: f.buffer,
        mime: f.mimetype,
        name: f.originalname,
      }));

      const result = await convertImagesToPdf(imageItems);
      const disposition = buildContentDisposition("images_combined.pdf", "pdf");

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "X-Page-Count": String(result.pageCount),
        "Cache-Control": "no-store",
        "Access-Control-Expose-Headers": "X-Page-Count",
      });
      res.send(result.buffer);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Images to PDF conversion failed";
      const isClient = msg.includes("Invalid") || msg.includes("corrupt") || msg.includes("required");
      apiError(res, isClient ? 400 : 500, "CONVERSION_FAILED", msg);
    }
  }
);

export default router;
