import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { scrubText, INVISIBLE_CHARS_REGEX, REPLACEMENT_MAP } from "./text.js";

describe("Text Scrub & Humanizer Engine (TDD)", () => {
  test("removes zero-width and invisible Unicode characters accurately", () => {
    // Zero-width space, ZWNJ, ZWJ, BOM, Word Joiner, Soft Hyphen, LRM, RLM
    const raw = "AI\u200BGenerated\u200C\u200DText\uFEFFWith\u2060Hidden\u00ADWater\u200Emarks\u200F";
    const result = scrubText(raw, { invisibles: true, stylistic: false });

    assert.equal(result.cleaned, "AIGeneratedTextWithHiddenWatermarks");
    assert.equal(result.removedCount, 8);
  });

  test("replaces AI clichés and preserves capitalization", () => {
    const raw = "In conclusion, it is important to note that this is crucial.";
    const result = scrubText(raw, { invisibles: false, stylistic: true });

    assert.ok(!result.cleaned.includes("In conclusion"));
    assert.ok(!result.cleaned.includes("it is important to note"));
    assert.match(result.cleaned, /^[A-Z]/);
  });

  test("normalizes curly smart quotes and cleans orphan punctuation", () => {
    // Smart apostrophe: in today’s world
    const rawSmartQuote = "In today’s world, we must adapt.";
    const resSmart = scrubText(rawSmartQuote, { invisibles: false, stylistic: true });
    assert.ok(!resSmart.cleaned.toLowerCase().includes("in today's world"));

    // Cliché mapped to "" leading to orphan comma
    const rawOrphan = "Needless to say, the operation succeeded.";
    const resOrphan = scrubText(rawOrphan, { invisibles: false, stylistic: true });
    assert.equal(resOrphan.cleaned, "The operation succeeded.");
  });

  test("handles empty string gracefully", () => {
    const result = scrubText("", { invisibles: true, stylistic: true });
    assert.equal(result.cleaned, "");
    assert.equal(result.removedCount, 0);
  });

  test("scrubText normalizes excessive whitespace cleanly", () => {
    const raw = "Word   one \u200B   word   two";
    const result = scrubText(raw, { invisibles: true, stylistic: false });
    assert.equal(result.cleaned, "Word one word two");
  });

  test("has comprehensive cliché definitions matching Wikipedia guidelines", () => {
    assert.ok("delve into" in REPLACEMENT_MAP);
    assert.ok("testament to" in REPLACEMENT_MAP);
    assert.ok("furthermore" in REPLACEMENT_MAP);
    assert.ok("moreover" in REPLACEMENT_MAP);
  });
});
