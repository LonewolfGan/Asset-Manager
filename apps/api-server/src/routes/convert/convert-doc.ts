import { Router, type IRouter } from "express";
import { apiError } from "../../lib/errors.js";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import { upload, guardDocument } from "../../middlewares/upload.js";
import { sanitizeWinAnsi } from "../../lib/pdf-text.js";
import { buildContentDisposition } from "./convert-image.js";
import { defaultRateLimit } from "../../middlewares/rateLimit.js";
import { guardSinglePdf, guardMultiPdf } from "../pdf/guards.js";
import { handlePdfToWord } from "./pdf-to-word-handler.js";
import { handlePdfToExcel } from "./pdf-to-excel-handler.js";
import { handlePdfToPptx } from "./pdf-to-pptx-handler.js";
import { handlePdfToHtml } from "./pdf-to-html-handler.js";
import { handlePdfToText } from "./pdf-to-text-handler.js";
import { handlePdfToMarkdown } from "./pdf-to-markdown-handler.js";
import { handlePdfToEpub } from "./pdf-to-epub-handler.js";
import { handlePdfToPdfa } from "./pdf-to-pdfa-handler.js";
import { handlePdfMetadata } from "./pdf-metadata-handler.js";
import { handlePdfCompress } from "./pdf-compress-handler.js";
import { handlePdfMerge } from "./pdf-merge-handler.js";
import { handlePdfSplit } from "./pdf-split-handler.js";
import { handlePdfRotate } from "./pdf-rotate-handler.js";
import { handlePdfProtect } from "./pdf-protect-handler.js";

const router: IRouter = Router();

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-text (High-Fidelity Engine via PyMuPDF 2.0 & OCR)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-text", upload.single("file"), guardDocument, handlePdfToText);

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

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-html (High-Fidelity Engine via PyMuPDF 2.0 SVG Container)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-html", upload.single("file"), guardDocument, handlePdfToHtml);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-markdown (High-Fidelity Engine via PyMuPDF4LLM 2.0)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-markdown", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfToMarkdown);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-epub (High-Fidelity Engine via PyMuPDF 2.0 + EPUB3 Builder)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-epub", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfToEpub);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-pdfa (High-Fidelity Engine via Ghostscript 10 under ProcessPool)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-pdfa", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfToPdfa);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-metadata (High-Fidelity Engine via pdf-lib & ProcessPool)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-metadata", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfMetadata);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-compress (High-Fidelity Engine via Ghostscript 10 under ProcessPool)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-compress", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfCompress);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-merge (High-Fidelity Engine via QPDF & ProcessPool)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-merge", defaultRateLimit, upload.array("files", 20), guardMultiPdf, handlePdfMerge);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-split (High-Fidelity Engine via pdf-lib & ProcessPool)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-split", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfSplit);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-rotate (High-Fidelity Engine via pdf-lib/qpdf & ProcessPool)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-rotate", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfRotate);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-protect (High-Fidelity Engine via QPDF AES-256 & ProcessPool)
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-protect", defaultRateLimit, upload.single("file"), guardSinglePdf, handlePdfProtect);

export default router;
