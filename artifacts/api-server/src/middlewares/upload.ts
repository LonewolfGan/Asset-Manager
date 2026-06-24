import multer from "multer";
import type { Request, Response, NextFunction } from "express";

// Global upload instance — memory storage, 50 MB hard cap
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

// Allowed MIME types per tool category
const ALLOWED_IMAGE_MIMES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/tiff",
  "image/bmp",
  "image/svg+xml",
  "image/heic",
  "image/heif",
]);

const ALLOWED_DOCUMENT_MIMES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
]);

const ALLOWED_METADATA_MIMES = new Set(["image/jpeg", "application/pdf"]);

const ALLOWED_BACKGROUND_MIMES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

// Per-type size limits (bytes)
const SIZE_LIMITS = {
  image: 20 * 1024 * 1024,      // 20 MB
  document: 30 * 1024 * 1024,   // 30 MB
  background: 20 * 1024 * 1024, // 20 MB
  text: 5 * 1024 * 1024,        // 5 MB
} as const;

function makeMimeGuard(allowed: Set<string>, sizeLimit: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const file = req.file;
    if (!file) {
      next();
      return;
    }

    if (!allowed.has(file.mimetype)) {
      res.status(415).json({
        error: `Unsupported file type: ${file.mimetype}. Accepted: ${[...allowed].join(", ")}`,
      });
      return;
    }

    if (file.size > sizeLimit) {
      res.status(413).json({
        error: `File too large. Maximum size is ${Math.round(sizeLimit / 1024 / 1024)} MB.`,
      });
      return;
    }

    next();
  };
}

export const guardImage = makeMimeGuard(ALLOWED_IMAGE_MIMES, SIZE_LIMITS.image);
export const guardDocument = makeMimeGuard(ALLOWED_DOCUMENT_MIMES, SIZE_LIMITS.document);
export const guardMetadata = makeMimeGuard(ALLOWED_METADATA_MIMES, SIZE_LIMITS.document);
export const guardBackground = makeMimeGuard(ALLOWED_BACKGROUND_MIMES, SIZE_LIMITS.background);
