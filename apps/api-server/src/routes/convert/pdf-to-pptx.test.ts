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
  convertPdfToPptx,
  handlePdfToPptx,
  PPTX_MIME_TYPE,
} from "./pdf-to-pptx-handler.js";

/**
 * Generates an in-memory 2-slide test PDF presentation using pdf-lib.
 */
async function createSamplePdfPresentation(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Slide 1: 16:9 widescreen presentation (720 x 405 pt)
  const page1 = doc.addPage([720, 405]);

  // Slide 1 Title
  page1.drawText("Strategic Roadmap 2026", {
    x: 50,
    y: 320,
    size: 26,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Slide 1 Subtitle
  page1.drawText("EverydayTools Hub Architecture & Scalability", {
    x: 50,
    y: 280,
    size: 14,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Slide 1 decorative accent line
  page1.drawLine({
    start: { x: 50, y: 260 },
    end: { x: 670, y: 260 },
    thickness: 2,
    color: rgb(0.8, 0.2, 0.2),
  });

  // Slide 2: Milestones & points
  const page2 = doc.addPage([720, 405]);

  page2.drawText("Key Deliverables & Milestones", {
    x: 50,
    y: 330,
    size: 22,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  const bullets = [
    "High-fidelity document rendering without ghosting",
    "Isolated ephemeral workspaces under ProcessPool",
    "100% sanctuarized Awwwards user experience",
  ];

  let curY = 270;
  for (const b of bullets) {
    page2.drawText(`• ${b}`, {
      x: 60,
      y: curY,
      size: 12,
      font,
      color: rgb(0.2, 0.2, 0.2),
    });
    curY -= 30;
  }

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

describe("PDF to PPTX High-Fidelity Engine — Unit & Integration (TDD RED)", () => {
  // =========================================================================
  // 1. Valid PDF presentation converts to valid PPTX OpenXML Buffer
  // =========================================================================
  it("converts a valid multi-slide PDF into a valid PPTX OpenXML Buffer", async () => {
    assert.strictEqual(
      PPTX_MIME_TYPE,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "PPTX MIME type constant must match OpenXML specification"
    );

    const pdfBuffer = await createSamplePdfPresentation();
    const pptxBuffer = await convertPdfToPptx(pdfBuffer);

    assert.ok(Buffer.isBuffer(pptxBuffer), "Output must be a Buffer instance");
    assert.ok(pptxBuffer.length > 500, "PPTX buffer must have substantial size");

    // Standard PPTX (ZIP archive) magic bytes: 0x50, 0x4B, 0x03, 0x04 (PK\x03\x04)
    const magic = [pptxBuffer[0], pptxBuffer[1], pptxBuffer[2], pptxBuffer[3]];
    assert.deepStrictEqual(
      magic,
      [0x50, 0x4b, 0x03, 0x04],
      "PPTX output must begin with ZIP magic bytes PK\\x03\\x04"
    );
  });

  // =========================================================================
  // 2. Unzips and contains ppt/presentation.xml & editable slides with content
  // =========================================================================
  it("produces a PPTX archive containing ppt/presentation.xml and individual slide XML entries", async () => {
    const pdfBuffer = await createSamplePdfPresentation();
    const pptxBuffer = await convertPdfToPptx(pdfBuffer);

    const unzipped = unzipSync(new Uint8Array(pptxBuffer));

    assert.ok(
      unzipped["ppt/presentation.xml"],
      "PPTX archive must contain ppt/presentation.xml"
    );
    assert.ok(
      unzipped["[Content_Types].xml"],
      "PPTX archive must contain [Content_Types].xml"
    );

    // Look for slide files
    const slideFiles = Object.keys(unzipped).filter((name) =>
      name.startsWith("ppt/slides/slide") && name.endsWith(".xml")
    );
    assert.ok(slideFiles.length >= 2, "PPTX archive must have at least 2 slide entries");

    // Verify slide text content is preserved in XML
    const allXml = Object.entries(unzipped)
      .filter(([name]) => name.endsWith(".xml"))
      .map(([, data]) => strFromU8(data))
      .join(" ");

    assert.ok(
      allXml.includes("Strategic Roadmap") || allXml.includes("StrategicRoadmap") || allXml.includes("Strategic"),
      "Extracted PPTX must preserve presentation title"
    );
    assert.ok(
      allXml.includes("Key Deliverables") || allXml.includes("KeyDeliverables") || allXml.includes("Deliverables"),
      "Extracted PPTX must preserve slide 2 header"
    );
  });

  // =========================================================================
  // 3. Error Handling: Empty & Corrupted Buffers
  // =========================================================================
  it("rejects cleanly with a descriptive error when input buffer is empty", async () => {
    const emptyBuffer = Buffer.alloc(0);
    await assert.rejects(
      convertPdfToPptx(emptyBuffer),
      /invalid or empty/i,
      "Should reject empty buffer with descriptive error"
    );
  });

  it("rejects cleanly with a descriptive error when input buffer is corrupted", async () => {
    const corruptBuffer = Buffer.from("NOT_A_VALID_PDF_STREAM_HEADER_CORRUPTED");
    await assert.rejects(
      convertPdfToPptx(corruptBuffer),
      /invalid|corrupt|failed|pdf/i,
      "Should reject corrupted PDF with descriptive error"
    );
  });

  it("handlePdfToPptx returns 400 with INVALID_PDF for corrupted file upload", async () => {
    let statusCode = 0;
    let jsonPayload: any = null;
    const req = {
      file: {
        buffer: Buffer.from("CORRUPT_NOT_A_PDF"),
        originalname: "bad_slide.pdf",
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

    await handlePdfToPptx(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonPayload?.code, "INVALID_PDF");
  });

  // =========================================================================
  // 4. Ephemeral Workspace Isolation & Zero-Leak Assurance
  // =========================================================================
  it("executes inside an isolated workspace and cleans up temporary directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-pptx-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuffer = await createSamplePdfPresentation();
    const pptxBuffer = await convertPdfToPptx(pdfBuffer, { pool: testPool });
    assert.ok(pptxBuffer.length > 0);

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned immediately upon success"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });

  it("cleans up isolated ephemeral workspace even if conversion fails", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-pptx-fail-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const corruptBuffer = Buffer.from("CORRUPT_PAYLOAD_FOR_LEAK_CHECK");
    await assert.rejects(convertPdfToPptx(corruptBuffer, { pool: testPool }));

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned even when task throws an error"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });
});
