import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parsePageRanges, pdfBaseName } from "./guards.js";

describe("PDF Guards & Utilities (TDD)", () => {
  describe("pdfBaseName", () => {
    it("strips .pdf extension cleanly", () => {
      assert.strictEqual(pdfBaseName("document.pdf"), "document");
      assert.strictEqual(pdfBaseName("report.2024.final.pdf"), "report.2024.final");
      assert.strictEqual(pdfBaseName(undefined), "document");
    });
  });

  describe("parsePageRanges", () => {
    it("parses single pages and valid ranges correctly", () => {
      const ranges = parsePageRanges("1, 3-5", 10);
      assert.deepStrictEqual(ranges, [[0], [2, 3, 4]]);
    });

    it("ignores completely out-of-bounds ranges like 10-20 for 5 pages", () => {
      const ranges = parsePageRanges("10-20", 5);
      assert.deepStrictEqual(ranges, []);
    });

    it("clamps partially out-of-bounds ranges to maxPages", () => {
      const ranges = parsePageRanges("3-10", 5);
      assert.deepStrictEqual(ranges, [[2, 3, 4]]);
    });

    it("returns empty array for invalid or empty strings", () => {
      assert.deepStrictEqual(parsePageRanges("", 5), []);
      assert.deepStrictEqual(parsePageRanges("invalid-string", 5), []);
    });
  });
});
