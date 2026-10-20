import { Router, type Request, type Response } from "express";
import { upload, guardDocument } from "../../middlewares/upload.js";
import { convertWithLibreOffice } from "../../lib/libreoffice.js";
import { mediumRateLimit } from "../../middlewares/rateLimit.js";
import { apiError } from "../../lib/errors.js";
import { isValidTargetFormat, isValidInputExt, MIME_MAP } from "../../lib/document-validation.js";
import { buildContentDisposition } from "../convert/convert-image.js";

const router = Router();

export function sendDocument(
  res: Response,
  buf: Buffer,
  originalName: string,
  targetFormat: string,
): void {
  const normTarget = targetFormat.toLowerCase().trim().replace(/^\./, "");
  const outMime = MIME_MAP[normTarget] ?? "application/octet-stream";
  res.set({
    "Content-Type": outMime,
    "Content-Disposition": buildContentDisposition(originalName, normTarget),
    "Cache-Control": "no-store",
  });
  res.send(buf);
}

// ─────────────────────────────────────────────────────────
// POST /tools/document-convert
// Universal document conversion via LibreOffice headless
// Supports DOCX, DOC, ODT, RTF, TXT, HTML, EPUB, PPTX, XLSX → PDF, DOCX, ODT, RTF, TXT, HTML
// ─────────────────────────────────────────────────────────
router.post("/tools/document-convert", mediumRateLimit, upload.single("file"), guardDocument, async (req: Request, res: Response) => {
  if (!req.file || req.file.size === 0 || !req.file.buffer || req.file.buffer.length === 0) {
    apiError(res, 400, "NO_FILE", "No file uploaded or file is empty");
    return;
  }

  const rawTarget = String(req.body.targetFormat ?? req.query.targetFormat ?? "pdf");
  const targetFormat = rawTarget.toLowerCase().trim().replace(/^\./, "");
  if (!isValidTargetFormat(targetFormat)) {
    apiError(res, 400, "INVALID_PARAM", `Unsupported target format: ${targetFormat}`);
    return;
  }

  const originalName = req.file.originalname?.trim() || "document";
  const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/);
  const inputExt = extMatch ? extMatch[1].toLowerCase() : "docx";

  if (!isValidInputExt(inputExt)) {
    apiError(res, 400, "INVALID_PARAM", `Invalid input document extension: ${inputExt}`);
    return;
  }

  try {
    const resultBuffer = await convertWithLibreOffice(req.file.buffer, inputExt, targetFormat);
    sendDocument(res, resultBuffer, originalName, targetFormat);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Document conversion failed");
  }
});

export default router;
