import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isValidTargetFormat, isValidInputExt, MIME_MAP } from "../../lib/document-validation.js";
import { buildContentDisposition } from "../convert/convert-image.js";

describe("Universal Document Conversion (TDD)", () => {
  describe("Document Validation & MIME mappings", () => {
    it("validates allowed target formats", () => {
      assert.strictEqual(isValidTargetFormat("pdf"), true);
      assert.strictEqual(isValidTargetFormat("docx"), true);
      assert.strictEqual(isValidTargetFormat("odt"), true);
      assert.strictEqual(isValidTargetFormat("rtf"), true);
      assert.strictEqual(isValidTargetFormat("txt"), true);
      assert.strictEqual(isValidTargetFormat("html"), true);
      assert.strictEqual(isValidTargetFormat("epub"), true);
      assert.strictEqual(isValidTargetFormat("pptx"), true);
      assert.strictEqual(isValidTargetFormat("xlsx"), true);

      assert.strictEqual(isValidTargetFormat("exe"), false);
      assert.strictEqual(isValidTargetFormat("../../etc"), false);
      assert.strictEqual(isValidTargetFormat(""), false);
    });

    it("validates input extensions safely", () => {
      assert.strictEqual(isValidInputExt("docx"), true);
      assert.strictEqual(isValidInputExt("doc"), true);
      assert.strictEqual(isValidInputExt("xlsx"), true);
      assert.strictEqual(isValidInputExt("pptx"), true);
      assert.strictEqual(isValidInputExt("odt"), true);
      assert.strictEqual(isValidInputExt("rtf"), true);
      assert.strictEqual(isValidInputExt("txt"), true);

      assert.strictEqual(isValidInputExt("../evil"), false);
      assert.strictEqual(isValidInputExt("tool;sh"), false);
      assert.strictEqual(isValidInputExt(""), false);
    });

    it("maps all supported document formats to compliant MIME types", () => {
      assert.strictEqual(MIME_MAP.pdf, "application/pdf");
      assert.strictEqual(MIME_MAP.docx, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      assert.strictEqual(MIME_MAP.odt, "application/vnd.oasis.opendocument.text");
      assert.strictEqual(MIME_MAP.rtf, "application/rtf");
      assert.strictEqual(MIME_MAP.txt, "text/plain; charset=utf-8");
      assert.strictEqual(MIME_MAP.html, "text/html; charset=utf-8");
      assert.strictEqual(MIME_MAP.epub, "application/epub+zip");
    });
  });

  describe("RFC 5987 Content-Disposition Headers", () => {
    it("generates safe attachment header for accented documents", () => {
      const header = buildContentDisposition("compte_rendu_réunion_2024.odt", "pdf");
      assert.strictEqual(header.includes('filename="compte_rendu_r_union_2024.pdf"'), true);
      assert.strictEqual(header.includes("filename*=UTF-8''compte_rendu_r%C3%A9union_2024.pdf"), true);
    });

    it("generates safe attachment header for multi-dot filenames", () => {
      const header = buildContentDisposition("document.v1.2.final.docx", "odt");
      assert.strictEqual(header.includes('filename="document.v1.2.final.odt"'), true);
      assert.strictEqual(header.includes("filename*=UTF-8''document.v1.2.final.odt"), true);
    });
  });

  describe("sendDocument response helper", () => {
    it("sets correct MIME, RFC 5987 headers, and sends buffer", async () => {
      const { sendDocument } = await import("./document-convert.js");

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

      const testBuffer = Buffer.from("document-binary-content");
      sendDocument(mockRes, testBuffer, "synthèse_annuelle.docx", "pdf");

      assert.strictEqual(headers["Content-Type"], "application/pdf");
      assert.strictEqual(headers["Cache-Control"], "no-store");
      assert.strictEqual(headers["Content-Disposition"].includes('filename="synth_se_annuelle.pdf"'), true);
      assert.strictEqual(headers["Content-Disposition"].includes("filename*="), true);
      assert.strictEqual(sentBuffer, testBuffer);
    });

    it("normalizes targetFormat with leading dot (e.g. .docx or .pdf)", async () => {
      const { sendDocument } = await import("./document-convert.js");

      let headers: Record<string, string> = {};
      const mockRes = {
        set(h: Record<string, string>) {
          headers = { ...headers, ...h };
          return this;
        },
        send() {
          return this;
        },
      } as any;

      sendDocument(mockRes, Buffer.from("test"), "document.odt", ".docx");

      assert.strictEqual(headers["Content-Type"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      assert.strictEqual(headers["Content-Disposition"].includes('filename="document.docx"'), true);
      assert.strictEqual(headers["Content-Disposition"].includes("..docx"), false);
    });
  });
});
