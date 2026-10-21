import { Router, type IRouter } from "express";
import { apiError } from "../../lib/errors.js";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { upload, guardDocument } from "../../middlewares/upload.js";
import { BIN, getPythonScriptPath } from "../../lib/binaries.js";
import { sanitizeWinAnsi } from "../../lib/pdf-text.js";
import { buildContentDisposition } from "./convert-image.js";
import { handlePdfToWord } from "./pdf-to-word-handler.js";
import { handlePdfToExcel } from "./pdf-to-excel-handler.js";
import { handlePdfToPptx } from "./pdf-to-pptx-handler.js";

const execFileAsync = promisify(execFile);
const router: IRouter = Router();

// ─────────────────────────────────────────────────────────
// pdfplumber helper: call Python script, parse JSON
// ─────────────────────────────────────────────────────────
async function callPdfExtract(pdfBuffer: Buffer, mode: "word" | "excel" | "text"): Promise<unknown> {
  const id = randomUUID();
  const workDir = join(tmpdir(), "everydaytools", id);
  await mkdir(workDir, { recursive: true });
  const pdfPath = join(workDir, "input.pdf");
  await writeFile(pdfPath, pdfBuffer);

  try {
    const pdfExtractScript = getPythonScriptPath("pdf_extract.py");
    const { stdout } = await execFileAsync(
      BIN.python3,
      [pdfExtractScript, "--pdf", pdfPath, "--mode", mode],
      { timeout: 120_000, maxBuffer: 50 * 1024 * 1024 },
    );
    return JSON.parse(stdout);
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-text
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-text", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const extracted = await callPdfExtract(req.file.buffer, "text") as { text?: string; error?: string };
    if (extracted.error) throw new Error(extracted.error);
    res.json({ text: extracted.text ?? "" });
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF parsing failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/docx-to-html
// ─────────────────────────────────────────────────────────
router.post("/convert/docx-to-html", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
    res.json({ html: result.value });
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "DOCX conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/docx-to-text
// ─────────────────────────────────────────────────────────
router.post("/convert/docx-to-text", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }
  try {
    const result = await mammoth.extractRawText({ buffer: req.file.buffer });
    res.json({ text: result.value });
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "DOCX conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/text-to-pdf
// ─────────────────────────────────────────────────────────
router.post("/convert/text-to-pdf", async (req, res) => {
  const { text } = req.body as { text?: string };
  if (typeof text !== "string" || !text.trim()) {
    apiError(res, 400, "MISSING_PARAM", "text field required"); return;
  }
  if (text.length > 1_000_000) {
    apiError(res, 413, "FILE_TOO_LARGE", "Text too large. Maximum 1,000,000 characters."); return;
  }
  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12, margin = 50;
    let y = height - margin;

    const safeText = sanitizeWinAnsi(text);
    for (const line of safeText.split("\n")) {
      if (y < margin) { page = pdfDoc.addPage(); y = height - margin; }
      page.drawText(line || " ", { x: margin, y, size: fontSize });
      y -= fontSize * 1.5;
    }
    const pdfBytes = await pdfDoc.save();
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="converted.pdf"`);
    res.set("Cache-Control", "no-store");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "PDF creation failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-word (High-Fidelity Engine via pdf2docx)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-word", upload.single("file"), guardDocument, handlePdfToWord);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-excel (High-Fidelity Engine via PyMuPDF 2.0 & openpyxl)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-excel", upload.single("file"), guardDocument, handlePdfToExcel);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-pptx (High-Fidelity Engine via PyMuPDF 2.0 & python-pptx)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-pptx", upload.single("file"), guardDocument, handlePdfToPptx);

export default router;
