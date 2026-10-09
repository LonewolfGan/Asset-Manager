import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { sanitizeWinAnsi } from "./pdf-text.js";

describe("PDF WinAnsi Sanitizer (TDD)", () => {
  it("preserves standard ASCII and common WinAnsi characters", async () => {
    const input = "Hello World! Document 123. Accents: é à è ç ô ï. Symbols: € © £";
    const sanitized = sanitizeWinAnsi(input);

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);

    // Should encode cleanly without throwing
    assert.doesNotThrow(() => {
      font.encodeText(sanitized);
    });
  });

  it("removes or replaces characters unencodable in WinAnsi (emojis, cyrillic, asian scripts)", async () => {
    const input = "Rapport Financier 2026 😊 🚀 - Привет мир - 汉字 - Özel Karakterler";
    const sanitized = sanitizeWinAnsi(input);

    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);

    assert.doesNotThrow(() => {
      font.encodeText(sanitized);
    });
    // Sanity check that emojis are neutralized
    assert.strictEqual(sanitized.includes("😊"), false);
    assert.strictEqual(sanitized.includes("🚀"), false);
  });

  it("handles empty string, null-ish or whitespace safely", () => {
    assert.strictEqual(sanitizeWinAnsi(""), "");
    assert.strictEqual(sanitizeWinAnsi("   "), "   ");
    assert.strictEqual(sanitizeWinAnsi(null as unknown as string), "");
    assert.strictEqual(sanitizeWinAnsi(undefined as unknown as string), "");
  });
});
