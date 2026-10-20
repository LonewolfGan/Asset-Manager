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

  it("formats ordered lists with index numbers and unordered lists with bullets", () => {
    const md = "1. First step\n2. Second step\n\n- Bullet item A\n- Bullet item B";
    const paragraphs = markdownToDocxParagraphs(md);
    assert.strictEqual(paragraphs.length, 4);

    const p0Json = JSON.stringify(paragraphs[0]);
    assert.strictEqual(p0Json.includes("1.  First step"), true);

    const p1Json = JSON.stringify(paragraphs[1]);
    assert.strictEqual(p1Json.includes("2.  Second step"), true);

    const p2Json = JSON.stringify(paragraphs[2]);
    assert.strictEqual(p2Json.includes("Bullet item A"), true);
  });

  it("converts horizontal rules into separator paragraphs", () => {
    const md = "Before\n\n---\n\nAfter";
    const paragraphs = markdownToDocxParagraphs(md);
    assert.strictEqual(paragraphs.length, 3);
  });

  describe("RFC 5987 Content-Disposition for Text & Docx conversions", () => {
    it("generates safe attachment header for accented docx documents", async () => {
      const { buildContentDisposition } = await import("../convert/convert-image.js");
      const disposition = buildContentDisposition("procès_verbal_séance.md", "docx");
      assert.strictEqual(disposition.includes('filename="proc_s_verbal_s_ance.docx"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''proc%C3%A8s_verbal_s%C3%A9ance.docx"), true);
    });

    it("generates safe attachment header for multi-dot markdown documents", async () => {
      const { buildContentDisposition } = await import("../convert/convert-image.js");
      const disposition = buildContentDisposition("notes.reunion.v2.docx", "md");
      assert.strictEqual(disposition.includes('filename="notes.reunion.v2.md"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''notes.reunion.v2.md"), true);
    });
  });
});
