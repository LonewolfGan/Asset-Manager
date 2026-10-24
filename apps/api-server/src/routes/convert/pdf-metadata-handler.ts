import type { Request, Response } from "express";
import { writeFile, readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFDocument } from "pdf-lib";
import { ProcessPool, defaultProcessPool } from "../../lib/process-pool.js";
import { apiError } from "../../lib/errors.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";
import { buildContentDisposition } from "./convert-image.js";

export interface UpdatePdfMetadataOptions {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[] | string;
  creator?: string;
  producer?: string;
  language?: string;
  pool?: ProcessPool;
  timeoutMs?: number;
}

export interface UpdatePdfMetadataResult {
  buffer: Buffer;
  pageCount: number;
  mimeType: string;
}

function isValidPdfHeader(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  return (
    buffer[0] === 0x25 && // %
    buffer[1] === 0x50 && // P
    buffer[2] === 0x44 && // D
    buffer[3] === 0x46 && // F
    buffer[4] === 0x2d    // -
  );
}

export async function updatePdfMetadataUnderPool(
  inputBuffer: Buffer,
  options?: UpdatePdfMetadataOptions
): Promise<UpdatePdfMetadataResult> {
  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Invalid or empty PDF input buffer");
  }

  if (!isValidPdfHeader(inputBuffer)) {
    throw new Error("Invalid or corrupt PDF header (%PDF- required)");
  }

  const pool = options?.pool ?? defaultProcessPool;
  const timeoutMs = options?.timeoutMs ?? 60_000;

  return pool.run(
    async (ctx) => {
      const inputPath = join(ctx.workspaceDir, "input.pdf");
      const outputPath = join(ctx.workspaceDir, "output.pdf");

      await writeFile(inputPath, inputBuffer);

      const pdfDoc = await PDFDocument.load(inputBuffer, { ignoreEncryption: true });

      if (options?.title !== undefined) pdfDoc.setTitle(String(options.title));
      if (options?.author !== undefined) pdfDoc.setAuthor(String(options.author));
      if (options?.subject !== undefined) pdfDoc.setSubject(String(options.subject));
      if (options?.keywords !== undefined) {
        const kw = Array.isArray(options.keywords)
          ? options.keywords.map(String).map((s) => s.trim()).filter(Boolean)
          : String(options.keywords).split(",").map((s) => s.trim()).filter(Boolean);
        pdfDoc.setKeywords(kw);
      }
      if (options?.creator !== undefined) pdfDoc.setCreator(String(options.creator));
      if (options?.producer !== undefined) pdfDoc.setProducer(String(options.producer));
      if (options?.language !== undefined && options.language.trim()) {
        pdfDoc.setLanguage(options.language.trim());
      }
      pdfDoc.setModificationDate(new Date());

      const savedBytes = await pdfDoc.save({ useObjectStreams: false });
      const linearized = await linearizePdf(Buffer.from(savedBytes));

      await writeFile(outputPath, linearized);
      const finalBuffer = await readFile(outputPath);

      return {
        buffer: finalBuffer,
        pageCount: pdfDoc.getPageCount(),
        mimeType: "application/pdf",
      };
    },
    { timeoutMs }
  );
}

export async function handlePdfMetadata(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    apiError(res, 400, "NO_FILE", "No file uploaded");
    return;
  }

  if (!isValidPdfHeader(req.file.buffer)) {
    apiError(res, 400, "INVALID_PDF", "Invalid or corrupt PDF file");
    return;
  }

  const originalName = req.file.originalname ?? "document.pdf";
  const baseName = originalName.replace(/\.pdf$/i, "").trim() || "document";

  try {
    const result = await updatePdfMetadataUnderPool(req.file.buffer, {
      title: req.body?.title !== undefined ? String(req.body.title) : undefined,
      author: req.body?.author !== undefined ? String(req.body.author) : undefined,
      subject: req.body?.subject !== undefined ? String(req.body.subject) : undefined,
      keywords: req.body?.keywords !== undefined ? req.body.keywords : undefined,
      creator: req.body?.creator !== undefined ? String(req.body.creator) : undefined,
      producer: req.body?.producer !== undefined ? String(req.body.producer) : undefined,
      language: req.body?.language !== undefined ? String(req.body.language) : undefined,
    });

    const disposition = buildContentDisposition(`${baseName}_metadata.pdf`, "pdf");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": disposition,
      "X-Page-Count": String(result.pageCount),
      "Cache-Control": "no-store",
      "Access-Control-Expose-Headers": "X-Page-Count",
    });
    res.send(result.buffer);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Metadata update failed";
    const isClient = /invalid|corrupt|empty|unsupported|zero pages|password|encrypted/i.test(msg);
    const status = isClient ? 400 : 500;
    const code = isClient ? "INVALID_INPUT" : "METADATA_FAILED";
    apiError(res, status, code, msg);
  }
}
