import { Router, type IRouter } from "express";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import sharp from "sharp";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { upload, guardDocument, guardImage } from "../middlewares/upload.js";

const router: IRouter = Router();

const SHARP_SUPPORTED = new Set(["jpeg", "png", "webp", "avif", "gif", "tiff"]);

const mimeToSharpFormat = (mime: string): keyof sharp.FormatEnum | null => {
  const map: Record<string, keyof sharp.FormatEnum> = {
    "image/jpeg": "jpeg",
    "image/jpg": "jpeg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/gif": "gif",
    "image/tiff": "tiff",
  };
  return map[mime] ?? null;
};

router.post(
  "/convert/pdf-to-text",
  upload.single("file"),
  guardDocument,
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      GlobalWorkerOptions.workerSrc = "";
      const data = new Uint8Array(req.file.buffer);
      const pdf = await getDocument({
        data,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      }).promise;

      const numPages = pdf.numPages;
      const pages: string[] = [];

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        pages.push(pageText);
      }

      res.json({ text: pages.join("\n\n") });
    } catch (err) {
      const message = err instanceof Error ? err.message : "PDF parsing failed";
      res.status(500).json({ error: message });
    }
  },
);

router.post(
  "/convert/docx-to-html",
  upload.single("file"),
  guardDocument,
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    try {
      const result = await mammoth.convertToHtml({ buffer: req.file.buffer });
      res.json({ html: result.value });
    } catch (err) {
      const message = err instanceof Error ? err.message : "DOCX conversion failed";
      res.status(500).json({ error: message });
    }
  },
);

router.post(
  "/convert/docx-to-text",
  upload.single("file"),
  guardDocument,
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    try {
      const result = await mammoth.extractRawText({ buffer: req.file.buffer });
      res.json({ text: result.value });
    } catch (err) {
      const message = err instanceof Error ? err.message : "DOCX conversion failed";
      res.status(500).json({ error: message });
    }
  },
);

router.post("/convert/text-to-pdf", async (req, res) => {
  const { text } = req.body as { text?: string };

  if (typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "text field required" });
    return;
  }

  if (text.length > 500_000) {
    res.status(413).json({ error: "Text too large. Maximum 500,000 characters." });
    return;
  }

  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;
    const margin = 50;
    let y = height - margin;

    const lines = text.split("\n");
    for (const line of lines) {
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      page.drawText(line || " ", { x: margin, y, size: fontSize });
      y -= fontSize * 1.5;
    }

    const pdfBytes = await pdfDoc.save();
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", `attachment; filename="converted.pdf"`);
    res.set("Cache-Control", "no-store");
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF creation failed";
    res.status(500).json({ error: message });
  }
});

router.post(
  "/convert/image",
  upload.single("file"),
  guardImage,
  async (req, res) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const { format, quality, width, height } = req.body as {
      format?: string;
      quality?: string;
      width?: string;
      height?: string;
    };

    if (!format) {
      res.status(400).json({ error: "format field required" });
      return;
    }

    const sharpFormat = mimeToSharpFormat(format);

    if (!sharpFormat || !SHARP_SUPPORTED.has(sharpFormat)) {
      res.status(422).json({
        error: `Format ${format} is not supported server-side. Use client-side conversion.`,
        clientFallback: true,
      });
      return;
    }

    try {
      const qualityNum = quality ? Math.round(parseFloat(quality) * 100) : 80;
      const widthNum = width ? parseInt(width, 10) : undefined;
      const heightNum = height ? parseInt(height, 10) : undefined;

      // Guard against absurdly large resize targets
      if ((widthNum && widthNum > 10000) || (heightNum && heightNum > 10000)) {
        res.status(400).json({ error: "Resize dimensions must not exceed 10,000 px." });
        return;
      }

      let pipeline = sharp(req.file.buffer);

      if (widthNum || heightNum) {
        pipeline = pipeline.resize(widthNum, heightNum, {
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      const outputBuffer = await pipeline
        .toFormat(sharpFormat, { quality: qualityNum })
        .toBuffer();

      const ext = sharpFormat === "jpeg" ? "jpg" : sharpFormat;
      const originalBase = req.file.originalname.replace(/\.[^.]+$/, "") ?? "converted";

      res.set("Content-Type", format);
      res.set("Content-Disposition", `attachment; filename="${originalBase}.${ext}"`);
      res.set("Cache-Control", "no-store");
      res.send(outputBuffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Image conversion failed";
      res.status(500).json({ error: message });
    }
  },
);

// ─────────────────────────────────────────────────────────
// POST /convert/pdf-to-word
// ─────────────────────────────────────────────────────────
router.post(
  "/convert/pdf-to-word",
  upload.single("file"),
  guardDocument,
  async (req, res) => {
    if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      GlobalWorkerOptions.workerSrc = "";
      const data = new Uint8Array(req.file.buffer);
      const pdf = await getDocument({
        data,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true,
      }).promise;

      const children: Paragraph[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        if (pageNum > 1) {
          children.push(new Paragraph({ children: [new TextRun("")], spacing: { before: 200 } }));
        }

        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const items = textContent.items as Array<{ str: string; transform?: number[]; height?: number }>;

        // Group text items by approximate Y position (line grouping)
        const lineMap = new Map<number, string[]>();
        for (const item of items) {
          const y = Math.round((item.transform?.[5] ?? 0) / 4) * 4;
          if (!lineMap.has(y)) lineMap.set(y, []);
          lineMap.get(y)!.push(item.str);
        }

        const sortedYs = [...lineMap.keys()].sort((a, b) => b - a);

        for (const y of sortedYs) {
          const lineText = lineMap.get(y)!.join("").trim();
          if (!lineText) continue;

          const lineItems = items.filter((it) => Math.round((it.transform?.[5] ?? 0) / 4) * 4 === y);
          const maxHeight = Math.max(0, ...lineItems.map((it) => it.height ?? 0));

          if (maxHeight >= 18) {
            children.push(new Paragraph({
              heading: HeadingLevel.HEADING_1,
              children: [new TextRun({ text: lineText, bold: true })],
            }));
          } else if (maxHeight >= 14) {
            children.push(new Paragraph({
              heading: HeadingLevel.HEADING_2,
              children: [new TextRun({ text: lineText, bold: true })],
            }));
          } else {
            children.push(new Paragraph({
              children: [new TextRun(lineText)],
              spacing: { after: 80 },
            }));
          }
        }
      }

      const doc = new Document({ sections: [{ properties: {}, children }] });
      const buffer = await Packer.toBuffer(doc);
      const baseName = (req.file.originalname ?? "document").replace(/\.pdf$/i, "");

      res.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.set("Content-Disposition", `attachment; filename="${baseName}.docx"`);
      res.set("Cache-Control", "no-store");
      res.send(buffer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Conversion failed";
      res.status(500).json({ error: message });
    }
  },
);

// ─────────────────────────────────────────────────────────
// POST /convert/image-to-pdf
// ─────────────────────────────────────────────────────────
router.post(
  "/convert/image-to-pdf",
  upload.single("file"),
  guardImage,
  async (req, res) => {
    if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

    try {
      const A4W = 595.28, A4H = 841.89, MARGIN = 40;
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([A4W, A4H]);

      // Normalise to jpeg (handles HEIC, BMP, TIFF, WEBP, AVIF, etc.)
      let imgBuf: Buffer;
      let isPNG = false;

      if (req.file.mimetype === "image/png") {
        imgBuf = req.file.buffer;
        isPN = true;
      } else if (req.file.mimetype === "image/svg+xml") {
        // SVG → rasterise via sharp
        imgBuf = await sharp(req.file.buffer).png().toBuffer();
        isPN = true;
      } else {
        imgBuf = await sharp(req.file.buffer).jpeg({ quality: 92 }).toBuffer();
      }

      const img = isPN
        ? await pdfDoc.embedPng(imgBuf)
        : await pdfDoc.embedJpg(imgBuf);

      const maxW = A4W - 2 * MARGIN;
      const maxH = A4H - 2 * MARGIN;
      const scale = Math.min(maxW / img.width, maxH / img.height, 1);
      const dw = img.width * scale;
      const dh = img.height * scale;

      page.drawImage(img, {
        x: (A4W - dw) / 2,
        y: (A4H - dh) / 2,
        width: dw,
        height: dh,
      });

      const pdfBytes = await pdfDoc.save();
      const baseName = (req.file.originalname ?? "image").replace(/\.[^.]+$/, "");

      res.set("Content-Type", "application/pdf");
      res.set("Content-Disposition", `attachment; filename="${baseName}.pdf"`);
      res.set("Cache-Control", "no-store");
      res.send(Buffer.from(pdfBytes));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Conversion failed";
      res.status(500).json({ error: message });
    }
  },
);

export default router;
