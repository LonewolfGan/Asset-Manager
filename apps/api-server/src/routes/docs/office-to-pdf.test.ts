import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { type Response } from "express";
import { sendPdf } from "./send-pdf.js";
import { buildContentDisposition } from "../convert/convert-image.js";

describe("Office to PDF & Document Conversion (TDD)", () => {
  describe("sendPdf", () => {
    it("sets RFC 5987 / RFC 6266 headers and sends PDF buffer", async () => {
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
      } as unknown as Response;

      const testBuffer = Buffer.from("%PDF-1.4 test");
      const filename = "rapport_annuel_décembre.final.pdf";

      await sendPdf(mockRes, testBuffer, filename);

      assert.strictEqual(headers["Content-Type"], "application/pdf");
      assert.strictEqual(headers["Cache-Control"], "no-store");
      assert.strictEqual(headers["Content-Disposition"].includes('filename="rapport_annuel_d'), true);
      assert.strictEqual(headers["Content-Disposition"].includes("filename*="), true);
      assert.strictEqual(sentBuffer, testBuffer);
    });
  });

  describe("buildContentDisposition for Office documents", () => {
    it("formats attachment headers for presentation zip archives", () => {
      const disposition = buildContentDisposition("conférence_2024.final_slides.zip", "zip");
      assert.strictEqual(disposition.includes('filename="conf_rence_2024.final_slides.zip"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''conf%C3%A9rence"), true);
    });
  });
});
