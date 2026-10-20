import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { protectPdf, unlockPdf } from "./pdf-security-logic.js";
import { buildContentDisposition } from "../convert/convert-image.js";

async function createSamplePdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([200, 200]);
  page.drawText("Security Route Integration Test", { x: 20, y: 100 });
  return Buffer.from(await doc.save());
}

describe("PDF Security Routes & Integration (TDD)", () => {
  it("verifies pdf-protect disposition, encryption header, and execution", async () => {
    const pdfBuf = await createSamplePdf();
    const result = await protectPdf(pdfBuf, {
      userPassword: "TestPassword456!",
    });

    assert.strictEqual(result.buffer instanceof Buffer, true);
    assert.strictEqual(result.encryption, "AES-256");

    const disposition = buildContentDisposition("confidential.v1_protected.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="confidential.v1_protected.pdf"'), true);
    assert.strictEqual(disposition.includes("filename*="), true);
  });

  it("verifies pdf-unlock disposition and execution", async () => {
    const pdfBuf = await createSamplePdf();
    const protectedResult = await protectPdf(pdfBuf, {
      userPassword: "TestPassword456!",
    });

    const unlockedBuf = await unlockPdf(protectedResult.buffer, {
      password: "TestPassword456!",
    });

    assert.strictEqual(unlockedBuf instanceof Buffer, true);
    assert.strictEqual(unlockedBuf.length > 0, true);

    const disposition = buildContentDisposition("confidential.v1_unlocked.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="confidential.v1_unlocked.pdf"'), true);
    assert.strictEqual(disposition.includes("filename*="), true);
  });
});
