import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { convertWithLibreOffice, getLibreOfficePdfExportFilter } from "./libreoffice.js";

describe("LibreOffice Validation and Normalization (TDD)", () => {
  it("rejects unsupported target format before launching soffice", async () => {
    const dummyBuffer = Buffer.from("dummy data");
    await assert.rejects(
      async () => {
        await convertWithLibreOffice(dummyBuffer, "docx", "--headless");
      },
      {
        message: /Unsupported target format/,
      },
    );
  });

  it("rejects invalid input extension before launching soffice", async () => {
    const dummyBuffer = Buffer.from("dummy data");
    await assert.rejects(
      async () => {
        await convertWithLibreOffice(dummyBuffer, "../malicious", "pdf");
      },
      {
        message: /Invalid input extension/,
      },
    );
  });
});

describe("LibreOffice PDF Export Filters (TDD)", () => {
  it("returns writer_pdf_Export for Writer document types", () => {
    assert.strictEqual(getLibreOfficePdfExportFilter("docx"), "pdf:writer_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("odt"), "pdf:writer_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("rtf"), "pdf:writer_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("epub"), "pdf:writer_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("txt"), "pdf:writer_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("html"), "pdf:writer_pdf_Export");
  });

  it("returns calc_pdf_Export for Calc spreadsheet types", () => {
    assert.strictEqual(getLibreOfficePdfExportFilter("xlsx"), "pdf:calc_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("xls"), "pdf:calc_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("ods"), "pdf:calc_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("csv"), "pdf:calc_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("tsv"), "pdf:calc_pdf_Export");
  });

  it("returns impress_pdf_Export for Impress presentation types", () => {
    assert.strictEqual(getLibreOfficePdfExportFilter("pptx"), "pdf:impress_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("ppt"), "pdf:impress_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("odp"), "pdf:impress_pdf_Export");
  });

  it("returns draw_pdf_Export for Draw vector graphic types", () => {
    assert.strictEqual(getLibreOfficePdfExportFilter("odg"), "pdf:draw_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("fodg"), "pdf:draw_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("otg"), "pdf:draw_pdf_Export");
  });

  it("normalizes extension with leading dot and case insensitivity", () => {
    assert.strictEqual(getLibreOfficePdfExportFilter(".DOCX"), "pdf:writer_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter(".XLSX"), "pdf:calc_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter(".PPTX"), "pdf:impress_pdf_Export");
    assert.strictEqual(getLibreOfficePdfExportFilter("UNKNOWN_FORMAT"), "pdf:writer_pdf_Export");
  });

  it("appends PDF/A-2b filter config when pdfa is true or 'PDF/A-2b'", () => {
    const expected = 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"}}';
    assert.strictEqual(getLibreOfficePdfExportFilter("docx", true), expected);
    assert.strictEqual(getLibreOfficePdfExportFilter("docx", "PDF/A-2b"), expected);

    const calcExpected = 'pdf:calc_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"}}';
    assert.strictEqual(getLibreOfficePdfExportFilter("xlsx", "PDF/A-2b"), calcExpected);

    const impressExpected = 'pdf:impress_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"2"}}';
    assert.strictEqual(getLibreOfficePdfExportFilter("pptx", true), impressExpected);
  });

  it("appends PDF/A-1b filter config when pdfa is 'PDF/A-1b'", () => {
    const expected = 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"1"}}';
    assert.strictEqual(getLibreOfficePdfExportFilter("docx", "PDF/A-1b"), expected);
  });

  it("appends PDF/A-3b filter config when pdfa is 'PDF/A-3b'", () => {
    const expected = 'pdf:writer_pdf_Export:{"SelectPdfVersion":{"type":"long","value":"3"}}';
    assert.strictEqual(getLibreOfficePdfExportFilter("docx", "PDF/A-3b"), expected);
  });

  it("convertWithLibreOffice forwards options to Gotenberg path", async () => {
    const originalFetch = globalThis.fetch;
    let interceptedUrl = "";
    let appendedPdfa: any = null;
    let appendedLandscape: any = null;

    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      interceptedUrl = url;
      const body = init?.body as FormData;
      if (body) {
        appendedPdfa = body.get("pdfa");
        appendedLandscape = body.get("landscape");
      }
      return new Response(Buffer.from("%PDF-1.7 mock output"), {
        status: 200,
        headers: { "Content-Type": "application/pdf" },
      });
    }) as any;

    try {
      const dummyBuf = Buffer.from("dummy docx content");
      const out = await convertWithLibreOffice(dummyBuf, "docx", "pdf", {
        pdfa: true,
        landscape: true,
      });

      assert.ok(interceptedUrl.includes("/forms/libreoffice/convert"));
      assert.strictEqual(appendedPdfa, "PDF/A-2b");
      assert.strictEqual(appendedLandscape, "true");
      assert.ok(out.length > 0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});


