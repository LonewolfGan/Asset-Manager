import multer from "multer";
import type { Request, Response, NextFunction } from "express";

// Global upload instance — memory storage, 50 MB hard cap
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
});

import { extname } from "path";
import { apiError } from "../lib/errors.js";

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

const ALLOWED_IMAGE_EXTS = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".tiff", ".tif", ".bmp", ".svg", ".heic", ".heif"
]);

const ALLOWED_DOCUMENT_MIMES = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-powerpoint",
  "application/vnd.oasis.opendocument.text",
  "application/vnd.oasis.opendocument.spreadsheet",
  "application/vnd.oasis.opendocument.presentation",
  "application/rtf",
  "text/rtf",
  "text/plain",
  "text/html",
  "text/markdown",
  "text/x-markdown",
  "application/octet-stream",
]);

const ALLOWED_DOCUMENT_EXTS = new Set([
  ".pdf", ".docx", ".doc", ".xlsx", ".xls", ".pptx", ".ppt",
  ".odt", ".ods", ".odp", ".rtf", ".txt", ".html", ".htm", ".md", ".markdown"
]);

const ALLOWED_METADATA_MIMES = new Set(["image/jpeg", "image/png", "application/pdf"]);

const ALLOWED_BACKGROUND_MIMES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

// Per-type size limits (bytes)
const SIZE_LIMITS = {
  image: 20 * 1024 * 1024,      // 20 MB
  document: 30 * 1024 * 1024,   // 30 MB
  background: 20 * 1024 * 1024, // 20 MB
  text: 5 * 1024 * 1024,        // 5 MB
} as const;

function makeMimeGuard(allowed: Set<string>, sizeLimit: number, allowedExts?: Set<string>) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const file = req.file;
    if (!file) {
      next();
      return;
    }

    const ext = file.originalname ? extname(file.originalname).toLowerCase() : "";
    const isGenericMime = file.mimetype === "application/octet-stream";
    const isMimeAllowed = allowed.has(file.mimetype) && !isGenericMime;
    const isExtAllowed = allowedExts ? allowedExts.has(ext) : false;

    // Reject generic octet-stream without valid ext, or spoofed MIME with dangerous/unmatched ext
    const isAllowed = isGenericMime
      ? isExtAllowed
      : isMimeAllowed && (!allowedExts || !ext || isExtAllowed);

    if (!isAllowed) {
      apiError(
        res,
        415,
        "UNSUPPORTED_TYPE",
        `Unsupported file type: ${file.mimetype || "unknown"}. Please provide a supported file.`,
      );
      return;
    }

    if (file.size > sizeLimit) {
      apiError(
        res,
        413,
        "FILE_TOO_LARGE",
        `File too large. Maximum size is ${Math.round(sizeLimit / 1024 / 1024)} MB.`,
      );
      return;
    }

    next();
  };
}

export const guardImage = makeMimeGuard(ALLOWED_IMAGE_MIMES, SIZE_LIMITS.image, ALLOWED_IMAGE_EXTS);
export const guardDocument = makeMimeGuard(ALLOWED_DOCUMENT_MIMES, SIZE_LIMITS.document, ALLOWED_DOCUMENT_EXTS);
export const guardMetadata = makeMimeGuard(ALLOWED_METADATA_MIMES, SIZE_LIMITS.document);
export const guardBackground = makeMimeGuard(ALLOWED_BACKGROUND_MIMES, SIZE_LIMITS.background, ALLOWED_IMAGE_EXTS);
