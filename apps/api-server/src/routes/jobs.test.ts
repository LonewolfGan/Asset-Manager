import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isValidTargetFormat, isValidInputExt } from "../lib/document-validation.js";
import { isValidJobId } from "./jobs.js";

describe("Jobs Validation & Security (TDD)", () => {
  it("rejects invalid target formats at queue ingestion boundary", () => {
    assert.strictEqual(isValidTargetFormat(""), false);
    assert.strictEqual(isValidTargetFormat("--flag"), false);
    assert.strictEqual(isValidTargetFormat("invalid"), false);
  });

  it("accepts valid target formats at queue ingestion boundary", () => {
    assert.strictEqual(isValidTargetFormat("pdf"), true);
    assert.strictEqual(isValidTargetFormat("docx"), true);
    assert.strictEqual(isValidTargetFormat("xlsx"), true);
    assert.strictEqual(isValidTargetFormat("pptx"), true);
  });

  it("validates input extensions correctly", () => {
    assert.strictEqual(isValidInputExt("docx"), true);
    assert.strictEqual(isValidInputExt(".docx"), true);
    assert.strictEqual(isValidInputExt("pdf"), true);
    assert.strictEqual(isValidInputExt(""), false);
    assert.strictEqual(isValidInputExt("sh"), true); // length 2
    assert.strictEqual(isValidInputExt("a"), false); // too short
    assert.strictEqual(isValidInputExt("superlongextensiontoolong"), false);
  });

  it("accepts valid UUID and alphanumeric job IDs", () => {
    assert.strictEqual(isValidJobId("45f7c35b-c2e0-496a-93be-17ceca071852"), true);
    assert.strictEqual(isValidJobId("job_123456"), true);
    assert.strictEqual(isValidJobId("job-abc-789"), true);
  });

  it("rejects path traversal and malicious job IDs", () => {
    assert.strictEqual(isValidJobId("../"), false);
    assert.strictEqual(isValidJobId("../../etc/passwd"), false);
    assert.strictEqual(isValidJobId("..\\windows\\system32"), false);
    assert.strictEqual(isValidJobId("job/sub"), false);
    assert.strictEqual(isValidJobId("job\0null"), false);
    assert.strictEqual(isValidJobId(""), false);
    assert.strictEqual(isValidJobId("   "), false);
    assert.strictEqual(isValidJobId("a".repeat(65)), false);
  });
});

