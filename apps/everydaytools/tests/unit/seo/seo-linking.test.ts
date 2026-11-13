import { describe, it, expect } from "vitest";
import {
  getBlogPostsForTool,
  getRelatedToolsForBlogPost,
  buildGuidesSectionHtml,
  buildRelatedToolsSectionHtml,
} from "../../../src/lib/seo-linking";
import { SEO_TOOLS } from "../../../src/config/tools-seo-data";

describe("Semantic Internal Linking & Topic Clusters (TDD)", () => {
  it("resolves related blog posts for key tools bidirectionally", () => {
    const pdfToWordPosts = getBlogPostsForTool("pdf-to-word");
    expect(pdfToWordPosts.length).toBeGreaterThan(0);
    const post = pdfToWordPosts[0];
    expect(post.slug.en).toBe("how-to-convert-pdf-to-word");
    expect(post.slug.fr).toBe("comment-convertir-pdf-en-word");
  });

  it("resolves related tools for a given blog post slug", () => {
    const relatedTools = getRelatedToolsForBlogPost("how-to-convert-pdf-to-word");
    expect(relatedTools.length).toBeGreaterThan(0);
    expect(relatedTools[0].internalSlug).toBe("pdf-to-word");
  });

  it("builds semantic guides section HTML with descriptive anchors (no generic 'click here' or AI filler)", () => {
    const tool = SEO_TOOLS.find((t) => t.internalSlug === "pdf-to-word")!;
    const htmlEn = buildGuidesSectionHtml(tool, "en");
    expect(htmlEn).toContain("/en/blog/how-to-convert-pdf-to-word");
    expect(htmlEn).toContain('class="section guides-section"');
    expect(htmlEn).not.toContain("click here");
    expect(htmlEn).not.toContain("seamless");

    const htmlFr = buildGuidesSectionHtml(tool, "fr");
    expect(htmlFr).toContain("/fr/blog/comment-convertir-pdf-en-word");
    expect(htmlFr).toContain("Guides &amp; Tutoriels Détaillés");
    expect(htmlFr).not.toContain("cliquez ici");
  });

  it("builds related tools section HTML correctly with reciprocal URLs", () => {
    const tool = SEO_TOOLS.find((t) => t.internalSlug === "pdf-to-word")!;
    const htmlEn = buildRelatedToolsSectionHtml(tool, "en");
    expect(htmlEn).toContain("/en/");
    expect(htmlEn).toContain("related-card");

    const htmlFr = buildRelatedToolsSectionHtml(tool, "fr");
    expect(htmlFr).toContain("/fr/");
    expect(htmlFr).toContain("Outils connexes");
  });
});
