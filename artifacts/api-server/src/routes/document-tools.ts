import { Router, type Request, type Response } from "express";
import mammoth from "mammoth";
import { marked } from "marked";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { zipSync } from "fflate";
import { execFile } from "child_process";
import { promisify } from "util";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { writeFile, readFile, rm, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { upload } from "../middlewares/upload.js";
import { htmlToPdfBuffer } from "../lib/html-to-pdf.js";
import { convertWithLibreOffice, convertPptxToImages } from "../lib/libreoffice.js";
import { defaultRateLimit, mediumRateLimit } from "../middlewares/rateLimit.js";

const execFileAsync = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const PDF_EXTRACT_PY = join(__dirname, "../python/pdf_extract.py");

const router = Router();

function sendPdf(res: Response, buf: Buffer, filename: string): void {
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
    "Cache-Control": "no-store",
  });
  res.send(buf);
}

// ─────────────────────────────────────────────────────────
// POST /tools/word-to-pdf
// LibreOffice headless — full fidelity (fonts, images, colours, tables).
// Falls back to mammoth→pdfkit if LibreOffice fails.
// ─────────────────────────────────────────────────────────
router.post("/tools/word-to-pdf", mediumRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const mime = req.file.mimetype;
  const isDocx = mime.includes("wordprocessingml") || mime.includes("msword") ||
    /\.docx?$/i.test(req.file.originalname ?? "");
  if (!isDocx) { res.status(415).json({ error: "Please upload a .docx or .doc file" }); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.(docx?|doc)$/i, "");

  try {
    const ext = /\.docx$/i.test(req.file.originalname ?? "") ? "docx" : "doc";
    const pdfBuf = await convertWithLibreOffice(req.file.buffer, ext, "pdf");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (_loErr) {
    // Fallback: mammoth → pdfkit (layout-lossy but always works)
    try {
      const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
      const pdfBuf = await htmlToPdfBuffer(result.value);
      sendPdf(res, pdfBuf, `${baseName}.pdf`);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
    }
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/excel-to-pdf
// LibreOffice headless — preserves grid, merged cells, colours, charts.
// Falls back to xlsx→pdfkit if LibreOffice fails.
// ─────────────────────────────────────────────────────────
router.post("/tools/excel-to-pdf", mediumRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const rawName = req.file.originalname ?? "spreadsheet";
  const baseName = rawName.replace(/\.(xlsx?|xls|ods|csv)$/i, "");
  const ext = rawName.split(".").pop()?.toLowerCase() ?? "xlsx";

  try {
    const pdfBuf = await convertWithLibreOffice(req.file.buffer, ext, "pdf");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (_loErr) {
    // Fallback: xlsx → pdfkit (text-only grid)
    try {
      const XLSX = await import("xlsx");
      const wb = XLSX.read(req.file.buffer, { type: "buffer" });
      const sheetName = (req.body?.sheet as string | undefined) ?? wb.SheetNames[0];
      const ws = wb.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: "" }) as string[][];

      const PDFDocument = (await import("pdfkit")).default;
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape" });
      doc.on("data", (c: Buffer) => chunks.push(c));

      const pdfBuf = await new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
        rows.forEach((row, ri) => {
          const text = (Array.isArray(row) ? row : []).slice(0, 20)
            .map((c) => String(c ?? "").trim().slice(0, 40)).join("  |  ");
          if (!text.trim()) return;
          if (ri === 0) doc.fontSize(9).font("Helvetica-Bold").text(text, { lineGap: 2 });
          else doc.fontSize(8).font("Helvetica").text(text, { lineGap: 1 });
        });
        doc.end();
      });

      sendPdf(res, pdfBuf, `${baseName}.pdf`);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
    }
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pptx-to-pdf
// LibreOffice headless — full visual fidelity (images, transitions, fonts).
// Falls back to pdfkit text-extraction if LibreOffice fails.
// ─────────────────────────────────────────────────────────
router.post("/tools/pptx-to-pdf", mediumRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const baseName = (req.file.originalname ?? "presentation").replace(/\.pptx?$/i, "");

  try {
    const ext = /\.ppt$/i.test(req.file.originalname ?? "") ? "ppt" : "pptx";
    const pdfBuf = await convertWithLibreOffice(req.file.buffer, ext, "pdf");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (_loErr) {
    // Fallback: XML text extraction → pdfkit
    try {
      const { unzipSync } = await import("fflate");
      const zipEntries = unzipSync(new Uint8Array(req.file.buffer));
      const slideKeys = Object.keys(zipEntries)
        .filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))
        .sort((a, b) => {
          const n = (s: string) => parseInt(s.match(/\d+/)?.[0] ?? "0");
          return n(a) - n(b);
        });

      const slides: Array<{ title: string; body: string[] }> = [];
      for (const key of slideKeys) {
        const xml = Buffer.from(zipEntries[key]).toString("utf-8");
        const texts = [...xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/gi)]
          .map((m) => m[1].replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim())
          .filter(Boolean);
        slides.push({ title: texts[0] ?? `Slide ${slides.length + 1}`, body: texts.slice(1) });
      }

      if (slides.length === 0) {
        res.status(422).json({ error: "No slides found. Make sure this is a valid .pptx file." });
        return;
      }

      const PDFDocument = (await import("pdfkit")).default;
      const chunks: Buffer[] = [];
      const doc = new PDFDocument({ margin: 60, size: "A4" });
      doc.on("data", (c: Buffer) => chunks.push(c));

      const pdfBuf = await new Promise<Buffer>((resolve, reject) => {
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
        slides.forEach((slide, i) => {
          if (i > 0) doc.addPage();
          doc.fontSize(9).font("Helvetica").fillColor("#888888")
            .text(`Slide ${i + 1} of ${slides.length}`, { align: "right" });
          doc.fillColor("#000000").moveDown(0.3);
          doc.fontSize(20).font("Helvetica-Bold").text(slide.title, { lineGap: 4 });
          doc.moveDown(0.4);
          const y = doc.y;
          doc.lineWidth(1).moveTo(60, y).lineTo(doc.page.width - 60, y).stroke("#cccccc");
          doc.y = y + 10;
          doc.fontSize(12).font("Helvetica");
          for (const line of slide.body) {
            if (line.trim()) doc.text(`\u2022  ${line}`, { indent: 10, lineGap: 4 });
          }
        });
        doc.end();
      });

      sendPdf(res, pdfBuf, `${baseName}.pdf`);
    } catch (err) {
      res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
    }
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pptx-to-images
// LibreOffice headless → per-slide PNG → ZIP.
// Returns real pixel-accurate slide images, not text previews.
// ─────────────────────────────────────────────────────────
router.post("/tools/pptx-to-images", mediumRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const slides = await convertPptxToImages(req.file.buffer);
    if (slides.length === 0) {
      res.status(422).json({ error: "No slides generated. Make sure this is a valid .pptx file." });
      return;
    }

    const zipEntries: Record<string, Uint8Array> = {};
    for (const slide of slides) {
      zipEntries[slide.name] = new Uint8Array(slide.data);
    }
    const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
    const baseName = (req.file.originalname ?? "presentation").replace(/\.pptx?$/i, "");

    res.set({
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${baseName}_slides.zip"`,
      "X-Slide-Count": String(slides.length),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Slide-Count",
    });
    res.send(zipBuf);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
  }
});

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
      res.status(400).json({ error: "Provide a file or html body field" });
      return;
    }

    if (html.length > 2_000_000) {
      res.status(413).json({ error: "HTML too large (max 2 MB)" });
      return;
    }

    const pdfBuf = await htmlToPdfBuffer(html);
    sendPdf(res, pdfBuf, filename);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
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
      res.status(400).json({ error: "Provide a file or markdown body field" });
      return;
    }

    const html = await marked(markdown);
    const pdfBuf = await htmlToPdfBuffer(String(html));
    sendPdf(res, pdfBuf, filename);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-html
// Extract PDF text via pdfplumber and wrap in clean HTML.
// Returns a .html file ready for the browser.
// ─────────────────────────────────────────────────────────
import { execFile as _execFile } from "child_process";
import { promisify as _promisify } from "util";
import { tmpdir as _tmpdir } from "os";
import { randomUUID as _randomUUID } from "crypto";
import { writeFile as _writeFile, readFile as _readFile, rm as _rm, mkdir as _mkdir } from "fs/promises";
import { join as _join, dirname as _dirname } from "path";
import { fileURLToPath as _fileURLToPath } from "url";

const _execFileAsync = _promisify(_execFile);
const _PDF_EXTRACT_PY = _join(_dirname(_fileURLToPath(import.meta.url)), "../python/pdf_extract.py");

router.post("/tools/pdf-to-html", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  if (req.file.mimetype !== "application/pdf") { res.status(415).json({ error: "Only PDF files are accepted." }); return; }
  if (req.file.size > 50 * 1024 * 1024) { res.status(413).json({ error: "File too large. Maximum 50 MB." }); return; }

  const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");
  const id = _randomUUID();
  const workDir = _join(_tmpdir(), `pdf-html-${id}`);
  await _mkdir(workDir, { recursive: true });
  const pdfPath = _join(workDir, "input.pdf");

  try {
    await _writeFile(pdfPath, req.file.buffer);

    const { stdout } = await _execFileAsync(
      process.env["PYTHON3_PATH"] ?? "python3",
      [_PDF_EXTRACT_PY, "--pdf", pdfPath, "--mode", "text"],
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
    res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
  } finally {
    await _rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-to-pptx
// Convert PDF to PowerPoint using LibreOffice headless.
// Each page is embedded as a slide.
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-to-pptx", mediumRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  if (req.file.mimetype !== "application/pdf") { res.status(415).json({ error: "Only PDF files are accepted." }); return; }
  if (req.file.size > 50 * 1024 * 1024) { res.status(413).json({ error: "File too large. Maximum 50 MB." }); return; }

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
    res.status(500).json({ error: err instanceof Error ? err.message : "PDF to PPTX conversion failed. Ensure LibreOffice is installed." });
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/txt-to-docx
// Plain text → DOCX. Accepts file upload or raw body.text.
// ─────────────────────────────────────────────────────────
router.post("/convert/txt-to-docx", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  let textContent = "";
  let filename = "document.docx";

  if (req.file) {
    textContent = req.file.buffer.toString("utf-8");
    filename = (req.file.originalname ?? "document").replace(/\.txt$/i, "") + ".docx";
  } else if (typeof req.body?.text === "string") {
    textContent = req.body.text as string;
  } else {
    res.status(400).json({ error: "Provide a .txt file upload or a text body field" });
    return;
  }

  if (textContent.length > 1_000_000) {
    res.status(413).json({ error: "Text too large. Maximum 1,000,000 characters." });
    return;
  }

  try {
    const paragraphs = textContent.split("\n").map(
      (line) => new Paragraph({ children: [new TextRun(line)], spacing: { after: 80 } }),
    );
    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const buffer = await Packer.toBuffer(doc);
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "TXT to DOCX failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/markdown-to-docx
// Markdown → DOCX. Accepts file upload or raw body.markdown.
// ─────────────────────────────────────────────────────────
router.post("/convert/markdown-to-docx", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  let markdown = "";
  let filename = "document.docx";

  if (req.file) {
    markdown = req.file.buffer.toString("utf-8");
    filename = (req.file.originalname ?? "document").replace(/\.(md|markdown|txt)$/i, "") + ".docx";
  } else if (typeof req.body?.markdown === "string") {
    markdown = req.body.markdown as string;
  } else {
    res.status(400).json({ error: "Provide a markdown file or a markdown body field" });
    return;
  }

  try {
    const html = await marked(markdown);
    const htmlStr = String(html);

    // Simple HTML → DOCX paragraph builder
    const paragraphs: InstanceType<typeof Paragraph>[] = [];
    const blocks = htmlStr.split(/<\/?(?:p|h[1-6]|ul|ol|li|blockquote|pre|hr|br)[^>]*>/i)
      .map((s) => s.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim())
      .filter(Boolean);

    // Re-parse structured nodes
    const div = htmlStr;
    const headingRe = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    const headingMap: Record<string, string> = { "1": HeadingLevel.HEADING_1, "2": HeadingLevel.HEADING_2, "3": HeadingLevel.HEADING_3, "4": HeadingLevel.HEADING_4, "5": HeadingLevel.HEADING_5, "6": HeadingLevel.HEADING_6 };

    // Extract headings first for structure awareness
    const headingPositions: Map<string, { level: number; text: string }> = new Map();
    let m: RegExpExecArray | null;
    // eslint-disable-next-line no-cond-assign
    while ((m = headingRe.exec(div)) !== null) {
      headingPositions.set(m[2].replace(/<[^>]+>/g, "").trim(), { level: parseInt(m[1]), text: m[2].replace(/<[^>]+>/g, "").trim() });
    }

    for (const block of blocks) {
      if (!block) continue;
      const h = headingPositions.get(block);
      if (h) {
        paragraphs.push(new Paragraph({
          heading: (headingMap[String(h.level)] ?? HeadingLevel.HEADING_1) as typeof HeadingLevel.HEADING_1,
          children: [new TextRun({ text: h.text, bold: true })],
        }));
      } else {
        paragraphs.push(new Paragraph({ children: [new TextRun(block)], spacing: { after: 80 } }));
      }
    }

    if (paragraphs.length === 0) {
      paragraphs.push(new Paragraph({ children: [new TextRun("")] }));
    }

    const doc = new Document({ sections: [{ children: paragraphs }] });
    const buffer = await Packer.toBuffer(doc);
    res.set({
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    });
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Markdown to DOCX failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /convert/word-to-markdown
// DOCX → Markdown via mammoth (HTML) + turndown.
// Returns plain text (.md) as a JSON response.
// ─────────────────────────────────────────────────────────
router.post("/convert/word-to-markdown", defaultRateLimit, upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  const mime = req.file.mimetype;
  const isDocx = mime.includes("wordprocessingml") || mime.includes("msword") ||
    /\.docx?$/i.test(req.file.originalname ?? "");
  if (!isDocx) { res.status(415).json({ error: "Please upload a .docx or .doc file" }); return; }
  if (req.file.size > 30 * 1024 * 1024) { res.status(413).json({ error: "File too large. Maximum 30 MB." }); return; }

  try {
    const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
    const TurndownService = (await import("turndown")).default;
    const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
    const markdown = td.turndown(result.value);
    const baseName = (req.file.originalname ?? "document").replace(/\.docx?$/i, "");
    res.set({
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${baseName}.md"`,
      "Cache-Control": "no-store",
    });
    res.send(markdown);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Word to Markdown failed" });
  }
});

export default router;
