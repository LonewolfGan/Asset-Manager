import type { Request, Response, NextFunction } from "express";
import { apiError } from "../../lib/errors.js";

export function guardSinglePdf(req: Request, res: Response, next: NextFunction): void {
  const file = req.file;
  if (!file) { next(); return; }
  if (file.mimetype !== "application/pdf") {
    apiError(res, 415, "UNSUPPORTED_TYPE", `Unsupported type: ${file.mimetype}. Only PDF accepted.`);
    return;
  }
  if (file.size > 50 * 1024 * 1024) {
    apiError(res, 413, "FILE_TOO_LARGE", "File too large. Maximum 50 MB.");
    return;
  }
  next();
}

export function guardMultiPdf(req: Request, res: Response, next: NextFunction): void {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files || files.length === 0) { next(); return; }
  for (const f of files) {
    if (f.mimetype !== "application/pdf") {
      apiError(res, 415, "UNSUPPORTED_TYPE", `${f.originalname} is not a PDF.`);
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      apiError(res, 413, "FILE_TOO_LARGE", `${f.originalname} exceeds 50 MB limit.`);
      return;
    }
  }
  next();
}

export function pdfBaseName(originalname: string | undefined): string {
  return (originalname ?? "document").replace(/\.pdf$/i, "");
}

export function parsePageRanges(str: string, maxPages: number): number[][] {
  if (!str.trim()) return [];
  const parsed: number[][] = [];
  for (const part of str.split(",").map((s) => s.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [a, b] = part.split("-").map((s) => parseInt(s.trim()));
      if (isNaN(a) || isNaN(b) || a < 1) continue;
      const lo = Math.min(Math.min(a, maxPages), Math.min(b, maxPages));
      const hi = Math.max(Math.min(a, maxPages), Math.min(b, maxPages));
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
