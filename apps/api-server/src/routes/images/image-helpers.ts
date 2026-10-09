import type sharp from "sharp";

export function sharpFormatFromMime(mime: string): "jpeg" | "png" | "webp" | "avif" | "gif" | "tiff" {
  if (mime === "image/jpeg" || mime === "image/jpg") return "jpeg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/avif") return "avif";
  if (mime === "image/gif") return "gif";
  if (mime === "image/tiff") return "tiff";
  return "jpeg";
}

export function extFromFormat(fmt: string): string {
  if (fmt === "jpeg") return "jpg";
  return fmt;
}
