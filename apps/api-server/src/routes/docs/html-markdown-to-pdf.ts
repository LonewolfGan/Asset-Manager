import { Router, type Request, type Response } from "express";
import { marked } from "marked";
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

    const pdfBuf = await htmlToPdfBuffer(html);
    sendPdf(res, pdfBuf, filename);
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

    const html = await marked(markdown);
    const pdfBuf = await htmlToPdfBuffer(String(html));
    sendPdf(res, pdfBuf, filename);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-html
// Extract PDF text via pdfplumber and wrap in clean HTML.
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-html", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  if (req.file.mimetype !== "application/pdf") { apiError(res, 415, "UNSUPPORTED_TYPE", "Only PDF files are accepted."); return; }
  if (req.file.size > 50 * 1024 * 1024) { apiError(res, 413, "FILE_TOO_LARGE", "File too large. Maximum 50 MB."); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const pdfPath = join(workDir, "input.pdf");

  try {
    await writeFile(pdfPath, req.file.buffer);

    const pdfExtractScript = getPythonScriptPath("pdf_extract.py");
    const { stdout } = await execFileAsync(
      BIN.python3,
      [pdfExtractScript, "--pdf", pdfPath, "--mode", "text"],
      { timeout: 120_000, maxBuffer: 50 * 1024 * 1024 },
    );
    const extracted = JSON.parse(stdout) as { text?: string; error?: string };
    if (extracted.error) throw new Error(extracted.error);

    const rawText = extracted.text ?? "";
    const escapedLines = rawText
      .split("\n")
      .map((line) => {
        const safe = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return safe.trim() ? `<p>${safe}</p>` : "";
      })
      .filter(Boolean)
      .join("\n");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${baseName}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 800px; margin: 0 auto; padding: 2em; line-height: 1.7; color: #222; }
    p { margin: 0 0 1em; }
  </style>
</head>
<body>
${escapedLines}
</body>
</html>`;

    res.set({
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="${baseName}.html"`,
      "Cache-Control": "no-store",
    });
    res.send(html);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-pptx
// Convert PDF to PowerPoint using LibreOffice headless.
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-pptx", mediumRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  if (req.file.mimetype !== "application/pdf") { apiError(res, 415, "UNSUPPORTED_TYPE", "Only PDF files are accepted."); return; }
  if (req.file.size > 50 * 1024 * 1024) { apiError(res, 413, "FILE_TOO_LARGE", "File too large. Maximum 50 MB."); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");

  try {
    const pptxBuf = await convertWithLibreOffice(req.file.buffer, "pdf", "pptx");
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${baseName}.pptx"`,
      "Cache-Control": "no-store",
    });
    res.send(pptxBuf);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF to PPTX conversion failed. Ensure LibreOffice is installed.");
  }
});

export default router;
