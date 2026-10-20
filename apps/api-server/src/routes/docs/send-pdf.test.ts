import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { sendPdf } from "./send-pdf.js";

describe("sendPdf Helper with Fast Web View Linearization (TDD)", () => {
  it("linearizes the PDF buffer and applies RFC 5987 headers", async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([200, 200]);
    const testBuffer = Buffer.from(await pdfDoc.save());

    let headers: Record<string, string> = {};
    let sentBuffer: Buffer | null = null;

    const mockRes = {
      set(h: Record<string, string>) {
        headers = { ...headers, ...h };
        return this;
      },
      send(b: Buffer) {
        sentBuffer = b;
        return this;
      },
    } as any;

    await sendPdf(mockRes, testBuffer, "rapport_activite_annuel_décembre.pdf");

    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.strictEqual(headers["Cache-Control"], "no-store");
    assert.strictEqual(headers["Content-Disposition"].includes('filename="rapport_activite_annuel_d_cembre.pdf"'), true);
    assert.strictEqual(headers["Content-Disposition"].includes("filename*=UTF-8''"), true);
    assert.ok(sentBuffer);
    const pdfBytes = sentBuffer as Buffer;
    assert.strictEqual(pdfBytes.subarray(0, 5).toString("ascii"), "%PDF-");
  });
});
