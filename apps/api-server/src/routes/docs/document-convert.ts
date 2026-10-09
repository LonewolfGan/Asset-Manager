import { Router, type Request, type Response } from "express";
import { upload, guardDocument } from "../../middlewares/upload.js";
import { convertWithLibreOffice } from "../../lib/libreoffice.js";
import { mediumRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { isValidTargetFormat, isValidInputExt, MIME_MAP } from "../../lib/document-validation.js";

const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/document-convert
// Universal document conversion via LibreOffice headless
// Supports DOCX, DOC, ODT, RTF, TXT, HTML, EPUB, PPTX, XLSX → PDF, DOCX, ODT, RTF, TXT, HTML
// ─────────────────────────────────────────────────────────
router.post("/tools/document-convert", mediumRateLimit, upload.single("file"), guardDocument, async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const targetFormat = String(req.body.targetFormat ?? req.query.targetFormat ?? "pdf").toLowerCase().trim();
  if (!isValidTargetFormat(targetFormat)) {
    apiError(res, 400, "INVALID_PARAM", `Unsupported target format: ${targetFormat}`);
    return;
  }

  const originalName = req.file.originalname ?? "document";
  const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const inputExt = extMatch ? extMatch[1].toLowerCase() : "docx";

  if (!isValidInputExt(inputExt)) {
    apiError(res, 400, "INVALID_PARAM", `Invalid input document extension: ${inputExt}`);
    return;
  }

  try {
    const resultBuffer = await convertWithLibreOffice(req.file.buffer, inputExt, targetFormat);
    const baseName = originalName.replace(/\.[^.]+$/, "");
    const outMime = MIME_MAP[targetFormat] ?? "application/octet-stream";

    res.set({
      "Content-Type": outMime,
      "Content-Disposition": `attachment; filename="${baseName}.${targetFormat}"`,
      "Cache-Control": "no-store",
    });
    res.send(resultBuffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Document conversion failed");
  }
});

export default router;
