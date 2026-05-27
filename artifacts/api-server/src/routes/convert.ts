import { Router, type IRouter } from "express";
import { PDFDocument } from "pdf-lib";
import mammoth from "mammoth";
import sharp from "sharp";
import { upload } from "../middlewares/upload.js";

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

router.post("/convert/pdf-to-text", upload.single("file"), async (req, res) => {
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
    let fullText = "";

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n\n";
    }

    res.json({ text: fullText });
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF parsing failed";
    res.status(500).json({ error: message });
  }
});

router.post("/convert/docx-to-html", upload.single("file"), async (req, res) => {
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
});

router.post("/convert/docx-to-text", upload.single("file"), async (req, res) => {
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
});

router.post("/convert/text-to-pdf", async (req, res) => {
  const { text } = req.body as { text?: string };

  if (typeof text !== "string" || !text.trim()) {
    res.status(400).json({ error: "text field required" });
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
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    const message = err instanceof Error ? err.message : "PDF creation failed";
    res.status(500).json({ error: message });
  }
});

router.post("/convert/image", upload.single("file"), async (req, res) => {
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

    let pipeline = sharp(req.file.buffer);

    if (widthNum || heightNum) {
      pipeline = pipeline.resize(widthNum, heightNum, { fit: "inside", withoutEnlargement: true });
    }

    const outputBuffer = await pipeline
      .toFormat(sharpFormat, { quality: qualityNum })
      .toBuffer();

    const ext = sharpFormat === "jpeg" ? "jpg" : sharpFormat;
    const originalBase = req.file.originalname.replace(/\.[^.]+$/, "") ?? "converted";

    res.set("Content-Type", format);
    res.set("Content-Disposition", `attachment; filename="${originalBase}.${ext}"`);
    res.send(outputBuffer);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Image conversion failed";
    res.status(500).json({ error: message });
  }
});

export default router;
