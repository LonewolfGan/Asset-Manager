import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { convertWithLibreOffice } from "./libreoffice.js";

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
