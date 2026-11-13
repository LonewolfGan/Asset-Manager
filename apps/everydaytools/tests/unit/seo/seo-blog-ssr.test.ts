import { describe, it, expect } from "vitest";
import { generateBlogPostHtml } from "../../../src/lib/seo-blog-ssr";

describe("SEO Blog Static Site Generator (TDD)", () => {
  it("generates complete semantic HTML for an English blog post with schema and tool cross-link", () => {
    const html = generateBlogPostHtml("how-to-convert-pdf-to-word", "en");
    expect(html).not.toBeNull();
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("<html lang=\"en\">");
    expect(html).toContain("How to Convert a PDF to Word");
    expect(html).toContain("https://everydaytools.qzz.io/en/blog/how-to-convert-pdf-to-word");
    expect(html).toContain("https://everydaytools.qzz.io/fr/blog/comment-convertir-pdf-en-word");
    expect(html).toContain("application/ld+json");
    expect(html).toContain("\"@type\":\"Article\"");
    expect(html).toContain("href=\"/convert-pdf-to-word\"");
  });

  it("generates complete semantic HTML for a French blog post with reciprocal hreflang", () => {
    const html = generateBlogPostHtml("comment-convertir-pdf-en-word", "fr");
    expect(html).not.toBeNull();
    expect(html).toContain("<html lang=\"fr\">");
    expect(html).toContain("Comment convertir un PDF en Word");
    expect(html).toContain("https://everydaytools.qzz.io/fr/blog/comment-convertir-pdf-en-word");
    expect(html).toContain("https://everydaytools.qzz.io/en/blog/how-to-convert-pdf-to-word");
  });

  it("returns null for unknown post slug", () => {
    const html = generateBlogPostHtml("non-existent-blog-slug-404", "en");
    expect(html).toBeNull();
  });
});
