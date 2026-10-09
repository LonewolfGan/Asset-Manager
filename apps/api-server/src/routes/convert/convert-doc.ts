import { Router, type IRouter } from "express";
import { apiError } from "../../lib/errors.js";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, rm, mkdir } from "fs/promises";
import { join } from "path";
import { upload, guardDocument } from "../../middlewares/upload.js";
import { BIN, getPythonScriptPath } from "../../lib/binaries.js";
import { sanitizeWinAnsi } from "../../lib/pdf-text.js";

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
// POST /convert/pdf-to-word
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-word", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");
  const children: Paragraph[] = [];

  try {
    const extracted = await callPdfExtract(req.file.buffer, "word") as {
      pages: Array<{
        page: number;
        paragraphs: Array<{ text: string; heading: number; table_row?: boolean }>;
      }>;
    };

    for (let pi = 0; pi < extracted.pages.length; pi++) {
      if (pi > 0) {
        children.push(new Paragraph({ children: [new TextRun("")], spacing: { before: 400 } }));
      }
      for (const para of extracted.pages[pi].paragraphs) {
        if (!para.text.trim()) { children.push(new Paragraph({ children: [new TextRun("")] })); continue; }
        if (para.heading === 1) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: para.text, bold: true })] }));
        } else if (para.heading === 2) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: para.text, bold: true })] }));
        } else if (para.heading === 3) {
          children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun({ text: para.text })] }));
        } else if (para.table_row) {
          children.push(new Paragraph({ children: [new TextRun({ text: para.text, font: "Courier New", size: 18 })], spacing: { after: 40 } }));
        } else {
          children.push(new Paragraph({ children: [new TextRun(para.text)], spacing: { after: 80 } }));
        }
      }
    }
  } catch (_plumberErr) {
    const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
    GlobalWorkerOptions.workerSrc = "";
    const pdf = await getDocument({
      data: new Uint8Array(req.file.buffer),
      useWorkerFetch: false, useSystemFonts: true,
    }).promise;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      if (pageNum > 1) children.push(new Paragraph({ children: [new TextRun("")], spacing: { before: 200 } }));
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items = textContent.items as Array<{ str: string; transform?: number[]; height?: number }>;
      const lineMap = new Map<number, string[]>();
      for (const item of items) {
        const y = Math.round((item.transform?.[5] ?? 0) / 4) * 4;
        if (!lineMap.has(y)) lineMap.set(y, []);
        lineMap.get(y)!.push(item.str);
      }
      for (const y of [...lineMap.keys()].sort((a, b) => b - a)) {
        const lineText = lineMap.get(y)!.join("").trim();
        if (!lineText) continue;
        const lineItems = items.filter((it) => Math.round((it.transform?.[5] ?? 0) / 4) * 4 === y);
        const maxH = Math.max(0, ...lineItems.map((it) => it.height ?? 0));
        if (maxH >= 18) children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: lineText, bold: true })] }));
        else if (maxH >= 14) children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: lineText, bold: true })] }));
        else children.push(new Paragraph({ children: [new TextRun(lineText)], spacing: { after: 80 } }));
      }
    }
  }

  try {
    const doc = new Document({ sections: [{ properties: {}, children }] });
    const buffer = await Packer.toBuffer(doc);
    res.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.set("Content-Disposition", `attachment; filename="${baseName}.docx"`);
    res.set("Cache-Control", "no-store");
    res.send(buffer);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Conversion failed");
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-excel
// ─────────────────────────────────────────────────────────
router.post("/convert/pdf-to-excel", upload.single("file"), guardDocument, async (req, res) => {
  if (!req.file) { apiError(res, 400, "NO_FILE", "No file uploaded"); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");

  try {
    const extracted = await callPdfExtract(req.file.buffer, "excel") as {
      tables: Array<{ page: number; rows: string[][]; is_table: boolean }>;
    };

    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();

    if (extracted.tables.length === 0) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([["(no tables found)"]]), "Extracted");
    } else if (extracted.tables.length === 1) {
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(extracted.tables[0].rows), "Extracted");
    } else {
      for (let i = 0; i < extracted.tables.length; i++) {
        const t = extracted.tables[i];
        const sheetName = `Page ${t.page}${extracted.tables.filter((x) => x.page === t.page).length > 1 ? ` (${i + 1})` : ""}`;
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(t.rows), sheetName.slice(0, 31));
      }
    }

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });
    res.set("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.set("Content-Disposition", `attachment; filename="${baseName}.xlsx"`);
    res.set("Cache-Control", "no-store");
    res.send(buf);
  } catch (err) {
    apiError(res, 500, "CONVERSION_FAILED", err instanceof Error ? err.message : "Extraction failed");
  }
});

export default router;
