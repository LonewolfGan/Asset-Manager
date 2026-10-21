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
  convertPdfToEpub,
  handlePdfToEpub,
  EPUB_MIME_TYPE,
} from "./pdf-to-epub-handler.js";

/**
 * Generates an in-memory 2-page test PDF document using pdf-lib.
 */
async function createSamplePdfDocument(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Title and initial paragraph
  const page1 = doc.addPage([595.28, 841.89]);
  page1.drawText("Digital Publishing Architecture", {
    x: 50,
    y: 780,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  page1.drawText("High-Fidelity EPUB3 Generation Engine for Modern Readers", {
    x: 50,
    y: 740,
    size: 13,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });
  page1.drawText("Standard reflowable content with dual navigation support.", {
    x: 50,
    y: 700,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Page 2: Chapter 2 content
  const page2 = doc.addPage([595.28, 841.89]);
  page2.drawText("Chapter 2: Format Specifications", {
    x: 50,
    y: 780,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  page2.drawText("Strict adherence to EPUB 3.2 Open Container Format (OCF).", {
    x: 50,
    y: 740,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PDF to EPUB High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or non-PDF buffers with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await convertPdfToEpub(Buffer.alloc(0));
      },
      /Invalid or empty PDF input buffer/i
    );

    await assert.rejects(
      async () => {
        await convertPdfToEpub(Buffer.from("THIS_IS_NOT_A_VALID_PDF_BUFFER"));
      },
      /Invalid or corrupt PDF header/i
    );
  });

  it("converts a valid multi-page PDF into a compliant EPUB3 container archive", async () => {
    const pdfBuf = await createSamplePdfDocument();
    const result = await convertPdfToEpub(pdfBuf);

    assert.ok(result && result.length > 0, "Output EPUB buffer must not be empty");
    // Verify zip signature PK\x03\x04
    assert.equal(result[0], 0x50, "First byte must be P");
    assert.equal(result[1], 0x4b, "Second byte must be K");
    assert.equal(result[2], 0x03, "Third byte must be 0x03");
    assert.equal(result[3], 0x04, "Fourth byte must be 0x04");

    // Inspect archive with fflate
    const unzipped = unzipSync(new Uint8Array(result));

    // Verify mimetype entry
    const mimetypeBytes = unzipped["mimetype"];
    assert.ok(mimetypeBytes, "Archive must contain uncompressed mimetype file");
    const mimetypeText = strFromU8(mimetypeBytes).trim();
    assert.equal(mimetypeText, "application/epub+zip", "mimetype must equal application/epub+zip");

    // Verify container.xml
    const containerBytes = unzipped["META-INF/container.xml"];
    assert.ok(containerBytes, "Archive must contain META-INF/container.xml");
    const containerText = strFromU8(containerBytes);
    assert.match(containerText, /full-path="EPUB\/package\.opf"/i, "container.xml must point to package.opf");

    // Verify OPF package document
    const opfBytes = unzipped["EPUB/package.opf"];
    assert.ok(opfBytes, "Archive must contain EPUB/package.opf");
    const opfText = strFromU8(opfBytes);
    assert.match(opfText, /<package/i, "package.opf must contain <package> root element");
    assert.match(opfText, /<dc:title/i, "package.opf must contain Dublin Core title");

    // Verify navigation documents (EPUB3 nav.xhtml + EPUB2 toc.ncx)
    const navBytes = unzipped["EPUB/nav.xhtml"];
    assert.ok(navBytes, "Archive must contain EPUB3 EPUB/nav.xhtml");
    const ncxBytes = unzipped["EPUB/toc.ncx"];
    assert.ok(ncxBytes, "Archive must contain EPUB2 fallback EPUB/toc.ncx");

    // Verify chapter content
    const ch1Bytes = unzipped["EPUB/chapter_1.xhtml"];
    assert.ok(ch1Bytes, "Archive must contain at least EPUB/chapter_1.xhtml");
    const ch1Text = strFromU8(ch1Bytes);
    assert.match(ch1Text, /(Digital Publishing Architecture|High-Fidelity)/i, "Chapter 1 must contain text content");
  });

  it("handlePdfToEpub sets Content-Type application/epub+zip and RFC 5987 Content-Disposition", async () => {
    const pdfBuf = await createSamplePdfDocument();
    const capturedHeaders: Record<string, string> = {};
    let capturedBody: Buffer | null = null;

    const req = {
      file: {
        buffer: pdfBuf,
        originalname: "architecture whitepaper 2026.pdf",
      },
      headers: {},
    } as any;

    const res = {
      status() { return this; },
      set(key: string, value: string) {
        capturedHeaders[key] = value;
        return this;
      },
      send(data: Buffer) {
        capturedBody = data;
        return this;
      },
      json() { return this; },
    } as any;

    await handlePdfToEpub(req, res);

    assert.equal(capturedHeaders["Content-Type"], EPUB_MIME_TYPE);
    assert.match(
      capturedHeaders["Content-Disposition"] || "",
      /attachment;\s*filename="architecture whitepaper 2026\.epub"/i
    );
    assert.ok(capturedBody != null && (capturedBody as Buffer).length > 0);
  });

  it("ensures process isolation and cleans up ephemeral directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-epub-test-" + randomUUID());
    const customPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuf = await createSamplePdfDocument();
    const result = await convertPdfToEpub(pdfBuf, { pool: customPool });
    assert.ok(result.length > 0);

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned immediately upon success"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });
});
