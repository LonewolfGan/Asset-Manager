import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { unzipSync, strFromU8 } from "fflate";
import { ProcessPool } from "../../lib/process-pool.js";
import {
  convertPdfToWord,
  DOCX_MIME_TYPE,
} from "./pdf-to-word-handler.js";

/**
 * Generates an in-memory test PDF containing headings, body text,
 * and tabular row/column data using pdf-lib without mocking.
 */
async function createSamplePdfWithTable(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595.28, 841.89]); // Standard A4

  // Title / Heading
  page.drawText("Quarterly Financial Overview", {
    x: 50,
    y: 780,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Body paragraph
  page.drawText("Consolidated financial breakdown for fiscal year operations.", {
    x: 50,
    y: 750,
    size: 11,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Tabular data
  const rows = [
    ["Department", "Budget", "Spent", "Remaining"],
    ["Infrastructure", "$45,000", "$38,200", "$6,800"],
    ["Engineering", "$120,000", "$115,000", "$5,000"],
  ];

  let currentY = 700;
  const colXs = [50, 180, 280, 380];

  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const currentFont = r === 0 ? boldFont : font;
    for (let c = 0; c < row.length; c++) {
      page.drawText(row[c], {
        x: colXs[c],
        y: currentY,
        size: 10,
        font: currentFont,
      });
    }
    currentY -= 25;
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

describe("PDF to Word High-Fidelity Engine — Unit & Integration (TDD RED)", () => {
  // =========================================================================
  // 1. Valid PDF with text & table converts to valid DOCX Buffer
  // =========================================================================
  it("converts a valid PDF with text and table into a valid DOCX Buffer", async () => {
    assert.strictEqual(
      DOCX_MIME_TYPE,
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "DOCX MIME type constant must match OpenXML specification"
    );

    const pdfBuffer = await createSamplePdfWithTable();
    const docxBuffer = await convertPdfToWord(pdfBuffer);

    assert.ok(Buffer.isBuffer(docxBuffer), "Output must be a Buffer instance");
    assert.ok(docxBuffer.length > 500, "DOCX buffer must have substantial size");

    // Standard DOCX (ZIP archive) magic bytes: 0x50, 0x4B, 0x03, 0x04 (PK\x03\x04)
    const magic = [docxBuffer[0], docxBuffer[1], docxBuffer[2], docxBuffer[3]];
    assert.deepStrictEqual(
      magic,
      [0x50, 0x4b, 0x03, 0x04],
      "DOCX output must begin with ZIP magic bytes PK\\x03\\x04"
    );
  });

  // =========================================================================
  // 2. Unzips and contains word/document.xml with converted content
  // =========================================================================
  it("produces a valid DOCX archive containing word/document.xml with extracted content", async () => {
    const pdfBuffer = await createSamplePdfWithTable();
    const docxBuffer = await convertPdfToWord(pdfBuffer);

    const unzipped = unzipSync(new Uint8Array(docxBuffer));

    assert.ok(
      unzipped["word/document.xml"],
      "DOCX archive must contain word/document.xml entry"
    );
    assert.ok(
      unzipped["[Content_Types].xml"],
      "DOCX archive must contain [Content_Types].xml entry"
    );

    const docXml = strFromU8(unzipped["word/document.xml"]);
    assert.ok(
      docXml.includes("Quarterly Financial Overview"),
      "word/document.xml must preserve heading text"
    );
    assert.ok(
      docXml.includes("Infrastructure"),
      "word/document.xml must preserve table cell text"
    );
  });

  // =========================================================================
  // 3. Error Handling: Empty & Corrupted Buffers
  // =========================================================================
  it("rejects cleanly with a descriptive error when input buffer is empty", async () => {
    const emptyBuffer = Buffer.alloc(0);
    await assert.rejects(
      convertPdfToWord(emptyBuffer),
      /invalid or empty/i,
      "Should reject empty buffer with descriptive error"
    );
  });

  it("rejects cleanly with a descriptive error when input buffer is corrupted", async () => {
    const corruptBuffer = Buffer.from("NOT_A_VALID_PDF_STREAM_HEADER_CORRUPTED");
    await assert.rejects(
      convertPdfToWord(corruptBuffer),
      /invalid|corrupt|failed|pdf/i,
      "Should reject corrupted PDF with descriptive error"
    );
  });

  // =========================================================================
  // 4. Ephemeral Workspace Isolation & Zero-Leak Assurance
  // =========================================================================
  it("executes inside an isolated workspace and cleans up temporary directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-word-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuffer = await createSamplePdfWithTable();
    const docxBuffer = await convertPdfToWord(pdfBuffer, { pool: testPool });
    assert.ok(docxBuffer.length > 0);

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned immediately upon success"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });

  it("cleans up isolated ephemeral workspace even if conversion fails", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-word-fail-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const corruptBuffer = Buffer.from("CORRUPT_PAYLOAD_FOR_LEAK_CHECK");
    await assert.rejects(convertPdfToWord(corruptBuffer, { pool: testPool }));

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned even when task throws an error"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });
});
