import { Router, type Request, type Response } from "express";
import mammoth from "mammoth";
import { marked } from "marked";
import { unzipSync } from "fflate";
import { upload } from "../middlewares/upload.js";
import { htmlToPdfBuffer } from "../lib/html-to-pdf.js";

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
// ─────────────────────────────────────────────────────────
router.post("/tools/word-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const mime = req.file.mimetype;
  const isDocx = mime.includes("wordprocessingml") || mime.includes("msword") ||
    req.file.originalname?.match(/\.docx?$/i);
  if (!isDocx) { res.status(415).json({ error: "Please upload a .docx or .doc file" }); return; }

  try {
    const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
    const pdfBuf = await htmlToPdfBuffer(result.value);
    const baseName = (req.file.originalname ?? "document").replace(/\.(docx?|doc)$/i, "");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/excel-to-pdf
// ─────────────────────────────────────────────────────────
router.post("/tools/excel-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const XLSX = await import("xlsx");
    const wb = XLSX.read(req.file.buffer, { type: "buffer" });

    const sheetName = (req.body?.sheet as string | undefined) ?? wb.SheetNames[0];
    if (!wb.SheetNames.includes(sheetName)) {
      res.status(400).json({ error: `Sheet "${sheetName}" not found` });
      return;
    }

    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, defval: "" }) as string[][];

    const PDFDocument = (await import("pdfkit")).default;
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ margin: 40, size: "A4", layout: "landscape", info: { Producer: "EverydayTools Hub" } });
    doc.on("data", (c: Buffer) => chunks.push(c));

    const pdfBuf = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      if (rows.length === 0) {
        doc.fontSize(11).font("Helvetica").text("(empty sheet)");
        doc.end();
        return;
      }

      rows.forEach((row, rowIdx) => {
        const isHeader = rowIdx === 0;
        const rowText = (Array.isArray(row) ? row : [])
          .slice(0, 20)
          .map((c) => String(c ?? "").trim().slice(0, 40))
          .join("   |   ");

        if (!rowText.trim()) return;

        if (isHeader) {
          doc.fontSize(9).font("Helvetica-Bold").text(rowText, { lineGap: 2 });
          const y = doc.y;
          doc.lineWidth(0.5).moveTo(40, y).lineTo(doc.page.width - 40, y).stroke("#333333");
          doc.y = y + 2;
        } else {
          doc.fontSize(8).font("Helvetica").text(rowText, { lineGap: 1 });
        }
      });

      doc.end();
    });

    const baseName = (req.file.originalname ?? "spreadsheet").replace(/\.(xlsx?|xls|csv)$/i, "");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/html-to-pdf
// Accepts: multipart file  OR  JSON body { html: "..." }
// ─────────────────────────────────────────────────────────
router.post("/tools/html-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
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
router.post("/tools/markdown-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
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
// POST /tools/pptx-to-pdf
// ─────────────────────────────────────────────────────────
router.post("/tools/pptx-to-pdf", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const zipEntries = unzipSync(new Uint8Array(req.file.buffer));

    const slideKeys = Object.keys(zipEntries)
      .filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k))
      .sort((a, b) => {
        const na = parseInt(a.match(/\d+/)?.[0] ?? "0");
        const nb = parseInt(b.match(/\d+/)?.[0] ?? "0");
        return na - nb;
      });

    if (slideKeys.length === 0) {
      res.status(422).json({ error: "No slides found. Make sure this is a valid .pptx file." });
      return;
    }

    const slides: Array<{ title: string; body: string[] }> = [];

    for (const key of slideKeys) {
      const xml = Buffer.from(zipEntries[key]).toString("utf-8");
      const texts = [...xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/gi)]
        .map((m) =>
          m[1]
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .trim()
        )
        .filter(Boolean);

      slides.push({ title: texts[0] ?? `Slide ${slides.length + 1}`, body: texts.slice(1) });
    }

    const PDFDocument = (await import("pdfkit")).default;
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ margin: 60, size: "A4", info: { Producer: "EverydayTools Hub" } });
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
          if (line.trim()) {
            doc.text(`\u2022  ${line}`, { indent: 10, lineGap: 4 });
          }
        }
      });

      doc.end();
    });

    const baseName = (req.file.originalname ?? "presentation").replace(/\.pptx?$/i, "");
    sendPdf(res, pdfBuf, `${baseName}.pdf`);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Conversion failed" });
  }
});

export default router;
