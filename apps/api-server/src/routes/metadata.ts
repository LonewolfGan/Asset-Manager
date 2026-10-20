import { Router, type IRouter } from "express";
import { extname } from "path";
import { PDFDocument, PDFName } from "pdf-lib";
import piexif from "piexifjs";
import sharp from "sharp";
import { upload, guardMetadata } from "../middlewares/upload.js";
import { apiError } from "../lib/errors.js";
import { defaultRateLimit } from "../middlewares/rateLimit.js";
import { buildContentDisposition } from "./convert/convert-image.js";
import { linearizePdf } from "../lib/pdf-linearize.js";

const router: IRouter = Router();

function resolveMime(mimetype: string, originalname?: string): string {
  if (mimetype && mimetype !== "application/octet-stream") {
    return mimetype.toLowerCase();
  }
  const ext = originalname ? extname(originalname).toLowerCase() : "";
  switch (ext) {
    case ".pdf":
      return "application/pdf";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".tif":
    case ".tiff":
      return "image/tiff";
    default:
      return mimetype || "application/octet-stream";
  }
}

router.post("/metadata/read", defaultRateLimit, upload.single("file"), guardMetadata, async (req, res) => {
  if (!req.file || req.file.size === 0 || !req.file.buffer) {
    apiError(res, 400, "NO_FILE", "No file uploaded or file is empty");
    return;
  }

  const mime = resolveMime(req.file.mimetype, req.file.originalname);

  try {
    if (mime === "application/pdf") {
      const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
      res.json({
        type: "pdf",
        metadata: {
          title: pdfDoc.getTitle() ?? "",
          author: pdfDoc.getAuthor() ?? "",
          subject: pdfDoc.getSubject() ?? "",
          producer: pdfDoc.getProducer() ?? "",
          creator: pdfDoc.getCreator() ?? "",
          keywords: pdfDoc.getKeywords() ?? "",
          pageCount: pdfDoc.getPageCount(),
        },
      });
      return;
    }

    if (mime.startsWith("image/")) {
      const imgMeta = await sharp(req.file.buffer).metadata();
      let exifData: unknown = null;

      if (mime === "image/jpeg" || mime === "image/jpg" || imgMeta.format === "jpeg") {
        try {
          const b64 = req.file.buffer.toString("base64");
          exifData = piexif.load(`data:image/jpeg;base64,${b64}`);
        } catch {
          exifData = null;
        }
      }

      res.json({
        type: imgMeta.format || "image",
        metadata: {
          width: imgMeta.width ?? null,
          height: imgMeta.height ?? null,
          format: imgMeta.format ?? null,
          space: imgMeta.space ?? null,
          channels: imgMeta.channels ?? null,
          density: imgMeta.density ?? null,
          hasAlpha: imgMeta.hasAlpha ?? false,
          orientation: imgMeta.orientation ?? 1,
          hasProfile: imgMeta.hasProfile ?? false,
          exif: exifData,
        },
      });
      return;
    }

    apiError(res, 415, "UNSUPPORTED_TYPE", "Unsupported file type. Only PDF and images are supported.");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to read metadata";
    apiError(res, 500, "CONVERSION_FAILED", message);
  }
});

router.post("/metadata/clean", defaultRateLimit, upload.single("file"), guardMetadata, async (req, res) => {
  if (!req.file || req.file.size === 0 || !req.file.buffer) {
    apiError(res, 400, "NO_FILE", "No file uploaded or file is empty");
    return;
  }

  const mime = resolveMime(req.file.mimetype, req.file.originalname);
  const originalName = req.file.originalname?.trim() || "document";
  const rawBase = originalName.replace(/\.[^.]+$/, "");
  const outBase = rawBase.startsWith("cleaned-") ? rawBase : `cleaned-${rawBase}`;

  try {
    if (mime === "application/pdf") {
      const pdfDoc = await PDFDocument.load(req.file.buffer, { ignoreEncryption: true });
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("");
      pdfDoc.setCreator("");
      // Strip XMP Metadata stream from the catalog if present
      try {
        pdfDoc.catalog.delete(PDFName.of("Metadata"));
      } catch {
        // Safe pass-through if Catalog or Metadata entry is absent
      }

      const pdfBytes = await pdfDoc.save();
      const linearized = await linearizePdf(Buffer.from(pdfBytes));

      res.set("Content-Type", "application/pdf");
      res.set("Content-Disposition", buildContentDisposition(`${outBase}.pdf`, "pdf"));
      res.set("Cache-Control", "no-store");
      res.send(linearized);
      return;
    }

    if (mime === "image/jpeg" || mime === "image/jpg") {
      const meta = await sharp(req.file.buffer).metadata();
      const needsOrientationFix = Boolean(meta.orientation && meta.orientation > 1);

      let outBuffer: Buffer | null = null;
      if (!needsOrientationFix) {
        try {
          const b64 = req.file.buffer.toString("base64");
          const cleanedDataUrl = piexif.remove(`data:image/jpeg;base64,${b64}`);
          outBuffer = Buffer.from(cleanedDataUrl.split(",")[1], "base64");
        } catch {
          outBuffer = null;
        }
      }

      if (!outBuffer) {
        outBuffer = await sharp(req.file.buffer)
          .rotate()
          .withIccProfile("srgb")
          .jpeg({ quality: 92, mozjpeg: true })
          .toBuffer();
      }

      res.set("Content-Type", "image/jpeg");
      res.set("Content-Disposition", buildContentDisposition(`${outBase}.jpg`, "jpg"));
      res.set("Cache-Control", "no-store");
      res.send(outBuffer);
      return;
    }

    if (mime === "image/png") {
      const outBuffer = await sharp(req.file.buffer)
        .rotate()
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer();

      res.set("Content-Type", "image/png");
      res.set("Content-Disposition", buildContentDisposition(`${outBase}.png`, "png"));
      res.set("Cache-Control", "no-store");
      res.send(outBuffer);
      return;
    }

    if (mime === "image/webp") {
      const outBuffer = await sharp(req.file.buffer)
        .rotate()
        .webp({ effort: 4, quality: 90, smartSubsample: true })
        .toBuffer();

      res.set("Content-Type", "image/webp");
      res.set("Content-Disposition", buildContentDisposition(`${outBase}.webp`, "webp"));
      res.set("Cache-Control", "no-store");
      res.send(outBuffer);
      return;
    }

    if (mime === "image/tiff") {
      const outBuffer = await sharp(req.file.buffer)
        .rotate()
        .tiff({ compression: "deflate" })
        .toBuffer();

      res.set("Content-Type", "image/tiff");
      res.set("Content-Disposition", buildContentDisposition(`${outBase}.tiff`, "tiff"));
      res.set("Cache-Control", "no-store");
      res.send(outBuffer);
      return;
    }

    apiError(res, 415, "UNSUPPORTED_TYPE", "Unsupported file type. Only PDF and images are supported.");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to clean metadata";
    apiError(res, 500, "CONVERSION_FAILED", message);
  }
});

export default router;
