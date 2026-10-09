import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { linearizePdf } from "./pdf-linearize.js";

describe("PDF Linearize Utility (TDD)", () => {
  it("returns original buffer if input is empty or invalid", async () => {
    const input = Buffer.from("invalid-pdf-data");
    const result = await linearizePdf(input);
    assert.deepStrictEqual(result, input);
  });

  it("handles empty buffer gracefully without throwing", async () => {
    const input = Buffer.alloc(0);
    const result = await linearizePdf(input);
    assert.deepStrictEqual(result, input);
  });
});
