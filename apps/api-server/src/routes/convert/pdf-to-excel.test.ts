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
  convertPdfToExcel,
  handlePdfToExcel,
  EXCEL_MIME_TYPE,
} from "./pdf-to-excel-handler.js";

/**
 * Generates an in-memory test PDF containing tabular row/column data using pdf-lib.
 */
async function createSamplePdfWithSpreadsheetTable(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const page = doc.addPage([595.28, 841.89]); // Standard A4

  // Title / Heading
  page.drawText("Quarterly Financial Balance Sheet", {
    x: 50,
    y: 780,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Body description
  page.drawText("Audited financial reporting across global subsidiaries.", {
    x: 50,
    y: 755,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Draw table grid lines
  const startX = 50;
  const startY = 730;
  const colWidths = [130, 80, 80, 100, 70];
  const rowHeight = 25;
  const rows = [
    ["Entity", "Item Code", "Revenue", "Expenses", "Margin"],
    ["North America", "Item 1", "1250000", "(840,000.00)", "32.8%"],
    ["European Operations", "Unit 42", "980000", "650000", "33.6%"],
    ["Asia-Pacific", "Batch 100", "640000", "410000", "35.9%"],
  ];

  const totalWidth = colWidths.reduce((a, b) => a + b, 0);
  const totalHeight = rows.length * rowHeight;

  // Outer border & horizontal lines
  for (let r = 0; r <= rows.length; r++) {
    const y = startY - r * rowHeight;
    page.drawLine({
      start: { x: startX, y },
      end: { x: startX + totalWidth, y },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
  }

  // Vertical lines
  let curX = startX;
  for (let c = 0; c <= colWidths.length; c++) {
    page.drawLine({
      start: { x: curX, y: startY },
      end: { x: curX, y: startY - totalHeight },
      thickness: 1,
      color: rgb(0.7, 0.7, 0.7),
    });
    if (c < colWidths.length) curX += colWidths[c];
  }

  // Cell texts
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const isHeader = r === 0;
    const curFont = isHeader ? boldFont : font;
    let cellX = startX;
    const cellY = startY - r * rowHeight - 16;

    for (let c = 0; c < row.length; c++) {
      page.drawText(row[c], {
        x: cellX + 8,
        y: cellY,
        size: 9,
        font: curFont,
        color: isHeader ? rgb(0, 0, 0) : rgb(0.2, 0.2, 0.2),
      });
      cellX += colWidths[c];
    }
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

describe("PDF to Excel High-Fidelity Engine — Unit & Integration (TDD RED)", () => {
  // =========================================================================
  // 1. Valid PDF with table converts to valid XLSX Buffer
  // =========================================================================
  it("converts a valid PDF table into a valid XLSX OpenXML Buffer", async () => {
    assert.strictEqual(
      EXCEL_MIME_TYPE,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "XLSX MIME type constant must match OpenXML specification"
    );

    const pdfBuffer = await createSamplePdfWithSpreadsheetTable();
    const xlsxBuffer = await convertPdfToExcel(pdfBuffer);

    assert.ok(Buffer.isBuffer(xlsxBuffer), "Output must be a Buffer instance");
    assert.ok(xlsxBuffer.length > 500, "XLSX buffer must have substantial size");

    // Standard XLSX (ZIP archive) magic bytes: 0x50, 0x4B, 0x03, 0x04 (PK\x03\x04)
    const magic = [xlsxBuffer[0], xlsxBuffer[1], xlsxBuffer[2], xlsxBuffer[3]];
    assert.deepStrictEqual(
      magic,
      [0x50, 0x4b, 0x03, 0x04],
      "XLSX output must begin with ZIP magic bytes PK\\x03\\x04"
    );
  });

  // =========================================================================
  // 2. Unzips and contains xl/workbook.xml & sheets with converted content
  // =========================================================================
  it("produces an XLSX archive containing xl/workbook.xml and sheet entries with extracted tabular data", async () => {
    const pdfBuffer = await createSamplePdfWithSpreadsheetTable();
    const xlsxBuffer = await convertPdfToExcel(pdfBuffer);

    const unzipped = unzipSync(new Uint8Array(xlsxBuffer));

    assert.ok(
      unzipped["xl/workbook.xml"],
      "XLSX archive must contain xl/workbook.xml"
    );
    assert.ok(
      unzipped["[Content_Types].xml"],
      "XLSX archive must contain [Content_Types].xml"
    );

    // Look for worksheet xml
    const sheetFiles = Object.keys(unzipped).filter((name) =>
      name.startsWith("xl/worksheets/sheet")
    );
    assert.ok(sheetFiles.length > 0, "XLSX archive must have at least one worksheet");

    // Verify content strings appear in sharedStrings or worksheet xml
    const allXml = Object.entries(unzipped)
      .filter(([name]) => name.endsWith(".xml"))
      .map(([, data]) => strFromU8(data))
      .join(" ");

    assert.ok(
      allXml.includes("North America") || allXml.includes("Entity"),
      "Extracted XML must preserve table cell textual content"
    );
    assert.ok(
      allXml.includes("Item 1") || allXml.includes("Item1"),
      "Extracted XML must preserve mixed alphanumeric cells like 'Item 1' / 'Item1' without truncating to numbers"
    );
    assert.ok(
      allXml.includes("Unit 42") || allXml.includes("Unit42"),
      "Extracted XML must preserve mixed alphanumeric cells like 'Unit 42' / 'Unit42'"
    );
  });

  // =========================================================================
  // 3. Error Handling: Empty & Corrupted Buffers
  // =========================================================================
  it("rejects cleanly with a descriptive error when input buffer is empty", async () => {
    const emptyBuffer = Buffer.alloc(0);
    await assert.rejects(
      convertPdfToExcel(emptyBuffer),
      /invalid or empty/i,
      "Should reject empty buffer with descriptive error"
    );
  });

  it("rejects cleanly with a descriptive error when input buffer is corrupted", async () => {
    const corruptBuffer = Buffer.from("NOT_A_VALID_PDF_STREAM_HEADER_CORRUPTED");
    await assert.rejects(
      convertPdfToExcel(corruptBuffer),
      /invalid|corrupt|failed|pdf/i,
      "Should reject corrupted PDF with descriptive error"
    );
  });

  it("handlePdfToExcel returns 400 with INVALID_PDF for corrupted file upload", async () => {
    let statusCode = 0;
    let jsonPayload: any = null;
    const req = {
      file: {
        buffer: Buffer.from("CORRUPT_NOT_A_PDF"),
        originalname: "bad.pdf",
      },
    } as any;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(payload: any) {
        jsonPayload = payload;
        return this;
      },
      set() {
        return this;
      },
      send() {
        return this;
      },
    } as any;

    await handlePdfToExcel(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonPayload?.code, "INVALID_PDF");
  });

  // =========================================================================
  // 4. Ephemeral Workspace Isolation & Zero-Leak Assurance
  // =========================================================================
  it("executes inside an isolated workspace and cleans up temporary directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-excel-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuffer = await createSamplePdfWithSpreadsheetTable();
    const xlsxBuffer = await convertPdfToExcel(pdfBuffer, { pool: testPool });
    assert.ok(xlsxBuffer.length > 0);

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned immediately upon success"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });

  it("cleans up isolated ephemeral workspace even if conversion fails", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-excel-fail-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const corruptBuffer = Buffer.from("CORRUPT_PAYLOAD_FOR_LEAK_CHECK");
    await assert.rejects(convertPdfToExcel(corruptBuffer, { pool: testPool }));

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned even when task throws an error"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });
});
