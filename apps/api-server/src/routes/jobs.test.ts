import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isValidTargetFormat } from "../lib/document-validation.js";

describe("Jobs Target Format Validation (TDD)", () => {
  it("rejects invalid target formats at queue ingestion boundary", () => {
    assert.strictEqual(isValidTargetFormat(""), false);
    assert.strictEqual(isValidTargetFormat("--flag"), false);
    assert.strictEqual(isValidTargetFormat("invalid"), false);
  });

  it("accepts valid target formats at queue ingestion boundary", () => {
    assert.strictEqual(isValidTargetFormat("pdf"), true);
    assert.strictEqual(isValidTargetFormat("docx"), true);
  });
});
