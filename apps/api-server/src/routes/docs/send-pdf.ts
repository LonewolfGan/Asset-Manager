import type { Response } from "express";

export function sendPdf(res: Response, buf: Buffer, filename: string): void {
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filename.replace(/"/g, "")}"`,
    "Cache-Control": "no-store",
  });
  res.send(buf);
}
