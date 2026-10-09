import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ALLOWED_DOCUMENT_FORMATS,
  isValidTargetFormat,
  isValidInputExt,
} from "./document-validation.js";

describe("Document Conversion Target Format Allowlist (TDD)", () => {
  it("allows all supported document formats", () => {
    const validFormats = ["pdf", "docx", "doc", "odt", "rtf", "txt", "html", "epub", "pptx", "xlsx"];
    for (const fmt of validFormats) {
      assert.strictEqual(isValidTargetFormat(fmt), true, `Expected ${fmt} to be valid`);
      assert.strictEqual(ALLOWED_DOCUMENT_FORMATS.has(fmt), true);
    }
  });

  it("rejects CLI flag injection attempts", () => {
    assert.strictEqual(isValidTargetFormat("--headless"), false);
    assert.strictEqual(isValidTargetFormat("-v"), false);
    assert.strictEqual(isValidTargetFormat("--convert-to"), false);
    assert.strictEqual(isValidTargetFormat("--outdir"), false);
  });

  it("rejects path traversal and script characters", () => {
    assert.strictEqual(isValidTargetFormat("../evil"), false);
    assert.strictEqual(isValidTargetFormat("pdf/../../etc"), false);
    assert.strictEqual(isValidTargetFormat("pdf;rm"), false);
    assert.strictEqual(isValidTargetFormat("pdf|cat"), false);
  });

  it("rejects unsupported extensions", () => {
    assert.strictEqual(isValidTargetFormat("exe"), false);
    assert.strictEqual(isValidTargetFormat("sh"), false);
    assert.strictEqual(isValidTargetFormat("php"), false);
    assert.strictEqual(isValidTargetFormat(""), false);
  });

  it("validates input extension properly", () => {
    assert.strictEqual(isValidInputExt("docx"), true);
    assert.strictEqual(isValidInputExt(".docx"), true);
    assert.strictEqual(isValidInputExt("--flag"), false);
    assert.strictEqual(isValidInputExt("invalid/path"), false);
  });
});
