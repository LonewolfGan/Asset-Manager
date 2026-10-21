import { Router, type Request, type Response } from "express";
import { renderMarkdownToPdfBuffer } from "./markdown-to-pdf-logic.js";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { upload } from "../../middlewares/upload.js";
import { htmlToPdfBuffer } from "../../lib/html-to-pdf.js";
import { convertWithLibreOffice } from "../../lib/libreoffice.js";
import { defaultRateLimit, mediumRateLimit } from "../../middlewares/rateLimit.js";
import { BIN, getPythonScriptPath } from "../../lib/binaries.js";
import { apiError } from "../../lib/errors.js";
import { sendPdf } from "./send-pdf.js";
import { buildContentDisposition } from "../convert/convert-image.js";
import { guardSinglePdf } from "../pdf/guards.js";
import { handlePdfToPptx } from "../convert/pdf-to-pptx-handler.js";
import { handlePdfToHtml } from "../convert/pdf-to-html-handler.js";
import { isGotenbergHealthy, convertHtmlWithGotenberg } from "../../lib/gotenberg.js";
import { logger } from "../../lib/logger.js";

const execFileAsync = promisify(execFile);
const router = Router();

// ─────────────────────────────────────────────────────────
// POST /tools/html-to-pdf
// ─────────────────────────────────────────────────────────
router.post("/tools/html-to-pdf", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  try {
    let html = "";
    let filename = "webpage.pdf";

    if (req.file) {
      html = req.file.buffer.toString("utf-8");
      filename = (req.file.originalname ?? "webpage").replace(/\.html?$/i, "") + ".pdf";
    } else if (req.body?.html) {
      html = String(req.body.html);
    } else {
      apiError(res, 400, "MISSING_FILE", "Provide a file or html body field");
      return;
    }

    if (html.length > 2_000_000) {
      apiError(res, 413, "FILE_TOO_LARGE", "HTML too large (max 2 MB)");
      return;
    }

    let pdfBuf: Buffer;
    if (await isGotenbergHealthy()) {
      try {
        pdfBuf = await convertHtmlWithGotenberg(html);
      } catch (err) {
        logger.warn({ err }, "Gotenberg Chromium conversion failed, falling back to PDFKit");
        pdfBuf = await htmlToPdfBuffer(html);
      }
    } else {
      pdfBuf = await htmlToPdfBuffer(html);
    }

    await sendPdf(res, pdfBuf, filename);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/markdown-to-pdf
// ─────────────────────────────────────────────────────────
router.post("/tools/markdown-to-pdf", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  try {
    let markdown = "";
    let filename = "document.pdf";

    if (req.file) {
      markdown = req.file.buffer.toString("utf-8");
      filename = (req.file.originalname ?? "document").replace(/\.(md|markdown|txt)$/i, "") + ".pdf";
    } else if (req.body?.markdown) {
      markdown = String(req.body.markdown);
    } else {
      apiError(res, 400, "MISSING_FILE", "Provide a file or markdown body field");
      return;
    }

    if (markdown.length > 2_000_000) {
      apiError(res, 413, "FILE_TOO_LARGE", "Markdown too large (max 2 MB)");
      return;
    }

    const title = filename.replace(/\.pdf$/i, "");
    const pdfBuf = await renderMarkdownToPdfBuffer(markdown, title);
    await sendPdf(res, pdfBuf, filename);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-html (Legacy endpoint redirected to high-fidelity engine)
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-html", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfToHtml);

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-pptx (Legacy endpoint redirected to high-fidelity engine)
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-pptx", mediumRateLimit, upload.single("file"), guardSinglePdf, handlePdfToPptx);

export default router;
