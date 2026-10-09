import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { sanitizeWinAnsi } from "../../lib/pdf-text.js";

describe("Convert Text to PDF & Sanitization (TDD)", () => {
  it("sanitizes text containing emojis and non-WinAnsi characters before pdf-lib creation", async () => {
    const rawText = "Rapport annuel 2026 😊 🚀\nContenu avec accents: é à è ç ô ï\nDevise: 100 €";
    const sanitized = sanitizeWinAnsi(rawText);

    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage();
    const fontSize = 12;
    let y = 700;

    // Must not throw WinAnsi cannot encode
    assert.doesNotThrow(() => {
      for (const line of sanitized.split("\n")) {
        page.drawText(line || " ", { x: 50, y, size: fontSize });
        y -= fontSize * 1.5;
      }
    });

    const pdfBytes = await pdfDoc.save();
    assert.strictEqual(pdfBytes.length > 500, true);
    assert.strictEqual(sanitized.includes("😊"), false);
  });
});
