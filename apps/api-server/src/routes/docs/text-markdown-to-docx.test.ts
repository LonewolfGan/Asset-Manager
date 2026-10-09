import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { HeadingLevel } from "docx";
import { markdownToDocxParagraphs } from "./text-markdown-to-docx.js";

describe("Markdown to DOCX AST Parsing (TDD)", () => {
  it("does not convert regular paragraph into a heading when text matches a heading", () => {
    const md = "# Introduction\n\nIntroduction\n\nMore regular text";
    const paragraphs = markdownToDocxParagraphs(md);

    assert.strictEqual(paragraphs.length, 3);

    // Paragraph 1: Heading 1 style is applied
    const p1Json = JSON.stringify(paragraphs[0]);
    assert.strictEqual(p1Json.includes("Heading1"), true);

    // Paragraph 2: Normal body paragraph with matching text - MUST NOT contain Heading1 style
    const p2Json = JSON.stringify(paragraphs[1]);
    assert.strictEqual(p2Json.includes("Heading1"), false);

    // Paragraph 3: Normal body paragraph
    const p3Json = JSON.stringify(paragraphs[2]);
    assert.strictEqual(p3Json.includes("Heading1"), false);
  });

  it("handles empty markdown gracefully without throwing", () => {
    const paragraphs = markdownToDocxParagraphs("");
    assert.strictEqual(paragraphs.length, 1);
  });
});
