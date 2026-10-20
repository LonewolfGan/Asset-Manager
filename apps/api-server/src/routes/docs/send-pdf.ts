import type { Response } from "express";
import { buildContentDisposition } from "../convert/convert-image.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";

export async function sendPdf(res: Response, buf: Buffer, filename: string): Promise<void> {
  const linearized = await linearizePdf(buf);
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": buildContentDisposition(filename, "pdf"),
    "Cache-Control": "no-store",
  });
  res.send(linearized);
}
