import { Router } from "express";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { zipSync } from "fflate";
import { upload } from "../middlewares/upload.js";
import type { Request, Response, NextFunction } from "express";

const router = Router();

// ─────────────────────────────────────────────────────────
// Guard: single PDF file
// ─────────────────────────────────────────────────────────
function guardSinglePdf(req: Request, res: Response, next: NextFunction): void {
  const file = req.file;
  if (!file) { next(); return; }
  if (file.mimetype !== "application/pdf") {
    res.status(415).json({ error: `Unsupported type: ${file.mimetype}. Only PDF accepted.` });
    return;
  }
  if (file.size > 50 * 1024 * 1024) {
    res.status(413).json({ error: "File too large. Maximum 50 MB." });
    return;
  }
  next();
}

// Guard: multiple PDF files
function guardMultiPdf(req: Request, res: Response, next: NextFunction): void {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) { next(); return; }
  for (const f of files) {
    if (f.mimetype !== "application/pdf") {
      res.status(415).json({ error: `${f.originalname} is not a PDF.` });
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      res.status(413).json({ error: `${f.originalname} exceeds 50 MB limit.` });
      return;
    }
  }
  next();
}

function pdfBaseName(originalname: string | undefined): string {
  return (originalname ?? "document").replace(/\.pdf$/i, "");
}

function parsePageRanges(str: string, maxPages: number): number[][] {
  if (!str.trim()) return [];
  const parts = str.split(",").map((s) => s.trim()).filter(Boolean);
  const parsed: number[][] = [];
  for (const part of parts) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((s) => parseInt(s.trim()));
      if (isNaN(a) || isNaN(b) || a < 1) continue;
      const start = Math.min(a, maxPages);
      const end = Math.min(isNaN(b) ? maxPages : b, maxPages);
      const lo = Math.min(start, end);
      const hi = Math.max(start, end);
      const indices: number[] = [];
      for (let i = lo; i <= hi; i++) indices.push(i - 1);
      if (indices.length) parsed.push(indices);
    } else {
      const p = parseInt(part);
      if (!isNaN(p) && p >= 1 && p <= maxPages) parsed.push([p - 1]);
    }
  }
  return parsed;
}

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-compress
// pdf-lib: strip metadata + useObjectStreams. Returns best (smaller) version.
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-compress", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const input = req.file.buffer;
    const pdfDoc = await PDFDocument.load(input, { ignoreEncryption: true });

    pdfDoc.setTitle("");
    pdfDoc.setAuthor("");
    pdfDoc.setSubject("");
    pdfDoc.setKeywords([]);
    pdfDoc.setProducer("EverydayTools");
    pdfDoc.setCreator("EverydayTools");

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    const output = Buffer.from(pdfBytes);

    const finalBuffer = output.length < input.length ? output : input;
    const gain = Math.round((1 - finalBuffer.length / input.length) * 100);
    const baseName = pdfBaseName(req.file.originalname);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_compressed.pdf"`,
      "X-Original-Size": String(input.length),
      "X-Compressed-Size": String(finalBuffer.length),
      "X-Compression-Gain": String(gain),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Original-Size,X-Compressed-Size,X-Compression-Gain",
    });
    res.send(finalBuffer);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Compression failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-merge
// Accepts up to 20 files via field name "files"
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-merge", upload.array("files", 20), guardMultiPdf, async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length < 2) {
    res.status(400).json({ error: "At least 2 PDF files are required." });
    return;
  }

  try {
    const merged = await PDFDocument.create();
    for (const file of files) {
      const src = await PDFDocument.load(file.buffer);
      const pages = await merged.copyPages(src, src.getPageIndices());
      pages.forEach((p) => merged.addPage(p));
    }

    const pdfBytes = await merged.save();
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="merged_document.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Merge failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-split
// mode: "every" | "range"   ranges: "1-3, 5, 7-9"
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-split", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  try {
    const input = req.file.buffer;
    const mode = String(req.body.mode ?? "every");
    const rangesStr = String(req.body.ranges ?? "");
    const src = await PDFDocument.load(input);
    const numPages = src.getPageCount();
    const baseName = pdfBaseName(req.file.originalname);

    let segments: number[][];
    if (mode === "every") {
      segments = Array.from({ length: numPages }, (_, i) => [i]);
    } else {
      segments = parsePageRanges(rangesStr, numPages);
      if (segments.length === 0) {
        res.status(400).json({ error: "Invalid or empty range. Use format: '1-3, 5, 7-9'" });
        return;
      }
    }

    if (segments.length === 1) {
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, segments[0]);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save();

      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${baseName}_extracted.pdf"`,
        "Cache-Control": "no-store",
      });
      res.send(Buffer.from(bytes));
    } else {
      const zipEntries: Record<string, Uint8Array> = {};
      for (let i = 0; i < segments.length; i++) {
        const seg = segments[i];
        const out = await PDFDocument.create();
        const pages = await out.copyPages(src, seg);
        pages.forEach((p) => out.addPage(p));
        const bytes = await out.save();

        let fname: string;
        if (seg.length === 1) {
          fname = `${baseName}_page_${seg[0] + 1}.pdf`;
        } else {
          fname = `${baseName}_pages_${seg[0] + 1}-${seg[seg.length - 1] + 1}.pdf`;
        }
        zipEntries[fname] = new Uint8Array(bytes);
      }

      const zipBuf = Buffer.from(zipSync(zipEntries, { level: 6 }));
      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${baseName}_split.zip"`,
        "Cache-Control": "no-store",
      });
      res.send(zipBuf);
    }
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Split failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-protect
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-protect", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const password = String(req.body.password ?? "").trim();
  if (!password) { res.status(400).json({ error: "Password is required." }); return; }
  if (password.length > 128) { res.status(400).json({ error: "Password too long." }); return; }

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBytes = await pdfDoc.save({
      userPassword: password,
      ownerPassword: password + "_owner_et",
      permissions: {
        printing: "lowResolution",
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false,
      },
    } as any);

    const baseName = pdfBaseName(req.file.originalname);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_protected.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Protection failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-unlock
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-unlock", upload.single("file"), async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  if (req.file.mimetype !== "application/pdf") {
    res.status(415).json({ error: "Only PDF files are accepted." });
    return;
  }

  const password = String(req.body.password ?? "");

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfDoc = await PDFDocument.load(req.file.buffer, {
      password: password || undefined,
      ignoreEncryption: !password,
    } as any);
    const pdfBytes = await pdfDoc.save();
    const baseName = pdfBaseName(req.file.originalname);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_unlocked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    const raw = err instanceof Error ? err.message : "";
    const msg = raw.toLowerCase().includes("password") || raw.toLowerCase().includes("encrypt")
      ? "Incorrect password or file is encrypted without a known password."
      : raw || "Unlock failed";
    res.status(500).json({ error: msg });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-watermark
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-watermark", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const text = String(req.body.text ?? "WATERMARK").slice(0, 100);
  const opacity = Math.min(1, Math.max(0, parseFloat(String(req.body.opacity ?? "0.3"))));
  const fontSize = Math.min(120, Math.max(10, parseInt(String(req.body.fontSize ?? "60")) || 60));
  const angle = parseInt(String(req.body.angle ?? "45")) || 45;

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      page.drawText(text, {
        x: (width - textWidth) / 2,
        y: height / 2 - fontSize / 2,
        size: fontSize,
        font,
        color: rgb(0.5, 0.5, 0.5),
        opacity,
        rotate: degrees(angle),
      });
    }

    const pdfBytes = await pdfDoc.save();
    const baseName = pdfBaseName(req.file.originalname);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_watermarked.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Watermark failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-page-numbers
// position: bottom-center | bottom-right | bottom-left | top-center | top-right | top-left
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-page-numbers", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const position = String(req.body.position ?? "bottom-center");
  const startFrom = Math.max(1, parseInt(String(req.body.startFrom ?? "1")) || 1);
  const fontSize = 11;
  const margin = 22;

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const label = String(i + startFrom);
      const textWidth = font.widthOfTextAtSize(label, fontSize);

      let x: number;
      let y: number;

      if (position === "bottom-right") {
        x = width - textWidth - margin;
        y = margin;
      } else if (position === "bottom-left") {
        x = margin;
        y = margin;
      } else if (position === "top-center") {
        x = (width - textWidth) / 2;
        y = height - margin - fontSize;
      } else if (position === "top-right") {
        x = width - textWidth - margin;
        y = height - margin - fontSize;
      } else if (position === "top-left") {
        x = margin;
        y = height - margin - fontSize;
      } else {
        x = (width - textWidth) / 2;
        y = margin;
      }

      page.drawText(label, { x, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) });
    }

    const pdfBytes = await pdfDoc.save();
    const baseName = pdfBaseName(req.file.originalname);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_numbered.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Page numbering failed" });
  }
});

// ─────────────────────────────────────────────────────────
// POST /tools/pdf-rotate
// rotation: 90 | 180 | 270   pages: "all" or "1,3,5-7"
// ─────────────────────────────────────────────────────────
router.post("/tools/pdf-rotate", upload.single("file"), guardSinglePdf, async (req, res) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }

  const rotationDeg = parseInt(String(req.body.rotation ?? "90")) || 90;
  const pageList = String(req.body.pages ?? "all");

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    let pageIndices: number[];
    if (pageList === "all") {
      pageIndices = Array.from({ length: totalPages }, (_, i) => i);
    } else {
      pageIndices = pageList
        .split(",")
        .map((s) => parseInt(s.trim()) - 1)
        .filter((i) => i >= 0 && i < totalPages);
    }

    for (const idx of pageIndices) {
      const current = pages[idx].getRotation().angle;
      pages[idx].setRotation(degrees((current + rotationDeg) % 360));
    }

    const pdfBytes = await pdfDoc.save();
    const baseName = pdfBaseName(req.file.originalname);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${baseName}_rotated.pdf"`,
      "Cache-Control": "no-store",
    });
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Rotation failed" });
  }
});

export default router;
